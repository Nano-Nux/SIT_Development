'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/home/CTABanner';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { api, DepartmentItem, ProgramDirectorItem, SpotlightItem, HeroItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function AcademicsPage() {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [directors, setDirectors] = useState<ProgramDirectorItem[]>([]);
  const [spotlights, setSpotlights] = useState<SpotlightItem[]>([]);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    Promise.all([
      api.getHero('ACADEMICS').catch(() => null),
      api.getDepartments().catch(() => []),
      api.getProgramDirectors().catch(() => []),
      api.getSpotlights().catch(() => []),
    ]).then(([heroRes, deptRes, dirRes, spotRes]) => {
      if (heroRes?.imageUrl && heroRes.imageUrl.trim() !== '') {
        setBgImage(heroRes.imageUrl.trim());
      }
      setDepartments(deptRes || []);
      setDirectors(dirRes || []);
      setSpotlights(spotRes || []);
      setLoading(false);
    });
  }, []);

  const heroSubtitle = t.academics.heroSubtitle;

  const rawTitle = t.academics.heroTitle || (isLa ? 'ຫຼັກສູດວິຊາການ ທີ່ SIT' : 'Academic Programs at SIT');

  let mainTitle = isLa ? 'ຫຼັກສູດວິຊາການ' : 'Academic Programs';
  let subTitleAccent = isLa ? 'ທີ່ SIT' : 'at SIT';

  if (rawTitle.toLowerCase().includes(' at sit')) {
    const parts = rawTitle.split(/ at sit/i);
    mainTitle = parts[0].trim();
    subTitleAccent = 'at SIT';
  } else if (rawTitle.includes(' ທີ່ SIT') || rawTitle.includes(' ທີ່ sit') || rawTitle.includes('ທີ່ SIT')) {
    const parts = rawTitle.split(/ ທີ່ SIT| ທີ່ sit|ທີ່ SIT/);
    mainTitle = parts[0].trim() || 'ຫຼັກສູດວິຊາການ';
    subTitleAccent = 'ທີ່ SIT';
  } else if (rawTitle === 'Academic Programs') {
    mainTitle = 'Academic Programs';
    subTitleAccent = 'at SIT';
  } else {
    mainTitle = rawTitle.trim();
  }

  // Find ALUMNI success spotlight as requested, falling back to any active spotlight
  const featuredSpotlight =
    spotlights.find((s) => s.type === 'ALUMNI' && s.isActive !== false) ||
    spotlights.find((s) => s.type === 'ALUMNI') ||
    spotlights.find((s) => s.isActive !== false) ||
    (spotlights.length > 0 ? spotlights[0] : null);

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#00001C]">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full min-h-[580px] md:h-[692px] bg-[#00001C] pt-36 pb-6 md:pt-44 md:pb-8 text-white overflow-hidden flex flex-col justify-end">
          {/* Background image & gradient overlay layers matching AcademicsHero.svg */}
          <div className="absolute inset-0 z-0">
            {/* 1. Base photo */}
            {bgImage && (
              <Image
                src={bgImage}
                alt="Academic Programs at SIT"
                fill
                className="object-cover object-center"
                priority
              />
            )}
            {/* 2. Blue overlay (#0400CC at 60% opacity) */}
            <div className="absolute inset-0 bg-[#0400CC]/60" />
            {/* 3. Dark gradient overlay from bottom to transparent top */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#00001C] via-[#00001C]/40 to-transparent" />
            {/* 4. Large SIT Logo Watermark Emblem (opacity 0.1, rotated 90deg on upper right) */}
            <div className="absolute -top-32 -right-32 md:-top-48 md:-right-24 w-[600px] h-[600px] md:w-[920px] md:h-[920px] opacity-10 pointer-events-none select-none z-0 rotate-90">
              <Image
                src="/images/academics_desktopview/img_2.png"
                alt="SIT Emblem Watermark"
                fill
                className="object-contain"
              />
            </div>
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

            {/* Heading & Same-Row Explore */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                {mainTitle}
              </h1>

              {/* Next line: 'at SIT' in the same row with EXPLORE in the middle */}
              <div className="relative flex items-end min-h-[52px] pt-1">
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-r from-[#EFFFFF] via-[#EFFFFF] to-[#EFFFFF]/70 bg-clip-text text-transparent">
                  {subTitleAccent}
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 bottom-1 flex flex-col items-center justify-center text-xs tracking-widest text-white/60 uppercase select-none pointer-events-none">
                  <span>{isLa ? 'ສຳຫຼວດ' : 'EXPLORE'}</span>
                  <div className="w-[1.5px] h-8 md:h-10 bg-gradient-to-b from-white/50 to-transparent mt-1.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Departments Section */}
        <section className="w-full bg-white py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight mb-12 uppercase">
              {t.academics.ourDepartments}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments
                .filter((dept) => dept.isActive !== false)
                .map((dept, idx) => (
                  <Link
                    key={dept.id || idx}
                    href={`/departments/${dept.slug}`}
                    className="group flex items-center justify-between p-6 sm:p-8 rounded-2xl border-b-2 border-slate-100 hover:border-[#0400CC] hover:bg-[#EFFFFF]/50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-1.5 pr-4">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors uppercase leading-snug">
                        {isLa ? (dept.nameLa || dept.name) : (dept.name || dept.nameLa)}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#62748E] font-medium line-clamp-2">
                        {isLa ? (dept.descriptionLa || dept.description) : (dept.description || dept.descriptionLa)}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#0400CC] flex items-center justify-center text-[#00001C] group-hover:text-white transition-all shrink-0">
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* Program Directors Section */}
        {directors.length > 0 && (
          <section className="w-full bg-[#EFFFFF] py-20 md:py-28 relative overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-6 relative z-10">
              <div className="mb-12">
                <span className="block text-xs md:text-sm font-bold tracking-widest text-[#0400CC] uppercase mb-2">
                  {t.nav.academics}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
                  {t.academics.programDirectors}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {directors.map((dir, idx) => (
                  <div
                    key={dir.id || idx}
                    className="group relative h-[380px] sm:h-[460px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-end p-6 sm:p-8 bg-[#00001C]"
                  >
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={dir.imageUrl || `/images/home_desktopview/img_${(idx % 2) + 1}.jpg`}
                        alt={dir.name}
                        fill
                        className="object-cover object-center opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00001C] via-[#00001C]/80 to-transparent z-10" />
                    <div className="relative z-20">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug group-hover:text-[#00B6FF] transition-colors">
                        {isLa ? (dir.nameLa || dir.name) : (dir.name || dir.nameLa)}
                      </h3>
                      <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mt-1">
                        {isLa ? (dir.positionLa || dir.position) : (dir.position || dir.positionLa)}
                      </p>
                      {(dir.biographyLa || dir.biography) && (
                        <p className="text-xs text-slate-300 line-clamp-2 mt-2 font-normal">
                          {isLa ? (dir.biographyLa || dir.biography) : (dir.biography || dir.biographyLa)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Faculty & Students Spotlight Section */}
        {featuredSpotlight && (() => {
          const spotSubtitle = isLa
            ? (featuredSpotlight.subtitleLa || featuredSpotlight.subtitle)
            : (featuredSpotlight.subtitle || featuredSpotlight.subtitleLa);
          const spotTitle = isLa
            ? (featuredSpotlight.titleLa || featuredSpotlight.title)
            : (featuredSpotlight.title || featuredSpotlight.titleLa);
          const spotDesc = isLa
            ? (featuredSpotlight.descriptionLa || featuredSpotlight.quoteLa || featuredSpotlight.description || featuredSpotlight.quote)
            : (featuredSpotlight.description || featuredSpotlight.quote || featuredSpotlight.descriptionLa || featuredSpotlight.quoteLa);
          const spotAuthor = isLa
            ? (featuredSpotlight.authorNameLa || featuredSpotlight.authorName)
            : (featuredSpotlight.authorName || featuredSpotlight.authorNameLa);
          const spotRole = isLa
            ? (featuredSpotlight.authorRoleLa || featuredSpotlight.authorRole)
            : (featuredSpotlight.authorRole || featuredSpotlight.authorRoleLa);
          const spotImage = featuredSpotlight.imageUrl;

          // Only render if there is actual content
          if (!spotSubtitle && !spotTitle && !spotDesc && !spotAuthor && !spotRole && !spotImage) {
            return null;
          }

          return (
            <section className="w-full bg-[#00001C] py-24 md:py-32 text-white relative overflow-hidden">
              <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-3">
                  {spotSubtitle && (
                    <span className="inline-block px-4 py-1 rounded-full bg-[#0400CC]/30 border border-[#00B6FF]/30 text-[#00B6FF] text-xs font-bold tracking-widest uppercase">
                      {spotSubtitle}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
                    {t.academics.spotlightTitle || 'FACULTY & STUDENTS SPOTLIGHT'}
                  </h2>
                </div>

                <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl text-[#00001C]">
                  {/* Top Image (only if imageUrl is present) */}
                  {spotImage && (
                    <div className="relative w-full h-72 sm:h-96">
                      <Image
                        src={spotImage}
                        alt={spotTitle || spotAuthor || 'Spotlight'}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  )}

                  <div className="p-8 sm:p-12 space-y-4">
                    {spotTitle && (
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#00001C] leading-snug uppercase">
                        {spotTitle}
                      </h3>
                    )}
                    {spotDesc && (
                      <p className="text-base sm:text-lg text-[#4A5565] leading-relaxed">
                        {spotDesc}
                      </p>
                    )}
                    {(spotAuthor || spotRole) && (
                      <div className="pt-2 text-sm text-[#62748E] font-medium">
                        {spotAuthor && (
                          <span className="font-bold text-[#00001C]">
                            {spotAuthor}
                          </span>
                        )}
                        {spotRole && (
                          <span>
                            {spotAuthor ? ' — ' : ''}
                            {spotRole}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="pt-4">
                      <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#0400CC] hover:underline"
                      >
                        {isLa ? 'ອ່ານເລື່ອງລາວເຕັມ' : 'Read Full Story'}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* CTA Banner */}
        <CTABanner />
      </main>

      <Footer />
    </div>
  );
}

