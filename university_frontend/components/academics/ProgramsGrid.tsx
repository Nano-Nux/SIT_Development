'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useLanguage } from '@/context/LanguageContext';

interface Program {
  id: string;
  name: string;
  nameLa?: string | null;
  slug: string;
  degree: string;
  degreeLa?: string | null;
  duration: string;
  durationLa?: string | null;
  description: string;
  descriptionLa?: string | null;
  heroImage?: string | null;
  coreFocusAreas: string;
  coreFocusAreasLa?: string | null;
  department?: { id: string; name: string; nameLa?: string | null; slug: string } | null;
}

interface ProgramsGridProps {
  data?: Program[];
}

export function ProgramsGrid({ data = [] }: ProgramsGridProps) {
  const [degreeFilter, setDegreeFilter] = useState<'ALL' | 'BACHELOR' | 'MASTER'>('ALL');
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  const filtered = degreeFilter === 'ALL'
    ? data
    : data.filter((p) => p.degree.toUpperCase().includes(degreeFilter));

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <SectionHeader
            badge={t.academics.curriculumDirectory}
            title={t.academics.allDegreesTitle}
            subtitle={t.academics.allDegreesSubtitle}
            align="left"
            className="mb-0"
          />

          <div className="mt-6 sm:mt-0 flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setDegreeFilter('ALL')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                degreeFilter === 'ALL' ? 'bg-[#0400CC] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.academics.allDegreesFilter}
            </button>
            <button
              onClick={() => setDegreeFilter('BACHELOR')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                degreeFilter === 'BACHELOR' ? 'bg-[#0400CC] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.academics.bachelorFilter}
            </button>
            <button
              onClick={() => setDegreeFilter('MASTER')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                degreeFilter === 'MASTER' ? 'bg-[#0400CC] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.academics.masterFilter}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prog, idx) => {
            const name = (isLa && prog.nameLa) ? prog.nameLa : prog.name;
            const degree = (isLa && prog.degreeLa) ? prog.degreeLa : prog.degree;
            const duration = (isLa && prog.durationLa) ? prog.durationLa : prog.duration;
            const description = (isLa && prog.descriptionLa) ? prog.descriptionLa : prog.description;
            const deptName = prog.department ? ((isLa && prog.department.nameLa) ? prog.department.nameLa : prog.department.name) : null;

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
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={prog.heroImage || `/images/academics_desktopview/img_${(idx % 4) + 1}.jpg`}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0400CC] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                      {degree}
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#0400CC]" />
                        {duration}
                      </span>
                      {deptName && (
                        <span className="text-[#0400CC] font-bold bg-blue-50 px-2 py-0.5 rounded">
                          {deptName}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug">
                      {name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {description}
                    </p>

                    {focusAreas.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
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

                <div className="p-6 sm:p-7 pt-0 flex gap-3">
                  <Link
                    href={`/academics/${prog.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-[#0400CC] text-[#0400CC] hover:text-white text-xs font-bold py-3 rounded-xl border border-slate-200 hover:border-[#0400CC] transition-all cursor-pointer"
                  >
                    <span>{t.academics.viewCurriculum}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/apply"
                    className="inline-flex items-center justify-center bg-[#00001C] hover:bg-[#000030] text-white text-xs font-bold px-4 py-3 rounded-xl transition-all"
                  >
                    {t.academics.applyDegree}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
