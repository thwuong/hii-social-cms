# Playlist Skeleton Components

## 📋 Overview

Skeleton loading components cho Playlist feature, providing smooth loading states với Carbon Kinetic styling.

## ✨ Components Created

### 1. **PlaylistCardSkeleton**

Skeleton cho individual playlist card

### 2. **PlaylistGridSkeleton**

Grid of playlist card skeletons

### 3. **PlaylistDetailSkeleton**

Full page skeleton cho playlist detail page

### 4. **PlaylistFormSkeleton**

Form skeleton cho playlist form

### 5. **DraggableVideoListSkeleton**

Skeleton cho draggable video list

## 🎯 Component Details

### 1. PlaylistCardSkeleton

**Location:** `features/playlist/components/skeletons/playlist-card-skeleton.tsx`

**Structure:**

```
┌─────────────────────────┐
│ [Thumbnail Skeleton]    │ ← aspect-video
├─────────────────────────┤
│ [Title bar]            │
│ [Meta: count + date]   │
│ [Description lines]    │
├─────────────────────────┤
│ [Action button]        │
└─────────────────────────┘
```

**Usage:**

```tsx
import { PlaylistCardSkeleton } from '@/features/playlist/components';

<PlaylistCardSkeleton />;
```

### 2. PlaylistGridSkeleton

**Location:** `features/playlist/components/skeletons/playlist-card-skeleton.tsx`

**Props:**

```typescript
{ count?: number } // Default: 6
```

**Structure:**

```
Grid: 1 col (mobile) → 2 cols (md) → 3 cols (lg)

┌───────┐ ┌───────┐ ┌───────┐
│ Card  │ │ Card  │ │ Card  │
└───────┘ └───────┘ └───────┘
┌───────┐ ┌───────┐ ┌───────┐
│ Card  │ │ Card  │ │ Card  │
└───────┘ └───────┘ └───────┘
```

**Usage:**

```tsx
import { PlaylistGridSkeleton } from '@/features/playlist/components';

// Default 6 cards
<PlaylistGridSkeleton />

// Custom count
<PlaylistGridSkeleton count={8} />
```

### 3. PlaylistDetailSkeleton

**Location:** `features/playlist/components/skeletons/playlist-detail-skeleton.tsx`

**Structure:**

```
┌──────────────────────────────────────────────────────┐
│ [←] [Title bar]                                      │
├──────────────────────┬───────────────────────────────┤
│ LEFT COLUMN          │ RIGHT COLUMN                  │
│                      │                               │
│ [Video Player]       │ [Form Container]              │
│                      │  • Name field                 │
│ [Video Info]         │  • Description field          │
│  • Title             │  • Thumbnail upload           │
│  • Duration + Date   │  • [Save] [Cancel]            │
│                      │                               │
│ [Video List Header]  │                               │
│ [Video Item 1]       │                               │
│ [Video Item 2]       │                               │
│ [Video Item 3]       │                               │
│ [Video Item 4]       │                               │
└──────────────────────┴───────────────────────────────┘
```

**Features:**

- 2-column grid layout (responsive)
- Video player area with play icon
- Video info section
- 4 video list items
- Form with all fields

**Usage:**

```tsx
import { PlaylistDetailSkeleton } from '@/features/playlist/components';

function PlaylistDetailPage() {
  const { data, isLoading } = usePlaylist(id);

  if (isLoading) {
    return <PlaylistDetailSkeleton />;
  }

  return <div>...</div>;
}
```

### 4. PlaylistFormSkeleton

**Location:** `features/playlist/components/skeletons/playlist-form-skeleton.tsx`

**Structure:**

```
┌─────────────────────────┐
│ [Label]                 │
│ [Name Input]            │
├─────────────────────────┤
│ [Label]                 │
│ [Description Textarea]  │
├─────────────────────────┤
│ [Label]                 │
│ [Thumbnail Upload Area] │
├─────────────────────────┤
│ [Video count info]      │
└─────────────────────────┘
```

