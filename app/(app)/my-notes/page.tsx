import { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { getUserUnlocks, getNotesByBatch } from '@/lib/data';
import { NoteCard } from '@/components/note-card';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Notes — VLDD Notes Hub',
  description: 'Aapke sabhi unlocked aur trial study notes.',
};

export default async function MyNotesPage() {
  const { profile } = await requireUser();
  const unlockedIds = await getUserUnlocks(profile.id);

  // Fetch all notes across both batches
  const entranceNotes = await getNotesByBatch('entrance');
  const yearNotes = await getNotesByBatch('year');
  const allNotes = [...entranceNotes, ...yearNotes];

  const freeNotes = allNotes.filter((n) => n.tier === 'free');
  const unlockedPaidNotes = allNotes.filter(
    (n) => n.tier === 'paid' && unlockedIds.includes(n.id)
  );

  const totalCount = freeNotes.length + unlockedPaidNotes.length;

  return (
    <div className="space-y-10 pb-16">
      <div className="border-b border-line pb-4">
        <div className="eyebrow">SAVED &amp; UNLOCKED</div>
        <h1 className="font-display text-[26px] font-bold text-ink mt-1">
          Mere Notes ({totalCount})
        </h1>
        <p className="text-[14px] text-ink-3 mt-0.5">
          Free trial notes aur aapke dwara unlock kiye gaye paid notes.
        </p>
      </div>

      {/* Unlocked Paid Notes */}
      {unlockedPaidNotes.length > 0 && (
        <section className="space-y-4">
          <div>
            <div className="eyebrow text-brand">UNLOCKED PAID NOTES</div>
            <p className="text-[13px] text-ink-3 mt-0.5">
              Payment ke baad unlock kiye gaye notes — download karo.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unlockedPaidNotes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                tier="paid"
                isUnlocked={true}
                pricePaise={note.price_paise}
                title={note.title}
                pages={note.pages}
                language={note.language}
                fileSizeBytes={note.file_size}
                actionHref={`/note/${note.id}`}
              />
            ))}
          </div>
        </section>
      )}

      {unlockedPaidNotes.length === 0 && (
        <div className="p-4 rounded-[12px] bg-card border border-line text-center space-y-3">
          <div className="text-[14px] text-ink-2 font-medium">
            Abhi tak koi paid note unlock nahi kiya.
          </div>
          <Link href="/batch/entrance">
            <Button variant="primary" size="sm" className="gap-2 mt-1">
              Notes dekho &amp; unlock karo
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* Free Trial Notes */}
      {freeNotes.length > 0 && (
        <section className="space-y-4">
          <div>
            <div className="eyebrow">FREE TRIAL NOTES</div>
            <p className="text-[13px] text-ink-3 mt-0.5">
              Ye notes sabhi students ke liye free hain.
            </p>
          </div>
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
                actionHref={`/note/${note.id}`}
              />
            ))}
          </div>
        </section>
      )}

      {totalCount === 0 && (
        <EmptyState
          imageSrc="/img/empty-notes.webp"
          title="Koi note nahi mila"
          message="Koi note unlock nahi kiya aur koi free note available nahi hai."
          action={
            <Link href="/batch/entrance">
              <Button variant="primary" className="gap-2">
                Batches dekho
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
