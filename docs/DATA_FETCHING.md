# Data Fetching Guide

## Tổng quan

Project sử dụng **Ky** làm HTTP client và **TanStack Query** (React Query) để quản lý server state.

## Stack

- **Ky**: HTTP client nhẹ, hiện đại với TypeScript support tốt
- **TanStack Query**: Powerful async state management
- **Zustand**: Client state management (auth, UI state)

## Ky HTTP Client

### Features

✅ **Auto Retry**: Tự động retry khi request thất bại  
✅ **Refresh Token**: Tự động làm mới token khi hết hạn  
✅ **Global Response Handler**: Xử lý response toàn cục  
✅ **Advanced Error Handling**: Custom error types cho từng trường hợp  
✅ **Request/Response Interceptors**: Interceptors mạnh mẽ  
✅ **Type Safety**: Đầy đủ TypeScript types

### Basic Usage

```typescript
import { api } from '@/services/apiService';
// hoặc
import { api } from '@/services';

// GET request
const users = await api.get<User[]>('users');

// POST request
const newUser = await api.post<User>('users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// PUT request
const updated = await api.put<User>('users/123', {
  name: 'Jane Doe',
});

// DELETE request
await api.delete('users/123');

// Upload file
const formData = new FormData();
formData.append('file', file);
await api.upload('upload', formData);

// Download file
const blob = await api.download('files/123');
```

### Error Handling

```typescript
import { api } from '@/services/apiService';
import {
  ApiError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  NetworkError,
} from '@/lib/api-client';

try {
  const user = await api.get<User>('users/123');
} catch (error) {
  if (error instanceof ValidationError) {
    // Xử lý lỗi validation (422)
    console.log('Errors:', error.errors);
    // { email: ['Invalid email'], name: ['Required'] }
  } else if (error instanceof UnauthorizedError) {
    // Redirect to login (401)
    router.navigate('/login');
  } else if (error instanceof NotFoundError) {
    // Show 404 page (404)
    router.navigate('/404');
  } else if (error instanceof NetworkError) {
    // Show offline message
    toast.error('Network error, please check connection');
  } else if (error instanceof ApiError) {
    // Generic API error
    toast.error(error.message);
  }
}
```

### Authentication

```typescript
import { authApi } from '@/services/apiService';
import { tokenManager } from '@/lib/api-client';

// Login
const { user, access_token, refresh_token } = await authApi.login('user@example.com', 'password');

// Get current user
const user = await authApi.getCurrentUser();

// Logout
await authApi.logout();

// Manual token management
tokenManager.setTokens('access-token', 'refresh-token');
const token = tokenManager.getAccessToken();
tokenManager.clearTokens();
```

## TanStack Query

### Setup

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Query Hook Pattern

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

// Usage in component
function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Mutation Hook Pattern

```typescript
// hooks/useCreateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/apiService';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => api.post<User>('users', data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      if (error instanceof ValidationError) {
        toast.error(error.message);
      }
    },
  });
}

// Usage in component
function CreateUserForm() {
  const createUser = useCreateUser();

  const handleSubmit = (data: CreateUserDto) => {
    createUser.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Query with Parameters

```typescript
// hooks/useUser.ts
export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => api.get<User>(`users/${id}`),
    enabled: !!id, // Only run if id exists
  });
}

