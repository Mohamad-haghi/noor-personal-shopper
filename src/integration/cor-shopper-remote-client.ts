export type CorShopperOperation = "recommendations" | "comparisons" | "handoffs";

export interface CorShopperCredentialProvider {
  /** Obtain a short-lived, server-issued credential. Never return a static API key. */
  getBearerCredential(signal: AbortSignal): Promise<string>;
}

export interface CorShopperClientOptions {
  readonly baseUrl: string;
  readonly credentials: CorShopperCredentialProvider;
  readonly fetchImpl?: typeof fetch;
  readonly timeoutMs?: number;
  readonly maxRequestBytes?: number;
  readonly maxResponseBytes?: number;
}

export type CorShopperClientErrorCode =
  | "cor_client_configuration_invalid"
  | "cor_credential_unavailable"
  | "cor_request_invalid"
  | "cor_request_too_large"
  | "cor_request_timeout"
  | "cor_service_unavailable"
  | "cor_response_invalid";

export class CorShopperClientError extends Error {
  constructor(readonly code: CorShopperClientErrorCode) {
    super(code);
    this.name = "CorShopperClientError";
  }
}

const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_MAX_REQUEST_BYTES = 16 * 1024;
const DEFAULT_MAX_RESPONSE_BYTES = 1024 * 1024;

function parseBaseUrl(value: string): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new CorShopperClientError("cor_client_configuration_invalid");
  }
  const localHttp = url.protocol === "http:" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]");
  if ((!localHttp && url.protocol !== "https:") ||
      url.username || url.password || url.search || url.hash ||
      (url.pathname !== "/" && url.pathname !== "")) {
    throw new CorShopperClientError("cor_client_configuration_invalid");
  }
  return url;
}

/**
 * Browser-safe transport to COR's versioned Shopper API.
 * It deliberately has no static-secret support and no local/demo fallback.
 * A deployment must inject a real short-lived credential provider and a live COR URL.
 */
export class CorShopperRemoteClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;
  private readonly maxRequestBytes: number;
  private readonly maxResponseBytes: number;

  constructor(private readonly options: CorShopperClientOptions) {
    this.baseUrl = parseBaseUrl(options.baseUrl).origin;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.maxRequestBytes = options.maxRequestBytes ?? DEFAULT_MAX_REQUEST_BYTES;
    this.maxResponseBytes = options.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES;
    if (!options.credentials ||
        !Number.isSafeInteger(this.timeoutMs) || this.timeoutMs < 1 || this.timeoutMs > 30_000 ||
        !Number.isSafeInteger(this.maxRequestBytes) || this.maxRequestBytes < 1 || this.maxRequestBytes > 16 * 1024 ||
        !Number.isSafeInteger(this.maxResponseBytes) || this.maxResponseBytes < 1 || this.maxResponseBytes > 5 * 1024 * 1024) {
      throw new CorShopperClientError("cor_client_configuration_invalid");
    }
  }

  recommend<T>(request: unknown): Promise<T> {
    return this.post<T>("recommendations", request);
  }

  compare<T>(request: unknown): Promise<T> {
    return this.post<T>("comparisons", request);
  }

  handoff<T>(request: unknown): Promise<T> {
    return this.post<T>("handoffs", request);
  }

  private async post<T>(operation: CorShopperOperation, request: unknown): Promise<T> {
    let serialized: string;
    try {
      serialized = JSON.stringify(request);
      if (typeof serialized !== "string" || request === undefined) {
        throw new Error("not_serializable");
      }
    } catch {
      throw new CorShopperClientError("cor_request_invalid");
    }
    if (new TextEncoder().encode(serialized).byteLength > this.maxRequestBytes) {
      throw new CorShopperClientError("cor_request_too_large");
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      let credential: string;
      try {
        credential = await this.options.credentials.getBearerCredential(controller.signal);
      } catch {
        throw new CorShopperClientError(controller.signal.aborted
          ? "cor_request_timeout"
          : "cor_credential_unavailable");
      }
      if (controller.signal.aborted) throw new CorShopperClientError("cor_request_timeout");
      if (typeof credential !== "string" || !credential || credential.length > 8192 ||
          credential.trim() !== credential || /\s/.test(credential)) {
        throw new CorShopperClientError("cor_credential_unavailable");
      }

      let response: Response;
      try {
        response = await this.fetchImpl(`${this.baseUrl}/shopper/v1/${operation}`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${credential}`,
            "content-type": "application/json",
            accept: "application/json",
          },
          cache: "no-store",
          credentials: "omit",
          redirect: "error",
          referrerPolicy: "no-referrer",
          signal: controller.signal,
          body: serialized,
        });
      } catch {
        throw new CorShopperClientError(controller.signal.aborted
          ? "cor_request_timeout"
          : "cor_service_unavailable");
      }

      if (!response.ok) {
        // Do not surface provider error bodies or infrastructure details to the browser.
        throw new CorShopperClientError("cor_service_unavailable");
      }
      const contentType = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
      if (contentType !== "application/json") {
        throw new CorShopperClientError("cor_response_invalid");
      }
      let responseText: string;
      try {
        responseText = await response.text();
      } catch {
        throw new CorShopperClientError("cor_response_invalid");
      }
      if (new TextEncoder().encode(responseText).byteLength > this.maxResponseBytes) {
        throw new CorShopperClientError("cor_response_invalid");
      }
      try {
        return JSON.parse(responseText) as T;
      } catch {
        throw new CorShopperClientError("cor_response_invalid");
      }
    } finally {
      clearTimeout(timer);
    }
  }
}
