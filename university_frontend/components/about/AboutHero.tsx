'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { api, HeroItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export function AboutHero() {
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';
  const [heroData, setHeroData] = useState<HeroItem | null>(null);

  useEffect(() => {
    api.getHero('ABOUT')
      .then((res) => {
        if (res) setHeroData(res);
      })
      .catch(() => {
        setHeroData(null);
      });
  }, []);

  const subtitle = isLa
    ? (heroData?.subtitleLa || heroData?.subtitle || t.about.heroSubtitle)
    : (heroData?.subtitle || t.about.heroSubtitle);

  const title = isLa
    ? (heroData?.titleLa || heroData?.title || t.about.heroTitle)
    : (heroData?.title || t.about.heroTitle);

  const description = isLa
    ? (heroData?.descriptionLa || heroData?.description || t.about.heroDesc)
    : (heroData?.description || t.about.heroDesc);

  const bgImage = heroData?.imageUrl?.trim() || null;

  return (
    <section className="relative w-full min-h-[510px] md:h-[600px] bg-[#00001C] pt-28 pb-12 md:pt-32 md:pb-16 text-white overflow-hidden text-center flex flex-col justify-center items-center">
      {/* Dynamic background photo from Admin Dashboard */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="About SIT Hero Background"
            fill
            className="object-cover object-center opacity-30 brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#00001C]/80 via-[#0400CC]/60 to-[#00001C]" />
        </div>
      )}

      {/* Decorative gradient glow if blank */}
      {!bgImage && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0400CC]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#00001C] via-[#0400CC]/10 to-[#00001C] pointer-events-none" />
        </>
      )}

      <div className="max-w-[1000px] mx-auto px-6 relative z-10 space-y-4">
        {subtitle && (
          <span className="block text-xs sm:text-sm font-bold tracking-widest text-white uppercase">
            {subtitle}
          </span>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
          {title}
        </h1>

        {description && (
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed pt-2">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
