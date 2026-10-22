import { describe, expect, it } from "vitest";
import { CorShopperDemoCredentialProvider } from "../src/integration/cor-shopper-demo-credential-provider";
import { getCompositionModeError } from "../src/app/composition/composition-mode";

const credential = "eyJhbGciOiJIUzI1NiJ9.eyJkZW1vT25seSI6dHJ1ZX0.signature";

function fetchWith(body: unknown, status = 200): typeof fetch {
  return (async () => new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  })) as typeof fetch;
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    contractVersion: "1.0.0",
    credentialType: "short_lived_demo_bearer",
    credential,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    demoOnly: true,
    ...overrides,
  };
}

describe("COR demo credential provider", () => {
  it("accepts only a live, explicitly demo-only, short-lived credential", async () => {
    const provider = new CorShopperDemoCredentialProvider(
      "https://cor.example",
      fetchWith(validBody()),
    );
    await expect(provider.getBearerCredential(new AbortController().signal)).resolves.toBe(credential);
  });

  it("uses a header-free GET for Safari-compatible CORS behavior", async () => {
    let observedUrl = "";
    let observedInit: RequestInit | undefined;
    const provider = new CorShopperDemoCredentialProvider(
      "https://cor.example",
      (async (input: RequestInfo | URL, init?: RequestInit) => {
        observedUrl = String(input);
        observedInit = init;
        return new Response(JSON.stringify(validBody()), {
          headers: { "content-type": "application/json; charset=utf-8" },
        });
      }) as typeof fetch,
    );
    await expect(provider.getBearerCredential(new AbortController().signal)).resolves.toBe(credential);
    expect(observedUrl).toBe("https://cor.example/shopper/v1/demo-session");
    expect(observedInit?.method).toBe("GET");
    expect(observedInit?.headers).toBeUndefined();
    expect(observedInit?.credentials).toBe("omit");
  });

  it("rejects a credential response redirected to a different origin", async () => {
    const response = new Response(JSON.stringify(validBody()), {
      headers: { "content-type": "application/json; charset=utf-8" },
    });
    Object.defineProperty(response, "url", { value: "https://other.example/demo-session" });
    const provider = new CorShopperDemoCredentialProvider(
      "https://cor.example",
      (async () => response) as typeof fetch,
    );
    await expect(provider.getBearerCredential(new AbortController().signal))
      .rejects.toThrow("cor_demo_credential_network_error");
  });

  it("uses the CORS-readable liveness endpoint to distinguish a blocked session from an unreachable host", async () => {
    let calls = 0;
    let probeUrl = "";
    let probeInit: RequestInit | undefined;
    const provider = new CorShopperDemoCredentialProvider(
      "https://cor.example",
      (async (input: RequestInfo | URL, init?: RequestInit) => {
        calls += 1;
        if (calls === 1) throw new TypeError("browser CORS failure");
        probeUrl = String(input);
        probeInit = init;
        return new Response(JSON.stringify({ status: "alive" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }) as typeof fetch,
    );
    await expect(provider.getBearerCredential(new AbortController().signal))
      .rejects.toThrow("cor_demo_credential_cors_blocked");
    expect(calls).toBe(2);
    expect(probeUrl).toBe("https://cor.example/health/live");
    expect(probeInit?.mode).toBeUndefined();
  });

  it("reports a distinct diagnostic when both the session request and reachability probe fail", async () => {
    let calls = 0;
    const provider = new CorShopperDemoCredentialProvider(
      "https://cor.example",
      (async () => {
        calls += 1;
        throw new TypeError("private network detail");
      }) as typeof fetch,
    );
    await expect(provider.getBearerCredential(new AbortController().signal))
      .rejects.toThrow("cor_demo_credential_probe_failed");
    expect(calls).toBe(2);
  });

  it("reports a safe HTTP diagnostic when COR rejects session issuance", async () => {
    const provider = new CorShopperDemoCredentialProvider(
      "https://cor.example",
      fetchWith({ error: "private detail" }, 503),
    );
    await expect(provider.getBearerCredential(new AbortController().signal))
      .rejects.toThrow("cor_demo_credential_http_error");
  });

  it("rejects a credential response that is not explicitly demo-only", async () => {
    const provider = new CorShopperDemoCredentialProvider(
      "https://cor.example",
      fetchWith(validBody({ demoOnly: false })),
    );
    await expect(provider.getBearerCredential(new AbortController().signal))
      .rejects.toThrow("cor_demo_credential_response_invalid");
  });

  it("rejects expired credentials", async () => {
    const provider = new CorShopperDemoCredentialProvider(
      "https://cor.example",
      fetchWith(validBody({ expiresAt: new Date(Date.now() - 60_000).toISOString() })),
    );
    await expect(provider.getBearerCredential(new AbortController().signal))
      .rejects.toThrow("cor_demo_credential_response_invalid");
  });

  it("rejects non-HTTPS service origins except local development", async () => {
    const provider = new CorShopperDemoCredentialProvider("http://cor.example", fetchWith(validBody()));
    await expect(provider.getBearerCredential(new AbortController().signal))
      .rejects.toThrow("cor_demo_credential_configuration_invalid");
  });
});

describe("integrated composition gate", () => {
  it("keeps integrated mode disabled without an explicit COR origin", () => {
    expect(getCompositionModeError("integrated", null)).toContain("VITE_COR_SHOPPER_BASE_URL");
  });

  it("accepts an HTTPS COR origin", () => {
    expect(getCompositionModeError("integrated", "https://cor.example")).toBeNull();
  });

  it("rejects non-HTTPS remote origins", () => {
    expect(getCompositionModeError("integrated", "http://cor.example")).toContain("HTTPS");
  });
});
