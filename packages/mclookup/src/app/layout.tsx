import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@quikbroker/ui-components';

export const metadata: Metadata = {
  title: 'MC Lookup Tool | QuikBroker',
  description: 'Look up carrier information using the MC Lookup Tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="mclookup" themes={['light', 'dark', 'mclookup']}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}