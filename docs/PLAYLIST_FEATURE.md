# Playlist Feature Documentation

## 📋 Overview

Feature quản lý playlists cho phép tạo, chỉnh sửa, và tổ chức video thành các danh sách phát.

## 🎯 Requirements (Fulfilled)

### ✅ Danh sách playlists

- Hiển thị grid các playlists
- Thumbnail, tên, số lượng video
- Nút tạo playlist mới
- Nút xóa playlist

### ✅ Tạo playlist

- Modal với form nhập tên, mô tả
- Có thể chọn videos từ danh sách published
- Validation tên bắt buộc

### ✅ Trang chi tiết playlist

- **Video player** - Hiển thị video đang active
- **Danh sách video** - Có thể kéo thả thay đổi vị trí (drag & drop)
- **Thông tin video** - Video đang phát, vị trí, thời lượng
- **Input fields** - Nhập tên playlist, mô tả
- **2 nút action** - Lưu, Bỏ qua
- **Xóa video** - Button xóa từng video
- **Thêm video** - Modal thêm video vào playlist
- **Cảnh báo xóa video cuối** - Nếu xóa video cuối cùng → xóa luôn playlist

## 🏗️ Architecture

```
/features/playlist/
├── types/
│   └── index.ts              # Playlist, PlaylistVideo, Payloads
├── stores/
│   └── usePlaylistStore.ts   # Zustand store
├── services/
│   └── playlist-service.ts   # API calls
├── hooks/
│   └── usePlaylist.ts        # React Query hooks
├── components/
│   ├── playlist-card.tsx              # Card for list view
│   ├── draggable-video-list.tsx       # Drag & drop list
│   ├── create-playlist-modal.tsx      # Create modal
│   ├── add-video-modal.tsx            # Add video modal
│   ├── delete-confirmation-modal.tsx  # Confirmation dialog
│   └── index.ts
├── pages/
│   ├── playlist-list-page.tsx         # List view
│   ├── playlist-detail-page.tsx       # Detail view
│   └── index.ts
└── index.ts
```

## 📦 Dependencies

### Required (cần cài đặt):

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Used:

- `@dnd-kit/*` - Drag and drop functionality
- `@tanstack/react-query` - Data fetching & caching
- `zustand` - State management
- `sonner` - Toast notifications
- `lucide-react` - Icons
- Existing `@/shared/ui` components

## 🎨 UI Components

### 1. PlaylistCard

Grid card hiển thị trong list view.

**Features:**

- Thumbnail (first video hoặc placeholder)
- Video count badge
- Delete button (visible on hover)
- Click to view details
- Created date

### 2. DraggableVideoList

Sortable list với drag & drop.

**Features:**

- Drag handle (⋮⋮)
- Position number
- Thumbnail
- Title, duration
- Active indicator
- Play button
- Remove button

**Tech:**

- `@dnd-kit/core` - DndContext
- `@dnd-kit/sortable` - SortableContext, useSortable
- `@dnd-kit/utilities` - CSS transform utilities

### 3. CreatePlaylistModal

Modal tạo playlist mới.

**Fields:**

- Name (required)
- Description (optional)
- Selected videos count

### 4. AddVideoModal

Modal thêm video vào playlist.

**Features:**

- Search videos
- Filter published videos
- Exclude existing videos
- Grid display with thumbnails

### 5. DeleteConfirmationModal

Generic confirmation dialog.

**Props:**

- Title, message
- Confirm/Cancel buttons
- Destructive styling option

## 💻 Usage

### List Page

```tsx
import PlaylistListPage from '@/features/playlist/pages/playlist-list-page';

// Features:
// - Grid display
// - Create button
// - Delete with confirmation
// - Navigate to detail
```

### Detail Page

```tsx
import PlaylistDetailPage from '@/features/playlist/pages/playlist-detail-page';

// Features:
// - Video player (active video)
// - Draggable video list
// - Edit name/description
// - Save/Cancel buttons
// - Add video button
// - Remove video with confirmation
// - Delete last video → Delete playlist
```

### Hooks

