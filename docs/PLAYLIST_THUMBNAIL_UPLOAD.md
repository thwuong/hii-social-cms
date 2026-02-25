# Playlist Thumbnail Upload Feature

## 📋 Overview

Thêm chức năng upload thumbnail cho Create Playlist Modal với preview, validation và UX tối ưu.

## ✨ Features Implemented

### 1. **File Upload Input**

- Click để mở file picker
- Accept: PNG, JPG, GIF
- Max size: 5MB
- Hidden native input với styled overlay

### 2. **Image Preview**

- Hiển thị thumbnail đã chọn
- Hover overlay với button "Xóa"
- Smooth transitions

### 3. **Validation**

- ✅ File type validation (image only)
- ✅ File size validation (max 5MB)
- ✅ Toast notifications cho errors

### 4. **Data Handling**

- Convert to base64 (DataURL)
- Store in form state
- Send with create playlist payload

## 🎨 UI Design

### Empty State (No Thumbnail)

```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────────┐            │
│         │  [Upload]   │            │
│         └─────────────┘            │
│                                     │
│    Click để upload thumbnail        │
│    PNG, JPG, GIF (Max 5MB)         │
│                                     │
└─────────────────────────────────────┘
        ↑ Dashed border (hover effect)
```

### With Thumbnail Preview

```
┌─────────────────────────────────────┐
│                                     │
│     [Thumbnail Image Preview]       │
│                                     │
│         [Hover Overlay]             │
│         [  X  Xóa  ]               │
│                                     │
└─────────────────────────────────────┘
        ↑ Solid border + hover delete
```

## 💻 Implementation

### Component Structure

```tsx
export function CreatePlaylistModal({...}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  // File change handler
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file tối đa 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setThumbnailPreview(result);
      setValue('thumbnail', result, { shouldValidate: true, shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  // Remove handler
  const handleRemoveThumbnail = () => {
    setThumbnailPreview('');
    setValue('thumbnail', '', { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset on close
  const handleClose = () => {
    reset();
    setThumbnailPreview('');
    onClose();
  };
}
```

### Form Integration

```tsx
// Schema already supports thumbnail
export const createPlaylistSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  video_ids: z.array(z.string()).optional(),
  thumbnail: z.string().optional(), // Base64 string
});
```

### UI Components

**Upload Button (Empty State):**

```tsx
<button
  type="button"
  onClick={() => fileInputRef.current?.click()}
  className="group relative flex h-40 w-full cursor-pointer items-center justify-center border border-dashed border-white/20 bg-zinc-900 transition-all hover:border-white/40 hover:bg-zinc-800"
>
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
  />
  <div className="flex flex-col items-center gap-2">
    <div className="flex h-12 w-12 items-center justify-center border border-white/20 bg-zinc-800 transition-colors group-hover:border-white/40">
      <Upload className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-white" />
    </div>
    <div className="text-center">
      <Typography variant="small" className="font-mono text-zinc-400">
        Click để upload thumbnail
      </Typography>
      <Typography variant="tiny" className="mt-1 font-mono text-zinc-600">
        PNG, JPG, GIF (Max 5MB)
      </Typography>
    </div>
  </div>
</button>
```

**Preview with Delete (Filled State):**

```tsx
<div className="group relative h-40 overflow-hidden border border-white/20 bg-black">
  <img src={thumbnailPreview} alt="Thumbnail preview" className="h-full w-full object-cover" />
  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
    <Button
      type="button"
      size="sm"
      variant="destructive"
      onClick={handleRemoveThumbnail}
      className="font-mono text-xs uppercase"
    >
      <X size={14} className="mr-1" />
      Xóa
    </Button>
  </div>
</div>
```

## 🔄 User Flow

### Upload Flow

```
1. User clicks upload area
   ↓
2. Native file picker opens
   ↓
3. User selects image file
   ↓
4. Validation checks:
   ├─ File type → Must be image/*
   └─ File size → Max 5MB
   ↓
5. Convert to base64 (FileReader)
   ↓
6. Update preview state
   ↓
7. Update form value (setValue)
   ↓
8. Display thumbnail preview
```

### Delete Flow

```
1. Hover over thumbnail
   ↓
2. Overlay with "Xóa" button appears
   ↓
3. Click "Xóa"
   ↓
4. Clear preview state
   ↓
5. Clear form value
   ↓
6. Reset file input
   ↓
7. Show upload area again
```

