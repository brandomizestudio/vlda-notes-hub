import { Metadata } from 'next';
import { RequestsTable } from '@/components/admin/requests-table';

export const metadata: Metadata = {
  title: 'Payment Requests — VLDD Admin',
};

export default function AdminRequestsPage() {
  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-line pb-4">
        <div className="eyebrow text-lock">VERIFICATION &amp; ACCESS</div>
        <h1 className="font-display text-[26px] font-bold text-ink mt-1">
          Payment Requests &amp; Password Dispatch
        </h1>
        <p className="text-[14px] text-ink-3 mt-0.5">
          Student ka UTR number bank statement se match karke WhatsApp par password release karein.
        </p>
      </div>

      <RequestsTable />
    </div>
  );
}
