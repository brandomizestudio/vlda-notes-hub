'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function saveSettingsAction(formData: {
  upi_id: string;
  whatsapp_number: string;
  site_notice: string;
  site_notice_active: string;
  bundle_password: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    const isSupabaseConfigured =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      const entries = Object.entries(formData);

      for (const [key, value] of entries) {
        await (supabase.from('settings') as any).upsert(
          { key, value },
          { onConflict: 'key' }
        );
      }
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('saveSettingsAction error:', err);
    return { success: false, error: err?.message || 'Settings update karne me error aaya' };
  }
}
