# User Profile Component

Component hiển thị thông tin user hiện tại với dropdown menu theo Carbon Kinetic style.

## 📦 Cài đặt

```bash
# Fix npm permission nếu cần
sudo chown -R 501:20 "/Users/macos/.npm"

# Cài đặt Radix UI Dropdown Menu
npm install @radix-ui/react-dropdown-menu
```

## ✅ Đã tạo

### 1. Components

- ✅ `shared/ui/dropdown-menu.tsx` - Dropdown menu với Carbon Kinetic style
- ✅ `shared/components/user-profile.tsx` - User profile component
- ✅ `shared/components/index.ts` - Barrel export

### 2. Integration

- ✅ Updated `app/layouts/sidebar.tsx` - Thêm UserProfile vào sidebar
- ✅ Updated `shared/ui/index.ts` - Export dropdown menu
- ✅ Updated `shared/index.ts` - Export components

## 🎨 Carbon Kinetic Style

### UserProfile Component

```typescript
<UserProfile />
```

**Features:**

- **Avatar**: Hiển thị initials (2 chữ cái đầu của tên)
- **Name**: Tên user uppercase với monospace font
- **Role**: Role hiển thị nhỏ hơn, mờ hơn
- **Dropdown**: Chevron icon xoay khi mở
- **Border**: Glow effect khi hover

### Dropdown Menu

```typescript
<DropdownMenu>
  <DropdownMenuTrigger>...</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>ACCOUNT</DropdownMenuLabel>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Style:**

- Background: Black với backdrop blur
- Border: White/10 với glow
- Text: Monospace, uppercase
- Hover: White/10 background
- Animation: Slide in/out từ top

## 🚀 Sử dụng

### Basic Usage

```typescript
import { UserProfile } from '@/shared/components';

function Sidebar() {
  return (
    <aside>
      {/* ... menu items */}

      <div className="mt-auto">
        <UserProfile />
      </div>
    </aside>
  );
}
```

### With Auth Store

Component tự động lấy user từ auth store:

```typescript
// shared/components/user-profile.tsx
const { user, logout } = useAuthStore();

if (!user) {
  return null;
}
```

### Custom Actions

Thêm custom menu items:

```typescript
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button>...</button>
  </DropdownMenuTrigger>

  <DropdownMenuContent>
    <DropdownMenuLabel>ACCOUNT</DropdownMenuLabel>

    <DropdownMenuItem onClick={() => navigate('/profile')}>
      <User size={14} className="mr-2" />
      Profile
    </DropdownMenuItem>

    <DropdownMenuItem onClick={() => navigate('/settings')}>
      <Settings size={14} className="mr-2" />
      Settings
    </DropdownMenuItem>

    <DropdownMenuSeparator />

    <DropdownMenuItem onClick={handleLogout} className="text-red-400">
      <LogOut size={14} className="mr-2" />
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## 💡 Features

### 1. Avatar Display

- Tự động tạo initials từ tên
- Background: white/5 với border
- Monospace font, bold
- Square shape (Carbon style)

```typescript
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
```

### 2. User Info

- **Name**: Bold, uppercase, white
- **Role**: Smaller, muted, uppercase
- Aligned to left

### 3. Dropdown Menu

- **Profile**: Navigate to profile page (coming soon)
- **Settings**: Navigate to settings page (coming soon)
- **Logout**: Logout user và navigate to login

### 4. Logout Flow

```typescript
const handleLogout = () => {
  logout();
  toast.success('LOGGED_OUT', {
    description: 'You have been logged out',
    duration: 2000,
  });
  navigate({ to: '/login' });
};
```

## 🎯 Dropdown Menu API

### Components

```typescript
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
} from '@/shared/ui/dropdown-menu';
```

### DropdownMenuItem Props

```typescript
interface DropdownMenuItemProps {
  onClick?: () => void;
  disabled?: boolean;
  inset?: boolean;
  children: React.ReactNode;
}
```

### DropdownMenuLabel

Used for section headers:

```typescript
<DropdownMenuLabel>SECTION NAME</DropdownMenuLabel>
```

### DropdownMenuSeparator

Horizontal divider:

```typescript
<DropdownMenuSeparator />
```

### DropdownMenuShortcut

Keyboard shortcut display:

```typescript
<DropdownMenuItem>
  Save
  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
</DropdownMenuItem>
```

## 📝 Examples

### 1. Simple Profile

```typescript
function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <Logo />
      <UserProfile />
    </header>
  );
}
```

### 2. With Theme Switcher

```typescript
<DropdownMenu>
  <DropdownMenuTrigger>...</DropdownMenuTrigger>

  <DropdownMenuContent>
    <DropdownMenuLabel>APPEARANCE</DropdownMenuLabel>

    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
      <DropdownMenuRadioItem value="light">
        Light
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="dark">
        Dark
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>

    <DropdownMenuSeparator />

    <DropdownMenuItem onClick={handleLogout}>
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 3. With Notifications

```typescript
<DropdownMenu>
  <DropdownMenuTrigger>
    <button className="relative">
      <User size={20} />
      {hasNotifications && (
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
      )}
    </button>
  </DropdownMenuTrigger>

  <DropdownMenuContent>
    <DropdownMenuLabel>NOTIFICATIONS</DropdownMenuLabel>
    {notifications.map((n) => (
      <DropdownMenuItem key={n.id} onClick={() => handleRead(n.id)}>
        {n.message}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
```

## 🎨 Customization

### Change Avatar Style

```typescript
// Round avatar
<div className="h-10 w-10 rounded-full ...">
  {getInitials(user.name)}
</div>

// With image
{user.avatar ? (
  <img src={user.avatar} alt={user.name} className="h-10 w-10" />
) : (
  <div className="h-10 w-10 ...">
    {getInitials(user.name)}
  </div>
)}
```

### Custom Colors

```typescript
// Success item (green)
<DropdownMenuItem className="text-green-400 focus:bg-green-950/20">
  Active
</DropdownMenuItem>

// Destructive item (red)
<DropdownMenuItem className="text-red-400 focus:bg-red-950/20">
  Delete
</DropdownMenuItem>

// Info item (blue)
<DropdownMenuItem className="text-blue-400 focus:bg-blue-950/20">
  Info
</DropdownMenuItem>
```

### Add Icons

```typescript
import { User, Settings, LogOut, Bell, Mail } from 'lucide-react';

<DropdownMenuItem>
  <Mail size={14} className="mr-2" />
  Messages
</DropdownMenuItem>

<DropdownMenuItem>
  <Bell size={14} className="mr-2" />
  Notifications
</DropdownMenuItem>
```

## 🔧 Files Structure

```
shared/
├── ui/
│   ├── dropdown-menu.tsx    # Radix UI dropdown với Carbon style
│   └── index.ts              # Export dropdown menu
├── components/
│   ├── user-profile.tsx      # User profile component
│   └── index.ts              # Export user profile
└── index.ts                  # Export tất cả
```

## 📚 Reference

- [Radix UI Dropdown Menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu)
- Carbon Kinetic Design System
- [Lucide Icons](https://lucide.dev/)

## ✨ Next Steps

1. ✅ Cài đặt `@radix-ui/react-dropdown-menu`
2. ✅ Test UserProfile trong sidebar
3. ⏳ Implement Profile page
4. ⏳ Implement Settings page
5. ⏳ Add avatar upload feature
6. ⏳ Add theme switcher
7. ⏳ Add notifications menu
