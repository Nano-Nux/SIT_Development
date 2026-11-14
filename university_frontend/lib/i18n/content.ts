import type { Language } from './index';

/** Select an authored CMS translation, falling back to its English field. */
export function getLocalizedContent(
  record: object | null | undefined,
  field: string,
  language: Language,
): string {
  if (!record) return '';
  const data = record as Record<string, unknown>;
  const suffix = language === 'ZH' ? 'Zh' : language === 'LA' ? 'La' : '';
  const translated = data[`${field}${suffix}`];
  if (typeof translated === 'string' && translated.trim()) return translated;
  return typeof data[field] === 'string' ? (data[field] as string) : '';
}
