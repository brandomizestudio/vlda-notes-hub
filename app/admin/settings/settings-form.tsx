'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toaster';
import { Save, Key } from 'lucide-react';
import { FALLBACK_SETTINGS } from '@/lib/constants';

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [upiId, setUpiId] = React.useState(initialSettings.upi_id || FALLBACK_SETTINGS.upi_id);
  const [whatsappNumber, setWhatsappNumber] = React.useState(
    initialSettings.whatsapp_number || FALLBACK_SETTINGS.whatsapp_number
  );
  const [siteNotice, setSiteNotice] = React.useState(
    initialSettings.site_notice || FALLBACK_SETTINGS.site_notice
  );
  const [isNoticeActive, setIsNoticeActive] = React.useState(
    initialSettings.site_notice_active === 'true'
  );
  const [bundlePassword, setBundlePassword] = React.useState(
    (initialSettings.bundle_password || FALLBACK_SETTINGS.bundle_password).toUpperCase()
  );
  const [loading, setLoading] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast('Settings update ho gayi!');
    }, 600);
  };

  return (
    <form onSubmit={handleSave} className="max-w-[650px] space-y-6">
      <div className="p-6 rounded-[16px] border border-line bg-card shadow-card space-y-5">
        <div className="eyebrow text-accent">PAYMENT &amp; SUPPORT CHANNELS</div>

        <Input
          label="Official UPI ID (QR Code & Payment Deep Links)"
          placeholder="inavneetbhadrecha@okhdfcbank"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          required
          helperText="Sabhi note payment QR codes isi UPI ID se auto-generate honge"
        />

        <Input
          label="WhatsApp Support Number (10 digit bina +91 ke)"
          placeholder="8571041222"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          required
          helperText="Students ko password bhejne aur help queries ke liye ye number use hoga"
        />
      </div>

      {/* Bundle Password */}
      <div className="p-6 rounded-[16px] border border-brand/30 bg-brand-soft shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-brand" />
          <div className="eyebrow text-brand">BUNDLE PASSWORD</div>
        </div>
        <p className="text-[13px] text-ink-2">
          Ye password admin approve karne ke baad student ko WhatsApp par bheja jaata hai. Student is password ko enter karke ₹99 bundle unlock kar sakta hai.
        </p>
        <Input
          label="Bundle Password (UPPERCASE)"
          placeholder="VLDD99"
          value={bundlePassword}
          onChange={(e) => setBundlePassword(e.target.value.toUpperCase())}
          required
          helperText="Sirf letters aur numbers — 4 se 16 characters. Isko WhatsApp message me auto-include kiya jaata hai."
          isPasswordMono
        />
      </div>

      <div className="p-6 rounded-[16px] border border-line bg-card shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="eyebrow">GLOBAL ANNOUNCEMENT</div>
            <h3 className="font-display text-[17px] font-bold text-ink mt-0.5">
              Site-wide Notice Banner
            </h3>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isNoticeActive}
              onChange={(e) => setIsNoticeActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-card-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-line-2 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-ink-2">
            Notice Text (Student app me topbar ke upar dikhega)
          </label>
          <textarea
            rows={3}
            className="w-full px-[13px] py-[11px] rounded-[10px] border border-line-2 bg-card text-ink text-[14px] font-body focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-accent"
            placeholder="Jaise: Naye entrance notes upload ho rahe hain..."
            value={siteNotice}
            onChange={(e) => setSiteNotice(e.target.value)}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full font-bold text-[15px] gap-2"
        disabled={loading}
      >
        <Save className="w-4 h-4" />
        {loading ? 'Saving...' : 'Settings Save Karo'}
      </Button>
    </form>
  );
}
