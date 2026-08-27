import * as React from 'react';
import Link from 'next/link';
import { Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRupees, formatFileSize } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface NoteCardProps {
  id: string;
  title: string;
  pages: number;
  language?: string;
  fileSizeBytes: number;
  tier: 'free' | 'paid';
  isUnlocked?: boolean;
  pricePaise?: number;
  onActionClick?: (id: string) => void;
  actionHref?: string;
  className?: string;
}

export function NoteCard({
  id,
  title,
  pages,
  language = 'Hindi',
  fileSizeBytes,
  tier,
  isUnlocked = false,
  pricePaise = 0,
  onActionClick,
  actionHref,
  className,
}: NoteCardProps) {
  const isFree = tier === 'free';
  const isLocked = !isFree && !isUnlocked;
  const isPaidUnlocked = !isFree && isUnlocked;

  const handleClick = (e?: React.MouseEvent) => {
    if (onActionClick) {
      e?.preventDefault();
      onActionClick(id);
    }
  };

  const ActionButton = ({ children, variant }: { children: React.ReactNode; variant: 'brand' | 'primary' }) => {
    if (actionHref && !onActionClick) {
      return (
        <Link href={actionHref}>
          <Button variant={variant} size="sm" className={variant === 'primary' ? 'gap-1.5' : ''}>
            {children}
          </Button>
        </Link>
      );
    }
    return (
      <Button variant={variant} size="sm" className={variant === 'primary' ? 'gap-1.5' : ''} onClick={() => onActionClick?.(id)}>
        {children}
      </Button>
    );
  };

  return (
    <div
      className={cn(
        'relative flex flex-col justify-between p-[15px] rounded-[14px] border border-line bg-card shadow-card overflow-hidden transition-all duration-150',
        // 3px vertical stripe on left
        'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px]',
        isLocked ? 'before:bg-lock' : 'before:bg-brand',
        className
      )}
    >
      {/* Content wrapper with pl-[6px] so it clears the 3px stripe */}
      <div className="pl-[6px] flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-display text-[16.5px] leading-[1.3] font-bold text-ink mb-1.5 line-clamp-2">
          {title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-[10px] text-[12.5px] leading-[1.4] text-ink-3 font-body mb-4">
          <span>{pages} {pages === 1 ? 'page' : 'pages'}</span>
          <span>·</span>
          <span>{language}</span>
          <span>·</span>
          <span>{formatFileSize(fileSizeBytes)}</span>
        </div>

        {/* Spacer pushing action row to bottom */}
        <div className="mt-auto pt-2" />

        {/* Action row */}
        <div className="flex items-center justify-between gap-3">
          {/* Price / status badge */}
          <div className="flex items-center">
            {isFree && (
              <span className="font-mono text-[15px] font-semibold text-brand">
                Free
              </span>
            )}
            {isLocked && (
              <span className="font-mono text-[15px] font-semibold text-ink">
                {formatRupees(pricePaise)}
              </span>
            )}
            {isPaidUnlocked && (
              <span className="inline-flex items-center gap-1 font-mono text-[13.5px] font-semibold text-brand">
                <Check className="w-3.5 h-3.5" />
                Unlocked
              </span>
            )}
          </div>

          {/* Action button */}
          <div>
            {isFree && (
              <ActionButton variant="brand">
                PDF kholo
              </ActionButton>
            )}
            {isLocked && (
              <ActionButton variant="primary">
                <Lock className="w-3.5 h-3.5" />
                Unlock karo
              </ActionButton>
            )}
            {isPaidUnlocked && (
              <ActionButton variant="brand">
                Download karo
              </ActionButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
