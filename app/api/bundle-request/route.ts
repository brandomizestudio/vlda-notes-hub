import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { BUNDLE_ID, BUNDLE_PRICE_PAISE } from '@/lib/constants';

export async function POST(request: NextRequest) {
  const { user, profile } = await getSession();

  if (!user || !profile) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { utr } = body;

    if (!utr || !utr.trim()) {
      return NextResponse.json({ success: false, error: 'UTR number required hai.' }, { status: 400 });
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (isSupabaseConfigured) {
      const supabaseAdmin = createAdminClient();

      // Check if request already exists
      const { data: existing } = await (supabaseAdmin.from('payment_requests') as any)
        .select('id, status')
        .eq('user_id', profile.id)
        .eq('note_id', BUNDLE_ID)
        .maybeSingle();

      if (existing && existing.status === 'pending') {
        return NextResponse.json({ success: true, message: 'Request already pending.' });
      }

      // Insert new payment request
      await (supabaseAdmin.from('payment_requests') as any).insert({
        user_id: profile.id,
        note_id: BUNDLE_ID,
        utr: utr.trim(),
        amount_paise: BUNDLE_PRICE_PAISE,
        status: 'pending',
      });
    }

    // Demo mode: just return success
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Bundle payment request error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
