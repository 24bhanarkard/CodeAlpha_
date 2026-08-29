import { Language, LanguageId } from '../types';

export const LANGUAGES: Record<LanguageId, Language> = {
  es: {
    id: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    code: 'ES',
    bcp47: 'es-ES',
    description: 'Spoken by over 500 million people across the globe, known for its rhythmic cadence.',
    color: 'from-amber-500 to-red-500',
  },
  fr: {
    id: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    code: 'FR',
    bcp47: 'fr-FR',
    description: 'The language of diplomacy, romance, and culture with elegant vowels and silent letters.',
    color: 'from-blue-500 to-indigo-600',
  },
  de: {
    id: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    code: 'DE',
    bcp47: 'de-DE',
    description: 'The language of philosophy, science, and engineering with expressive compound words.',
    color: 'from-yellow-500 to-amber-700',
  },
  ja: {
    id: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    code: 'JA',
    bcp47: 'ja-JP',
    description: 'A beautiful language combining Kanji and Kana with rich levels of politeness and nuance.',
    color: 'from-rose-500 to-red-600',
  },
};

export const LANGUAGE_LIST = Object.values(LANGUAGES);
