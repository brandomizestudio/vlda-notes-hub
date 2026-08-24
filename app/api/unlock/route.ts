import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getNoteById } from '@/lib/data';

export async function POST(request: NextRequest) {
  const { user, profile } = await getSession();

  if (!user || !profile) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { noteId, password } = body;

    if (!noteId || !password) {
      return NextResponse.json({ success: false, error: 'Note ID aur password required hai.' }, { status: 400 });
    }

    const cleanInputPassword = String(password).trim().toUpperCase();

    // Check if connected to Supabase
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (isSupabaseConfigured) {
      const supabaseAdmin = createAdminClient();

      const { data: noteData, error: noteError } = await supabaseAdmin
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .single();

      const note = noteData as any;

      if (noteError || !note) {
        return NextResponse.json({ success: false, error: 'Note nahi mila.' }, { status: 404 });
      }

      if (note.tier === 'free') {
        return NextResponse.json({ success: true, message: 'Free note already accessible.' });
      }

      if (note.pdf_password && note.pdf_password.toUpperCase() === cleanInputPassword) {
        // Insert into unlocks
        await (supabaseAdmin.from('unlocks') as any).upsert(
          {
            user_id: profile.id,
            note_id: note.id,
          },
          { onConflict: 'user_id,note_id' }
        );

        // Approve any pending payment request
        await (supabaseAdmin
          .from('payment_requests') as any)
          .update({ status: 'approved', decided_at: new Date().toISOString() })
          .eq('user_id', profile.id)
          .eq('note_id', note.id);

        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: 'Password galat hai.' }, { status: 400 });
      }
    }

    // Local / Demo verification fallback
    const note = await getNoteById(noteId);
    const validPasswords: Record<string, string> = {
      '11111111-1111-1111-1111-111111111103': 'ENTRANCE2026',
      '11111111-1111-1111-1111-111111111104': 'MOCKVLDD',
      '22222222-2222-2222-2222-222222222203': 'YEAR1FULL',
      '22222222-2222-2222-2222-222222222204': 'YEAR2FULL',
    };

    const expected = validPasswords[noteId] || 'VLDD2026';
    if (cleanInputPassword === expected || cleanInputPassword === 'VLDD8921') {
      // Store in demo cookie
      const cookieStore = cookies();
      const existing = cookieStore.get('vldd_unlocked_notes')?.value;
      const unlockedList: string[] = existing ? JSON.parse(existing) : [];
      if (!unlockedList.includes(noteId)) {
        unlockedList.push(noteId);
        cookieStore.set('vldd_unlocked_notes', JSON.stringify(unlockedList), {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Password galat hai.' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
