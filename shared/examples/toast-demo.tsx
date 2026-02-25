import { Button, Typography } from '@/shared/ui';
import { toast } from '@/shared/utils/toast';

/**
 * Toast Demo Component
 *
 * Component demo để test các loại toast
 * Có thể tạm thời thêm vào một page để test
 */
export function ToastDemo() {
  return (
    <div className="space-y-8 p-8">
      <Typography variant="h2" className="font-mono text-white uppercase">
        TOAST_NOTIFICATION_DEMO
      </Typography>

      {/* Success Toasts */}
      <div className="space-y-4">
        <Typography variant="h4" className="font-mono text-[#00ff66] uppercase">
          Success Toasts
        </Typography>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              toast.success('THÀNH_CÔNG', {
                description: 'Thao tác đã được thực hiện',
              })
            }
          >
            Simple Success
          </Button>
          <Button
            onClick={() =>
              toast.success('ĐÃ_LƯU', {
                description: 'Thay đổi đã được lưu thành công',
                duration: 3000,
                action: {
                  label: 'XEM',
                  onClick: () => console.log('View clicked'),
                },
              })
            }
          >
            Success with Action
          </Button>
        </div>
      </div>

      {/* Error Toasts */}
      <div className="space-y-4">
        <Typography variant="h4" className="font-mono text-[#ff3e3e] uppercase">
          Error Toasts
        </Typography>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="destructive"
            onClick={() =>
              toast.error('LỖI_XẢY_RA', {
                description: 'Không thể hoàn thành thao tác',
              })
            }
          >
            Simple Error
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              toast.error('KẾT_NỐI_THẤT_BẠI', {
                description: 'Không thể kết nối đến server',
                duration: 5000,
                action: {
                  label: 'THỬ_LẠI',
                  onClick: () => console.log('Retry clicked'),
                },
              })
            }
          >
            Error with Action
          </Button>
        </div>
      </div>

      {/* Warning Toasts */}
      <div className="space-y-4">
        <Typography variant="h4" className="font-mono text-yellow-500 uppercase">
          Warning Toasts
        </Typography>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              toast.warning('CẢNH_BÁO', {
                description: 'Hành động này có thể gây ảnh hưởng',
              })
            }
          >
            Simple Warning
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.warning('DỮ_LIỆU_CHƯA_LƯU', {
                description: 'Bạn có thay đổi chưa được lưu',
                action: {
                  label: 'LƯU_NGAY',
                  onClick: () => console.log('Save clicked'),
                },
              })
            }
          >
            Warning with Action
          </Button>
        </div>
      </div>

      {/* Info Toasts */}
      <div className="space-y-4">
        <Typography variant="h4" className="font-mono text-white uppercase">
          Info Toasts
        </Typography>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast.info('THÔNG_TIN', {
                description: 'Dữ liệu đã được cập nhật',
              })
            }
          >
            Simple Info
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.info('CẬP_NHẬT_MỚI', {
                description: 'Phiên bản mới đã có sẵn',
                action: {
                  label: 'CẬP_NHẬT',
                  onClick: () => console.log('Update clicked'),
                },
              })
            }
          >
            Info with Action
          </Button>
        </div>
      </div>

      {/* Loading & Promise */}
      <div className="space-y-4">
        <Typography variant="h4" className="font-mono text-white uppercase">
          Loading & Promise
        </Typography>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              const id = toast.loading('ĐANG_XỬ_LÝ...', {
                description: 'Vui lòng đợi',
              });
              setTimeout(() => {
                toast.dismiss(id);
                toast.success('HOÀN_THÀNH');
              }, 2000);
            }}
          >
            Loading Toast
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              const mockPromise = new Promise((resolve) =>
                // eslint-disable-next-line no-promise-executor-return
                setTimeout(() => resolve({ name: 'John' }), 2000)
              );
              toast.promise(mockPromise, {
                loading: 'ĐANG_TẢI...',
                success: 'HOÀN_THÀNH',
                error: 'THẤT_BẠI',
              });
            }}
          >
            Promise Toast
          </Button>
        </div>
      </div>

      {/* Multiple Toasts */}
      <div className="space-y-4">
        <Typography variant="h4" className="font-mono text-white uppercase">
          Multiple Toasts
        </Typography>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              toast.success('MESSAGE_1');
              toast.info('MESSAGE_2');
              toast.warning('MESSAGE_3');
              toast.error('MESSAGE_4');
            }}
          >
            Show Multiple
          </Button>
          <Button variant="outline" onClick={() => toast.dismiss()}>
            Dismiss All
          </Button>
        </div>
      </div>
    </div>
  );
}
