'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { api, MajorItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export function MajorsSection({ data }: { data?: any[] }) {
  const [majors, setMajors] = useState<any[]>(data || []);
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (!data || data.length === 0) {
      api.getDepartments().then((res) => {
        if (res && res.length > 0) {
          setMajors(res);
        } else {
          api.getMajors().then((mRes) => {
            if (mRes && mRes.length > 0) setMajors(mRes);
          }).catch(console.error);
        }
      }).catch(() => {
        api.getMajors().then((mRes) => {
          if (mRes && mRes.length > 0) setMajors(mRes);
        }).catch(console.error);
      });
    }
  }, [data]);

  if (majors.length === 0) return null;

  return (
    <section className="w-full bg-[#EFFFFF] py-20 md:py-28 relative overflow-hidden">
      {/* Background Lao floral motif */}
      <div className="absolute -right-20 bottom-0 w-[600px] h-[600px] pointer-events-none opacity-5">
        <Image
          src="/images/lao-pattern.png"
          alt="Lao Pattern"
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="block text-xs md:text-sm font-bold tracking-widest text-[#0400CC] uppercase mb-2">
              {t.home.academicPrograms}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
              {t.home.ourMajors}
            </h2>
          </div>
          <Link
            href="/academics"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-wider text-[#00001C] hover:text-[#0400CC] uppercase mt-4 sm:mt-0 transition-colors group"
          >
            <span>{t.home.viewAllPrograms}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Major Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {majors.map((major, idx) => {
            const title = (isLa && (major.nameLa || major.titleLa))
              ? (major.nameLa || major.titleLa)
              : (major.name || major.title);
            const description = (isLa && (major.descriptionLa))
              ? major.descriptionLa
              : major.description;
            const deptSlug =
              major.slug === 'information-technology'
                ? 'it'
                : major.slug === 'business-administration-economics'
                ? 'ba-economics'
                : major.slug || 'it';
            const imgUrl = major.imageUrl || major.heroImage || `/images/home_desktopview/img_${(idx % 3) + 2}.jpg`;

            return (
              <Link
                key={major.id || idx}
                href={`/departments/${deptSlug}`}
                className="group relative h-[380px] sm:h-[460px] md:h-[520px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-end p-6 sm:p-8 bg-[#00001C]"
              >
                {/* Background Photo */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={imgUrl}
                    alt={title || 'SIT Major'}
                    fill
                    className="object-cover object-center opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#00001C] via-[#00001C]/80 to-transparent z-10" />

                {/* Card Content at Bottom */}
                <div className="relative z-20">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug group-hover:text-[#00B6FF] transition-colors">
                    {title}
                  </h3>
                  {description && (
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-2 font-normal">
                      {description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

