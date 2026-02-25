# Playlist Feature - Flow Diagrams

## 🗺️ Page Navigation Flow

```
┌─────────────┐
│   Sidebar   │
│  [Playlists]│
└──────┬──────┘
       │
       v
┌─────────────────────┐
│  Playlist List Page │ /playlists
│  ┌────┐ ┌────┐      │
│  │ PL1│ │ PL2│      │
│  └─┬──┘ └────┘      │
│    │  [+ Tạo]       │
└────┼─────────────────┘
     │
     │ Click card
     v
┌─────────────────────────────────────┐
│  Playlist Detail Page               │ /playlists/:id
│  ┌────────────┐  ┌──────────────┐  │
│  │   Player   │  │  Video List  │  │
│  │            │  │  ⋮⋮ Video 1  │  │
│  │  [VIDEO]   │  │  ⋮⋮ Video 2  │  │
│  │            │  │  ⋮⋮ Video 3  │  │
│  └────────────┘  └──────────────┘  │
│  [Tên] [Mô tả]                      │
│  [LƯU] [BỎ QUA]                     │
└─────────────────────────────────────┘
```

## 🔄 Create Playlist Flow

```
User Action                 System Response
──────────────────────────────────────────────────────
[Click "TẠO PLAYLIST"]
                     ──→    Open Modal
                            ┌──────────────┐
                            │ Tên Playlist │
                            │ Mô Tả        │
                            │ [TẠO]        │
                            └──────────────┘

[Fill form + Submit]
                     ──→    Validate (name required)
                     ──→    API: POST /playlists
                     ──→    React Query: Invalidate list
                     ──→    Toast: "TẠO THÀNH CÔNG"
                     ──→    Modal close
                     ──→    List refresh
                     ──→    New playlist appears
```

## 🎬 Video Management Flow

### Add Video

```
[Click "THÊM VIDEO"]
         │
         v
    Open Modal
         │
         v
    Load Published Videos
         │
         v
    Filter out existing
         │
         v
    Display searchable list
         │
         v
[Click "THÊM" on video]
         │
         v
    API: POST /playlists/:id/videos
         │
         v
    Toast: "THÊM THÀNH CÔNG"
         │
         v
    List refresh with new video
```

### Remove Video (NOT last)

```
[Click 🗑️ icon]
         │
         v
    Show confirmation
    "Xóa video khỏi playlist?"
         │
         v
[Click "XÓA VIDEO"]
         │
         v
    API: DELETE /playlists/:id/videos/:videoId
         │
         v
    Update active video (if needed)
         │
         v
    List refresh
```

### Remove Last Video

```
[Click 🗑️ on last video]
         │
         v
    Check: videos.length === 1?
         │
         v YES
    Show WARNING
    "⚠️  Xóa video này sẽ xóa luôn playlist!"
         │
         v
[Click "XÓA PLAYLIST"]
         │
         v
    API: DELETE /playlists/:id
         │
         v
    Toast: "XÓA PLAYLIST THÀNH CÔNG"
         │
         v
    Navigate to /playlists
```

## 🎯 Drag & Drop Flow

```
User Action                 System Response
──────────────────────────────────────────────────────
[Hover video]
                     ──→    Show drag handle ⋮⋮

[Click & hold ⋮⋮]
                     ──→    Grab item
                     ──→    Visual feedback (opacity)

[Drag up/down]
                     ──→    Show drop indicator
                     ──→    Other items shift

[Release/Drop]
                     ──→    Calculate new positions
                     ──→    Update local state (optimistic)
                     ──→    API: PATCH /playlists/:id/reorder
                     ──→    Toast: "THAY ĐỔI THÀNH CÔNG"
                     ──→    Persist new order

┌─────────────────────────────────────┐
│ Before Drag:                        │
│   1. Video A                        │
│   2. Video B  ← Drag this           │
│   3. Video C                        │
│   4. Video D                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ After Drop (to position 4):         │
│   1. Video A                        │
│   2. Video C                        │
│   3. Video D                        │
│   4. Video B  ← Dropped here        │
└─────────────────────────────────────┘
```

## 💾 Form Edit Flow