**Usage:**

```tsx
import { PlaylistFormSkeleton } from '@/features/playlist/components';

<PlaylistFormSkeleton />;
```

### 5. DraggableVideoListSkeleton

**Location:** `features/playlist/components/skeletons/draggable-video-list-skeleton.tsx`

**Props:**

```typescript
{ count?: number } // Default: 5
```

**Structure:**

```
┌─────────────────────────────────────────────┐
│ [⋮] [Thumb] [Title        ] [▶] [✕]       │
├─────────────────────────────────────────────┤
│ [⋮] [Thumb] [Title        ] [▶] [✕]       │
├─────────────────────────────────────────────┤
│ [⋮] [Thumb] [Title        ] [▶] [✕]       │
└─────────────────────────────────────────────┘
```

**Features:**

- Drag handle skeleton
- Thumbnail skeleton (16:9)
- Title + meta info
- Action buttons (play + remove)

**Usage:**

```tsx
import { DraggableVideoListSkeleton } from '@/features/playlist/components';

// Default 5 items
<DraggableVideoListSkeleton />

// Custom count
<DraggableVideoListSkeleton count={10} />
```

## 💻 Integration

### Playlist List Page

**Before:**

```tsx
// Basic skeleton
{
  isLoading && (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-80 animate-pulse bg-zinc-900" />
      ))}
    </div>
  );
}
```

**After:**

```tsx
import { PlaylistGridSkeleton } from '../components';

{
  isLoading && <PlaylistGridSkeleton count={8} />;
}
```

### Playlist Detail Page

**Before:**

```tsx
// No loading state
return <div>{/* Content */}</div>;
```

**After:**

```tsx
import { PlaylistDetailSkeleton } from '../components';

if (isLoading) {
  return <PlaylistDetailSkeleton />;
}

if (!playlist) {
  return <div>Not Found</div>;
}

return <div>{/* Content */}</div>;
```

## 🎨 Styling (Carbon Kinetic)

### Color Palette

```css
/* Background colors */
.bg-black      /* Pure black for empty areas */
.bg-zinc-900   /* Card/container background */
.bg-zinc-800   /* Skeleton bars/shapes */

/* Border colors */
.border-white/10  /* Default border */
.border-white/20  /* Emphasized border */
```

### Animation

```css
/* Pulse animation (Tailwind built-in) */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

### Aspect Ratios

- **Video thumbnails:** `aspect-video` (16:9)
- **Player area:** `aspect-video` (16:9)
- **Upload area:** `h-40` (fixed height)

## 🔄 Loading States

### Page Load Sequence

```
1. User navigates to /playlists
   ↓
2. PlaylistGridSkeleton renders
   ↓
3. API fetches playlists
   ↓
4. Data arrives
   ↓
5. Replace skeleton with actual cards
```

### Detail Page Load Sequence

```
1. User clicks playlist
   ↓
2. Navigate to /playlists/:id
   ↓
3. PlaylistDetailSkeleton renders
   ↓
4. API fetches playlist details
   ↓
5. Data arrives
   ↓
6. Replace skeleton with actual content
```

## 📦 Export Structure

### Barrel Export

```typescript
// features/playlist/components/skeletons/index.ts
export { PlaylistCardSkeleton, PlaylistGridSkeleton } from './playlist-card-skeleton';

export { PlaylistDetailSkeleton } from './playlist-detail-skeleton';
export { PlaylistFormSkeleton } from './playlist-form-skeleton';
export { DraggableVideoListSkeleton } from './draggable-video-list-skeleton';
```

### Main Export

```typescript
// features/playlist/components/index.ts
export * from './skeletons';
```

### Import Anywhere

```tsx
// From playlist components
import { PlaylistGridSkeleton } from '../components';

