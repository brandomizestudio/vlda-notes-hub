import { Metadata } from 'next';
import Image from 'next/image';
import { getSettings } from '@/lib/data';
import { FALLBACK_SETTINGS } from '@/lib/constants';
import { HelpCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Help & FAQ — VLDD Notes Hub',
  description: 'Payment, password aur PDF download se jude sabhi sawalon ke jawab.',
};

export default async function HelpPage() {
  const settings = await getSettings();
  const whatsappNumber = settings.whatsapp_number || FALLBACK_SETTINGS.whatsapp_number;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Namaste, mujhe VLDD Notes Hub par madad chahiye.'
  )}`;

  const faqs = [
    {
      q: 'Payment kaise karu?',
      a: `Aap note ke 'Unlock karo' button par click karke QR code scan kar sakte hain ya UPI ID par pay kar sakte hain. Payment ke baad Google Pay / PhonePe se 12-digit UTR number note ke form me submit karein.`,
    },
    {
      q: 'Password kitni der me milega?',
      a: `UTR submit karne ke baad hum payment verify karke aapke WhatsApp number par password bhej dete hain — aam taur par 2-4 ghante ke andar. Urgent hone par aap direct WhatsApp par receipt bhej sakte hain.`,
    },
    {
      q: 'PDF nahi khul rahi, kya karu?',
      a: `Kripya dhyan dein ki PDF password case-sensitive hota hai (bade/chhote akshar). Jaisa password aapko WhatsApp par mila hai, use bina space ke waisa hi copy-paste karein. Agar phone me Adobe Acrobat ya Google Drive viewer hai to usme password enter karein.`,
    },
    {
      q: 'Paise kat gaye par password nahi mila?',
      a: `Chinta mat karein! Apna payment screenshot aur UTR number direct hamare WhatsApp par bhej dijiye, hum turant manually verify karke password release kar denge.`,
    },
    {
      q: 'Ek password kitne phone me chalega?',
      a: `Aapka password aapke personal study ke liye hai. PDF file password-protected hoti hai aur har page par aapka watermark hota hai. Aap ise apne kisi bhi device me khol sakte hain.`,
    },
    {
      q: 'Refund milta hai?',
      a: `Kyunki digital notes instantly unlock ho jaate hain aur downloadable hain, isliye payment ke baad refund nahi hota. Aap pehle Section 1 me 'Trial notes' free padh ke quality check kar sakte hain.`,
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header with pay-steps illustration #7 */}
      <div className="space-y-4">
        <div className="eyebrow">HELP &amp; SUPPORT</div>
        <h1 className="font-display text-[28px] font-bold text-ink">
          Payment &amp; Password Sahayata (FAQ)
        </h1>
        <p className="text-[15px] leading-[1.6] text-ink-2 max-w-[65ch]">
          Payment karne, password paane, aur PDF download karne me koi dikkat aaye to neeche diye gaye points padhein.
        </p>

        {/* Banner Illustration #7 */}
        <div className="relative w-full h-[140px] sm:h-[180px] rounded-[14px] overflow-hidden border border-line bg-card-2 p-2">
          <Image
            src="/img/pay-steps.png"
            alt="Payment Steps: QR scan -> WhatsApp password -> PDF Unlock"
            fill
            className="object-contain"
            sizes="(max-width: 1000px) 100vw, 1000px"
          />
        </div>
      </div>

      {/* FAQ Accordion / Cards */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-5 rounded-[14px] border border-line bg-card shadow-card space-y-2.5"
          >
            <h3 className="font-display text-[17px] font-bold text-ink flex items-start gap-2.5">
              <span className="font-mono text-accent text-[15px] font-extrabold shrink-0 mt-0.5">
                Q{idx + 1}.
              </span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-[14.5px] leading-[1.6] text-ink-2 font-body pl-7">
              {faq.a}
            </p>
            <div className="pl-7 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Sawal ho to WhatsApp karo +{whatsappNumber}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA Card */}
      <div className="p-6 rounded-[16px] bg-brand-soft border border-brand/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="font-display text-[18px] font-bold text-ink">
            Abhi bhi koi sawal hai?
          </h3>
          <p className="text-[13.5px] text-ink-2 mt-0.5">
            Hum WhatsApp par aapki poori sahayata karenge.
          </p>
        </div>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="brand" className="gap-2 shrink-0">
            <MessageSquare className="w-4 h-4" />
            WhatsApp par message karein
          </Button>
        </a>
      </div>
    </div>
  );
}
