import { z } from 'zod';

export const createPermissionSchema = z.object({
  name: z.string().min(1, 'Tên quyền là bắt buộc'),
  slug: z
    .string()
    .min(1, 'Slug là bắt buộc')
    .regex(/^[a-z0-9.]+$/, 'Slug chỉ được chứa chữ thường, số và dấu chấm (ví dụ: module.action)'),
  module: z.string().min(1, 'Module là bắt buộc'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
});

export type CreatePermissionSchema = z.infer<typeof createPermissionSchema>;
