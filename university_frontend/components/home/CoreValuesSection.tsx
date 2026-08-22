'use client';

import React, { useState, useEffect } from 'react';
import { Lightbulb, Award, Globe, Users, Sparkles, BookOpen, Shield, Rocket, Heart, TrendingUp } from 'lucide-react';
import { api, CoreValueItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

const iconMap: Record<string, React.ReactNode> = {
  Lightbulb: <Lightbulb className="w-8 h-8 text-[#0400CC] stroke-[2]" />,
  Award: <Award className="w-8 h-8 text-[#0400CC] stroke-[2]" />,
  Globe: <Globe className="w-8 h-8 text-[#0400CC] stroke-[2]" />,
  Users: <Users className="w-8 h-8 text-[#0400CC] stroke-[2]" />,
  Sparkles: <Sparkles className="w-8 h-8 text-[#0400CC] stroke-[2]" />,
  BookOpen: <BookOpen className="w-8 h-8 text-[#0400CC] stroke-[2]" />,
  Shield: <Shield className="w-8 h-8 text-[#0400CC] stroke-[2]" />,
  Rocket: <Rocket className="w-8 h-8 text-[#0400CC] stroke-[2]" />,
  Heart: <Heart className="w-8 h-8 text-[#0400CC] stroke-[2]" />,
  TrendingUp: <TrendingUp className="w-8 h-8 text-[#0400CC] stroke-[2]" />,
};

export function CoreValuesSection({ data }: { data?: CoreValueItem[] }) {
  const [values, setValues] = useState<CoreValueItem[]>(data || []);
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (!data || data.length === 0) {
      api.getCoreValues().then((res) => {
        if (res && res.length > 0) {
          setValues(res);
        }
      }).catch(console.error);
    }
  }, [data]);

  if (values.length === 0) return null;

  return (
    <section className="w-full bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 text-center">
        {/* Section Header */}
        <div className="mb-16">
          <span className="block text-xs md:text-sm font-bold tracking-widest text-[#0400CC] uppercase mb-3">
            {t.home.whyChoose}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
            {t.home.coreValues}
          </h2>
        </div>

        {/* Dynamic Circular Badge Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8">
          {values.map((val, idx) => {
            const iconNode = (val.icon && iconMap[val.icon]) || (
              <Lightbulb className="w-8 h-8 text-[#0400CC] stroke-[2]" />
            );

            return (
              <div key={val.id || idx} className="flex flex-col items-center text-center group">
                {/* Circular Icon Container */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#EFFFFF] border border-[#0400CC]/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  {iconNode}
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#00001C] mb-3 leading-snug">
                  {(isLa && val.titleLa) ? val.titleLa : val.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-[#4A5565] leading-relaxed max-w-xs">
                  {(isLa && val.descriptionLa) ? val.descriptionLa : val.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

