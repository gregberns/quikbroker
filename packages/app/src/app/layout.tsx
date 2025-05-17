import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./fallback-styles.css"; // Load basic styles first to prevent FOUC
import "./globals.css";
import ClientErrorBoundary from "./components/ClientErrorBoundary";
import { ThemeProvider } from "../../../ui-components/src/theme/ThemeProvider";

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
      <head>
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="USOxBLIecjzSVan2DVrKVw" async></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientErrorBoundary>
          <ThemeProvider 
            defaultTheme="light" 
            attribute="data-theme" 
            enableSystem={true}
            themes={['light', 'dark']}
          >
            {children}
          </ThemeProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
