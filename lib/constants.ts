export interface BatchDef {
  id: 'entrance' | 'year';
  slug: string;
  title: string;
  subtitle: string;
  bannerImage: string;
}

export const BATCHES: BatchDef[] = [
  {
    id: 'entrance',
    slug: 'entrance',
    title: 'VLDD Entrance Exam',
    subtitle: 'Physics, Chemistry, Biology aur General Aptitude ke syllabus-aligned complete notes.',
    bannerImage: '/img/batch-entrance.webp',
  },
  {
    id: 'year',
    slug: 'year',
    title: 'VLDD 1st & 2nd Year',
    subtitle: 'Diploma subjects ke topic-wise handwritten aur clear diagrams waale complete notes.',
    bannerImage: '/img/batch-year.webp',
  },
];

export const SECTION_COPY = {
  section1: {
    title: 'Section 1 — Trial notes',
    badge: 'FREE',
    note: 'Ye PDF sabhi logged-in students ke liye khuli hain. Padho, download karo, quality check karo.',
  },
  section2: {
    title: 'Section 2 — Full notes',
    badge: 'PAID',
    note: 'Payment ke baad password milta hai. Password daalte hi PDF khul jaayegi aur aap apne phone me download kar sakte ho.',
  },
};

export const FALLBACK_SETTINGS = {
  upi_id: 'vlddnotes@upi',
  whatsapp_number: '919876543210',
  site_notice: 'Naye batch ke notes upload ho rahe hain! Kisi bhi sahayata ke liye WhatsApp karein.',
  site_notice_active: 'true',
};
