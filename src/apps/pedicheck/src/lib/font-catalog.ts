/**
 * Client-safe catalog of the Google Fonts available on the /settings page.
 * The actual font loading happens in `fonts.ts` via next/font/google; each
 * entry's `variable` must match the `variable` option declared there.
 */

export type FontSlot = 'headline' | 'wordmark' | 'body';

export type FontCategory = 'serif' | 'sans' | 'rounded';

export interface FontOption {
  id: string;
  label: string;
  category: FontCategory;
  variable: string;
  fallback: string;
}

export const FONT_SLOTS: FontSlot[] = ['headline', 'wordmark', 'body'];

export const FONT_SLOT_LABELS: Record<FontSlot, string> = {
  headline: 'Headline',
  wordmark: 'Wordmark',
  body: 'Body',
};

/** localStorage key holding the saved selection. Read pre-paint in layout.tsx. */
export const FONT_STORAGE_KEY = 'pedicheck-font-settings';

/** What the app currently hard-codes in globals.css — the reset target. */
export const DEFAULT_FONT_IDS: Record<FontSlot, string> = {
  headline: 'poppins',
  wordmark: 'nunito',
  body: 'poppins',
};

const serif = 'Georgia, serif';
const sans = "'Helvetica Neue', Arial, sans-serif";

export const FONT_CATALOG: FontOption[] = [
  // Serifs — headline candidates
  { id: 'fraunces', label: 'Fraunces', category: 'serif', variable: '--font-fraunces', fallback: serif },
  { id: 'playfair-display', label: 'Playfair Display', category: 'serif', variable: '--font-playfair-display', fallback: serif },
  { id: 'lora', label: 'Lora', category: 'serif', variable: '--font-lora', fallback: serif },
  { id: 'dm-serif-display', label: 'DM Serif Display', category: 'serif', variable: '--font-dm-serif-display', fallback: serif },
  { id: 'eb-garamond', label: 'EB Garamond', category: 'serif', variable: '--font-eb-garamond', fallback: serif },
  { id: 'cormorant-garamond', label: 'Cormorant Garamond', category: 'serif', variable: '--font-cormorant-garamond', fallback: serif },
  { id: 'crimson-pro', label: 'Crimson Pro', category: 'serif', variable: '--font-crimson-pro', fallback: serif },
  { id: 'bitter', label: 'Bitter', category: 'serif', variable: '--font-bitter', fallback: serif },
  { id: 'source-serif-4', label: 'Source Serif 4', category: 'serif', variable: '--font-source-serif-4', fallback: serif },
  { id: 'newsreader', label: 'Newsreader', category: 'serif', variable: '--font-newsreader', fallback: serif },

  // Sans — body candidates
  { id: 'dm-sans', label: 'DM Sans', category: 'sans', variable: '--font-dm-sans', fallback: sans },
  { id: 'inter', label: 'Inter', category: 'sans', variable: '--font-inter', fallback: sans },
  { id: 'poppins', label: 'Poppins', category: 'sans', variable: '--font-poppins', fallback: sans },
  { id: 'manrope', label: 'Manrope', category: 'sans', variable: '--font-manrope', fallback: sans },
  { id: 'rubik', label: 'Rubik', category: 'sans', variable: '--font-rubik', fallback: sans },
  { id: 'work-sans', label: 'Work Sans', category: 'sans', variable: '--font-work-sans', fallback: sans },
  { id: 'outfit', label: 'Outfit', category: 'sans', variable: '--font-outfit', fallback: sans },
  { id: 'plus-jakarta-sans', label: 'Plus Jakarta Sans', category: 'sans', variable: '--font-plus-jakarta-sans', fallback: sans },
  { id: 'figtree', label: 'Figtree', category: 'sans', variable: '--font-figtree', fallback: sans },
  { id: 'karla', label: 'Karla', category: 'sans', variable: '--font-karla', fallback: sans },
  { id: 'urbanist', label: 'Urbanist', category: 'sans', variable: '--font-urbanist', fallback: sans },
  { id: 'lexend', label: 'Lexend', category: 'sans', variable: '--font-lexend', fallback: sans },

  // Rounded / display — wordmark candidates
  { id: 'nunito', label: 'Nunito', category: 'rounded', variable: '--font-nunito', fallback: 'system-ui, sans-serif' },
  { id: 'nunito-sans', label: 'Nunito Sans', category: 'rounded', variable: '--font-nunito-sans', fallback: 'system-ui, sans-serif' },
  { id: 'quicksand', label: 'Quicksand', category: 'rounded', variable: '--font-quicksand', fallback: 'system-ui, sans-serif' },
  { id: 'comfortaa', label: 'Comfortaa', category: 'rounded', variable: '--font-comfortaa', fallback: 'system-ui, sans-serif' },
  { id: 'baloo-2', label: 'Baloo 2', category: 'rounded', variable: '--font-baloo-2', fallback: 'system-ui, sans-serif' },
  { id: 'fredoka', label: 'Fredoka', category: 'rounded', variable: '--font-fredoka', fallback: 'system-ui, sans-serif' },
  { id: 'montserrat', label: 'Montserrat', category: 'rounded', variable: '--font-montserrat', fallback: sans },
  { id: 'space-grotesk', label: 'Space Grotesk', category: 'rounded', variable: '--font-space-grotesk', fallback: sans },
];

export const FONT_CATEGORY_LABELS: Record<FontCategory, string> = {
  serif: 'Serif',
  sans: 'Sans-serif',
  rounded: 'Rounded & display',
};

export function getFont(id: string): FontOption | undefined {
  return FONT_CATALOG.find((f) => f.id === id);
}

/** Full CSS font-family stack for a catalog entry. */
export function fontStack(font: FontOption): string {
  return `var(${font.variable}), '${font.label}', ${font.fallback}`;
}
