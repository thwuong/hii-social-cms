import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';

function ActivityLogModal({ item, isOpen, onClose }: any) {
  // const logs = service.getAuditLogs().filter((log: any) => log.content_id === item.content_id);
  // const sortedLogs = [...logs].sort(
  //   (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  // );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>NHẬT_KÝ_HỆ_THỐNG :: {item.content_id}</DialogTitle>
        </DialogHeader>
        <div className="my-4 max-h-[60vh] space-y-0 overflow-y-auto border-t border-b border-white/10 py-4">
          <div className="border-primary relative flex gap-4 border-l-2 py-3 pl-4">
            <div className="flex-1">
              <div className="font-mono text-xs font-bold text-white uppercase">KHỞI_TẠO</div>
              <div className="font-mono text-[10px] text-zinc-500">
                {new Date(item.created_at).toLocaleString('vi-VN')}
              </div>
            </div>
            <div className="flex-1 text-right">
              <div className="font-mono text-xs text-zinc-400">USER: {item.created_by}</div>
            </div>
          </div>

          {/* {sortedLogs.map((log) => (
            <div
              key={log.id}
              className={`relative flex gap-4 border-l-2 py-3 pl-4 ${
                log.new_status === ContentStatus.REJECTED ? 'border-destructive' : 'border-white/20'
              }`}
            >
              <div className="flex-1">
                <div className="font-mono text-xs font-bold text-white uppercase">{log.action}</div>
                <div className="font-mono text-[10px] text-zinc-500">
                  {new Date(log.timestamp).toLocaleString('vi-VN')}
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="font-mono text-xs text-zinc-400">USER: {log.user}</div>
              </div>
            </div>
          ))} */}
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            ĐÓNG CỬA SỔ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ActivityLogModal;
