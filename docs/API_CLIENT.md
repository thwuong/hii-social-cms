# API Client Documentation

## Tổng quan

Hệ thống API client được tách thành 2 phần:

- **`lib/api-client.ts`**: Config, error types, token management, Ky instance với hooks
- **`services/apiService.ts`**: API service methods (get, post, put, delete, upload, download, auth)

Sử dụng [Ky](https://github.com/sindresorhus/ky) làm HTTP client với các tính năng nâng cao:

- ✅ **Auto Retry**: Tự động retry khi request thất bại
- ✅ **Refresh Token**: Tự động làm mới token khi hết hạn
- ✅ **Global Response Handler**: Xử lý response toàn cục
- ✅ **Advanced Error Handling**: Error handling chi tiết với custom error types
- ✅ **Request/Response Interceptors**: Interceptors cho request và response
- ✅ **Type Safety**: Đầy đủ TypeScript types

## Cấu trúc

### File Structure

```
lib/
  ├── api-client.ts          # Config, error types, token manager, Ky instance
  ├── types/
  │   └── api-client.ts      # API response types
  └── index.ts               # Lib exports

services/
  ├── apiService.ts          # API methods (get, post, put, delete, auth)
  └── index.ts               # Services exports
```

### 1. Custom Error Types (lib/api-client.ts)

```typescript
// Base error
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public data?: unknown
  )
}

// Specific errors
class NetworkError extends Error // Lỗi mạng
class ValidationError extends ApiError // Lỗi validation (422)
class UnauthorizedError extends ApiError // Lỗi unauthorized (401)
class ForbiddenError extends ApiError // Lỗi forbidden (403)
class NotFoundError extends ApiError // Lỗi not found (404)
```

### 2. Token Management (lib/api-client.ts)

```typescript
const tokenManager = {
  getAccessToken(): string | null
  getRefreshToken(): string | null
  setTokens(accessToken: string, refreshToken?: string): void
  clearTokens(): void
}
```

### 3. API Client Instance (lib/api-client.ts)

```typescript
export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000,
  retry: {
    limit: 2,
    methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [...],
    beforeRetry: [...],
    afterResponse: [...],
    beforeError: [...],
  }
})
```

### 4. Type-safe API Helpers (services/apiService.ts)

```typescript
export const api = {
  get<T>(url: string, options?: Options): Promise<T>
  post<T>(url: string, data?: unknown, options?: Options): Promise<T>
  put<T>(url: string, data?: unknown, options?: Options): Promise<T>
  patch<T>(url: string, data?: unknown, options?: Options): Promise<T>
  delete<T>(url: string, options?: Options): Promise<T>
  upload<T>(url: string, formData: FormData, options?: Options): Promise<T>
  download(url: string, options?: Options): Promise<Blob>
}
```

### 5. Auth API Helpers (services/apiService.ts)

```typescript
export const authApi = {
  login(email: string, password: string): Promise<AuthResponse>
  logout(): Promise<void>
  refreshToken(): Promise<string>
  getCurrentUser(): Promise<User>
}
```

## Tính năng chi tiết

### 1. Auto Retry

Request tự động retry khi gặp lỗi:

```typescript
retry: {
  limit: 2, // Retry tối đa 2 lần
  methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
  statusCodes: [408, 413, 429, 500, 502, 503, 504],
  afterStatusCodes: [413, 429, 503],
}
```

- Respect `Retry-After` header từ server
- Chỉ retry các method an toàn (không retry POST)
- Log retry attempts trong dev mode

### 2. Refresh Token Mechanism

Tự động làm mới access token khi hết hạn:

```typescript
// Khi nhận response 401:
1. Gọi API refresh token
2. Lưu token mới
3. Retry request gốc với token mới
4. Nếu refresh thất bại -> redirect to login
```

**Xử lý concurrent requests:**

- Khi nhiều request cùng fail với 401
- Chỉ gọi refresh token API một lần
- Các request khác đợi và dùng token mới

```typescript
// Example
async function getValidToken(): Promise<string | null> {
  if (isRefreshing && refreshTokenPromise) {
    return refreshTokenPromise; // Đợi refresh đang chạy
  }
  // ... refresh token
}
```

### 3. Global Response Handler

Xử lý response toàn cục theo status code:

```typescript
async function handleResponse<T>(response: Response): Promise<T> {
  switch (response.status) {
    case 200, 201: // Success
      return data
    case 204: // No content
      return undefined
    case 400: // Bad request
      throw new ApiError(...)
    case 401: // Unauthorized
      throw new UnauthorizedError()
    case 403: // Forbidden
      throw new ForbiddenError()
    case 404: // Not found
      throw new NotFoundError()
    case 422: // Validation error
      throw new ValidationError(...)
    case 500+: // Server error
      throw new ApiError(...)
  }
}
```

**Unwrap API response:**

```typescript
// Nếu API trả về:
{
  "success": true,
  "data": { ... }
}

// Handler tự động unwrap và return data
return data.data
```

### 4. Advanced Error Handling

**Error Types:**

```typescript
try {
  const users = await api.get<User[]>('users');
} catch (error) {
  if (error instanceof ValidationError) {
    // Xử lý lỗi validation
    console.log('Errors:', error.errors);
    // error.errors = { email: ['Invalid email'], ... }
  } else if (error instanceof UnauthorizedError) {
    // Redirect to login
    router.navigate('/login');
  } else if (error instanceof ForbiddenError) {
    // Show forbidden message
  } else if (error instanceof NotFoundError) {
    // Show 404 page
  } else if (error instanceof NetworkError) {
    // Show offline message
  } else if (error instanceof ApiError) {
    // Generic API error
    console.log('API Error:', error.message, error.status);
  }
}
```

**Error Logging:**

- Tất cả errors được log trong dev mode
- Bao gồm request ID để tracking
- Parse error response từ server

### 5. Request/Response Interceptors

**Before Request:**

```typescript
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

    // Add request ID
    const requestId = `${Date.now()}-${Math.random()}`;
    request.headers.set('X-Request-ID', requestId);
  },
];
```

**After Response:**

```typescript
afterResponse: [
  async (request, options, response) => {
    // Log response
    console.log('Response:', response.status);

    // Handle 401 -> refresh token
    if (response.status === 401) {
      const newToken = await getValidToken();
      if (newToken) {
        // Retry với token mới
        return ky(newRequest);
      }
      // Redirect to login
      window.location.href = '/login';
    }
  },
];
```

**Before Error:**

```typescript
beforeError: [
  async (error) => {
    // Parse error response
    const errorData = await response.json();

    // Return custom error type
    return new ValidationError(errorData.message, errorData.errors);
  },
];
```

## Usage Examples

### 1. Basic GET Request

```typescript
import { api } from '@/services/apiService';
// hoặc
import { api } from '@/services';

interface User {
  id: string;
  name: string;
  email: string;
}

// Simple GET
const users = await api.get<User[]>('users');

// With query params
const admins = await api.get<User[]>('users', {
  searchParams: { role: 'admin', limit: 10 },
});

// With custom headers
const data = await api.get<User>('users/123', {
  headers: { 'X-Custom': 'value' },
});
```

### 2. POST/PUT/PATCH Requests

```typescript
// Create user
const newUser = await api.post<User>('users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// Update user
const updated = await api.put<User>('users/123', {
  name: 'Jane Doe',
});

// Partial update
const patched = await api.patch<User>('users/123', {
  email: 'jane@example.com',
});
```

### 3. DELETE Request

```typescript
await api.delete('users/123');

// With response
const result = await api.delete<{ success: boolean }>('users/123');
```

### 4. File Upload

```typescript
// Upload single file
const formData = new FormData();
formData.append('file', file);
formData.append('title', 'My Image');

const uploaded = await api.upload<{ url: string }>('upload', formData);

// Upload với progress (sử dụng apiClient trực tiếp)
const response = await apiClient.post('upload', {
  body: formData,
  onUploadProgress: (progress) => {
    console.log('Upload progress:', progress);
  },
});
```

### 5. File Download

```typescript
// Download file
const blob = await api.download('files/document.pdf');

// Create download link
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'document.pdf';
a.click();
URL.revokeObjectURL(url);

// Or open in new tab
window.open(url);
```

### 6. Authentication

```typescript
import { authApi } from '@/services/apiService';
import { tokenManager } from '@/lib/api-client';
// hoặc
import { authApi } from '@/services';
import { tokenManager } from '@/lib';

// Login
try {
  const { user, access_token, refresh_token } = await authApi.login('user@example.com', 'password');
  console.log('Logged in:', user);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Invalid credentials');
  }
}

// Get current user
const user = await authApi.getCurrentUser();

// Logout
await authApi.logout();

// Manual token management
tokenManager.setTokens('access-token', 'refresh-token');
const token = tokenManager.getAccessToken();
tokenManager.clearTokens();
```

### 7. Error Handling

```typescript
import { api } from '@/services/apiService';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  NetworkError,
  ApiError,
} from '@/lib/api-client';

try {
  const user = await api.get<User>('users/123');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('User not found');
    router.navigate('/404');
  } else if (error instanceof UnauthorizedError) {
    console.log('Please login');
    router.navigate('/login');
  } else if (error instanceof ValidationError) {
    console.log('Validation errors:', error.errors);
    // { email: ['Invalid email'], name: ['Required'] }
  } else if (error instanceof NetworkError) {
    console.log('Network error, please check connection');
  } else if (error instanceof ApiError) {
    console.log('API Error:', error.message);
    console.log('Status:', error.status);
    console.log('Code:', error.code);
  } else {
    console.log('Unknown error:', error);
  }
}
```

### 8. With React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/apiService';

// Query
function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<User[]>('users'),
  });
}

