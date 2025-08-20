export type Locale = (typeof locales)[number];

export const locales = [
  'en',   // English
  'de',   // German
  'ar',   // Arabic
  'gu',   // Gujarati
  'hi',   // Hindi
  'kn',   // Kannada
  'mr',   // Marathi
  'ru',   // Russian
  'sr',   // Serbian
  'ta',   // Tamil
  'te',   // Telugu
  'tur'   // Turkish
] as const;

export const defaultLocale: Locale = 'en';
