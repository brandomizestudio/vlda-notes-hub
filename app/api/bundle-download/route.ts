import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getBundleUnlockStatus, getAllPaidNotes } from '@/lib/data';
import { createAdminClient } from '@/lib/supabase/admin';
import { watermarkPdf, createSamplePdf } from '@/lib/pdf';
import JSZip from 'jszip';

export async function GET(request: NextRequest) {
  const { user, profile } = await getSession();

  // Auth check
  if (!user || !profile) {
    return new NextResponse('Unauthorized: Login required', { status: 401 });
  }

  // Bundle unlock check
  const isBundleUnlocked = await getBundleUnlockStatus(profile.id);
  if (!isBundleUnlocked) {
    return new NextResponse('Forbidden: Bundle nahi khula hai. Password verify karke bundle unlock karo.', {
      status: 403,
    });
  }

  try {
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const paidNotes = await getAllPaidNotes();
    const zip = new JSZip();

    // Process each paid note — fetch + watermark + add to ZIP
    await Promise.all(
      paidNotes.map(async (note) => {
        let rawPdfBytes: Uint8Array;

        if (isSupabaseConfigured) {
          try {
            const supabaseAdmin = createAdminClient();

            // Get actual file_path from full notes table
            const { data: noteData } = await supabaseAdmin
              .from('notes')
              .select('file_path')
              .eq('id', note.id)
              .single();

            const filePath = (noteData as any)?.file_path;

            if (filePath) {
              const { data: fileData, error } = await supabaseAdmin.storage
                .from('notes')
                .download(filePath);

              if (!error && fileData) {
                const buffer = await fileData.arrayBuffer();
                rawPdfBytes = new Uint8Array(buffer);
              } else {
                rawPdfBytes = await createSamplePdf(note.title, note.pages);
              }
            } else {
              rawPdfBytes = await createSamplePdf(note.title, note.pages);
            }
          } catch {
            rawPdfBytes = await createSamplePdf(note.title, note.pages);
          }
        } else {
          // Demo mode
          rawPdfBytes = await createSamplePdf(note.title, note.pages);
        }

        // Watermark with student's name and phone
        const watermarkedBytes = await watermarkPdf(
          rawPdfBytes,
          profile.name || 'Student',
          profile.phone || '9876543210'
        );

        // Create safe filename from note title
        const safeFileName = note.title
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .substring(0, 60);

        const folderName = note.batch_id === 'entrance' ? 'Entrance Exam' : '1st & 2nd Year';
        zip.folder(folderName)?.file(`${safeFileName}.pdf`, watermarkedBytes);
      })
    );

    // Add a README inside the ZIP
    const readmeTxt = `VLDD Notes Hub — Complete Bundle
================================
Student: ${profile.name}
Phone: ${profile.phone}
Downloaded: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

IMPORTANT: Ye notes sirf aapke liye hain.
Aapka naam aur phone number har page par watermark me hai.
Kisi ke saath share mat karna — aapka account ban ho sakta hai.

For support: WhatsApp karo ya website par contact karein.
`;
    zip.file('README.txt', readmeTxt);

    const zipBuffer = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });

    // Log the download
    if (isSupabaseConfigured) {
      try {
        const supabaseAdmin = createAdminClient();
        const { BUNDLE_ID } = await import('@/lib/constants');
        await (supabaseAdmin.from('download_log') as any).insert({
          user_id: profile.id,
          note_id: BUNDLE_ID,
          ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
        });
      } catch {}
    }

    return new NextResponse(zipBuffer.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="vldd-complete-bundle-${profile.phone}.zip"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (err) {
    console.error('Bundle ZIP error:', err);
    return new NextResponse('ZIP generation error. Please try again.', { status: 500 });
  }
}
