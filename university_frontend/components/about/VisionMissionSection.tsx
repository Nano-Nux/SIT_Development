'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Target, Lightbulb, Users, Award, Heart, Globe, TrendingUp, Shield, Rocket, Sparkles, BookOpen } from 'lucide-react';
import { api, VisionMissionInfo, CoreValue } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface VisionMissionProps {
  data?: VisionMissionInfo | null;
}

const iconComponentMap: Record<string, any> = {
  Lightbulb,
  Users,
  Award,
  Shield,
  Heart,
  Globe,
  Rocket,
  TrendingUp,
  Sparkles,
  BookOpen,
};

const defaultValues = [
  {
    icon: Lightbulb,
    titleKey: 'valInnovationTitle',
    descKey: 'valInnovationDesc',
  },
  {
    icon: Users,
    titleKey: 'valInclusivityTitle',
    descKey: 'valInclusivityDesc',
  },
  {
    icon: Award,
    titleKey: 'valExcellenceTitle',
    descKey: 'valExcellenceDesc',
  },
  {
    icon: Shield,
    titleKey: 'valIntegrityTitle',
    descKey: 'valIntegrityDesc',
  },
  {
    icon: Globe,
    titleKey: 'valGlobalTitle',
    descKey: 'valGlobalDesc',
  },
  {
    icon: Rocket,
    titleKey: 'valSustainabilityTitle',
    descKey: 'valSustainabilityDesc',
  },
];

export function VisionMissionSection({ data }: VisionMissionProps) {
  const [vmData, setVmData] = useState<VisionMissionInfo | null>(data || null);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (!data) {
      api.getVisionMission().then((res) => {
        if (res) setVmData(res);
      }).catch(console.error);
    }
    api.getCoreValues().then((res) => {
      if (res && res.length > 0) setCoreValues(res);
    }).catch(console.error);
  }, [data]);

  const vision = (isLa && vmData?.visionLa) ? vmData.visionLa : (vmData?.vision || t.about.visionText);
  const mission = (isLa && vmData?.missionLa) ? vmData.missionLa : (vmData?.mission || '');

  return (
    <section id="vision-mission" className="w-full bg-white py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header: Vision & Mission */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          {/* Double Icon (Eye & Target) */}
          <div className="flex items-center gap-3 mb-3 text-[#0400CC]">
            <div className="w-12 h-12 rounded-full border-2 border-[#0400CC] flex items-center justify-center">
              <Eye className="w-6 h-6 text-[#0400CC]" />
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-[#0400CC] flex items-center justify-center">
              <Target className="w-6 h-6 text-[#0400CC]" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
            Vision & <span className="text-[#0400CC]">Mission</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#4A5565] max-w-xl">
            {t.about.visionMissionSubtitle}
          </p>
          <div className="w-24 h-1 bg-[#0400CC] mt-4 rounded-full" />
        </div>

        {/* Vision & Mission 2-Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Our Vision Card (Dark Navy #00001C) */}
          <div className="bg-[#00001C] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#0400CC]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t.about.ourVision}
              </h3>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                {vision}
              </p>
            </div>
          </div>

          {/* Our Mission Card (White with 2px Blue Border) */}
          <div className="bg-white border-2 border-[#0400CC] rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#0400CC]/10 flex items-center justify-center text-[#0400CC]">
                <Target className="w-8 h-8 text-[#0400CC]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00001C]">
                {t.about.ourMission}
              </h3>
              {mission ? (
                <p className="text-base sm:text-lg text-[#4A5565] leading-relaxed">
                  {mission}
                </p>
              ) : (
                <ul className="space-y-4 text-base sm:text-lg text-[#4A5565] leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#0400CC] mt-2.5 shrink-0" />
                    <span>{t.about.missionBullet1}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#0400CC] mt-2.5 shrink-0" />
                    <span>{t.about.missionBullet2}</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Our Core Values Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
            {t.about.coreValuesTitle}{' '}
            <span className="text-[#0400CC]">{t.about.coreValuesHighlight}</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#4A5565] max-w-xl">
            {t.about.coreValuesSubtitle}
          </p>
          <div className="w-24 h-1 bg-[#0400CC] mt-4 rounded-full" />
        </div>

        {/* Core Values 6-Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.length > 0
            ? coreValues.map((val, idx) => {
                const title = (isLa && val.titleLa) ? val.titleLa : val.title;
                const desc = (isLa && val.descriptionLa) ? val.descriptionLa : val.description;
                const IconComp = (val.icon && iconComponentMap[val.icon]) || defaultValues[idx % defaultValues.length].icon;

                return (
                  <div
                    key={val.id || idx}
                    className="bg-[#F5F7FA] rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col items-start space-y-4 group hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0400CC] group-hover:bg-[#0400CC] group-hover:text-white transition-colors duration-300">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#00001C] leading-snug">
                      {title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#4A5565] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                );
              })
            : defaultValues.map((val, idx) => {
                const IconComp = val.icon;
                const title = (t.about as any)[val.titleKey];
                const desc = (t.about as any)[val.descKey];

                return (
                  <div
                    key={idx}
                    className="bg-[#F5F7FA] rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col items-start space-y-4 group hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0400CC] group-hover:bg-[#0400CC] group-hover:text-white transition-colors duration-300">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#00001C] leading-snug">
                      {title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#4A5565] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
