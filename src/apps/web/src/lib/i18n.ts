
import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
// NO client-specific imports like initReactI18next or LanguageDetector here

const i18nInstance = i18n.createInstance();

const isServer = typeof window === 'undefined';

// Basic initialization for server-side or as a base for client
// This prevents re-initializing if it's already done (e.g., by client setup in HMR)
if (!i18nInstance.isInitialized) {
  i18nInstance
    .use(HttpBackend) // HttpBackend is safe for server and client (uses fetch)
    .init({
      // lng: 'en', // Default language for server; can be overridden by request
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false, // React already safes from xss
      },
      supportedLngs: ['en', 'af', 'de'],
      ns: ['translation'], // Default namespace
      defaultNS: 'translation',
      backend: {
        // For client, this is relative to public URL.
        // For server, we avoid fetching with a relative path to prevent "Failed to parse URL" errors.
        loadPath: isServer ? '' : '/locales/{{lng}}/{{ns}}.json',
      },
      // When on server, don't try to fetch anything synchronously
      initImmediate: !isServer,
    });
}


export default i18nInstance;
