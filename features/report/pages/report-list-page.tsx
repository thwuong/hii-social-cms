import { useInfiniteScroll } from '@/shared/hooks';
import { Input, Typography } from '@/shared/ui';
import { useNavigate } from '@tanstack/react-router';
import { AlertTriangle, Filter, Search, Tag } from 'lucide-react';
import { useState } from 'react';
import { ReportCard } from '../components';
import { useReportReasons, useReports } from '../hooks/useReport';
import { useReportStore } from '../stores/useReportStore';
import { ReportStatus } from '../types';
import { REPORT_STATUS_LABELS } from '../utils';

function ReportListPage() {
  const navigate = useNavigate();
  const { filters, setFilters } = useReportStore();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: reports,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useReports({
    cursor: filters.cursor || undefined,
    limit: filters.limit || undefined,
    status: filters.status || undefined,
  });

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 300,
  });

  // const debounceFn = useMemo(
  //   () => debounce((value: string) => setFilters('search', value), 500),
  //   [setFilters]
  // );

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target;
  //   setSearchQuery(value);
  //   debounceFn(value);
  // };

  const { data } = useReportReasons();

  const handleViewDetail = (reportId: string) => {
    navigate({ to: `/report/$reportId`, params: { reportId } });
  };

  const statusOptions = [
    { value: '', label: REPORT_STATUS_LABELS.all },
    { value: ReportStatus.PENDING, label: REPORT_STATUS_LABELS[ReportStatus.PENDING] },
    { value: ReportStatus.RESOLVED, label: REPORT_STATUS_LABELS[ReportStatus.RESOLVED] },
    { value: ReportStatus.REJECTED, label: REPORT_STATUS_LABELS[ReportStatus.REJECTED] },
    { value: ReportStatus.REVIEWED, label: REPORT_STATUS_LABELS[ReportStatus.REVIEWED] },
  ];

  return (
    <div className="relative space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <div>
            <Typography variant="h2" className="text-white">
              BÁO CÁO VI PHẠM
            </Typography>
            <Typography variant="small" className="text-muted-foreground font-mono">
              Quản lý các báo cáo vi phạm từ người dùng
            </Typography>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-6">
        {/* Status Filter */}
        <div className="space-y-3">
          <Typography variant="tiny" className="flex items-center gap-2 font-mono text-zinc-500">
            <Filter size={10} /> Lọc Trạng Thái
          </Typography>
          <div className="flex flex-wrap gap-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilters('status', option.value as any)}
                className={`border px-4 py-2 font-mono text-[10px] uppercase transition-all ${
                  filters.status === option.value
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reason Filter */}
        <div className="space-y-3">
          <Typography variant="tiny" className="flex items-center gap-2 font-mono text-zinc-500">
            <Tag size={10} /> Lọc Lý Do
          </Typography>
          <div className="flex flex-wrap gap-1">
            {data?.reasons?.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilters('status', option.id as any)}
                className={`border px-4 py-2 font-mono text-[10px] uppercase transition-all ${
                  filters.cursor === option.id
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                {option.title}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="border-t border-white/10 pt-6">
          <div className="group relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
            <Input
              placeholder="TÌM_KIẾM_BÁO_CÁO..."
              className="h-10 border-white/10 bg-black pl-10 font-mono text-xs text-white uppercase focus:border-white"
              value={searchQuery}
            />
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`report-card-skeleton-${i + 1}`}
              className="h-96 animate-pulse border border-white/10 bg-zinc-900"
            />
          ))}
        </div>
      )}
      {!isLoading && !reports?.length && (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertTriangle size={48} className="mb-4 text-zinc-600" />
          <Typography variant="h3" className="text-zinc-500">
            KHÔNG CÓ BÁO CÁO
          </Typography>
        </div>
      )}
      {!isLoading && reports?.length && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {reports.map((report) => (
              <ReportCard
                key={report.video_id}
                report={report}
                onView={() => handleViewDetail(report.video_id)}
              />
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {loadMoreRef && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 font-mono text-[10px] text-white uppercase">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  <span>ĐANG TẢI...</span>
                </div>
              )}
              {!isFetchingNextPage && hasNextPage && (
                <div className="font-mono text-[10px] text-zinc-600 uppercase">
                  CUỘN ĐỂ TẢI THÊM
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReportListPage;
