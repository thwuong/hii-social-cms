# MediaCarousel Component Documentation

## 📋 Overview

Component carousel để hiển thị nhiều media items (images/videos) cho article content type.

## 🎯 Features

- ✅ **Responsive Carousel** - Navigation với arrows và keyboard
- ✅ **Support Multiple Media Types** - Images và Videos
- ✅ **Lazy Loading** - Optimize performance
- ✅ **Indicator Dots** - Show current position
- ✅ **Media Type Badges** - Visual indicators
- ✅ **Duration Display** - For video content
- ✅ **Media Stats** - Count images/videos
- ✅ **Keyboard Navigation** - Arrow keys support
- ✅ **Video Controls** - Native HTML5 player
- ✅ **Poster Support** - Thumbnail for videos

## 🏗️ Architecture

### Components

```
MediaCarousel (Main Component)
  └─ Carousel (shadcn/ui)
      ├─ CarouselContent
      │   └─ CarouselItem (for each media)
      │       ├─ Video (if video type)
      │       └─ Image (if image type)
      ├─ CarouselPrevious (Navigation arrow)
      └─ CarouselNext (Navigation arrow)
```

### Files

- **`/features/content/components/media-carousel.tsx`** - Main carousel component
- **`/features/content/components/content-body.tsx`** - Integration with content display
- **`/shared/ui/carousel.tsx`** - Base carousel (shadcn/ui with embla-carousel)

## 📦 Props

### MediaCarouselProps

```typescript
interface MediaCarouselProps {
  media: Media[]; // Array of media items
  title?: string; // Optional title for alt text
  className?: string; // Custom classes
}
```

### Media Interface

```typescript
interface Media {
  download_url: string; // Download URL
  duration: number; // Duration in seconds (for videos)
  poster: string; // Thumbnail/poster image
  type: string; // Media type (video, image)
  url: string; // Playback/display URL
}
```

## 💻 Usage

### Basic Usage

```tsx
import { MediaCarousel } from '@/features/content/components';

function MyComponent() {
  const media = [
    {
      url: 'https://example.com/image1.jpg',
      download_url: 'https://example.com/image1.jpg',
      type: 'image',
      duration: 0,
      poster: '',
    },
    {
      url: 'https://example.com/video1.mp4',
      download_url: 'https://example.com/video1.mp4',
      type: 'video',
      duration: 120,
      poster: 'https://example.com/thumb1.jpg',
    },
  ];

  return <MediaCarousel media={media} title="My Content" />;
}
```

### In Content Detail Page

```tsx
import { ContentBody } from '@/features/content/components';

function ContentDetailPage() {
  const content = {
    media_type: MediaType.TEXT, // Article type
    media: [
      // Array of media items
    ],
    // ... other content fields
  };

  return (
    <div>
      <ContentBody content={content} />
      {/* ContentBody automatically renders MediaCarousel for articles */}
    </div>
  );
}
```

### ContentBody Logic

```tsx
function ContentBody({ content }: ContentBodyProps) {
  const isVideo = content.media_type === MediaType.VIDEO;
  const isArticle = content.media_type === MediaType.TEXT;

  // Video/Reel → VideoPlayer
  if (isVideo) {
    return <VideoPlayer url={content.media_url} />;
  }

  // Article with media → MediaCarousel
  if (isArticle && content.media && content.media.length > 0) {
    return <MediaCarousel media={content.media} title={content.title} />;
  }

  // Fallback for other types
  return <div>Unsupported media type</div>;
}
```

## 🎨 Styling

### Theme: Carbon Kinetic

```css
/* Container */
border: 1px solid rgba(255, 255, 255, 0.1);
background: #000000;

/* Badges */
background: rgba(0, 0, 0, 0.8);
border: 1px solid rgba(255, 255, 255, 0.2);
backdrop-filter: blur(8px);

/* Navigation Arrows */
background: rgba(0, 0, 0, 0.8);
border: 1px solid rgba(255, 255, 255, 0.2);
color: white;

/* Hover State */
background: white;
color: black;

/* Indicators */
active: width: 32px, background: white;
inactive: width: 6px, background: #52525b (zinc-600);

/* Text */
font-family: monospace;
text-transform: uppercase;
```

### Custom Styling

```tsx
<MediaCarousel media={media} className="mx-auto max-w-4xl" />
```

## 🔧 Features Detail

### 1. Media Type Detection

```typescript
const isVideo = (mediaItem: Media) => {
  return (
    mediaItem.type === 'video' ||
    mediaItem.url.includes('.mp4') ||
    mediaItem.url.includes('.webm') ||
    mediaItem.url.includes('.m3u8')
  );
};
```

### 2. Video Player

- Native HTML5 `<video>` element
- Controls enabled
- Poster/thumbnail support
- Metadata preload
- Object-contain fit

```tsx
<video
  src={item.url || item.download_url}
  poster={item.poster}
  controls
  preload="metadata"
  className="h-full w-full object-contain"
/>
```

### 3. Image Display

- Lazy loading with `loading="lazy"`
- Alt text support
- Object-contain fit
- Responsive sizing

```tsx
<img
  src={item.url || item.download_url}
  alt={title || `Media ${index + 1}`}
  loading="lazy"
  className="h-full w-full object-contain"
/>
```

### 4. Navigation

**Arrow Buttons:**

- Previous/Next buttons
- Hidden if only 1 media item
- Positioned outside on desktop (`-left-12`, `-right-12`)
- Inside on mobile (`-left-4`, `-right-4`)
- Hover effect: black bg → white bg

**Keyboard:**

