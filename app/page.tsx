import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ground flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-[18px] border border-line bg-card shadow-card space-y-6">
        <div className="w-12 h-12 rounded-[14px] bg-brand text-white flex items-center justify-center font-display font-extrabold text-2xl mx-auto">
          V
        </div>
        <div>
          <div className="eyebrow mb-1">VETERINARY & LIVESTOCK DIPLOMA</div>
          <h1 className="font-display text-[26px] font-bold text-ink leading-tight">
            Veteducation
          </h1>
          <p className="text-[14px] text-ink-3 mt-1">
            VLDD Notes Hub — Complete Build System
          </p>
        </div>

        <p className="text-[15px] text-ink-2 leading-relaxed">
          Phase 1 (Foundation & Design System) is ready. Click below to inspect the design tokens, components, and live theme switcher.
        </p>

        <div className="pt-2 flex flex-col gap-3">
          <Link href="/styleguide" className="block">
            <Button variant="primary" className="w-full gap-2 text-[15px]">
              <Sparkles className="w-4 h-4" />
              Open Design System & Styleguide
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/assets" className="block">
            <Button variant="ghost" className="w-full gap-2 text-[14px]">
              Review Phase 2 Visual Assets (9 Items)
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
