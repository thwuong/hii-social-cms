/**
 * Ky HTTP Client Configuration
 *
 * File này chỉ chứa config cho Ky client:
 * - Error types
 * - Token management
 * - Ky instance với hooks
 * - Refresh token mechanism
 *
 * API service methods được tách ra file services/apiService.ts
 *
 * Docs: https://github.com/sindresorhus/ky
 */

/* eslint-disable max-classes-per-file */
import ky, { HTTPError } from 'ky';

// Base API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

// Token storage keys
const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Refresh token state
let isRefreshing = false;
let refreshTokenPromise: Promise<string | null> | null = null;

/**
 * API Error Types
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message, 422, 'VALIDATION_ERROR', errors);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * Token Management
 */
export const tokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (accessToken: string, refreshToken?: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    isRefreshing = false;
    refreshTokenPromise = null;
  },
};

/**
 * Refresh Token Function
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenManager.getRefreshToken();

  if (!refreshToken) {
    tokenManager.clearTokens();
    return null;
  }

  try {
    const response = await ky.post(`${API_BASE_URL}/auth/refresh`, {
      json: { refresh_token: refreshToken },
      retry: 0, // Không retry cho refresh token
    });

    const data = await response.json<{
      access_token: string;
      refresh_token?: string;
    }>();

    tokenManager.setTokens(data.access_token, data.refresh_token);
    return data.access_token;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    tokenManager.clearTokens();
    return null;
  }
}

/**
 * Get or refresh token
 */
export async function getValidToken(): Promise<string | null> {
  // Nếu đang refresh, đợi promise hiện tại
  if (isRefreshing && refreshTokenPromise) {
    return refreshTokenPromise;
  }

  const token = tokenManager.getAccessToken();
  if (token) {
    return token;
  }

  // Bắt đầu refresh
  isRefreshing = true;
  refreshTokenPromise = refreshAccessToken().finally(() => {
    isRefreshing = false;
    refreshTokenPromise = null;
  });

  return refreshTokenPromise;
}

/**
 * Main API client instance với hooks
 */
export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000, // 30 seconds
  retry: {
    limit: 2,
    methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
    afterStatusCodes: [413, 429, 503],
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        // Add auth token
        const token = await getValidToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }

        // Add custom headers
        request.headers.set('X-App-Version', '1.0.0');
        request.headers.set('X-Client-Type', 'web');

        // Add request ID for tracking
        const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        request.headers.set('X-Request-ID', requestId);

        // Log request in dev
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('🚀 API Request:', {
            method: request.method,
            url: request.url,
            requestId,
          });
        }
      },
    ],
    beforeRetry: [
      async ({ request, error, retryCount }) => {
        let retryAfter: string | null = null;

        // Check if error has response (HTTPError)
        if (error instanceof HTTPError && error.response) {
          retryAfter = error.response.headers.get('Retry-After');
        }

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('🔄 Retrying request:', {
            url: request.url,
            retryCount,
            retryAfter,
          });
        }

        // Nếu server yêu cầu delay
        if (retryAfter) {
          const delay = parseInt(retryAfter, 10) * 1000;
          await new Promise((resolve) => {
            setTimeout(resolve, delay);
          });
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // Log response in dev
        if (import.meta.env.DEV) {
          const requestId = request.headers.get('X-Request-ID');
          // eslint-disable-next-line no-console
          console.log('✅ API Response:', {
            url: response.url,
            status: response.status,
            requestId,
          });
        }

        // Handle 401 - try refresh token
        if (response.status === 401) {
          const newToken = await getValidToken();

          if (newToken) {
            // Retry request với token mới
            const newRequest = new Request(request.url, {
              method: request.method,
              headers: request.headers,
              body: request.body,
            });
            newRequest.headers.set('Authorization', `Bearer ${newToken}`);

            return ky(newRequest);
          }

          // Không thể refresh -> redirect to login
          tokenManager.clearTokens();
          window.location.href = '/login';
          throw new UnauthorizedError('Session expired');
        }

        return response;
      },
    ],
    beforeError: [
      async (error) => {
        const { request, response } = error;

        // Network error
        if (!response) {
          if (import.meta.env.DEV) {
            console.error('❌ Network Error:', {
              url: request.url,
              message: error.message,
            });
          }
          // Return original HTTPError for network issues
          return error;
        }

        // Parse error response
        try {
          const contentType = response.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const errorData = (await response.json()) as {
              message?: string;
              code?: string;
              errors?: Record<string, string[]>;
            };

            if (import.meta.env.DEV) {
              console.error('❌ API Error:', {
                url: request.url,
                status: response.status,
                message: errorData.message,
                code: errorData.code,
              });
            }

            // Modify error message and return HTTPError
            // eslint-disable-next-line no-param-reassign
            error.message = errorData.message || error.message || `HTTP ${response.status}`;
            return error;
          }
        } catch (parseError) {
          // Không parse được response
          if (import.meta.env.DEV) {
            console.error('❌ Failed to parse error response:', parseError);
          }
        }

        // Return original error
        return error;
      },
    ],
  },
});

/**
 * Re-export types
 */
export type { ApiResponse } from './types/api-client';
