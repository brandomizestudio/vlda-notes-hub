# Veteducation — VLDD Notes Hub

A Hindi-first study-notes platform for **VLDD** (Veterinary Livestock Development Diploma) students in India.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS + CSS Variables (Deep Veterinary Green `#0F6B5C` brand, Marigold `#E39A12` accent)
- **UI Primitives**: Radix UI / shadcn tokens
- **Typography**: Bricolage Grotesque (Display), Mukta (Body/Hindi), IBM Plex Mono (Codes & Prices)
- **Database & Storage**: Supabase Postgres & Private Storage Bucket (`notes`)
- **PDF Pipeline**: `pdf-lib` (Student Watermarking) & `qpdf` (AES-256 Encryption)

---

## 1. Local Setup

### Prerequisites
- Node.js 20+
- pnpm (`npm i -g pnpm`)
- qpdf (optional for local encryption, required for production)
  - **macOS**: `brew install qpdf`
  - **Ubuntu/Debian**: `sudo apt-get install -y qpdf`

### Installation
```bash
# Clone & install dependencies
pnpm install

# Start local development server
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Supabase Configuration

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard and run the following in order:
   - Run [`/supabase/schema.sql`](file:///Users/anmol/Documents/Navneet%20Gholu/supabase/schema.sql) (Tables, indexes, and views)
   - Run [`/supabase/policies.sql`](file:///Users/anmol/Documents/Navneet%20Gholu/supabase/policies.sql) (Row Level Security & private bucket rules)
   - Run [`/supabase/seed.sql`](file:///Users/anmol/Documents/Navneet%20Gholu/supabase/seed.sql) (Initial batches, notes, and settings)
3. Set your environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PDF_OWNER_SECRET=your-random-32-char-owner-password-secret
NEXT_PUBLIC_SITE_URL=https://your-production-url.com
```

---

## 3. Promoting an Admin Account

Admin accounts are **not** self-serve.
1. Register an account with your mobile number on `/register`.
2. In Supabase SQL editor, run:
```sql
update public.profiles
set role = 'admin'
where phone = '9876543210'; -- Replace with your registered 10-digit number
```
3. Visit `/admin` to access the management dashboard, notes upload, payment requests, students directory, and settings.

---

## 4. Changing UPI ID & WhatsApp Number

You can change the UPI ID and WhatsApp support number at any time without code changes:
- In the **Admin Panel** at `/admin/settings`, OR
- In Supabase SQL:
```sql
update public.settings set value = 'newupi@okaxis' where key = 'upi_id';
update public.settings set value = '919812345678' where key = 'whatsapp_number';
```

---

## 5. Deploying to Vercel

1. Push this repository to GitHub.
2. Import the project on [Vercel](https://vercel.com).
3. Add all environment variables from `.env.local` in Vercel project settings.
4. Deploy!
