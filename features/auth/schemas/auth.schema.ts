import { z } from 'zod';

/**
 * Login Schema
 */
export const loginSchema = z.object({
  username: z.string().min(1, 'Tên đăng nhập là bắt buộc').trim(),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register Schema
 */
export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Họ là bắt buộc'),
    lastName: z.string().min(1, 'Tên là bắt buộc'),
    username: z
      .string()
      .min(2, 'Tên đăng nhập phải có ít nhất 2 ký tự')
      .max(50, 'Tên đăng nhập phải có ít nhất 50 ký tự')
      .trim(),
    email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ').toLowerCase().trim(),
    password: z
      .string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .max(100, 'Mật khẩu phải có ít nhất 100 ký tự')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
