'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Award, BookOpen } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { api, ProgramItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface ProgramsPreviewProps {
  data?: ProgramItem[];
}

export function ProgramsPreview({ data = [] }: ProgramsPreviewProps) {
  const [programs, setPrograms] = useState<ProgramItem[]>(data);
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (data.length === 0) {
      api.getPrograms().then((res) => {
        if (res && res.length > 0) {
          setPrograms(res);
        }
      }).catch(console.error);
    }
  }, [data]);

  const items = programs;

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.home.programsBadge}
          title={t.home.programsTitle}
          subtitle={t.home.programsSubtitle}
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((prog, idx) => {
            const progName = (isLa && prog.nameLa) ? prog.nameLa : prog.name;
            const progDegree = (isLa && prog.degreeLa) ? prog.degreeLa : prog.degree;
            const progDuration = (isLa && prog.durationLa) ? prog.durationLa : prog.duration;
            const progDesc = (isLa && prog.descriptionLa) ? prog.descriptionLa : prog.description;

            let focusAreas: string[] = [];
            if (isLa && prog.coreFocusAreasLa) {
              try {
                focusAreas = JSON.parse(prog.coreFocusAreasLa);
              } catch {
                focusAreas = [];
              }
            } else if (prog.coreFocusAreas) {
              try {
                focusAreas = JSON.parse(prog.coreFocusAreas);
              } catch {
                focusAreas = [];
              }
            }

            return (
              <div
                key={prog.id || idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={prog.heroImage || `/images/academics_desktopview/img_${idx + 1}.jpg`}
                      alt={progName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0400CC] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                      {progDegree}
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#0400CC]" />
                        {progDuration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-[#00B6FF]" />
                        {t.academics.fullTimeOnCampus}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug">
                      {progName}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {progDesc}
                    </p>

                    {focusAreas.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          {t.academics.coreFocusAreas}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {focusAreas.map((fa, fidx) => (
                            <span
                              key={fidx}
                              className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md"
                            >
                              {fa}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 sm:p-7 pt-0">
                  <Link
                    href={`/academics/${prog.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-[#0400CC] text-[#0400CC] hover:text-white text-xs sm:text-sm font-bold py-3 rounded-xl border border-slate-200 hover:border-[#0400CC] transition-all cursor-pointer"
                  >
                    <span>{t.home.viewCurriculumDetails}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/academics"
            className="inline-flex items-center gap-2 bg-[#00001C] hover:bg-[#000030] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all"
          >
            {t.home.exploreAllDegrees}
            <ArrowRight className="w-4 h-4 text-[#00B6FF]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
