import Navbar from '@/components/navbar';
import { Providers } from '@/providers/wagmi';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geist = localFont({
  src: '../../public/fonts/GeistVF.woff',
  variable: '--font-geist',
  weight: '100 900',
});

const geistMono = localFont({
  src: '../../public/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Flash Duels',
  description: 'Flash Duels',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${geist.variable} ${geistMono.variable}`}>
      <body className="bg-background text-white min-h-full font-sans">
        <Providers>
          <div className="flex min-h-full flex-col">
            <Navbar />
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
