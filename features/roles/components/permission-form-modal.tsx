'use client';

import { cn } from '@/lib';
import {
  Button,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Textarea,
} from '@/shared/ui';
import FormField from '@/shared/ui/form-field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreatePermission } from '../hooks';
import { createPermissionSchema, CreatePermissionSchema } from '../schemas';

interface PermissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PermissionFormModal = ({ isOpen, onClose }: PermissionFormModalProps) => {
  const createPermissionMutation = useCreatePermission();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<CreatePermissionSchema>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      name: '',
      slug: '',
      module: '',
      description: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: CreatePermissionSchema) => {
    createPermissionMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const isLoading = createPermissionMutation.isPending;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-white/10 duration-700 sm:max-w-md!"
      >
        <SheetHeader>
          <SheetTitle>Tạo quyền hạn mới</SheetTitle>
          <SheetDescription>Điền thông tin để tạo quyền hạn mới cho hệ thống</SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
          id="permission-form"
        >
          {/* Name */}
          <FormField
            {...register('name')}
            control={control}
            label="Tên quyền"
            placeholder="Nhập tên quyền (ví dụ: Xem người dùng)"
            type="text"
          />

          {/* Slug */}
          <FormField
            {...register('slug')}
            control={control}
            label="Slug"
            placeholder="Nhập slug (ví dụ: users.view)"
            type="text"
            description="Slug chỉ được chứa chữ thường, số và dấu chấm"
          />

          {/* Module */}
          <FormField
            {...register('module')}
            control={control}
            label="Module"
            placeholder="Nhập module (ví dụ: users)"
            type="text"
          />

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register('description')}
              onChange={(e) =>
                setValue('description', e.target.value, { shouldValidate: true, shouldDirty: true })
              }
              placeholder="Nhập mô tả chi tiết về quyền hạn này"
              rows={3}
              className={cn(
                errors.description &&
                  'ring-destructive/40 border-destructive/40 focus-visible:ring-destructive/40 focus-visible:border-destructive/40 ring-[3px]'
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-400">{errors.description.message}</p>
            )}
          </div>
        </form>

        <SheetFooter className="mt-6 shrink-0 flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading} form="permission-form" className="flex-1">
            {isLoading && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Tạo quyền
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
