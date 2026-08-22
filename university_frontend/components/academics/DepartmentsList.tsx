'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Laptop, Briefcase, Film, BookOpen } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useLanguage } from '@/context/LanguageContext';

interface Department {
  id: string;
  name: string;
  nameLa?: string | null;
  slug: string;
  description: string;
  descriptionLa?: string | null;
  heroImage?: string | null;
  programs?: any[];
}

interface DepartmentsListProps {
  data?: Department[];
}

export function DepartmentsList({ data = [] }: DepartmentsListProps) {
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  const defaultDepartments: Department[] = [
    {
      id: '1',
      name: t.nav.deptIT,
      slug: 'it',
      description: 'The Department of IT is dedicated to cultivating top-tier software engineers, AI specialists, cloud architects, and cybersecurity leaders.',
      heroImage: '/images/department_it_desktopview/img_1.jpg',
    },
    {
      id: '2',
      name: t.nav.deptBA,
      slug: 'ba-economics',
      description: 'Equipping future business titans, financial strategists, and innovative entrepreneurs with cutting-edge analytics and market insights.',
      heroImage: '/images/department_ba___economics_desktopview/img_1.jpg',
    },
    {
      id: '3',
      name: t.nav.deptCA,
      slug: 'communication-arts',
      description: 'Fostering innovative media creators, PR experts, and brand communicators equipped with state-of-the-art digital broadcast studios.',
      heroImage: '/images/department_communication_arts_desktopview/img_1.jpg',
    },
  ];

  const items = data.length > 0 ? data : defaultDepartments;

  const getDeptIcon = (slug: string) => {
    if (slug.includes('it') || slug.includes('tech')) return <Laptop className="w-6 h-6 text-[#0400CC]" />;
    if (slug.includes('bus') || slug.includes('econ')) return <Briefcase className="w-6 h-6 text-[#00B6FF]" />;
    return <Film className="w-6 h-6 text-[#0400CC]" />;
  };

  return (
    <section id="departments" className="py-20 sm:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.academics.ourDepartments}
          title="Centres of Specialized Teaching & Research"
          subtitle="Explore our specialized academic departments offering accredited undergraduate and graduate qualifications."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((dept, idx) => {
            const name = (isLa && dept.nameLa) ? dept.nameLa : dept.name;
            const description = (isLa && dept.descriptionLa) ? dept.descriptionLa : dept.description;

            return (
              <div
                key={dept.id || idx}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={dept.heroImage || `/images/academics_desktopview/img_${idx + 1}.jpg`}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md">
                      {getDeptIcon(dept.slug)}
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 space-y-3">
                    <h3 className="text-xl font-extrabold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug">
                      {name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-7 pt-0">
                  <Link
                    href={`/departments/${dept.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0400CC]/10 hover:bg-[#0400CC] text-[#0400CC] hover:text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-all cursor-pointer"
                  >
                    <span>{t.academics.exploreDeptHub}</span>
                    <ArrowRight className="w-4 h-4" />
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
