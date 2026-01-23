# Hii Social CMS

Content Management System cho Hii Social với TanStack Router và chuẩn code Airbnb.

## 🚀 Quick Start

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build
```

## 📋 Available Scripts

### Development

```bash
npm run dev          # Chạy dev server (http://localhost:5173)
npm run build        # Build production
npm run preview      # Preview production build
```

### Code Quality

```bash
npm run lint         # Kiểm tra lỗi ESLint
npm run lint:fix     # Tự động fix lỗi ESLint
npm run format       # Format code với Prettier
npm run format:check # Kiểm tra format
npm run type-check   # TypeScript type checking
```

## 🏗️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **TanStack Router** - Type-safe routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts & visualization
- **Lucide React** - Icons

## 📁 Project Structure

```
├── routes/              # TanStack Router routes
│   ├── root-layout.tsx  # Root layout & router config
│   ├── dashboard.tsx    # Dashboard page
│   ├── content.tsx      # Content list page
│   ├── detail.$contentId.tsx  # Content detail page
│   ├── audit.tsx        # Audit log page
│   └── create.tsx       # Create content page
├── components/          # React components
│   ├── layouts/         # Layout components
│   └── ui/              # UI primitives
├── services/            # Business logic
├── constants.ts         # Constants & mock data
├── types.ts            # TypeScript types
└── App.tsx             # Main app component
```

## 🎨 Code Standards

Dự án sử dụng **Airbnb JavaScript/TypeScript Style Guide** với:

- **ESLint** - Linting với chuẩn Airbnb
- **Prettier** - Code formatting
- **Commitlint** - Conventional commits
- **Husky** - Git hooks
- **Lint-staged** - Pre-commit linting

### Commit Convention

```
<type>(<scope>): <subject>
```

**Types:**

- `feat` - Tính năng mới
- `fix` - Sửa lỗi
- `docs` - Documentation
- `style` - Format code
- `refactor` - Refactor
- `test` - Tests
- `chore` - Maintenance

**Examples:**

```bash
git commit -m "feat(auth): Add login feature"
git commit -m "fix(dashboard): Fix chart rendering"
git commit -m "docs(readme): Update setup guide"
```

## 📚 Documentation

- [`CODE_STANDARDS.md`](./CODE_STANDARDS.md) - Chi tiết về code standards
- [`MIGRATION_NOTES.md`](./MIGRATION_NOTES.md) - TanStack Router migration
- [`SETUP_COMPLETE.md`](./SETUP_COMPLETE.md) - Setup completion guide

## 🔧 VS Code Setup

### Recommended Extensions

1. **ESLint** (dbaeumer.vscode-eslint)
2. **Prettier** (esbenp.prettier-vscode)
3. **TailwindCSS IntelliSense** (bradlc.vscode-tailwindcss)

Settings đã được cấu hình trong `.vscode/settings.json`.

## 🌐 Routes

- `/` - Redirect to dashboard
- `/dashboard` - Tổng quan hệ thống
- `/content` - Danh sách nội dung
- `/content?status=PENDING_REVIEW` - Filter by status
- `/detail/:contentId` - Chi tiết nội dung
- `/audit` - Nhật ký hệ thống
- `/create` - Tạo nội dung mới

## 🎯 Features

- ✅ Dashboard với charts & statistics
- ✅ Content management với filters
- ✅ Detail view với workflow progress
- ✅ Batch operations
- ✅ Audit logging
- ✅ Type-safe routing
- ✅ URL-based navigation
- ✅ Search params support

## 🔐 User Roles

- **EDITOR** - Tạo và chỉnh sửa content
- **REVIEWER** - Review và approve content
- **ADMIN** - Full access

## 📊 Content Workflow

```
DRAFT → PENDING_REVIEW → APPROVED → SCHEDULED → PUBLISHED
                ↓
            REJECTED (có thể edit lại)
```

## 🚦 Git Workflow

### Pre-commit Hook

Tự động chạy khi commit:

1. Lint-staged → ESLint check & fix
2. Prettier → Format code

### Commit-msg Hook

Validate commit message theo Conventional Commits.

## 🐛 Troubleshooting

### Husky hooks không chạy?

```bash
chmod +x .husky/pre-commit .husky/commit-msg
```

### ESLint errors?

```bash
npm run lint:fix
```

### Build errors?

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 License

Private - Hii Social

## 👥 Team

Developed with ❤️ by Hii Social Team

---

**Last Updated:** 2026-01-23
**Version:** 1.0.0
