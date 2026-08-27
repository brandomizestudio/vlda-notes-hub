import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSettings } from '@/lib/data';
import { BUNDLE_ID, FALLBACK_SETTINGS } from '@/lib/constants';

export async function POST(request: NextRequest) {
  const { user, profile } = await getSession();

  if (!user || !profile) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password required hai.' }, { status: 400 });
    }

    const cleanInput = String(password).trim().toUpperCase();

    // Fetch bundle password from settings
    const settings = await getSettings();
    const bundlePassword = (settings.bundle_password || FALLBACK_SETTINGS.bundle_password).toUpperCase();

    if (cleanInput !== bundlePassword) {
      return NextResponse.json({ success: false, error: 'Password galat hai.' }, { status: 400 });
    }

    // Supabase mode: insert into unlocks using BUNDLE_ID
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (isSupabaseConfigured) {
      const supabaseAdmin = createAdminClient();

      // Upsert bundle unlock row
      await (supabaseAdmin.from('unlocks') as any).upsert(
        { user_id: profile.id, note_id: BUNDLE_ID },
        { onConflict: 'user_id,note_id' }
      );

      // Mark all pending bundle payment requests as approved
      await (supabaseAdmin.from('payment_requests') as any)
        .update({ status: 'approved', decided_at: new Date().toISOString() })
        .eq('user_id', profile.id)
        .eq('note_id', BUNDLE_ID)
        .eq('status', 'pending');
    } else {
      // Demo mode: store in cookie
      const cookieStore = cookies();
      const existing = cookieStore.get('vldd_unlocked_notes')?.value;
      const unlockedList: string[] = existing ? JSON.parse(existing) : [];
      if (!unlockedList.includes(BUNDLE_ID)) {
        unlockedList.push(BUNDLE_ID);
        cookieStore.set('vldd_unlocked_notes', JSON.stringify(unlockedList), {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Bundle unlock error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
