# MediaCarousel Component - Dynamic Size

## 📋 Overview

MediaCarousel component với dynamic sizing - hỗ trợ nhiều aspect ratios, flexible sizing, và customizable dimensions.

## ✨ Features

### Dynamic Sizing Options

**Aspect Ratios:**

- ✅ `square` - 1:1
- ✅ `video` - 16:9
- ✅ `portrait` - 9:16 (default)
- ✅ `landscape` - 16:9
- ✅ `ultrawide` - 21:9
- ✅ `custom` - Custom ratio (e.g., "4/3")

**Size Variants:**

- ✅ `sm` - Max 300px
- ✅ `md` - Max 400px
- ✅ `lg` - Max 500px
- ✅ `xl` - Max 600px
- ✅ `full` - 100% height
- ✅ `auto` - Auto height

**Custom Dimensions:**

- ✅ Custom height (px, vh, rem, etc.)
- ✅ Custom width (px, %, vw, etc.)
- ✅ Object fit options

**Display Options:**

- ✅ Indicator dots (default)
- ✅ Counter (e.g., "1 / 5")
- ✅ Hide indicators

## 🎯 Props

```typescript
interface MediaCarouselProps {
  // Required
  media: Media[];

  // Optional
  title?: string;
  className?: string;

  // Sizing
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'ultrawide' | 'custom';
  customAspectRatio?: string; // e.g., '4/3', '3/2'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'auto';
  height?: string; // e.g., '400px', '50vh'
  width?: string; // e.g., '600px', '80%'

  // Display
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  showIndicators?: boolean; // default: true
  showCounter?: boolean; // default: false
}
```

## 💻 Usage Examples

### 1. Default (Portrait 9:16)

```tsx
import { MediaCarousel } from '@/features/content/components';

<MediaCarousel media={media} />;
```

**Result:**

- Aspect ratio: 9:16 (portrait)
- Size: Full height
- Indicators: Yes
- Object fit: Cover

---

### 2. Square với Medium Size

```tsx
<MediaCarousel media={media} aspectRatio="square" size="md" />
```

**Result:**

- Aspect ratio: 1:1 (square)
- Size: Max 400px height
- Indicators: Yes

---

### 3. Video (16:9) với Custom Height

```tsx
<MediaCarousel media={media} aspectRatio="video" height="500px" />
```

**Result:**

- Aspect ratio: 16:9 (video)
- Height: 500px
- Width: 100%

---

### 4. Custom Aspect Ratio (4:3)

```tsx
<MediaCarousel media={media} aspectRatio="custom" customAspectRatio="4/3" />
```

**Result:**

- Aspect ratio: 4:3 (custom)
- Size: Full

---

### 5. Landscape với Counter

```tsx
<MediaCarousel media={media} aspectRatio="landscape" showCounter />
```

**Result:**

- Aspect ratio: 16:9 (landscape)
- Shows "1 / 5" counter
- No indicator dots

---

### 6. Small Size với Contain

```tsx
<MediaCarousel media={media} aspectRatio="square" size="sm" objectFit="contain" />
```

**Result:**

- Aspect ratio: 1:1
- Size: Max 300px
- Object fit: Contain (no crop)

---

### 7. Custom Dimensions

```tsx
<MediaCarousel media={media} aspectRatio="video" height="60vh" width="800px" />
```

**Result:**

- Aspect ratio: 16:9
- Height: 60% viewport
- Width: 800px fixed

---

### 8. Ultrawide với No Indicators

```tsx
<MediaCarousel media={media} aspectRatio="ultrawide" showIndicators={false} />
```

**Result:**

- Aspect ratio: 21:9 (ultrawide)
- No indicators
- Clean minimal view

---

### 9. Auto Height (Fit Content)

```tsx
<MediaCarousel media={media} aspectRatio="video" size="auto" />
```

**Result:**

- Auto height based on content
- Responsive

---

### 10. Full Width Gallery

```tsx
<MediaCarousel media={media} aspectRatio="landscape" size="full" showCounter className="h-dvh" />
```

**Result:**

- Full width & height
- Landscape images
- Counter display
- Minimum screen height

