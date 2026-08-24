'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { NoteCard } from '@/components/note-card';
import { SectionHeader } from '@/components/section-header';
import { EmptyState } from '@/components/empty-state';
import { NotePublic, Batch } from '@/types/database';
import { SECTION_COPY } from '@/lib/constants';
import { toast } from '@/components/ui/toaster';

interface BatchViewProps {
  batch: Batch;
  freeNotes: NotePublic[];
  paidNotes: NotePublic[];
  unlockedNoteIds: string[];
}

export function BatchView({
  batch,
  freeNotes,
  paidNotes,
  unlockedNoteIds,
}: BatchViewProps) {
  const router = useRouter();
  const bannerImg = batch.id === 'year' ? '/img/batch-year.webp' : '/img/batch-entrance.webp';

  const handleNoteAction = (noteId: string, tier: 'free' | 'paid', isUnlocked: boolean) => {
    router.push(`/note/${noteId}`);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* 1. Header Banner */}
      <div className="space-y-3">
        <div className="relative w-full h-[160px] rounded-[14px] overflow-hidden border border-line bg-card-2">
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

      {/* 2. Section 1 — Trial notes */}
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
                onActionClick={() => handleNoteAction(note.id, 'free', true)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Section 2 — Full notes */}
      <section className="space-y-4">
        <SectionHeader
          title={SECTION_COPY.section2.title}
          badgeText={SECTION_COPY.section2.badge}
          badgeVariant="paid"
          description={SECTION_COPY.section2.note}
        />

        {paidNotes.length === 0 ? (
          <EmptyState
            imageSrc="/img/empty-locked.webp"
            message="Is batch me abhi koi full note upload nahi hua hai."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {paidNotes.map((note) => {
              const isUnlocked = unlockedNoteIds.includes(note.id);
              return (
                <NoteCard
                  key={note.id}
                  id={note.id}
                  tier="paid"
                  isUnlocked={isUnlocked}
                  pricePaise={note.price_paise}
                  title={note.title}
                  pages={note.pages}
                  language={note.language}
                  fileSizeBytes={note.file_size}
                  onActionClick={() => handleNoteAction(note.id, 'paid', isUnlocked)}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
