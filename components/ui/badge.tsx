import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'free' | 'paid' | 'neutral' | 'accent' | 'ok';
}

function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  const variantStyles = {
    free: 'bg-brand-soft text-brand',
    paid: 'bg-lock-soft text-lock',
    neutral: 'bg-card-2 text-ink-2',
    accent: 'bg-accent/20 text-accent-ink',
    ok: 'bg-brand-soft text-ok',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-mono text-[11px] font-semibold tracking-[0.08em] uppercase px-[9px] py-[4px] rounded-[6px] select-none',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
