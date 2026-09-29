import type { HeroData } from './api/types';
import type { Language } from './i18n';

export type HeroTextField = 'title' | 'subtitle' | 'description' | 'buttonText';

export function getLocalizedHeroText(
  hero: HeroData | null | undefined,
  field: HeroTextField,
  language: Language,
  fallback = '',
): string {
  const localizedValue = language === 'LA' ? hero?.[`${field}La`] : undefined;
  const englishValue = hero?.[field];

  if (typeof localizedValue === 'string' && localizedValue.trim()) return localizedValue;
  if (typeof englishValue === 'string' && englishValue.trim()) return englishValue;
  return fallback;
}