### Validation Flow

```
User selects file
   ↓
Check file type
   ├─ Not image → Toast error
   └─ Is image → Continue
   ↓
Check file size
   ├─ > 5MB → Toast error
   └─ ≤ 5MB → Continue
   ↓
Process and preview
```

## 🎯 Validation Rules

### File Type

```typescript
if (!file.type.startsWith('image/')) {
  toast.error('Vui lòng chọn file ảnh');
  return;
}
```

**Accepted:**

- `image/png`
- `image/jpeg`
- `image/jpg`
- `image/gif`
- `image/webp`
- etc.

**Rejected:**

- `video/*`
- `application/*`
- `text/*`
- etc.

### File Size

```typescript
if (file.size > 5 * 1024 * 1024) {
  // 5MB
  toast.error('Kích thước file tối đa 5MB');
  return;
}
```

**Max:** 5,242,880 bytes (5MB)

## 📦 Data Format

### Form State

```typescript
{
  name: string,
  description?: string,
  video_ids: string[],
  thumbnail?: string // base64 DataURL
}
```

### Base64 Example

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...
```

### Payload

```typescript
interface CreatePlaylistPayload {
  name: string;
  description?: string;
  video_ids: string[];
  thumbnail?: string; // base64
}
```

## 🎨 Styling (Carbon Kinetic)

### Upload Area (Empty)

```css
.upload-area {
  height: 10rem; /* h-40 */
  border: 1px dashed rgba(255, 255, 255, 0.2);
  background: rgb(24, 24, 27); /* zinc-900 */
  transition: all 200ms;
}

.upload-area:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgb(39, 39, 42); /* zinc-800 */
}

.upload-icon-wrapper {
  width: 3rem;
  height: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgb(39, 39, 42); /* zinc-800 */
}

.upload-icon-wrapper:hover {
  border-color: rgba(255, 255, 255, 0.4);
}
```

### Preview Area (Filled)

```css
.preview-container {
  height: 10rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: black;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 200ms;
}

.preview-container:hover .preview-overlay {
  opacity: 1;
}
```

### Delete Button

```css
.delete-button {
  font-family: monospace;
  font-size: 0.75rem; /* text-xs */
  text-transform: uppercase;
  background: rgb(127, 29, 29); /* destructive */
}

.delete-button:hover {
  background: rgb(153, 27, 27);
}
```

## 🔧 Technical Details

### FileReader API

```typescript
const reader = new FileReader();
reader.onloadend = () => {
  const result = reader.result as string; // base64 DataURL
  setThumbnailPreview(result);
  setValue('thumbnail', result);
};
reader.readAsDataURL(file); // Convert to base64
```

**Output Format:**

```
data:[<mediatype>][;base64],<data>
```

**Example:**

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
```

### Form State Management

```typescript
// React Hook Form integration
setValue('thumbnail', result, {
  shouldValidate: true, // Run validation
  shouldDirty: true, // Mark field as dirty
});
```

### Reset Logic

```typescript
const handleClose = () => {
  reset(); // Reset React Hook Form
  setThumbnailPreview(''); // Clear preview state
  onClose(); // Close modal
};
```

## 📱 Responsive Design

### Desktop

- Upload area: `h-40` (160px)
- Icon wrapper: `h-12 w-12` (48px)
- Preview: Full width with `object-cover`

### Mobile

- Same layout (already responsive)
- Touch-friendly click areas
- Native file picker on mobile devices

## ♿ Accessibility

### Semantic HTML

```tsx
// Use <button> instead of <div> for clickable upload area
<button
  type="button"
  onClick={() => fileInputRef.current?.click()}
  {...props}
>
```

### Keyboard Support

- ✅ Tab navigation to upload button
- ✅ Enter/Space to activate
- ✅ Native file picker keyboard support

### Screen Readers

- ✅ `alt` text on preview image
- ✅ Semantic button elements
- ✅ Clear label "Thumbnail"

## 🧪 Testing Checklist

### Upload Functionality

- [ ] Click upload area opens file picker
- [ ] Select image file shows preview
- [ ] Preview displays correctly
- [ ] Form value updates with base64

### Validation

- [ ] Non-image file → Toast error
- [ ] File > 5MB → Toast error
- [ ] Valid image → Success
- [ ] Multiple file types work (PNG, JPG, GIF)

