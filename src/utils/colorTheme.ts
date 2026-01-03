// Color theme management utilities

export interface ColorTheme {
  // Light mode colors
  light_background: string;
  light_foreground: string;
  light_card: string;
  light_card_foreground: string;
  light_popover: string;
  light_popover_foreground: string;
  light_primary: string;
  light_primary_foreground: string;
  light_secondary: string;
  light_secondary_foreground: string;
  light_muted: string;
  light_muted_foreground: string;
  light_accent: string;
  light_accent_foreground: string;
  light_destructive: string;
  light_destructive_foreground: string;
  light_border: string;
  light_input: string;
  light_ring: string;

  // Custom colors - Light Mode
  light_sage: string;
  light_sage_light: string;
  light_sage_dark: string;
  light_cream: string;
  light_cream_dark: string;
  light_terracotta: string;
  light_terracotta_light: string;
  light_forest: string;
  light_warm_white: string;

  // Dark mode colors
  dark_background: string;
  dark_foreground: string;
  dark_card: string;
  dark_card_foreground: string;
  dark_popover: string;
  dark_popover_foreground: string;
  dark_primary: string;
  dark_primary_foreground: string;
  dark_secondary: string;
  dark_secondary_foreground: string;
  dark_muted: string;
  dark_muted_foreground: string;
  dark_accent: string;
  dark_accent_foreground: string;
  dark_destructive: string;
  dark_destructive_foreground: string;
  dark_border: string;
  dark_input: string;
  dark_ring: string;

  // Custom colors - Dark Mode
  dark_sage: string;
  dark_sage_light: string;
  dark_sage_dark: string;
  dark_cream: string;
  dark_cream_dark: string;
  dark_terracotta: string;
  dark_forest: string;
  dark_warm_white: string;
}

/**
 * Updates CSS custom properties for the color theme
 */
export function updateColorTheme(theme: ColorTheme): void {
  const root = document.documentElement;

  // Light mode colors
  root.style.setProperty('--background', theme.light_background);
  root.style.setProperty('--foreground', theme.light_foreground);
  root.style.setProperty('--card', theme.light_card);
  root.style.setProperty('--card-foreground', theme.light_card_foreground);
  root.style.setProperty('--popover', theme.light_popover);
  root.style.setProperty('--popover-foreground', theme.light_popover_foreground);
  root.style.setProperty('--primary', theme.light_primary);
  root.style.setProperty('--primary-foreground', theme.light_primary_foreground);
  root.style.setProperty('--secondary', theme.light_secondary);
  root.style.setProperty('--secondary-foreground', theme.light_secondary_foreground);
  root.style.setProperty('--muted', theme.light_muted);
  root.style.setProperty('--muted-foreground', theme.light_muted_foreground);
  root.style.setProperty('--accent', theme.light_accent);
  root.style.setProperty('--accent-foreground', theme.light_accent_foreground);
  root.style.setProperty('--destructive', theme.light_destructive);
  root.style.setProperty('--destructive-foreground', theme.light_destructive_foreground);
  root.style.setProperty('--border', theme.light_border);
  root.style.setProperty('--input', theme.light_input);
  root.style.setProperty('--ring', theme.light_ring);

  // Custom colors - Light Mode
  root.style.setProperty('--sage', theme.light_sage);
  root.style.setProperty('--sage-light', theme.light_sage_light);
  root.style.setProperty('--sage-dark', theme.light_sage_dark);
  root.style.setProperty('--cream', theme.light_cream);
  root.style.setProperty('--cream-dark', theme.light_cream_dark);
  root.style.setProperty('--terracotta', theme.light_terracotta);
  root.style.setProperty('--terracotta-light', theme.light_terracotta_light);
  root.style.setProperty('--forest', theme.light_forest);
  root.style.setProperty('--warm-white', theme.light_warm_white);

  // Update dark mode colors
  const darkRoot = document.querySelector('.dark') as HTMLElement || root;
  darkRoot.style.setProperty('--background', theme.dark_background);
  darkRoot.style.setProperty('--foreground', theme.dark_foreground);
  darkRoot.style.setProperty('--card', theme.dark_card);
  darkRoot.style.setProperty('--card-foreground', theme.dark_card_foreground);
  darkRoot.style.setProperty('--popover', theme.dark_popover);
  darkRoot.style.setProperty('--popover-foreground', theme.dark_popover_foreground);
  darkRoot.style.setProperty('--primary', theme.dark_primary);
  darkRoot.style.setProperty('--primary-foreground', theme.dark_primary_foreground);
  darkRoot.style.setProperty('--secondary', theme.dark_secondary);
  darkRoot.style.setProperty('--secondary-foreground', theme.dark_secondary_foreground);
  darkRoot.style.setProperty('--muted', theme.dark_muted);
  darkRoot.style.setProperty('--muted-foreground', theme.dark_muted_foreground);
  darkRoot.style.setProperty('--accent', theme.dark_accent);
  darkRoot.style.setProperty('--accent-foreground', theme.dark_accent_foreground);
  darkRoot.style.setProperty('--destructive', theme.dark_destructive);
  darkRoot.style.setProperty('--destructive-foreground', theme.dark_destructive_foreground);
  darkRoot.style.setProperty('--border', theme.dark_border);
  darkRoot.style.setProperty('--input', theme.dark_input);
  darkRoot.style.setProperty('--ring', theme.dark_ring);

  // Custom colors - Dark Mode
  darkRoot.style.setProperty('--sage', theme.dark_sage);
  darkRoot.style.setProperty('--sage-light', theme.dark_sage_light);
  darkRoot.style.setProperty('--sage-dark', theme.dark_sage_dark);
  darkRoot.style.setProperty('--cream', theme.dark_cream);
  darkRoot.style.setProperty('--cream-dark', theme.dark_cream_dark);
  darkRoot.style.setProperty('--terracotta', theme.dark_terracotta);
  darkRoot.style.setProperty('--forest', theme.dark_forest);
  darkRoot.style.setProperty('--warm-white', theme.dark_warm_white);
}

