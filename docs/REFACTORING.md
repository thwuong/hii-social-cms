# API Client Refactoring

## Tổng quan

Đã refactor API client để tách biệt **config** và **service methods** thành 2 file riêng biệt.

## Cấu trúc mới

### Before (Old Structure)

```
lib/
  └── api-client.ts    # Chứa tất cả: config, errors, hooks, API methods
```

### After (New Structure)

```
lib/
  ├── api-client.ts          # Config, error types, token manager, Ky instance
  ├── types/
  │   └── api-client.ts      # API response types
  └── index.ts               # Lib exports (config & types)

services/
  ├── apiService.ts          # API methods (get, post, put, delete, auth)
  ├── cmsService.ts          # CMS business logic
  └── index.ts               # Services exports (API methods)
```

## Chi tiết thay đổi

### 1. lib/api-client.ts (Config Only)

**Chỉ chứa:**

- ✅ Error types (ApiError, ValidationError, UnauthorizedError, etc.)
- ✅ Token management (tokenManager)
- ✅ Refresh token mechanism (getValidToken, refreshAccessToken)
- ✅ Ky instance với hooks (apiClient)
- ✅ API base URL config

**Không còn:**

- ❌ API methods (get, post, put, delete, upload, download)
- ❌ Auth API methods (login, logout, getCurrentUser)
- ❌ Response handler

**Exports:**

```typescript
export {
  apiClient,
  tokenManager,
  getValidToken,
  ApiError,
  NetworkError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  API_BASE_URL,
  type ApiResponse,
};
```

### 2. services/apiService.ts (Service Methods)

**Chứa:**

- ✅ Response handler (handleResponse)
- ✅ Type-safe API helpers (api.get, api.post, api.put, api.patch, api.delete)
- ✅ File operations (api.upload, api.download)
- ✅ Auth API methods (authApi.login, authApi.logout, authApi.refreshToken, authApi.getCurrentUser)

**Exports:**

```typescript
export { api, authApi };
```

### 3. Central Export Files

**lib/index.ts:**

```typescript
export {
  apiClient,
  tokenManager,
  getValidToken,
  ApiError,
  NetworkError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  API_BASE_URL,
  type ApiResponse,
} from './api-client';

export { queryClient, queryKeys } from './query-client';
```

**services/index.ts:**

```typescript
export { api, authApi } from './apiService';
export { CMSService } from './cmsService';
```

## Migration Guide

### Import Changes

#### Old Way (Before Refactor)

```typescript
// ❌ Old - Tất cả từ api-client
import { api, authApi, tokenManager, ApiError } from '@/lib/api-client';
```

#### New Way (After Refactor)

```typescript
// ✅ New - Tách riêng
import { api, authApi } from '@/services/apiService';
import { tokenManager, ApiError } from '@/lib/api-client';

// hoặc dùng central exports
import { api, authApi } from '@/services';
import { tokenManager, ApiError } from '@/lib';
```

### Usage Examples

#### 1. API Calls

```typescript
// services/userService.ts
import { api } from './apiService';

export const userService = {
  getUsers: () => api.get<User[]>('users'),
  getUser: (id: string) => api.get<User>(`users/${id}`),
  createUser: (data: CreateUserDto) => api.post<User>('users', data),
};
```

#### 2. Error Handling

```typescript
// components/UserList.tsx
import { api } from '@/services/apiService';
import { ValidationError, NotFoundError } from '@/lib/api-client';

try {
  const user = await api.get<User>('users/123');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation errors:', error.errors);
  } else if (error instanceof NotFoundError) {
    router.navigate('/404');
  }
}
```

#### 3. Authentication

```typescript
// hooks/useAuth.ts
import { authApi } from '@/services/apiService';
import { tokenManager } from '@/lib/api-client';

export function useAuth() {
  const login = async (email: string, password: string) => {
    const { user } = await authApi.login(email, password);
    return user;
  };

  const logout = async () => {
    await authApi.logout();
    tokenManager.clearTokens();
  };

  return { login, logout };
}
```

