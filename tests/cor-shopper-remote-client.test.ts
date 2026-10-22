import { describe, expect, it, vi } from "vitest";
import {
  CorShopperClientError,
  CorShopperRemoteClient,
  type CorShopperCredentialProvider,
} from "../src/integration/cor-shopper-remote-client";

function credentials(value = "short-lived-demo-token"): CorShopperCredentialProvider {
  return { getBearerCredential: vi.fn(async () => value) };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

describe("COR Shopper remote client", () => {
  it("sends recommendation requests to the versioned COR API with a short-lived bearer", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ recommendations: [] }));
    const credentialProvider = credentials();
    const client = new CorShopperRemoteClient({
      baseUrl: "https://cor.example.test",
      credentials: credentialProvider,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await expect(client.recommend({ contractVersion: "1.0.0", requestId: "req-1" }))
      .resolves.toEqual({ recommendations: [] });

    expect(credentialProvider.getBearerCredential).toHaveBeenCalledOnce();
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://cor.example.test/shopper/v1/recommendations");
    expect(init.method).toBe("POST");
    expect(new Headers(init.headers).get("authorization")).toBe("Bearer short-lived-demo-token");
    expect(new Headers(init.headers).get("content-type")).toBe("application/json");
    expect(init.credentials).toBe("omit");
    expect(init.redirect).toBe("error");
  });

  it.each([
    ["comparison", "compare", "/shopper/v1/comparisons"],
    ["handoff", "handoff", "/shopper/v1/handoffs"],
  ] as const)("routes %s calls to the expected endpoint", async (_label, method, path) => {
    const fetchImpl = vi.fn(async () => jsonResponse({ ok: true }));
    const client = new CorShopperRemoteClient({
      baseUrl: "https://cor.example.test",
      credentials: credentials(),
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    if (method === "compare") await client.compare({ requestId: "compare-1" });
    else await client.handoff({ requestId: "handoff-1" });

    expect(fetchImpl.mock.calls[0]?.[0]).toBe(`https://cor.example.test${path}`);
  });

  it("rejects insecure or credential-bearing API URLs", () => {
    for (const baseUrl of [
      "http://cor.example.test",
      "https://user:password@cor.example.test",
      "https://cor.example.test/path",
      "https://cor.example.test/?token=secret",
    ]) {
      expect(() => new CorShopperRemoteClient({ baseUrl, credentials: credentials() }))
        .toThrowError(new CorShopperClientError("cor_client_configuration_invalid"));
    }
  });

  it("rejects oversized requests before credential retrieval or network access", async () => {
    const fetchImpl = vi.fn();
    const credentialProvider = credentials();
    const client = new CorShopperRemoteClient({
      baseUrl: "https://cor.example.test",
      credentials: credentialProvider,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      maxRequestBytes: 64,
    });

    await expect(client.recommend({ text: "x".repeat(100) }))
      .rejects.toMatchObject({ code: "cor_request_too_large" });
    expect(credentialProvider.getBearerCredential).not.toHaveBeenCalled();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("fails closed when no short-lived credential is available", async () => {
    const fetchImpl = vi.fn();
    const client = new CorShopperRemoteClient({
      baseUrl: "https://cor.example.test",
      credentials: { getBearerCredential: async () => { throw new Error("private detail"); } },
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await expect(client.recommend({ requestId: "req-2" }))
      .rejects.toMatchObject({ code: "cor_credential_unavailable" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("does not expose upstream error bodies and cancels the error response stream", async () => {
    let cancelled = false;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) { controller.enqueue(new TextEncoder().encode("database password leaked")); },
      cancel() { cancelled = true; },
    }, { highWaterMark: 0 });
    const fetchImpl = vi.fn(async () => new Response(body, {
      status: 500,
      headers: { "content-type": "text/plain" },
    }));
    const client = new CorShopperRemoteClient({
      baseUrl: "https://cor.example.test",
      credentials: credentials(),
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await expect(client.recommend({ requestId: "req-3" }))
      .rejects.toMatchObject({ code: "cor_service_unavailable" });
    expect(cancelled).toBe(true);
  });

  it("rejects non-JSON, malformed, and oversized responses", async () => {
    const cases = [
      () => new Response("ok", { headers: { "content-type": "text/plain" } }),
      () => new Response("{", { headers: { "content-type": "application/json" } }),
      () => new Response(JSON.stringify({ text: "x".repeat(200) }), {
        headers: { "content-type": "application/json" },
      }),
    ];

    for (const makeResponse of cases) {
      const client = new CorShopperRemoteClient({
        baseUrl: "https://cor.example.test",
        credentials: credentials(),
        fetchImpl: vi.fn(async () => makeResponse()) as unknown as typeof fetch,
        maxResponseBytes: 100,
      });
      await expect(client.recommend({ requestId: "req-4" }))
        .rejects.toMatchObject({ code: "cor_response_invalid" });
    }
  });

  it("cancels a chunked response as soon as it exceeds the byte limit", async () => {
    const encoder = new TextEncoder();
    let chunksEmitted = 0;
    let cancelled = false;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        chunksEmitted += 1;
        if (chunksEmitted === 1) controller.enqueue(encoder.encode('{"ok":'));
        else if (chunksEmitted === 2) controller.enqueue(encoder.encode('"x".repeat(80)}'));
        else controller.close();
      },
      cancel() { cancelled = true; },
    }, { highWaterMark: 0 });
    const client = new CorShopperRemoteClient({
      baseUrl: "https://cor.example.test",
      credentials: credentials(),
      fetchImpl: vi.fn(async () => ({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        body,
      } as Response)) as unknown as typeof fetch,
      maxResponseBytes: 16,
    });

    await expect(client.recommend({ requestId: "req-stream-limit" }))
      .rejects.toMatchObject({ code: "cor_response_invalid" });
    expect(cancelled).toBe(true);
    expect(chunksEmitted).toBeLessThan(4);
  });

  it("rejects response stream failures with a stable sanitized error", async () => {
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('{"partial":'));
        controller.error(new Error("private upstream detail"));
      },
    });
    const client = new CorShopperRemoteClient({
      baseUrl: "https://cor.example.test",
      credentials: credentials(),
      fetchImpl: vi.fn(async () => new Response(body, {
        headers: { "content-type": "application/json" },
      })) as unknown as typeof fetch,
    });

    await expect(client.recommend({ requestId: "req-stream-error" }))
      .rejects.toMatchObject({ code: "cor_response_invalid" });
  });

  it("times out while a credential provider is pending", async () => {
    const fetchImpl = vi.fn();
    const client = new CorShopperRemoteClient({
      baseUrl: "https://cor.example.test",
      credentials: { getBearerCredential: () => new Promise<string>(() => {}) },
      fetchImpl: fetchImpl as unknown as typeof fetch,
      timeoutMs: 10,
    });

    await expect(client.recommend({ requestId: "req-credential-timeout" }))
      .rejects.toMatchObject({ code: "cor_request_timeout" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("maps aborts to a stable timeout error", async () => {
    const fetchImpl = vi.fn((_input: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
      }));
    const client = new CorShopperRemoteClient({
      baseUrl: "https://cor.example.test",
      credentials: credentials(),
      fetchImpl: fetchImpl as unknown as typeof fetch,
      timeoutMs: 10,
    });

    await expect(client.recommend({ requestId: "req-5" }))
      .rejects.toMatchObject({ code: "cor_request_timeout" });
  });
  it("allows a timeout long enough for a free Render cold start", async () => {
    const client = new CorShopperRemoteClient({
      baseUrl: "https://cor.example.test",
      credentials: credentials(),
      fetchImpl: vi.fn(async () => jsonResponse({ ok: true })) as unknown as typeof fetch,
      timeoutMs: 60_000,
    });

    await expect(client.recommend({ requestId: "req-cold-start" })).resolves.toEqual({ ok: true });
  });

});
