/**
 * API Service
 *
 * File này chứa các API service methods:
 * - Type-safe API helpers (get, post, put, patch, delete)
 * - File upload/download
 * - Auth API methods
 * - Response handler
 */

import { type Options } from 'ky';
import {
  apiBasicClient,
  apiClient,
  ApiError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  type ApiResponse,
} from '../lib/api-client';

/**
 * Global Response Handler
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  // Handle different status codes
  switch (response.status) {
    case 200:
    case 201:
      if (isJson) {
        const data = (await response.json()) as ApiResponse<T>;
        // Nếu API trả về format { success, data }
        if (data && typeof data === 'object' && 'data' in data) {
          return data.data as T;
        }
        return data as T;
      }
      return response.text() as unknown as T;

    case 204:
      return undefined as T;

    case 400:
      if (isJson) {
        const error = (await response.json()) as ApiResponse;
        throw new ApiError(error.message || 'Bad Request', 400, error.code, error.errors);
      }
      throw new ApiError('Bad Request', 400);

    case 401:
      throw new UnauthorizedError();

    case 403:
      if (isJson) {
        const error = (await response.json()) as ApiResponse;
        throw new ForbiddenError(error.message);
      }
      throw new ForbiddenError();

    case 404:
      if (isJson) {
        const error = (await response.json()) as ApiResponse;
        throw new NotFoundError(error.message);
      }
      throw new NotFoundError();

    case 422:
      if (isJson) {
        const error = (await response.json()) as ApiResponse;
        throw new ValidationError(error.message || 'Validation failed', error.errors);
      }
      throw new ValidationError('Validation failed');

    case 500:
    case 502:
    case 503:
    case 504:
      if (isJson) {
        const error = (await response.json()) as ApiResponse;
        throw new ApiError(error.message || 'Server Error', response.status, error.code);
      }
      throw new ApiError('Server Error', response.status);

    default:
      if (!response.ok) {
        throw new ApiError(`HTTP Error ${response.status}`, response.status);
      }
      return response.json() as Promise<T>;
  }
}

/**
 * Type-safe API helpers
 */
export const api = {
  /**
   * GET request
   */
  get: async <T>(url: string, options?: Options): Promise<T> => {
    const response = await apiClient.get(url, options);
    return handleResponse<T>(response);
  },

  /**
   * POST request
   */
  post: async <T>(url: string, data?: unknown, options?: Options): Promise<T> => {
    const response = await apiClient.post(url, { json: data, ...options });
    return handleResponse<T>(response);
  },

  /**
   * PUT request
   */
  put: async <T>(url: string, data?: unknown, options?: Options): Promise<T> => {
    const response = await apiClient.put(url, { json: data, ...options });
    return handleResponse<T>(response);
  },

  /**
   * PATCH request
   */
  patch: async <T>(url: string, data?: unknown, options?: Options): Promise<T> => {
    const response = await apiClient.patch(url, { json: data, ...options });
    return handleResponse<T>(response);
  },

  /**
   * DELETE request
   */
  delete: async <T>(url: string, options?: Options): Promise<T> => {
    const response = await apiClient.delete(url, options);
    return handleResponse<T>(response);
  },

  /**
   * Upload file
   */
  upload: async <T>(url: string, formData: FormData, options?: Options): Promise<T> => {
    const response = await apiClient.post(url, { body: formData, ...options });
    return handleResponse<T>(response);
  },

  /**
   * Download file
   */
  download: async (url: string, options?: Options): Promise<Blob> => {
    const response = await apiClient.get(url, options);
    return response.blob();
  },
};

export const apiBasic = {
  /**
   * GET request
   */
  get: async <T>(url: string, options?: Options): Promise<T> => {
    const response = await apiBasicClient.get(url, options);
    return handleResponse<T>(response);
  },

  /**
   * POST request
   */
  post: async <T>(url: string, data?: unknown, options?: Options): Promise<T> => {
    const response = await apiBasicClient.post(url, { json: data, ...options });
    return handleResponse<T>(response);
  },

  /**
   * PUT request
   */
  put: async <T>(url: string, data?: unknown, options?: Options): Promise<T> => {
    const response = await apiBasicClient.put(url, { json: data, ...options });
    return handleResponse<T>(response);
  },

  /**
   * PATCH request
   */
  patch: async <T>(url: string, data?: unknown, options?: Options): Promise<T> => {
    const response = await apiBasicClient.patch(url, { json: data, ...options });
    return handleResponse<T>(response);
  },

  /**
   * DELETE request
   */
  delete: async <T>(url: string, options?: Options): Promise<T> => {
    const response = await apiBasicClient.delete(url, options);
    return handleResponse<T>(response);
  },

  /**
   * Upload file
   */
  upload: async <T>(url: string, formData: FormData, options?: Options): Promise<T> => {
    const response = await apiBasicClient.post(url, { body: formData, ...options });
    return handleResponse<T>(response);
  },

  /**
   * Download file
   */
  download: async (url: string, options?: Options): Promise<Blob> => {
    const response = await apiBasicClient.get(url, options);
    return response.blob();
  },
};

/**
 * Example usage:
 *
 * // Simple GET
 * try {
 *   const users = await api.get<User[]>('users');
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.log('Validation errors:', error.errors);
 *   } else if (error instanceof UnauthorizedError) {
 *     // Redirect to login
 *   } else if (error instanceof NetworkError) {
 *     // Show offline message
 *   }
 * }
 *
 * // POST with data
 * const newUser = await api.post<User>('users', {
 *   name: 'John',
 *   email: 'john@example.com'
 * });
 *
 * // Upload file
 * const formData = new FormData();
 * formData.append('file', file);
 * await api.upload('upload', formData);
 *
 * // Download file
 * const blob = await api.download('files/123');
 * const url = URL.createObjectURL(blob);
 * window.open(url);
 *
 * // Auth
 * await authApi.login('user@example.com', 'password');
 * const user = await authApi.getCurrentUser();
 * await authApi.logout();
 */
