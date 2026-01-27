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
import { LoginResponse } from '@/features/auth';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import ky, { HTTPError } from 'ky';
import { ApiResponse } from './types/api';

// Base API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';
export const BASIC_AUTH = import.meta.env.VITE_BASIC_AUTH || '';
const AUTH_PATH_REGEX = /^\/users\/(login|register)$/;

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
    return useAuthStore.getState().token;
  },

  getRefreshToken: (): string | null => {
    return useAuthStore.getState().refreshToken;
  },

  setTokens: (accessToken: string, refreshToken?: string): void => {
    useAuthStore.getState().setToken(accessToken);
    if (refreshToken) {
      useAuthStore.getState().setRefreshToken(refreshToken);
    }
  },

  clearTokens: (): void => {
    useAuthStore.getState().clearTokens();
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
    // Direct API call to avoid circular dependency
    const response = await ky.post(`${API_BASE_URL}/users/tokens/refresh`, {
      json: { refreshToken },
      headers: {
        Authorization: `Basic ${BASIC_AUTH}`,
      },
    });

    const responseData = (await response.json()) as ApiResponse<LoginResponse>;
    const { data } = responseData;

    if (!data) {
      console.error('No data returned from refresh token response');
      tokenManager.clearTokens();
      return null;
    }
    useAuthStore.getState().setToken(data.accessToken);
    useAuthStore.getState().setRefreshToken(data.refreshToken);

    tokenManager.setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    tokenManager.clearTokens();
    return null;
  }
}

/**
 * Get or refresh token
 */
export async function getValidToken(isRefresh = false): Promise<string | null> {
  // Nếu đang refresh, đợi promise hiện tại
  if (isRefreshing && refreshTokenPromise) {
    return refreshTokenPromise;
  }

  const token = tokenManager.getAccessToken();
  if (token && !isRefresh) {
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

// Retry request function
async function retryRequest(request: Request, newToken: string) {
  // Clone request để giữ body stream
  const clonedRequest = request.clone();

  // Get body content if exists
  let bodyContent: string | FormData | Blob | ArrayBuffer | null = null;
  const contentType = clonedRequest.headers.get('content-type');

  if (clonedRequest.body) {
    if (contentType?.includes('application/json')) {
      bodyContent = await clonedRequest.text();
    } else if (contentType?.includes('multipart/form-data')) {
      bodyContent = await clonedRequest.formData();
    } else {
      bodyContent = await clonedRequest.blob();
    }
  }

  // Create new headers with updated token
  const newHeaders = new Headers(request.headers);
  newHeaders.set('Authorization', `Bearer ${newToken}`);

  // Retry request với token mới và body preserved
  return ky(request.url, {
    method: request.method,
    headers: newHeaders,
    body: bodyContent,
  });
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
        // Add basic auth
        const path = request.url.substring(API_BASE_URL.length);

        if (AUTH_PATH_REGEX.test(path) && BASIC_AUTH) {
          request.headers.set('Authorization', `Basic ${BASIC_AUTH}`);
          return;
        }

        // Add auth token
        const token = await getValidToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
        // Log request in dev
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('🚀 API Request:', {
            method: request.method,
            url: request.url,
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
          // eslint-disable-next-line no-console
          console.log('✅ API Response:', {
            url: response.url,
            status: response.status,
          });
        }

        // Handle 401 - try refresh token
        if (response.status === 401) {
          const newToken = await getValidToken(true);

          if (newToken) {
            return retryRequest(request, newToken);
          }

          // Không thể refresh -> redirect to login
          // tokenManager.clearTokens();
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
export type { ApiResponse } from './types/api';
