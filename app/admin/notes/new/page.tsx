import { Metadata } from 'next';
import { NewNoteForm } from './new-note-form';

export const metadata: Metadata = {
  title: 'New Note — VLDD Admin',
};

export default function NewNotePage() {
  return <NewNoteForm />;
}
