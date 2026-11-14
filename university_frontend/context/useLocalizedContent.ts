'use client';

import { useCallback } from 'react';
import { useLanguage } from './LanguageContext';
import { getLocalizedContent } from '@/lib/i18n/content';

export function useLocalizedContent() {
  const { lang } = useLanguage();
  return useCallback(
    (record: object | null | undefined, field: string) => getLocalizedContent(record, field, lang),
    [lang],
  );
}
