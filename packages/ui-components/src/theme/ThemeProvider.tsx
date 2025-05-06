'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type Attribute = 'class' | 'data-theme' | 'data-mode';

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
  themes?: string[];
  attribute?: Attribute | Attribute[];
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  themes = ['light', 'dark'],
  attribute = 'data-theme',
  enableSystem = true,
}: ThemeProviderProps) {
  // Fix hydration mismatch by only rendering after client-side JS is available
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Provider with default rendering (without theme applied yet)
  if (!mounted) {
    return (
      <>
        <div style={{ visibility: 'hidden' }}>
          {children}
        </div>
      </>
    );
  }

  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      forcedTheme={defaultTheme} // Force the theme to ensure it matches server-side
      themes={themes}
    >
      {children}
    </NextThemesProvider>
  );
}