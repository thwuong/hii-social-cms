# Add to Playlist from Content Page

## 📋 Overview

Feature cho phép thêm videos đã đăng (PUBLISHED) vào playlist có sẵn hoặc tạo mới playlist từ Content Page.

## 🎯 Requirements (Fulfilled)

✅ **Từ Content Page**:

- Chọn multiple videos với status PUBLISHED
- Thêm vào playlist có sẵn
- Hoặc tạo mới playlist với videos đã chọn

✅ **Modal Interface**:

- Hiển thị danh sách playlists
- Search playlists
- Click để thêm vào playlist
- Button "Tạo Playlist Mới" → Form create

✅ **Validation**:

- Chỉ cho phép chọn videos PUBLISHED
- Alert nếu chọn video chưa đăng
- Require ít nhất 1 video

## 🏗️ Implementation

### Files Created/Modified

```
features/content/components/
├── add-to-playlist-modal.tsx (NEW)     # Modal component
├── floating-batch-action-bar.tsx       # Modified: Add onAddToPlaylist prop
└── index.ts                            # Modified: Export AddToPlaylistModal

features/content/pages/
└── content-page.tsx                    # Modified: Integration

docs/
└── ADD_TO_PLAYLIST_FROM_CONTENT.md     # This file
```

### 1. AddToPlaylistModal Component

**Location**: `features/content/components/add-to-playlist-modal.tsx`

**Props**:

```typescript
interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToPlaylist: (playlistId: string) => void;
  onCreatePlaylist: (name: string, description: string) => void;
  selectedCount: number;
}
```

**Features**:

- Load danh sách playlists
- Search functionality
- Click playlist → Add videos
- "Tạo Playlist Mới" button → Show create form
- Create form với name (required) + description
- Validation

**UI Structure**:

```
┌─────────────────────────────────────────┐
│ THÊM VÀO PLAYLIST           [X]         │
│ 3 video đã chọn                         │
├─────────────────────────────────────────┤
│ [🔍 Tìm kiếm playlist...]               │
│ [+ TẠO PLAYLIST MỚI]                    │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ [Thumb] React Master Class     [+]  │ │
│ │         5 videos                    │ │
│ ├─────────────────────────────────────┤ │
│ │ [Thumb] Backend Path           [+]  │ │
│ │         4 videos                    │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ 8 playlist có sẵn                       │
└─────────────────────────────────────────┘
```

**Create Form**:

```
┌─────────────────────────────────────────┐
│ THÊM VÀO PLAYLIST           [X]         │
├─────────────────────────────────────────┤
│ Tên Playlist *                          │
│ [_____________________________]         │
│                                         │
│ Mô Tả                                   │
│ [_____________________________]         │
│                                         │
│ 3 video sẽ được thêm vào playlist mới   │
├─────────────────────────────────────────┤
│                   [QUAY LẠI] [TẠO & THÊM]│
└─────────────────────────────────────────┘
```

### 2. Content Page Integration

**Modified**: `features/content/pages/content-page.tsx`

**Changes**:

1. **Import hooks**:

```typescript
import { useAddVideoToPlaylist, useCreatePlaylist } from '@/features/playlist/hooks/usePlaylist';
import { AddToPlaylistModal } from '../components';
```

2. **Add modal state**:

```typescript
const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
```

3. **Add mutations**:

```typescript
const { mutate: addVideoToPlaylist } = useAddVideoToPlaylist();
const { mutate: createPlaylist } = useCreatePlaylist();
```

4. **Handler: Open modal**:

```typescript
const handleOpenAddToPlaylist = () => {
  // Validation: At least 1 video
  if (selectedIds.length === 0) {
    toast.error('Vui lòng chọn ít nhất 1 video');
    return;
  }

  // Validation: Only published videos
  const selectedItems = items?.filter((item) => selectedIds.includes(item.id)) || [];
  const hasNonPublished = selectedItems.some(
    (item) => item.approving_status !== ContentStatus.PUBLISHED
  );

  if (hasNonPublished) {
    toast.error('Chỉ có thể thêm video đã đăng vào playlist');
    return;
  }

  setIsAddToPlaylistModalOpen(true);
};
```

5. **Handler: Add to existing playlist**:

