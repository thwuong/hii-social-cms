# VideoPlayer Component Documentation

Component để preview video với custom controls sử dụng react-player.

## 📦 **Installation**

```bash
npm install react-player hls.js
```

**Note:** `hls.js` được yêu cầu để hỗ trợ HLS streaming (.m3u8 files).

## 🎯 **Features**

### **Core Features:**

- ✅ Play/Pause control
- ✅ Volume control với slider
- ✅ Mute/Unmute toggle
- ✅ Progress bar với seek functionality
- ✅ Time display (current / total)
- ✅ Fullscreen support
- ✅ Poster/thumbnail image
- ✅ Loading state
- ✅ Error handling với console logging
- ✅ **HLS Streaming support (.m3u8 files)**

### **UI/UX:**

- ✅ Custom controls overlay
- ✅ Controls hiển thị khi hover
- ✅ Gradient overlay từ bottom
- ✅ Smooth transitions
- ✅ Carbon Kinetic styling
- ✅ Responsive aspect ratios

## 🎨 **Component Props**

```typescript
interface VideoPlayerProps {
  url: string; // Video URL (required)
  poster?: string; // Thumbnail/poster image URL
  title?: string; // Video title (for error state)
  className?: string; // Additional CSS classes
  aspectRatio?: 'video' | '9/16' | '16/9' | '1/1'; // Default: '16/9'
}
```

## 💡 **Usage**

### **Basic Usage (MP4):**

```tsx
import { VideoPlayer } from '@/shared/components';

<VideoPlayer
  url="https://example.com/video.mp4"
  poster="https://example.com/thumbnail.jpg"
  title="Video Title"
  aspectRatio="16/9"
/>;
```

### **HLS Streaming (.m3u8):**

```tsx
import { VideoPlayer } from '@/shared/components';

<VideoPlayer
  url="https://example.com/stream.m3u8"
  poster="https://example.com/thumbnail.jpg"
  title="Live Stream"
  aspectRatio="16/9"
/>;
```

**Supported Formats:**

- ✅ HLS (.m3u8) - HTTP Live Streaming
- ✅ MP4 (.mp4) - Standard video
- ✅ WebM (.webm) - Web optimized
- ✅ And more via react-player

### **Different Aspect Ratios:**

```tsx
// Standard video (16:9)
<VideoPlayer
  url={videoUrl}
  aspectRatio="16/9"
/>

// Vertical/Short video (9:16)
<VideoPlayer
  url={videoUrl}
  aspectRatio="9/16"
/>

// Square video (1:1)
<VideoPlayer
  url={videoUrl}
  aspectRatio="1/1"
/>

// Default video aspect
<VideoPlayer
  url={videoUrl}
  aspectRatio="video"
/>
```

### **With Custom Styling:**

```tsx
<VideoPlayer url={videoUrl} poster={thumbnailUrl} className="shadow-lg" aspectRatio="16/9" />
```

## 🎛️ **Controls**

### **Layout:**

```
┌────────────────────────────────────────┐
│                                         │
│           VIDEO CONTENT                 │
│                                         │
│  ┌────────────────────────────────┐   │
│  │ [Progress Bar]                  │   │
│  ├────────────────────────────────┤   │
│  │ [▶️] [🔊] ─── 0:45 / 2:30  [⛶] │   │
│  └────────────────────────────────┘   │
└────────────────────────────────────────┘
```

### **Control Elements:**

#### **1. Play/Pause Button:**

- Icon: Play (▶️) / Pause (⏸)
- Click to toggle playback
- Position: Bottom-left

#### **2. Volume Controls:**

- Mute/Unmute button (🔊 / 🔇)
- Volume slider (0-100%)
- Position: Bottom-left, next to play button

#### **3. Progress Bar:**

- Current progress indicator
- Seekable (click/drag to jump)
- Visual feedback on hover
- Position: Top of controls area

#### **4. Time Display:**

- Format: `MM:SS / MM:SS` or `H:MM:SS / H:MM:SS`
- Shows current time and total duration
- Position: Bottom-left, after volume

#### **5. Fullscreen Button:**

- Icon: Maximize (⛶) / Minimize (⊟)
- Toggle fullscreen mode
- Position: Bottom-right

## 🎨 **Styling**

### **Container:**

