'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { api, HeroItem } from '@/lib/api';
import { getLocalizedHeroText } from '@/lib/hero-content';
import { useLanguage } from '@/context/LanguageContext';

export function IntroSection() {
  const { lang, t } = useLanguage();
  const [heroData, setHeroData] = useState<HeroItem | null>(null);

  useEffect(() => {
    api.getHero('HOME')
      .then((hero) => setHeroData(hero || null))
      .catch(() => setHeroData(null));
  }, []);

  const subtitle = getLocalizedHeroText(heroData, 'subtitle', lang, t.home.welcomeSubtitle);
  const title = getLocalizedHeroText(heroData, 'title', lang, t.home.welcomeTitle);
  const description = getLocalizedHeroText(heroData, 'description', lang, t.home.welcomeDesc);

  return (
    <section className="relative w-full bg-[#EFFFFF] py-20 md:py-28 overflow-hidden">
      {/* Background Lao floral watermark on the right */}
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none opacity-5 rotate-[-12deg]">
        <Image
          src="/images/lao-pattern.png"
          alt="Lao Pattern"
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
        {/* Divider dot line */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-16 sm:w-20 h-[2px] bg-[#0400CC]/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#0400CC]" />
          <div className="w-16 sm:w-20 h-[2px] bg-[#0400CC]/20" />
        </div>

        {/* Stacked Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#00001C] uppercase leading-tight">
          {subtitle}
          <span className="block text-[#0400CC] mt-1">{title}</span>
        </h2>

        {/* Paragraph */}
        <p className="mt-8 text-base sm:text-lg md:text-xl text-[#4A5565] leading-relaxed max-w-[850px] mx-auto font-normal">
          {description}
        </p>

    
      </div>
    </section>
  );
}
