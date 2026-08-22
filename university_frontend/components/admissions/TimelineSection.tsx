'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useLanguage } from '@/context/LanguageContext';

interface TimelineItem {
  id: string;
  intakeName: string;
  intakeNameLa?: string | null;
  intakeYear: string;
  openingDate: string | Date;
  closingDate: string | Date;
  status: string;
  statusLa?: string | null;
}

interface TimelineSectionProps {
  data?: TimelineItem[];
}

export function TimelineSection({ data = [] }: TimelineSectionProps) {
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  const defaultTimelines: TimelineItem[] = [
    {
      id: '1',
      intakeName: 'Fall Semester Intake 2026',
      intakeYear: '2026',
      openingDate: '2026-05-01',
      closingDate: '2026-09-30',
      status: 'Open Now',
    },
    {
      id: '2',
      intakeName: 'Spring Semester Intake 2027',
      intakeYear: '2027',
      openingDate: '2026-10-15',
      closingDate: '2027-02-15',
      status: 'Upcoming',
    },
    {
      id: '3',
      intakeName: 'Summer Intensive Term 2027',
      intakeYear: '2027',
      openingDate: '2027-03-01',
      closingDate: '2027-06-15',
      status: 'Upcoming',
    },
  ];

  const items = data.length > 0 ? data : defaultTimelines;

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.admissions.importantDatesBadge}
          title={t.admissions.deadlinesTitle}
          subtitle={t.admissions.deadlinesSubtitle}
          align="center"
        />

        <div className="space-y-4">
          {items.map((item, idx) => {
            const isOpen = item.status.toLowerCase().includes('open');
            const openDate = new Date(item.openingDate).toLocaleDateString(isLa ? 'lo-LA' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const closeDate = new Date(item.closingDate).toLocaleDateString(isLa ? 'lo-LA' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const intakeName = (isLa && item.intakeNameLa) ? item.intakeNameLa : item.intakeName;

            return (
              <div
                key={item.id || idx}
                className={`rounded-2xl p-6 sm:p-7 border transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
                  isOpen
                    ? 'bg-blue-50/50 border-blue-200 shadow-md'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      isOpen ? 'bg-[#0400CC] text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isOpen ? t.common.openNow : t.common.upcoming}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{t.admissions.year} {item.intakeYear}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#00001C]">
                    {intakeName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0400CC]" />
                      {t.admissions.opens} {openDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-red-500" />
                      {t.admissions.deadline} {closeDate}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  {isOpen ? (
                    <Link
                      href="/apply"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      {t.common.applyNow}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      href="/request-info"
                      className="w-full sm:w-auto inline-flex items-center justify-center text-xs font-semibold px-5 py-3 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
                    >
                      {t.admissions.notifyMe}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
