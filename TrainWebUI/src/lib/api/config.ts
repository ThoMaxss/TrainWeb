"use client";

import { auth } from "@/lib/firebase";

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://localhost:7128",
  API_ROOT: "/api",
  TIMEOUT: 30000,
};

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === "true";

if (typeof window !== "undefined" && DEBUG) {
  console.log(`[api] BASE_URL resolved to: ${API_CONFIG.BASE_URL}`);
}

// ❌ Không nên re-export enums từ "@/types" ở config nữa
// vì bạn đã chuyển role sang string ("admin/staff/passenger").
// Nếu cần enums khác (BookingStatus, PaymentStatus...) thì export ở file index types riêng.
// export { UserRole, SeatType, BookingStatus, PaymentMethod, PaymentStatus } from "@/types";

// ---- Error type (để UI/AuthContext xử lý 401 cho sạch) ----
export class ApiError extends Error {
  status: number;
  url: string;
  body?: string;

  constructor(status: number, url: string, message: string, body?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

// Health check function
export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

function calculateBackoffDelay(attempt: number): number {
  const exponentialDelay = Math.min(
    RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
    RETRY_CONFIG.maxDelay
  );
  const jitter = exponentialDelay * (0.5 + Math.random());
  return Math.floor(jitter);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isFailedToFetch(error: unknown): boolean {
  return error instanceof TypeError && error.message === "Failed to fetch";
}

function isTimeoutError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "TimeoutError";
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

function isFormDataBody(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

async function getFirebaseIdToken(forceRefresh = false): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken(forceRefresh);
  } catch {
    return null;
  }
}

// ---- Base fetch with: Firebase token + retry + (401 refresh token 1 lần) ----
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0,
  didRefreshToken = false
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.API_ROOT}${endpoint}`;

  if (DEBUG) console.log(`🔗 API Call: ${options.method || "GET"} ${url}`);

  try {
    const headers = new Headers(options.headers || {});

    // ✅ Chỉ set Content-Type JSON khi body không phải FormData
    if (!isFormDataBody(options.body)) {
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    } else {
      headers.delete("Content-Type");
    }

    // ✅ Attach Firebase ID token (nếu có)
    const idToken = await getFirebaseIdToken(false);
    if (idToken) headers.set("Authorization", `Bearer ${idToken}`);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });

    if (DEBUG) console.log(`📡 Response: ${response.status} ${response.statusText}`);

    // ✅ 404: không nên return null “cứng” vì làm vỡ type (T)
    // -> để caller tự xử lý bằng try/catch (hoặc bạn tạo apiFetchNullable riêng).
    if (response.status === 404) {
      const text = await safeReadText(response);
      throw new ApiError(404, url, "Not Found", text);
    }

    // ✅ 401: thử refresh token đúng 1 lần
    if (response.status === 401) {
      const hasUser = !!auth.currentUser;

      if (hasUser && !didRefreshToken) {
        const fresh = await getFirebaseIdToken(true);
        if (fresh) {
          const retryHeaders = new Headers(headers);
          retryHeaders.set("Authorization", `Bearer ${fresh}`);

          const retryRes = await fetch(url, {
            ...options,
            headers: retryHeaders,
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
          });

          if (retryRes.ok) {
            if (retryRes.status === 204) return undefined as T;

            const ct = retryRes.headers.get("content-type") || "";
            if (ct.includes("text/plain")) return (await safeReadText(retryRes)) as unknown as T;
            return (await retryRes.json()) as T;
          }

          const retryText = await safeReadText(retryRes);
          throw new ApiError(retryRes.status, url, "Unauthorized", retryText);
        }
      }

      const text = await safeReadText(response);
      throw new ApiError(401, url, "Unauthorized", text);
    }

    // Retry for retryable statuses
    if (
      RETRY_CONFIG.retryableStatuses.includes(response.status) &&
      retryCount < RETRY_CONFIG.maxRetries
    ) {
      const delay = calculateBackoffDelay(retryCount);
      if (DEBUG) {
        console.log(
          `🔄 Retrying after ${delay}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})...`
        );
      }
      await sleep(delay);
      return apiFetch<T>(endpoint, options, retryCount + 1, didRefreshToken);
    }

    if (!response.ok) {
      const errorText = await safeReadText(response);
      throw new ApiError(
        response.status,
        url,
        errorText || `HTTP error! status: ${response.status}`,
        errorText
      );
    }

    // ✅ No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // text/plain (vd: momo url)
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/plain")) {
      return (await safeReadText(response)) as unknown as T;
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    // DEV: record last API failure details on window for quick debugging
    try {
      if (typeof window !== "undefined") {
        const detail = {
          attemptedUrl: url,
          expectedBase: API_CONFIG.BASE_URL,
          time: new Date().toISOString(),
          message: (error instanceof Error ? error.message : String(error)),
        };
        // store and emit event
        // @ts-expect-error - augmenting global for debugging in development only
        window.__GORAIL_LAST_API_ERROR = detail;
        try {
          window.dispatchEvent(new CustomEvent("gorail:lastApiError", { detail }));
        } catch {}
      }
    } catch {}
    // Network errors
    if (isFailedToFetch(error)) {
      if (retryCount < RETRY_CONFIG.maxRetries) {
        const delay = calculateBackoffDelay(retryCount);
        await sleep(delay);
        return apiFetch<T>(endpoint, options, retryCount + 1, didRefreshToken);
      }
      throw new ApiError(
        0,
        url,
        `Backend server at ${API_CONFIG.BASE_URL} is not accessible. Please check if the server is running.`
      );
    }

    // Timeout
    if (isTimeoutError(error)) {
      if (retryCount < RETRY_CONFIG.maxRetries) {
        const delay = calculateBackoffDelay(retryCount);
        await sleep(delay);
        return apiFetch<T>(endpoint, options, retryCount + 1, didRefreshToken);
      }
      throw new ApiError(0, url, "Request timed out. Please try again.");
    }

    // Other errors
    if (error instanceof ApiError) throw error;
    if (error instanceof Error) throw new ApiError(0, url, error.message);
    throw new ApiError(0, url, "Unknown error");
  }
}
