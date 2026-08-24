import { Metadata } from 'next';
import Link from 'next/link';
import { getNotesByBatch } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, Clock, FileText, Users, Key } from 'lucide-react';
import { formatRupees } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Admin Dashboard — VLDD Notes Hub',
};

export default async function AdminDashboardPage() {
  const entranceNotes = await getNotesByBatch('entrance');
  const yearNotes = await getNotesByBatch('year');
  const totalNotes = entranceNotes.length + yearNotes.length;

  const stats = [
    {
      label: 'TOTAL STUDENTS',
      value: '428',
      icon: <Users className="w-4 h-4 text-brand" />,
      sub: '42 joined this week',
    },
    {
      label: 'PENDING REQUESTS',
      value: '2',
      isLock: true,
      icon: <Clock className="w-4 h-4 text-lock" />,
      sub: 'Action required on WhatsApp',
    },
    {
      label: 'NOTES PUBLISHED',
      value: totalNotes.toString(),
      icon: <FileText className="w-4 h-4 text-ink" />,
      sub: `${entranceNotes.length} Entrance + ${yearNotes.length} Year 1&2`,
    },
    {
      label: "THIS MONTH'S UNLOCKS",
      value: '184',
      icon: <Key className="w-4 h-4 text-accent" />,
      sub: `${formatRupees(5501600)} collected via UPI`,
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="eyebrow">ADMIN DASHBOARD</div>
          <h1 className="font-display text-[26px] font-bold text-ink mt-1">
            Overview &amp; Stats
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/notes/new">
            <Button variant="primary" className="gap-1.5 font-bold">
              <Plus className="w-4 h-4" />
              Naya note add karo
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-[14px] border ${
              stat.isLock ? 'border-lock/40 bg-lock-soft/40' : 'border-line bg-card'
            } shadow-card space-y-3`}
          >
            <div className="flex items-center justify-between">
              <span className={`eyebrow ${stat.isLock ? 'text-lock' : 'text-ink-3'}`}>
                {stat.label}
              </span>
              {stat.icon}
            </div>
            <div
              className={`font-display text-[28px] font-extrabold leading-none tabular-nums ${
                stat.isLock ? 'text-lock' : 'text-ink'
              }`}
            >
              {stat.value}
            </div>
            <div className="text-[12.5px] text-ink-3 font-body truncate">
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Link href="/admin/requests" className="block group">
          <div className="p-5 rounded-[14px] border border-line bg-card shadow-card group-hover:border-accent transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-lock">PAYMENT REQUESTS</span>
              <ArrowRight className="w-4 h-4 text-ink-3 group-hover:text-accent transition-colors" />
            </div>
            <div className="font-display font-bold text-[17px] text-ink">
              Verify UTR &amp; Send Passwords
            </div>
            <p className="text-[13px] text-ink-3">
              Students ne jo UTR daale hain unko verify karke WhatsApp message bheinjo.
            </p>
          </div>
        </Link>

        <Link href="/admin/notes" className="block group">
          <div className="p-5 rounded-[14px] border border-line bg-card shadow-card group-hover:border-accent transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="eyebrow">NOTES REPOSITORY</span>
              <ArrowRight className="w-4 h-4 text-ink-3 group-hover:text-accent transition-colors" />
            </div>
            <div className="font-display font-bold text-[17px] text-ink">
              Manage Notes &amp; Passwords
            </div>
            <p className="text-[13px] text-ink-3">
              Naye chapter add karein, PDF update karein, prices aur passwords badlein.
            </p>
          </div>
        </Link>

        <Link href="/admin/settings" className="block group">
          <div className="p-5 rounded-[14px] border border-line bg-card shadow-card group-hover:border-accent transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="eyebrow">CONFIG</span>
              <ArrowRight className="w-4 h-4 text-ink-3 group-hover:text-accent transition-colors" />
            </div>
            <div className="font-display font-bold text-[17px] text-ink">
              UPI &amp; Notice Settings
            </div>
            <p className="text-[13px] text-ink-3">
              UPI ID, WhatsApp number, aur site-wide notice banner update karein.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