```
Page Load
    │
    v
Initialize form with playlist data
    │
    v
[User edits name/description]
    │
    v
Track changes (hasChanges = true)
    │
    v
Enable "LƯU" button
    │
    ├─────────────────┬─────────────────┐
    │                 │                 │
    v                 v                 v
[Click LƯU]      [Click BỎ QUA]    [Navigate away]
    │                 │                 │
    v                 v                 v
Save changes      Reset form        Prompt unsaved?
    │                 │
    v                 v
Toast success     hasChanges = false
    │
    v
hasChanges = false
```

## 🎮 Video Player Flow

```
Page Load
    │
    v
Load playlist with videos
    │
    v
Set first video as active
    │
    v
┌─────────────────────────────┐
│ Video Player                │
│ [Video 1 plays]             │
└─────────────────────────────┘
    │
    ├──────────────────┬─────────────────┐
    │                  │                 │
[Click video 2]   [Click ▶ on 3]   [Drag & auto-play]
    │                  │                 │
    v                  v                 v
setActiveVideoId(2) setActiveVideoId(3) setActiveVideoId(new)
    │                  │                 │
    v                  v                 v
Player loads video 2  Player loads 3    Player loads new
    │                  │                 │
    v                  v                 v
Active indicator moves to video 2/3/new
```

## 🔐 State Management Flow

```
┌──────────────────────────────────────────────────────┐
│                   Application                        │
│                                                      │
│  ┌────────────┐              ┌─────────────┐       │
│  │  Zustand   │              │ React Query │       │
│  │   Store    │              │   Cache     │       │
│  ├────────────┤              ├─────────────┤       │
│  │ UI State:  │              │ Server Data:│       │
│  │ • activeId │  ←───sync──→ │ • playlists │       │
│  │ • selected │              │ • videos    │       │
│  │ • modals   │              └──────┬──────┘       │
│  └────────────┘                     │              │
│       ↕                              ↕              │
│  Components                     API Client          │
│                                      ↕              │
│                                  Backend            │
└──────────────────────────────────────────────────────┘

State Updates:
1. User action → Update Zustand
2. Zustand triggers → API call
3. API success → Invalidate React Query
4. React Query refetch → Update UI
```

## 🎯 Component Hierarchy

```
PlaylistListPage
├── CreatePlaylistModal
│   └── Form (name, description)
├── DeleteConfirmationModal
└── Grid
    └── PlaylistCard (x N)
        ├── Thumbnail
        ├── Info
        └── Delete Button

PlaylistDetailPage
├── Header
│   └── Back Button
├── Left Column
│   ├── VideoPlayer
│   │   └── Active Video
│   ├── Active Video Info
│   └── Edit Form
│       ├── Name Input
│       ├── Description Textarea
│       └── Actions (Save/Cancel)
├── Right Column
│   ├── Header (count + Add button)
│   └── DraggableVideoList
│       └── SortableVideoItem (x N)
│           ├── Drag Handle ⋮⋮
│           ├── Position #
│           ├── Thumbnail
│           ├── Info
│           └── Actions (Play/Remove)
├── AddVideoModal
│   ├── Search
│   └── Video Grid
│       └── VideoItem (x N)
└── DeleteConfirmationModal
```

## 🔄 Data Flow Diagram

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │
       │ User Action
       v
┌──────────────────┐
│   Component      │
│  (Page/Modal)    │
└──────┬───────────┘
       │
       │ Call Hook
       v
┌──────────────────┐      ┌──────────────┐
│  React Query     │      │   Zustand    │
│  Hook            │─────→│   Store      │
│  (useMutation/   │      │  (UI State)  │
│   useQuery)      │      └──────────────┘
└──────┬───────────┘
       │
       │ API Call
       v
┌──────────────────┐
│  Service Layer   │
│  (playlistService)│
└──────┬───────────┘
       │
       │ HTTP Request
       v
