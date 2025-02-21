import InviteGate from '@/components/invite-only/invite-gate';
import Navbar from '@/components/navbar';
import PriceWrapper from '@/providers/price-wrapper';
import { ReduxProvider } from '@/providers/redux';
import { Providers } from '@/providers/wagmi';
import { Toaster } from '@/shadcn/components/ui/toaster';
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';

const cairo = Cairo({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'Flash Duels',
  description: 'Flash Duels',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${cairo.variable}`}>
      <head>
        <link rel="preload" href="/logo/flash-dual.svg" as="image" type="image/svg+xml" />
      </head>
      <body className="bg-background text-white min-h-full">
        <ReduxProvider>
          <Providers>
            <InviteGate>
              <PriceWrapper>
                <div className="flex min-h-full flex-col">
                  <Navbar />
                  <main className="flex-1 mx-auto w-full px-4 sm:px-6 lg:px-8">{children}</main>
                  <Toaster />
                </div>
              </PriceWrapper>
            </InviteGate>
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
