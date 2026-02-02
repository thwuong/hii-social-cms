import { DashboardSkeleton } from '@/shared/components';
import { STATUS_LABELS } from '@/shared/constants';
import { ContentStatus } from '@/shared/types';
import { Button, Typography } from '@/shared/ui';
import { useNavigate } from '@tanstack/react-router';
import { ArrowUpRight, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { CustomTooltip, KPICard, StatItem } from '../components';
import { useDashboardStats, useDashboardTimeseries } from '../hooks';
import { TimeseriesItem } from '../types';

function DashboardPage() {
  const navigate = useNavigate();

  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: timeseries, isLoading: isLoadingTimeseries } = useDashboardTimeseries();

  const isLoading = isLoadingStats || isLoadingTimeseries;

  const handleNavigate = (filter: { status?: string; source?: string }) => {
    if (filter.status === ContentStatus.DRAFT) {
      navigate({
        to: '/draft',
      });
    } else {
      navigate({
        to: '/content',
        search: {
          approving_status: filter.status,
        },
      });
    }
  };

  const chartData = useMemo(() => {
    if (!timeseries) return [];

    const start = new Date(timeseries[0].timestamp);
    const end = new Date(timeseries[timeseries.length - 1].timestamp);
    end.setHours(23, 59, 59, 999);

    const rangeItems = timeseries.filter((item: TimeseriesItem) => {
      const date = new Date(item.timestamp);
      return date >= start && date <= end;
    });

    const timeMap = new Map<string, number>();
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      timeMap.set(d.toISOString().split('T')[0], 0);
    }

    rangeItems.forEach((item: TimeseriesItem) => {
      const dateStr = item.timestamp.split('T')[0];
      if (timeMap.has(dateStr)) {
        timeMap.set(dateStr, (timeMap.get(dateStr) || 0) + item.reels);
      }
    });

    return Array.from(timeMap.entries()).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' }),
      count,
    }));
  }, [timeseries]);

  // Show skeleton while loading
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="animate-in fade-in p-4 duration-700 sm:p-10">
      {/* Header Section */}
      <div className="mb-20 flex flex-col justify-between gap-8 pt-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-2">
          <Typography variant="h2" className="text-white">
            TỔNG QUAN
          </Typography>
          <Typography className="text-muted-foreground font-mono">
            Tổng quan về tình hình hoạt động của hệ thống
          </Typography>
        </div>

        <div className="flex gap-12 border-b border-transparent pb-2 lg:border-none">
          <StatItem label="Tổng Tiếp Cận" value="4.2M" />
          <StatItem label="Tốc Độ" value="+12.4%" />
          <StatItem label="Token" value="882" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-[2px] border border-white/10 bg-white/10 p-[1px] md:grid-cols-2 lg:grid-cols-3">
        {/* Chart Card (Span 2) */}
        <div className="group relative min-h-[300px] overflow-hidden bg-black p-8 md:col-span-2">
          <div className="absolute top-0 left-0 h-[1px] w-full origin-left scale-x-0 transform bg-white transition-transform duration-500 group-hover:scale-x-100" />

          <div className="mb-6 flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <Typography variant="h3" className="text-white">
                Tốc Độ Xử Lý
              </Typography>
              <Typography variant="small" className="font-mono text-zinc-500">
                ĐÃ XUẤT BẢN / 7 NGÀY
              </Typography>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20">
              <ArrowUpRight className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
                />
                <XAxis dataKey="date" hide />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#fff"
                  strokeWidth={1}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Card */}
        <div className="group hover:bg-background relative overflow-hidden bg-black p-8 transition-colors">
          <div className="absolute top-0 left-0 h-[1px] w-full origin-left scale-x-0 transform bg-white transition-transform duration-500 group-hover:scale-x-100" />

          <div className="mb-12 flex items-start justify-between">
            <Typography variant="small" className="font-medium text-zinc-500 uppercase">
              CHỜ DUYỆT
            </Typography>
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          </div>
          <Typography variant="h3" className="mb-4 text-white">
            {stats?.total_pending || 0}
          </Typography>
          <Typography variant="p" className="mb-8 leading-relaxed text-zinc-500" as="p">
            Nội dung đang chờ quy trình phê duyệt. Cần hành động ngay để duy trì tốc độ luồng.
          </Typography>

          <Button
            fullWidth
            onClick={() => handleNavigate({ status: ContentStatus.PENDING_REVIEW })}
            variant="outline"
            // className="w-full border border-white/20 bg-transparent hover:bg-white hover:text-black"
          >
            TIẾN HÀNH DUYỆT
          </Button>
        </div>

        {/* KPI Grid */}
        <KPICard
          count={stats?.total_draft || 0}
          subtext={STATUS_LABELS[ContentStatus.DRAFT]}
          onClick={() => handleNavigate({ status: ContentStatus.DRAFT })}
        />
        <KPICard
          count={stats?.total_published || 0}
          subtext={STATUS_LABELS[ContentStatus.APPROVED]}
          onClick={() => handleNavigate({ status: ContentStatus.APPROVED })}
        />
        <KPICard
          count={stats?.total_published || 0}
          subtext={STATUS_LABELS[ContentStatus.PUBLISHED]}
          onClick={() => handleNavigate({ status: ContentStatus.PUBLISHED })}
        />
        <KPICard
          count={stats?.total_rejected || 0}
          subtext={STATUS_LABELS[ContentStatus.REJECTED]}
          onClick={() => handleNavigate({ status: ContentStatus.REJECTED })}
        />
        <KPICard
          count={stats?.total_scheduled || 0}
          subtext={STATUS_LABELS[ContentStatus.SCHEDULED]}
          onClick={() => handleNavigate({ status: ContentStatus.SCHEDULED })}
        />

        {/* Create New Action */}
        <button
          type="button"
          onClick={() => navigate({ to: '/create' })}
          className="group relative flex cursor-pointer flex-col justify-between overflow-hidden bg-white p-8 text-left transition-colors hover:bg-zinc-200"
        >
          <div className="flex items-start justify-between">
            <Typography variant="tiny" className="text-black uppercase">
              THAO TÁC
            </Typography>
            <Zap className="h-4 w-4 text-black" />
          </div>
          <div>
            <Typography variant="h3" className="mb-1 text-black">
              Tạo Mới
            </Typography>
            <Typography variant="small" className="font-mono text-zinc-600 uppercase">
              THỦ CÔNG
            </Typography>
          </div>
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
