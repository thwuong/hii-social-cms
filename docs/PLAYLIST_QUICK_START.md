# Playlist Feature - Quick Start Guide

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 2. Verify Setup

Feature đã được tích hợp sẵn:

- ✅ Routes configured
- ✅ Sidebar menu added
- ✅ Components created
- ✅ Store setup
- ✅ API service ready

## 📍 Navigation

Access playlists qua:

1. **Sidebar**: Click "PLAYLISTS"
2. **Direct URL**: `/playlists`

## 🎯 User Guide

### Tạo Playlist Mới

1. Vào trang `/playlists`
2. Click nút **"TẠO PLAYLIST"**
3. Nhập:
   - **Tên playlist** (bắt buộc)
   - **Mô tả** (tùy chọn)
4. Click **"TẠO PLAYLIST"**
5. ✅ Success toast → Playlist mới xuất hiện

### Xem Chi Tiết Playlist

1. Click vào playlist card
2. Trang detail mở với:
   - Video player (trái)
   - Danh sách video (phải)
   - Form thông tin (dưới player)

### Chỉnh Sửa Playlist

1. Trong detail page
2. Edit **tên** hoặc **mô tả** trong form
3. Nút **"LƯU"** sẽ active (màu trắng)
4. Click **"LƯU"** → Save changes
5. Hoặc click **"BỎ QUA"** → Reset về giá trị cũ

### Thêm Video

1. Trong detail page
2. Click **"THÊM VIDEO"**
3. Modal mở với danh sách published videos
4. Search video (nếu cần)
5. Click **"THÊM"** trên video muốn thêm
6. ✅ Video được thêm vào cuối danh sách

### Sắp Xếp Video (Drag & Drop)

1. Hover vào video trong list
2. Click và giữ icon **⋮⋮** (drag handle)
3. Kéo video lên/xuống
4. Thả vào vị trí mới
5. ✅ List reorder ngay lập tức
6. ✅ Vị trí được save tự động

### Phát Video

**Cách 1:** Click vào video item trong list

**Cách 2:** Click nút **Play** (▶) khi hover

**Result:**

- Video load trong player
- Active indicator (• ĐANG PHÁT) hiển thị
- Thông tin video update

### Xóa Video

1. Hover vào video
2. Click icon **🗑️** (trash)

**Nếu KHÔNG phải video cuối:**

- Modal: "Xóa video khỏi playlist?"
- Click **"XÓA VIDEO"** → Video removed

**Nếu là video cuối cùng:**

- ⚠️ Warning modal: "Xóa video này sẽ xóa luôn playlist!"
- Click **"XÓA PLAYLIST"** → Playlist deleted
- Navigate back to list page

### Xóa Playlist

1. Trong list page
2. Hover vào playlist card
3. Click icon **🗑️** (góc dưới phải)
4. Confirmation modal hiển thị
5. Click **"XÓA PLAYLIST"** → Playlist deleted

## 🎮 Keyboard Shortcuts

| Key             | Action                      |
| --------------- | --------------------------- |
| `Arrow Up/Down` | Move video in sortable list |
| `Space`         | Grab/release dragged item   |
| `Escape`        | Close modal                 |
| `Enter`         | Submit form (in modals)     |

## 🎨 UI Overview

### List Page

```
┌─────────────────────────────────────────┐
│ PLAYLISTS          [+ TẠO PLAYLIST]     │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────┐  ┌────────┐  ┌────────┐   │
│  │ Thumb  │  │ Thumb  │  │ Thumb  │   │
│  │  [10]  │  │  [5]   │  │  [8]   │   │
│  │        │  │        │  │        │   │
│  │ Name   │  │ Name   │  │ Name   │   │
│  └────────┘  └────────┘  └────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Detail Page

```
┌──────────────────────────────────────────────────────┐
│ [←] CHI TIẾT PLAYLIST                                │
├──────────────────────┬───────────────────────────────┤
│                      │                               │
│  ┌────────────────┐  │  DANH SÁCH VIDEO (10)        │
│  │                │  │  [+ THÊM VIDEO]              │
│  │  VIDEO PLAYER  │  │                               │
│  │                │  │  ⋮⋮ 1 [Thumb] Title    [▶][🗑]│
│  │                │  │  ⋮⋮ 2 [Thumb] Title    [▶][🗑]│
│  └────────────────┘  │  ⋮⋮ 3 [Thumb] Title ●  [▶][🗑]│
│                      │     (ĐANG PHÁT)               │
│  ┌────────────────┐  │  ⋮⋮ 4 [Thumb] Title    [▶][🗑]│
│  │ Video Info     │  │  ...                          │
│  │ Vị trí: 3/10   │  │                               │
│  └────────────────┘  │                               │
│                      │                               │
│  ┌────────────────┐  │                               │
│  │ THÔNG TIN      │  │                               │
│  │ [Tên]          │  │                               │
│  │ [Mô tả]        │  │                               │
│  │ [LƯU] [BỎ QUA] │  │                               │
│  └────────────────┘  │                               │
└──────────────────────┴───────────────────────────────┘
```

## 🔄 State Management

### Zustand Store

```typescript
usePlaylistStore:
├─ selectedVideoIds[]      // For creating playlist
├─ currentPlaylist         // Current editing
├─ playlistVideos[]        // Videos in detail page
├─ activeVideoId           // Video playing
├─ isAddVideoModalOpen     // Modal state
└─ isCreatePlaylistModalOpen
```

### React Query Cache

```typescript
Query Keys:
├─ ['playlists', 'list']           // All playlists
└─ ['playlists', 'detail', id]     // Single playlist

