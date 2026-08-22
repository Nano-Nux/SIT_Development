'use client';

import React from 'react';
import Link from 'next/link';
import { Award, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useLanguage } from '@/context/LanguageContext';

export function TuitionScholarships() {
  const { t } = useLanguage();

  const scholarships = [
    {
      title: 'Founder’s Academic Excellence Award',
      amount: 'Up to 100% Tuition Waiver',
      desc: 'Awarded to top-tier high school graduates with BacII Grade A or exceptional national academic achievements.',
    },
    {
      title: 'Women in Technology & STEM Scholarship',
      amount: '50% - 75% Tuition Grant',
      desc: 'Encouraging outstanding female scholars pursuing computing, AI, robotics, and engineering fields.',
    },
    {
      title: 'Need-Based Educational Access Grant',
      amount: '30% - 50% Tuition Subsidy',
      desc: 'Dedicated to talented scholars from provincial high schools and low-income families demonstrating high potential.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.admissions.tuitionBadge}
          title={t.admissions.tuitionTitle}
          subtitle={t.admissions.tuitionSubtitle}
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {scholarships.map((sch, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#0400CC]">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#00001C]">{sch.title}</h3>
                <span className="inline-block text-xs font-extrabold text-[#0400CC] bg-blue-50 px-3 py-1 rounded-full">
                  {sch.amount}
                </span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {sch.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#00001C] to-[#0400CC] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.admissions.questionsScholarships}
            </h3>
            <p className="text-sm text-slate-300">
              {t.admissions.questionsScholarshipsDesc}
            </p>
          </div>
          <Link
            href="/request-info"
            className="inline-flex items-center gap-2 bg-white text-[#0400CC] hover:bg-slate-100 font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg shrink-0 transition-all"
          >
            {t.admissions.inquireFinancialAid}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