```tsx
import { usePlaylists, usePlaylist, useCreatePlaylist } from '@/features/playlist';

// Get all playlists
const { data: playlists } = usePlaylists();

// Get single playlist
const { data: playlist } = usePlaylist(id);

// Create playlist
const { mutate: createPlaylist } = useCreatePlaylist();
createPlaylist({
  name: 'My Playlist',
  description: 'Description',
  video_ids: ['vid1', 'vid2'],
});

// Update playlist
const { mutate: updatePlaylist } = useUpdatePlaylist();
updatePlaylist({
  id: 'playlist-id',
  payload: { name: 'New Name' },
});

// Add video
const { mutate: addVideo } = useAddVideoToPlaylist();
addVideo({
  playlistId: 'playlist-id',
  payload: { video_id: 'video-id' },
});

// Remove video
const { mutate: removeVideo } = useRemoveVideoFromPlaylist();
removeVideo({
  playlistId: 'playlist-id',
  payload: { video_id: 'video-id' },
});

// Reorder videos
const { mutate: reorderVideos } = useReorderPlaylist();
reorderVideos({
  playlistId: 'playlist-id',
  payload: { video_ids: ['vid1', 'vid3', 'vid2'] },
});

// Delete playlist
const { mutate: deletePlaylist } = useDeletePlaylist();
deletePlaylist('playlist-id');
```

### Store

```tsx
import { usePlaylistStore } from '@/features/playlist';

// Selection
const { selectedVideoIds, toggleVideoSelection } = usePlaylistStore();

// Active video
const { activeVideoId, setActiveVideoId } = usePlaylistStore();

// Playlist videos (for detail page)
const { playlistVideos, setPlaylistVideos } = usePlaylistStore();

// Modal state
const { isAddVideoModalOpen, setIsAddVideoModalOpen } = usePlaylistStore();
```

## 🔄 User Flow

### Create Playlist Flow

1. User clicks "TẠO PLAYLIST" button
2. Modal opens với form
3. User nhập tên, mô tả (optional)
4. User có thể chọn videos (optional)
5. Click "TẠO PLAYLIST"
6. API call → Success toast → Modal close → List refresh

### Edit Playlist Flow

1. User clicks vào playlist card
2. Navigate to detail page
3. Edit name/description trong form
4. "LƯU" button enabled khi có changes
5. Click "LƯU" → API call → Success toast → Changes saved
6. Click "BỎ QUA" → Reset về giá trị ban đầu

### Add Video Flow

1. User clicks "THÊM VIDEO" button
2. Modal opens với list published videos
3. User search/filter videos
4. Click "THÊM" trên video
5. API call → Video added to playlist → List refresh
6. Modal close

### Remove Video Flow

1. User clicks trash icon trên video
2. **If NOT last video:**
   - Confirmation modal: "Xóa video khỏi playlist?"
   - Click "XÓA VIDEO" → Remove video
3. **If last video:**
   - Warning modal: "Xóa video này sẽ xóa luôn playlist!"
   - Click "XÓA PLAYLIST" → Delete entire playlist → Navigate back to list

### Drag & Drop Flow

1. User clicks and holds drag handle (⋮⋮)
2. Drag video to new position
3. Drop → List reorders
4. API call → Save new order
5. Success toast

### Play Video Flow

1. User clicks Play button hoặc video item
2. Video loads in player
3. Active indicator shows on video item
4. Video info updates

## 🎨 Styling (Carbon Kinetic Theme)

### Colors

```css
/* Background */
bg-black              /* Main container */
bg-zinc-900           /* Secondary */
bg-white/5            /* Active/selected */

/* Borders */
border-white/10       /* Default */
border-white/20       /* Hover/active */
border-white/30       /* Strong hover */

/* Text */
text-white            /* Primary */
text-zinc-300         /* Secondary */
text-zinc-500         /* Muted */

/* Buttons */
bg-white text-black   /* Primary action */
bg-red-900 text-white /* Destructive */
```

### Typography

```css
font-family: monospace;
text-transform: uppercase;
letter-spacing: 0.1em;
```

### Interactions

```css
transition: all 200ms;
hover:scale-105       /* Cards */
hover:translate-x-2   /* Sidebar */
opacity-0 group-hover:opacity-100  /* Hidden actions */
```

## 📡 API Endpoints (Expected)

### Playlists

```typescript
GET    /playlists              // List all playlists
GET    /playlists/:id          // Get playlist details
POST   /playlists              // Create playlist
PATCH  /playlists/:id          // Update playlist
DELETE /playlists/:id          // Delete playlist
```

### Videos in Playlist

