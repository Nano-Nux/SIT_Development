'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { api, FacultyMember } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export function FacultySection({ data }: { data?: FacultyMember[] }) {
  const [faculty, setFaculty] = useState<FacultyMember[]>(data || []);
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (!data || data.length === 0) {
      api.getFaculty({ isFeatured: true }).then((res) => {
        if (res && res.length > 0) {
          // Take all featured members without numerical limit
          const featured = res.filter((f) => Boolean(f.isFeatured));
          setFaculty(featured);
        } else {
          setFaculty([]);
        }
      }).catch(console.error);
    }
  }, [data]);

  if (faculty.length === 0) return null;

  return (
    <section className="w-full bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="block text-xs md:text-sm font-bold tracking-widest text-[#0400CC] uppercase mb-2">
              {t.home.mentorsBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
              {t.home.meetFaculty}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#4A5565] max-w-md leading-relaxed">
            {t.home.facultyDesc}
          </p>
        </div>

        {/* Dynamic Faculty Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {faculty.map((member, idx) => {
            const memberName = (isLa && member.nameLa) ? member.nameLa : member.name;
            const memberPosition = (isLa && member.positionLa) ? member.positionLa : member.position;
            const memberDept = (isLa && member.departmentNameLa) ? member.departmentNameLa : member.departmentName;

            return (
              <div key={member.id || idx} className="group flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-md group-hover:shadow-xl transition-all duration-300 mb-5">
                  <Image
                    src={member.imageUrl || '/images/home_desktopview/img_5.jpg'}
                    alt={memberName}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Text Info */}
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug">
                    {memberName}
                  </h3>
                  <p className="text-xs sm:text-[13px] font-extrabold tracking-wider text-[#0400CC] uppercase">
                    {memberPosition}
                  </p>
                  {memberDept && (
                    <p className="text-xs sm:text-sm text-[#62748E] font-medium pt-0.5">
                      {memberDept}
                    </p>
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

