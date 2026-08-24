import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { getBatches, getNotesByBatch, getUserUnlocks } from '@/lib/data';
import { BatchView } from './batch-view';

interface BatchPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BatchPageProps): Promise<Metadata> {
  const batches = await getBatches();
  const batch = batches.find((b) => b.id === params.slug);

  if (!batch) {
    return { title: 'Batch Not Found — VLDD Notes Hub' };
  }

  return {
    title: `${batch.title} — VLDD Notes Hub`,
    description: batch.subtitle,
  };
}

export default async function BatchPage({ params }: BatchPageProps) {
  const { profile } = await requireUser();
  const batches = await getBatches();
  const batch = batches.find((b) => b.id === params.slug);

  if (!batch) {
    notFound();
  }

  const allNotes = await getNotesByBatch(batch.id);
  const freeNotes = allNotes.filter((n) => n.tier === 'free');
  const paidNotes = allNotes.filter((n) => n.tier === 'paid');
  const unlockedNoteIds = await getUserUnlocks(profile.id);

  return (
    <BatchView
      batch={batch}
      freeNotes={freeNotes}
      paidNotes={paidNotes}
      unlockedNoteIds={unlockedNoteIds}
    />
  );
}
