import * as React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title?: string;
  message: string;
  imageSrc?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  message,
  imageSrc,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-[28px] rounded-[14px] border border-dashed border-line-2 bg-card/60',
        className
      )}
    >
      {imageSrc && (
        <div className="mb-4 opacity-90 max-w-[180px] w-full flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={title || 'Empty state illustration'}
            className="w-full h-auto object-contain"
          />
        </div>
      )}
      {icon && !imageSrc && (
        <div className="mb-4 p-3 rounded-full bg-card-2 text-ink-3">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="font-display text-[16.5px] font-bold text-ink mb-1">
          {title}
        </h3>
      )}
      <p className="text-[14px] leading-[1.55] text-ink-3 max-w-[44ch] m-0">
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