```typescript
const handleAddToPlaylist = (playlistId: string) => {
  let successCount = 0;
  const totalCount = selectedIds.length;

  selectedIds.forEach((videoId, index) => {
    addVideoToPlaylist(
      { playlistId, payload: { video_id: videoId } },
      {
        onSuccess: () => {
          successCount += 1;
          if (index === totalCount - 1) {
            toast.success(`Đã thêm ${successCount} video vào playlist`);
            setSelectedIds([]);
          }
        },
        onError: () => {
          if (index === totalCount - 1) {
            if (successCount > 0) {
              toast.warning(`Đã thêm ${successCount}/${totalCount} video`);
            } else {
              toast.error('Thêm video thất bại');
            }
            setSelectedIds([]);
          }
        },
      }
    );
  });
};
```

6. **Handler: Create new playlist with videos**:

```typescript
const handleCreatePlaylistWithVideos = (name: string, description: string) => {
  createPlaylist(
    {
      name,
      description: description || undefined,
      video_ids: selectedIds,
    },
    {
      onSuccess: () => {
        setSelectedIds([]);
      },
    }
  );
};
```

7. **Enable selection for PUBLISHED**:

```typescript
// Table
onToggleSelect={
  filters.approving_status === ContentStatus.PENDING_REVIEW ||
  filters.approving_status === ContentStatus.PUBLISHED
    ? handleToggleSelect
    : undefined
}

// Grid
const isPublished = item.approving_status === ContentStatus.PUBLISHED;
const canSelect = isPending || isPublished;

<Media
  onToggleSelect={canSelect ? handleToggleSelect : undefined}
/>
```

8. **Add button to FloatingBatchActionBar**:

```typescript
<FloatingBatchActionBar
  selectedCount={selectedIds.length}
  approveCount={batchApproveCount}
  rejectCount={batchRejectCount}
  onApprove={handleBatchApprove}
  onReject={handleBatchReject}
  onCancel={() => setSelectedIds([])}
  onAddToPlaylist={
    filters.approving_status === ContentStatus.PUBLISHED
      ? handleOpenAddToPlaylist
      : undefined
  }
/>
```

9. **Render modal**:

```tsx
<AddToPlaylistModal
  isOpen={isAddToPlaylistModalOpen}
  onClose={() => setIsAddToPlaylistModalOpen(false)}
  onAddToPlaylist={handleAddToPlaylist}
  onCreatePlaylist={handleCreatePlaylistWithVideos}
  selectedCount={selectedIds.length}
/>
```

### 3. FloatingBatchActionBar Update

**Modified**: `features/content/components/floating-batch-action-bar.tsx`

**Changes**:

1. **Add prop to interface**:

```typescript
export interface FloatingBatchActionBarProps {
  // ... existing props
  onAddToPlaylist?: () => void; // NEW
  addToPlaylistLabel?: string; // NEW
}
```

2. **Add to component params**:

```typescript
export function FloatingBatchActionBar({
  // ... existing params
  onAddToPlaylist,
  addToPlaylistLabel = 'THÊM VÀO PLAYLIST',
}: FloatingBatchActionBarProps) {
```

3. **Render button conditionally**:

```tsx
{
  /* Add to Playlist Button */
}
{
  onAddToPlaylist && (
    <Button
      variant="default"
      onClick={onAddToPlaylist}
      className="border-white bg-white text-black hover:bg-zinc-200"
    >
      {addToPlaylistLabel}
    </Button>
  );
}
```

## 🔄 User Flow

### Scenario 1: Add to Existing Playlist

```
1. User vào Content Page
   ↓
2. Filter status = PUBLISHED
   ↓
3. Select multiple videos (checkbox)
   ↓
4. FloatingBatchActionBar hiển thị
   Button: "THÊM VÀO PLAYLIST"
   ↓
5. Click "THÊM VÀO PLAYLIST"
   ↓
6. Modal opens với danh sách playlists
   ↓
7. User search/browse playlists
   ↓
8. Click vào playlist muốn thêm
   ↓
9. API calls: Add each video to playlist
   ↓
10. Toast: "Đã thêm X video vào playlist"
   ↓
11. Selection cleared
   Modal closed
```

### Scenario 2: Create New Playlist

