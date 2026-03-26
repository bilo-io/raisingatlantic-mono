
"use client";

import React, { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nInstance from '@/lib/i18n';

import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

interface I18nProviderProps {
  children: ReactNode;
}

// Module-level flag: ensures client-side plugins are added exactly once
// (survives HMR module identity, but that's acceptable — plugins are idempotent)
let clientPluginsAdded = false;

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    if (clientPluginsAdded) return;
    // Guard against re-adding plugins if i18next is already initialised with them
    if (i18nInstance.isInitialized && (i18nInstance as unknown as { _reactI18next?: boolean })._reactI18next) {
      clientPluginsAdded = true;
      return;
    }

    i18nInstance
      .use(HttpBackend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',
        interpolation: { escapeValue: false },
        supportedLngs: ['en', 'af', 'de'],
        ns: ['translation'],
        defaultNS: 'translation',
        // partialBundledLanguages: true prevents the HTTP backend from dropping 
        // the `en` translations we already bundled statically on the server!
        partialBundledLanguages: true,
        backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
        preload: ['en'],
        detection: {
          order: ['localStorage', 'navigator', 'htmlTag'],
          caches: ['localStorage'],
        },
      })
      .then(() => { clientPluginsAdded = true; })
      .catch((err: unknown) => console.error('i18next client-side init error:', err));
  }, []);


  // Render children immediately — i18next will update translations reactively
  // once it finishes loading. This eliminates the blank-screen flash.
  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