/**
 * Converts HSL string to hex for color picker compatibility
 */
export function hslToHex(hsl: string): string {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return '#000000';

  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
}

/**
 * Converts hex to HSL string
 */
export function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

/**
 * Gets the current color theme from CSS custom properties
 */
export function getCurrentColorTheme(): ColorTheme {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  return {
    // Light mode colors
    light_background: computedStyle.getPropertyValue('--background').trim(),
    light_foreground: computedStyle.getPropertyValue('--foreground').trim(),
    light_card: computedStyle.getPropertyValue('--card').trim(),
    light_card_foreground: computedStyle.getPropertyValue('--card-foreground').trim(),
    light_popover: computedStyle.getPropertyValue('--popover').trim(),
    light_popover_foreground: computedStyle.getPropertyValue('--popover-foreground').trim(),
    light_primary: computedStyle.getPropertyValue('--primary').trim(),
    light_primary_foreground: computedStyle.getPropertyValue('--primary-foreground').trim(),
    light_secondary: computedStyle.getPropertyValue('--secondary').trim(),
    light_secondary_foreground: computedStyle.getPropertyValue('--secondary-foreground').trim(),
    light_muted: computedStyle.getPropertyValue('--muted').trim(),
    light_muted_foreground: computedStyle.getPropertyValue('--muted-foreground').trim(),
    light_accent: computedStyle.getPropertyValue('--accent').trim(),
    light_accent_foreground: computedStyle.getPropertyValue('--accent-foreground').trim(),
    light_destructive: computedStyle.getPropertyValue('--destructive').trim(),
    light_destructive_foreground: computedStyle.getPropertyValue('--destructive-foreground').trim(),
    light_border: computedStyle.getPropertyValue('--border').trim(),
    light_input: computedStyle.getPropertyValue('--input').trim(),
    light_ring: computedStyle.getPropertyValue('--ring').trim(),

    // Custom colors - Light Mode
    light_sage: computedStyle.getPropertyValue('--sage').trim(),
    light_sage_light: computedStyle.getPropertyValue('--sage-light').trim(),
    light_sage_dark: computedStyle.getPropertyValue('--sage-dark').trim(),
    light_cream: computedStyle.getPropertyValue('--cream').trim(),
    light_cream_dark: computedStyle.getPropertyValue('--cream-dark').trim(),
    light_terracotta: computedStyle.getPropertyValue('--terracotta').trim(),
    light_terracotta_light: computedStyle.getPropertyValue('--terracotta-light').trim(),
    light_forest: computedStyle.getPropertyValue('--forest').trim(),
    light_warm_white: computedStyle.getPropertyValue('--warm-white').trim(),

    // Dark mode colors (these need to be read from the .dark class)
    dark_background: '150 20% 8%',
    dark_foreground: '45 20% 95%',
    dark_card: '150 18% 12%',
    dark_card_foreground: '45 20% 95%',
    dark_popover: '150 20% 8%',
    dark_popover_foreground: '45 20% 95%',
    dark_primary: '142 40% 50%',
    dark_primary_foreground: '150 20% 8%',
    dark_secondary: '150 15% 18%',
    dark_secondary_foreground: '45 20% 90%',
    dark_muted: '150 15% 18%',
    dark_muted_foreground: '45 15% 60%',
    dark_accent: '25 50% 50%',
    dark_accent_foreground: '45 20% 95%',
    dark_destructive: '0 62.8% 30.6%',
    dark_destructive_foreground: '210 40% 98%',
    dark_border: '150 15% 20%',
    dark_input: '150 15% 20%',
    dark_ring: '142 40% 50%',

    // Custom colors - Dark Mode
    dark_sage: '142 40% 50%',
    dark_sage_light: '142 25% 25%',
    dark_sage_dark: '142 35% 60%',
    dark_cream: '150 15% 15%',
    dark_cream_dark: '150 15% 12%',
    dark_terracotta: '25 50% 50%',
    dark_forest: '150 30% 80%',
    dark_warm_white: '150 20% 8%',
  };
}