// From other features
import { PlaylistGridSkeleton } from '@/features/playlist/components';
```

## 🧪 Testing

### Visual Testing

**Playlist List Page:**

1. Navigate to `/playlists`
2. Observe skeleton grid (8 cards)
3. Wait for data load
4. Skeleton should transition smoothly to cards

**Playlist Detail Page:**

1. Navigate to `/playlists/:id`
2. Observe full page skeleton
3. Check all areas: player, form, video list
4. Wait for data load
5. Skeleton should transition to actual content

### Manual Testing Checklist

- [ ] PlaylistGridSkeleton renders correctly
- [ ] Custom count prop works
- [ ] Responsive grid works (1/2/3 cols)
- [ ] PlaylistDetailSkeleton renders all sections
- [ ] 2-column layout responsive
- [ ] PlaylistFormSkeleton matches actual form
- [ ] DraggableVideoListSkeleton matches actual list
- [ ] Animations smooth (pulse)
- [ ] No layout shift when replacing with real content
- [ ] Colors match Carbon Kinetic theme

## 📊 Performance

### Benefits

✅ **Perceived Performance**

- User sees immediate feedback
- No blank white screen
- Professional loading experience

✅ **Layout Stability**

- Skeleton matches actual content dimensions
- Prevents Cumulative Layout Shift (CLS)
- Smooth transition to real content

✅ **User Experience**

- Clear indication of loading
- Skeleton shows structure of upcoming content
- Reduces perceived wait time

## 🎯 Design Decisions

### Why These Skeletons?

**PlaylistCardSkeleton:**

- Matches PlaylistCard structure exactly
- Shows thumbnail, title, meta, description areas
- Same aspect ratio and spacing

**PlaylistGridSkeleton:**

- Reuses PlaylistCardSkeleton
- Configurable count for different scenarios
- Responsive grid matches actual grid

**PlaylistDetailSkeleton:**

- Comprehensive full-page skeleton
- Shows all major sections
- User knows what to expect

**PlaylistFormSkeleton:**

- Can be used standalone in modals
- Matches PlaylistForm structure
- Reusable for loading states

**DraggableVideoListSkeleton:**

- Matches video item structure
- Shows drag handle, thumbnail, info, actions
- Configurable count

### Animation Choice

**Pulse vs Shimmer:**

- ✅ **Pulse:** Simple, performant, built-in Tailwind
- ❌ **Shimmer:** More complex, requires custom CSS

**Decision:** Use `animate-pulse` for consistency with existing skeleton components (DashboardSkeleton, ContentGridSkeleton)

## 🔗 Related Components

### Playlist Components

- `PlaylistCard` → `PlaylistCardSkeleton`
- `PlaylistForm` → `PlaylistFormSkeleton`
- `DraggableVideoList` → `DraggableVideoListSkeleton`

### Other Skeleton Components

- `DashboardSkeleton` (shared/components/skeletons)
- `ContentGridSkeleton` (shared/components/skeletons)
- `ContentTableSkeleton` (shared/components/skeletons)

## 📝 Best Practices

### 1. Match Actual Component Structure

```tsx
// ✅ Good - Matches actual component
<PlaylistCardSkeleton />
// Renders same sections as PlaylistCard

// ❌ Bad - Generic skeleton
<div className="h-40 animate-pulse bg-zinc-900" />
```

### 2. Use Consistent Colors

```tsx
// ✅ Good - Carbon Kinetic colors
className = 'bg-zinc-900'; // Container
className = 'bg-zinc-800'; // Skeleton bars

// ❌ Bad - Different colors
className = 'bg-gray-200';
```

### 3. Responsive Design

```tsx
// ✅ Good - Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ❌ Bad - Fixed layout
<div className="grid grid-cols-3">
```

### 4. Configurable Count

```tsx
// ✅ Good - Flexible count
<PlaylistGridSkeleton count={8} />

