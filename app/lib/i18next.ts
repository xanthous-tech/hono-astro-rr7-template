import { atom } from 'jotai';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import {
  defaultLocale,
  localeCodes,
  localeCookieName,
  locales,
} from '~/locales.config';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // bind react-i18next to the instance
  .init({
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    detection: {
      order: ['querystring', 'cookie', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupCookie: localeCookieName,
      cookieOptions: {
        sameSite: 'lax',
        path: '/',
      },
      caches: ['cookie'],
      excludeCacheFor: ['cimode'],
    },

    // react i18next special options (optional)
    // override if needed - omit if ok with defaults
    /*
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      useSuspense: true,
    }
    */
  });

export const localeAtom = atom<string>(defaultLocale);

localeAtom.onMount = (setLocaleAtom) => {
  setLocaleAtom(i18n.language);

  const onI18NextLanguageChanged = (lng: string) => {
    console.log('languageChanged', lng, localeCodes[lng]);
    document.documentElement.lang = localeCodes[lng];

    setLocaleAtom(lng);
  };

  i18n.on('languageChanged', onI18NextLanguageChanged);

  return () => {
    i18n.off('languageChanged', onI18NextLanguageChanged);
  };
};

export default i18n;
