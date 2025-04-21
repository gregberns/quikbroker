import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientErrorBoundary from "./components/ClientErrorBoundary";
import ThemeProvider from "./theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuikBroker - Logistics & Trucking Platform",
  description: "Streamlining logistics and trucking operations for brokers and carriers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientErrorBoundary>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
