import type { Metadata } from 'next';
import { Bricolage_Grotesque, Mukta, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const fontDisplay = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const fontBody = Mukta({
  subsets: ['latin', 'devanagari'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
});

const fontMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VLDD Notes Hub — Veterinary & Livestock Diploma Study Notes',
  description:
    'VLDD Entrance Exam aur 1st & 2nd Year ke complete study notes. Trial PDF free padho, full notes password se download karo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hi"
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('vldd-theme');
                if (theme === 'dark' || theme === 'light') {
                  document.documentElement.setAttribute('data-theme', theme);
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-ground text-ink antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
