import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { getBatches, getNotesByBatch, getBundleUnlockStatus } from '@/lib/data';
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
  // Parallelize user check and batch lookup
  const [{ profile }, batches] = await Promise.all([
    requireUser(),
    getBatches(),
  ]);

  const batch = batches.find((b) => b.id === params.slug);

  if (!batch) {
    notFound();
  }

  // Parallelize notes + bundle unlock status
  const [allNotes, isBundleUnlocked] = await Promise.all([
    getNotesByBatch(batch.id),
    getBundleUnlockStatus(profile.id),
  ]);

  const freeNotes = allNotes.filter((n) => n.tier === 'free');
  const paidNotes = allNotes.filter((n) => n.tier === 'paid');

  return (
    <BatchView
      batch={batch}
      freeNotes={freeNotes}
      paidNotes={paidNotes}
      isBundleUnlocked={isBundleUnlocked}
    />
  );
}
