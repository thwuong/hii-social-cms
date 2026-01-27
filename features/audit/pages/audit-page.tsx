import { Typography } from '@/shared';
import { ContentItem } from '@/shared/types';
import { useNavigate, useRouteContext } from '@tanstack/react-router';
import { useState } from 'react';

function AuditPageComponent() {
  const navigate = useNavigate();
  const { items } = useRouteContext({ strict: false });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleNavigateToDetail = (id: string) => {
    navigate({ to: '/detail/$contentId', params: { contentId: id } });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectAll = (visibleItems: ContentItem[]) => {
    const visibleIds = visibleItems.map((i) => i.content_id);
    if (visibleIds.every((id) => selectedIds.includes(id))) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      const newSelection = new Set([...selectedIds, ...visibleIds]);
      setSelectedIds(Array.from(newSelection));
    }
  };

  return (
    <div className="animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <Typography variant="h2" className="text-white">
              AUDIT
            </Typography>
            <Typography variant="small" className="text-muted-foreground font-mono">
              Quản lý các hoạt động audit của hệ thống
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditPageComponent;
