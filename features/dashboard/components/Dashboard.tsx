import { ContentItem, ContentStatus } from '@/shared/types';
import { Button } from '@/shared/ui';
import { ArrowUpRight, Zap } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface DashboardProps {
  items: ContentItem[];
  onNavigate: (filter: { status?: string; source?: string }) => void;
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col font-mono">
      <span className="text-[10px] text-zinc-500 uppercase mb-1">{label}</span>
      <span className="text-xl font-medium text-white">{value}</span>
    </div>
  );
}

function KPICard({
  count,
  subtext,
  onClick,
}: {
  count: number;
  subtext: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-black border border-white/10 p-6 relative overflow-hidden group cursor-pointer hover:bg-[#111] transition-all duration-500"
    >
      {/* Hover Top Border Effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      <div className="flex justify-between items-start mb-4 font-mono text-[10px] text-zinc-500">
        <span className="uppercase">{subtext}</span>
      </div>

      <h3 className="text-3xl font-bold text-white mb-2">{count}</h3>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="border border-white/10 bg-black p-2 shadow-none">
        <div className="font-mono text-[10px] text-zinc-500 uppercase mb-1">{label}</div>
        <div className="font-mono text-sm text-white">{payload[0].value} ĐƠN VỊ</div>
      </div>
    );
  }
  return null;
}

const Dashboard: React.FC<DashboardProps> = ({ items, onNavigate }) => {
  const [startDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate] = useState(() => new Date().toISOString().split('T')[0]);

  const kpiData = useMemo(() => {
    return {
      draft: items.filter((i) => i.status === ContentStatus.DRAFT).length,
      pending: items.filter((i) => i.status === ContentStatus.PENDING_REVIEW).length,
      rejected: items.filter((i) => i.status === ContentStatus.REJECTED).length,
      approved: items.filter((i) => i.status === ContentStatus.APPROVED).length,
      scheduled: items.filter((i) => i.status === ContentStatus.SCHEDULED).length,
      published: items.filter((i) => i.status === ContentStatus.PUBLISHED).length,
    };
  }, [items]);

  const chartData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const rangeItems = items.filter((item) => {
      if (item.status !== ContentStatus.PUBLISHED) return false;
      const dateStr = item.published_at || item.created_at;
      const date = new Date(dateStr);
      return date >= start && date <= end;
    });

    const timeMap = new Map<string, number>();
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      timeMap.set(d.toISOString().split('T')[0], 0);
    }

    rangeItems.forEach((item) => {
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
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
        <div>
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-4">
            KHÔNG GIAN LÀM VIỆC ALPHA
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter">
            Luồng
            <br />
            Nội Dung.
          </h1>
        </div>

        <div className="flex gap-12 pb-2 border-b border-transparent lg:border-none">
          <StatItem label="Tổng Tiếp Cận" value="4.2M" />
          <StatItem label="Tốc Độ" value="+12.4%" />
          <StatItem label="Token" value="882" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-white/10 border border-white/10 p-[1px]">
        {/* Chart Card (Span 2) */}
        <div className="md:col-span-2 bg-black p-8 min-h-[300px] group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Tốc Độ Xử Lý</h3>
              <p className="text-sm text-zinc-500 font-mono">ĐÃ XUẤT BẢN / 7 NGÀY</p>
            </div>
            <div className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center">
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
        <div className="bg-black p-8 relative overflow-hidden group hover:bg-[#111] transition-colors">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

          <div className="flex justify-between items-start mb-12">
            <div className="font-mono text-[10px] text-zinc-500 uppercase">CHỜ DUYỆT</div>
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          </div>

          <div className="text-5xl font-bold text-white mb-4">{kpiData.pending}</div>
          <p className="text-xs text-zinc-500 leading-relaxed mb-8">
            Nội dung đang chờ quy trình phê duyệt. Cần hành động ngay để duy trì tốc độ luồng.
          </p>

          <Button
            onClick={() => onNavigate({ status: ContentStatus.PENDING_REVIEW })}
            className="w-full border border-white/20 bg-transparent hover:bg-white hover:text-black"
          >
            TIẾN HÀNH DUYỆT
          </Button>
        </div>

        {/* KPI Grid */}
        <KPICard
          count={kpiData.draft}
          subtext="NHÁP"
          onClick={() => onNavigate({ status: ContentStatus.DRAFT })}
        />
        <KPICard
          count={kpiData.approved}
          subtext="ĐÃ DUYỆT"
          onClick={() => onNavigate({ status: ContentStatus.APPROVED })}
        />
        <KPICard
          count={kpiData.published}
          subtext="ĐÃ ĐĂNG"
          onClick={() => onNavigate({ status: ContentStatus.PUBLISHED })}
        />
        <KPICard
          count={kpiData.rejected}
          subtext="TỪ CHỐI"
          onClick={() => onNavigate({ status: ContentStatus.REJECTED })}
        />
        <KPICard
          count={kpiData.scheduled}
          subtext="ĐÃ LÊN LỊCH"
          onClick={() => onNavigate({ status: ContentStatus.SCHEDULED })}
        />

        {/* Create New Action */}
        <div className="bg-white p-8 relative overflow-hidden group cursor-pointer hover:bg-zinc-200 transition-colors flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="font-mono text-[10px] text-black uppercase">THAO TÁC</div>
            <Zap className="h-4 w-4 text-black" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-1">Tạo Mới</h3>
            <p className="text-xs text-zinc-600 font-mono uppercase">THỦ CÔNG</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