- Left Arrow: Previous slide
- Right Arrow: Next slide
- Handled by embla-carousel

**Indicators:**

- Dot for each media item
- Active dot: wider, white
- Inactive dots: smaller, gray
- Click to navigate (future enhancement)

### 5. Media Stats

```tsx
<div className="flex items-center gap-4">
  <div>
    <ImageIcon /> {imageCount} Images
  </div>
  <div>
    <FileVideo /> {videoCount} Videos
  </div>
</div>
```

### 6. Duration Format

```typescript
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Examples:
// 65 → "1:05"
// 120 → "2:00"
// 3661 → "61:01"
```

## 🎯 Empty State

```tsx
if (!media || media.length === 0) {
  return (
    <div className="flex h-96 items-center justify-center border border-white/10 bg-black">
      <Typography variant="small" className="text-zinc-500 uppercase">
        Không có media
      </Typography>
    </div>
  );
}
```

## 🚀 Performance

### Optimization Strategies

1. **Lazy Loading**

   ```tsx
   <img loading="lazy" />
   ```

2. **Video Preload**

   ```tsx
   <video preload="metadata" />
   ```

   Only loads metadata (not full video) until user plays

3. **Carousel Loop**

   ```tsx
   opts={{ loop: true, align: 'start' }}
   ```

4. **Memoization** (Future)
   ```tsx
   const MediaItem = React.memo(({ item }) => {
     /* ... */
   });
   ```

## 📱 Responsive Design

| Breakpoint | Arrow Position          | Indicator Size |
| ---------- | ----------------------- | -------------- |
| Mobile     | `-left-4`, `-right-4`   | Small dots     |
| Desktop    | `-left-12`, `-right-12` | Same           |
| Tablet     | Transition              | Same           |

**Container:**

```tsx
aspect-ratio: 16/9  // Maintain ratio
width: 100%         // Full width
```

## 🐞 Error Handling

### No Media

```tsx
if (!media || media.length === 0) {
  return <EmptyState />;
}
```

### Broken Image/Video

- Browser's native fallback
- Alt text for images
- Video controls show error

### Missing URLs

```tsx
src={item.url || item.download_url}  // Fallback to download_url
```

## ♿ Accessibility

```tsx
// Carousel container
role="region"
aria-roledescription="carousel"

// Carousel items
role="group"
aria-roledescription="slide"

// Navigation buttons
<span className="sr-only">Previous slide</span>
<span className="sr-only">Next slide</span>

// Indicator buttons
aria-label={`Go to slide ${index + 1}`}
```

## 🧪 Testing Checklist

### Visual Testing

- [ ] Images display correctly
- [ ] Videos play with controls
- [ ] Navigation arrows work
- [ ] Indicators show correct position
- [ ] Badges display media type
- [ ] Duration shows for videos
- [ ] Stats count correctly
- [ ] Empty state displays

### Interaction Testing

- [ ] Click prev/next arrows
- [ ] Keyboard arrow keys work
- [ ] Click indicator dots
- [ ] Video controls functional
- [ ] Swipe on mobile (embla default)
- [ ] Loop works (first → last → first)

### Edge Cases

- [ ] Single media item (no nav arrows)
- [ ] Empty media array (empty state)
- [ ] Mixed images + videos
- [ ] All images
- [ ] All videos
- [ ] Very long duration (formatting)
- [ ] Missing poster
- [ ] Broken URLs

### Responsive

- [ ] Desktop (arrows outside)
- [ ] Tablet
- [ ] Mobile (arrows inside)
- [ ] Different aspect ratios

## 🔮 Future Enhancements

### Potential Features

1. **Lightbox/Fullscreen Mode**

   ```tsx
   const [isFullscreen, setIsFullscreen] = useState(false);
   ```

2. **Thumbnails Navigation**

   ```tsx
   <div className="flex gap-2 overflow-x-auto">
     {media.map((item, i) => (
       <button onClick={() => goToSlide(i)}>
         <img src={item.poster} />
       </button>
     ))}
   </div>
   ```

3. **Zoom on Images**

   ```tsx
   import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
   ```

4. **Download Button**

   ```tsx
   <a href={item.download_url} download>
     <Download /> Download
   </a>
   ```

5. **Share Functionality**

   ```tsx
   const handleShare = () => {
     navigator.share({ url: item.url });
   };
   ```

6. **Auto-play Carousel**

   ```tsx
   opts={{
     loop: true,
     duration: 20  // Auto-advance every 2s
   }}
   ```

7. **Lazy Load Carousel Items**
   - Only render visible + adjacent slides
   - Unload distant slides

8. **Video Quality Selector**
   - Multiple resolutions
   - Adaptive bitrate

## 📚 Dependencies

```json
{
  "embla-carousel-react": "^8.0.0", // Base carousel
  "lucide-react": "^0.xxx", // Icons
  "@/shared/ui": "workspace:*" // UI components
}
```

## 📝 Related Files

- `/features/content/components/media-carousel.tsx` - Main component
- `/features/content/components/content-body.tsx` - Integration
- `/shared/ui/carousel.tsx` - Base carousel (shadcn)
- `/features/content/types/index.ts` - Media type definition

## ✅ Summary

MediaCarousel provides a complete solution for displaying multiple media items in article content:

- **Rich Media Display** - Images and videos
- **Smooth Navigation** - Arrows, keyboard, indicators
- **Modern UI** - Carbon Kinetic theme
- **Performance** - Lazy loading, metadata preload
- **Accessible** - ARIA labels, keyboard support
- **Responsive** - Mobile-friendly
- **Extensible** - Easy to add features

**Perfect for article-based content with media galleries!** 🎉
