import { createInstance } from 'i18next';
import Backend from 'i18next-fs-backend';

import { defaultLocale, locales } from '~/locales.config';

// this is a build-time i18next instance (SSG)
export async function getFixedT(locale: string) {
  const newInstance = createInstance();

  return newInstance.use(Backend).init({
    lng: locale,
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: './public/locales/{{lng}}/{{ns}}.json',
    },
  });
}