// ❌ Bad - Fixed count
{[...Array(6)].map(...)}
```

## 📄 Files Created

```
features/playlist/components/skeletons/
├── playlist-card-skeleton.tsx       (NEW - 60 lines)
├── playlist-detail-skeleton.tsx     (NEW - 105 lines)
├── playlist-form-skeleton.tsx       (NEW - 40 lines)
├── draggable-video-list-skeleton.tsx (NEW - 40 lines)
└── index.ts                         (NEW - barrel export)
```

## 📊 Stats

### Component Sizes

- **PlaylistCardSkeleton:** ~60 lines
- **PlaylistGridSkeleton:** ~15 lines (reuses card)
- **PlaylistDetailSkeleton:** ~105 lines
- **PlaylistFormSkeleton:** ~40 lines
- **DraggableVideoListSkeleton:** ~40 lines
- **Total:** ~260 lines

### Usage

- ✅ **PlaylistListPage** - Uses PlaylistGridSkeleton
- ✅ **PlaylistDetailPage** - Uses PlaylistDetailSkeleton
- ⏳ **Modals** - Can use PlaylistFormSkeleton

### Performance Impact

- ✅ **Bundle Size:** Minimal (~2KB)
- ✅ **Render Performance:** Fast (simple divs)
- ✅ **Animation Performance:** CSS-based (GPU accelerated)

## 🚀 Future Enhancements

### Possible Improvements

1. **Shimmer Animation:**

```tsx
<div className="animate-shimmer bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800" />
```

2. **Progressive Loading:**

```tsx
// Show header first, then content
<PlaylistDetailSkeleton showHeader />
// After 200ms
<PlaylistDetailSkeleton showAll />
```

3. **Custom Variants:**

```tsx
<PlaylistGridSkeleton variant="compact" count={12} />
<PlaylistGridSkeleton variant="detailed" count={6} />
```

4. **Staggered Animation:**

```tsx
// Cards appear with delay
{
  items.map((_, i) => <PlaylistCardSkeleton key={i} style={{ animationDelay: `${i * 50}ms` }} />);
}
```

## ✅ Implementation Checklist

### Components Created

- ✅ PlaylistCardSkeleton
- ✅ PlaylistGridSkeleton
- ✅ PlaylistDetailSkeleton
- ✅ PlaylistFormSkeleton
- ✅ DraggableVideoListSkeleton
- ✅ Barrel export (index.ts)

### Integration

- ✅ PlaylistListPage (uses PlaylistGridSkeleton)
- ✅ PlaylistDetailPage (uses PlaylistDetailSkeleton)
- ✅ Main components export (index.ts)

### Testing

- ✅ TypeScript: No errors
- ✅ ESLint: No warnings
- ✅ Prettier: Formatted
- ⏳ Visual testing (manual)

## 🎉 Summary

### What Was Created

✅ **5 Skeleton Components:**

1. PlaylistCardSkeleton - Individual card
2. PlaylistGridSkeleton - Grid of cards
3. PlaylistDetailSkeleton - Full page
4. PlaylistFormSkeleton - Form fields
5. DraggableVideoListSkeleton - Video list

✅ **Integration:**

- PlaylistListPage → PlaylistGridSkeleton
- PlaylistDetailPage → PlaylistDetailSkeleton

✅ **Benefits:**

- Smooth loading states
- Professional UX
- Matches actual components
- Responsive design
- Type safe
- Reusable

### Files Modified

- ✅ `features/playlist/components/index.ts` (export added)
- ✅ `features/playlist/pages/playlist-list-page.tsx` (integrated)
- ✅ `features/playlist/pages/playlist-detail-page.tsx` (integrated)

### Files Created

- ✅ `features/playlist/components/skeletons/playlist-card-skeleton.tsx`
- ✅ `features/playlist/components/skeletons/playlist-detail-skeleton.tsx`
- ✅ `features/playlist/components/skeletons/playlist-form-skeleton.tsx`
- ✅ `features/playlist/components/skeletons/draggable-video-list-skeleton.tsx`
- ✅ `features/playlist/components/skeletons/index.ts`
- ✅ `docs/PLAYLIST_SKELETON_COMPONENTS.md`

---

**🎉 Skeleton components sẵn sàng cho smooth loading experience! ⏳**