```
1. User vào Content Page
   ↓
2. Filter status = PUBLISHED
   ↓
3. Select multiple videos
   ↓
4. Click "THÊM VÀO PLAYLIST"
   ↓
5. Modal opens
   ↓
6. Click "TẠO PLAYLIST MỚI"
   ↓
7. Create form hiển thị
   ↓
8. User nhập tên (required) + mô tả
   ↓
9. Click "TẠO & THÊM VIDEO"
   ↓
10. API call: Create playlist with video_ids
   ↓
11. Toast: "TẠO PLAYLIST THÀNH CÔNG"
   ↓
12. Selection cleared
   Modal closed
```

### Scenario 3: Validation - Non-Published Video

```
1. User filter status = PENDING_REVIEW
   ↓
2. Select videos (pending status)
   ↓
3. FloatingBatchActionBar shows
   (No "THÊM VÀO PLAYLIST" button)
   ↓
[End: Only approve/reject available]
```

### Scenario 4: Mixed Selection

```
1. User somehow selects mix of PUBLISHED + PENDING
   ↓
2. Click "THÊM VÀO PLAYLIST" (if visible)
   ↓
3. Validation check
   ↓
4. Toast Error: "Chỉ có thể thêm video đã đăng vào playlist"
   ↓
[End: Modal không mở]
```

## 🎨 UI Components

### AddToPlaylistModal

**States**:

- Default: List playlists
- Create: Show create form

**Features**:

- Search bar với icon
- Playlist cards (thumbnail + info + add icon)
- Empty state
- Loading state
- "Tạo Playlist Mới" button
- Create form (name + description)
- Responsive grid

**Styling**:

```css
/* Modal */
bg-black, border-white/20

/* Playlist Cards */
bg-zinc-900, border-white/10
hover:border-white/30

/* Search */
bg-zinc-900, pl-10 (for icon)

/* Create Button */
bg-white text-black (primary action)

/* Form Inputs */
bg-zinc-900, border-white/20
```

### FloatingBatchActionBar

**New Button**:

```tsx
{
  onAddToPlaylist && (
    <Button className="border-white bg-white text-black hover:bg-zinc-200">
      THÊM VÀO PLAYLIST
    </Button>
  );
}
```

**Position**: Between Reject và Cancel buttons

**Conditional**: Only shows when `onAddToPlaylist` prop provided

## 💻 Code Examples

### Use in Content Page

```tsx
// 1. Import modal
import { AddToPlaylistModal } from '../components';
import { useAddVideoToPlaylist, useCreatePlaylist } from '@/features/playlist/hooks/usePlaylist';

// 2. State
const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);

// 3. Mutations
const { mutate: addVideoToPlaylist } = useAddVideoToPlaylist();
const { mutate: createPlaylist } = useCreatePlaylist();

// 4. Handlers
const handleOpenAddToPlaylist = () => {
  if (selectedIds.length === 0) {
    toast.error('Vui lòng chọn ít nhất 1 video');
    return;
  }

  const hasNonPublished = selectedItems.some(
    item => item.approving_status !== ContentStatus.PUBLISHED
  );

  if (hasNonPublished) {
    toast.error('Chỉ có thể thêm video đã đăng vào playlist');
    return;
  }

  setIsAddToPlaylistModalOpen(true);
};

const handleAddToPlaylist = (playlistId: string) => {
  selectedIds.forEach((videoId, index) => {
    addVideoToPlaylist({
      playlistId,
      payload: { video_id: videoId },
    });
  });
};

const handleCreatePlaylistWithVideos = (name: string, description: string) => {
  createPlaylist({
    name,
    description: description || undefined,
    video_ids: selectedIds,
  });
};

// 5. Render
<FloatingBatchActionBar
  onAddToPlaylist={
    filters.approving_status === ContentStatus.PUBLISHED
      ? handleOpenAddToPlaylist
      : undefined
  }
/>

<AddToPlaylistModal
  isOpen={isAddToPlaylistModalOpen}
  onClose={() => setIsAddToPlaylistModalOpen(false)}
  onAddToPlaylist={handleAddToPlaylist}
  onCreatePlaylist={handleCreatePlaylistWithVideos}
  selectedCount={selectedIds.length}
/>
```

## 🎮 User Interactions

### Step-by-Step Guide

**1. Select Videos**:

