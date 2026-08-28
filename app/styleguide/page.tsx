'use client';

import * as React from 'react';
import { Lock, FileText, Download, Check, AlertCircle, Info, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NoteCard } from '@/components/note-card';
import { SectionHeader } from '@/components/section-header';
import { BatchTabs } from '@/components/batch-tabs';
import { EmptyState } from '@/components/empty-state';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toaster';

export default function StyleguidePage() {
  const [activeBatch, setActiveBatch] = React.useState('entrance');
  const [samplePassword, setSamplePassword] = React.useState('VLDD8921');

  const batches = [
    { id: 'entrance', title: 'VLDD Entrance Exam' },
    { id: 'year', title: 'VLDD 1st & 2nd Year' },
  ];

  return (
    <div className="min-h-screen bg-ground pb-24">
      {/* Topbar / Header */}
      <header className="sticky top-0 z-40 border-b border-line bg-ground/85 backdrop-blur-md">
        <div className="max-w-[1000px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-brand flex items-center justify-center text-white font-display font-bold text-lg">
              V
            </div>
            <div>
              <div className="font-display font-bold text-[17px] text-ink leading-tight">
                VLDD Notes Hub
              </div>
              <div className="text-[11px] text-ink-3">Design System & Styleguide</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-[13px] text-ink-2 font-mono">
              Phase 1 — Foundation
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content container */}
      <main className="max-w-[1000px] mx-auto px-4 pt-8 space-y-16">
        {/* Intro */}
        <section className="space-y-3">
          <div className="eyebrow">DESIGN SYSTEM SPECIFICATION</div>
          <h1 className="font-display text-[28px] font-bold tracking-[-0.02em] text-ink">
            Foundation & Token Verification
          </h1>
          <p className="text-[16px] leading-[1.6] text-ink-2 max-w-[65ch]">
            Visual direction: <strong className="text-ink">Government-exam serious, not startup-flashy</strong>.
            Deep veterinary green brand color, marigold accent, clear typography hierarchy, and zero gradients.
          </p>
        </section>

        {/* 1. Color Palette */}
        <section className="space-y-6">
          <div className="border-b border-line pb-2">
            <h2 className="font-display text-[22px] font-bold text-ink">
              1. Color Tokens (Section 4.1)
            </h2>
            <p className="text-[14px] text-ink-3">
              Mapped to CSS variables on <code className="text-xs bg-card-2 px-1.5 py-0.5 rounded">:root</code> and <code className="text-xs bg-card-2 px-1.5 py-0.5 rounded">[data-theme=&quot;dark&quot;]</code>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { name: '--ground', label: 'Ground (Bg)', hex: '#F3F6F1 / #0C1512', bg: 'bg-ground', border: true },
              { name: '--card', label: 'Card Surface', hex: '#FFFFFF / #15211D', bg: 'bg-card', border: true },
              { name: '--card-2', label: 'Card Inset / Stripe', hex: '#EDF1EA / #1D2C27', bg: 'bg-card-2', border: true },
              { name: '--ink', label: 'Ink (Primary Text)', hex: '#12211C / #E7EEE9', bg: 'bg-ink', text: 'text-ground' },
              { name: '--ink-2', label: 'Ink 2 (Secondary)', hex: '#41544C / #A9BAB2', bg: 'bg-ink-2', text: 'text-ground' },
              { name: '--ink-3', label: 'Ink 3 (Muted/Meta)', hex: '#76877F / #7C8D85', bg: 'bg-ink-3', text: 'text-ground' },
              { name: '--line', label: 'Line (Hairline)', hex: '#DCE3DA / #26352F', bg: 'bg-line' },
              { name: '--line-2', label: 'Line 2 (Inputs)', hex: '#C8D2C5 / #334741', bg: 'bg-line-2' },
              { name: '--brand', label: 'Brand (Deep Green)', hex: '#0F6B5C / #4CBBA5', bg: 'bg-brand', text: 'text-white' },
              { name: '--brand-soft', label: 'Brand Soft', hex: '#E2EFEB / #13312B', bg: 'bg-brand-soft', text: 'text-brand' },
              { name: '--accent', label: 'Accent (Marigold)', hex: '#E39A12 / #F0AE33', bg: 'bg-accent', text: 'text-accent-ink' },
              { name: '--accent-ink', label: 'Accent Ink', hex: '#3D2A05 / #2A1D04', bg: 'bg-accent-ink', text: 'text-white' },
              { name: '--lock', label: 'Lock / Red', hex: '#B23F2C / #E4785F', bg: 'bg-lock', text: 'text-white' },
              { name: '--lock-soft', label: 'Lock Soft', hex: '#F8E7E3 / #33201B', bg: 'bg-lock-soft', text: 'text-lock' },
              { name: '--ok', label: 'OK / Success', hex: '#0F6B5C / #4CBBA5', bg: 'bg-ok', text: 'text-white' },
            ].map((token) => (
              <div
                key={token.name}
                className="p-3 rounded-[10px] border border-line bg-card flex flex-col justify-between space-y-3"
              >
                <div
                  className={`h-12 w-full rounded-[6px] ${token.bg} ${token.border ? 'border border-line-2' : ''} flex items-center justify-center ${token.text || 'text-ink'} text-xs font-mono font-semibold`}
                >
                  {token.name}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-ink leading-tight">
                    {token.label}
                  </div>
                  <div className="text-[11px] font-mono text-ink-3 mt-0.5">
                    {token.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section className="space-y-6">
          <div className="border-b border-line pb-2">
            <h2 className="font-display text-[22px] font-bold text-ink">
              2. Typography Scale (Section 4.2)
            </h2>
            <p className="text-[14px] text-ink-3">
              Bricolage Grotesque (Display), Mukta (Body/Devanagari), IBM Plex Mono (Numerics & Codes)
            </p>
          </div>

          <div className="space-y-6 p-6 rounded-[14px] border border-line bg-card">
            <div className="border-b border-line/60 pb-4">
              <div className="eyebrow mb-1">display-1 — clamp(30px, 5.2vw, 46px) / 1.10 / 800</div>
              <div className="font-display text-[32px] sm:text-[42px] font-extrabold leading-[1.10] tracking-[-0.02em] text-ink">
                Notes jo exam me chalte hain.
              </div>
            </div>

            <div className="border-b border-line/60 pb-4">
              <div className="eyebrow mb-1">h1 — 28px / 1.15 / 700 / -0.02em</div>
              <h1 className="font-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-ink m-0">
                VLDD 1st & 2nd Year Complete Study Notes
              </h1>
            </div>

            <div className="border-b border-line/60 pb-4">
              <div className="eyebrow mb-1">h2 — 22px / 1.2 / 700 / -0.02em</div>
              <h2 className="font-display text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-ink m-0">
                Section 1 — Trial notes (Free PDF)
              </h2>
            </div>

            <div className="border-b border-line/60 pb-4">
              <div className="eyebrow mb-1">h3 — 16.5px / 1.3 / 700</div>
              <h3 className="font-display text-[16.5px] font-bold leading-[1.3] text-ink m-0">
                Veterinary Anatomy & Histology — Chapter 1 Bones & Skeleton
              </h3>
            </div>

            <div className="border-b border-line/60 pb-4">
              <div className="eyebrow mb-1">body — 16px / 1.6 / 400</div>
              <p className="text-[16px] leading-[1.6] text-ink m-0">
                Do batch, ek jagah. Trial PDF sabke liye khuli hai — full notes password se open hote hain.
                Aap WhatsApp par UTR bhej sakte hain aur password turant mil jayega.
              </p>
            </div>

            <div className="border-b border-line/60 pb-4">
              <div className="eyebrow mb-1">body-sm — 14px / 1.55 / 400</div>
              <p className="text-[14px] leading-[1.55] text-ink-3 m-0">
                Har page par aapka naam aur number watermark me hai — PDF kisi ko forward mat karna.
              </p>
            </div>

            <div className="border-b border-line/60 pb-4">
              <div className="eyebrow mb-1">meta — 12.5px / 1.4 / 400</div>
              <div className="text-[12.5px] leading-[1.4] text-ink-3">
                48 pages · Hindi · 12.4 MB · Updated 24 Aug 2026
              </div>
            </div>

            <div>
              <div className="eyebrow mb-1">mono & tabular-nums</div>
              <div className="font-mono text-[15px] font-semibold text-ink space-x-4 tabular-nums">
                <span>₹299</span>
                <span>•</span>
                <span>+91 98765 43210</span>
                <span>•</span>
                <span>UTR: 423891029384</span>
                <span>•</span>
                <span>PASS: VLDD8921</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Buttons */}
        <section className="space-y-6">
          <div className="border-b border-line pb-2">
            <h2 className="font-display text-[22px] font-bold text-ink">
              3. Buttons (Section 4.4)
            </h2>
            <p className="text-[14px] text-ink-3">
              Primary (Accent), Brand (Deep Green), Ghost, Small, Minimum 44px touch target on mobile
            </p>
          </div>

          <div className="p-6 rounded-[14px] border border-line bg-card space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">
                Unlock karo (Primary)
              </Button>
              <Button variant="brand">
                PDF kholo (Brand)
              </Button>
              <Button variant="ghost">
                Copy UPI ID (Ghost)
              </Button>
              <Button variant="primary" disabled>
                Disabled Button
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="sm">
                Small Primary
              </Button>
              <Button variant="brand" size="sm">
                Small Brand
              </Button>
              <Button variant="ghost" size="sm">
                Small Ghost
              </Button>
              <Button variant="brand" size="sm" className="gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Download karo
              </Button>
              <Button variant="primary" size="sm" className="gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Unlock karo
              </Button>
            </div>
          </div>
        </section>

        {/* 4. Form Inputs & Mono Password */}
        <section className="space-y-6">
          <div className="border-b border-line pb-2">
            <h2 className="font-display text-[22px] font-bold text-ink">
              4. Inputs & Password Box (Section 4.4)
            </h2>
            <p className="text-[14px] text-ink-3">
              10px radius, 2.5px accent focus outline, special mono password input variant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-[14px] border border-line bg-card">
            <div className="space-y-4">
              <Input
                label="Poora naam"
                placeholder="Jaise: Rahul Sharma"
                helperText="Apna official naam daalo jo watermark me aayega"
              />

              <Input
                label="Mobile number"
                type="tel"
                placeholder="10 digit ka number"
                maxLength={10}
              />

              <Input
                label="Input with Error"
                defaultValue="9876"
                error="10 digit ka mobile number daalo."
              />
            </div>

            <div className="space-y-4 p-5 rounded-[12px] bg-card-2 border border-line">
              <div className="eyebrow">PASSWORD VERIFICATION FIELD</div>
              <Input
                label="Password mil gaya? Yahan daalo"
                isPasswordMono
                value={samplePassword}
                onChange={(e) => setSamplePassword(e.target.value.toUpperCase())}
                placeholder="8 CHAR PASSWORD"
                maxLength={12}
                helperText="Password case-sensitive hai — jaisa WhatsApp par mila waisa hi daalo"
              />
              <Button
                variant="primary"
                className="w-full"
                onClick={() => toast('Unlock ho gaya — PDF khul rahi hai.')}
              >
                Unlock & PDF kholo
              </Button>
            </div>
          </div>
        </section>

        {/* 5. Note Cards */}
        <section className="space-y-6">
          <div className="border-b border-line pb-2">
            <h2 className="font-display text-[22px] font-bold text-ink">
              5. NoteCard Component (Section 4.4)
            </h2>
            <p className="text-[14px] text-ink-3">
              3px vertical left stripe (green for free/unlocked, red for locked), meta row, action row
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Card 1: Free */}
            <NoteCard
              id="free-demo"
              tier="free"
              title="1st Year — Anatomy Trial Chapter (Bones & Joints)"
              pages={24}
              language="Hindi"
              fileSizeBytes={4820000}
              onActionClick={() => toast('Trial PDF open ho rahi hai...')}
            />

            {/* Card 2: Locked Paid */}
            <NoteCard
              id="paid-locked-demo"
              tier="paid"
              isUnlocked={false}
              pricePaise={29900}
              title="VLDD Entrance Complete Notes (Biology + Chemistry + GK)"
              pages={180}
              language="Hindi"
              fileSizeBytes={36700000}
              onActionClick={() => toast('Payment & Unlock dialog open ho raha hai...')}
            />

            {/* Card 3: Unlocked Paid */}
            <NoteCard
              id="paid-unlocked-demo"
              tier="paid"
              isUnlocked={true}
              pricePaise={49900}
              title="2nd Year Full Subject Notes + 5 Year Solved Question Bank"
              pages={310}
              language="Hindi"
              fileSizeBytes={64200000}
              onActionClick={() => toast('Encrypted & Watermarked PDF download ho rahi hai...')}
            />
          </div>
        </section>

        {/* 6. Section Headers & Batch Pills */}
        <section className="space-y-6">
          <div className="border-b border-line pb-2">
            <h2 className="font-display text-[22px] font-bold text-ink">
              6. Section Headers & Batch Tabs
            </h2>
            <p className="text-[14px] text-ink-3">
              Batch pill selector and SectionHeader with badge & Hinglish note
            </p>
          </div>

          <div className="p-6 rounded-[14px] border border-line bg-card space-y-8">
            <div>
              <div className="eyebrow mb-2">BATCH PILL ROW (SECTION 10.2)</div>
              <BatchTabs
                batches={batches}
                activeId={activeBatch}
                onSelect={(id) => setActiveBatch(id)}
              />
            </div>

            <div className="border-t border-line pt-6 space-y-6">
              <SectionHeader
                title="Section 1 — Trial notes"
                badgeText="FREE"
                badgeVariant="free"
                description="Ye PDF sabhi logged-in students ke liye khuli hain. Padho, download karo, quality check karo."
              />

              <SectionHeader
                title="Section 2 — Full notes"
                badgeText="PAID"
                badgeVariant="paid"
                description="Payment ke baad password milta hai. Password daalte hi PDF khul jaayegi aur aap apne phone me download kar sakte ho."
              />
            </div>
          </div>
        </section>

        {/* 7. Empty State Box */}
        <section className="space-y-6">
          <div className="border-b border-line pb-2">
            <h2 className="font-display text-[22px] font-bold text-ink">
              7. Empty State Component
            </h2>
            <p className="text-[14px] text-ink-3">
              Dashed border box with centered message and prompt
            </p>
          </div>

          <EmptyState
            imageSrc="/img/empty-notes.png"
            title="Koi note nahi mila"
            message="Is batch me abhi koi note nahi hai. Jaldi aa raha hai."
            action={
              <Button variant="ghost" size="sm" onClick={() => toast('Sabhi notes reload ho gaye')}>
                Refresh karo
              </Button>
            }
          />
        </section>

        {/* 8. Admin Table Sample */}
        <section className="space-y-6">
          <div className="border-b border-line pb-2">
            <h2 className="font-display text-[22px] font-bold text-ink">
              8. Admin Table (Section 4.4 & Section 8)
            </h2>
            <p className="text-[14px] text-ink-3">
              Eyebrow th, tabular numbers, status badge, action buttons
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STUDENT</TableHead>
                <TableHead>NUMBER</TableHead>
                <TableHead className="wrap">NOTE</TableHead>
                <TableHead>UTR</TableHead>
                <TableHead>AMOUNT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Vikas Godara</TableCell>
                <TableCell className="font-mono text-ink-2">9812345678</TableCell>
                <TableCell className="wrap font-medium">Entrance Complete Notes (Bio+Chem)</TableCell>
                <TableCell className="font-mono text-xs">428901928312</TableCell>
                <TableCell className="font-mono font-semibold">₹299</TableCell>
                <TableCell>
                  <Badge variant="paid">Pending</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="brand"
                    size="sm"
                    onClick={() => toast('Password WhatsApp par bhej diya!')}
                  >
                    Password bhejo
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Pooja Rani</TableCell>
                <TableCell className="font-mono text-ink-2">9467812345</TableCell>
                <TableCell className="wrap font-medium">1st Year Pharmacology Full</TableCell>
                <TableCell className="font-mono text-xs">428819283719</TableCell>
                <TableCell className="font-mono font-semibold">₹349</TableCell>
                <TableCell>
                  <Badge variant="free">Approved</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-xs font-mono text-ink-3">Unlocked</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>

        {/* 9. Interactive Dialog & Toast Trigger */}
        <section className="space-y-6">
          <div className="border-b border-line pb-2">
            <h2 className="font-display text-[22px] font-bold text-ink">
              9. Dialog & Toast Notifications
            </h2>
            <p className="text-[14px] text-ink-3">
              Dialog with 18px radius, scrim overlay, and custom close button; Toast bottom-center
            </p>
          </div>

          <div className="p-6 rounded-[14px] border border-line bg-card flex flex-wrap gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="primary">Dialog Modal Kholo</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <div className="eyebrow text-accent">PAYMENT & PASSWORD</div>
                  <DialogTitle>VLDD Entrance Complete Notes</DialogTitle>
                  <DialogDescription>
                    Payment verify hote hi aapka password generate ho jayega.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-4 rounded-[12px] bg-card-2 border border-line space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-ink-3">Amount:</span>
                    <span className="font-mono font-bold text-lg text-ink">₹299</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-ink-3">UPI ID:</span>
                    <span className="font-mono text-xs text-ink-2 font-semibold">inavneetbhadrecha@okhdfcbank</span>
                  </div>
                </div>
                <Button
                  variant="brand"
                  className="w-full"
                  onClick={() => toast('Request bhej di. Password WhatsApp par aayega.')}
                >
                  Payment request bhejo
                </Button>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              onClick={() => toast('Request bhej di. Password WhatsApp par aayega.')}
            >
              Test Toast 1 (Payment Request)
            </Button>

            <Button
              variant="brand"
              onClick={() => toast('Unlock ho gaya — PDF khul rahi hai.')}
            >
              Test Toast 2 (Unlock Success)
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
