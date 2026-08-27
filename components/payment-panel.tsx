'use client';

import * as React from 'react';
import { Copy, ExternalLink, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatRupees } from '@/lib/format';
import { toast } from '@/components/ui/toaster';
import { NotePublic } from '@/types/database';
import { FALLBACK_SETTINGS } from '@/lib/constants';

interface PaymentPanelProps {
  note: NotePublic;
  upiId?: string;
  whatsappNumber?: string;
  onUnlocked?: () => void;
}

export function PaymentPanel({
  note,
  upiId = FALLBACK_SETTINGS.upi_id,
  whatsappNumber = FALLBACK_SETTINGS.whatsapp_number,
  onUnlocked,
}: PaymentPanelProps) {
  const [utr, setUtr] = React.useState('');
  const [utrSubmitted, setUtrSubmitted] = React.useState(false);
  const [utrTime, setUtrTime] = React.useState<string>('');
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [attempts, setAttempts] = React.useState(0);
  const [isLockedOut, setIsLockedOut] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const amountRupees = Math.round(note.price_paise / 100);
  const noteShortId = note.id.substring(0, 8);
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=VLDD%20Notes%20Hub&am=${amountRupees}&cu=INR&tn=${noteShortId}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    toast('UPI ID copy ho gayi!');
  };

  const handleUtrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr.trim()) return;

    setUtrSubmitted(true);
    setUtrTime(
      new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(new Date())
    );
    toast('Request bhej di. Password WhatsApp par aayega.');
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

    setLoading(true);

    try {
      // Call unlock verification API or handle demo unlock
      const response = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId: note.id,
          password: password.trim().toUpperCase(),
        }),
      });

      const res = await response.json();

      if (res.success) {
        toast('Unlock ho gaya — PDF khul rahi hai.');
        onUnlocked?.();
      } else {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        if (nextAttempts >= 5) {
          setIsLockedOut(true);
          setPasswordError('Bahut baar galat password. 1 ghante baad try karo ya WhatsApp par message karo.');
        } else {
          setPasswordError('Password galat hai. Payment ke baad jo password mila tha wahi daalo.');
        }
      }
    } catch {
      setPasswordError('Network slow lag raha hai. Ek baar aur try karo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <div className="eyebrow text-accent">PAYMENT &amp; PASSWORD</div>
        <h2 className="font-display text-[22px] font-bold text-ink mt-1">
          {note.title}
        </h2>
      </div>

      {/* Payment Box */}
      <div className="p-[14px] rounded-[12px] bg-card-2 border border-line flex flex-col sm:flex-row items-center gap-4">
        {/* QR Code — Static Google Pay QR */}
        <div className="shrink-0 relative flex flex-col items-center gap-1.5">
          <div className="w-[140px] h-[140px] rounded-[10px] bg-white p-2 border border-line-2 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/gpay-qr.png"
              alt="Google Pay QR"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <span className="font-mono text-[11px] font-bold text-brand bg-brand-soft px-2 py-0.5 rounded-full border border-brand/20">
            ₹{amountRupees}
          </span>
        </div>

        {/* Amount & UPI ID */}
        <div className="flex flex-col justify-center text-center sm:text-left flex-1">
          <div className="font-display text-[26px] font-extrabold text-ink leading-tight">
            {formatRupees(note.price_paise)}
          </div>
          <div className="font-mono text-[13.5px] text-ink-2 font-semibold mt-1 truncate">
            {upiId}
          </div>
          <div className="text-[12px] text-ink-3 mt-0.5">
            Kisi bhi UPI app se scan ya pay karein
          </div>
        </div>
      </div>

      {/* Buttons below payment box */}
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

      {/* 4-Step Numbered List */}
      <div className="border-t border-line pt-4 space-y-3">
        <div className="eyebrow">PAYMENT STEPS</div>
        <div className="space-y-2.5">
          {[
            `Upar wale UPI ID ya QR par ₹${amountRupees} bhejo.`,
            'Payment ka UTR / transaction number neeche daalo aur request bhejo.',
            `Hum WhatsApp ${whatsappNumber} par password bhej denge — aam taur par 2-4 ghante me.`,
            'Password yahan daalke PDF kholo aur download kar lo.',
          ].map((stepText, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 py-1.5 border-b border-line/60 last:border-0 text-[14px] leading-snug text-ink-2"
            >
              <span className="w-[24px] h-[24px] rounded-full bg-card-2 border border-line-2 flex items-center justify-center font-mono text-[12px] font-bold text-ink shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{stepText}</span>
            </div>
          ))}
        </div>
      </div>

      {/* UTR Submission Form */}
      <div className="border-t border-line pt-4">
        {utrSubmitted ? (
          <div className="p-3.5 rounded-[10px] bg-brand-soft border border-brand/20 flex items-center gap-2.5 text-[13.5px] text-ink font-medium">
            <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
            <div>
              Request bheji ja chuki hai — <span className="font-mono">{utrTime}</span>.{' '}
              <strong className="text-brand">Status: Pending.</strong>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUtrSubmit} className="space-y-3">
            <Input
              label="UTR / transaction number"
              placeholder="12 digit UTR number"
              maxLength={24}
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              required
              helperText="Payment ke baad Google Pay / PhonePe me 12 digit UTR number milta hai"
            />
            <Button type="submit" variant="ghost" className="w-full font-semibold">
              Payment request bhejo
            </Button>
          </form>
        )}
      </div>

      {/* Password Entry Box */}
      <div className="border-t border-line pt-5 space-y-3 bg-card-2/40 p-4 rounded-[14px] border">
        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <Input
            label="Password mil gaya? Yahan daalo"
            isPasswordMono
            placeholder="8 CHAR PASSWORD"
            maxLength={12}
            value={password}
            onChange={(e) => setPassword(e.target.value.toUpperCase())}
            error={passwordError || undefined}
            disabled={isLockedOut}
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full font-bold text-[15px]"
            disabled={loading || isLockedOut}
          >
            {loading ? 'Verify ho raha hai...' : 'Unlock & PDF kholo'}
          </Button>
        </form>
      </div>
    </div>
  );
}
