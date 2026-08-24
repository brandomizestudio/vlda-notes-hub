'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toaster';
import { UploadCloud, Key, Sparkles, ArrowLeft, FileText, Check } from 'lucide-react';
import Link from 'next/link';

export function NewNoteForm() {
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [batchId, setBatchId] = React.useState('entrance');
  const [tier, setTier] = React.useState<'free' | 'paid'>('paid');
  const [subject, setSubject] = React.useState('Biology');
  const [language, setLanguage] = React.useState('Hindi');
  const [priceRupees, setPriceRupees] = React.useState('299');
  const [pdfPassword, setPdfPassword] = React.useState('VLDD2026');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Generate 8-character uppercase alphanumeric password
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPdfPassword(result);
    toast('Naya password generate ho gaya!');
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
      } else {
        toast('Kripya sirf PDF file upload karein.');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate save or write note
    setTimeout(() => {
      setLoading(false);
      toast('Note safaltapoorvak publish ho gaya!');
      router.push('/admin/notes');
    }, 800);
  };

  const isFree = tier === 'free';

  return (
    <div className="max-w-[700px] mx-auto space-y-6 pb-16">
      <div>
        <Link
          href="/admin/notes"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-2 hover:text-brand transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Notes Directory</span>
        </Link>
        <div className="eyebrow">NEW STUDY MATERIAL</div>
        <h1 className="font-display text-[26px] font-bold text-ink mt-1">
          Naya Note Upload &amp; Add Karo
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-[16px] border border-line bg-card shadow-card space-y-6">
        {/* Title */}
        <Input
          label="Note Title"
          placeholder="Jaise: 1st Year Anatomy Chapter 2 (Myology)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-ink-2">
            Description / Chapter Summary
          </label>
          <textarea
            rows={3}
            className="w-full px-[13px] py-[11px] rounded-[10px] border border-line-2 bg-card text-ink text-[14.5px] font-body focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-accent"
            placeholder="Chapter ke important topics, diagrams, ya questions ka brief..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Batch & Tier Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-ink-2">Batch</label>
            <select
              className="w-full px-[13px] py-[11px] rounded-[10px] border border-line-2 bg-card text-ink text-[14.5px] font-body"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
            >
              <option value="entrance">VLDD Entrance Exam</option>
              <option value="year">VLDD 1st &amp; 2nd Year</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-ink-2">Section / Tier</label>
            <select
              className="w-full px-[13px] py-[11px] rounded-[10px] border border-line-2 bg-card text-ink text-[14.5px] font-body"
              value={tier}
              onChange={(e) => setTier(e.target.value as 'free' | 'paid')}
            >
              <option value="paid">Section 2 — Full Notes (Paid &amp; Password Protected)</option>
              <option value="free">Section 1 — Trial Notes (Free Download)</option>
            </select>
          </div>
        </div>

        {/* Subject & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Subject"
            placeholder="Anatomy, Pharmacology, Bio..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Input
            label="Language"
            placeholder="Hindi, English..."
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>

        {/* Price & Password (Disabled if free) */}
        {!isFree && (
          <div className="p-4 rounded-[12px] bg-card-2 border border-line space-y-4">
            <div className="eyebrow text-accent">PRICING &amp; PDF SECURITY</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Price in ₹ (Paise me auto-convert)"
                type="number"
                placeholder="299"
                value={priceRupees}
                onChange={(e) => setPriceRupees(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-ink-2">
                  PDF Password (8 char)
                </label>
                <div className="flex gap-2">
                  <Input
                    isPasswordMono
                    value={pdfPassword}
                    onChange={(e) => setPdfPassword(e.target.value.toUpperCase())}
                    required
                    placeholder="PASSWORD"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generatePassword}
                    className="shrink-0 gap-1 text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PDF File Upload Zone */}
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-ink-2">
            PDF File Upload (Max 50 MB)
          </label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="p-6 rounded-[12px] border-2 border-dashed border-line-2 bg-ground text-center hover:border-brand transition-colors cursor-pointer relative"
          >
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2 text-brand">
                <FileText className="w-8 h-8" />
                <div className="font-semibold text-ink text-sm">
                  {selectedFile.name}
                </div>
                <div className="font-mono text-xs text-ink-3">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-ink-3">
                <UploadCloud className="w-8 h-8 text-brand" />
                <div className="text-[14px] font-medium text-ink">
                  PDF yahan drag karein ya click karke choose karein
                </div>
                <div className="text-[12px] text-ink-3">
                  Sirf PDF format allow hai (upto 50 MB)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full font-bold text-[15px]"
          disabled={loading}
        >
          {loading ? 'Publishing...' : 'Note Save & Publish Karo'}
        </Button>
      </form>
    </div>
  );
}
