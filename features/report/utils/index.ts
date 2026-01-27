import { ReportStatus } from '../types';

export const REPORT_STATUS_LABELS: Record<ReportStatus | 'all', string> = {
  all: 'TẤT CẢ',
  [ReportStatus.PENDING]: 'CHỜ XỬ LÝ',
  [ReportStatus.RESOLVED]: 'ĐÃ CHẤP NHẬN',
  [ReportStatus.REJECTED]: 'ĐÃ TỪ CHỐI',
  [ReportStatus.REVIEWED]: 'ĐÃ XEM XÉT',
};

export const getReportStatusColor = (status: ReportStatus): string => {
  switch (status) {
    case ReportStatus.PENDING:
      return 'border-yellow-500 text-yellow-500';
    case ReportStatus.RESOLVED:
      return 'border-green-500 text-green-500';
    case ReportStatus.REJECTED:
      return 'border-red-500 text-red-500';
    default:
      return 'border-zinc-500 text-zinc-500';
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
