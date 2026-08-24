import { Metadata } from 'next';
import { getSettings } from '@/lib/data';
import { SettingsForm } from './settings-form';

export const metadata: Metadata = {
  title: 'Settings — VLDD Admin',
};

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-line pb-4">
        <div className="eyebrow">CONFIGURATION</div>
        <h1 className="font-display text-[26px] font-bold text-ink mt-1">
          Website &amp; UPI Settings
        </h1>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
