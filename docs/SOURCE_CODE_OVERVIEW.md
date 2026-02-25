# 📚 Tổng Quan Source Code - Hii Social CMS

> **Phiên bản:** 1.0.0  
> **Cập nhật:** 2026-01-29  
> **Mục đích:** Tài liệu hướng dẫn cho Frontend Developer

---

## 📋 Mục Lục

1. [Giới Thiệu](#-giới-thiệu)
2. [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
3. [Cấu Hình Dự Án](#-cấu-hình-dự-án)
4. [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
5. [Các Package Chính](#-các-package-chính)
6. [Design System & Styling](#-design-system--styling)
7. [Routing System](#-routing-system)
8. [State Management](#-state-management)
9. [API Layer](#-api-layer)
10. [Code Quality & Standards](#-code-quality--standards)
11. [Scripts Có Sẵn](#-scripts-có-sẵn)
12. [Đánh Giá Dự Án](#-đánh-giá-dự-án)

---

## 🎯 Giới Thiệu

**Hii Social CMS** là một Content Management System (CMS) được xây dựng với React và công nghệ hiện đại, dùng để quản lý nội dung cho nền tảng Hii Social.

### Đặc điểm chính:

- 🚀 **Modern Stack**: React 18 + TypeScript + Vite
- 🎨 **Dark Theme**: Thiết kế tối ưu với dark mode
- 📦 **Feature-Based Architecture**: Tổ chức theo tính năng
- 🔒 **Type-Safe**: Hoàn toàn type-safe với TypeScript
- 🎯 **Type-Safe Routing**: TanStack Router

---

## 🛠 Công Nghệ Sử Dụng

### Core Technologies

| Công nghệ      | Phiên bản | Mô tả                   |
| -------------- | --------- | ----------------------- |
| **React**      | ^18.3.1   | UI Library              |
| **TypeScript** | ^5.5.3    | Static Type Checking    |
| **Vite**       | ^5.4.1    | Build Tool & Dev Server |

### UI & Styling

| Công nghệ        | Phiên bản | Mô tả                              |
| ---------------- | --------- | ---------------------------------- |
| **Tailwind CSS** | ^4.1.18   | Utility-first CSS Framework        |
| **Radix UI**     | ^1.4.3    | Headless UI Components             |
| **shadcn/ui**    | -         | Component Library (new-york style) |
| **Lucide React** | ^0.344.0  | Icon Library                       |
| **Recharts**     | ^2.12.0   | Charts & Data Visualization        |

### Data Management

| Công nghệ           | Phiên bản | Mô tả                   |
| ------------------- | --------- | ----------------------- |
| **TanStack Query**  | ^5.90.19  | Server State Management |
| **Zustand**         | ^5.0.10   | Client State Management |
| **React Hook Form** | ^7.71.1   | Form Management         |
| **Zod**             | ^4.3.6    | Schema Validation       |

### Routing & Navigation

| Công nghệ           | Phiên bản | Mô tả             |
| ------------------- | --------- | ----------------- |
| **TanStack Router** | ^1.154.12 | Type-Safe Routing |

### Utilities

| Package                      | Mô tả                       |
| ---------------------------- | --------------------------- |
| **ky**                       | HTTP Client (Fetch wrapper) |
| **date-fns**                 | Date Manipulation           |
| **lodash**                   | Utility Functions           |
| **query-string**             | URL Query String Parsing    |
| **sonner**                   | Toast Notifications         |
| **class-variance-authority** | Component Variants          |
| **clsx**                     | Conditional Classes         |
| **tailwind-merge**           | Merge Tailwind Classes      |

---

## ⚙ Cấu Hình Dự Án

### 1. TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/app/*": ["./app/*"],
      "@/features/*": ["./features/*"],
      "@/shared/*": ["./shared/*"],
      "@/lib/*": ["./lib/*"],
      "@/services/*": ["./services/*"]
    }
  }
}
```

**Path Aliases được hỗ trợ:**

- `@/` → Root thư mục
- `@/app/` → App layer (routes, layouts)
- `@/features/` → Feature modules
- `@/shared/` → Shared components/utilities
- `@/lib/` → Core libraries
- `@/services/` → API services

### 2. Vite Configuration (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      // ... other aliases matching tsconfig
    },
  },
});
```

### 3. Shadcn/UI Configuration (`components.json`)

```json
{
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "styles/global.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/shared/ui",
    "utils": "@/lib/utils",
    "ui": "@/shared/ui",
    "hooks": "@/shared/hooks"
  }
}
```

### 4. Environment Variables

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_BASIC_AUTH=base64_encoded_credentials
```

---

## 📁 Cấu Trúc Thư Mục

```
Hii-social-CMS/
├── 📄 index.html              # Entry HTML
├── 📄 index.tsx               # React Entry Point
├── 📄 App.tsx                 # Root App Component
│
├── 📁 app/                    # Application Layer
│   ├── 📁 guards/             # Route Guards
│   ├── 📁 layouts/            # Layout Components
│   │   ├── root-layout.tsx    # Root Router Config
│   │   ├── main-layout.tsx    # Main App Layout
│   │   └── sidebar.tsx        # Sidebar Navigation
│   └── 📁 routes/             # Route Definitions
│       ├── _root.tsx          # Root Route
│       ├── _auth.tsx          # Auth Layout Route
│       ├── _main.tsx          # Main Layout Route
│       ├── dashboard.tsx      # Dashboard Page
│       ├── content.tsx        # Content List
│       ├── report.tsx         # Report List
│       └── ...                # Other routes
│
├── 📁 features/               # Feature Modules (Domain-Driven)
│   ├── 📁 auth/               # Authentication Feature
│   │   ├── 📁 hooks/          # Auth Hooks
│   │   ├── 📁 pages/          # Auth Pages
│   │   ├── 📁 query-keys/     # React Query Keys
│   │   ├── 📁 schemas/        # Zod Schemas
│   │   ├── 📁 services/       # Auth API Services
│   │   ├── 📁 stores/         # Zustand Stores
│   │   └── 📁 types/          # TypeScript Types
│   │
│   ├── 📁 content/            # Content Management Feature
│   │   ├── 📁 components/     # Feature Components
│   │   ├── 📁 constants/      # Feature Constants
│   │   ├── 📁 hooks/          # Feature Hooks
│   │   ├── 📁 pages/          # Feature Pages
│   │   ├── 📁 query-keys/     # React Query Keys
│   │   ├── 📁 schemas/        # Validation Schemas
│   │   ├── 📁 services/       # API Services
│   │   ├── 📁 stores/         # State Stores
│   │   ├── 📁 types/          # TypeScript Types
│   │   └── 📁 utils/          # Feature Utilities
│   │
│   ├── 📁 dashboard/          # Dashboard Feature
│   ├── 📁 report/             # Report Management
│   ├── 📁 audit/              # Audit Logs
│   └── 📁 error/              # Error Pages
│
├── 📁 shared/                 # Shared Code
│   ├── 📁 components/         # Shared Components
│   ├── 📁 constants/          # Global Constants
│   ├── 📁 hooks/              # Shared Hooks
│   ├── 📁 providers/          # React Providers
│   ├── 📁 types/              # Shared Types
│   ├── 📁 ui/                 # UI Primitives (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   └── 📁 utils/              # Utility Functions
│
├── 📁 lib/                    # Core Libraries
│   ├── api-client.ts          # Ky HTTP Client Config
│   ├── query-client.ts        # React Query Config
│   ├── utils.ts               # Utility Functions
│   └── 📁 types/              # Library Types
│
├── 📁 services/               # Global API Services
│   ├── apiService.ts          # Generic API Service
│   └── cmsService.ts          # CMS Specific Service
│
├── 📁 styles/                 # Global Styles
│   └── global.css             # Tailwind + Custom CSS
│
├── 📁 docs/                   # Documentation
│   ├── API_CLIENT.md
│   ├── DATA_FETCHING.md
│   ├── TOAST_GUIDE.md
│   └── ...
│
└── 📁 .husky/                 # Git Hooks
    ├── pre-commit
    └── commit-msg
```

### Feature Module Structure Pattern

Mỗi feature nên tuân theo cấu trúc:

```
features/<feature-name>/
├── 📁 components/     # Feature-specific components
├── 📁 constants/      # Feature constants
├── 📁 hooks/          # Custom hooks (useXxx)
├── 📁 pages/          # Page components
├── 📁 query-keys/     # React Query keys
├── 📁 schemas/        # Zod validation schemas
├── 📁 services/       # API service functions
├── 📁 stores/         # Zustand state stores
├── 📁 types/          # TypeScript interfaces
├── 📁 utils/          # Utility functions
└── 📄 index.ts        # Public exports
```

---

## 📦 Các Package Chính

### Dependencies

| Package                  | Version   | Purpose              |
| ------------------------ | --------- | -------------------- |
| `react`                  | ^18.3.1   | UI Library           |
| `react-dom`              | ^18.3.1   | React DOM Bindings   |
| `@tanstack/react-query`  | ^5.90.19  | Server State         |
| `@tanstack/react-router` | ^1.154.12 | Type-safe Routing    |
| `zustand`                | ^5.0.10   | Client State         |
| `react-hook-form`        | ^7.71.1   | Form Handling        |
| `@hookform/resolvers`    | ^5.2.2    | Form Validators      |
| `zod`                    | ^4.3.6    | Schema Validation    |
| `ky`                     | ^1.14.2   | HTTP Client          |
| `tailwindcss`            | ^4.1.18   | CSS Framework        |
| `@tailwindcss/vite`      | ^4.1.18   | Tailwind Vite Plugin |
| `@radix-ui/*`            | Various   | Headless UI          |
| `lucide-react`           | ^0.344.0  | Icons                |
| `recharts`               | ^2.12.0   | Charts               |
| `sonner`                 | ^2.0.7    | Toast Notifications  |
| `date-fns`               | ^4.1.0    | Date Utilities       |
| `lodash`                 | ^4.17.23  | Utilities            |

### DevDependencies

| Package                           | Purpose                |
| --------------------------------- | ---------------------- |
| `typescript`                      | Type Checking          |
| `vite`                            | Build Tool             |
| `@vitejs/plugin-react`            | Vite React Plugin      |
| `eslint`                          | Linting                |
| `eslint-config-airbnb`            | Airbnb Style Guide     |
| `eslint-config-airbnb-typescript` | TypeScript Support     |
| `prettier`                        | Code Formatting        |
| `prettier-plugin-tailwindcss`     | Tailwind Class Sorting |
| `husky`                           | Git Hooks              |
| `lint-staged`                     | Pre-commit Linting     |
| `@commitlint/*`                   | Commit Message Linting |

---

## 🎨 Design System & Styling

### Tailwind CSS v4

Dự án sử dụng **Tailwind CSS v4** với cấu hình CSS-first:

```css
/* styles/global.css */
@import 'tailwindcss';

@custom-variant dark (&:is(.dark *));

@layer base {
  :root {
    --radius: 0px;
    --background: oklch(0.02 0 0);
    --foreground: oklch(1 0 0);
    --primary: oklch(1 0 0);
    --secondary: oklch(0.09 0 0);
    --muted: oklch(0.15 0 0);
    --accent: oklch(1 0 0);
    --destructive: oklch(0.62 0.25 27);
    --border: oklch(0.15 0 0);
    --input: oklch(0.09 0 0);
    /* ... */
  }
}

@theme {
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  /* ... */
}
```

### Color Palette

- **Background**: Tối đen (#050505)
- **Foreground**: Trắng
- **Primary**: Trắng trên nền tối
- **Accent**: Gradient & highlighted elements
- **Destructive**: Đỏ (#ff3e3e)

### UI Components (shadcn/ui)

Các components có sẵn trong `shared/ui/`:

- `Badge` - Status badges
- `Button` - Buttons với variants
- `Calendar` - Date picker
- `Card` - Card containers
- `Dialog` - Modal dialogs
- `DropdownMenu` - Dropdown menus
- `Field` - Form fields
- `Input` - Text inputs
- `Label` - Form labels
- `Popover` - Popovers
- `Select` - Select dropdowns
- `Separator` - Dividers
- `Textarea` - Text areas
- `Toaster` - Toast notifications
- `Typography` - Text components

---

## 🛣 Routing System

### TanStack Router Setup

```typescript
// app/layouts/root-layout.tsx
export interface RouterContext {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

export const createAppRouter = (context: RouterContext) => {
  return createRouter({
    routeTree,
    context,
    defaultPreload: 'intent',
    // ...
  });
};
```

### Route Structure

```
/                          → Redirect to /dashboard
/login                     → Login Page
/register                  → Register Page
/dashboard                 → Dashboard (Protected)
/content                   → Content List (Protected)
/content/detail/:contentId → Content Detail (Protected)
/report                    → Report List (Protected)
/report/detail/:reportId   → Report Detail (Protected)
/audit                     → Audit Logs (Protected)
```

### Route File Naming Convention

- `_root.tsx` - Root layout route
- `_auth.tsx` - Auth layout (login, register)
- `_main.tsx` - Main protected layout
- `feature.tsx` - Feature index page
- `feature.detail.$id.tsx` - Dynamic route with params

---

## 💾 State Management

### 1. Server State - TanStack Query

```typescript
// lib/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: false,
    },
  },
});
```

### 2. Client State - Zustand

```typescript
// features/auth/stores/useAuthStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      // actions...
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### Query Keys Pattern

```typescript
// features/content/query-keys/contentKeys.ts
export const contentKeys = {
  all: ['content'] as const,
  lists: () => [...contentKeys.all, 'list'] as const,
  list: (filters: ContentFilters) => [...contentKeys.lists(), filters] as const,
  details: () => [...contentKeys.all, 'detail'] as const,
  detail: (id: string) => [...contentKeys.details(), id] as const,
};
```

---

## 🌐 API Layer

### HTTP Client Configuration (Ky)

```typescript
// lib/api-client.ts
export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000,
  retry: {
    limit: 2,
    methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      /* Add auth token */
    ],
    afterResponse: [
      /* Handle 401, refresh token */
    ],
    beforeError: [
      /* Parse error response */
    ],
  },
});
```

### Error Types

```typescript
export class ApiError extends Error { ... }
export class NetworkError extends Error { ... }
export class ValidationError extends ApiError { ... }
export class UnauthorizedError extends ApiError { ... }
export class ForbiddenError extends ApiError { ... }
export class NotFoundError extends ApiError { ... }
```

### Token Management

- **Access Token**: Stored in Zustand + localStorage
- **Refresh Token**: Automatic refresh on 401
- **Basic Auth**: For login/register endpoints

---

## ✅ Code Quality & Standards

### ESLint Configuration

```json
{
  "extends": [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/jsx-props-no-spreading": "off",
    "import/prefer-default-export": "off"
    // ...
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Commitlint Configuration

```javascript
// commitlint.config.cjs
{
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'build', 'ci', 'chore', 'revert'
    ]],
    'subject-case': [2, 'always', 'sentence-case'],
    'header-max-length': [2, 'always', 100],
  }
}
```

### Git Hooks (Husky)

- **pre-commit**: Chạy lint-staged (ESLint + Prettier)
- **commit-msg**: Validate conventional commits

---

## 📜 Scripts Có Sẵn

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check ESLint errors
npm run lint:fix         # Auto-fix ESLint errors
npm run format           # Format with Prettier
npm run format:check     # Check formatting
npm run type-check       # TypeScript check
```

---

## 📊 Đánh Giá Dự Án

### ✅ Điểm Đã Hoàn Thành Tốt

| Mục                  | Chi tiết                                            | Đánh giá   |
| -------------------- | --------------------------------------------------- | ---------- |
| **Architecture**     | Feature-based structure rõ ràng, tách biệt concerns | ⭐⭐⭐⭐⭐ |
| **TypeScript**       | Strict mode, type-safe routing, proper typing       | ⭐⭐⭐⭐⭐ |
| **State Management** | TanStack Query + Zustand separation                 | ⭐⭐⭐⭐⭐ |
| **Code Standards**   | Airbnb style, ESLint, Prettier đầy đủ               | ⭐⭐⭐⭐⭐ |
| **Git Workflow**     | Husky, lint-staged, commitlint                      | ⭐⭐⭐⭐⭐ |
| **API Layer**        | Ky với error handling, token refresh                | ⭐⭐⭐⭐   |
| **UI Components**    | shadcn/ui integration tốt                           | ⭐⭐⭐⭐   |
| **Documentation**    | Có docs folder với nhiều guides                     | ⭐⭐⭐⭐   |
| **Dark Theme**       | Thiết kế tối đẹp mắt                                | ⭐⭐⭐⭐   |
| **Path Aliases**     | Cấu hình đầy đủ trong TS + Vite                     | ⭐⭐⭐⭐⭐ |

### ⚠️ Mục Cần Cải Thiện

| Mục                        | Vấn đề                            | Đề xuất                               | Priority  |
| -------------------------- | --------------------------------- | ------------------------------------- | --------- |
| **Testing**                | Không có test setup (Jest/Vitest) | Thêm unit tests, integration tests    | 🔴 High   |
| **Error Boundaries**       | Chưa có React Error Boundaries    | Thêm ErrorBoundary components         | 🔴 High   |
| **Accessibility**          | Có warnings nhưng chưa hoàn thiện | Cải thiện a11y cho tất cả components  | 🟡 Medium |
| **Loading States**         | Chưa nhất quán                    | Tạo Skeleton components chuẩn         | 🟡 Medium |
| **i18n**                   | Chưa có internationalization      | Thêm react-intl hoặc next-intl        | 🟡 Medium |
| **SEO**                    | SPA nên không có SSR              | Cân nhắc nếu cần SEO                  | 🟢 Low    |
| **PWA**                    | Chưa có service worker            | Thêm PWA support nếu cần              | 🟢 Low    |
| **Storybook**              | Chưa có component documentation   | Thêm Storybook cho UI components      | 🟡 Medium |
| **Bundle Analysis**        | Chưa có                           | Thêm rollup-plugin-visualizer         | 🟢 Low    |
| **Performance Monitoring** | Chưa có                           | Thêm React DevTools profiling, Sentry | 🟡 Medium |
| **Form Validation UX**     | Cần chuẩn hóa                     | Tạo pattern validation nhất quán      | 🟡 Medium |
| **API Types Generation**   | Manual types                      | Cân nhắc codegen từ OpenAPI/GraphQL   | 🟢 Low    |

### 📈 Recommendations cho Future Development

1. **Testing Setup**

   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom
   ```

2. **Error Boundary Component**

   ```typescript
   // shared/components/ErrorBoundary.tsx
   class ErrorBoundary extends React.Component { ... }
   ```

3. **Storybook Setup**

   ```bash
   npx storybook@latest init
   ```

4. **Bundle Analyzer**

   ```bash
   npm install -D rollup-plugin-visualizer
   ```

5. **Sentry Integration**
   ```bash
   npm install @sentry/react
   ```

---

## 🔗 Tài Liệu Tham Khảo

### Thư mục `/docs`:

- `API_CLIENT.md` - Hướng dẫn sử dụng API Client
- `DATA_FETCHING.md` - Patterns fetching data
- `BATCH_OPERATIONS.md` - Batch operations guide
- `INFINITE_SCROLL.md` - Infinite scroll implementation
- `TOAST_GUIDE.md` - Toast notifications guide
- `SKELETON_LOADING.md` - Skeleton loading patterns
- `VIDEO_PLAYER.md` - Video player component

### External Resources:

- [TanStack Router Docs](https://tanstack.com/router/)
- [TanStack Query Docs](https://tanstack.com/query/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Ky HTTP Client](https://github.com/sindresorhus/ky)

---

> **Note**: Tài liệu này được tạo để hỗ trợ onboarding và development. Cập nhật khi có thay đổi lớn trong architecture hoặc dependencies.
