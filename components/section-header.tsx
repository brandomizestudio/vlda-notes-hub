import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  title: string;
  badgeText?: string;
  badgeVariant?: 'free' | 'paid' | 'neutral' | 'accent' | 'ok';
  description?: string;
  className?: string;
}

export function SectionHeader({
  title,
  badgeText,
  badgeVariant = 'free',
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-2 mb-4', className)}>
      <div className="flex flex-wrap items-end gap-[14px]">
        <h2 className="font-display text-[22px] leading-[1.2] font-bold tracking-[-0.02em] text-ink m-0">
          {title}
        </h2>
        {badgeText && <Badge variant={badgeVariant}>{badgeText}</Badge>}
      </div>
      {description && (
        <p className="text-[14px] leading-[1.55] text-ink-3 max-w-[62ch] m-0">
          {description}
        </p>
      )}
    </div>
  );
}
