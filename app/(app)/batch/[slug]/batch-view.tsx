'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NoteCard } from '@/components/note-card';
import { SectionHeader } from '@/components/section-header';
import { EmptyState } from '@/components/empty-state';
import { BundlePanel } from '@/components/bundle-panel';
import { Button } from '@/components/ui/button';
import { NotePublic, Batch } from '@/types/database';
import { SECTION_COPY, BUNDLE_PRICE_PAISE } from '@/lib/constants';
import { Download, Package, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface BatchViewProps {
  batch: Batch;
  freeNotes: NotePublic[];
  paidNotes: NotePublic[];
  isBundleUnlocked: boolean;
}

export function BatchView({
  batch,
  freeNotes,
  paidNotes,
  isBundleUnlocked: initialBundleUnlocked,
}: BatchViewProps) {
  const router = useRouter();
  const bannerImg = batch.id === 'year' ? '/img/batch-year.webp' : '/img/batch-entrance.webp';
  const [isBundleUnlocked, setIsBundleUnlocked] = React.useState(initialBundleUnlocked);
  const [downloading, setDownloading] = React.useState(false);
  const [showBundlePanel, setShowBundlePanel] = React.useState(false);

  const amountRupees = Math.round(BUNDLE_PRICE_PAISE / 100);

  const handleDownloadBundle = () => {
    setDownloading(true);
    window.location.href = '/api/bundle-download';
    setTimeout(() => setDownloading(false), 5000);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* 1. Header Banner */}
      <div className="space-y-3">
        <div className="relative w-full rounded-[14px] overflow-hidden border border-line bg-card-2" style={{ aspectRatio: '1376/768' }}>
          <Image
            src={bannerImg}
            alt={batch.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1000px) 100vw, 1000px"
          />
        </div>
        <p className="text-[14.5px] leading-[1.55] text-ink-2 font-body max-w-[65ch]">
          {batch.subtitle}
        </p>
      </div>

      {/* 2. Section 1 — Free Trial Notes */}
      <section className="space-y-4">
        <SectionHeader
          title={SECTION_COPY.section1.title}
          badgeText={SECTION_COPY.section1.badge}
          badgeVariant="free"
          description={SECTION_COPY.section1.note}
        />

        {freeNotes.length === 0 ? (
          <EmptyState
            imageSrc="/img/empty-notes.webp"
            message="Is batch me abhi koi note nahi hai. Jaldi aa raha hai."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {freeNotes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                tier="free"
                title={note.title}
                pages={note.pages}
                language={note.language}
                fileSizeBytes={note.file_size}
                onActionClick={() => router.push(`/note/${note.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Section 2 — Paid Bundle (single card) */}
      {paidNotes.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            title={SECTION_COPY.section2.title}
            badgeText={SECTION_COPY.section2.badge}
            badgeVariant="paid"
            description={SECTION_COPY.section2.note}
          />

          {/* Single Bundle Card */}
          <div className="rounded-[18px] border-2 border-accent/40 bg-card shadow-card overflow-hidden">
            {/* Top accent strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-accent via-brand to-accent/60" />

            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center">
                      <Package className="w-4 h-4 text-brand" />
                    </div>
                    <span className="eyebrow text-brand">COMPLETE BUNDLE</span>
                  </div>
                  <h2 className="font-display text-[22px] font-bold text-ink leading-tight">
                    Poori {batch.title} Notes
                  </h2>
                  <p className="text-[13.5px] text-ink-2">
                    {paidNotes.length} files · Watermarked PDF · ZIP download
                  </p>
                </div>

                {/* Price tag */}
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="font-display text-[36px] font-extrabold text-ink leading-none">
                    ₹{amountRupees}
                  </span>
                  <span className="text-[13px] text-ink-3 font-body">only</span>
                </div>
              </div>

              {/* What's included */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {paidNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-start gap-2 p-2.5 rounded-[10px] bg-ground border border-line-2 text-[12.5px] text-ink-2"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                    <span className="leading-snug">{note.title}</span>
                  </div>
                ))}
              </div>

              {/* Assurance row */}
              <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-ink-3 border-t border-line pt-3">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                  <span>Watermarked PDF</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                  <span>Admin approve hone ke baad ZIP download</span>
                </div>
              </div>

              {/* CTA */}
              {isBundleUnlocked ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-[10px] bg-brand-soft border border-brand/30 flex items-center gap-2.5 text-[13.5px] text-ink font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                    <span>Bundle unlocked hai! Saari notes download kar sakte ho.</span>
                  </div>
                  <Button
                    variant="brand"
                    className="w-full gap-2 font-bold text-[15px]"
                    onClick={handleDownloadBundle}
                    disabled={downloading}
                  >
                    <Download className="w-4 h-4" />
                    {downloading ? 'ZIP ban rahi hai...' : 'Complete Bundle ZIP Download Karo'}
                  </Button>
                </div>
              ) : showBundlePanel ? (
                <div className="border-t border-line pt-4">
                  <BundlePanel
                    onUnlocked={() => {
                      setIsBundleUnlocked(true);
                      setShowBundlePanel(false);
                      router.refresh();
                    }}
                  />
                </div>
              ) : (
                <Button
                  variant="primary"
                  className="w-full gap-2 font-bold text-[15px]"
                  onClick={() => setShowBundlePanel(true)}
                >
                  <Package className="w-4 h-4" />
                  ₹{amountRupees} me Bundle Unlock Karo
                </Button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