```typescript
POST   /playlists/:id/videos              // Add video
DELETE /playlists/:id/videos/:videoId     // Remove video
PATCH  /playlists/:id/reorder             // Reorder videos
```

### Request/Response Examples

**Create Playlist:**

```json
POST /playlists
{
  "name": "Top 10 Videos",
  "description": "Best videos of the month",
  "video_ids": ["vid1", "vid2"]
}

Response:
{
  "data": {
    "id": "playlist-123",
    "name": "Top 10 Videos",
    "video_count": 2,
    "videos": [...]
  }
}
```

**Reorder Videos:**

```json
PATCH /playlists/:id/reorder
{
  "video_ids": ["vid2", "vid1", "vid3"]
}
```

## 🧪 Testing Checklist

### List Page

- [ ] Playlists load and display
- [ ] Grid responsive (mobile/tablet/desktop)
- [ ] Create button opens modal
- [ ] Delete button shows confirmation
- [ ] Click card navigates to detail
- [ ] Empty state displays
- [ ] Loading skeleton shows

### Detail Page - Video Player

- [ ] Active video plays
- [ ] Controls work
- [ ] Switches when selecting different video
- [ ] Shows thumbnail when no video

### Detail Page - Video List

- [ ] Videos display in order
- [ ] Drag handle works
- [ ] Drag & drop reorders list
- [ ] Position numbers update
- [ ] Active indicator shows
- [ ] Play button switches active video
- [ ] Remove button shows confirmation

### Detail Page - Form

- [ ] Name/description editable
- [ ] Save button enabled when changed
- [ ] Cancel resets values
- [ ] Save persists changes
- [ ] Validation works

### Detail Page - Add Video

- [ ] Modal opens
- [ ] Published videos load
- [ ] Search filters videos
- [ ] Existing videos excluded
- [ ] Add button adds video
- [ ] List updates

### Detail Page - Delete

- [ ] Delete video shows confirmation (if not last)
- [ ] Delete last video warns about playlist deletion
- [ ] Confirm deletes correctly
- [ ] Cancel closes modal
- [ ] Navigate back after playlist delete

### Edge Cases

- [ ] Empty playlist
- [ ] Single video playlist
- [ ] Playlist with many videos (>20)
- [ ] Long names/descriptions
- [ ] No published videos available
- [ ] Network errors
- [ ] Concurrent edits

## 🚀 Features Detail

### 1. Drag & Drop (@dnd-kit)

**Implementation:**

```tsx
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

<DndContext onDragEnd={handleDragEnd}>
  <SortableContext items={videos} strategy={verticalListSortingStrategy}>
    {videos.map((video) => (
      <SortableVideoItem key={video.id} video={video} />
    ))}
  </SortableContext>
</DndContext>;
```

**Features:**

- Vertical sorting
- Pointer sensor (mouse/touch)
- Keyboard sensor (accessibility)
- Visual feedback (opacity during drag)
- Smooth animations

### 2. Video Management

**Add Video:**

- Filter published videos only
- Exclude existing videos in playlist
- Search functionality
- Modal UI with grid display

**Remove Video:**

- Confirmation dialog
- Special handling for last video
- Update active video if needed

**Reorder:**

- Drag & drop interface
- Optimistic UI update
- Persist to backend

### 3. Form State Management

**Edit Mode:**

- Track changes (hasChanges)
- Enable/disable Save button
- Cancel resets form
- Auto-save on blur (optional)

**Validation:**

- Name required
- Max length checks (optional)

### 4. Active Video

**State Management:**

- Zustand store for activeVideoId
- Auto-select first video
- Switch on play button click
- Persist across reorders

## 📊 Data Flow

### List Page

```
Component → useQuery → API → Response
  ↓
Display Grid
  ↓
User Action (Create/Delete)
  ↓
useMutation → API → Invalidate Query
  ↓
List Refresh
```

### Detail Page

```
Component → useQuery(id) → API → Playlist + Videos
  ↓
Initialize Form + Video List
  ↓
User Actions:
  ├─ Edit Form → Update Mutation → Save
  ├─ Drag Video → Reorder Mutation → Save order
  ├─ Add Video → Add Mutation → Refresh
  ├─ Remove Video → Remove Mutation → Refresh
  └─ Play Video → Update activeVideoId (local)
```

## 🗂️ File Structure

### Types (`types/index.ts`)

