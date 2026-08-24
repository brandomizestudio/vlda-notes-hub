'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BatchItem {
  id: string;
  title: string;
}

export interface BatchTabsProps {
  batches: BatchItem[];
  activeId: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function BatchTabs({ batches, activeId, onSelect, className }: BatchTabsProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 overflow-x-auto py-[18px] pb-[4px] no-scrollbar select-none',
        className
      )}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {batches.map((batch) => {
        const isActive = batch.id === activeId;
        return (
          <button
            key={batch.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect?.(batch.id)}
            className={cn(
              'px-[16px] py-[9px] rounded-full text-[14px] font-body font-semibold whitespace-nowrap transition-all duration-150',
              'focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-accent',
              isActive
                ? 'bg-ink text-ground border border-ink shadow-sm'
                : 'bg-card text-ink-2 border border-line-2 hover:border-ink-3 hover:text-ink'
            )}
          >
            {batch.title}
          </button>
        );
      })}
    </div>
  );
}
