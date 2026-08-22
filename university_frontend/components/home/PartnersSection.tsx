'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Globe2, ArrowRight, MapPin } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { api, PartnerItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface PartnersSectionProps {
  data?: PartnerItem[];
}

export function PartnersSection({ data = [] }: PartnersSectionProps) {
  const [partners, setPartners] = useState<PartnerItem[]>(data);
  const [tab, setTab] = useState<'ALL' | 'UNIVERSITY' | 'INDUSTRY'>('ALL');
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (data.length === 0) {
      api
        .getPartners()
        .then((res) => {
          if (res && res.length > 0) {
            setPartners(res);
          }
        })
        .catch(console.error);
    }
  }, [data]);

  const items = partners;
  const filtered = tab === 'ALL' ? items : items.filter((p) => p.type === tab);

  return (
    <section className="py-20 sm:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.home.partnersBadge}
          title={t.home.partnersTitle}
          subtitle={t.home.partnersSubtitle}
          align="center"
        />

        {/* Tab Buttons */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-200/70 p-1.5 rounded-xl">
            <button
              onClick={() => setTab('ALL')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                tab === 'ALL' ? 'bg-white text-[#0400CC] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.home.allPartners}
            </button>
            <button
              onClick={() => setTab('UNIVERSITY')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                tab === 'UNIVERSITY' ? 'bg-white text-[#0400CC] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.home.universityPartners}
            </button>
            <button
              onClick={() => setTab('INDUSTRY')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                tab === 'INDUSTRY' ? 'bg-white text-[#0400CC] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.home.industryLeaders}
            </button>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((partner, idx) => {
            const partnerName = isLa && partner.nameLa ? partner.nameLa : partner.name;
            const partnerCountry = isLa && partner.countryLa ? partner.countryLa : partner.country;

            const card = (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center group hover:border-[#0400CC]/40 hover:-translate-y-1 min-h-[160px] h-full">
                {/* Logo Container */}
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-white group-hover:border-[#0400CC]/30 group-hover:shadow-xs transition-all relative overflow-hidden shrink-0">
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partnerName}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.home-partner-fallback');
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div
                    className={`home-partner-fallback ${
                      partner.logoUrl ? 'hidden' : ''
                    } text-[#0400CC] flex items-center justify-center`}
                  >
                    {partner.type === 'UNIVERSITY' ? (
                      <Globe2 className="w-7 h-7 text-[#0400CC]" />
                    ) : (
                      <Building2 className="w-7 h-7 text-[#0400CC]" />
                    )}
                  </div>
                </div>

                {/* Partner Name */}
                <h4 className="text-xs sm:text-sm font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug line-clamp-2">
                  {partnerName}
                </h4>

                {/* Partner Country */}
                {partnerCountry && (
                  <span className="text-[11px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-slate-400" />
                    <span>{partnerCountry}</span>
                  </span>
                )}
              </div>
            );

            return partner.websiteUrl ? (
              <a
                key={partner.id || idx}
                href={partner.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="block h-full cursor-pointer"
              >
                {card}
              </a>
            ) : (
              <div key={partner.id || idx} className="h-full">
                {card}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/collaborations"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0400CC] hover:text-[#1E65FF] transition-colors"
          >
            <span>{t.home.learnMoreAlliances}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