// Mutation
function useCreateUser() {
  return useMutation({
    mutationFn: (data: CreateUserDto) => api.post<User>('users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      if (error instanceof ValidationError) {
        toast.error(error.message);
      }
    },
  });
}
```

### 9. Advanced: Custom Instance

```typescript
// Tạo API client riêng cho service khác
export const externalApi = ky.create({
  prefixUrl: 'https://external-api.com',
  timeout: 10000,
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set('X-API-Key', 'secret-key');
      },
    ],
  },
});
```

### 10. Advanced: Request Cancellation

```typescript
// Cancel request với AbortController
const controller = new AbortController();

const promise = api.get<User[]>('users', {
  signal: controller.signal,
});

// Cancel sau 5 giây
setTimeout(() => controller.abort(), 5000);

try {
  const users = await promise;
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled');
  }
}
```

## Configuration

### Environment Variables

```bash
# .env
VITE_API_URL=https://api.example.com
```

### Customize Settings

Tất cả config trong `lib/api-client.ts`:

```typescript
// Thay đổi timeout
export const apiClient = ky.create({
  timeout: 60000, // 60 seconds
  // ...
});

// Thay đổi retry logic
retry: {
  limit: 3,
  methods: ['get'],
  statusCodes: [429, 503],
}

// Thay đổi token keys
const ACCESS_TOKEN_KEY = 'my_access_token';
const REFRESH_TOKEN_KEY = 'my_refresh_token';
```

## Best Practices

### 1. Type Safety

```typescript
import { api } from '@/services/apiService';

