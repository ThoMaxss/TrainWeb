// API Configuration based on backend documentation
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5191',
  API_ROOT: '/api',
  TIMEOUT: 30000, // Increased to 30s for complex nested queries (getAllBookings)
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Import enums from types instead of redefining them
// This ensures we use the correct numeric enums from backend
export { UserRole, SeatType, BookingStatus, PaymentMethod, PaymentStatus } from '@/types';

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

// Base fetch function with error handling
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.API_ROOT}${endpoint}`;
  console.log(`🔗 API Call: ${options.method || 'GET'} ${url} at ${new Date().toISOString()}`);
  
  // Get auth token from localStorage
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('train_booking_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        token = userData.token || null;
        console.log(`🔐 Using auth token: ${token ? 'YES' : 'NO'}`);
      } catch {
        // Ignore parse errors
        console.log(`🔐 No auth token found`);
      }
    } else {
      console.log(`🔐 No stored user found`);
    }
  }
  
  try {
      console.log(`⏱️ Starting fetch with ${API_CONFIG.TIMEOUT}ms timeout...`);
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

      console.log(`📡 Response received: ${response.status} ${response.statusText} at ${new Date().toISOString()}`);

      // Handle different response types based on backend documentation
      if (response.status === 404) {
        console.warn(`⚠️ Resource not found: ${url}`);
        return null as T;
      }
      
      if (response.status === 401) {
        throw new Error('Unauthorized');
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
      // Check if it's a network error (backend not running)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('❌ Backend server is not running at:', API_CONFIG.BASE_URL);
        console.error('💡 Please start your backend server on http://localhost:5191');
        throw new Error('Backend server is not accessible. Please check if the server is running.');
      }
      
      // Check for timeout
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        console.error('⏱️ Request timeout after', API_CONFIG.TIMEOUT, 'ms');
        throw new Error('Request timed out. Please try again.');
      }
      
      console.error('API Error:', error);
      throw error;
  }
}
