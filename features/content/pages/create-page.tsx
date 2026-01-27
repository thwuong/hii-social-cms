import React, { useState } from 'react';
import { useNavigate, useRouteContext } from '@tanstack/react-router';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/shared/ui';
import { MediaType, SourcePlatform, SourceType } from '@/shared/types';

function CreatePageComponent() {
  const navigate = useNavigate();
  const { categories, service, currentUser, refreshData } = useRouteContext({ strict: false });

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
    <div className="mx-auto w-full py-8">
      <Card>
        <CardHeader>
          <CardTitle>GIAO_THỨC_TÀI_NGUYÊN_MỚI</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="font-mono text-xs text-zinc-500 uppercase">Tiêu đề</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nhập tiêu đề..."
                />
              </div>

              <div className="grid gap-2">
                <label className="font-mono text-xs text-zinc-500 uppercase">Mô tả</label>
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
                  <label className="font-mono text-xs text-zinc-500 uppercase">Định dạng</label>
                  <Select
                    value={formData.media_type}
                    onValueChange={(value) => setFormData({ ...formData, media_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Định dạng" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(MediaType).map((v) => (
                        <SelectItem key={v} value={v}>
                          {mediaTypeLabels[v] || v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c: string) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-white/10 pt-4">
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

export default CreatePageComponent;
