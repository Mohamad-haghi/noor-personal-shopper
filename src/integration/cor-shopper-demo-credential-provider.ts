import type { CorShopperCredentialProvider } from "./cor-shopper-remote-client";

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

    let response: Response;
    try {
      response = await this.fetchImpl(`${origin}/shopper/v1/demo-session`, {
        method: "GET",
        headers: { accept: "application/json" },
        cache: "no-store",
        credentials: "omit",
        redirect: "error",
        referrerPolicy: "no-referrer",
        signal,
      });
    } catch {
      throw new Error("cor_demo_credential_unavailable");
    }

    if (!response.ok) {
      try { await response.body?.cancel(); } catch { /* best-effort cleanup */ }
      throw new Error("cor_demo_credential_unavailable");
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
