import * as React from 'react';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ground grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
      {/* Left panel — Hero illustration & copy (hidden below 900px / lg) */}
      <div className="hidden lg:relative lg:flex flex-col justify-center bg-brand text-white p-[44px_34px] overflow-hidden min-h-screen">
        {/* Background Image with 88% brand overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/auth-hero.png"
            alt="VLDD Student studying"
            fill
            priority
            className="object-cover opacity-20"
            sizes="50vw"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(15, 107, 92, 0.88)' }}
          />
        </div>

        {/* Content container */}
        <div className="relative z-10 max-w-[500px] mx-auto space-y-7">
          <div className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-white/80">
            VETERINARY &amp; LIVESTOCK DIPLOMA
          </div>

          <h1 className="font-display text-[38px] xl:text-[44px] font-extrabold leading-[1.10] tracking-[-0.02em] text-white">
            Notes jo <br />
            exam me chalte hain.
          </h1>

          <p className="text-[16px] leading-[1.6] text-white/90 font-body">
            Do batch, ek jagah. Trial PDF sabke liye khuli hai — full notes password se open hote hain.
          </p>

          <div className="space-y-3.5 pt-2">
            {[
              'Register karo — sirf naam aur mobile number.',
              'Trial PDF free padho, quality khud dekh lo.',
              'UPI se pay karke password lo, full notes download karo.',
            ].map((step, idx) => (
              <div key={idx} className="flex items-center gap-3.5 text-[14.5px] leading-snug text-white">
                <span className="w-[22px] h-[22px] rounded-full bg-white/20 flex items-center justify-center font-mono text-[12px] font-bold text-white shrink-0">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — Form container */}
      <div className="flex flex-col justify-center items-center bg-ground p-[38px_26px] min-h-screen">
        <div className="w-full max-w-[380px]">
          {children}
        </div>
      </div>
    </div>
  );
}
