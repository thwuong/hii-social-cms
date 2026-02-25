# PlaylistForm Component

## 📋 Overview

Reusable form component cho creating và editing playlists với đầy đủ validation, thumbnail upload, và video count display.

## ✨ Features

- ✅ **Name Field** - Required text input
- ✅ **Description Field** - Optional textarea
- ✅ **Thumbnail Upload** - Image upload với preview
- ✅ **Video Count** - Optional display cho selected videos
- ✅ **React Hook Form Integration** - Controlled component
- ✅ **Validation** - Zod schema validation
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Reusable** - Use in any modal/page

## 🎯 Props

```typescript
interface PlaylistFormProps {
  control: Control<CreatePlaylistSchema>;
  watch: UseFormWatch<CreatePlaylistSchema>;
  setValue: UseFormSetValue<CreatePlaylistSchema>;
  selectedVideoCount?: number;
  showVideoCount?: boolean;
  className?: string;
}
```

### Prop Details

**`control`** (required)

- Type: `Control<CreatePlaylistSchema>`
- React Hook Form control object
- Used for field registration and validation

**`watch`** (required)

- Type: `UseFormWatch<CreatePlaylistSchema>`
- React Hook Form watch function
- Monitors form values for controlled inputs

**`setValue`** (required)

- Type: `UseFormSetValue<CreatePlaylistSchema>`
- React Hook Form setValue function
- Updates form values programmatically

**`selectedVideoCount`** (optional)

- Type: `number`
- Default: `0`
- Number of videos selected

**`showVideoCount`** (optional)

- Type: `boolean`
- Default: `false`
- Whether to show video count display

**`className`** (optional)

- Type: `string`
- Default: `''`
- Additional CSS classes for container

## 💻 Usage

### Basic Usage

```tsx
import { PlaylistForm } from '@/features/playlist/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createPlaylistSchema,
  CreatePlaylistSchema,
} from '@/features/playlist/schema/create-playlist.schema';

function MyComponent() {
  const { control, watch, setValue, handleSubmit } = useForm<CreatePlaylistSchema>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      name: '',
      description: '',
      thumbnail: '',
      video_ids: [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PlaylistForm control={control} watch={watch} setValue={setValue} />
    </form>
  );
}
```

### With Selected Videos

```tsx
<PlaylistForm
  control={control}
  watch={watch}
  setValue={setValue}
  selectedVideoCount={5}
  showVideoCount
/>
```

### In CreatePlaylistModal

```tsx
// features/playlist/components/create-playlist-modal.tsx

export function CreatePlaylistModal({ selectedVideoIds = [] }) {
  const { control, watch, setValue, handleSubmit } = useForm<CreatePlaylistSchema>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      name: '',
      description: '',
      thumbnail: '',
      video_ids: [],
    },
  });

  return (
    <Dialog>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <PlaylistForm
            control={control}
            watch={watch}
            setValue={setValue}
            selectedVideoCount={selectedVideoIds.length}
            showVideoCount={selectedVideoIds.length > 0}
          />

          {/* Submit Button */}
          <Button type="submit">Tạo Playlist</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### In AddToPlaylistModal

```tsx
// features/content/components/add-to-playlist-modal.tsx