## 🎨 Visual Examples

### Square (1:1)

```
┌────────┐
│        │
│  IMG   │
│        │
└────────┘
```

### Video (16:9)

```
┌──────────────────┐
│                  │
│       IMG        │
│                  │
└──────────────────┘
```

### Portrait (9:16)

```
┌────────┐
│        │
│        │
│  IMG   │
│        │
│        │
└────────┘
```

### Ultrawide (21:9)

```
┌─────────────────────────────┐
│            IMG              │
└─────────────────────────────┘
```

## 📊 Size Variants

### `sm` - Small (300px)

```tsx
<MediaCarousel media={media} size="sm" />
```

**Use case:** Thumbnails, sidebar previews

### `md` - Medium (400px)

```tsx
<MediaCarousel media={media} size="md" />
```

**Use case:** Card previews, article thumbnails

### `lg` - Large (500px)

```tsx
<MediaCarousel media={media} size="lg" />
```

**Use case:** Featured images, detail views

### `xl` - Extra Large (600px)

```tsx
<MediaCarousel media={media} size="xl" />
```

**Use case:** Hero images, full detail views

### `full` - Full Height

```tsx
<MediaCarousel media={media} size="full" />
```

**Use case:** Full-page galleries

### `auto` - Auto Height

```tsx
<MediaCarousel media={media} size="auto" />
```

**Use case:** Dynamic content, responsive layouts

## 🎯 Object Fit Options

### `cover` (default)

```tsx
<MediaCarousel media={media} objectFit="cover" />
```

- Image fills container
- May crop edges
- Best for consistent layouts

### `contain`

```tsx
<MediaCarousel media={media} objectFit="contain" />
```

- Image fits inside container
- No cropping
- May have letterboxing

### `fill`

```tsx
<MediaCarousel media={media} objectFit="fill" />
```

- Image stretches to fill
- May distort aspect ratio

### `none`

```tsx
<MediaCarousel media={media} objectFit="none" />
```

- Original size
- May overflow

### `scale-down`

```tsx
<MediaCarousel media={media} objectFit="scale-down" />
```

- Smaller of `none` or `contain`

## 📱 Responsive Examples

### Mobile-First Approach

```tsx
<MediaCarousel
  media={media}
  aspectRatio="portrait"
  size="full"
  className="md:aspect-video md:max-h-[500px]"
/>
```

### Adaptive Sizing

```tsx
<MediaCarousel media={media} aspectRatio="square" height="clamp(300px, 50vh, 600px)" />
```

### Viewport-Based

```tsx
<MediaCarousel media={media} aspectRatio="video" height="80vh" width="90vw" />
```

## 🔄 Migration Guide

### Before (Fixed Size)

```tsx
<MediaCarousel media={media} />
// Always 9:16 portrait, full height
```

### After (Dynamic Size)

```tsx
// Same as before (backward compatible)
<MediaCarousel media={media} />

// Or customize
<MediaCarousel
  media={media}
  aspectRatio="video"
  size="md"
/>
```

## 🎨 Use Cases

### 1. Article Detail Page

```tsx
<MediaCarousel media={content.media} aspectRatio="video" size="lg" showCounter />
```

### 2. Content Grid Preview

```tsx
<MediaCarousel media={content.media} aspectRatio="square" size="md" showIndicators={false} />
```

### 3. Full-Screen Gallery

```tsx
<MediaCarousel
  media={content.media}
  aspectRatio="landscape"
  size="full"
  height="100vh"
  showCounter
/>
```

### 4. Sidebar Preview

```tsx
<MediaCarousel media={content.media} aspectRatio="square" size="sm" objectFit="contain" />
```

### 5. Hero Banner

```tsx
<MediaCarousel
  media={heroImages}
  aspectRatio="ultrawide"
  height="70vh"
  objectFit="cover"
  showIndicators={false}
/>
```

## 🎯 Best Practices

### 1. Choose Appropriate Aspect Ratio