┌──────────────────┐
│  Backend API     │
│  /playlists/*    │
└──────┬───────────┘
       │
       │ Response
       v
┌──────────────────┐
│  React Query     │
│  Cache Update    │
└──────┬───────────┘
       │
       │ Invalidate/Refetch
       v
┌──────────────────┐
│   Component      │
│   Re-render      │
└──────────────────┘
```

## 🎨 UI State Transitions

### Modal States

```
Closed ──[Click Button]──→ Open
   ↑                         │
   │                         │
   └───[Submit/Cancel]───────┘
```

### Button States

```
Save Button:
  Initial: Disabled (no changes)
  Changed: Enabled (hasChanges = true)
  Saving:  Loading (isUpdating = true)
  Saved:   Disabled (hasChanges = false)

Cancel Button:
  Initial: Disabled (no changes)
  Changed: Enabled (hasChanges = true)
  Clicked: Reset form → Disabled
```

### Video Item States

```
Normal ──[Hover]──→ Actions Visible
  │                      │
  │                      ├─[Click Play]──→ Active
  │                      │                   │
  │                      │                   └─[Active Indicator]
  │                      │
  │                      └─[Click Remove]──→ Show Confirmation
  │
  └─[Grab ⋮⋮]──→ Dragging ──[Drop]──→ Repositioned
```

## 📱 Responsive Layout Flow

### Desktop (lg+)

```
┌───────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐    │
│  │   Player    │  │  Video List │    │
│  │             │  │  (Sortable) │    │
│  │   50%       │  │     50%     │    │
│  └─────────────┘  └─────────────┘    │
└───────────────────────────────────────┘
```

### Mobile

```
┌───────────────┐
│   Player      │
│               │
│     100%      │
└───────────────┘
        ↓
┌───────────────┐
│  Video List   │
│  (Sortable)   │
│               │
│     100%      │
└───────────────┘
```

## 🎯 User Journey Map

```
1. DISCOVER
   │
   └─→ User sees "PLAYLISTS" in sidebar
       │
       v
2. BROWSE
   │
   └─→ Click → See list of playlists
       │
       v
3. CREATE (Optional)
   │
   └─→ Click "TẠO PLAYLIST" → Fill form → Submit
       │
       v
4. VIEW DETAIL
   │
   └─→ Click playlist card → Load detail page
       │
       v
5. MANAGE VIDEOS
   │
   ├─→ Play videos
   ├─→ Drag & drop to reorder
   ├─→ Add new videos
   └─→ Remove videos
       │
       v
6. EDIT INFO
   │
   └─→ Edit name/description → Save changes
       │
       v
7. DELETE (Optional)
   │
   └─→ Delete video → If last → Delete playlist
       │
       v
   [End: Back to list]
```

## 🔄 Component Communication

```
PlaylistDetailPage (Container)
    │
    ├─→ Fetch Playlist ──→ usePlaylist(id)
    │                           │
    │                           v
    │                      React Query Cache
    │                           │
    │                           v
    │                      Playlist + Videos
    │
    ├─→ Initialize State ──→ usePlaylistStore
    │                           │
    │                           ├─ playlistVideos
    │                           ├─ activeVideoId
    │                           └─ modals state
    │
    ├─→ Render VideoPlayer
    │        │
    │        └─ Props: url, poster, title
    │                 (from activeVideo)
    │
    ├─→ Render DraggableVideoList
    │        │
    │        ├─ Props: videos, activeId, callbacks
    │        │
    │        └─ DndContext
    │             │
    │             └─ SortableContext
    │                   │
    │                   └─ SortableVideoItem (x N)
    │                         │
    │                         ├─ useSortable()
    │                         └─ Drag handle, actions
    │
    ├─→ Render Edit Form
    │        │
    │        ├─ Local state: name, description
    │        ├─ Track changes: hasChanges
    │        └─ Actions: Save/Cancel
    │
    └─→ Render Modals
            ├─ AddVideoModal
            │     │
            │     ├─ Fetch published videos
            │     ├─ Filter + Search
            │     └─ Select video → Add
            │
            └─ DeleteConfirmationModal
                  │
                  ├─ Type: 'video' | 'playlist'
                  └─ Confirm → Delete
```

## 🎮 Interaction Diagram

```
┌────────────────────────────────────────────────────┐
│                  Detail Page                       │
│                                                    │
│  Video Player          Video List                 │
│  ┌──────────┐          ⋮⋮ 1 [Thumb] Title [▶][🗑] │
│  │ ▶ VIDEO  │          ⋮⋮ 2 [Thumb] Title [▶][🗑] │
│  │          │          ⋮⋮ 3 [Thumb] Title [▶][🗑] │
│  │  Active  │              ↑                       │
│  │  Video   │              │                       │
│  └──────────┘              │                       │
│       ↑                    │                       │
│       │                    │                       │
│       └────────────────────┘                       │
│           setActiveVideoId                         │
│                                                    │
│  Edit Form                                         │
│  [Tên: ___________] ─┐                            │
│  [Mô tả: _________] ─┤─→ Track Changes            │
│  [LƯU] [BỎ QUA]     ─┘    ↓                       │
│                         hasChanges                 │
│                            ↓                       │
│                      Enable/Disable                │
│                         Buttons                    │
└────────────────────────────────────────────────────┘
```

## 📊 State Lifecycle

```
Component Mount
    │
    v
Fetch Playlist (useQuery)
    │
    ├─→ Loading State
    │       │
    │       v
    │   Show Skeleton
    │
    ├─→ Success
    │       │
    │       v
    │   Initialize Form
    │       │
    │       v
    │   Set playlistVideos
    │       │
    │       v
    │   Set activeVideoId (first video)
    │       │
    │       v
    │   Render UI
    │
    └─→ Error
            │
            v
        Show Error Toast

User Interactions
    │
    ├─→ Edit Form
    │       │
    │       v
    │   Update local state
    │       │
    │       v
    │   Track hasChanges
    │       │
    │       v
    │   Enable buttons
    │
    ├─→ Drag & Drop
    │       │
    │       v
    │   Reorder local state (optimistic)
    │       │
    │       v
    │   API call (background)
    │       │
    │       v
    │   Success → Keep new order
    │   Error → Rollback (auto by React Query)
    │
    ├─→ Add Video
    │       │
    │       v
    │   Open modal → Select → Add
    │       │
    │       v
    │   Invalidate query
    │       │
    │       v
    │   Refetch → List updates
    │
    └─→ Remove Video
            │
            v
        Check if last video
            │
            ├─→ YES: Show playlist delete warning
            │
            └─→ NO: Show video delete confirmation
```

## 🎨 Visual States

### Playlist Card

```
┌─────────────────┐
│   [Thumbnail]   │
│   [10 Videos]   │  ← Badge
│                 │
│  Playlist Name  │
│  Description    │
│  Date  →Detail  │
└─────────────────┘
         ↓ Hover
┌─────────────────┐
│   [Thumbnail]   │
│   [10 Videos]   │
│         [🗑️]     │  ← Delete appears
│  Playlist Name  │
│  Scale(1.05)    │  ← Slight zoom
└─────────────────┘
```

### Video Item (Draggable)

```
Normal State:
⋮⋮ 1 [Thumb] Video Title           [hidden] [hidden]

Hover State:
⋮⋮ 1 [Thumb] Video Title           [  ▶  ] [ 🗑️  ]
                                    visible  visible

Active State:
⋮⋮ 1 [Thumb] Video Title • ĐANG PHÁT  [  ▶  ] [ 🗑️  ]
     bg-white/5

Dragging State:
⋮⋮ 1 [Thumb] Video Title           opacity-50
     (following cursor)
```

## 🚀 Performance Flow

```
Initial Load
    │
    v
React Query: Fetch playlists
    │
    ├─→ Cache (5 min staleTime)
    │       │
    │       v
    │   Subsequent visits → Instant display
    │
    v
User navigates to detail
    │
    v
React Query: Fetch playlist detail
    │
    ├─→ Cache per playlist ID
    │
    v
User drags video
    │
    v
Optimistic Update (instant UI)
    │
    v
API call (background)
    │
    ├─→ Success: Keep changes
    └─→ Error: Rollback (automatic)
```

## 🎯 Summary

Các flow diagrams này giúp hiểu:

- 🗺️ Navigation structure
- 🔄 Data flow
- 🎮 User interactions
- 💾 State management
- 🎨 Visual states
- ⚡ Performance optimizations

**Reference khi develop hoặc debug feature!** 📚
