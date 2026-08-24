import { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { getUserUnlocks, getNotesByBatch } from '@/lib/data';
import { NoteCard } from '@/components/note-card';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Notes — VLDD Notes Hub',
  description: 'Aapke sabhi unlocked aur trial study notes.',
};

export default async function MyNotesPage() {
  const { profile } = await requireUser();
  const unlockedIds = await getUserUnlocks(profile.id);

  // Fetch all notes across entrance and year batches
  const entranceNotes = await getNotesByBatch('entrance');
  const yearNotes = await getNotesByBatch('year');
  const allNotes = [...entranceNotes, ...yearNotes];

  // Notes that are either free or unlocked by this student
  const myNotes = allNotes.filter(
    (note) => unlockedIds.includes(note.id) || note.tier === 'free'
  );

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="eyebrow">SAVED &amp; UNLOCKED</div>
          <h1 className="font-display text-[26px] font-bold text-ink mt-1">
            Mere Notes ({myNotes.length})
          </h1>
          <p className="text-[14px] text-ink-3 mt-0.5">
            Aapke dwara unlock kiye gaye aur trial study notes.
          </p>
        </div>
      </div>

      {myNotes.length === 0 ? (
        <EmptyState
          imageSrc="/img/empty-notes.png"
          title="Koi note unlock nahi hai"
          message="Abhi tak koi note unlock nahi kiya. Section 2 me jaake dekho."
          action={
            <Link href="/batch/entrance">
              <Button variant="primary" className="gap-2">
                Batches dekho
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {myNotes.map((note) => {
            const isUnlocked = unlockedIds.includes(note.id);
            return (
              <NoteCard
                key={note.id}
                id={note.id}
                tier={note.tier}
                isUnlocked={isUnlocked}
                pricePaise={note.price_paise}
                title={note.title}
                pages={note.pages}
                language={note.language}
                fileSizeBytes={note.file_size}
                actionHref={`/note/${note.id}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
