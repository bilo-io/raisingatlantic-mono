
"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nInstance from '@/lib/i18n'; // Import the server-safe instance

// Client-specific imports are now here
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

interface I18nProviderProps {
  children: ReactNode;
}

// Flag to ensure client-side specific initialization happens only once
let clientSpecificPluginsAdded = false;

export function I18nProvider({ children }: I18nProviderProps) {
  // isReady checks if i18next has run its init callback (for client-side specific init)
  const [isReadyForClient, setIsReadyForClient] = useState(false);

  useEffect(() => {
    // Check if the instance already has React integrated (e.g. by HMR or previous render)
    // and if client specific plugins have been added.
    // The `isInitialized` check on i18nInstance refers to its core init (from lib/i18n.ts).
    // We need to ensure client plugins are added and client-oriented init runs.
    if (!clientSpecificPluginsAdded) {
      i18nInstance
        .use(LanguageDetector) // Add browser language detection
        .use(initReactI18next)  // Add React integration
        .init({
          // Re-initialize or merge with base config.
          // Important to specify all necessary options for client.
          fallbackLng: 'en',
          debug: process.env.NODE_ENV === 'development',
          interpolation: { escapeValue: false },
          supportedLngs: ['en', 'af', 'de'],
          ns: ['translation'],
          defaultNS: 'translation',
          backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json', // Ensure browser path
          },
          preload: ['en', 'af', 'de'], // Client-side preload
          detection: { // Browser-specific detection options
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
          },
          // react: { useSuspense: false } // if needed
        })
        .then(() => {
          clientSpecificPluginsAdded = true;
          setIsReadyForClient(true);
        })
        .catch(err => console.error("i18next client-side init error:", err));
    } else {
        // If plugins were already added (e.g. from a previous HMR update cycle where module state persisted)
        // and i18n is initialized, we can consider it ready.
        // Or if the init promise from above resolved already.
        if (i18nInstance.isInitialized) {
            setIsReadyForClient(true);
        }
    }
  }, []);

  // Show loading state or null if client-side i18next isn't fully ready
  if (!isReadyForClient) {
    return null;
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
