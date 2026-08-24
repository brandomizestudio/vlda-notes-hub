import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'primary' | 'brand' | 'ghost' | 'outline' | 'destructive';
  size?: 'default' | 'sm' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const variantStyles = {
      primary: 'bg-accent text-accent-ink hover:brightness-105 active:translate-y-[1px]',
      brand: 'bg-brand text-white hover:brightness-110 active:translate-y-[1px]',
      ghost: 'bg-transparent border border-line-2 text-ink hover:bg-card-2 active:translate-y-[1px]',
      outline: 'bg-transparent border border-line text-ink hover:bg-card-2 active:translate-y-[1px]',
      destructive: 'bg-lock text-white hover:brightness-105 active:translate-y-[1px]',
    };

    const sizeStyles = {
      default: 'min-h-[44px] px-[15px] py-[9px] text-[14px] rounded-[10px]',
      sm: 'min-h-[36px] px-[11px] py-[6px] text-[13px] rounded-[8px]',
      icon: 'h-[44px] w-[44px] p-0 rounded-[10px] flex items-center justify-center',
    };

    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center font-body font-semibold transition-all duration-150',
          'focus-visible:outline-none focus-visible:outline-[2.5px] focus-visible:outline-accent focus-visible:outline-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:translate-y-0',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
