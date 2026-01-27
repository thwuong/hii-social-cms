import { ContentItem, ContentStatus } from '@/shared/types';
import { Button, Typography } from '@/shared/ui';
import { useNavigate, useRouteContext } from '@tanstack/react-router';
import { ArrowUpRight, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useContentStore } from '@/features/content/stores/useContentStore';
import { CustomTooltip, KPICard, StatItem } from '../components';

function DashboardPage() {
  const navigate = useNavigate();
  const { items } = useRouteContext({ strict: false });
  const { setFilters } = useContentStore();

  const handleNavigate = (filter: { status?: string; source?: string }) => {
    setFilters('status', filter.status);
    if (filter.status === ContentStatus.DRAFT) {
      navigate({
        to: '/review',
      });
    } else {
      navigate({
        to: '/content',
      });
    }
  };

  const [startDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate] = useState(() => new Date().toISOString().split('T')[0]);

  const kpiData = useMemo(() => {
    return {
      draft: items.filter((i: ContentItem) => i.status === ContentStatus.DRAFT).length,
      pending: items.filter((i: ContentItem) => i.status === ContentStatus.PENDING_REVIEW).length,
      rejected: items.filter((i: ContentItem) => i.status === ContentStatus.REJECTED).length,
      approved: items.filter((i: ContentItem) => i.status === ContentStatus.APPROVED).length,
      scheduled: items.filter((i: ContentItem) => i.status === ContentStatus.SCHEDULED).length,
      published: items.filter((i: ContentItem) => i.status === ContentStatus.PUBLISHED).length,
    };
  }, [items]);

  const chartData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const rangeItems = items.filter((item: ContentItem) => {
      if (item.status !== ContentStatus.PUBLISHED) return false;
      const dateStr = item.published_at || item.created_at;
      const date = new Date(dateStr);
      return date >= start && date <= end;
    });

    const timeMap = new Map<string, number>();
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      timeMap.set(d.toISOString().split('T')[0], 0);
    }

    rangeItems.forEach((item: ContentItem) => {
      const dateStr = (item.published_at || item.created_at).split('T')[0];
      if (timeMap.has(dateStr)) {
        timeMap.set(dateStr, (timeMap.get(dateStr) || 0) + 1);
      }
    });

    return Array.from(timeMap.entries()).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' }),
      count,
    }));
  }, [items, startDate, endDate]);

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="mb-20 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-2">
          <Typography variant="tiny">KHÔNG GIAN LÀM VIỆC ALPHA</Typography>

          <Typography
            variant="h1"
            className="text-foreground font-mono font-black tracking-tighter uppercase"
          >
            Luồng
            <br />
            Nội Dung.
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
              <Typography variant="h3" size="xlarge" className="text-white">
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
            <Typography variant="tiny" className="text-zinc-500 uppercase">
              CHỜ DUYỆT
            </Typography>
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          </div>
          <Typography variant="h3" size="xxxlarge" className="mb-4 text-white">
            {kpiData.pending}
          </Typography>
          <Typography variant="small" className="mb-8 leading-relaxed text-zinc-500" as="p">
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
          count={kpiData.draft}
          subtext="NHÁP"
          onClick={() => handleNavigate({ status: ContentStatus.DRAFT })}
        />
        <KPICard
          count={kpiData.approved}
          subtext="ĐÃ DUYỆT"
          onClick={() => handleNavigate({ status: ContentStatus.APPROVED })}
        />
        <KPICard
          count={kpiData.published}
          subtext="ĐÃ ĐĂNG"
          onClick={() => handleNavigate({ status: ContentStatus.PUBLISHED })}
        />
        <KPICard
          count={kpiData.rejected}
          subtext="TỪ CHỐI"
          onClick={() => handleNavigate({ status: ContentStatus.REJECTED })}
        />
        <KPICard
          count={kpiData.scheduled}
          subtext="ĐÃ LÊN LỊCH"
          onClick={() => handleNavigate({ status: ContentStatus.SCHEDULED })}
        />

        {/* Create New Action */}
        <div className="group relative flex cursor-pointer flex-col justify-between overflow-hidden bg-white p-8 transition-colors hover:bg-zinc-200">
          <div className="flex items-start justify-between">
            <Typography variant="tiny" className="text-black uppercase">
              THAO TÁC
            </Typography>
            <Zap className="h-4 w-4 text-black" />
          </div>
          <div onClick={() => navigate({ to: '/create' })}>
            <Typography variant="h3" size="xlarge" className="mb-1 text-black">
              Tạo Mới
            </Typography>
            <Typography size="xsmall" className="font-mono text-zinc-600 uppercase">
              THỦ CÔNG
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