### Delete Functionality

- [ ] Hover shows delete button
- [ ] Click delete clears preview
- [ ] Upload area returns to empty state
- [ ] Form value clears
- [ ] Can upload again after delete

### Form Integration

- [ ] Thumbnail included in submit payload
- [ ] Form validation works
- [ ] isDirty state updates correctly
- [ ] Reset clears thumbnail

### Edge Cases

- [ ] Cancel file picker → No error
- [ ] Upload same file twice → Works
- [ ] Close modal → State resets
- [ ] Large image (4.9MB) → Success
- [ ] Exact 5MB → Success
- [ ] 5.1MB → Error

## 🎯 Use Cases

### Scenario 1: Upload Custom Thumbnail

```
1. User opens "Tạo Playlist Mới" modal
2. Fills in name and description
3. Clicks thumbnail upload area
4. Selects profile_pic.jpg (2MB)
5. Preview appears
6. Clicks "Tạo Playlist"
7. Playlist created with custom thumbnail
```

### Scenario 2: Upload Error (Too Large)

```
1. User clicks upload area
2. Selects large_image.png (8MB)
3. Toast error: "Kích thước file tối đa 5MB"
4. Upload area remains empty
5. User selects smaller file
6. Success
```

### Scenario 3: Change Thumbnail

```
1. User uploads thumbnail_1.jpg
2. Preview shows
3. Hovers over preview
4. Clicks "Xóa"
5. Preview clears
6. Clicks upload area again
7. Selects thumbnail_2.png
8. New preview shows
```

### Scenario 4: Cancel Upload

```
1. User clicks upload area
2. File picker opens
3. User clicks "Cancel"
4. Nothing happens (no error)
5. Upload area remains empty
```

## 🔗 Related Files

### Modified

- `features/playlist/components/create-playlist-modal.tsx`
  - Added file input ref
  - Added thumbnail preview state
  - Added file change handler
  - Added remove handler
  - Added upload UI
  - Added preview UI

### Already Existing

- `features/playlist/schema/create-playlist.schema.ts`
  - Already has `thumbnail?: string`
- `features/playlist/types/index.ts`
  - Already has `thumbnail?: string` in payload

## 🚀 Future Enhancements

### Possible Improvements

1. **Image Cropper**: Crop/resize before upload
2. **Drag & Drop**: Drag files into upload area
3. **Multiple Formats**: Support AVIF, HEIC
4. **Compression**: Auto-compress large images
5. **Cloud Upload**: Upload directly to S3/CDN
6. **URL Input**: Paste image URL instead of file
7. **Progress Bar**: Show upload progress
8. **Image Editor**: Basic filters/adjustments

### API Integration

```typescript
// Current: base64 in payload
{
  thumbnail: 'data:image/png;base64,...';
}

// Future: Upload to storage first
async function uploadThumbnail(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/upload/thumbnail', formData);
  return response.url; // Return URL instead of base64
}

// Payload with URL
{
  thumbnail: 'https://cdn.example.com/thumbnails/abc123.jpg';
}
```

## 📊 Performance

### File Size Impact

- **Base64 increases size by ~33%**
  - 1MB image → ~1.33MB base64
  - 5MB limit → ~6.65MB in payload

### Optimization Tips

1. Compress images before upload (client-side)
2. Use modern formats (WebP, AVIF)
3. Resize to reasonable dimensions (e.g., 1280x720)
4. Consider lazy loading for preview

### Memory Usage

- FileReader uses memory during conversion
- Preview stored in component state
- Form stores base64 string
- Clear on unmount/reset

## ✅ Summary

### What Was Added

- ✅ File upload input with styled button
- ✅ Image preview with hover delete
- ✅ File type validation (image only)
- ✅ File size validation (max 5MB)
- ✅ Toast error notifications
- ✅ Base64 conversion
- ✅ Form integration
- ✅ State management
- ✅ Reset logic
- ✅ Accessibility (semantic HTML, keyboard support)

### Files Modified

- `features/playlist/components/create-playlist-modal.tsx`

### Zero Breaking Changes

- Schema already supported thumbnail
- Types already defined
- Backward compatible (thumbnail is optional)

---

**🎉 Thumbnail Upload Feature Complete!**

User có thể upload custom thumbnail cho playlist với validation đầy đủ và UX mượt mà theo Carbon Kinetic theme! 🖼️
