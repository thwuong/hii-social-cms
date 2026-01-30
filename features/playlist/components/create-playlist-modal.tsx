import { Button, Dialog, DialogContent, Input, Label, Textarea, Typography } from '@/shared/ui';
import { X } from 'lucide-react';
import { useState } from 'react';
import type { CreatePlaylistPayload } from '../types';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePlaylistPayload) => void;
  selectedVideoIds?: string[];
}

export function CreatePlaylistModal({
  isOpen,
  onClose,
  onSubmit,
  selectedVideoIds = [],
}: CreatePlaylistModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      video_ids: selectedVideoIds,
    });

    // Reset form
    setName('');
    setDescription('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-white/20 bg-black p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <Typography variant="h4" className="font-mono uppercase">
            Tạo Playlist Mới
          </Typography>
        </div>

        {/* Form */}
        <div className="space-y-6 p-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="playlist-name" className="font-mono text-xs text-zinc-400 uppercase">
              Tên Playlist *
            </Label>
            <Input
              id="playlist-name"
              placeholder="Nhập tên playlist..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-white/20 bg-zinc-900 font-mono text-white"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="playlist-description"
              className="font-mono text-xs text-zinc-400 uppercase"
            >
              Mô Tả
            </Label>
            <Textarea
              id="playlist-description"
              placeholder="Nhập mô tả playlist..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-white/20 bg-zinc-900 font-mono text-white"
              rows={3}
            />
          </div>

          {/* Video Count */}
          {selectedVideoIds.length > 0 && (
            <div className="flex items-center gap-2 border-t border-white/10 pt-4">
              <Typography variant="small" className="font-mono text-zinc-500">
                {selectedVideoIds.length} video đã chọn
              </Typography>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 p-6">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="font-mono uppercase hover:bg-white/10"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="border-white bg-white font-mono text-black uppercase hover:bg-zinc-200"
          >
            Tạo Playlist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
