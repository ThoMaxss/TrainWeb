// API Configuration based on backend documentation
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5232',
  API_ROOT: '/api',
  TIMEOUT: 30000, // Increased to 30s for complex nested queries (getAllBookings)
  HEADERS: {
    'Content-Type': 'application/json',
  },
  USE_MOCK: false, // Use real backend API
  AUTO_FALLBACK: false, // No mock fallback
};

// Import enums from types instead of redefining them
// This ensures we use the correct numeric enums from backend
export { UserRole, SeatType, BookingStatus, PaymentMethod, PaymentStatus } from '@/types';

// Import mock service for fallback
import { mockService } from '@/lib/services/mockService';
import { logger } from '@/lib/utils/logger';

// Health check function
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      headers: API_CONFIG.HEADERS,
      signal: AbortSignal.timeout(5000), // 5 second timeout for health check
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

// Helper: exponential backoff with jitter
function calculateBackoffDelay(attempt: number): number {
  const exponentialDelay = Math.min(
    RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
    RETRY_CONFIG.maxDelay
  );
  // Add jitter: random value between 0.5x and 1.5x the delay
  const jitter = exponentialDelay * (0.5 + Math.random());
  return Math.floor(jitter);
}

// Helper: sleep for a given duration
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Token refresh mechanism
let refreshPromise: Promise<string> | null = null;

async function refreshToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const storedUser = localStorage.getItem('gorail_user');
      if (!storedUser) throw new Error('No stored user');

      const userData = JSON.parse(storedUser);
      const refreshToken = userData.refreshToken;
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.API_ROOT}/Auth/refresh`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const newTokenData = await response.json();
      
      // Update stored user with new token
      const updatedUser = {
        ...userData,
        token: newTokenData.token,
        refreshToken: newTokenData.refreshToken || refreshToken,
      };
      localStorage.setItem('gorail_user', JSON.stringify(updatedUser));
      
      return newTokenData.token;
    } catch (error) {
      // Clear invalid session
      localStorage.removeItem('gorail_user');
      window.location.href = '/login';
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Base fetch function with error handling, retry logic, and token refresh
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount: number = 0
): Promise<T> {
  const DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true';
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.API_ROOT}${endpoint}`;
  
  // If mock mode is enabled, bypass real API
  if (API_CONFIG.USE_MOCK) {
    logger.log(`[Mock Mode] ${options.method || 'GET'} ${endpoint}`);
    return mockService.handleRequest(endpoint, options) as Promise<T>;
  }
  
  if (DEBUG) console.log(`🔗 API Call: ${options.method || 'GET'} ${url} at ${new Date().toISOString()}`);
  
  // Get auth token from localStorage
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    // Use the new GoRail namespace key
    const storedUser = localStorage.getItem('gorail_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        token = userData.token || null;
        if (DEBUG) console.log(`🔐 Using auth token: ${token ? 'YES' : 'NO'}`);
      } catch {
        // Ignore parse errors
        if (DEBUG) console.log(`🔐 No auth token found`);
      }
    } else {
      if (DEBUG) console.log(`🔐 No stored user found`);
    }
  }
  
  try {
      if (DEBUG) console.log(`⏱️ Starting fetch with ${API_CONFIG.TIMEOUT}ms timeout...`);
      const response = await fetch(url, {
        ...options,
        headers: {
          ...API_CONFIG.HEADERS,
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        // Add timeout and credentials
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      });
      if (DEBUG) console.log(`📡 Response received: ${response.status} ${response.statusText} at ${new Date().toISOString()}`);

      // Handle different response types based on backend documentation
      if (response.status === 404) {
        if (DEBUG) console.warn(`⚠️ Resource not found: ${url}`);
        return null as T;
      }
      
      // Handle 401 with token refresh
      if (response.status === 401) {
        if (typeof window !== 'undefined' && retryCount === 0) {
          try {
            const newToken = await refreshToken();
            // Retry with new token
            return apiFetch<T>(endpoint, options, retryCount + 1);
          } catch {
            throw new Error('Unauthorized');
          }
        }
        throw new Error('Unauthorized');
      }

      // Retry logic for specific status codes
      if (RETRY_CONFIG.retryableStatuses.includes(response.status) && retryCount < RETRY_CONFIG.maxRetries) {
        const delay = calculateBackoffDelay(retryCount);
        if (DEBUG) console.log(`🔄 Retrying after ${delay}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})...`);
        await sleep(delay);
        return apiFetch<T>(endpoint, options, retryCount + 1);
      }

      if (!response.ok) {
        // For error responses that return strings
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      // Handle empty responses (DELETE operations)
      if (response.status === 200 && response.headers.get('content-length') === '0') {
        return undefined as T;
      }

      // Handle text/plain responses (e.g., MoMo payment URLs)
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/plain')) {
        const text = await response.text();
        return text as T;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Network errors - fallback to mock if enabled
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        if (API_CONFIG.AUTO_FALLBACK) {
          logger.warn(`[Auto Fallback] Backend unavailable, using mock data for ${endpoint}`);
          return mockService.handleRequest(endpoint, options) as Promise<T>;
        }
        
        if (retryCount < RETRY_CONFIG.maxRetries) {
          const delay = calculateBackoffDelay(retryCount);
          if (DEBUG) console.log(`🔄 Network error, retrying after ${delay}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})...`);
          await sleep(delay);
          return apiFetch<T>(endpoint, options, retryCount + 1);
        }
        
        console.error('❌ Backend server is not running at:', API_CONFIG.BASE_URL);
        console.error('💡 Please start your backend server on http://localhost:5232');
        throw new Error('Backend server is not accessible. Please check if the server is running.');
      }
      
      // Timeout errors - fallback to mock if enabled
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        if (API_CONFIG.AUTO_FALLBACK) {
          logger.warn(`[Auto Fallback] Request timeout, using mock data for ${endpoint}`);
          return mockService.handleRequest(endpoint, options) as Promise<T>;
        }
        
        if (retryCount < RETRY_CONFIG.maxRetries) {
          const delay = calculateBackoffDelay(retryCount);
          if (DEBUG) console.log(`🔄 Timeout, retrying after ${delay}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})...`);
          await sleep(delay);
          return apiFetch<T>(endpoint, options, retryCount + 1);
        }
        
        console.error('⏱️ Request timeout after', API_CONFIG.TIMEOUT, 'ms');
        throw new Error('Request timed out. Please try again.');
      }
      
      console.error('API Error:', error);
      throw error;
  }
}
