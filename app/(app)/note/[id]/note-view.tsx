'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, FileText, Lock, ShieldCheck, Package, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BundlePanel } from '@/components/bundle-panel';
import { NotePublic, Batch } from '@/types/database';
import { formatFileSize, formatRupees } from '@/lib/format';
import { toast } from '@/components/ui/toaster';
import { BUNDLE_PRICE_PAISE } from '@/lib/constants';

interface NoteViewProps {
  note: NotePublic;
  batch: Batch;
  isUnlocked: boolean;      // true if this specific free note or bundle is unlocked
  isBundleUnlocked: boolean;
  upiId?: string;
  whatsappNumber?: string;
}

export function NoteView({
  note,
  batch,
  isUnlocked: initialUnlocked,
  isBundleUnlocked: initialBundleUnlocked,
  upiId,
  whatsappNumber,
}: NoteViewProps) {
  const router = useRouter();
  const isFree = note.tier === 'free';
  const [isBundleUnlocked, setIsBundleUnlocked] = React.useState(initialBundleUnlocked);
  const canAccess = isFree || isBundleUnlocked;

  const handleDownload = () => {
    if (isFree) {
      toast('PDF download shuru ho rahi hai...');
      window.location.href = `/api/download/${note.id}`;
    } else {
      toast('Bundle ZIP download shuru ho rahi hai...');
      window.location.href = '/api/bundle-download';
    }
  };

  const handleBundleUnlocked = () => {
    setIsBundleUnlocked(true);
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        {/* Left Column: Note Details */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isFree ? 'free' : isBundleUnlocked ? 'ok' : 'paid'}>
              {isFree ? 'Free Trial' : isBundleUnlocked ? 'Bundle Unlocked' : 'Bundle — ₹99'}
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
                  Bundle ₹{Math.round(BUNDLE_PRICE_PAISE / 100)}
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

          {/* Assurance card */}
          <div className="p-4 rounded-[12px] bg-card border border-line space-y-2.5">
            <div className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
              <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
              <span>Veterinary Exam Syllabus Aligned</span>
            </div>
            <div className="text-[13px] text-ink-3 leading-relaxed">
              Sabhi diagrams labelled hain aur questions pichle exams ke pattern par based hain.
            </div>
          </div>

          {/* Bundle info for paid notes */}
          {!isFree && (
            <div className="p-4 rounded-[12px] bg-ground border border-line space-y-2">
              <div className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                <Package className="w-4 h-4 text-accent shrink-0" />
                <span>Ye note bundle me hai</span>
              </div>
              <div className="text-[13px] text-ink-3">
                Sirf ₹{Math.round(BUNDLE_PRICE_PAISE / 100)} me poori batch ki saari notes ek ZIP me milti hain — individual note buy karne ki zaroorat nahi.
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Action / Download / Bundle Panel */}
        <div className="p-6 rounded-[16px] border border-line bg-card shadow-card">
          {canAccess ? (
            /* Unlocked / Free Note — Download */
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

              {/* Preview box */}
              <div className="w-full aspect-[4/5] rounded-[10px] bg-ground border border-line-2 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center text-brand">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="font-display font-bold text-[17px] text-ink">
                  {note.title}
                </div>
                <div className="text-[13px] text-ink-3">
                  {isFree ? 'Watermarked PDF ready' : 'Bundle ZIP me shamil hai'}
                </div>
              </div>

              <Button
                variant="brand"
                className="w-full gap-2 text-[15px] font-bold"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
                {isFree ? 'PDF download karo' : 'Complete Bundle ZIP Download Karo'}
              </Button>

              <p className="text-[13px] leading-[1.5] text-ink-3 text-center">
                {isFree
                  ? 'Har page par aapka naam aur number watermark me hai — share mat karna.'
                  : 'Saari bundle files ZIP me hongi, har PDF me aapka naam watermark me.'}
              </p>
            </div>
          ) : (
            /* Locked paid note → Bundle Panel */
            <BundlePanel
              upiId={upiId}
              whatsappNumber={whatsappNumber}
              onUnlocked={handleBundleUnlocked}
            />
          )}
        </div>
      </div>
    </div>
  );
}
