import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./theme/ThemeProvider";
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'MC Lookup Tool | QuikBroker',
  description: 'Look up carrier information using the MC Lookup Tool - Free FMCSA carrier data lookup service.',
  keywords: 'MC number lookup, DOT number, FMCSA, carrier information, truck freight, logistics, transportation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="mclookup" themes={['light', 'dark', 'mclookup']}>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <main className="flex-grow w-full">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}