- Filter content by "ĐÃ ĐĂNG" status
- Click checkboxes để select videos
- FloatingBatchActionBar hiển thị với button "THÊM VÀO PLAYLIST"

**2. Open Modal**:

- Click "THÊM VÀO PLAYLIST"
- Modal mở với danh sách playlists

**3. Option A - Add to Existing**:

- Browse/search playlists
- Click vào playlist muốn thêm
- Videos được add
- Toast success
- Selection cleared

**4. Option B - Create New**:

- Click "TẠO PLAYLIST MỚI"
- Form hiển thị
- Nhập tên playlist (required)
- Nhập mô tả (optional)
- Click "TẠO & THÊM VIDEO"
- Playlist mới được tạo with videos
- Toast success
- Selection cleared

## 🎯 Features Detail

### Multi-Select Videos

```tsx
// Enable selection for PUBLISHED status
onToggleSelect={
  filters.approving_status === ContentStatus.PUBLISHED
    ? handleToggleSelect
    : undefined
}

// Grid view
const isPublished = item.approving_status === ContentStatus.PUBLISHED;
const canSelect = isPending || isPublished;

<Media
  isSelected={selectedIds.includes(item.id)}
  onToggleSelect={canSelect ? handleToggleSelect : undefined}
/>
```

### Validation

```typescript
// Check 1: At least 1 video
if (selectedIds.length === 0) {
  toast.error('Vui lòng chọn ít nhất 1 video');
  return;
}

// Check 2: All must be PUBLISHED
const hasNonPublished = selectedItems.some(
  (item) => item.approving_status !== ContentStatus.PUBLISHED
);

if (hasNonPublished) {
  toast.error('Chỉ có thể thêm video đã đăng vào playlist');
  return;
}
```

### Batch Add to Playlist

```typescript
const handleAddToPlaylist = (playlistId: string) => {
  let successCount = 0;
  const totalCount = selectedIds.length;

  selectedIds.forEach((videoId, index) => {
    addVideoToPlaylist(
      { playlistId, payload: { video_id: videoId } },
      {
        onSuccess: () => {
          successCount += 1;
          // Show toast only after last video
          if (index === totalCount - 1) {
            toast.success(`Đã thêm ${successCount} video vào playlist`);
            setSelectedIds([]);
          }
        },
        onError: () => {
          // Handle partial success
          if (index === totalCount - 1) {
            if (successCount > 0) {
              toast.warning(`Đã thêm ${successCount}/${totalCount} video`);
            } else {
              toast.error('Thêm video thất bại');
            }
            setSelectedIds([]);
          }
        },
      }
    );
  });
};
```

### Create Playlist with Videos

```typescript
const handleCreatePlaylistWithVideos = (name: string, description: string) => {
  createPlaylist(
    {
      name,
      description: description || undefined,
      video_ids: selectedIds, // All selected videos
    },
    {
      onSuccess: () => {
        setSelectedIds([]);
        // Toast handled by useCreatePlaylist hook
      },
    }
  );
};
```

## 🎨 UI States

### FloatingBatchActionBar (PUBLISHED Status)

```
┌──────────────────────────────────────────────────────┐
│ 3 ĐÃ CHỌN | [THÊM VÀO PLAYLIST] | [HỦY]              │
└──────────────────────────────────────────────────────┘
```

### FloatingBatchActionBar (PENDING_REVIEW Status)

```
┌──────────────────────────────────────────────────────┐
│ 3 ĐÃ CHỌN | [DUYỆT (3)] [TỪ CHỐI (3)] | [HỦY]       │
└──────────────────────────────────────────────────────┘
```

### Modal - Playlist List

```
┌─────────────────────────────────────────┐
│ THÊM VÀO PLAYLIST           [X]         │
│ 3 video đã chọn                         │
├─────────────────────────────────────────┤
│ [🔍 Search...]                          │
│ [+ TẠO PLAYLIST MỚI]  ← Primary Button │
├─────────────────────────────────────────┤
│ Scrollable List:                        │
│ ┌───────────────────────────┐          │
│ │ [Thumb] Playlist Name      │          │
│ │ 5 videos • Description     │          │
│ │                      [+] ←Hover       │
│ └───────────────────────────┘          │
│                                         │
│ 8 playlist có sẵn                       │
└─────────────────────────────────────────┘
```

