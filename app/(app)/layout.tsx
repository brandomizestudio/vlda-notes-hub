import * as React from 'react';
import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { AppHeader } from '@/components/app-header';
import { getUserUnlocks, getSettings } from '@/lib/data';
import { FALLBACK_SETTINGS } from '@/lib/constants';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireUser();
  const unlocks = await getUserUnlocks(profile.id);
  const settings = await getSettings();

  const whatsappNumber = settings.whatsapp_number || FALLBACK_SETTINGS.whatsapp_number;
  const siteNotice = settings.site_notice || FALLBACK_SETTINGS.site_notice;
  const isNoticeActive = settings.site_notice_active === 'true';

  return (
    <div className="min-h-screen bg-ground flex flex-col justify-between">
      <div>
        <AppHeader
          studentName={profile.name}
          unlockedCount={unlocks.length}
          siteNotice={siteNotice}
          isNoticeActive={isNoticeActive}
          whatsappNumber={whatsappNumber}
        />

        <main className="max-w-[1000px] mx-auto px-[18px] pt-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-line mt-[44px] py-[22px] pb-[40px]">
        <div className="max-w-[1000px] mx-auto px-[18px] text-[13px] text-ink-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            VLDD Notes Hub · Sawal ho to WhatsApp karo{' '}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                'Namaste, mujhe VLDD Notes Hub ke baare me poochhna hai.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand font-semibold hover:underline"
            >
              +{whatsappNumber}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/help" className="hover:text-ink transition-colors">
              Help &amp; FAQ
            </Link>
            <span>·</span>
            <Link href="/styleguide" className="hover:text-ink transition-colors">
              Styleguide
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