```css
.video-player-container {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: black;
}
```

### **Controls Overlay:**

```css
.controls-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 50%, transparent 100%);

  opacity: 0;
  transition: opacity 300ms;
}

.video-player-container:hover .controls-overlay {
  opacity: 1;
}
```

### **Progress Bar:**

```css
.progress-bar {
  height: 4px;
  width: 100%;
  cursor: pointer;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  transition: height 0.2s;
}

.progress-bar:hover {
  height: 6px;
}

/* Dynamic gradient based on progress */
background: linear-gradient(
  to right,
  white 0%,
  white ${played * 100}%,
  rgba(255, 255, 255, 0.2) ${played * 100}%,
  rgba(255, 255, 255, 0.2) 100%
);
```

### **Volume Slider:**

```css
.volume-slider {
  height: 4px;
  width: 64px;
  cursor: pointer;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
}

/* Dynamic gradient based on volume */
background: linear-gradient(
  to right,
  white 0%,
  white ${volume * 100}%,
  rgba(255, 255, 255, 0.2) ${volume * 100}%,
  rgba(255, 255, 255, 0.2) 100%
);
```

### **Control Buttons:**

```css
.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: color 0.2s;
  color: rgba(255, 255, 255, 0.7);
}

.control-button:hover {
  color: white;
}
```

## 🔄 **States**

### **1. Loading State:**

```tsx
{
  !isReady && !hasError && (
    <div className="loading-overlay">
      <div className="loading-indicator">
        <div className="pulse-dot" />
        <span>ĐANG TẢI VIDEO...</span>
      </div>
    </div>
  );
}
```

**Features:**

- Overlay toàn màn hình
- Pulsing dot animation
- Loading text
- Semi-transparent background

### **2. Error State:**

```tsx
{
  hasError && (
    <div className="error-state">
      <AlertTriangle className="error-icon" />
      <Typography>Không thể tải video</Typography>
      {title && <Typography>{title}</Typography>}
    </div>
  );
}
```

**Features:**

- Error icon (AlertTriangle)
- Error message
- Optional video title
- Centered layout

### **3. Ready State:**

Video loaded and ready to play:

- Custom controls visible on hover
- React Player rendering video
- All controls functional

## ⚙️ **Internal State Management**

```typescript
const [playing, setPlaying] = useState(false); // Play/pause state
const [volume, setVolume] = useState(0.8); // Volume (0-1)
const [muted, setMuted] = useState(false); // Mute state
const [played, setPlayed] = useState(0); // Progress (0-1)
const [duration, setDuration] = useState(0); // Total duration (seconds)
const [isFullscreen, setIsFullscreen] = useState(false);
const [isReady, setIsReady] = useState(false); // Video loaded
const [hasError, setHasError] = useState(false); // Error occurred
const [seeking, setSeeking] = useState(false); // User is seeking
```

## 🎯 **Event Handlers**

### **Play/Pause:**

```typescript
const handlePlayPause = () => {
  setPlaying(!playing);
};
```

### **Volume:**

```typescript
const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newVolume = parseFloat(e.target.value);
  setVolume(newVolume);
  setMuted(newVolume === 0);
};

const handleToggleMute = () => {
  setMuted(!muted);
};
```

### **Progress/Seek:**

```typescript
const handleProgress = (state) => {
  if (!seeking) {
    setPlayed(state.played);
  }
};

const handleSeekMouseDown = () => {
  setSeeking(true);
};

const handleSeekChange = (e) => {
  setPlayed(parseFloat(e.target.value));
};

const handleSeekMouseUp = (e) => {
  setSeeking(false);
  playerRef.current?.seekTo(parseFloat(e.target.value));
};
```

### **Fullscreen:**

```typescript
const handleToggleFullscreen = async () => {
  if (!isFullscreen) {
    await containerRef.current?.requestFullscreen();
    setIsFullscreen(true);
  } else {
    await document.exitFullscreen();
    setIsFullscreen(false);
  }
};
```

## 🛠️ **React Player Config**

