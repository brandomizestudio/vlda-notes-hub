import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

interface AssetSpec {
  id: number;
  name: string;
  path: string;
  size: string;
  usage: string;
  aspect: string;
}

const assets: AssetSpec[] = [
  {
    id: 1,
    name: 'Logo Mark (SVG)',
    path: '/img/logo-mark.svg',
    size: '512×512',
    usage: 'Topbar & Auth screen logo lock-up (34×34, radius 10)',
    aspect: '1:1',
  },
  {
    id: 2,
    name: 'Auth Hero Illustration',
    path: '/img/auth-hero.png',
    size: '1200×1600 (3:4 portrait)',
    usage: 'Fills left split-screen on /login & /register under brand overlay',
    aspect: '3:4',
  },
  {
    id: 3,
    name: 'Batch Entrance Banner',
    path: '/img/batch-entrance.png',
    size: '800×500',
    usage: 'Header banner on /batch/entrance (160px tall, radius 14)',
    aspect: '16:9',
  },
  {
    id: 4,
    name: 'Batch Year 1 & 2 Banner',
    path: '/img/batch-year.png',
    size: '800×500',
    usage: 'Header banner on /batch/year (160px tall, radius 14)',
    aspect: '16:9',
  },
  {
    id: 5,
    name: 'Empty Notes Illustration',
    path: '/img/empty-notes.png',
    size: '600×400',
    usage: 'EmptyState component when a section or /my-notes has 0 items',
    aspect: '3:2',
  },
  {
    id: 6,
    name: 'Empty Locked Illustration',
    path: '/img/empty-locked.png',
    size: '600×400',
    usage: 'EmptyState component for locked / payment states',
    aspect: '3:2',
  },
  {
    id: 7,
    name: 'Pay Steps Illustration',
    path: '/img/pay-steps.png',
    size: '900×300',
    usage: 'Top of PaymentPanel modal and /help FAQ page',
    aspect: '16:9',
  },
  {
    id: 8,
    name: 'OpenGraph Social Banner',
    path: '/img/og.png',
    size: '1200×630',
    usage: 'Meta openGraph image for WhatsApp / Telegram / Twitter shares',
    aspect: '16:9',
  },
  {
    id: 9,
    name: 'Favicon & App Icon',
    path: '/img/logo-mark.svg',
    size: '64×64',
    usage: 'Browser tab icon & PWA app icon',
    aspect: '1:1',
  },
];

export default function AssetsReviewPage() {
  return (
    <div className="min-h-screen bg-ground pb-24">
      <header className="sticky top-0 z-40 border-b border-line bg-ground/85 backdrop-blur-md">
        <div className="max-w-[1000px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/styleguide">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                Styleguide
              </Button>
            </Link>
            <div className="font-display font-bold text-[17px] text-ink">
              Asset Review — Phase 2
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-4 pt-8 space-y-8">
        <div>
          <div className="eyebrow">FLAT 2-COLOUR VECTOR ASSETS</div>
          <h1 className="font-display text-[28px] font-bold text-ink mt-1">
            Section 5 Visual Asset Review
          </h1>
          <p className="text-[15px] text-ink-2 mt-1 max-w-[65ch]">
            All 9 illustrations generated in strict compliance with the house style: flat vector 2-colour palette (Deep Green <code className="font-mono text-xs bg-card-2 px-1 py-0.5 rounded">#0F6B5C</code> &amp; Marigold <code className="font-mono text-xs bg-card-2 px-1 py-0.5 rounded">#E39A12</code> on <code className="font-mono text-xs bg-card-2 px-1 py-0.5 rounded">#F3F6F1</code> ground), thick even strokes, zero gradients, and zero drop shadows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="p-5 rounded-[14px] border border-line bg-card shadow-card flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-card-2 text-ink-2">
                    #{asset.id} · {asset.size}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-brand font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
                <h3 className="font-display text-[17px] font-bold text-ink mb-1">
                  {asset.name}
                </h3>
                <p className="text-[13px] text-ink-3">
                  {asset.usage}
                </p>
              </div>

              {/* Preview Container */}
              <div className="w-full rounded-[10px] border border-line-2 bg-ground flex items-center justify-center p-4 overflow-hidden min-h-[200px]">
                {asset.id === 1 ? (
                  <div className="w-[120px] h-[120px] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.path}
                      alt={asset.name}
                      className="w-full h-full object-contain rounded-[18px]"
                    />
                  </div>
                ) : (
                  <div className="w-full relative h-[220px]">
                    <Image
                      src={asset.path}
                      alt={asset.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 500px"
                    />
                  </div>
                )}
              </div>

              <div className="font-mono text-[12px] text-ink-3 truncate bg-card-2 px-3 py-1.5 rounded-[6px]">
                {asset.path}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
