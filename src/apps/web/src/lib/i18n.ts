
import i18n from 'i18next';
// Import the default English translations directly to bundle them.
// This eliminates the network waterfall for the default language.
import enTranslation from '../../public/locales/en/translation.json';

const i18nInstance = i18n.createInstance();

const isServer = typeof window === 'undefined';

if (!i18nInstance.isInitialized) {
  i18nInstance
    .init({
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false, 
      },
      supportedLngs: ['en', 'af', 'de'],
      ns: ['translation'],
      defaultNS: 'translation',
      // Provide the bundled English translations immediately
      resources: {
        en: {
          translation: enTranslation
        }
      },
      // When on server, don't try to fetch anything synchronously
      initImmediate: !isServer,
    });
}

export default i18nInstance;

