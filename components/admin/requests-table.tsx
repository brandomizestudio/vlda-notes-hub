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
import { MessageSquare, X, Search, Package } from 'lucide-react';
import { BUNDLE_ID, BUNDLE_PRICE_PAISE, FALLBACK_SETTINGS } from '@/lib/constants';

interface PaymentRequestItem {
  id: string;
  studentName: string;
  phone: string;
  noteId: string;
  noteTitle: string;
  utr: string;
  amountPaise: number;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  isBundle: boolean;
}

// Demo bundle password — in production comes from settings
const DEMO_BUNDLE_PASSWORD = FALLBACK_SETTINGS.bundle_password;

const INITIAL_REQUESTS: PaymentRequestItem[] = [
  {
    id: 'req-1',
    studentName: 'Vikas Godara',
    phone: '9812345678',
    noteId: BUNDLE_ID,
    noteTitle: 'Complete Bundle (Entrance + 1st & 2nd Year)',
    utr: '428901928312',
    amountPaise: BUNDLE_PRICE_PAISE,
    time: 'Aaj, 04:30 PM',
    status: 'pending',
    isBundle: true,
  },
  {
    id: 'req-2',
    studentName: 'Amit Kumar',
    phone: '9416289012',
    noteId: BUNDLE_ID,
    noteTitle: 'Complete Bundle (Entrance + 1st & 2nd Year)',
    utr: '428819283719',
    amountPaise: BUNDLE_PRICE_PAISE,
    time: 'Aaj, 02:15 PM',
    status: 'pending',
    isBundle: true,
  },
  {
    id: 'req-3',
    studentName: 'Pooja Rani',
    phone: '9467812345',
    noteId: BUNDLE_ID,
    noteTitle: 'Complete Bundle (Entrance + 1st & 2nd Year)',
    utr: '428710293819',
    amountPaise: BUNDLE_PRICE_PAISE,
    time: 'Kal, 07:10 PM',
    status: 'approved',
    isBundle: true,
  },
];

export function RequestsTable() {
  const [requests, setRequests] = React.useState<PaymentRequestItem[]>(INITIAL_REQUESTS);
  const [filter, setFilter] = React.useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [search, setSearch] = React.useState('');
  // In production, fetch bundle password from /api/admin/settings or pass as prop
  const bundlePassword = DEMO_BUNDLE_PASSWORD;

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

  const handleApprove = async (req: PaymentRequestItem) => {
    // 1. Update local status
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'approved' } : r))
    );

    // 2. Compose WhatsApp message with bundle password
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vlddnotes.com';
    const message = req.isBundle
      ? `Namaste ${req.studentName}! 🎉\n\nAapka ₹${Math.round(req.amountPaise / 100)} payment confirm ho gaya.\n\n📦 *Complete Bundle Password:* ${bundlePassword}\n\n🌐 Website par jao aur bundle unlock karo:\n${siteUrl}/bundle\n\nPassword daalte hi saari notes ki ZIP download ho jaayegi.\n\nHar PDF me aapka naam watermark me hai — kisi ko share mat karna. 🙏`
      : `Namaste ${req.studentName}, aapka payment confirm ho gaya.\nNote: ${req.noteTitle}\nPassword: ${bundlePassword}\nWebsite: ${siteUrl}`;

    navigator.clipboard.writeText(message);
    toast('Password message copy ho gaya — WhatsApp khul raha hai!');

    const waUrl = `https://wa.me/91${req.phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    // 3. If Supabase configured, mark bundle unlock in DB
    try {
      await fetch('/api/admin/approve-bundle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: req.id, userId: req.phone }),
      });
    } catch {}
  };

  const handleReject = (req: PaymentRequestItem) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'rejected' } : r))
    );
    toast('Request reject mark ho gayi.');
  };

  return (
    <div className="space-y-4">
      {/* Bundle password display */}
      <div className="p-3.5 rounded-[12px] bg-brand-soft border border-brand/20 flex items-center gap-3">
        <Package className="w-4 h-4 text-brand shrink-0" />
        <div className="text-[13.5px] text-ink">
          <span className="font-medium">Bundle Password:</span>{' '}
          <span className="font-mono font-bold text-brand text-[15px]">{bundlePassword}</span>
          <span className="text-ink-3 ml-2 text-[12px]">(Settings me badlo)</span>
        </div>
      </div>

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
            <TableHead className="wrap">BUNDLE / NOTE</TableHead>
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
                  <div className="flex items-center gap-1.5">
                    {req.isBundle && (
                      <Package className="w-3.5 h-3.5 text-brand shrink-0" />
                    )}
                    <div className="font-medium text-ink text-[13px]">{req.noteTitle}</div>
                  </div>
                  <div className="font-mono text-xs text-brand font-bold mt-0.5">
                    Pass: {bundlePassword}
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
