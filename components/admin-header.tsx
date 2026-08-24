'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Shield, ArrowLeft } from 'lucide-react';

interface AdminHeaderProps {
  pendingCount: number;
}

export function AdminHeader({ pendingCount }: AdminHeaderProps) {
  const pathname = usePathname();

  const tabs = [
    { href: '/admin/notes', label: 'Notes' },
    {
      href: '/admin/requests',
      label: `Payment requests ${pendingCount > 0 ? `(${pendingCount})` : ''}`,
      badge: pendingCount > 0,
    },
    { href: '/admin/students', label: 'Students' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ground/90 backdrop-blur-md">
      <div className="max-w-[1000px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/batch/entrance">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              Student View
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-[30px] h-[30px] rounded-[8px] bg-ink text-ground flex items-center justify-center font-bold text-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display font-bold text-[16px] text-ink leading-none">
                Admin Panel
              </div>
              <div className="text-[11px] text-ink-3">VLDD Notes Hub Management</div>
            </div>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Underlined Tab Bar */}
      <div className="max-w-[1000px] mx-auto px-4">
        <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href === '/admin/notes' && pathname === '/admin');
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'py-3 text-[14px] font-semibold whitespace-nowrap border-b-2 transition-all duration-150',
                  isActive
                    ? 'text-ink border-accent font-bold'
                    : 'text-ink-3 border-transparent hover:text-ink hover:border-line-2'
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