Auto Invalidation:
- Create → Invalidate list
- Update → Invalidate list + detail
- Delete → Invalidate list
- Add/Remove video → Invalidate detail + list
- Reorder → Invalidate detail
```

## 🎯 Common Tasks

### Task 1: Create Playlist with Videos

```tsx
// 1. Select videos (optional, từ content page)
const { toggleVideoSelection } = usePlaylistStore();
toggleVideoSelection('video-id');

// 2. Open create modal
const { setIsCreatePlaylistModalOpen } = usePlaylistStore();
setIsCreatePlaylistModalOpen(true);

// 3. Submit form
const { mutate: createPlaylist } = useCreatePlaylist();
createPlaylist({
  name: 'My Playlist',
  description: 'Description',
  video_ids: selectedVideoIds,
});
```

### Task 2: Reorder Videos

```tsx
// Handled automatically by DraggableVideoList
// User drags → onReorder callback → Save to API

const handleReorder = (reorderedVideos: PlaylistVideo[]) => {
  // 1. Update local state (optimistic)
  setPlaylistVideos(reorderedVideos);

  // 2. Save to backend
  reorderVideos({
    playlistId,
    payload: { video_ids: reorderedVideos.map((v) => v.video_id) },
  });
};
```

### Task 3: Add Video to Existing Playlist

```tsx
const { mutate: addVideo } = useAddVideoToPlaylist();

addVideo({
  playlistId: 'playlist-id',
  payload: {
    video_id: 'new-video-id',
    position: 5, // Optional, default to end
  },
});
```

## 🐞 Troubleshooting

### Drag & Drop không hoạt động

**Check:**

1. @dnd-kit installed?
   ```bash
   npm list @dnd-kit/core
   ```
2. DndContext wrapping SortableContext?
3. Sensors configured correctly?
4. Items have unique IDs?

**Fix:**

```tsx
// Ensure sensors configured
const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

<DndContext sensors={sensors}>...</DndContext>;
```

### Videos không load trong AddVideoModal

**Check:**

1. Content status = PUBLISHED?
2. useContent hook working?
3. API response structure correct?

**Debug:**

```tsx
console.log('Available videos:', videos);
console.log('Existing IDs:', existingVideoIds);
```

### Active video không switch

**Check:**

1. activeVideoId state updating?
2. VideoPlayer receiving correct URL?
3. Video URL valid?

**Debug:**

```tsx
console.log('Active Video ID:', activeVideoId);
console.log('Active Video:', activeVideo);
```

### Form không save

**Check:**

1. hasChanges state correct?
2. Update mutation working?
3. Name không empty?

**Debug:**

```tsx
console.log('Has changes:', hasChanges);
console.log('Updating:', isUpdating);
```

## 📝 Backend Requirements

Backend API cần implement các endpoints sau:

### 1. GET /playlists

```json
Response: {
  "data": [
    {
      "id": "pl-1",
      "name": "Playlist Name",
      "description": "Description",
      "video_count": 5,
      "thumbnail_url": "https://...",
      "created_at": "2026-01-23T00:00:00Z",
      "updated_at": "2026-01-23T00:00:00Z",
      "created_by": "user-id"
    }
  ]
}
```

### 2. GET /playlists/:id

```json
Response: {
  "data": {
    "id": "pl-1",
    "name": "Playlist Name",
    "video_count": 3,
    "videos": [
      {
        "id": "pv-1",
        "video_id": "vid-1",
        "title": "Video Title",
        "thumbnail_url": "https://...",
        "duration": 120,
        "position": 0,
        "created_at": "2026-01-23T00:00:00Z"
      }
    ]
  }
}
```

### 3. POST /playlists

```json
Request: {
  "name": "New Playlist",
  "description": "Optional description",
  "video_ids": ["vid-1", "vid-2"]
}

Response: { "data": { ... } }
```

### 4. PATCH /playlists/:id

```json
Request: {
  "name": "Updated Name",
  "description": "Updated description"
}
```

### 5. DELETE /playlists/:id

```
No body required
Response: 204 No Content
```

### 6. POST /playlists/:id/videos

```json
Request: {
  "video_id": "vid-123",
  "position": 5  // Optional
}
```

### 7. DELETE /playlists/:id/videos/:videoId

```
Response: { "data": { ... } }
```

### 8. PATCH /playlists/:id/reorder

```json
Request: {
  "video_ids": ["vid-2", "vid-1", "vid-3"]
}
```

## ✅ Verification

Run these commands to verify:

```bash
# 1. TypeScript compilation
npx tsc --noEmit
# ✅ Should pass

# 2. ESLint check
npx eslint features/playlist/**/*.tsx
# ✅ Should pass

# 3. Check @dnd-kit installed (after running npm install)
npm list @dnd-kit/core
# Should show: @dnd-kit/core@x.x.x

# 4. Start dev server
npm run dev
# Navigate to http://localhost:5173/playlists
```

## 📚 Documentation

- **Feature Doc**: `docs/PLAYLIST_FEATURE.md` - Complete technical documentation
- **Quick Start**: `docs/PLAYLIST_QUICK_START.md` - This file
- **API Doc**: See "Backend Requirements" section above

## 🎉 Ready to Use!

Feature hoàn chỉnh với:

- ✅ List page
- ✅ Detail page
- ✅ Drag & drop
- ✅ Video player
- ✅ CRUD operations
- ✅ Delete last video warning
- ✅ Type-safe
- ✅ Responsive
- ✅ Accessible

**Just install @dnd-kit and you're good to go!** 🚀
