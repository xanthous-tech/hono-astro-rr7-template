export const localeNames = ['English', '中文'];
export const locales = ['en', 'zh'];
export const localeCodes: Record<string, string> = {
  en: 'en',
  zh: 'zh-Hans',
};
export const localeCodesReverse: Record<string, string> = {
  en: 'en',
  'zh-Hans': 'zh',
};
export const dateTimeLocaleCodes: Record<string, string> = {
  en: 'en-US',
  zh: 'zh-CN',
};

export const defaultLocale = 'en';

// static i18next configuration
export const i18n = {
  // This is the list of languages your application supports
  supportedLngs: locales,
  // This is the language you want to use in case
  // if the user language is not in the supportedLngs
  fallbackLng: defaultLocale,
  // The default namespace of i18next is "translation", but you can customize it here
  defaultNS: 'translation',
};

export const localeRegex = new RegExp(`^/(${locales.join('|')})`);

export const localeCookieName = 'app_locale';
