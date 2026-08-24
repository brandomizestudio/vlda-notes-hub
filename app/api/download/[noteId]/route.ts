import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getNoteById, getUserUnlocks } from '@/lib/data';
import { createAdminClient } from '@/lib/supabase/admin';
import { watermarkPdf, createSamplePdf, encryptWithQpdf } from '@/lib/pdf';

export async function GET(
  request: NextRequest,
  { params }: { params: { noteId: string } }
) {
  const { noteId } = params;
  const { user, profile } = await getSession();

  // 1. Session check
  if (!user || !profile) {
    return new NextResponse('Unauthorized: Login required', { status: 401 });
  }

  // 2. Note lookup
  const note = await getNoteById(noteId);
  if (!note || !note.is_published) {
    return new NextResponse('Note not found or unpublished', { status: 404 });
  }

  // 3. Entitlement check: tier = 'free' OR unlocked
  const isFree = note.tier === 'free';
  const unlockedIds = await getUserUnlocks(profile.id);
  const isUnlocked = unlockedIds.includes(note.id);

  if (!isFree && !isUnlocked) {
    return new NextResponse('Forbidden: Note is locked. Payment & password verification required.', {
      status: 403,
    });
  }

  try {
    let rawPdfBytes: Uint8Array;

    // Check if real file exists in Supabase private bucket 'notes'
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (isSupabaseConfigured) {
      const supabaseAdmin = createAdminClient();
      const { data: noteData } = await supabaseAdmin
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .single();

      const noteRow = noteData as any;

      if (noteRow?.file_path) {
        const { data: fileData, error: fileError } = await supabaseAdmin.storage
          .from('notes')
          .download(noteRow.file_path);

        if (!fileError && fileData) {
          const buffer = await fileData.arrayBuffer();
          rawPdfBytes = new Uint8Array(buffer);
        } else {
          rawPdfBytes = await createSamplePdf(note.title, note.pages);
        }
      } else {
        rawPdfBytes = await createSamplePdf(note.title, note.pages);
      }
    } else {
      // Local demo mode sample PDF
      rawPdfBytes = await createSamplePdf(note.title, note.pages);
    }

    // 4. Watermark with student name and phone
    const watermarkedBytes = await watermarkPdf(
      rawPdfBytes,
      profile.name || 'Student',
      profile.phone || '9876543210'
    );

    // 5. Encrypt with qpdf if paid
    let finalBytes = watermarkedBytes;
    if (!isFree) {
      const pdfPassword = (note as any).pdf_password || 'VLDD2026';
      finalBytes = await encryptWithQpdf(watermarkedBytes, pdfPassword);
    }

    // 6. Log download
    if (isSupabaseConfigured) {
      try {
        const supabaseAdmin = createAdminClient();
        await (supabaseAdmin.from('download_log') as any).insert({
          user_id: profile.id,
          note_id: note.id,
          ip: request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1',
        });
      } catch {}
    }

    const slugifiedTitle = note.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return new NextResponse(Buffer.from(finalBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${slugifiedTitle}.pdf"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (err) {
    console.error('PDF delivery error:', err);
    return new NextResponse('PDF generation or processing error', { status: 500 });
  }
}