export function AddToPlaylistModal({ selectedCount }) {
  const { control, watch, setValue, handleSubmit } = useForm<CreatePlaylistSchema>({
    resolver: zodResolver(createPlaylistSchema),
  });

  return (
    <Dialog>
      <DialogContent>
        {showCreateForm && (
          <form onSubmit={handleSubmit(handleCreatePlaylist)}>
            <PlaylistForm
              control={control}
              watch={watch}
              setValue={setValue}
              selectedVideoCount={selectedCount}
              showVideoCount
            />

            {/* Actions */}
            <Button type="button" onClick={() => setShowCreateForm(false)}>
              Quay Lại
            </Button>
            <Button type="submit">Tạo & Thêm Video</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

## 🎨 UI Structure

### Form Fields

```
┌─────────────────────────────────────┐
│ Tên Playlist *                      │
│ [Input: Nhập tên playlist...]       │
├─────────────────────────────────────┤
│ Mô Tả                               │
│ [Textarea: Nhập mô tả playlist...]  │
├─────────────────────────────────────┤
│ Thumbnail                           │
│ [ThumbnailUpload component]         │
├─────────────────────────────────────┤
│ 5 video đã chọn (if showVideoCount) │
└─────────────────────────────────────┘
```

### Field Details

**1. Name Field:**

- Type: Text input
- Required: Yes
- Validation: Min 1 character
- Placeholder: "Nhập tên playlist..."
- Uses: FormField component

**2. Description Field:**

- Type: Textarea
- Required: No
- Validation: None
- Placeholder: "Nhập mô tả playlist..."
- Rows: 3

**3. Thumbnail Field:**

- Type: Image upload
- Required: No
- Validation: Image type, max 5MB
- Uses: ThumbnailUpload component

**4. Video Count:**

- Type: Display only
- Shows: "{count} video đã chọn"
- Conditional: Only if `showVideoCount && selectedVideoCount > 0`

## 🔧 Schema Integration

### CreatePlaylistSchema

```typescript
import z from 'zod';

export const createPlaylistSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  video_ids: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
});

export type CreatePlaylistSchema = z.infer<typeof createPlaylistSchema>;
```

### Form Values

```typescript
{
  name: string;           // Required
  description?: string;   // Optional
  video_ids?: string[];   // Optional (usually set by parent)
  thumbnail?: string;     // Optional base64 DataURL
}
```

## 🎨 Styling (Carbon Kinetic)

### Container

```css
.playlist-form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* space-y-6 */
}
```

### Name Field

```css
.name-field {
  font-family: monospace;
  background: rgb(24, 24, 27); /* zinc-900 */
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}
```

### Description Field

```css
.description-textarea {
  font-family: monospace;
  background: rgb(24, 24, 27); /* zinc-900 */
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  rows: 3;
}
```

### Video Count Display

```css
.video-count {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  font-family: monospace;
  font-size: 0.875rem;
  color: rgb(113, 113, 122); /* zinc-500 */
}
```

## ♻️ Reusability

### Before Extraction

**CreatePlaylistModal:**

```tsx
// 50+ lines of form JSX
<div className="space-y-2">
  <FormField control={control} name="name" ... />
</div>
<div className="space-y-2">
  <Label>Mô Tả</Label>
  <Textarea ... />
</div>
<div className="space-y-2">
  <Label>Thumbnail</Label>
  <ThumbnailUpload ... />
</div>
{selectedVideoIds.length > 0 && (
  <div>...</div>
)}
```

**AddToPlaylistModal:**

```tsx
// 50+ lines of duplicate form JSX
<div className="space-y-2">
  <FormField control={control} name="name" ... />
</div>
<div className="space-y-2">
  <Label>Mô Tả</Label>
  <Textarea ... />
</div>
// ... same code
```

### After Extraction

**Both Modals:**

```tsx
// 1 line!
<PlaylistForm
  control={control}
  watch={watch}
  setValue={setValue}
  selectedVideoCount={selectedVideoIds.length}
  showVideoCount={selectedVideoIds.length > 0}
/>
```

**Code Reduction:**

- CreatePlaylistModal: ~50 lines → 6 lines
- AddToPlaylistModal: ~50 lines → 6 lines
- Total saved: ~90 lines

## 📊 Component Stats

### Size

- **Lines of Code:** ~95
- **Props:** 6
- **Fields:** 3 (name, description, thumbnail)
- **Dependencies:** FormField, Textarea, ThumbnailUpload, Typography, Label

### Usage

- ✅ **CreatePlaylistModal** (playlist feature)
- ✅ **AddToPlaylistModal** (content feature)
- ⏳ **EditPlaylistModal** (future)
- ⏳ **Any other playlist form needs**

## 🔄 Data Flow

### Input Flow

```
Parent Component
    ↓
useForm({ defaultValues })
    ↓
control, watch, setValue
    ↓
<PlaylistForm
  control={control}
  watch={watch}
  setValue={setValue}
/>
    ↓
Form fields controlled by RHF
    ↓
User types → watch() updates → setValue()
    ↓
Form state updated
```

### Submit Flow

```
User fills form
    ↓
Parent calls handleSubmit(onSubmit)
    ↓
Form validation (Zod schema)
    ↓
If valid → onSubmit(data)
    ↓
Parent handles submit
    ↓
API call / State update
```

## 🧪 Testing

### Unit Testing

```tsx
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { PlaylistForm } from './playlist-form';

describe('PlaylistForm', () => {
  it('renders all fields', () => {
    const TestWrapper = () => {
      const { control, watch, setValue } = useForm();
      return <PlaylistForm control={control} watch={watch} setValue={setValue} />;
    };

    render(<TestWrapper />);

    expect(screen.getByLabelText('Tên Playlist')).toBeInTheDocument();
    expect(screen.getByLabelText('Mô Tả')).toBeInTheDocument();
    expect(screen.getByLabelText('Thumbnail')).toBeInTheDocument();
  });

  it('shows video count when enabled', () => {
    const TestWrapper = () => {
      const { control, watch, setValue } = useForm();
      return (
        <PlaylistForm
          control={control}
          watch={watch}
          setValue={setValue}
          selectedVideoCount={5}
          showVideoCount
        />
      );
    };

    render(<TestWrapper />);

    expect(screen.getByText('5 video đã chọn')).toBeInTheDocument();
  });

  it('hides video count when disabled', () => {
    const TestWrapper = () => {
      const { control, watch, setValue } = useForm();
      return (
        <PlaylistForm
          control={control}
          watch={watch}
          setValue={setValue}
          selectedVideoCount={5}
          showVideoCount={false}
        />
      );
    };

    render(<TestWrapper />);

    expect(screen.queryByText('5 video đã chọn')).not.toBeInTheDocument();
  });
});
```

### Integration Testing

```tsx
describe('PlaylistForm Integration', () => {
  it('updates form values on user input', async () => {
    const onSubmit = jest.fn();

    const TestWrapper = () => {
      const { control, watch, setValue, handleSubmit } = useForm({
        resolver: zodResolver(createPlaylistSchema),
      });

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <PlaylistForm control={control} watch={watch} setValue={setValue} />
          <button type="submit">Submit</button>
        </form>
      );
    };

    render(<TestWrapper />);

    // Fill name
    const nameInput = screen.getByPlaceholderText('Nhập tên playlist...');
    await userEvent.type(nameInput, 'My Playlist');

    // Fill description
    const descInput = screen.getByPlaceholderText('Nhập mô tả playlist...');
    await userEvent.type(descInput, 'My Description');

    // Submit
    const submitBtn = screen.getByText('Submit');
    await userEvent.click(submitBtn);

    // Check submission
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'My Playlist',
      description: 'My Description',
      thumbnail: '',
      video_ids: [],
    });
  });
});
```

## 📝 Best Practices

### 1. Always Provide All Required Props

```tsx
// ❌ Bad - Missing required props
<PlaylistForm control={control} />

// ✅ Good - All required props provided
<PlaylistForm
  control={control}
  watch={watch}
  setValue={setValue}
/>
```

### 2. Use showVideoCount Conditionally

```tsx
// ✅ Good - Only show when there are videos
<PlaylistForm
  control={control}
  watch={watch}
  setValue={setValue}
  selectedVideoCount={videos.length}
  showVideoCount={videos.length > 0}
/>
```

### 3. Wrap in Form Element

```tsx
// ✅ Good - Wrapped in form with onSubmit
<form onSubmit={handleSubmit(onSubmit)}>
  <PlaylistForm {...props} />
  <button type="submit">Submit</button>
</form>
```

### 4. Handle Validation

```tsx
// ✅ Good - Schema validation
const {
  control,
  watch,
  setValue,
  formState: { isValid },
} = useForm({
  resolver: zodResolver(createPlaylistSchema),
});

<Button type="submit" disabled={!isValid}>
  Submit
</Button>;
```

## 🔗 Related Components

### Uses

- `FormField` - Name input with label
- `Textarea` - Description field
- `ThumbnailUpload` - Image upload
- `Typography` - Video count text
- `Label` - Field labels

### Used By

- `CreatePlaylistModal`
- `AddToPlaylistModal`
- Future: `EditPlaylistModal`

### Similar Pattern

- `ContentForm` (if extracted)
- `UserProfileForm` (if extracted)
- Any reusable form component

## 🎯 Benefits of Extraction

### DRY (Don't Repeat Yourself)

- ✅ Single source of truth for playlist form
- ✅ No code duplication
- ✅ Consistent UX across all usages

### Maintainability

- ✅ Fix bugs in one place
- ✅ Add features once
- ✅ Update styles centrally

### Testability

- ✅ Test form in isolation
- ✅ Mock dependencies easily
- ✅ Unit + integration tests

### Flexibility

- ✅ Easy to customize via props
- ✅ Composable with other components
- ✅ Can add new props without breaking existing usage

## 📊 Comparison

### Before (Duplicated)

```
CreatePlaylistModal:       140 lines (50 form + 90 other)
AddToPlaylistModal:        292 lines (50 form + 242 other)
Total form code:           100 lines (duplicated)
```

### After (Extracted)

```
PlaylistForm:              95 lines (reusable)
CreatePlaylistModal:       95 lines (6 form + 89 other)
AddToPlaylistModal:        248 lines (6 form + 242 other)
Total form code:           95 lines (shared)
Code reduction:            ~90 lines saved
```

## 🚀 Future Enhancements

### Possible Additions

1. **Edit Mode:**

```tsx
<PlaylistForm
  control={control}
  watch={watch}
  setValue={setValue}
  mode="edit" // New prop
  initialValues={existingPlaylist}
/>
```

2. **Custom Validation:**

```tsx
<PlaylistForm
  control={control}
  watch={watch}
  setValue={setValue}
  validateName={(name) => name.length > 3}
/>
```

3. **Loading State:**

```tsx
<PlaylistForm control={control} watch={watch} setValue={setValue} disabled={isSubmitting} />
```

4. **Custom Labels:**

```tsx
<PlaylistForm
  control={control}
  watch={watch}
  setValue={setValue}
  labels={{
    name: 'Tên danh sách',
    description: 'Mô tả chi tiết',
    thumbnail: 'Ảnh đại diện',
  }}
/>
```

## 📁 Files

### Component Location

```
features/playlist/components/
└── playlist-form.tsx  (NEW)
```

### Export

```typescript
// features/playlist/components/index.ts
export { PlaylistForm } from './playlist-form';
```

### Dependencies

```typescript
import { ThumbnailUpload } from '@/shared/components';
import { Label, Textarea, Typography } from '@/shared/ui';
import FormField from '@/shared/ui/form-field';
import type { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { CreatePlaylistSchema } from '../schema/create-playlist.schema';
```

## ✅ Summary

### What This Component Provides

✅ **Reusable Form** - Use in any modal/page
✅ **Controlled Fields** - Works with React Hook Form
✅ **Validation** - Zod schema integrated
✅ **Type Safe** - Full TypeScript support
✅ **Composable** - Easy to integrate
✅ **Customizable** - Props for different scenarios
✅ **Tested** - Unit + integration testable
✅ **Documented** - Complete usage guide

### Code Impact

- **Files Created:** 1
- **Files Modified:** 3
  - `create-playlist-modal.tsx` (refactored)
  - `add-to-playlist-modal.tsx` (refactored)
  - `index.ts` (export added)
- **Lines Saved:** ~90
- **Duplication Removed:** 100%
- **Reusability:** ∞

### Quick Usage

```tsx
import { PlaylistForm } from '@/features/playlist/components';
import { useForm } from 'react-hook-form';

const { control, watch, setValue } = useForm<CreatePlaylistSchema>();

<PlaylistForm control={control} watch={watch} setValue={setValue} />;
```

---

**🎉 Component sẵn sàng tái sử dụng cho mọi nơi cần playlist form! 📝**
