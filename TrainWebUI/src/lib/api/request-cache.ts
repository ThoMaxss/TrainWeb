/**
 * Request deduplication cache
 * Prevents duplicate API requests if the same request is made multiple times
 * while one is already in flight
 */

type CacheKey = string;
type PendingRequest<T> = Promise<T>;

// We store heterogeneous pending promises; use `unknown` to avoid `any`
const pendingRequests = new Map<CacheKey, PendingRequest<unknown>>();

/**
 * Execute a function with request deduplication
 * If the same request is already in flight, return the existing promise
 * Otherwise, execute the function and cache the result
 */
export function withRequestCache<T>(
  key: CacheKey,
  fn: () => Promise<T>
): Promise<T> {
  // If request is already in flight, return the existing promise
  if (pendingRequests.has(key)) {
    console.log(`[Cache Hit] Reusing in-flight request: ${key}`);
    return pendingRequests.get(key)!;
  }

  // Execute the request and cache it
  const promise = fn()
    .catch((error) => {
      // Remove from cache on error so we can retry
      pendingRequests.delete(key);
      throw error;
    })
    .finally(() => {
      // Remove from cache after completion
      pendingRequests.delete(key);
    });

  pendingRequests.set(key, promise);
  return promise;
}

// Simple in-memory response cache for GET requests with a configurable stale time
type ResponseCacheEntry<T> = { data: T; timestamp: number };
const responseCache = new Map<string, ResponseCacheEntry<unknown>>();

export function withResponseCache<T>(
  key: string,
  fn: () => Promise<T>,
  staleMs: number = 45_000 // default ~45 seconds
): Promise<T> {
  const now = Date.now();
  const entry = responseCache.get(key) as ResponseCacheEntry<T> | undefined;

  if (entry && now - entry.timestamp < staleMs) {
    console.log(`[Response Cache] Returning cached response for ${key}`);
    return Promise.resolve(entry.data);
  }

  return fn().then((res) => {
    responseCache.set(key, { data: res, timestamp: Date.now() });
    return res;
  });
}

export function clearResponseCache(key?: string) {
  if (key) responseCache.delete(key);
  else responseCache.clear();
}

/**
 * Clear all pending requests (useful for testing or reset)
 */
export function clearRequestCache() {
  pendingRequests.clear();
}

/**
 * Get cache stats (useful for debugging)
 */
export function getRequestCacheStats() {
  return {
    pendingRequests: pendingRequests.size,
    keys: Array.from(pendingRequests.keys()),
  };
}