#### 4. React Query

```typescript
// hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/apiService';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<User[]>('users'),
  });
}
```

#### 5. Custom Ky Instance

```typescript
// services/externalApiService.ts
import { apiClient } from '@/lib/api-client';

// Sử dụng apiClient để tạo custom instance
export const externalApi = apiClient.extend({
  prefixUrl: 'https://external-api.com',
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set('X-API-Key', 'secret');
      },
    ],
  },
});
```

## Lợi ích của refactoring

### 1. Separation of Concerns

- **Config** (lib/api-client.ts): Setup, configuration, error types
- **Service** (services/apiService.ts): Business logic, API calls

### 2. Better Organization

```
lib/          -> Infrastructure, config, utilities
services/     -> Business logic, API calls
hooks/        -> React hooks sử dụng services
components/   -> UI components sử dụng hooks
```

### 3. Easier Testing

```typescript
// Mock chỉ service methods, không cần mock config
vi.mock('@/services/apiService', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));
```

### 4. Clearer Dependencies

```typescript
// Component chỉ import những gì cần
import { api } from '@/services/apiService'; // API calls
import { ValidationError } from '@/lib/api-client'; // Error handling
import { tokenManager } from '@/lib/api-client'; // Token management
```

### 5. Reusability

```typescript
// Có thể tạo nhiều service sử dụng cùng apiClient
import { apiClient } from '@/lib/api-client';

export const userService = {
  getUsers: () => apiClient.get('users').json(),
};

export const postService = {
  getPosts: () => apiClient.get('posts').json(),
};
```

## Files Changed

### Created

- ✅ `services/apiService.ts` - API service methods
- ✅ `services/index.ts` - Services exports
- ✅ `lib/index.ts` - Lib exports
- ✅ `docs/REFACTORING.md` - This file

### Modified

- 🔄 `lib/api-client.ts` - Removed service methods, kept config only
- 🔄 `hooks/useContent.ts` - Updated import from `lib/api-client` to `services/apiService`
- 🔄 `docs/API_CLIENT.md` - Updated documentation with new structure
- 🔄 `docs/DATA_FETCHING.md` - Updated import examples

### No Breaking Changes

- ✅ Tất cả functionality vẫn hoạt động như cũ
- ✅ Chỉ thay đổi import paths
- ✅ API signatures không đổi

## Checklist

- [x] Tách config ra `lib/api-client.ts`
- [x] Tách service methods ra `services/apiService.ts`
- [x] Tạo central export files (`lib/index.ts`, `services/index.ts`)
- [x] Update existing imports (`hooks/useContent.ts`)
- [x] Update documentation (`API_CLIENT.md`, `DATA_FETCHING.md`)
- [x] Verify no type errors
- [x] Verify no lint errors
- [x] Create migration guide

## Next Steps

### Recommended

1. **Tạo specific service files** cho từng domain:

```typescript
// services/userService.ts
import { api } from './apiService';

export const userService = {
  getUsers: () => api.get<User[]>('users'),
  getUser: (id: string) => api.get<User>(`users/${id}`),
  // ...
};

// services/postService.ts
export const postService = {
  getPosts: () => api.get<Post[]>('posts'),
  // ...
};
```

2. **Update existing code** để sử dụng central exports:

```typescript
// Instead of
import { api } from '@/services/apiService';
import { tokenManager } from '@/lib/api-client';

// Use
import { api } from '@/services';
import { tokenManager } from '@/lib';
```

3. **Add tests** cho service layer:

```typescript
// services/apiService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { api } from './apiService';

describe('apiService', () => {
  it('should make GET request', async () => {
    // test implementation
  });
});
```

## References

- [API Client Documentation](./API_CLIENT.md)
- [Data Fetching Guide](./DATA_FETCHING.md)
- [Libraries Setup](./LIBRARIES_SETUP.md)
