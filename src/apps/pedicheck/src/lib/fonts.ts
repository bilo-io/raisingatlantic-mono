import {
  Baloo_2,
  Bitter,
  Comfortaa,
  Cormorant_Garamond,
  Crimson_Pro,
  DM_Sans,
  DM_Serif_Display,
  EB_Garamond,
  Figtree,
  Fraunces,
  Fredoka,
  Inter,
  Karla,
  Lexend,
  Lora,
  Manrope,
  Montserrat,
  Newsreader,
  Nunito,
  Nunito_Sans,
  Outfit,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Poppins,
  Quicksand,
  Rubik,
  Source_Serif_4,
  Space_Grotesk,
  Urbanist,
  Work_Sans,
} from 'next/font/google';

/**
 * Every Google Font testable on /settings, self-hosted via next/font.
 * `variable` names must match `src/lib/font-catalog.ts`. The defaults
 * (Nunito for headline + wordmark, DM Sans for body) preload; the rest
 * use `preload: false` so browsers only fetch them when a font is
 * actually rendered (e.g. picked on the settings page).
 */

// --- current defaults ---

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

// --- former defaults, still selectable on /settings ---

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
});

// --- serif candidates (italic included: the hero headline uses <em>) ---

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-dm-serif-display',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant-garamond',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
});

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-crimson-pro',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
});

const bitter = Bitter({
  subsets: ['latin'],
  variable: '--font-bitter',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
});

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif-4',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
});

// --- sans candidates ---

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: false,
});

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: false,
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

// --- rounded / display candidates (wordmark) ---

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  preload: false,
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

const comfortaa = Comfortaa({
  subsets: ['latin'],
  variable: '--font-comfortaa',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

const baloo2 = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo-2',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: false,
});

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: false,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

/** className exposing every font's CSS variable — applied to <html> in layout.tsx. */
export const fontVariables = [
  fraunces,
  dmSans,
  nunito,
  playfairDisplay,
  lora,
  dmSerifDisplay,
  ebGaramond,
  cormorantGaramond,
  crimsonPro,
  bitter,
  sourceSerif4,
  newsreader,
  inter,
  poppins,
  manrope,
  rubik,
  workSans,
  outfit,
  plusJakartaSans,
  figtree,
  karla,
  urbanist,
  lexend,
  nunitoSans,
  quicksand,
  comfortaa,
  baloo2,
  fredoka,
  montserrat,
  spaceGrotesk,
]
  .map((f) => f.variable)
  .join(' ');
