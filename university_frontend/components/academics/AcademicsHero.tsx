'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export function AcademicsHero() {
  const { t } = useLanguage();
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    api.getHero('ACADEMICS')
      .then((res) => {
        if (res?.imageUrl && res.imageUrl.trim() !== '') {
          setBgImage(res.imageUrl.trim());
        }
      })
      .catch(() => {
        setBgImage(null);
      });
  }, []);

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#00001C] text-white overflow-hidden">
      {/* Dynamic background photo from Admin Dashboard (Blank by default) */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="Academics Hero Background"
            fill
            className="object-cover object-center opacity-30 brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#00001C]/80 via-[#0400CC]/60 to-[#00001C]" />
        </div>
      )}

      {/* Decorative gradient glow if blank */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#0400CC]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#00B6FF]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#00B6FF] text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#00B6FF]" />
            <span>{t.academics.heroSubtitle}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
            {t.academics.heroTitle}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal">
            {t.academics.heroDesc}
          </p>
        </div>
      </div>
    </section>
  );
}
