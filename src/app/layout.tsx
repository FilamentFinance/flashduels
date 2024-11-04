import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import Providers from "./providers/PrivyProvider";
import Header from "@/components/Header/Header";
import { PriceProvider } from "./providers/PriceContextProvider";
import RainbowKitProviders from "./providers/RainbowKitProvider";
// import Providers from "./providers/PrivyProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Flash Duels",
  description: "Flash Duels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        style={{ background: 'var(--background, #141217)', minHeight: '100vh' }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PriceProvider>
          {/* <Providers> */}
          <RainbowKitProviders>
            <Header />
            {children}
          </RainbowKitProviders>
          {/* </Providers> */}
        </PriceProvider>
      </body>

    </html>
  );
}
