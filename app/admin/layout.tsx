import * as React from 'react';
import { requireAdmin, getSession } from '@/lib/auth';
import { AdminHeader } from '@/components/admin-header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In production, requireAdmin() throws 404 for non-admins
  // In local preview, getSession() or fallback
  const { profile } = await getSession();
  if (process.env.NODE_ENV === 'production' && profile?.role !== 'admin') {
    await requireAdmin();
  }

  // Pending count for payment requests badge
  const pendingCount = 1; // Default or queried count

  return (
    <div className="min-h-screen bg-ground pb-24">
      <AdminHeader pendingCount={pendingCount} />
      <main className="max-w-[1000px] mx-auto px-4 pt-6">
        {children}
      </main>
    </div>
  );
}
