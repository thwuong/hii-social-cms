import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Tên vai trò là bắt buộc'),
  slug: z
    .string()
    .min(1, 'Slug là bắt buộc')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  permissions: z.array(z.string()).min(1, 'Phải chọn ít nhất một quyền'),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1, 'Tên vai trò là bắt buộc'),
  slug: z
    .string()
    .min(1, 'Slug là bắt buộc')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  permissions: z.array(z.string()).min(1, 'Phải chọn ít nhất một quyền'),
});

export const assignRolesSchema = z.object({
  role_ids: z.array(z.string()).min(1, 'Phải chọn ít nhất một vai trò'),
});

export type CreateRoleSchema = z.infer<typeof createRoleSchema>;
export type UpdateRoleSchema = z.infer<typeof updateRoleSchema>;
export type AssignRolesSchema = z.infer<typeof assignRolesSchema>;
