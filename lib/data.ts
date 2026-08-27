import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { NotePublic, Batch } from '@/types/database';
import { BATCHES, FALLBACK_SETTINGS, BUNDLE_ID } from '@/lib/constants';

const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Realistic fallback seed notes for instant local preview
const FALLBACK_NOTES: (NotePublic & { pdf_password?: string; file_path?: string })[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    batch_id: 'entrance',
    tier: 'free',
    title: 'Entrance Biology Sample Chapter (Cell Biology & Genetics)',
    description: 'Cell structure, cell division, aur basic genetics ke important points with diagrams.',
    subject: 'Biology',
    language: 'Hindi',
    pages: 22,
    file_size: 4404019,
    price_paise: 0,
    sort_order: 1,
    is_published: true,
    created_at: '2026-08-20T10:00:00Z',
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    batch_id: 'entrance',
    tier: 'free',
    title: 'Entrance Chemistry Formulas & Quick Revision Sheet',
    description: 'Organic chemistry reactions aur inorganic formulas ki quick revision sheet.',
    subject: 'Chemistry',
    language: 'Hindi',
    pages: 16,
    file_size: 2936012,
    price_paise: 0,
    sort_order: 2,
    is_published: true,
    created_at: '2026-08-20T11:00:00Z',
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    batch_id: 'entrance',
    tier: 'paid',
    title: 'Entrance Complete Notes (Biology + Chemistry + GK)',
    description: 'Entrance exam ka complete syllabus concise notes me. High yield topics covered.',
    subject: 'Complete Syllabus',
    language: 'Hindi',
    pages: 190,
    file_size: 40370176,
    price_paise: 9900,
    sort_order: 3,
    is_published: true,
    created_at: '2026-08-20T12:00:00Z',
    pdf_password: 'ENTRANCE2026',
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    batch_id: 'entrance',
    tier: 'paid',
    title: 'Entrance 10-Year Solved Question Papers + Mock Tests',
    description: 'Pichle 10 saal ke entrance papers detailed explanation ke saath.',
    subject: 'Question Bank',
    language: 'Hindi',
    pages: 240,
    file_size: 48444211,
    price_paise: 9900,
    sort_order: 4,
    is_published: true,
    created_at: '2026-08-20T13:00:00Z',
    pdf_password: 'MOCKVLDD',
  },
  {
    id: '22222222-2222-2222-2222-222222222201',
    batch_id: 'year',
    tier: 'free',
    title: '1st Year — Anatomy Trial Chapter (Osteology & Arthrology)',
    description: 'Ruminant animals ke bones aur joints ke clear labelled diagrams aur notes.',
    subject: 'Anatomy',
    language: 'Hindi',
    pages: 28,
    file_size: 5872025,
    price_paise: 0,
    sort_order: 1,
    is_published: true,
    created_at: '2026-08-21T10:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    batch_id: 'year',
    tier: 'free',
    title: '2nd Year — Veterinary Pharmacology Drug Classification Chart',
    description: 'Antibiotics, NSAIDs, aur anthelmintics ki easy memorization chart.',
    subject: 'Pharmacology',
    language: 'Hindi',
    pages: 18,
    file_size: 3565158,
    price_paise: 0,
    sort_order: 2,
    is_published: true,
    created_at: '2026-08-21T11:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    batch_id: 'year',
    tier: 'paid',
    title: '1st Year Complete Notes (Anatomy + Physiology + LSS)',
    description: '1st year diploma ka pura syllabus topic-wise easy Hinglish language me.',
    subject: '1st Year Full',
    language: 'Hindi',
    pages: 320,
    file_size: 65116569,
    price_paise: 9900,
    sort_order: 3,
    is_published: true,
    created_at: '2026-08-21T12:00:00Z',
    pdf_password: 'YEAR1FULL',
  },
  {
    id: '22222222-2222-2222-2222-222222222204',
    batch_id: 'year',
    tier: 'paid',
    title: '2nd Year Full Notes + 5 Year Solved Question Bank',
    description: 'Medicine, Surgery, Gynecology, Pathology aur Pharmacology ke complete notes.',
    subject: '2nd Year Full',
    language: 'Hindi',
    pages: 380,
    file_size: 78433484,
    price_paise: 9900,
    sort_order: 4,
    is_published: true,
    created_at: '2026-08-21T13:00:00Z',
    pdf_password: 'YEAR2FULL',
  },
];

export const getBatches = cache(async (): Promise<Batch[]> => {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data } = await supabase.from('batches').select('*').eq('is_active', true).order('sort_order');
      if (data && (data as any[]).length > 0) return data as Batch[];
    } catch {}
  }

  return BATCHES.map((b, idx) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    sort_order: idx + 1,
    is_active: true,
  }));
});

export const getNotesByBatch = cache(async (batchId: string): Promise<NotePublic[]> => {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('notes_public')
        .select('*')
        .eq('batch_id', batchId)
        .order('sort_order');
      if (data && (data as any[]).length > 0) return data as NotePublic[];
    } catch {}
  }

  return FALLBACK_NOTES.filter((n) => n.batch_id === batchId && n.is_published);
});

export const getNoteById = cache(async (noteId: string): Promise<NotePublic | null> => {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data } = await supabase.from('notes_public').select('*').eq('id', noteId).single();
      if (data) return data as NotePublic;
    } catch {}
  }

  const match = FALLBACK_NOTES.find((n) => n.id === noteId);
  return match || null;
});

export const getUserUnlocks = cache(async (userId: string): Promise<string[]> => {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data } = await supabase.from('unlocks').select('*').eq('user_id', userId);
      if (data) return (data as any[]).map((u: any) => u.note_id as string);
    } catch {}
  }

  // Check local demo unlocks cookie if in demo mode
  try {
    const cookieStore = require('next/headers').cookies();
    const unlockedJson = cookieStore.get('vldd_unlocked_notes')?.value;
    if (unlockedJson) {
      return JSON.parse(unlockedJson);
    }
  } catch {}

  return [];
});

export const getSettings = cache(async (): Promise<Record<string, string>> => {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data } = await supabase.from('settings').select('*');
      if (data && (data as any[]).length > 0) {
        return (data as any[]).reduce((acc: Record<string, string>, cur: any) => ({ ...acc, [cur.key]: cur.value }), {});
      }
    } catch {}
  }

  return FALLBACK_SETTINGS;
});

/** Check if user has unlocked the bundle */
export const getBundleUnlockStatus = cache(async (userId: string): Promise<boolean> => {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('unlocks')
        .select('id')
        .eq('user_id', userId)
        .eq('note_id', BUNDLE_ID)
        .maybeSingle();
      return !!data;
    } catch {}
  }

  // Demo mode: check cookie
  try {
    const cookieStore = require('next/headers').cookies();
    const unlockedJson = cookieStore.get('vldd_unlocked_notes')?.value;
    if (unlockedJson) {
      const list: string[] = JSON.parse(unlockedJson);
      return list.includes(BUNDLE_ID);
    }
  } catch {}

  return false;
});

/** Get all paid notes (for bundle ZIP) */
export const getAllPaidNotes = cache(async (): Promise<NotePublic[]> => {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('notes_public')
        .select('*')
        .eq('tier', 'paid')
        .eq('is_published', true)
        .order('batch_id')
        .order('sort_order');
      if (data && (data as any[]).length > 0) return data as NotePublic[];
    } catch {}
  }

  return FALLBACK_NOTES.filter((n) => n.tier === 'paid' && n.is_published);
});

