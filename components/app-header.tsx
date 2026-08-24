'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, BookOpen, HelpCircle, LogOut, FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/app/actions/auth';
import { cn } from '@/lib/utils';
import { BATCHES } from '@/lib/constants';

interface AppHeaderProps {
  studentName: string;
  unlockedCount: number;
  siteNotice?: string;
  isNoticeActive?: boolean;
  whatsappNumber?: string;
}

export function AppHeader({
  studentName,
  unlockedCount,
  siteNotice,
  isNoticeActive = false,
  whatsappNumber = '919876543210',
}: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Active batch identification from pathname
  const activeBatchId = pathname.includes('/batch/year') ? 'year' : 'entrance';

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <>
      {/* Site-wide notice banner if active */}
      {isNoticeActive && siteNotice && (
        <div className="bg-accent text-accent-ink px-4 py-2 text-center text-[13px] font-semibold tracking-tight border-b border-accent-ink/10">
          {siteNotice}
        </div>
      )}

      {/* Sticky Topbar */}
      <header
        className="sticky top-0 z-40 border-b border-line"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--ground) 88%, transparent)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <div className="max-w-[1000px] mx-auto px-[18px] py-[12px] flex items-center justify-between">
          {/* Logo & Student Sub-line */}
          <Link href="/batch/entrance" className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-brand flex items-center justify-center text-white font-display font-bold text-lg overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/logo-mark.svg" alt="VLDD Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-display font-bold text-[17px] text-ink leading-tight">
                VLDD Notes Hub
              </div>
              <div className="text-[11.5px] text-ink-3 font-mono truncate max-w-[200px] sm:max-w-none">
                {studentName} · {unlockedCount} {unlockedCount === 1 ? 'note' : 'notes'} unlocked
              </div>
            </div>
          </Link>

          {/* Desktop Right Nav (>=640px) */}
          <div className="hidden sm:flex items-center gap-3 ml-auto">
            <Link href="/my-notes">
              <Button
                variant={pathname === '/my-notes' ? 'primary' : 'ghost'}
                size="sm"
                className="gap-1.5 font-medium"
              >
                <BookOpen className="w-4 h-4" />
                My Notes
              </Button>
            </Link>

            <Link href="/help">
              <Button
                variant={pathname === '/help' ? 'primary' : 'ghost'}
                size="sm"
                className="gap-1.5 font-medium"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </Button>
            </Link>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-ink-2 hover:text-lock"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Hamburger (<640px) */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Menu kholo"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-[40px] h-[40px] rounded-[10px] bg-card border border-line-2 flex items-center justify-center text-ink"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-line bg-card p-4 space-y-3 shadow-lg">
            <div className="text-[13px] text-ink-2 font-mono pb-1 border-b border-line">
              Namaste, <strong className="text-ink">{studentName}</strong>
            </div>
            <Link
              href="/my-notes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-[8px] text-[14.5px] font-semibold text-ink hover:bg-card-2"
            >
              <BookOpen className="w-4 h-4 text-brand" />
              My Notes ({unlockedCount} unlocked)
            </Link>
            <Link
              href="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-[8px] text-[14.5px] font-semibold text-ink hover:bg-card-2"
            >
              <HelpCircle className="w-4 h-4 text-brand" />
              Payment &amp; Password Help
            </Link>
            <Link
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-[8px] text-[14.5px] font-semibold text-brand hover:bg-card-2"
            >
              WhatsApp Support
            </Link>
            <div className="pt-2 border-t border-line">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-lock"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout karo
              </Button>
            </div>
          </div>
        )}

        {/* Batch Pills Row (only on batch or main browsing pages) */}
        {!pathname.startsWith('/help') && (
          <div className="max-w-[1000px] mx-auto px-[18px]">
            <div
              className="flex items-center gap-2 overflow-x-auto py-[18px] pb-[8px] no-scrollbar select-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {BATCHES.map((batch) => {
                const isActive = activeBatchId === batch.id && pathname.startsWith('/batch');
                return (
                  <Link key={batch.id} href={`/batch/${batch.id}`}>
                    <button
                      type="button"
                      aria-pressed={isActive}
                      className={cn(
                        'px-[16px] py-[9px] rounded-full text-[14px] font-body font-semibold whitespace-nowrap transition-all duration-150',
                        'focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-accent',
                        isActive
                          ? 'bg-ink text-ground border border-ink shadow-sm'
                          : 'bg-card text-ink-2 border border-line-2 hover:border-ink-3 hover:text-ink'
                      )}
                    >
                      {batch.title}
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
