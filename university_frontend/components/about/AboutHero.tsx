'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export function AboutHero() {
  const { t } = useLanguage();
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    api.getHero('ABOUT')
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
    <section className="relative w-full bg-[#00001C] pt-36 pb-24 md:pt-44 md:pb-32 text-white overflow-hidden text-center">
      {/* Dynamic background photo from Admin Dashboard (Blank by default) */}
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
        <span className="block text-xs sm:text-sm font-bold tracking-widest text-white uppercase">
          {t.about.heroSubtitle}
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
          {t.about.heroTitle}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed pt-2">
          {t.about.heroDesc}
        </p>
      </div>
    </section>
  );
}
