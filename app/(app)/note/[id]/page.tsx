import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { getNoteById, getBatches, getBundleUnlockStatus, getSettings } from '@/lib/data';
import { NoteView } from './note-view';

interface NotePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const note = await getNoteById(params.id);

  if (!note) {
    return { title: 'Note Not Found — VLDD Notes Hub' };
  }

  return {
    title: `${note.title} — VLDD Notes Hub`,
    description: note.description || 'Veterinary Diploma Study Notes',
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { profile } = await requireUser();
  const note = await getNoteById(params.id);

  if (!note) {
    notFound();
  }

  const [batches, isBundleUnlocked, settings] = await Promise.all([
    getBatches(),
    getBundleUnlockStatus(profile.id),
    getSettings(),
  ]);

  const batch = batches.find((b) => b.id === note.batch_id) || batches[0];
  const isFree = note.tier === 'free';

  return (
    <NoteView
      note={note}
      batch={batch}
      isUnlocked={isFree || isBundleUnlocked}
      isBundleUnlocked={isBundleUnlocked}
      upiId={settings.upi_id}
      whatsappNumber={settings.whatsapp_number}
    />
  );
}
