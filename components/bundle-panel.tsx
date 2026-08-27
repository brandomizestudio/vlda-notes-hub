'use client';

import * as React from 'react';
import {
  Copy,
  ExternalLink,
  Lock,
  CheckCircle2,
  Package,
  Download,
  Key,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { BUNDLE_PRICE_PAISE, FALLBACK_SETTINGS } from '@/lib/constants';

interface BundlePanelProps {
  upiId?: string;
  whatsappNumber?: string;
  onUnlocked?: () => void;
}

const BUNDLE_FEATURES = [
  'Entrance Exam — Complete Notes (Biology + Chemistry + GK)',
  'Entrance — 10 Year Solved Papers + Mock Tests',
  '1st Year — Anatomy, Physiology, LSS Complete Notes',
  '2nd Year — Full Notes + 5 Year Question Bank',
];

export function BundlePanel({
  upiId = FALLBACK_SETTINGS.upi_id,
  whatsappNumber = FALLBACK_SETTINGS.whatsapp_number,
  onUnlocked,
}: BundlePanelProps) {
  const [step, setStep] = React.useState<'payment' | 'pending' | 'password' | 'unlocked'>('payment');
  const [utr, setUtr] = React.useState('');
  const [utrSubmitting, setUtrSubmitting] = React.useState(false);
  const [utrTime, setUtrTime] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [attempts, setAttempts] = React.useState(0);
  const [isLockedOut, setIsLockedOut] = React.useState(false);
  const [unlocking, setUnlocking] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  const amountRupees = Math.round(BUNDLE_PRICE_PAISE / 100);
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=VLDD%20Notes%20Hub&am=${amountRupees}&cu=INR&tn=BUNDLE99`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    toast('UPI ID copy ho gayi!');
  };

  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr.trim()) return;

    setUtrSubmitting(true);
    try {
      await fetch('/api/bundle-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utr: utr.trim() }),
      });
    } catch {}

    setUtrTime(
      new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(new Date())
    );
    setUtrSubmitting(false);
    setStep('pending');
    toast('Request bhej di! Password WhatsApp par aayega.');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (isLockedOut) {
      setPasswordError('Bahut baar galat password. 1 ghante baad try karo ya WhatsApp par message karo.');
      return;
    }

    if (!password.trim()) {
      setPasswordError('Password daalna zaroori hai.');
      return;
    }

    setUnlocking(true);
    try {
      const res = await fetch('/api/bundle-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setStep('unlocked');
        toast('Bundle unlock ho gaya! ZIP download ke liye ready hai.');
        onUnlocked?.();
      } else {
        const next = attempts + 1;
        setAttempts(next);
        if (next >= 5) {
          setIsLockedOut(true);
          setPasswordError('Bahut baar galat password. 1 ghante baad try karo ya WhatsApp par message karo.');
        } else {
          setPasswordError('Password galat hai. WhatsApp par jo password aaya tha wahi daalo.');
        }
      }
    } catch {
      setPasswordError('Network slow lag raha hai. Ek baar aur try karo.');
    } finally {
      setUnlocking(false);
    }
  };

  const handleBundleDownload = () => {
    setDownloading(true);
    toast('Bundle ZIP prepare ho rahi hai — thoda wait karo...');
    window.location.href = '/api/bundle-download';
    setTimeout(() => setDownloading(false), 5000);
  };

  // ── UNLOCKED STATE ────────────────────────────────────────────
  if (step === 'unlocked') {
    return (
      <div className="w-full space-y-5">
        <div className="p-4 rounded-[14px] bg-brand-soft border border-brand/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-brand" />
          </div>
          <div>
            <div className="font-display font-bold text-ink text-[16px]">Bundle Unlocked!</div>
            <div className="text-[13px] text-ink-2">Saari files ZIP me download ho sakti hain.</div>
          </div>
        </div>

        <div className="space-y-2.5">
          {BUNDLE_FEATURES.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-[13.5px] text-ink-2">
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-[10px] bg-card-2 border border-line text-[12.5px] text-ink-3 leading-relaxed">
          Har PDF me aapka naam aur phone number watermark me hai. Kisi ko share mat karna.
        </div>

        <Button
          variant="brand"
          className="w-full gap-2 text-[15px] font-bold"
          onClick={handleBundleDownload}
          disabled={downloading}
        >
          <Download className="w-4 h-4" />
          {downloading ? 'ZIP ban rahi hai...' : 'Complete Bundle ZIP Download Karo'}
        </Button>
      </div>
    );
  }

  // ── PENDING STATE ─────────────────────────────────────────────
  if (step === 'pending') {
    return (
      <div className="w-full space-y-5">
        <div className="p-4 rounded-[10px] bg-brand-soft border border-brand/20 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
          <div className="text-[13.5px] text-ink font-medium">
            Request bheji — <span className="font-mono">{utrTime}</span>.{' '}
            <strong className="text-brand">WhatsApp par password aane ka wait karo.</strong>
          </div>
        </div>

        {/* Password Entry */}
        <div className="p-4 rounded-[14px] border border-line bg-card-2/40 space-y-3">
          <div className="eyebrow text-accent flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5" />
            PASSWORD MIL GAYA? YAHAN DAALO
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <Input
              label="Bundle password"
              isPasswordMono
              placeholder="PASSWORD YAHAN DAALO"
              maxLength={16}
              value={password}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
              error={passwordError || undefined}
              disabled={isLockedOut}
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full font-bold text-[15px]"
              disabled={unlocking || isLockedOut}
            >
              {unlocking ? 'Verify ho raha hai...' : 'Unlock & Bundle Download Karo'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ── PAYMENT STATE ─────────────────────────────────────────────
  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div>
        <div className="eyebrow text-accent flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5" />
          COMPLETE BUNDLE — SIRF ₹{amountRupees}
        </div>
        <h2 className="font-display text-[20px] font-bold text-ink mt-1 leading-snug">
          Saari notes + future updates — ek hi price me
        </h2>
      </div>

      {/* What's included */}
      <div className="p-4 rounded-[12px] bg-card border border-line space-y-2.5">
        <div className="eyebrow text-ink-3 text-[10.5px]">BUNDLE ME KYA HAI</div>
        {BUNDLE_FEATURES.map((f, i) => (
          <div key={i} className="flex items-start gap-2 text-[13px] text-ink-2">
            <ArrowRight className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
            <span>{f}</span>
          </div>
        ))}
      </div>

      {/* Payment Box */}
      <div className="p-[14px] rounded-[12px] bg-card-2 border border-line flex flex-col sm:flex-row items-center gap-4">
        {/* QR */}
        <div className="shrink-0 flex flex-col items-center gap-1.5">
          <div className="w-[130px] h-[130px] rounded-[10px] bg-white p-2 border border-line-2 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/gpay-qr.png"
              alt="Google Pay QR"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <span className="font-mono text-[11px] font-bold text-brand bg-brand-soft px-2 py-0.5 rounded-full border border-brand/20">
            ₹{amountRupees}
          </span>
        </div>

        {/* Amount + UPI */}
        <div className="flex flex-col justify-center text-center sm:text-left flex-1">
          <div className="font-display text-[30px] font-extrabold text-ink leading-tight">
            ₹{amountRupees}
          </div>
          <div className="font-mono text-[13px] text-ink-2 font-semibold mt-1 truncate">{upiId}</div>
          <div className="text-[12px] text-ink-3 mt-0.5">Kisi bhi UPI app se scan ya pay karein</div>
        </div>
      </div>

      {/* Copy + Open UPI */}
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={handleCopyUpi} className="gap-1.5 flex-1">
          <Copy className="w-3.5 h-3.5" />
          Copy UPI ID
        </Button>
        <a href={upiDeepLink} className="flex-1 sm:hidden">
          <Button variant="brand" size="sm" className="w-full gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" />
            UPI app me kholo
          </Button>
        </a>
      </div>

      {/* Steps */}
      <div className="border-t border-line pt-4 space-y-3">
        <div className="eyebrow">PAYMENT STEPS</div>
        <div className="space-y-2">
          {[
            `Upar wale QR ya UPI ID par ₹${amountRupees} bhejo.`,
            'Payment ka UTR / transaction number neeche daalo aur request bhejo.',
            `Hum WhatsApp ${whatsappNumber} par password bhej denge — aam taur par 2-4 ghante me.`,
            'Password daalte hi complete bundle ZIP download ho jaayegi — saari notes ek saath!',
          ].map((text, i) => (
            <div
              key={i}
              className="flex items-start gap-3 py-1.5 border-b border-line/60 last:border-0 text-[13.5px] leading-snug text-ink-2"
            >
              <span className="w-[22px] h-[22px] rounded-full bg-card-2 border border-line-2 flex items-center justify-center font-mono text-[11px] font-bold text-ink shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* UTR Form */}
      <div className="border-t border-line pt-4">
        <form onSubmit={handleUtrSubmit} className="space-y-3">
          <Input
            label="UTR / Transaction number"
            placeholder="12 digit UTR number"
            maxLength={24}
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            required
            helperText="Payment ke baad Google Pay / PhonePe me 12 digit UTR milta hai"
          />
          <Button
            type="submit"
            variant="ghost"
            className="w-full font-semibold"
            disabled={utrSubmitting}
          >
            {utrSubmitting ? 'Bhej rahe hain...' : 'Payment request bhejo'}
          </Button>
        </form>
      </div>

      {/* Already have password? */}
      <div className="border-t border-line pt-4 space-y-3 bg-card-2/40 p-4 rounded-[14px] border">
        <div className="eyebrow text-accent flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          PEHLE SE PASSWORD HAI? YAHAN DAALO
        </div>
        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <Input
            label="Bundle password"
            isPasswordMono
            placeholder="PASSWORD YAHAN DAALO"
            maxLength={16}
            value={password}
            onChange={(e) => setPassword(e.target.value.toUpperCase())}
            error={passwordError || undefined}
            disabled={isLockedOut}
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full font-bold text-[15px]"
            disabled={unlocking || isLockedOut}
          >
            {unlocking ? 'Verify ho raha hai...' : 'Unlock & Download Karo'}
          </Button>
        </form>
      </div>
    </div>
  );
}
