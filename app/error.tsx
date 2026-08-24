'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-ground flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-[18px] border border-line bg-card shadow-card space-y-5">
        <div className="w-14 h-14 rounded-full bg-lock-soft flex items-center justify-center text-lock mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div>
          <div className="font-mono text-xs font-semibold text-lock tracking-wider uppercase">
            SERVER ERROR
          </div>
          <h1 className="font-display text-[24px] font-bold text-ink mt-1">
            Internet slow lag raha hai
          </h1>
          <p className="text-[14px] text-ink-3 mt-1.5">
            Ek baar aur try karein ya WhatsApp par sampark karein.
          </p>
        </div>

        <div className="pt-2">
          <Button variant="primary" onClick={() => reset()} className="w-full gap-2 font-bold">
            <RefreshCw className="w-4 h-4" />
            Dobara try karo
          </Button>
        </div>
      </div>
    </div>
  );
}
