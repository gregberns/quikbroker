type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  radius?: string;
};

// Convert hex to hsl string value
const hexToHSL = (hex: string): string => {
  // Remove the # if it exists
  hex = hex.replace('#', '');
  
  // Convert hex to rgb
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  
  let h = 0;
  let s = 0;
  let l = 0;
  
  // Calculate hue
  if (delta === 0) {
    h = 0;
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }
  
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  
  // Calculate lightness
  l = (cmax + cmin) / 2;
  
  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  
  // Convert to percentages
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  
  return `${h} ${s}% ${l}%`;
};

export const createTheme = (name: string, colors: ThemeColors): string => {
  // Convert hex values to HSL where needed
  const processedColors: Record<string, string> = {};
  
  // Process each color
  Object.entries(colors).forEach(([key, value]) => {
    if (key === 'radius') {
      processedColors[key] = value;
    } else if (value.startsWith('#')) {
      processedColors[key] = hexToHSL(value);
    } else {
      processedColors[key] = value;
    }
  });
  
  // Create CSS custom properties
  return `
  [data-theme="${name}"] {
    --background: ${processedColors.background};
    --foreground: ${processedColors.foreground};
    --card: ${processedColors.card};
    --card-foreground: ${processedColors.cardForeground};
    --popover: ${processedColors.popover};
    --popover-foreground: ${processedColors.popoverForeground};
    --primary: ${processedColors.primary};
    --primary-foreground: ${processedColors.primaryForeground};
    --secondary: ${processedColors.secondary};
    --secondary-foreground: ${processedColors.secondaryForeground};
    --muted: ${processedColors.muted};
    --muted-foreground: ${processedColors.mutedForeground};
    --accent: ${processedColors.accent};
    --accent-foreground: ${processedColors.accentForeground};
    --destructive: ${processedColors.destructive};
    --destructive-foreground: ${processedColors.destructiveForeground};
    --border: ${processedColors.border};
    --input: ${processedColors.input};
    --ring: ${processedColors.ring};
    ${processedColors.radius ? `--radius: ${processedColors.radius};` : ''}
  }`;
};