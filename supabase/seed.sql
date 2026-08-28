-- =========================================================
-- VLDD NOTES HUB / VETEDUCATION — SEED DATA
-- =========================================================

-- 1. Seed Batches
insert into public.batches (id, title, subtitle, sort_order, is_active)
values
  (
    'entrance',
    'VLDD Entrance Exam',
    'Physics, Chemistry, Biology aur General Aptitude ke syllabus-aligned complete notes.',
    1,
    true
  ),
  (
    'year',
    'VLDD 1st & 2nd Year',
    'Anatomy, Physiology, Pharmacology, Medicine aur Solved Question Papers.',
    2,
    true
  )
on conflict (id) do update
set
  title = excluded.title,
  subtitle = excluded.subtitle,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- 2. Seed Notes (2 Free + 2 Paid per batch)
-- Note: file_path references keys in private 'notes' bucket. Dummy/placeholder keys used for seeding.
insert into public.notes (
  id, batch_id, tier, title, description, subject, language, pages, file_path, file_size, price_paise, pdf_password, sort_order, is_published
)
values
  -- Entrance Batch — Free Notes
  (
    '11111111-1111-1111-1111-111111111101',
    'entrance',
    'free',
    'Entrance Biology Sample Chapter (Cell Biology & Genetics)',
    'Cell structure, cell division, aur basic genetics ke important points with diagrams.',
    'Biology',
    'Hindi',
    22,
    'entrance/biology_sample_chapter.pdf',
    4404019,
    0,
    null,
    1,
    true
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    'entrance',
    'free',
    'Entrance Chemistry Formulas & Quick Revision Sheet',
    'Organic chemistry reactions aur inorganic formulas ki quick revision sheet.',
    'Chemistry',
    'Hindi',
    16,
    'entrance/chem_formula_sheet.pdf',
    2936012,
    0,
    null,
    2,
    true
  ),
  -- Entrance Batch — Paid Notes
  (
    '11111111-1111-1111-1111-111111111103',
    'entrance',
    'paid',
    'Entrance Complete Notes (Biology + Chemistry + GK)',
    'Entrance exam ka complete syllabus concise notes me. High yield topics covered.',
    'Complete Syllabus',
    'Hindi',
    190,
    'entrance/vldd_entrance_complete.pdf',
    40370176,
    9900, -- ₹99
    'ENTRANCE2026',
    3,
    true
  ),
  (
    '11111111-1111-1111-1111-111111111104',
    'entrance',
    'paid',
    'Entrance 10-Year Solved Question Papers + Mock Tests',
    'Pichle 10 saal ke entrance papers detailed explanation ke saath.',
    'Question Bank',
    'Hindi',
    240,
    'entrance/vldd_entrance_solved_papers.pdf',
    48444211,
    9900, -- ₹99
    'MOCKVLDD',
    4,
    true
  ),

  -- 1st & 2nd Year Batch — Free Notes
  (
    '22222222-2222-2222-2222-222222222201',
    'year',
    'free',
    '1st Year — Anatomy Trial Chapter (Osteology & Arthrology)',
    'Ruminant animals ke bones aur joints ke clear labelled diagrams aur notes.',
    'Anatomy',
    'Hindi',
    28,
    'year/anatomy_trial_osteology.pdf',
    5872025,
    0,
    null,
    1,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    'year',
    'free',
    '2nd Year — Veterinary Pharmacology Drug Classification Chart',
    'Antibiotics, NSAIDs, aur anthelmintics ki easy memorization chart.',
    'Pharmacology',
    'Hindi',
    18,
    'year/pharmacology_classification.pdf',
    3565158,
    0,
    null,
    2,
    true
  ),
  -- 1st & 2nd Year Batch — Paid Notes
  (
    '22222222-2222-2222-2222-222222222203',
    'year',
    'paid',
    '1st Year Complete Notes (Anatomy + Physiology + LSS)',
    '1st year diploma ka pura syllabus topic-wise easy Hinglish language me.',
    '1st Year Full',
    'Hindi',
    320,
    'year/vldd_1st_year_complete.pdf',
    65116569,
    9900, -- ₹99
    'YEAR1FULL',
    3,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222204',
    'year',
    'paid',
    '2nd Year Full Notes + 5 Year Solved Question Bank',
    'Medicine, Surgery, Gynecology, Pathology aur Pharmacology ke complete notes.',
    '2nd Year Full',
    'Hindi',
    380,
    'year/vldd_2nd_year_complete.pdf',
    78433484,
    9900, -- ₹99
    'YEAR2FULL',
    4,
    true
  )
on conflict (id) do update
set
  batch_id = excluded.batch_id,
  tier = excluded.tier,
  title = excluded.title,
  description = excluded.description,
  subject = excluded.subject,
  language = excluded.language,
  pages = excluded.pages,
  file_path = excluded.file_path,
  file_size = excluded.file_size,
  price_paise = excluded.price_paise,
  pdf_password = excluded.pdf_password,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;

-- 3. Seed Settings
insert into public.settings (key, value)
values
  ('upi_id', 'inavneetbhadrecha@okhdfcbank'),
  ('whatsapp_number', '918571041222'),
  ('site_notice', 'Naye batch ke notes upload ho rahe hain! Kisi bhi sahayata ke liye WhatsApp karein.'),
  ('site_notice_active', 'true')
on conflict (key) do update
set value = excluded.value;