// ✅ Good: Define response types
interface User {
  id: string;
  name: string;
}

const users = await api.get<User[]>('users');
users[0].name; // TypeScript knows this is string

// ❌ Bad: No type
const users = await api.get('users');
users[0].name; // No type checking
```

### 2. Error Handling

```typescript
import { api } from '@/services/apiService';
import { NotFoundError, UnauthorizedError } from '@/lib/api-client';

// ✅ Good: Handle specific errors
try {
  const user = await api.get<User>('users/123');
} catch (error) {
  if (error instanceof NotFoundError) {
    // Show 404 page
  } else if (error instanceof UnauthorizedError) {
    // Redirect to login
  }
}

// ❌ Bad: Generic catch
try {
  const user = await api.get('users/123');
} catch (error) {
  console.error('Error:', error);
}
```

### 3. Reusable API Functions

```typescript
// ✅ Good: Create service layer
// services/userService.ts
import { api } from './apiService';

export const userService = {
  getUsers: () => api.get<User[]>('users'),
  getUser: (id: string) => api.get<User>(`users/${id}`),
  createUser: (data: CreateUserDto) => api.post<User>('users', data),
  updateUser: (id: string, data: UpdateUserDto) => api.put<User>(`users/${id}`, data),
  deleteUser: (id: string) => api.delete(`users/${id}`),
};

// Usage
const users = await userService.getUsers();

// ❌ Bad: Direct API calls everywhere
const users = await api.get('users');
```

### 4. Loading States

```typescript
import { api } from '@/services/apiService';

// ✅ Good: Use React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.get<User[]>('users'),
});

// ❌ Bad: Manual state management
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  api
    .get('users')
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
```

## Troubleshooting

### 1. Token Refresh Loop

**Vấn đề:** API refresh token cũng trả về 401, gây infinite loop

**Giải pháp:**

```typescript
async function refreshAccessToken() {
  try {
    const response = await ky.post(`${API_BASE_URL}/auth/refresh`, {
      json: { refresh_token: refreshToken },
      retry: 0, // ⚠️ Quan trọng: không retry
    });
    // ...
  } catch (error) {
    tokenManager.clearTokens(); // Clear tokens
    return null;
  }
}
```

### 2. CORS Issues

**Vấn đề:** CORS error khi call API

**Giải pháp:**

- Backend phải config CORS headers đúng
- Check `prefixUrl` trong api client
- Sử dụng proxy trong development (vite.config.ts)

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

### 3. Request Not Cancelled

**Vấn đề:** Component unmount nhưng request vẫn chạy

**Giải pháp:** Sử dụng React Query (tự động cancel) hoặc AbortController

```typescript
useEffect(() => {
  const controller = new AbortController();

  api
    .get('users', { signal: controller.signal })
    .then(setData)
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error(error);
      }
    });

  return () => controller.abort();
}, []);
```

## Migration Guide

### From Axios

```typescript
// Axios
const response = await axios.get('/users');
const users = response.data;

// Ky
const users = await api.get<User[]>('users');
```

```typescript
// Axios
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Ky
const apiClient = ky.create({
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
  },
});
```

### From Fetch

```typescript
// Fetch
const response = await fetch('/users');
const users = await response.json();

// Ky
const users = await api.get<User[]>('users');
```

```typescript
// Fetch với error handling
const response = await fetch('/users');
if (!response.ok) {
  throw new Error('Failed');
}
const users = await response.json();

// Ky (tự động throw error)
try {
  const users = await api.get<User[]>('users');
} catch (error) {
  // Handle error
}
```

## References

- [Ky Documentation](https://github.com/sindresorhus/ky)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [React Query + Ky](https://tanstack.com/query/latest/docs/framework/react/guides/query-functions)
