# Code Standards & Guidelines

## 📋 Tổng quan

Dự án này sử dụng các công cụ sau để đảm bảo chất lượng code:

- **ESLint** với chuẩn Airbnb - Kiểm tra lỗi và enforce coding style
- **Prettier** - Format code tự động
- **TypeScript** - Type checking
- **Commitlint** - Kiểm tra format của commit message
- **Husky** - Git hooks để tự động check code trước khi commit
- **Lint-staged** - Chỉ lint các file đã thay đổi

## 🚀 Commands

### Linting

```bash
# Kiểm tra lỗi ESLint
npm run lint

# Tự động fix các lỗi ESLint có thể sửa được
npm run lint:fix

# Type checking với TypeScript
npm run type-check
```

### Formatting

```bash
# Format tất cả files
npm run format

# Kiểm tra format (không sửa)
npm run format:check
```

## 📝 Commit Message Convention

Dự án sử dụng [Conventional Commits](https://www.conventionalcommits.org/) với format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: Tính năng mới
- **fix**: Sửa lỗi
- **docs**: Thay đổi documentation
- **style**: Format code (không ảnh hưởng logic)
- **refactor**: Refactor code
- **perf**: Cải thiện performance
- **test**: Thêm hoặc sửa tests
- **build**: Thay đổi build system hoặc dependencies
- **ci**: Thay đổi CI configuration
- **chore**: Các thay đổi khác không ảnh hưởng src hoặc test
- **revert**: Revert commit trước đó

### Ví dụ

```bash
# Good commits
feat(auth): Add login with Google
fix(dashboard): Fix chart rendering issue
docs(readme): Update installation instructions
refactor(routes): Migrate to TanStack Router

# Bad commits (sẽ bị reject)
update code
fix bug
WIP
```

### Rules

- Type phải là lowercase
- Subject không được kết thúc bằng dấu chấm
- Header không được vượt quá 100 ký tự
- Body và footer phải có dòng trống phía trước

## 🔧 ESLint Rules

### Các rules quan trọng

#### React

- `react/react-in-jsx-scope`: OFF - Không cần import React trong React 17+
- `react/jsx-props-no-spreading`: OFF - Cho phép spread props
- `react/require-default-props`: OFF - Không bắt buộc defaultProps

#### TypeScript

- `@typescript-eslint/no-explicit-any`: WARN - Cảnh báo khi dùng `any`
- `@typescript-eslint/no-unused-vars`: WARN - Cảnh báo biến không dùng (cho phép prefix `_`)

#### Import

- Phải dùng extension `.ts`, `.tsx` trong import
- DevDependencies chỉ được import trong test files và config files

#### Console

- `console.log`: WARN - Cảnh báo (nên dùng `console.warn` hoặc `console.error`)

## 🎨 Prettier Configuration

```json
{
  "semi": true, // Dùng dấu chấm phẩy
  "trailingComma": "es5", // Trailing comma theo ES5
  "singleQuote": true, // Dùng single quote
  "printWidth": 100, // Max 100 ký tự mỗi dòng
  "tabWidth": 2, // 2 spaces cho tab
  "useTabs": false, // Dùng spaces thay vì tabs
  "arrowParens": "always" // Luôn có () cho arrow functions
}
```

## 🔄 Git Workflow

### Pre-commit Hook

Khi bạn commit, các bước sau sẽ tự động chạy:

1. **Lint-staged** - Chỉ check các file đã thay đổi
   - Run ESLint và tự động fix
   - Run Prettier và format code
2. Nếu có lỗi không thể tự động fix → commit bị reject

### Commit-msg Hook

Sau khi nhập commit message:

1. **Commitlint** - Kiểm tra format của commit message
2. Nếu không đúng format → commit bị reject

## 💡 Tips

### Ignore ESLint cho một dòng

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = fetchData();
```

### Ignore ESLint cho một file

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
// File content
/* eslint-enable @typescript-eslint/no-explicit-any */
```

### Format code trong VS Code

1. Cài extension: **ESLint** và **Prettier**
2. Thêm vào `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Bypass commit hooks (không khuyến khích)

```bash
# Skip pre-commit hook
git commit --no-verify -m "message"

# Skip commit-msg hook (vẫn chạy pre-commit)
git commit -n -m "message"
```

## 🐛 Troubleshooting

### ESLint báo lỗi "Parsing error"

```bash
# Xóa cache và reinstall
rm -rf node_modules package-lock.json
npm install
```

### Husky hooks không chạy

```bash
# Reinstall husky
rm -rf .husky
npm run prepare
chmod +x .husky/pre-commit .husky/commit-msg
```

### Prettier và ESLint conflict

Prettier config đã được setup để tương thích với ESLint. Nếu vẫn có conflict:

```bash
# Check conflicts
npx eslint-config-prettier .eslintrc.json
```

## 📚 Resources

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
