'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/lib/i18n';

const languages: { code: Language; label: string; name: string }[] = [
  { code: 'EN', label: 'EN', name: 'English' },
  { code: 'LA', label: 'LA', name: 'ພາສາລາວ' },
  { code: 'ZH', label: '中文', name: '简体中文' },
];

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  return (
    <div
      role="group"
      aria-label={t.common.language}
      className="inline-flex shrink-0 items-center gap-0.5 rounded-md border border-white/20 bg-[#000028] p-1 text-white"
    >
      {languages.map(({ code, label, name }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-label={name}
          aria-pressed={lang === code}
          lang={code === 'ZH' ? 'zh-CN' : code === 'LA' ? 'lo' : 'en'}
          className={`cursor-pointer rounded px-2 py-1 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${lang === code ? 'bg-[#0400CC] text-white shadow-sm' : 'text-white/70 hover:text-white'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
