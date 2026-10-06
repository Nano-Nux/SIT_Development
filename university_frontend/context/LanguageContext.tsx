'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, dictionaries, Translations } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  isLa: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'EN',
  setLang: () => {},
  t: dictionaries.EN,
  isLa: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('EN');

  useEffect(() => {
    document.documentElement.lang = lang === 'LA' ? 'lo' : 'en';
  }, [lang]);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('sit_lang') as Language | null;
      if (savedLang === 'EN' || savedLang === 'LA') {
        setLangState(savedLang);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('sit_lang', newLang);
    } catch {
      // ignore
    }
  };

  const t = dictionaries[lang] || dictionaries.EN;
  const isLa = lang === 'LA';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isLa }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
