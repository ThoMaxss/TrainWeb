/**
 * Request deduplication cache
 * Prevents duplicate API requests if the same request is made multiple times
 * while one is already in flight
 */

type CacheKey = string;
type PendingRequest<T> = Promise<T>;

const pendingRequests = new Map<CacheKey, PendingRequest<any>>();

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
