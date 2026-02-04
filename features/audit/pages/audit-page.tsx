import { usePlatforms } from '@/features/content/hooks/usePlatform';
import { useDebounceSearch } from '@/shared/hooks/use-debounce-search';
import {
  Button,
  Calendar,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Typography,
} from '@/shared/ui';
import { useNavigate, useSearch } from '@tanstack/react-router';
import {
  AlertTriangle,
  CalendarIcon,
  Download,
  Filter,
  LayoutGrid,
  LayoutList,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { toast } from 'sonner';
import { AuditLogCard, AuditLogSkeleton, AuditLogTable } from '../components';
import { AUDIT_ACTION_LABELS } from '../constants';
import { useAuditLogs } from '../hooks';
import type { AuditSearchSchema } from '../schemas';
import { auditService } from '../services';
import { AuditAction } from '../types';

function AuditPageComponent() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const filters: AuditSearchSchema = useSearch({ strict: false });

  const { value, handleChange } = useDebounceSearch((inputValue: string) => {
    navigate({
      to: '/audit',
      search: { ...filters, search: inputValue },
    });
  }, 500);
  const { data: logs, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useAuditLogs();

  const { data: platforms } = usePlatforms();

  const [loadMoreRef] = useInfiniteScroll({
    hasNextPage,
    onLoadMore: fetchNextPage,
    loading: isFetchingNextPage,
  });

  const handleFilterAction = (action: AuditAction) => {
    const isExist = filters.actions?.includes(action);
    const actions = isExist
      ? filters.actions?.filter((item) => item !== action)
      : [...(filters.actions || []), action];
    navigate({
      to: '/audit',
      search: { ...filters, actions },
    });
  };

  const handleFilterPlatform = (platform: string) => {
    navigate({
      to: '/audit',
      search: { ...filters, platforms: [platform] },
    });
  };

  const handleViewDetail = (logId: string) => {
    navigate({ to: '/audit/$logId', params: { logId } });
  };

  const handleExport = async () => {
    const toastId = toast.loading('Đang xuất dữ liệu...');
    try {
      const blob = await auditService.exportAuditLogs(filters, 'csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${Date.now()}.csv`;
      a.click();
      toast.dismiss(toastId);
      toast.success('Xuất dữ liệu thành công');
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Xuất dữ liệu thất bại');
    }
  };

  return (
    <div className="relative flex h-full flex-col space-y-8 p-4 sm:p-10">
      {/* Header */}
      <div className="sticky top-0 z-50 flex flex-col gap-6 bg-black/80 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="text-white">
              LỊCH SỬ HOẠT ĐỘNG
            </Typography>
            <Typography variant="p" className="text-muted-foreground mt-2 font-mono">
              Quản lý các hoạt động audit của hệ thống
            </Typography>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-black'
                    : 'bg-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutList size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-black'
                    : 'bg-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>

            {/* Export Button */}
            <Button
              variant="outline"
              className="border-white/20 font-mono text-xs"
              onClick={handleExport}
            >
              <Download size={14} className="mr-2" />
              XUẤT DỮ LIỆU
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          {/* Action Filter */}
          <div className="space-y-3">
            <Typography variant="small" className="flex items-center gap-2 font-mono text-zinc-500">
              <Filter size={14} /> Lọc Hành Động
            </Typography>
            <div className="flex flex-wrap gap-1">
              {Object.values(AuditAction)
                .slice(0, 8)
                .map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => handleFilterAction(action)}
                    className={`border px-4 py-2 font-mono text-xs uppercase transition-all ${
                      filters.actions?.includes(action)
                        ? 'border-white bg-white text-black'
                        : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500'
                    }`}
                  >
                    {AUDIT_ACTION_LABELS[action]}
                  </button>
                ))}
            </div>
          </div>

          {/* Search */}
          <div className="flex justify-between gap-5 border-t border-white/10 pt-6">
            <div className="group relative flex-1">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
              <Input
                placeholder="TÌM KIẾM..."
                className="h-10 border-white/10 bg-black pl-10 font-mono text-xs text-white focus:border-white"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
              />
            </div>
            <Select
              value={filters.platforms.join(', ')}
              onValueChange={(selectedValue) => handleFilterPlatform(selectedValue)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tất cả nền tảng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem defaultChecked value="all">
                  Tất cả nền tảng
                </SelectItem>
                {platforms?.applications.map((p) => (
                  <SelectItem key={p.id} value={p.api_key}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-3 border-t border-white/10 pt-6">
            <Typography variant="small" className="flex items-center gap-2 font-mono text-zinc-500">
              <Filter size={14} /> Lọc Theo Thời Gian
            </Typography>
            <div className="grid gap-4 md:grid-cols-2">
              {/* From Date */}
              <div>
                <Typography variant="tiny" className="mb-2 text-zinc-600">
                  TỪ NGÀY
                </Typography>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-10 w-full justify-start border-white/10 bg-black text-left font-mono text-xs ${
                        !filters.from_date && 'text-zinc-600'
                      }`}
                    >
                      <CalendarIcon size={14} className="mr-2" />
                      {filters.from_date
                        ? new Date(filters.from_date).toLocaleDateString('vi-VN')
                        : 'Chọn ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto border-white/10 bg-zinc-900 p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.from_date ? new Date(filters.from_date) : undefined}
                      onSelect={(date) =>
                        navigate({
                          to: '/audit',
                          search: {
                            ...filters,
                            from_date: date ? date.toISOString() : undefined,
                          },
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* To Date */}
              <div>
                <Typography variant="tiny" className="mb-2 text-zinc-600">
                  ĐẾN NGÀY
                </Typography>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-10 w-full justify-start border-white/10 bg-black text-left font-mono text-xs ${
                        !filters.to_date && 'text-zinc-600'
                      }`}
                    >
                      <CalendarIcon size={14} className="mr-2" />
                      {filters.to_date
                        ? new Date(filters.to_date).toLocaleDateString('vi-VN')
                        : 'Chọn ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto border-white/10 bg-zinc-900 p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.to_date ? new Date(filters.to_date) : undefined}
                      onSelect={(date) =>
                        navigate({
                          to: '/audit',
                          search: {
                            ...filters,
                            to_date: date ? date.toISOString() : undefined,
                          },
                        })
                      }
                      initialFocus
                      disabled={(date) =>
                        filters.from_date ? date < new Date(filters.from_date) : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(filters.actions?.length || filters.from_date || filters.to_date || value) && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full border border-white/10 font-mono text-xs text-zinc-500 hover:text-white"
                onClick={() => {
                  handleChange('');
                  navigate({ to: '/audit', search: {} });
                }}
              >
                XÓA BỘ LỌC
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading && <AuditLogSkeleton count={8} variant={viewMode === 'grid' ? 'grid' : 'table'} />}

      {!isLoading && !logs?.length && (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertTriangle size={48} className="mb-4 text-zinc-600" />
          <Typography variant="h3" className="text-zinc-500">
            KHÔNG CÓ DỮ LIỆU
          </Typography>
        </div>
      )}

      {!isLoading && !!logs?.length && (
        <>
          {viewMode === 'table' ? (
            <AuditLogTable
              logs={logs}
              onRowClick={(log) => handleViewDetail(log.id)}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              loadMoreRef={loadMoreRef}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {logs.map((log) => (
                <AuditLogCard key={log.id} log={log} onView={() => handleViewDetail(log.id)} />
              ))}
            </div>
          )}

          {/* Infinite Scroll Trigger for Grid View */}
          {viewMode === 'grid' && hasNextPage && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isFetchingNextPage && (
                <Typography variant="small" className="font-mono text-zinc-500">
                  ĐANG TẢI...
                </Typography>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AuditPageComponent;