// hooks/useUsers.ts with filters
export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () =>
      api.get<User[]>('users', {
        searchParams: filters,
      }),
  });
}
```

### Infinite Query

```typescript
// hooks/useInfiniteUsers.ts
export function useInfiniteUsers() {
  return useInfiniteQuery({
    queryKey: ['users', 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<User>>('users', {
        searchParams: { page: pageParam, limit: 20 },
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
}

// Usage
function InfiniteUserList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteUsers();

  return (
    <>
      {data?.pages.map((page) =>
        page.data.map((user) => <UserCard key={user.id} user={user} />)
      )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </>
  );
}
```

### Optimistic Updates

```typescript
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      api.put<User>(`users/${id}`, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users', id] });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>(['users', id]);

      // Optimistically update
      queryClient.setQueryData<User>(['users', id], (old) => ({
        ...old!,
        ...data,
      }));

      return { previousUser };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(['users', variables.id], context.previousUser);
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
}
```

### Prefetching

```typescript
// Prefetch on hover
function UserCard({ userId }: { userId: string }) {
  const queryClient = useQueryClient();

  const prefetchUser = () => {
    queryClient.prefetchQuery({
      queryKey: ['users', userId],
      queryFn: () => api.get<User>(`users/${userId}`),
    });
  };

  return (
    <Link to={`/users/${userId}`} onMouseEnter={prefetchUser}>
      View User
    </Link>
  );
}

// Prefetch on route load
export const userRoute = createRoute({
  path: '/users/$userId',
  loader: ({ params, context }) => {
    context.queryClient.ensureQueryData({
      queryKey: ['users', params.userId],
      queryFn: () => api.get<User>(`users/${params.userId}`),
    });
  },
});
```

## Zustand for Client State

```typescript
// stores/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),
      logout: () =>
        set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Usage
function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header>
      <span>{user?.name}</span>
      <button onClick={logout}>Logout</button>
    </header>
  );
}
```

## Best Practices

### 1. Tách Service Layer

```typescript
// services/userService.ts
import { api } from './apiService';

export const userService = {
  getUsers: (filters?: UserFilters) => api.get<User[]>('users', { searchParams: filters }),
  getUser: (id: string) => api.get<User>(`users/${id}`),
  createUser: (data: CreateUserDto) => api.post<User>('users', data),
  updateUser: (id: string, data: UpdateUserDto) => api.put<User>(`users/${id}`, data),
  deleteUser: (id: string) => api.delete(`users/${id}`),
};

// hooks/useUsers.ts
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
  });
}
```

### 2. Query Key Factory

```typescript
// lib/query-keys.ts
export const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: UserFilters) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  posts: {
    all: ['posts'] as const,
    // ...
  },
};

// Usage
useQuery({
  queryKey: queryKeys.users.detail(userId),
  queryFn: () => userService.getUser(userId),
});

// Invalidate all user queries
queryClient.invalidateQueries({ queryKey: queryKeys.users.all });

// Invalidate specific user
queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
```

### 3. Error Boundary

```typescript
// components/ErrorBoundary.tsx
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ReactErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              <h2>Something went wrong</h2>
              <pre>{error.message}</pre>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
        >
          {children}
        </ReactErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

### 4. Loading States

```typescript
// components/UserList.tsx
function UserList() {
  const { data, isLoading, isFetching, error } = useUsers();

  // Initial loading
  if (isLoading) {
    return <Skeleton count={5} />;
  }

  // Error state
  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      {/* Background refetch indicator */}
      {isFetching && <RefetchingIndicator />}

      <ul>
        {data?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
}
```

### 5. Dependent Queries

```typescript
function UserProfile({ userId }: { userId: string }) {
  // First query
  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => userService.getUser(userId),
  });

  // Dependent query - only runs when user.organizationId exists
  const { data: organization } = useQuery({
    queryKey: ['organizations', user?.organizationId],
    queryFn: () => organizationService.getOrganization(user!.organizationId),
    enabled: !!user?.organizationId,
  });

  return (
    <div>
      <h1>{user?.name}</h1>
      {organization && <p>Organization: {organization.name}</p>}
    </div>
  );
}
```

## Testing

### Mock API Client

```typescript
// tests/mocks/api.ts
import { vi } from 'vitest';

export const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

vi.mock('@/services/apiService', () => ({
  api: mockApi,
}));
```

### Test Query Hook

```typescript
// hooks/useUsers.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers } from './useUsers';
import { mockApi } from '@/tests/mocks/api';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useUsers', () => {
  it('should fetch users', async () => {
    const mockUsers = [{ id: '1', name: 'John' }];
    mockApi.get.mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockUsers);
  });
});
```

## References

- [Ky Documentation](https://github.com/sindresorhus/ky)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [API Client Guide](./API_CLIENT.md)
