'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/toaster';
import { formatRupees } from '@/lib/format';
import { MessageSquare, Check, X, Search } from 'lucide-react';

interface PaymentRequestItem {
  id: string;
  studentName: string;
  phone: string;
  noteId: string;
  noteTitle: string;
  pdfPassword: string;
  utr: string;
  amountPaise: number;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
}

const INITIAL_REQUESTS: PaymentRequestItem[] = [
  {
    id: 'req-1',
    studentName: 'Vikas Godara',
    phone: '9812345678',
    noteId: '11111111-1111-1111-1111-111111111103',
    noteTitle: 'Entrance Complete Notes (Biology + Chemistry + GK)',
    pdfPassword: 'ENTRANCE2026',
    utr: '428901928312',
    amountPaise: 29900,
    time: 'Aaj, 04:30 PM',
    status: 'pending',
  },
  {
    id: 'req-2',
    studentName: 'Amit Kumar',
    phone: '9416289012',
    noteId: '22222222-2222-2222-2222-222222222203',
    noteTitle: '1st Year Complete Notes (Anatomy + Physiology)',
    pdfPassword: 'YEAR1FULL',
    utr: '428819283719',
    amountPaise: 49900,
    time: 'Aaj, 02:15 PM',
    status: 'pending',
  },
  {
    id: 'req-3',
    studentName: 'Pooja Rani',
    phone: '9467812345',
    noteId: '11111111-1111-1111-1111-111111111104',
    noteTitle: 'Entrance 10-Year Solved Question Papers',
    pdfPassword: 'MOCKVLDD',
    utr: '428710293819',
    amountPaise: 34900,
    time: 'Kal, 07:10 PM',
    status: 'approved',
  },
];

export function RequestsTable() {
  const [requests, setRequests] = React.useState<PaymentRequestItem[]>(INITIAL_REQUESTS);
  const [filter, setFilter] = React.useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [search, setSearch] = React.useState('');

  const filteredRequests = requests.filter((req) => {
    if (filter !== 'all' && req.status !== filter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      req.studentName.toLowerCase().includes(q) ||
      req.phone.includes(q) ||
      req.utr.includes(q) ||
      req.noteTitle.toLowerCase().includes(q)
    );
  });

  const handleApprove = (req: PaymentRequestItem) => {
    // 1. Update status
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'approved' } : r))
    );

    // 2. Prepare WhatsApp message
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vlddnotes.com';
    const message = `Namaste ${req.studentName}, aapka payment mil gaya.\nNote: ${req.noteTitle}\nPDF password: ${req.pdfPassword}\nWebsite par ye password daal ke PDF kholo: ${siteUrl}/note/${req.noteId}`;

    navigator.clipboard.writeText(message);
    toast('Password message copy ho gaya aur WhatsApp khul raha hai!');

    const waUrl = `https://wa.me/91${req.phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleReject = (req: PaymentRequestItem) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'rejected' } : r))
    );
    toast('Request reject mark ho gayi.');
  };

  return (
    <div className="space-y-4">
      {/* Filter Row + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-[10px] bg-card-2 border border-line-2 overflow-x-auto">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-[7px] text-xs font-semibold uppercase tracking-wider font-mono transition-colors ${
                filter === f
                  ? 'bg-card text-ink shadow-sm'
                  : 'text-ink-3 hover:text-ink'
              }`}
            >
              {f === 'all' ? 'Sabhi' : f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-[260px]">
          <Search className="w-4 h-4 text-ink-3 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-[13.5px] rounded-[10px] border border-line-2 bg-card text-ink focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-accent"
          />
        </div>
      </div>

      {/* Requests Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STUDENT</TableHead>
            <TableHead>NUMBER</TableHead>
            <TableHead className="wrap">NOTE &amp; PASSWORD</TableHead>
            <TableHead>UTR NUMBER</TableHead>
            <TableHead>AMOUNT</TableHead>
            <TableHead>TIME</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="text-right">ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-ink-3">
                Koi payment request nahi mili.
              </TableCell>
            </TableRow>
          ) : (
            filteredRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-semibold text-ink">
                  {req.studentName}
                </TableCell>
                <TableCell className="font-mono text-xs text-ink-2">
                  +91 {req.phone}
                </TableCell>
                <TableCell className="wrap">
                  <div className="font-medium text-ink">{req.noteTitle}</div>
                  <div className="font-mono text-xs text-brand font-bold mt-0.5">
                    Pass: {req.pdfPassword}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs font-semibold text-ink">
                  {req.utr}
                </TableCell>
                <TableCell className="font-mono font-bold text-ink">
                  {formatRupees(req.amountPaise)}
                </TableCell>
                <TableCell className="text-xs text-ink-3">
                  {req.time}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      req.status === 'approved'
                        ? 'ok'
                        : req.status === 'rejected'
                        ? 'neutral'
                        : 'paid'
                    }
                  >
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {req.status === 'pending' ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="brand"
                        size="sm"
                        onClick={() => handleApprove(req)}
                        className="gap-1 font-semibold text-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Password bhejo
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(req)}
                        className="h-8 w-8 p-0 text-lock hover:bg-lock-soft"
                        title="Reject karo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs font-mono text-ink-3 capitalize">
                      {req.status}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
