'use client';

import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Building2, Globe2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export function StatsSection() {
  const [statsData, setStatsData] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    api.getDashboardStats().then(setStatsData).catch(console.error);
  }, []);

  const totalPrograms = statsData?.programs || 4;
  const totalFaculty = statsData?.faculty || 12;
  const totalPartners = statsData?.partners || 8;

  const stats = [
    {
      number: '96%',
      label: t.home.statEmployment,
      desc: t.home.statEmploymentDesc,
      icon: <GraduationCap className="w-6 h-6 text-[#00B6FF]" />,
    },
    {
      number: `${totalPrograms}+`,
      label: t.home.statPrograms,
      desc: t.home.statProgramsDesc,
      icon: <Users className="w-6 h-6 text-[#00B6FF]" />,
    },
    {
      number: `${totalFaculty}+`,
      label: t.home.statFaculty,
      desc: t.home.statFacultyDesc,
      icon: <Building2 className="w-6 h-6 text-[#00B6FF]" />,
    },
    {
      number: `${totalPartners}+`,
      label: t.home.statPartners,
      desc: t.home.statPartnersDesc,
      icon: <Globe2 className="w-6 h-6 text-[#00B6FF]" />,
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#00001C] text-white relative overflow-hidden">
      {/* Background glow and subtle dot grid */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0400CC]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00B6FF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1E65FF_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 bg-white/10 text-[#00B6FF] border border-white/20">
            {t.home.statsBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.home.statsTitle}
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            {t.home.statsDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/5 rounded-2xl p-7 border border-white/10 backdrop-blur-sm hover:border-[#00B6FF]/40 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#0400CC] transition-all">
                {item.icon}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white group-hover:text-[#00B6FF] transition-colors mb-2">
                {item.number}
              </div>
              <h3 className="text-base font-bold text-slate-200 mb-2">{item.label}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
