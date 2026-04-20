
import { cookies } from 'next/headers';

/**
 * Gets the current locale on the server-side.
 * It primarily checks the 'i18next' cookie which is set by the client-side LanguageSwitcher.
 * Fallback to 'en'.
 */
export async function getServerLocale(): Promise<string> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('i18next');
  
  if (localeCookie && localeCookie.value) {
    // i18next cookie might contain full locale 'en-US', we just need the language code
    return localeCookie.value.split('-')[0];
  }
  
  return 'en';
}

export const supportedLocales = ['en', 'af', 'de'];

export function isValidLocale(locale: string): boolean {
  return supportedLocales.includes(locale);
}
