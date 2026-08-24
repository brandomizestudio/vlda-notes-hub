'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginAction, registerAction } from '@/app/actions/auth';
import { toast } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FALLBACK_SETTINGS } from '@/lib/constants';

interface AuthFormProps {
  initialMode: 'login' | 'register';
}

export function AuthForm({ initialMode }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = React.useState<'login' | 'register'>(initialMode);
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side quick validation
    if (mode === 'register' && !name.trim()) {
      setError('Poora naam daalna zaroori hai.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('10 digit ka mobile number daalo.');
      return;
    }

    if (password.length < 6) {
      setError('Password kam se kam 6 character ka rakho.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('phone', cleanPhone);
    formData.append('password', password);
    if (mode === 'register') {
      formData.append('name', name.trim());
    }

    try {
      const res = mode === 'register' ? await registerAction(formData) : await loginAction(formData);

      if (!res.success) {
        setError(res.error || 'Kuch galat hua. Dobara try karo.');
        setLoading(false);
      } else {
        toast(mode === 'register' ? 'Account ban gaya! Welcome.' : 'Login successful!');
        router.push('/batch/entrance');
        router.refresh();
      }
    } catch {
      setError('Internet slow lag raha hai. Ek baar aur try karo.');
      setLoading(false);
    }
  };

  const whatsappNumber = FALLBACK_SETTINGS.whatsapp_number;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Namaste, main VLDD Notes Hub ka password reset ya account help chahta hoon.'
  )}`;

  return (
    <div className="w-full space-y-6">
      {/* Logo Lock-up */}
      <div className="flex items-center gap-3">
        <div className="w-[34px] h-[34px] rounded-[10px] bg-brand flex items-center justify-center text-white font-display font-bold text-lg overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo-mark.svg" alt="VLDD Notes Hub" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-display font-bold text-[17px] text-ink leading-tight">
            VLDD Notes Hub
          </div>
          <div className="text-[11px] text-ink-3">
            Login zaroori hai
          </div>
        </div>
      </div>

      {/* Segmented Login / Register control */}
      <div className="grid grid-cols-2 p-1 rounded-[12px] bg-card-2 border border-line-2">
        <button
          type="button"
          onClick={() => switchMode('login')}
          className={cn(
            'py-2 text-[14px] font-semibold rounded-[9px] transition-all text-center',
            mode === 'login'
              ? 'bg-card text-ink shadow-sm'
              : 'text-ink-2 hover:text-ink'
          )}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => switchMode('register')}
          className={cn(
            'py-2 text-[14px] font-semibold rounded-[9px] transition-all text-center',
            mode === 'register'
              ? 'bg-card text-ink shadow-sm'
              : 'text-ink-2 hover:text-ink'
          )}
        >
          Register
        </button>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <Input
            label="Poora naam"
            type="text"
            placeholder="Jaise: Ankit Verma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        )}

        <Input
          label="Mobile number"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          placeholder="10 digit ka number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          required
          autoComplete="tel"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min. 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
        />

        {error && (
          <div className="p-3 rounded-[10px] bg-lock-soft text-lock text-[13px] font-medium leading-relaxed border border-lock/20">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading
            ? 'Rukiye...'
            : mode === 'register'
            ? 'Account banao'
            : 'Login karo'}
        </Button>
      </form>

      {/* Footer / Password help */}
      <div className="text-center text-[13px] text-ink-3 pt-2">
        <span>Password bhool gaye? </span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand font-semibold hover:underline"
        >
          WhatsApp karo +{whatsappNumber}
        </a>
      </div>
    </div>
  );
}
