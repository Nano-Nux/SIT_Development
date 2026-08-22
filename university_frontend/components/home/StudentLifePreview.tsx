'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Trophy, HeartHandshake, Palette, Rocket } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { api, StudentLifeItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

const defaultIcons = [
  <Rocket key="1" className="w-6 h-6 text-[#0400CC]" />,
  <Trophy key="2" className="w-6 h-6 text-[#00B6FF]" />,
  <Palette key="3" className="w-6 h-6 text-[#0400CC]" />,
  <HeartHandshake key="4" className="w-6 h-6 text-[#00B6FF]" />,
];

export function StudentLifePreview({ data }: { data?: StudentLifeItem[] }) {
  const [items, setItems] = useState<StudentLifeItem[]>(data || []);
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (!data || data.length === 0) {
      api.getStudentLife().then((res) => {
        if (res && res.length > 0) {
          setItems(res.slice(0, 4));
        }
      }).catch(console.error);
    }
  }, [data]);

  return (
    <section className="py-20 sm:py-28 bg-[#EFFFFF]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Collage */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-square bg-slate-200">
                <img
                  src="/images/life_at_sit_desktopview/img_1.jpg"
                  alt="Student Activities"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-square bg-slate-200 mt-6">
                <img
                  src="/images/life_at_sit_desktopview/img_2.jpg"
                  alt="Campus Innovation"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-[16/8] bg-slate-200">
              <img
                src="/images/life_at_sit_desktopview/img_3.jpg"
                alt="Student Life Collaboration"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#0400CC]/10 text-[#0400CC] border border-[#0400CC]/20">
              {t.home.studentLifeBadge}
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00001C] tracking-tight leading-tight">
              {t.home.studentLifeTitle}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t.home.studentLifeDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {items.map((h, idx) => {
                const itemTitle = (isLa && h.titleLa) ? h.titleLa : h.title;
                const itemDesc = (isLa && h.descriptionLa) ? h.descriptionLa : h.description;

                return (
                  <div
                    key={h.id || idx}
                    className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-[#EFFFFF] shrink-0">
                      {defaultIcons[idx % defaultIcons.length]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#00001C]">{itemTitle}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{itemDesc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <Link
                href="/life-at-sit"
                className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all"
              >
                {t.home.experienceStudentLife}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
