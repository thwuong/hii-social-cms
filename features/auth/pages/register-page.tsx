import { toast } from '@/shared';
import { Button, Typography } from '@/shared/ui';
import { FieldGroup } from '@/shared/ui/field';
import FormField from '@/shared/ui/form-field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRegister } from '../hooks';
import { registerSchema, type RegisterFormData } from '../schemas/auth.schema';

function RegisterPageComponent() {
  const navigate = useNavigate();

  const { register, handleSubmit, watch, control } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const { registerMutation } = useRegister();
  const isLoading = registerMutation.isPending;
  const serverError = registerMutation.error?.message;

  const password = watch('password');

  // Password strength indicators
  const passwordChecks = [
    { label: 'Ít nhất 6 ký tự', valid: password?.length >= 6 },
    { label: 'Ít nhất 1 chữ hoa', valid: /[A-Z]/.test(password || '') },
    { label: 'Ít nhất 1 chữ thường', valid: /[a-z]/.test(password || '') },
    { label: 'Ít nhất 1 số', valid: /[0-9]/.test(password || '') },
  ];
  const onSubmit = async (data: RegisterFormData) => {
    const toastId = toast.loading('ĐANG ĐĂNG KÝ...');

    try {
      // TODO: Call API register
      registerMutation.mutate(data, {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('TÀI KHOẢN ĐÃ ĐƯỢC TẠO', {
            description: `Chào mừng ${data.firstName} ${data.lastName} đến với hệ thống`,
            duration: 3000,
          });
          // navigate({ to: '/dashboard' });
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('ĐĂNG KÝ THẤT BẠI', {
            description: 'Tên đăng nhập đã tồn tại. Vui lòng thử lại.',
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
            TẠO TÀI KHOẢN
          </Typography>
          <Typography variant="muted" className="font-mono text-[10px] text-zinc-600 uppercase">
            Tạo tài khoản mới
          </Typography>
        </div>

        {/* Register Form */}
        <div className="border border-white/10 bg-black/50 p-8 backdrop-blur-sm">
          {serverError && (
            <div className="mb-6 flex items-center gap-2 border border-red-500/50 bg-red-950/20 p-3">
              <AlertCircle size={16} className="text-red-500" />
              <Typography variant="small" className="font-mono text-xs text-red-400">
                {serverError}
              </Typography>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            id="register-form"
            className="flex flex-col gap-6"
          >
            <FieldGroup className="grid grid-cols-2 gap-5">
              {/* First Name Field */}
              <div className="col-span-1">
                <FormField
                  control={control}
                  label="Họ"
                  placeholder="Nhập họ..."
                  {...register('firstName')}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={control}
                  label="Tên"
                  placeholder="Nhập tên..."
                  {...register('lastName')}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={control}
                  label="Tên đăng nhập"
                  placeholder="Nhập tên đăng nhập..."
                  {...register('username')}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={control}
                  label="Email"
                  placeholder="Nhập email..."
                  {...register('email')}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={control}
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu..."
                  type="password"
                  {...register('password')}
                />
                {/* Password Strength Indicators */}
                {password && (
                  <div className="mt-3 space-y-1.5">
                    {passwordChecks.map((check, index) => (
                      <div key={check.label} className="flex items-center gap-2">
                        {check.valid ? (
                          <CheckCircle2 size={12} className="text-[#00ff66]" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-zinc-700" />
                        )}
                        <Typography
                          variant="tiny"
                          className={`font-mono text-[9px] ${
                            check.valid ? 'text-[#00ff66]' : 'text-zinc-700'
                          }`}
                        >
                          {check.label}
                        </Typography>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <FormField
                  control={control}
                  label="Xác nhận mật khẩu"
                  placeholder="••••••••"
                  type="password"
                  {...register('confirmPassword')}
                />
              </div>
            </FieldGroup>

            {/* Submit Button */}
            <div className="col-span-2">
              <Button type="submit" disabled={isLoading} fullWidth>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-black" />
                    ĐANG XỬ LÝ...
                  </span>
                ) : (
                  'TẠO TÀI KHOẢN'
                )}
              </Button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <Typography variant="small" className="font-mono text-xs text-zinc-600">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => navigate({ to: '/login' })}
                className="text-white underline transition-colors hover:text-zinc-400"
              >
                Đăng nhập
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

export default RegisterPageComponent;
