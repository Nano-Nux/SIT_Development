import type { Metadata } from 'next';
import { Rethink_Sans, Noto_Sans_Lao } from 'next/font/google';
import '@fontsource-variable/google-sans/wght.css';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

const rethinkSans = Rethink_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-rethink-sans',
  display: 'swap',
});

const notoSansLao = Noto_Sans_Lao({
  subsets: ['lao'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-sans-lao',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SIT University — Soutsaka Institute of Technology',
  description:
    'Empowering the next generation of leaders through innovation, excellence, and global perspective.',
  icons: {
    icon: [
      { url: '/assets/sit-logo-icon.png', sizes: 'any' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/assets/sit-logo-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/assets/sit-logo-icon.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rethinkSans.variable} ${notoSansLao.variable} ${rethinkSans.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-[#00001C] selection:bg-[#0400CC] selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