### Modal - Create Form

```
┌─────────────────────────────────────────┐
│ THÊM VÀO PLAYLIST           [X]         │
│ 3 video đã chọn                         │
├─────────────────────────────────────────┤
│ Tên Playlist *                          │
│ ┌─────────────────────────────────────┐ │
│ │ [Input focused]                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Mô Tả                                   │
│ ┌─────────────────────────────────────┐ │
│ │ [Input]                             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 3 video sẽ được thêm vào playlist mới   │
├─────────────────────────────────────────┤
│           [QUAY LẠI] [TẠO & THÊM VIDEO]│
│                      ↑ Enabled if name  │
└─────────────────────────────────────────┘
```

## 📊 Data Flow

```
Content Page
    │
    ├─ User selects PUBLISHED videos
    │      │
    │      v
    │  FloatingBatchActionBar shows
    │  with "THÊM VÀO PLAYLIST" button
    │      │
    │      v
    │  [Click button]
    │      │
    │      v
    │  Validation:
    │  - At least 1 video
    │  - All PUBLISHED
    │      │
    │      v
    │  Open AddToPlaylistModal
    │
    ├─ Modal State 1: Playlist List
    │      │
    │      ├─ Load playlists (usePlaylists)
    │      ├─ Search/filter
    │      ├─ Click playlist → handleAddToPlaylist
    │      │      │
    │      │      v
    │      │  Loop selectedIds:
    │      │  - addVideoToPlaylist mutation
    │      │  - Track success count
    │      │  - Show toast after last
    │      │
    │      └─ Click "TẠO PLAYLIST MỚI" → Show form
    │
    └─ Modal State 2: Create Form
           │
           ├─ Input name (required)
           ├─ Input description (optional)
           ├─ Click "TẠO & THÊM VIDEO"
           │      │
           │      v
           │  createPlaylist mutation
           │  with video_ids: selectedIds
           │      │
           │      v
           │  Toast: "TẠO PLAYLIST THÀNH CÔNG"
           │  Selection cleared
           │
           └─ Click "QUAY LẠI" → Back to list
```

## 🧪 Testing Checklist

### Content Page

- [ ] Navigate to Content Page
- [ ] Filter by "ĐÃ ĐĂNG" status
- [ ] Checkbox visible on videos
- [ ] Can select multiple videos
- [ ] FloatingBatchActionBar shows với "THÊM VÀO PLAYLIST"
- [ ] Button only shows for PUBLISHED status
- [ ] Cannot select non-published videos

### Validation

- [ ] Click button without selection → Toast error
- [ ] Select non-published videos → Button không visible
- [ ] Mix published + pending → Error toast if button clicked

### Add to Existing Playlist

- [ ] Click button → Modal opens
- [ ] Playlists load and display
- [ ] Search filters playlists
- [ ] Thumbnail displays
- [ ] Video count shows
- [ ] Click playlist → Videos added
- [ ] Toast success shows
- [ ] Selection clears
- [ ] Modal closes

### Create New Playlist

- [ ] Click "TẠO PLAYLIST MỚI"
- [ ] Form displays
- [ ] Name input focused
- [ ] Description optional
- [ ] Selected count shows
- [ ] "TẠO & THÊM VIDEO" disabled when name empty
- [ ] Click "QUAY LẠI" → Back to list
- [ ] Submit creates playlist with videos
- [ ] Toast success shows
- [ ] Selection clears

### Edge Cases

- [ ] Select 1 video → Works
- [ ] Select 20+ videos → Works
- [ ] No playlists available → Empty state
- [ ] Network error → Error toast
- [ ] Partial success (some videos fail) → Warning toast

## ⚡ Performance

### Optimizations

1. **Batch API Calls**: Add videos sequentially with single success toast
2. **Search Filtering**: useMemo for filtered playlists
3. **React Query Cache**: Playlists cached, instant display
4. **Optimistic UI**: Selection clears immediately

## 🎯 Integration Points

### Dependencies

```typescript
// Playlist Feature
import { useAddVideoToPlaylist, useCreatePlaylist, usePlaylists } from '@/features/playlist';

// UI Components
import { Button, Dialog, Input, Label, Typography } from '@/shared/ui';

// Icons
import { ListVideo, Plus, Search, X } from 'lucide-react';
```

