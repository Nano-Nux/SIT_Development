import { en, Translations } from './dictionaries/en';
import { la } from './dictionaries/la';
import { zh } from './dictionaries/zh';

export type Language = 'EN' | 'LA' | 'ZH';

export const dictionaries: Record<Language, Translations> = {
  EN: en,
  LA: la,
  ZH: zh,
};

export { en, la, zh };
export type { Translations };
