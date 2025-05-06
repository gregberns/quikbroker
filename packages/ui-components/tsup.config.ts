import { defineConfig } from 'tsup';
import { globSync } from 'glob';
import path from 'path';

// Generate entry points for all components
const componentEntries = {};

// UI Components
const uiComponents = globSync('src/components/ui/*.{ts,tsx}');
uiComponents.forEach((file) => {
  const name = path.basename(file).replace(/\.(ts|tsx)$/, '');
  componentEntries[`components/ui/${name}`] = file;
});

// Marketing Components
const marketingComponents = globSync('src/components/marketing/*.{ts,tsx}');
marketingComponents.forEach((file) => {
  const name = path.basename(file).replace(/\.(ts|tsx)$/, '');
  componentEntries[`components/marketing/${name}`] = file;
});

// Theme
const themeFiles = globSync('src/theme/*.{ts,tsx}');
themeFiles.forEach((file) => {
  const name = path.basename(file).replace(/\.(ts|tsx)$/, '');
  componentEntries[`theme/${name}`] = file;
});

// Main entry point
componentEntries['index'] = 'src/index.ts';

export default defineConfig({
  entry: componentEntries,
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react', 
    'react-dom', 
    'react/jsx-runtime',
    'tailwindcss',
    'next',
    'next/link',
    'next/image',
    'next/navigation',
    'next-themes',
  ],
  treeshake: true,
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});