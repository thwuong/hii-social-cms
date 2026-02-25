# Shadcn/ui CLI Setup Complete ✅

## Tổng Quan

Đã cấu hình thành công **shadcn/ui CLI** để có thể add components tự động vào project.

## Các Thay Đổi

### 1. Dependencies Đã Cài

```json
{
  "dependencies": {
    "@radix-ui/react-slot": "^1.2.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.4.0"
  }
}
```

### 2. Cấu Hình NPM (.npmrc)

Tạo file `.npmrc` để bypass peer dependency conflicts với ESLint Airbnb config:

```
legacy-peer-deps=true
```

**Lý do**: `eslint-config-airbnb@19.0.4` yêu cầu `eslint-plugin-react-hooks@^4.3.0`, nhưng project đang dùng version 7.0.1.

### 3. Button Component với Slot Pattern

Updated `shared/ui/button.tsx` để support `asChild` prop (Radix UI pattern):

```tsx
import { Slot } from '@radix-ui/react-slot';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
```

**Use Case**:

```tsx
// Render as button
<Button>Click me</Button>

// Render as Link (TanStack Router)
<Button asChild>
  <Link to="/dashboard">Go to Dashboard</Link>
</Button>
```

### 4. Label Component (Test)

Đã test thành công việc add component mới:

```bash
npx shadcn@latest add label --yes
```

Component được tạo tại: `shared/ui/label.tsx`

### 5. Global CSS Cleanup

Removed `@import "tw-animate-css"` từ `styles/global.css` (package không tồn tại).

### 6. ESLint Config Update

Updated `.eslintrc.json` để improve dependency resolution:

```json
{
  "rules": {
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": [...],
        "packageDir": "./"
      }
    ]
  }
}
```

## Cách Sử Dụng Shadcn CLI

### Add Component Mới

```bash
# List all available components
npx shadcn@latest add

# Add specific component
npx shadcn@latest add [component-name] --yes

# Examples
npx shadcn@latest add button --yes
npx shadcn@latest add input --yes
npx shadcn@latest add dialog --yes
npx shadcn@latest add form --yes
```

### Component Paths

Components sẽ được tạo tự động tại: `shared/ui/[component-name].tsx`

Aliases được config trong `components.json`:

```json
{
  "aliases": {
    "components": "@/shared/ui",
    "utils": "@/lib/utils",
    "ui": "@/shared/ui"
  }
}
```

### Import Components

```tsx
// From shared/ui index
import { Button, Label, Input } from '@/shared/ui';

// Or directly
import { Button } from '@/shared/ui/button';
```

## Verification

✅ **Build**: `npm run build` - SUCCESS  
✅ **Type Check**: `npm run type-check` - PASS  
✅ **CLI**: `npx shadcn@latest add label` - SUCCESS

## Known Issues

### ESLint Warning (Non-blocking)

```
'@radix-ui/react-slot' should be listed in the project's dependencies
```

**Status**: False positive - package đã có trong `package.json` line 27.  
**Impact**: None - TypeScript resolves correctly, build succeeds.  
**Solution**: Ignore warning hoặc disable rule cho specific files.

## Next Steps

1. **Add More Components**: Use CLI để add components khi cần:
   - `form` - Form handling với react-hook-form
   - `table` - Data tables
   - `dropdown-menu` - Menus
   - `toast` - Notifications
   - `sheet` - Side panels

2. **Customize Existing**: Refactor các components hiện tại để match shadcn patterns tốt hơn.

3. **Theme Integration**: Đảm bảo shadcn components sử dụng đúng CSS variables từ `global.css`.

## Resources

- [Shadcn/ui Docs](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [CVA (Class Variance Authority)](https://cva.style/docs)
- [Tailwind Merge](https://github.com/dcastil/tailwind-merge)
