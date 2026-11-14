'use client';

import { useCallback } from 'react';
import { useLanguage } from './LanguageContext';
import { translateUi } from '@/lib/i18n/ui-text';

export function useUiTranslation() {
  const { lang } = useLanguage();
  return useCallback((text: string | null | undefined) => translateUi(text, lang), [lang]);
}
