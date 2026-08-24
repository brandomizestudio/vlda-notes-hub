import { Metadata } from 'next';
import Link from 'next/link';
import { getNotesByBatch } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, ExternalLink } from 'lucide-react';
import { formatRupees, formatFileSize } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Notes Management — VLDD Admin',
};

export default async function AdminNotesPage() {
  const entranceNotes = await getNotesByBatch('entrance');
  const yearNotes = await getNotesByBatch('year');
  const allNotes = [...entranceNotes, ...yearNotes];

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="eyebrow">NOTES DIRECTORY</div>
          <h1 className="font-display text-[26px] font-bold text-ink mt-1">
            All Study Notes ({allNotes.length})
          </h1>
        </div>
        <Link href="/admin/notes/new">
          <Button variant="primary" className="gap-1.5 font-bold">
            <Plus className="w-4 h-4" />
            Naya note add karo
          </Button>
        </Link>
      </div>

      {/* Notes Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="wrap">TITLE</TableHead>
            <TableHead>BATCH</TableHead>
            <TableHead>SECTION</TableHead>
            <TableHead>PRICE</TableHead>
            <TableHead>PASSWORD</TableHead>
            <TableHead>PAGES</TableHead>
            <TableHead>SIZE</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allNotes.map((note) => {
            const isFree = note.tier === 'free';
            const password = (note as any).pdf_password || (isFree ? '—' : 'PROTECTED');

            return (
              <TableRow key={note.id}>
                <TableCell className="wrap font-medium">
                  <div className="font-semibold text-ink">{note.title}</div>
                  {note.subject && (
                    <div className="text-[12px] text-ink-3 font-mono mt-0.5">
                      {note.subject} · {note.language}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs text-ink-2">
                  {note.batch_id === 'entrance' ? 'Entrance' : '1st & 2nd Year'}
                </TableCell>
                <TableCell>
                  <Badge variant={isFree ? 'free' : 'paid'}>
                    {isFree ? 'Trial (Free)' : 'Full (Paid)'}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono font-semibold">
                  {isFree ? 'Free' : formatRupees(note.price_paise)}
                </TableCell>
                <TableCell className="font-mono text-xs font-bold text-ink-2">
                  {isFree ? (
                    <span className="text-ink-3">No Pass</span>
                  ) : (
                    <span className="bg-card-2 px-2 py-0.5 rounded text-accent-ink font-mono font-semibold">
                      {password}
                    </span>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs text-ink-2">
                  {note.pages}
                </TableCell>
                <TableCell className="font-mono text-xs text-ink-3">
                  {formatFileSize(note.file_size)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/note/${note.id}`} target="_blank">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View note">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
