import { createRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Textarea,
} from '@/shared/ui/primitives';
import { MediaType, SourcePlatform, SourceType } from '@/shared/types';
import { rootRoute } from './root-layout';

export const createContentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreatePage,
});

function CreatePage() {
  const navigate = createContentRoute.useNavigate();
  const { categories, service, currentUser, refreshData } = createContentRoute.useRouteContext();

  const [formData, setFormData] = useState<any>({
    title: '',
    short_description: '',
    media_type: MediaType.VIDEO,
    media_url: '',
    source_type: SourceType.MANUAL,
    source_platform: SourcePlatform.OTHER,
    target_platforms: [SourcePlatform.OTHER],
    original_source_url: '',
    category: categories[0] || 'Thể thao',
    tags: [],
    visibility: 'public',
    moderation_notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    service.createContent(formData, currentUser.name);
    refreshData();
    navigate({ to: '/content' });
  };

  const mediaTypeLabels: Record<string, string> = {
    [MediaType.VIDEO]: 'Video',
    [MediaType.TEXT]: 'Bài viết',
    [MediaType.IMAGE]: 'Hình ảnh',
    [MediaType.LINK]: 'Liên kết',
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>GIAO_THỨC_TÀI_NGUYÊN_MỚI</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-xs font-mono uppercase text-zinc-500">Tiêu đề</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nhập tiêu đề..."
                />
              </div>

              <div className="grid gap-2">
                <label className="text-xs font-mono uppercase text-zinc-500">Mô tả</label>
                <Textarea
                  required
                  className="h-32"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Tóm tắt nội dung..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-xs font-mono uppercase text-zinc-500">Định dạng</label>
                  <Select
                    value={formData.media_type}
                    onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                  >
                    {Object.values(MediaType).map((v) => (
                      <option key={v} value={v}>
                        {mediaTypeLabels[v] || v}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-mono uppercase text-zinc-500">Danh mục</label>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c: string) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/10 mt-6">
              <Button type="button" variant="ghost" onClick={() => navigate({ to: '/content' })}>
                HỦY
              </Button>
              <Button type="submit">KHỞI TẠO</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