```typescript
<ReactPlayer
  ref={playerRef}
  url={url}
  playing={playing}
  volume={volume}
  muted={muted}
  width="100%"
  height="100%"
  onReady={handleReady}
  onError={handleError}
  onProgress={handleProgress}
  onDuration={handleDuration}
  onStart={handleStart}
  light={poster}                    // Show poster until play
  playsinline                       // Mobile inline playback
  config={{
    file: {
      forceHLS: true,               // Force HLS for .m3u8 files
      hlsOptions: {
        enableWorker: true,         // Use Web Worker for better performance
        maxBufferLength: 30,        // Maximum buffer length in seconds
        maxMaxBufferLength: 600,    // Maximum max buffer length
      },
    },
  }}
/>
```

### **HLS Configuration:**

- **`forceHLS: true`** - Ensures HLS is used for .m3u8 URLs
- **`enableWorker: true`** - Offloads processing to Web Worker for better performance
- **`maxBufferLength: 30`** - Maintains 30 seconds of buffered content
- **`maxMaxBufferLength: 600`** - Maximum buffer cap at 10 minutes (600 seconds)

### **Benefits:**

- ✅ Smooth HLS streaming
- ✅ Better performance with Web Workers
- ✅ Optimized buffering strategy
- ✅ Reduced memory usage

## 📱 **Responsive Behavior**

### **Aspect Ratios:**

```typescript
const aspectRatioClass = {
  video: 'aspect-video', // 16:9 (default browser video)
  '9/16': 'aspect-[9/16]', // Vertical/Short form
  '16/9': 'aspect-[16/9]', // Standard horizontal
  '1/1': 'aspect-square', // Square
}[aspectRatio];
```

### **Mobile Considerations:**

- ✅ Touch-friendly controls (larger hit areas)
- ✅ `playsinline` attribute for iOS
- ✅ Fullscreen support
- ✅ Volume controls work on mobile
- ✅ Responsive text sizes

## 🎬 **Integration Example**

### **Report Detail Page:**

```tsx
// features/report/pages/report-detail-page.tsx
<VideoPlayer
  url={report.video_info.media[0].url}
  poster={report.video_info.thumbnail?.url}
  title={report.video_info.title}
  aspectRatio="9/16"
  className="mb-4"
/>
```

### **Content Detail Page:**

```tsx
// features/content/pages/content-detail-page.tsx
<VideoPlayer
  url={contentItem.media_url}
  poster={contentItem.thumbnail_url}
  title={contentItem.title}
  aspectRatio="16/9"
/>
```

## ⚡ **Performance**

### **Optimizations:**

- ✅ Lazy loading với `light` prop (poster image)
- ✅ `playsinline` để tránh native fullscreen
- ✅ Controlled seeking để prevent jank
- ✅ Minimal re-renders

### **Bundle Size:**

- react-player: ~64kb gzipped
- Supports multiple video formats
- Tree-shakeable imports

## 🔒 **Security**

### **Features:**

- ✅ `controlsList: 'nodownload'` - Disable download button
- ✅ CORS-friendly
- ✅ Supports authenticated URLs
- ✅ XSS-safe (React props)

## 🎨 **Customization**

### **Theme Colors:**

```tsx
// Change progress bar color
style={{
  background: `linear-gradient(
    to right,
    #00ff00 0%,                    // Change this
    #00ff00 ${played * 100}%,
    rgba(255,255,255,0.2) ${played * 100}%,
    rgba(255,255,255,0.2) 100%
  )`
}}
```

### **Control Layout:**

```tsx
// Modify controls positioning
<div className="flex items-center justify-between px-4 pb-4">
  {/* Left controls */}
  <div className="flex items-center gap-3">{/* Add custom controls here */}</div>

  {/* Right controls */}
  <div className="flex items-center gap-2">{/* Add custom controls here */}</div>
</div>
```

## 📚 **Related Files**

- [VideoPlayer Component](../shared/components/video-player.tsx)
- [Report Detail Page](../features/report/pages/report-detail-page.tsx)
- [Content Detail Page](../features/content/pages/content-detail-page.tsx)

## ✅ **Browser Support**

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ iOS Safari
- ✅ Chrome Android

## 🎉 **Summary**

VideoPlayer component provides:

- 🎥 Professional video playback
- 🎛️ Custom styled controls
- 📱 Mobile-friendly
- 🎨 Carbon Kinetic theme
- ⚡ Performance optimized
- 🔄 Loading & error states
- ⛶ Fullscreen support
- 🎯 Multiple aspect ratios
