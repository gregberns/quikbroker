'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  themes?: string[];
  attribute?: string;
  enableSystem?: boolean;
  forcedTheme?: string;
}

export default function ThemeProvider({
  children,
  defaultTheme = 'mclookup',
  themes = ['light', 'dark', 'mclookup'],
  attribute = 'data-theme',
  enableSystem = false,
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      themes={themes}
    >
      {children}
    </NextThemesProvider>
  );
}