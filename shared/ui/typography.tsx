import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
      h6: 'scroll-m-20 text-base font-semibold tracking-tight',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
      tiny: 'text-tiny text-muted-foreground font-mono',
    },
    size: {
      tiny: 'text-xs',
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
      xlarge: 'text-xl',
      xxlarge: 'text-2xl',
      xxxlarge: 'text-3xl',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

const isTagValid = (variant: string) => {
  return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'blockquote', 'code'].includes(
    variant
  );
};

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'blockquote' | 'code';
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, size, as, ...props }, ref) => {
    // Tự động chọn tag HTML phù hợp với variant
    const Component = (as ||
      (isTagValid(variant as keyof JSX.IntrinsicElements) ? variant : 'p')) as React.ElementType;

    return React.createElement(Component, {
      className: cn(typographyVariants({ variant, size, className })),
      ref,
      ...props,
    });
  }
);
Typography.displayName = 'Typography';

export { Typography, typographyVariants };