```typescript
interface Playlist {
  id: string;
  name: string;
  description?: string;
  video_count: number;
  thumbnail_url?: string;
  videos?: PlaylistVideo[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface PlaylistVideo {
  id: string;
  video_id: string;
  title: string;
  thumbnail_url: string;
  duration: number;
  position: number;
  created_at: string;
}
```

### Store (`stores/usePlaylistStore.ts`)

```typescript
interface PlaylistState {
  selectedVideoIds: string[];
  currentPlaylist: Playlist | null;
  playlistVideos: PlaylistVideo[];
  activeVideoId: string | null;
  isAddVideoModalOpen: boolean;
  isCreatePlaylistModalOpen: boolean;
  // ... actions
}
```

### Service (`services/playlist-service.ts`)

```typescript
class PlaylistService {
  async getPlaylists(): Promise<Playlist[]>;
  async getPlaylistById(id: string): Promise<Playlist>;
  async createPlaylist(payload: CreatePlaylistPayload): Promise<Playlist>;
  async updatePlaylist(id: string, payload: UpdatePlaylistPayload): Promise<Playlist>;
  async deletePlaylist(id: string): Promise<void>;
  async addVideoToPlaylist(
    playlistId: string,
    payload: AddVideoToPlaylistPayload
  ): Promise<Playlist>;
  async removeVideoFromPlaylist(
    playlistId: string,
    payload: DeleteVideoFromPlaylistPayload
  ): Promise<Playlist>;
  async reorderPlaylist(playlistId: string, payload: ReorderPlaylistPayload): Promise<Playlist>;
}
```

### Hooks (`hooks/usePlaylist.ts`)

```typescript
// Queries
usePlaylists() → Playlist[]
usePlaylist(id) → Playlist

// Mutations
useCreatePlaylist()
useUpdatePlaylist()
useDeletePlaylist()
useAddVideoToPlaylist()
useRemoveVideoFromPlaylist()
useReorderPlaylist()
```

## 🎯 Key Features Implementation

### Drag & Drop

```tsx
// DraggableVideoList component
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;

  if (over && active.id !== over.id) {
    const oldIndex = videos.findIndex((v) => v.id === active.id);
    const newIndex = videos.findIndex((v) => v.id === over.id);

    const reorderedVideos = arrayMove(videos, oldIndex, newIndex).map((video, index) => ({
      ...video,
      position: index,
    }));

    onReorder(reorderedVideos);
  }
}
```

### Delete Last Video Logic

```tsx
const handleRemoveVideo = (video: PlaylistVideo) => {
  if (playlistVideos.length === 1) {
    // Show warning modal
    setDeleteModal({
      isOpen: true,
      type: 'playlist',
      video,
    });
  } else {
    // Normal video deletion
    setDeleteModal({
      isOpen: true,
      type: 'video',
      video,
    });
  }
};

const handleConfirmDelete = () => {
  if (deleteModal.type === 'playlist') {
    deletePlaylist(playlistId); // Delete entire playlist
    navigate({ to: '/playlists' });
  } else {
    removeVideo({ playlistId, payload: { video_id: video.video_id } });
  }
};
```

### Form Change Tracking

```tsx
const [hasChanges, setHasChanges] = useState(false);

useEffect(() => {
  if (playlist) {
    const nameChanged = name !== playlist.name;
    const descChanged = description !== (playlist.description || '');
    setHasChanges(nameChanged || descChanged);
  }
}, [name, description, playlist]);

// Enable Save button only when has changes
<Button disabled={!hasChanges} onClick={handleSave}>
  Lưu
</Button>;
```

## 🎮 User Interactions

### Keyboard Shortcuts

| Key          | Action                     |
| ------------ | -------------------------- |
| `Space`      | Toggle drag (via dnd-kit)  |
| `Arrow Keys` | Move item in sortable list |
| `Escape`     | Close modal                |
| `Enter`      | Submit form (in modals)    |

### Mouse Interactions

| Element            | Action | Result                   |
| ------------------ | ------ | ------------------------ |
| Playlist Card      | Click  | Navigate to detail       |
| Delete Icon (Card) | Click  | Show delete confirmation |
| Video Item         | Click  | Play video               |
| Drag Handle        | Drag   | Reorder video            |
| Play Button        | Click  | Play video               |
| Remove Button      | Click  | Show delete confirmation |
| Save Button        | Click  | Save changes             |
| Cancel Button      | Click  | Reset form               |
| Add Video Button   | Click  | Open add modal           |

