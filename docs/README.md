# 📚 Hii Social CMS - Documentation

Tài liệu đầy đủ về dự án Hii Social CMS.

## 📖 Table of Contents

1. [Setup & Installation](#setup--installation)
2. [Architecture Overview](#architecture-overview)
3. [Documentation Files](#documentation-files)
4. [Quick Start Guides](#quick-start-guides)

## 🚀 Setup & Installation

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone repository
git clone <repo-url>
cd Hii-social-CMS

# Install dependencies
npm install

# Copy env example
cp env.example.txt .env.local

# Start development server
npm run dev
```

## 🏗️ Architecture Overview

### Tech Stack

**Core:**

- React 18 + TypeScript
- TanStack Router (Type-safe routing)
- Vite (Build tool)
- Tailwind CSS

**Data Fetching & State:**

- Ky (HTTP client)
- React Query / TanStack Query (Server state)
- Zustand (Client state)

**Code Quality:**

- ESLint (Airbnb config)
- Prettier
- Commitlint
- Husky (Git hooks)
- Lint-staged

**Charts & UI:**

- Recharts
- Lucide React (Icons)

### Project Structure

```
src/
├─ app/                    # App shell (router, layouts, guards)
│  ├─ router.tsx           # TanStack Router setup
│  ├─ routes/              # Route definitions
│  ├─ layouts/             # Layout theo role
│  ├─ guards/              # Auth / Role guards
│  └─ providers.tsx
│
├─ features/               # 🔥 Feature-based
│  ├─ reels/
│  ├─ moderation/
│  ├─ publish/
│  ├─ analytics/
│  └─ auth/
│
├─ shared/                 # Dùng chung thật sự
│  ├─ ui/
│  ├─ hooks/
│  ├─ utils/
│  └─ types/
│
├─ lib/                    # Infrastructure
│  ├─ api.ts
│  ├─ auth.ts
│  ├─ queryClient.ts
│  └─ config.ts
│
├─ styles/
└─ main.tsx
└── docs/               # Documentation
```

## 📚 Documentation Files

### Setup & Configuration

- **[LIBRARIES_SETUP.md](./LIBRARIES_SETUP.md)** - Ky, React Query, Zustand setup
- **[DATA_FETCHING.md](./DATA_FETCHING.md)** - Chi tiết về data fetching patterns
- **[MIGRATION_NOTES.md](./MIGRATION_NOTES.md)** - TanStack Router migration notes

### Code Standards

- **[CODE_STANDARDS.md](../CODE_STANDARDS.md)** - Coding standards & ESLint rules
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Setup completion summary

## 🎯 Quick Start Guides

### 1. Making API Calls

```typescript
import { api } from './lib/api-client';

// GET
const users = await api.get<User[]>('users');

// POST
const newUser = await api.post<User>('users', { name: 'John' });

// With params
const filtered = await api.get<User[]>('users', {
  searchParams: { role: 'admin' },
});
```

### 2. React Query Hooks

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetch data
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.get('users'),
});

// Mutation
const mutation = useMutation({
  mutationFn: (data) => api.post('users', data),
});

await mutation.mutateAsync({ name: 'John' });
```

### 3. Zustand Store

```typescript
import { useAuthStore, useUIStore } from './stores';

// Auth
const { user, login, logout } = useAuthStore();

// UI
const { theme, toggleTheme } = useUIStore();
```

### 4. Creating New Routes

```typescript
// routes/new-page.tsx
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-layout';

export const newPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/new-page',
  component: NewPage,
});

function NewPage() {
  return <div>New Page</div>;
}

// Register in root-layout.tsx
import { newPageRoute } from './new-page';

const routeTree = rootRoute.addChildren([
  // ... other routes
  newPageRoute,
]);
```

### 5. Git Commits

```bash
# Format: <type>(<scope>): <subject>

# Good commits
git commit -m "feat(auth): Add login feature"
git commit -m "fix(dashboard): Fix chart rendering"
git commit -m "docs(readme): Update setup guide"

# Bad commits (will be rejected)
git commit -m "update code"
git commit -m "fix bug"
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Check ESLint errors
npm run lint:fix     # Auto fix ESLint errors
npm run format       # Format with Prettier
npm run format:check # Check formatting
npm run type-check   # TypeScript type checking
```

## 🎨 Features

- ✅ Type-safe routing với TanStack Router
- ✅ URL-based navigation
- ✅ Server state management với React Query
- ✅ Client state management với Zustand
- ✅ Type-safe HTTP client với Ky
- ✅ Auto caching & background refetch
- ✅ Optimistic updates ready
- ✅ DevTools support (React Query & Zustand)
- ✅ Code standards với ESLint Airbnb
- ✅ Auto format với Prettier
- ✅ Git hooks với Husky
- ✅ Commit message validation

## 🐛 Troubleshooting

### Dev server không start?

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ESLint errors?

```bash
npm run lint:fix
```

### Git hooks không chạy?

```bash
chmod +x .husky/pre-commit .husky/commit-msg
```

### React Query không fetch?

Check `enabled` option và query keys.

### Zustand store không persist?

Check localStorage và browser settings.

## 📖 Learning Resources

### Official Docs

- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://github.com/pmndrs/zustand)
- [Ky](https://github.com/sindresorhus/ky)
- [Vite](https://vitejs.dev)

### Style Guides

- [Airbnb JavaScript](https://github.com/airbnb/javascript)
- [Airbnb React](https://github.com/airbnb/javascript/tree/master/react)
- [Conventional Commits](https://www.conventionalcommits.org)

## 💡 Best Practices

1. **Type Safety** - Luôn define types cho data
2. **Query Keys** - Dùng queryKeys factory
3. **Error Handling** - Handle errors gracefully
4. **Loading States** - Provide loading feedback
5. **Optimistic Updates** - Update UI immediately
6. **Code Review** - Review PRs thoroughly
7. **Commits** - Write meaningful commit messages
8. **Documentation** - Document complex logic

## 🚦 Development Workflow

1. Create feature branch
2. Write code following standards
3. Test locally
4. Run `npm run lint:fix`
5. Run `npm run type-check`
6. Commit với conventional commits
7. Push and create PR
8. Code review
9. Merge to main

## 📝 Contributing

1. Follow code standards in `CODE_STANDARDS.md`
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation
5. Keep PRs focused and small

## 📞 Support

For questions or issues:

- Check documentation first
- Search existing issues
- Create new issue với detailed description

---

**Maintained by:** Hii Social Team  
**Last Updated:** 2026-01-23  
**Version:** 1.0.0
