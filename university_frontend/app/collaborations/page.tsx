'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/home/CTABanner';
import { Globe, Building2, ExternalLink, MapPin } from 'lucide-react';
import { api, PartnerItem, HeroItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function CollaborationsPage() {
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getHero('COLLABORATIONS').catch(() => null),
      api.getPartners().catch(() => []),
    ]).then(([heroRes, partnerRes]) => {
      if (heroRes?.imageUrl && heroRes.imageUrl.trim() !== '') {
        setBgImage(heroRes.imageUrl.trim());
      }
      setPartners(partnerRes || []);
      setLoading(false);
    });
  }, []);

  const rawTitle = t.collaborations.heroTitle || (isLa ? 'ການຮ່ວມມືກັບ SIT' : 'Collaboration with SIT');
  const heroSubtitle = t.collaborations.heroSubtitle;

  let mainTitle = isLa ? 'ການຮ່ວມມື' : 'Collaboration';
  let subTitleAccent = isLa ? 'ກັບ SIT' : 'with SIT';

  if (rawTitle.toLowerCase().includes(' with sit')) {
    const parts = rawTitle.split(/ with sit/i);
    mainTitle = parts[0].trim();
    subTitleAccent = 'with SIT';
  } else if (rawTitle.includes(' ກັບ SIT') || rawTitle.includes(' ກັບ sit') || rawTitle.includes('ກັບ SIT')) {
    const parts = rawTitle.split(/ ກັບ SIT| ກັບ sit|ກັບ SIT/);
    mainTitle = parts[0].trim() || 'ການຮ່ວມມື';
    subTitleAccent = 'ກັບ SIT';
  } else if (rawTitle.toLowerCase() === 'collaboration with sit') {
    mainTitle = 'Collaboration';
    subTitleAccent = 'with SIT';
  } else {
    mainTitle = rawTitle.trim();
  }

  const universityPartners = partners.filter((p) => p.type === 'UNIVERSITY');
  const industryPartners = partners.filter((p) => p.type === 'INDUSTRY');

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#00001C]">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full min-h-[580px] md:h-[692px] bg-[#00001C] pt-36 pb-6 md:pt-44 md:pb-8 text-white overflow-hidden flex flex-col justify-end">
          <div className="absolute inset-0 z-0">
            {/* Dynamic background photo from Admin Dashboard (Blank by default) */}
            {bgImage && (
              <Image
                src={bgImage}
                alt={rawTitle}
                fill
                className="object-cover object-center opacity-30 brightness-75"
                priority
              />
            )}
            <div className="absolute inset-0 bg-[#0400CC]/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00001C] via-[#00001C]/50 to-transparent" />
          </div>

          {/* Main Content Container (at bottom of hero) */}
          <div className="max-w-[1280px] w-full mx-auto px-6 relative z-10 space-y-3 md:space-y-4 mt-auto pb-4 md:pb-8">
            {/* Badge / Pill */}
            <div>
              <div className="inline-flex items-center border border-white/20 bg-white/10 rounded-lg px-4 py-1.5 backdrop-blur-md shadow-sm">
                <span className="text-xs sm:text-sm font-bold tracking-widest text-[#EFFFFF]">
                  {heroSubtitle}
                </span>
              </div>
            </div>

            {/* Heading & Same-Row Discover Partners */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                {mainTitle}
              </h1>

              {/* Next line: 'with SIT' in the same row with DISCOVER PARTNERS in the middle */}
              <div className="relative flex items-end min-h-[52px] pt-1">
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-r from-[#EFFFFF] via-[#EFFFFF] to-[#EFFFFF]/70 bg-clip-text text-transparent">
                  {subTitleAccent}
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 bottom-1 flex flex-col items-center justify-center text-xs tracking-widest text-white/60 uppercase select-none pointer-events-none">
                  <span>{t.collaborations.discoverPartners}</span>
                  <div className="w-[1.5px] h-8 md:h-10 bg-gradient-to-b from-white/50 to-transparent mt-1.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* University Partners Section */}
        <section className="w-full bg-white py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Heading & Description */}
              <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center gap-2 text-[#0400CC] text-xs sm:text-sm font-bold tracking-widest uppercase">
                  <Globe className="w-4 h-4" />
                  <span>{t.collaborations.globalNetwork}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight leading-tight">
                  {t.collaborations.universityPartnersTitle}{' '}
                  <span className="text-[#0400CC]">{t.collaborations.universityPartnersHighlight}</span>
                </h2>

                <p className="text-base sm:text-lg text-[#4A5565] leading-relaxed">
                  {t.collaborations.universityPartnersDesc}
                </p>
              </div>

              {/* Right Column: Partners Grid (lg:col-span-8) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {universityPartners.map((u, idx) => {
                  const partnerName = isLa && u.nameLa ? u.nameLa : u.name;
                  const partnerCountry =
                    isLa && u.countryLa ? u.countryLa : u.country || t.collaborations.internationalPartner;

                  const cardContent = (
                    <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-[#0400CC] hover:shadow-lg transition-all duration-300 flex items-center gap-4 group h-full">
                      {/* Logo Container (replaces previous number index) */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-100 p-2.5 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#0400CC]/30 group-hover:bg-white group-hover:shadow-md transition-all duration-300 relative overflow-hidden">
                        {u.logoUrl ? (
                          <img
                            src={u.logoUrl}
                            alt={partnerName}
                            className="w-full h-full object-contain transition-transform"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.querySelector('.collab-logo-fallback');
                              if (fallback) fallback.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div
                          className={`collab-logo-fallback ${
                            u.logoUrl ? 'hidden' : ''
                          } text-[#0400CC] flex items-center justify-center`}
                        >
                          <Globe className="w-7 h-7 text-[#0400CC]/80" />
                        </div>
                      </div>

                      {/* Partner Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug">
                            {partnerName}
                          </h3>
                          {u.websiteUrl && (
                            <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-[#0400CC] transition-colors shrink-0 mt-0.5" />
                          )}
                        </div>
                        <p className="text-xs text-[#62748E] font-medium mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{partnerCountry}</span>
                        </p>
                      </div>
                    </div>
                  );

                  return u.websiteUrl ? (
                    <a
                      key={u.id || idx}
                      href={u.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block h-full cursor-pointer"
                    >
                      {cardContent}
                    </a>
                  ) : (
                    <div key={u.id || idx} className="h-full">
                      {cardContent}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Industry Alliances Section */}
        {industryPartners.length > 0 && (
          <section className="w-full bg-[#F5F7FA] py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6">
              <div className="flex items-center gap-2 text-[#0400CC] text-xs sm:text-sm font-bold tracking-widest uppercase mb-3">
                <Building2 className="w-4 h-4" />
                <span>{t.collaborations.industryAlliances}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase mb-12 space-y-1">
                <span className="block text-[#00001C]">{t.collaborations.industryTitle}</span>
                <span className="block text-[#0400CC]">{t.collaborations.industryHighlight}</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {industryPartners.map((item, idx) => {
                  const partnerName = isLa && item.nameLa ? item.nameLa : item.name;

                  const card = (
                    <div
                      key={item.id || idx}
                      className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:border-[#0400CC] hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center group min-h-[140px] h-full"
                    >
                      {item.logoUrl ? (
                        <div className="w-full h-16 flex items-center justify-center mb-3 p-1">
                          <img
                            src={item.logoUrl}
                            alt={partnerName}
                            className="max-h-14 max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2">
                          <Building2 className="w-6 h-6" />
                        </div>
                      )}
                      <span className="text-xs sm:text-sm font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-tight line-clamp-2">
                        {partnerName}
                      </span>
                    </div>
                  );

                  return item.websiteUrl ? (
                    <a
                      key={item.id || idx}
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block h-full cursor-pointer"
                    >
                      {card}
                    </a>
                  ) : (
                    <div key={item.id || idx} className="h-full">
                      {card}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <CTABanner />
      </main>

      <Footer />
    </div>
  );
}