## 🐞 Error Handling

### Network Errors

```tsx
// Handled by React Query + Toast
onError: () => {
  toast.error('XÓA VIDEO THẤT BẠI');
};
```

### Validation

```tsx
// Name required
<Button disabled={!name.trim()} onClick={handleSubmit}>
  Tạo Playlist
</Button>
```

### Empty States

```tsx
// No playlists
<EmptyState
  icon={<ListVideo />}
  title="Chưa có playlist"
  action={<CreateButton />}
/>

// No videos in playlist
<EmptyState message="Chưa có video trong playlist" />

// No available videos to add
<EmptyState message="Không tìm thấy video" />
```

## 📱 Responsive Design

### Breakpoints

| Screen       | Layout    | Grid Columns |
| ------------ | --------- | ------------ |
| Mobile       | 1 column  | 1            |
| Tablet (md)  | 2 columns | 2            |
| Desktop (lg) | 3 columns | 3            |
| Wide (xl)    | 4 columns | 4            |

### Detail Page Layout

| Screen       | Layout                  |
| ------------ | ----------------------- |
| Mobile       | Single column (stacked) |
| Desktop (lg) | 2 columns (player/list) |

## ⚡ Performance

### Optimizations

1. **React Query Caching**

   ```tsx
   queryKey: ['playlists', 'detail', id];
   staleTime: 5 * 60 * 1000; // 5 minutes
   ```

2. **Optimistic Updates**

   ```tsx
   // Update UI immediately, rollback on error
   setPlaylistVideos(reorderedVideos);
   ```

3. **Lazy Loading**

   ```tsx
   <img loading="lazy" />
   ```

4. **Memoization**
   ```tsx
   const availableVideos = useMemo(() => {
     return videos.filter(...);
   }, [videos, existingVideoIds]);
   ```

## 🔮 Future Enhancements

- [ ] Duplicate playlist
- [ ] Share playlist (public URL)
- [ ] Export playlist (JSON/M3U)
- [ ] Import videos from CSV
- [ ] Bulk add videos
- [ ] Playlist categories/tags
- [ ] Collaborative editing
- [ ] Version history
- [ ] Auto-play next video
- [ ] Shuffle mode
- [ ] Loop mode
- [ ] Playlist analytics (views, completion rate)

## 📚 Routes

```typescript
// List
/playlists → PlaylistListPage

// Detail
/playlists/:playlistId → PlaylistDetailPage
```

### Sidebar Navigation

```tsx
const menuItems = [
  { id: 'dashboard', path: '/dashboard', label: 'Tổng Quan' },
  { id: 'content', path: '/content', label: 'Tài Nguyên' },
  { id: 'review', path: '/draft', label: 'Xét duyệt tài nguyên' },
  { id: 'playlists', path: '/playlists', label: 'Playlists' }, // ✅ NEW
  { id: 'report', path: '/report', label: 'Báo Cáo Vi Phạm' },
  { id: 'audit', path: '/audit', label: 'Nhật Ký Hệ Thống' },
];
```

## ✅ Completion Checklist

### Setup

- [x] Install @dnd-kit dependencies
- [x] Create types
- [x] Create store
- [x] Create service
- [x] Create hooks

### Components

- [x] PlaylistCard
- [x] DraggableVideoList
- [x] CreatePlaylistModal
- [x] AddVideoModal
- [x] DeleteConfirmationModal

### Pages

- [x] PlaylistListPage
- [x] PlaylistDetailPage

### Routing

- [x] Create routes
- [x] Add to route tree
- [x] Add to sidebar

### Documentation

- [x] API documentation
- [x] Component documentation
- [x] User flow documentation
- [x] Testing checklist

## 🎉 Summary

Feature Playlists hoàn chỉnh với:

- ✅ **Danh sách playlists** - Grid display, create, delete
- ✅ **Chi tiết playlist** - Video player, form edit, drag & drop
- ✅ **Quản lý video** - Add, remove, reorder
- ✅ **Cảnh báo xóa** - Delete last video → delete playlist
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Modern UI** - Carbon Kinetic theme
- ✅ **Responsive** - Mobile-friendly
- ✅ **Accessible** - Keyboard navigation

**Ready to use after installing @dnd-kit!** 🚀
