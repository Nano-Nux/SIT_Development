'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function CTABanner() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full bg-[#0400CC] py-24 md:py-32 overflow-hidden text-white">
      {/* Organic curved background overlay shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-[#1E65FF]/40 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[700px] bg-[#1035D8]/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-24 w-[650px] h-[650px] bg-[#00B6FF]/30 rounded-full blur-2xl" />
      </div>

      <div className="max-w-[900px] mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          {t.home.ctaTitle}
        </h2>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto font-normal">
          {t.home.ctaDesc}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link
            href="/apply"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-slate-100 text-[#0400CC] text-sm font-extrabold tracking-wider px-9 py-4 rounded-md shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 uppercase"
          >
            {t.common.applyNow}
          </Link>
          <Link
            href="/request-info"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent hover:bg-white/10 text-white text-sm font-extrabold tracking-wider px-9 py-4 rounded-md border-2 border-white transition-all duration-200 hover:scale-105 active:scale-95 uppercase"
          >
            {t.common.requestInfo}
          </Link>
        </div>
      </div>
    </section>
  );
}
