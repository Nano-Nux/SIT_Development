'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/home/CTABanner';
import { AdmissionsMajorsSection } from '@/components/admissions/AdmissionsMajorsSection';
import { FileText, UserCheck, MessageSquare, Send, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api, HeroItem } from '@/lib/api';
import { getLocalizedHeroText } from '@/lib/hero-content';

export default function AdmissionsPage() {
  const { lang, t } = useLanguage();
  const [heroData, setHeroData] = useState<HeroItem | null>(null);

  useEffect(() => {
    api.getHero('ADMISSIONS')
      .then((res) => {
        if (res) setHeroData(res);
      })
      .catch(() => setHeroData(null));
  }, []);

  const steps = [
    {
      step: t.admissions.step1Title,
      desc: t.admissions.step1Desc,
      icon: FileText,
    },
    {
      step: t.admissions.step2Title,
      desc: t.admissions.step2Desc,
      icon: UserCheck,
    },
    {
      step: t.admissions.step3Title,
      desc: t.admissions.step3Desc,
      icon: MessageSquare,
    },
    {
      step: t.admissions.step4Title,
      desc: t.admissions.step4Desc,
      icon: Send,
    },
  ];

  const heroSubtitle = getLocalizedHeroText(heroData, 'subtitle', lang, t.admissions.heroSubtitle);
  const welcomeHeading = getLocalizedHeroText(heroData, 'title', lang, t.admissions.welcomeHeading);
  const defaultDescription = [t.admissions.welcomeP1, t.admissions.welcomeP2].filter(Boolean).join('\n\n');
  const customDescription = getLocalizedHeroText(heroData, 'description', lang, defaultDescription);

  const showcaseImage = heroData?.imageUrl?.trim() || '/images/home_desktopview/img_1.jpg';

  const buttonText = getLocalizedHeroText(heroData, 'buttonText', lang);
  const buttonUrl = heroData?.buttonUrl || '/apply';

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#00001C]">
      <Header />

      <main className="flex-grow">
        {/* Intro / Hero Section */}
        <section className="w-full pt-36 pb-16 md:pt-44 md:pb-20 bg-white">
          <div className="max-w-[1000px] mx-auto px-6 text-center space-y-6">
            <div className="w-20 h-1 bg-[#0400CC] mx-auto rounded-full" />

            {heroSubtitle && (
              <span className="inline-block text-xs sm:text-sm font-bold tracking-widest text-[#0400CC] uppercase">
                {heroSubtitle}
              </span>
            )}

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#00001C] tracking-tight uppercase">
              {welcomeHeading.includes('ADMISSIONS') ? (
                <>
                  {welcomeHeading.replace('ADMISSIONS', '')} <span className="text-[#0400CC]">ADMISSIONS</span>
                </>
              ) : welcomeHeading.includes('ການຮັບສະໝັກນັກສຶກສາ') ? (
                <>
                  {welcomeHeading.replace('ການຮັບສະໝັກນັກສຶກສາ', '')} <span className="text-[#0400CC]">ການຮັບສະໝັກນັກສຶກສາ</span>
                </>
              ) : (
                welcomeHeading
              )}
            </h1>

            <div className="text-base sm:text-lg text-[#4A5565] leading-relaxed space-y-4 max-w-3xl mx-auto">
              {customDescription.split(/\n\s*\n/).map((paragraph, idx) => (
                <p key={idx} className={idx > 0 ? 'font-semibold text-[#00001C]' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>

            {buttonText && (
              <div className="pt-2">
                <Link
                  href={buttonUrl}
                  className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm uppercase tracking-wider"
                >
                  <span>{buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Wide Showcase Photo */}
        <section className="w-full max-w-[1280px] mx-auto px-6 pb-20">
          <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-3xl overflow-hidden shadow-2xl bg-slate-100">
            <Image
              src={showcaseImage}
              alt="SIT Admissions Showcase"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </section>

        {/* Admission Procedures Section */}
        <section className="w-full bg-[#F5F7FA] py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight uppercase">
                {t.admissions.proceduresTitle.includes('PROCEDURES') ? (
                  <>
                    {t.admissions.proceduresTitle.replace('PROCEDURES', '')} <span className="text-[#0400CC]">PROCEDURES</span>
                  </>
                ) : (
                  t.admissions.proceduresTitle
                )}
              </h2>
              <p className="text-base sm:text-lg text-[#4A5565] leading-relaxed">
                {t.admissions.proceduresDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-[#0400CC] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#EFFFFF] flex items-center justify-center text-[#0400CC]">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[#00001C] leading-snug">
                        {item.step}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4A5565] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="text-xs font-bold text-[#0400CC] tracking-wider uppercase flex items-center gap-1">
                      <span>STEP 0{idx + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/how-to-apply"
                className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg transition-all"
              >
                {t.admissions.viewDetailedGuide}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Our Majors Section */}
        <AdmissionsMajorsSection />

        {/* CTA Banner */}
        <CTABanner />
      </main>

      <Footer />
    </div>
  );
}