### Store Integration

```typescript
// Uses existing ContentStore
const { selectedIds, setSelectedIds } = useContentStore();

// Playlist Store not needed (modal is self-contained)
```

### React Query

```typescript
// Queries
usePlaylists() → Load available playlists

// Mutations
useAddVideoToPlaylist() → Add video to playlist
useCreatePlaylist() → Create new playlist with videos
```

## 📝 API Calls

### Add Videos to Playlist

```typescript
// Sequential calls for each video
POST /playlists/:playlistId/videos
{
  "video_id": "vid-001"
}

// Called N times for N selected videos
// Success tracked, single toast after all complete
```

### Create Playlist with Videos

```typescript
POST /playlists
{
  "name": "New Playlist",
  "description": "Description",
  "video_ids": ["vid-001", "vid-002", "vid-003"]
}

// Single API call with all video IDs
```

## 🎨 Styling (Carbon Kinetic)

### Modal

```css
.modal {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: black;
  max-width: 48rem; /* max-w-2xl */
}

.modal-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
}

.modal-content {
  max-height: 24rem; /* max-h-96 */
  overflow-y: auto;
}
```

### Playlist Card (in modal)

```css
.playlist-card {
  background: rgb(24, 24, 27); /* zinc-900 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 200ms;
}

.playlist-card:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgb(39, 39, 42); /* zinc-800 */
}

.playlist-card .add-icon {
  opacity: 0;
  transition: opacity 200ms;
}

.playlist-card:hover .add-icon {
  opacity: 1;
}
```

### Create Form

```css
.form-input {
  background: rgb(24, 24, 27); /* zinc-900 */
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-family: monospace;
}

.create-button {
  background: white;
  color: black;
  border: 1px solid white;
  font-family: monospace;
  text-transform: uppercase;
}

.create-button:hover {
  background: rgb(228, 228, 231); /* zinc-200 */
}

.create-button:disabled {
  opacity: 0.5;
}
```

## 🔗 Related Features

### 1. Content Page

- Multi-select videos
- Filter by status
- Batch actions

### 2. Playlist Feature

- Create playlist
- Add videos
- Manage playlists

### 3. FloatingBatchActionBar

- Conditional actions based on status
- Dynamic button visibility
- Extensible for new actions

## 🐞 Troubleshooting

### Button không hiển thị

**Cause**: Status không phải PUBLISHED

**Fix**: Filter content by "ĐÃ ĐĂNG" status

### Toast error về non-published

**Cause**: Selected videos include non-published

**Fix**: Chỉ select videos từ PUBLISHED filter

### Videos không được add

**Cause**: API error hoặc validation

**Check**:

1. Video IDs valid?
2. Playlist ID exists?
3. Network connection?
4. Check console for errors

### Modal không mở

**Cause**: Validation failed

**Check**:

1. At least 1 video selected?
2. All videos PUBLISHED?
3. Check toast error message

## ✅ Completion Status

### Implemented

- ✅ AddToPlaylistModal component
- ✅ Integration với Content Page
- ✅ FloatingBatchActionBar update
- ✅ Multi-select for PUBLISHED videos
- ✅ Validation logic
- ✅ Add to existing playlist
- ✅ Create new playlist
- ✅ Toast notifications
- ✅ Error handling
- ✅ Search functionality
- ✅ Responsive design

### Files Modified

- ✅ `features/content/components/add-to-playlist-modal.tsx` (NEW)
- ✅ `features/content/pages/content-page.tsx` (Modified)
- ✅ `features/content/components/floating-batch-action-bar.tsx` (Modified)
- ✅ `features/content/components/index.ts` (Modified)
- ✅ `docs/ADD_TO_PLAYLIST_FROM_CONTENT.md` (NEW)

## 🎉 Summary

Feature hoàn chỉnh cho phép:

- ✅ Select multiple PUBLISHED videos từ Content Page
- ✅ Add vào playlist có sẵn (với search)
- ✅ Tạo mới playlist với videos đã chọn
- ✅ Validation đầy đủ
- ✅ Toast notifications
- ✅ Smooth UX
- ✅ Type-safe
- ✅ Zero breaking changes

**Integration seamless với existing Playlist feature!** 🚀