```tsx
// Social media posts → square
<MediaCarousel media={media} aspectRatio="square" />

// Videos → video (16:9)
<MediaCarousel media={media} aspectRatio="video" />

// Mobile content → portrait
<MediaCarousel media={media} aspectRatio="portrait" />

// Banners → ultrawide
<MediaCarousel media={media} aspectRatio="ultrawide" />
```

### 2. Use Size Variants for Consistency

```tsx
// Don't mix custom heights everywhere
// Instead, use size variants
<MediaCarousel media={media} size="md" />
```

### 3. Consider Object Fit

```tsx
// Product photos → contain (no crop)
<MediaCarousel media={media} objectFit="contain" />

// Backgrounds → cover (fill space)
<MediaCarousel media={media} objectFit="cover" />
```

### 4. Counter vs Indicators

```tsx
// Many items (10+) → use counter
<MediaCarousel media={manyImages} showCounter />

// Few items (2-5) → use indicators
<MediaCarousel media={fewImages} showIndicators />
```

### 5. Responsive Design

```tsx
// Use Tailwind for responsive aspects
<MediaCarousel
  media={media}
  aspectRatio="portrait"
  className="lg:aspect-ultrawide md:aspect-video"
/>
```

## 🧪 Testing Checklist

### Aspect Ratios

- [ ] Square renders correctly
- [ ] Video (16:9) renders correctly
- [ ] Portrait (9:16) renders correctly
- [ ] Landscape renders correctly
- [ ] Ultrawide renders correctly
- [ ] Custom aspect ratio works

### Sizes

- [ ] sm (300px) works
- [ ] md (400px) works
- [ ] lg (500px) works
- [ ] xl (600px) works
- [ ] full works
- [ ] auto works

### Custom Dimensions

- [ ] Custom height in px works
- [ ] Custom height in vh works
- [ ] Custom width in px works
- [ ] Custom width in % works

### Display

- [ ] Indicators show/hide correctly
- [ ] Counter shows/hide correctly
- [ ] Object fit options work
- [ ] Empty state displays correctly

### Responsive

- [ ] Mobile view works
- [ ] Tablet view works
- [ ] Desktop view works
- [ ] Viewport-based sizing works

## 📊 Performance

### Optimizations

**Lazy Loading:**

- Images load only when visible
- Reduces initial load time

**CSS-Based:**

- No JavaScript for aspect ratios
- Pure CSS transforms
- GPU accelerated

**Responsive:**

- Single component for all sizes
- No duplicate code

## 🎊 Benefits

### Before Refactor

```tsx
// Fixed size only
<MediaCarousel media={media} />
// Always 9:16, full height
```

**Limitations:**

- ❌ Only one aspect ratio
- ❌ Fixed height
- ❌ No size variants
- ❌ Limited customization

### After Refactor

```tsx
// Flexible sizing
<MediaCarousel media={media} aspectRatio="video" size="md" showCounter />
```

**Benefits:**

- ✅ 6 aspect ratio presets + custom
- ✅ 6 size variants + custom
- ✅ Custom dimensions (height/width)
- ✅ Object fit control
- ✅ Counter or indicators
- ✅ Fully customizable
- ✅ Backward compatible

## 📝 Summary

### What Changed

1. **Added aspect ratio prop:**
   - square, video, portrait, landscape, ultrawide, custom

2. **Added size variants:**
   - sm, md, lg, xl, full, auto

3. **Added custom dimensions:**
   - height, width props

4. **Added object fit:**
   - contain, cover, fill, none, scale-down

5. **Added display options:**
   - showIndicators, showCounter

6. **Improved flexibility:**
   - Fully customizable
   - Backward compatible
   - Type-safe props

### Props Overview

```typescript
aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'ultrawide' | 'custom'
customAspectRatio?: string
size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'auto'
height?: string
width?: string
objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
showIndicators?: boolean
showCounter?: boolean
```

### Default Values

```typescript
aspectRatio: 'portrait'; // 9:16
size: 'full'; // 100% height
objectFit: 'cover'; // Fill & crop
showIndicators: true; // Show dots
showCounter: false; // Hide counter
```

---

**🎉 MediaCarousel is now fully dynamic and flexible! 📐**
