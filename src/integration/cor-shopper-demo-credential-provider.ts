import type { CorShopperCredentialProvider } from "./cor-shopper-remote-client";

type BrowserFetchStage = "demo-session" | "health-live";

function logBrowserFetchFailure(stage: BrowserFetchStage, outcome: "fetch_rejected" | "http_error", status?: number): void {
  // Safe diagnostics only: never log credentials, response bodies, headers, or exception messages.
  console.warn("[noor.cor.browser_fetch]", JSON.stringify({
    stage,
    outcome,
    ...(status === undefined ? {} : { status }),
  }));
}

function waitBeforeRetry(signal: AbortSignal): Promise<boolean> {
  if (signal.aborted) return Promise.resolve(false);
  return new Promise(resolve => {
    const finish = (ready: boolean) => {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
      resolve(ready && !signal.aborted);
    };
    const timer = setTimeout(() => finish(true), 350);
    const onAbort = () => finish(false);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

export class CorShopperDemoCredentialProvider implements CorShopperCredentialProvider {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async getBearerCredential(signal: AbortSignal): Promise<string> {
    let origin: string;
    try {
      const url = new URL(this.baseUrl);
      const localHttp = url.protocol === "http:" &&
        (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]");
      if ((!localHttp && url.protocol !== "https:") || url.username || url.password ||
          url.pathname !== "/" || url.search || url.hash) {
        throw new Error("invalid_origin");
      }
      origin = url.origin;
    } catch {
      throw new Error("cor_demo_credential_configuration_invalid");
    }

    let response: Response | undefined;
    // A transient browser fetch rejection must not immediately take down the
    // shopper flow. Retry the credential request once, with the same bounded
    // operation signal and identical credential-safe request options.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (attempt > 0 && !(await waitBeforeRetry(signal))) {
        throw new Error("cor_demo_credential_network_error");
      }
      try {
        response = await this.fetchImpl(`${origin}/shopper/v1/demo-session`, {
          method: "GET",
          // Keep this cross-origin GET header-free: Safari/WebKit can apply stricter
          // preflight rules to nonstandard Accept values than other browsers.
          cache: "no-store",
          credentials: "omit",
          // Render may issue a same-origin redirect while waking or normalizing a route.
          // Follow it, but never accept a credential response from another origin.
          redirect: "follow",
          referrerPolicy: "no-referrer",
          signal,
        });
        break;
      } catch {
        if (signal.aborted) {
          logBrowserFetchFailure("demo-session", "fetch_rejected");
          throw new Error("cor_demo_credential_network_error");
        }
        if (attempt === 1) logBrowserFetchFailure("demo-session", "fetch_rejected");
      }
    }

    if (!response) {
      // A no-cors probe can itself be blocked by Cross-Origin-Resource-Policy
      // and therefore cannot reliably prove host reachability. Use COR's public,
      // allowlisted liveness endpoint as a normal CORS-readable request instead.
      let probe: Response | undefined;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        if (attempt > 0 && !(await waitBeforeRetry(signal))) {
          throw new Error("cor_demo_credential_network_error");
        }
        try {
          probe = await this.fetchImpl(`${origin}/health/live`, {
            method: "GET",
            cache: "no-store",
            credentials: "omit",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            signal,
          });
          break;
        } catch {
          if (signal.aborted) {
            logBrowserFetchFailure("health-live", "fetch_rejected");
            throw new Error("cor_demo_credential_network_error");
          }
          if (attempt === 1) {
            logBrowserFetchFailure("health-live", "fetch_rejected");
            throw new Error("cor_demo_credential_session_and_health_fetch_failed");
          }
        }
      }
      if (!probe) throw new Error("cor_demo_credential_session_and_health_fetch_failed");
      if (!probe.ok) {
        logBrowserFetchFailure("health-live", "http_error", probe.status);
        try { await probe.body?.cancel(); } catch { /* best-effort cleanup */ }
        throw new Error("cor_demo_credential_health_probe_http_error");
      }
      try { await probe.body?.cancel(); } catch { /* best-effort cleanup */ }
      throw new Error("cor_demo_credential_cors_blocked");
    }

    if (response.url) {
      let responseOrigin: string;
      try {
        responseOrigin = new URL(response.url).origin;
      } catch {
        try { await response.body?.cancel(); } catch { /* best-effort cleanup */ }
        throw new Error("cor_demo_credential_network_error");
      }
      if (responseOrigin !== origin) {
        try { await response.body?.cancel(); } catch { /* best-effort cleanup */ }
        throw new Error("cor_demo_credential_network_error");
      }
    }

    if (!response.ok) {
      logBrowserFetchFailure("demo-session", "http_error", response.status);
      try { await response.body?.cancel(); } catch { /* best-effort cleanup */ }
      throw new Error("cor_demo_credential_http_error");
    }
    const contentType = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
    if (contentType !== "application/json") {
      try { await response.body?.cancel(); } catch { /* best-effort cleanup */ }
      throw new Error("cor_demo_credential_response_invalid");
    }

    let text: string;
    try {
      const reader = response.body?.getReader();
      if (!reader) throw new Error("body_missing");
      const chunks: Uint8Array[] = [];
      let size = 0;
      try {
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          size += part.value.byteLength;
          if (size > 16 * 1024) {
            await reader.cancel();
            throw new Error("response_too_large");
          }
          chunks.push(part.value);
        }
      } finally {
        try { reader.releaseLock(); } catch { /* best-effort cleanup */ }
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
      }
      text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      throw new Error("cor_demo_credential_response_invalid");
    }

    let body: unknown;
    try { body = JSON.parse(text); } catch {
      throw new Error("cor_demo_credential_response_invalid");
    }
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      throw new Error("cor_demo_credential_response_invalid");
    }
    const payload = body as Record<string, unknown>;
    if (payload.contractVersion !== "1.0.0" ||
        payload.credentialType !== "short_lived_demo_bearer" ||
        payload.demoOnly !== true ||
        typeof payload.credential !== "string" ||
        payload.credential.length < 24 || payload.credential.length > 4096 ||
        payload.credential.trim() !== payload.credential || /\\s/.test(payload.credential) ||
        typeof payload.expiresAt !== "string" ||
        !Number.isFinite(Date.parse(payload.expiresAt)) ||
        Date.parse(payload.expiresAt) <= Date.now()) {
      throw new Error("cor_demo_credential_response_invalid");
    }
    return payload.credential;
  }
}
