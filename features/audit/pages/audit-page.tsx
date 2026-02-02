import { Typography } from '@/shared';

function AuditPageComponent() {
  return (
    <div className="animate-in fade-in p-4 sm:p-10">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-2">
            <Typography variant="h2" className="text-white">
              LỊCH SỬ HOẠT ĐỘNG
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
