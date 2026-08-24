'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatRupees } from '@/lib/format';
import { Search } from 'lucide-react';

interface StudentItem {
  id: string;
  name: string;
  phone: string;
  joined: string;
  unlockedCount: number;
  totalPaidPaise: number;
  lastActive: string;
}

const SAMPLE_STUDENTS: StudentItem[] = [
  {
    id: 's1',
    name: 'Vikas Godara',
    phone: '9812345678',
    joined: '12 Aug 2026',
    unlockedCount: 2,
    totalPaidPaise: 59800,
    lastActive: '10 min pehle',
  },
  {
    id: 's2',
    name: 'Amit Kumar',
    phone: '9416289012',
    joined: '15 Aug 2026',
    unlockedCount: 1,
    totalPaidPaise: 49900,
    lastActive: 'Aaj, 02:15 PM',
  },
  {
    id: 's3',
    name: 'Pooja Rani',
    phone: '9467812345',
    joined: '18 Aug 2026',
    unlockedCount: 3,
    totalPaidPaise: 114700,
    lastActive: 'Kal, 07:10 PM',
  },
  {
    id: 's4',
    name: 'Rahul Sharma',
    phone: '9876543210',
    joined: '20 Aug 2026',
    unlockedCount: 0,
    totalPaidPaise: 0,
    lastActive: '2 din pehle',
  },
];

export function StudentsTable() {
  const [search, setSearch] = React.useState('');

  const filtered = SAMPLE_STUDENTS.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.phone.includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="relative w-full sm:w-[260px]">
          <Search className="w-4 h-4 text-ink-3 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-[13.5px] rounded-[10px] border border-line-2 bg-card text-ink focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-accent"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STUDENT NAME</TableHead>
            <TableHead>MOBILE NUMBER</TableHead>
            <TableHead>JOINED</TableHead>
            <TableHead>UNLOCKED</TableHead>
            <TableHead>TOTAL PAID</TableHead>
            <TableHead className="text-right">LAST ACTIVE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-semibold text-ink">{s.name}</TableCell>
              <TableCell className="font-mono text-xs text-ink-2">+91 {s.phone}</TableCell>
              <TableCell className="text-xs text-ink-3 font-mono">{s.joined}</TableCell>
              <TableCell className="font-mono text-xs font-semibold text-brand">
                {s.unlockedCount} {s.unlockedCount === 1 ? 'note' : 'notes'}
              </TableCell>
              <TableCell className="font-mono font-bold text-ink">
                {s.totalPaidPaise > 0 ? formatRupees(s.totalPaidPaise) : '—'}
              </TableCell>
              <TableCell className="text-right text-xs text-ink-3 font-mono">
                {s.lastActive}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
