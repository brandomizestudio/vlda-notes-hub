'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, FileText, Lock, ShieldCheck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PaymentPanel } from '@/components/payment-panel';
import { NotePublic, Batch } from '@/types/database';
import { formatFileSize, formatRupees } from '@/lib/format';
import { toast } from '@/components/ui/toaster';

interface NoteViewProps {
  note: NotePublic;
  batch: Batch;
  isUnlocked: boolean;
  upiId?: string;
  whatsappNumber?: string;
}

export function NoteView({
  note,
  batch,
  isUnlocked: initialUnlocked,
  upiId,
  whatsappNumber,
}: NoteViewProps) {
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = React.useState(initialUnlocked);
  const isFree = note.tier === 'free';
  const canAccess = isFree || isUnlocked;

  const handleDownload = () => {
    toast('PDF download shuru ho rahi hai...');
    window.location.href = `/api/download/${note.id}`;
  };

  const handleUnlockedSuccess = () => {
    setIsUnlocked(true);
    router.refresh();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb */}
      <div>
        <Link
          href={`/batch/${batch.id}`}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-2 hover:text-brand transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{batch.title}</span>
        </Link>
      </div>

      {/* Main Grid: Details on Left, Action / Payment on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        {/* Left Column: Note Details */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isFree ? 'free' : isUnlocked ? 'ok' : 'paid'}>
              {isFree ? 'Free Trial' : isUnlocked ? 'Unlocked' : 'Paid Full Notes'}
            </Badge>
            {note.subject && (
              <span className="text-[12px] font-mono px-2 py-0.5 rounded bg-card-2 text-ink-2 font-medium">
                {note.subject}
              </span>
            )}
          </div>

          <h1 className="font-display text-[26px] sm:text-[30px] font-bold text-ink leading-tight">
            {note.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] text-ink-3 font-body border-y border-line py-3">
            <span>{note.pages} pages</span>
            <span>·</span>
            <span>{note.language}</span>
            <span>·</span>
            <span>{formatFileSize(note.file_size)}</span>
            {!isFree && (
              <>
                <span>·</span>
                <span className="font-mono font-bold text-ink text-[14.5px]">
                  {formatRupees(note.price_paise)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {note.description && (
            <div className="space-y-2">
              <div className="eyebrow">ABOUT THIS NOTE</div>
              <p className="text-[15px] leading-[1.6] text-ink-2 font-body">
                {note.description}
              </p>
            </div>
          )}

          {/* Key Features / Assurances */}
          <div className="p-4 rounded-[12px] bg-card border border-line space-y-2.5">
            <div className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
              <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
              <span>Veterinary Exam Syllabus Aligned</span>
            </div>
            <div className="text-[13px] text-ink-3 leading-relaxed">
              Sabhi diagrams labelled hain aur questions pichle exams ke pattern par based hain.
            </div>
          </div>
        </div>

        {/* Right Column: PDF Preview / Payment Panel */}
        <div className="p-6 rounded-[16px] border border-line bg-card shadow-card">
          {canAccess ? (
            /* Unlocked / Free Note Action */
            <div className="space-y-6 text-center sm:text-left">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand" />
                  <span className="font-mono text-[13px] font-semibold text-ink">
                    Page 1 / {note.pages}
                  </span>
                </div>
                <span className="font-mono text-[12px] text-ink-3">
                  {formatFileSize(note.file_size)}
                </span>
              </div>

              {/* On-site Preview Box */}
              <div className="w-full aspect-[4/5] rounded-[10px] bg-ground border border-line-2 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center text-brand">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="font-display font-bold text-[17px] text-ink">
                  {note.title}
                </div>
                <div className="text-[13px] text-ink-3">
                  Watermarked PDF ready for download
                </div>
              </div>

              {/* Download Button */}
              <Button
                variant="brand"
                className="w-full gap-2 text-[15px] font-bold"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
                PDF download karo
              </Button>

              {/* Helper text */}
              <p className="text-[13px] leading-[1.5] text-ink-3 text-center">
                Har page par aapka naam aur number watermark me hai — PDF kisi ko forward mat karna.
              </p>
            </div>
          ) : (
            /* Locked Note: Payment Panel */
            <PaymentPanel
              note={note}
              upiId={upiId}
              whatsappNumber={whatsappNumber}
              onUnlocked={handleUnlockedSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}
