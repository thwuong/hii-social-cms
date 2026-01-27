import { toast } from '@/shared';
import { Button, Typography } from '@/shared/ui';
import { FieldGroup } from '@/shared/ui/field';
import FormField from '@/shared/ui/form-field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLogin } from '../hooks';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';

function LoginPageComponent() {
  const navigate = useNavigate();

  const { register, handleSubmit, control } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { loginMutation } = useLogin();
  const isLoading = loginMutation.isPending;
  const serverError = loginMutation.error?.message;

  const onSubmit = async (data: LoginFormData) => {
    const toastId = toast.loading('ĐANG ĐĂNG NHẬP...');
    try {
      loginMutation.mutate(data, {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('ĐĂNG NHẬP THÀNH CÔNG', {
            description: 'Chào mừng bạn trở lại',
            duration: 3000,
          });
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('ĐĂNG NHẬP THẤT BẠI', {
            description: 'Tên đăng nhập hoặc mật khẩu không đúng',
            duration: 4000,
          });
        },
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('LỖI HỆ THỐNG', {
        description: 'Đã xảy ra lỗi, vui lòng thử lại',
        duration: 4000,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Typography
            variant="h1"
            className="mb-2 font-mono text-2xl font-black tracking-wider text-white uppercase"
          >
            Hii Social
          </Typography>
          <Typography variant="muted" className="font-mono text-[10px] text-zinc-600 uppercase">
            Xác thực danh tính để tiếp tục
          </Typography>
        </div>

        {/* Login Form */}
        <div className="border border-white/10 bg-black/50 p-8 backdrop-blur-sm">
          {serverError && (
            <div className="mb-6 flex items-center gap-2 border border-red-500/50 bg-red-950/20 p-3">
              <AlertCircle size={16} className="text-red-500" />
              <Typography variant="small" className="font-mono text-xs text-red-400">
                {serverError}
              </Typography>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="login-form">
            <FieldGroup>
              {/* Email Field */}
              <FormField
                control={control}
                label="Tên đăng nhập"
                placeholder="Nhập tên đăng nhập..."
                {...register('username')}
              />
              <FormField
                control={control}
                label="Mật khẩu"
                placeholder="Nhập mật khẩu..."
                type="password"
                {...register('password')}
              />
            </FieldGroup>

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} fullWidth>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-black" />
                  ĐANG XỬ LÝ...
                </span>
              ) : (
                'ĐĂNG NHẬP'
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <Typography variant="small" className="font-mono text-xs text-zinc-600">
              Không có tài khoản?{' '}
              <button
                type="button"
                onClick={() => navigate({ to: '/register' })}
                className="text-white underline transition-colors hover:text-zinc-400"
              >
                Đăng ký ngay
              </button>
            </Typography>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <Typography variant="tiny" className="font-mono text-[9px] text-zinc-700 uppercase">
            HII_SOCIAL_SYSTEM :: v1.0.0
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default LoginPageComponent;
