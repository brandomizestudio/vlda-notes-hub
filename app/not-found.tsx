import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ground flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-[18px] border border-line bg-card shadow-card space-y-5">
        <div className="w-14 h-14 rounded-full bg-card-2 flex items-center justify-center text-ink-3 mx-auto">
          <FileQuestion className="w-7 h-7 text-lock" />
        </div>
        <div>
          <div className="font-mono text-xs font-semibold text-lock tracking-wider uppercase">
            404 NOT FOUND
          </div>
          <h1 className="font-display text-[24px] font-bold text-ink mt-1">
            Ye page nahi mila
          </h1>
          <p className="text-[14px] text-ink-3 mt-1.5">
            Aapne jo link open kiya hai wo galat hai ya page hata diya gaya hai.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/batch/entrance">
            <Button variant="primary" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Notes par wapas jao
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
