import { en, Translations } from './dictionaries/en';
import { la } from './dictionaries/la';

export type Language = 'EN' | 'LA';

export const dictionaries: Record<Language, Translations> = {
  EN: en,
  LA: la,
};

export { en, la };
export type { Translations };
