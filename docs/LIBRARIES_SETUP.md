# Libraries Setup Guide

## HTTP Client & Data Fetching

### Ky HTTP Client

**Version**: `^1.14.2`

**Tại sao chọn Ky?**

- ✅ Nhẹ hơn Axios (chỉ ~10KB)
- ✅ Modern API với Promise-based
- ✅ TypeScript support tốt
- ✅ Built-in retry mechanism
- ✅ Hooks system mạnh mẽ
- ✅ Tự động parse JSON

**Setup**: Đã được config đầy đủ trong `lib/api-client.ts` với:

- Auto retry on failure
- Refresh token mechanism
- Global response handler
- Advanced error handling
- Request/Response interceptors

**Docs**: [API Client Guide](./API_CLIENT.md)

### TanStack Query (React Query)

**Version**: `^5.64.2`

**Tại sao chọn TanStack Query?**

- ✅ Powerful async state management
- ✅ Auto caching & refetching
- ✅ Optimistic updates
- ✅ Infinite queries
- ✅ DevTools tốt
- ✅ TypeScript support tốt

**Setup**: Đã được config trong `lib/query-client.ts`

**Docs**: [Data Fetching Guide](./DATA_FETCHING.md)

### Zustand

**Version**: `^5.0.2`

**Tại sao chọn Zustand?**

- ✅ Đơn giản, dễ học
- ✅ Nhẹ (~1KB)
- ✅ Không cần Provider
- ✅ TypeScript support tốt
- ✅ Middleware system (persist, devtools)

**Setup**:

- `stores/useAuthStore.ts` - Auth state
- `stores/useUIStore.ts` - UI state

**Usage**:

```typescript
import { useAuthStore } from '@/stores/useAuthStore';

function Component() {
  const { user, setUser } = useAuthStore();
  // ...
}
```

## Routing

### TanStack Router

**Version**: `^1.94.4`

**Tại sao chọn TanStack Router?**

- ✅ Type-safe routing
- ✅ Nested routes
- ✅ Route loaders
- ✅ Search params validation
- ✅ DevTools tốt

**Setup**:

- `routes/` - Route components
- `routes/root-layout.tsx` - Root route & router config

**Docs**: [Migration Notes](./MIGRATION_NOTES.md)

## UI Components

### Radix UI

**Primitives**: `@radix-ui/react-*`

**Tại sao chọn Radix UI?**

- ✅ Unstyled, accessible components
- ✅ Composable
- ✅ TypeScript support
- ✅ WAI-ARIA compliant

**Components được sử dụng**:

- `@radix-ui/react-dialog` - Modal/Dialog
- `@radix-ui/react-dropdown-menu` - Dropdown
- `@radix-ui/react-select` - Select
- `@radix-ui/react-tabs` - Tabs
- `@radix-ui/react-tooltip` - Tooltip

### Lucide React

**Version**: `^0.469.0`

**Tại sao chọn Lucide?**

- ✅ Modern icon library
- ✅ Tree-shakeable
- ✅ Consistent design
- ✅ TypeScript support

**Usage**:

```typescript
import { User, Settings, LogOut } from 'lucide-react';

<User size={20} />
```

## Development Tools

### Vite

**Version**: `^6.0.5`

**Tại sao chọn Vite?**

- ✅ Cực nhanh (HMR instant)
- ✅ Native ESM
- ✅ TypeScript support
- ✅ Plugin ecosystem tốt

**Config**: `vite.config.ts`

### TypeScript

**Version**: `^5.7.3`

**Config**: `tsconfig.json`

- Strict mode enabled
- Path aliases configured (`@/*`)

### ESLint + Prettier

**ESLint**: `^9.18.0`  
**Prettier**: `^3.4.2`

**Setup**:

- `.eslintrc.json` - ESLint config (Airbnb standard)
- `.prettierrc` - Prettier config
- `.husky/` - Git hooks

**Docs**: [Code Standards](./CODE_STANDARDS.md)

### Commitlint

**Version**: `^19.6.1`

**Setup**: `commitlint.config.cjs`

**Format**: Conventional Commits

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

## Package Manager

**npm**: Đang sử dụng npm (có `package-lock.json`)

**Lưu ý**: Không mix package managers (npm/yarn/pnpm)

## Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format with Prettier
npm run format:check     # Check formatting
npm run type-check       # Check TypeScript types

# Git Hooks (tự động chạy)
npm run prepare          # Setup Husky
```

## Environment Variables

```bash
# .env
VITE_API_URL=https://api.example.com
```

**Lưu ý**:

- Vite env vars phải prefix với `VITE_`
- File `.env.example.txt` chứa template

## Migration Notes

### Từ Tab-based sang TanStack Router

Đã migrate từ tab-based navigation sang TanStack Router. Chi tiết xem [Migration Notes](./MIGRATION_NOTES.md)

### Từ Axios sang Ky

Nếu có code cũ dùng Axios:

```typescript
// Old (Axios)
const response = await axios.get('/users');
const users = response.data;

// New (Ky)
const users = await api.get<User[]>('users');
```

Chi tiết xem [API Client Guide](./API_CLIENT.md)

## Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## Troubleshooting

### Port đã được sử dụng

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Node modules bị lỗi

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors sau khi update

```bash
# Restart TS server trong VS Code
Cmd + Shift + P -> "TypeScript: Restart TS Server"
```

### Git hooks không chạy

```bash
# Reinstall Husky
npm run prepare
chmod +x .husky/*
```

## References

- [Ky](https://github.com/sindresorhus/ky)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Radix UI](https://www.radix-ui.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
