'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, GraduationCap } from 'lucide-react';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface MajorItem {
  id?: string;
  name?: string;
  nameLa?: string;
  title?: string;
  titleLa?: string;
  slug?: string;
  description?: string;
  descriptionLa?: string;
  imageUrl?: string;
  heroImage?: string;
  programs?: any[];
}

export function AdmissionsMajorsSection({ initialData }: { initialData?: MajorItem[] }) {
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';
  const [majors, setMajors] = useState<MajorItem[]>(initialData || []);

  useEffect(() => {
    if (!initialData || initialData.length === 0) {
      // First try to fetch departments, fallback to majors
      api.getDepartments().then((deptRes) => {
        if (deptRes && deptRes.length > 0) {
          setMajors(deptRes);
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
  }, [initialData]);

  // Fallback data matching the 4 departments/majors from design_svgs
  const fallbackMajors: MajorItem[] = [
    {
      id: 'it',
      name: 'Information Technology',
      nameLa: 'ເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ',
      slug: 'it',
      description: 'Master software engineering, cloud architecture, AI integration, cybersecurity, and full-stack development with hands-on specialized lab environments.',
      descriptionLa: 'ສຶກສາການພັດທະນາຊອບແວ, ສະຖາປັດຕະຍະກຳຄລາວ, ປັນຍາປະດິດ, ຄວາມປອດໄພທາງໄຊເບີ ພ້ອມຫ້ອງທົດລອງສະເພາະດ້ານ.',
      imageUrl: '/images/home_desktopview/img_2.jpg',
    },
    {
      id: 'ba-economics',
      name: 'Business Administration & Economics',
      nameLa: 'ບໍລິຫານທຸລະກິດ ແລະ ເສດຖະສາດ',
      slug: 'ba-economics',
      description: 'Gain strategic business leadership, international financial mastery, entrepreneurial acumen, and econometric decision analysis skills.',
      descriptionLa: 'ສ້າງຄວາມເປັນຜູ້ນຳທຸລະກິດຍຸດທະສາດ, ການເງິນສາກົນ, ຄວາມເປັນຜູ້ປະກອບການ ແລະ ການວິເຄາະເສດຖະສາດ.',
      imageUrl: '/images/home_desktopview/img_3.jpg',
    },
    {
      id: 'communication-arts',
      name: 'Communication Arts',
      nameLa: 'ນິເທດສາດ ແລະ ສິລະປະການສື່ສານ',
      slug: 'communication-arts',
      description: 'Excel in digital media production, corporate PR storytelling, broadcast journalism, multimedia design, and strategic brand management.',
      descriptionLa: 'ໂດດເດັ່ນໃນການຜະລິດສື່ດິຈິທັລ, ການເລົ່າເລື່ອງປະຊາສຳພັນແບຣນ, ວາລະສານກະຈາຍສຽງ ແລະ ການອອກແບບມັລຕິມີເດຍ.',
      imageUrl: '/images/home_desktopview/img_4.jpg',
    },
    {
      id: 'startup-innovation',
      name: 'Global Startup & Tech Innovation',
      nameLa: 'ໂຄງການຜູ້ປະກອບການ ແລະ ນະວັດຕະກຳເທັກໂນໂລຊີ',
      slug: 'it',
      description: 'An elite accelerator curriculum designed for future founders, tech entrepreneurs, venture builders, and global product innovators.',
      descriptionLa: 'ຫຼັກສູດບົ່ມເພາະສຳລັບຜູ້ກໍ່ຕັ້ງທຸລະກິດລຸ້ນໃໝ່, ຜູ້ປະກອບການເທັກໂນໂລຊີ ແລະ ນັກສ້າງນະວັດຕະກຳລະດັບສາກົນ.',
      imageUrl: '/images/home_desktopview/img_5.jpg',
    },
  ];

  const displayList = majors.length > 0 ? majors : fallbackMajors;

  return (
    <section className="w-full bg-[#EFFFFF] py-20 md:py-28 relative overflow-hidden">
      {/* Background Lao floral motif watermark */}
      <div className="absolute -right-20 bottom-0 w-[600px] h-[600px] pointer-events-none opacity-5">
        <Image
          src="/images/lao-pattern.png"
          alt="Lao Pattern Motif"
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute -left-20 top-0 w-[400px] h-[400px] pointer-events-none opacity-5">
        <Image
          src="/images/lao-pattern.png"
          alt="Lao Pattern Motif"
          fill
          className="object-contain rotate-180"
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#0400CC]/20 text-[#0400CC] text-xs font-bold tracking-widest uppercase shadow-xs backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0400CC]" />
              <span>{t.admissions.ourMajorsSubtitle}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
              {isLa ? (
                t.admissions.ourMajors
              ) : (
                <>
                  OUR <span className="text-[#0400CC]">MAJORS</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#4A5565] leading-relaxed">
              {t.admissions.ourMajorsDesc}
            </p>
          </div>

          <Link
            href="/academics"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider text-[#0400CC] hover:text-[#0000CC] uppercase self-start md:self-end transition-all group bg-white/80 px-5 py-2.5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md"
          >
            <span>{t.admissions.viewAllPrograms}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Major Columns (Major Card Box + Separate View to Apply Button Outside) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayList.map((major, idx) => {
            const title = (isLa && (major.nameLa || major.titleLa))
              ? (major.nameLa || major.titleLa)
              : (major.name || major.title);
            const description = (isLa && major.descriptionLa)
              ? major.descriptionLa
              : major.description;
            
            const rawSlug = major.slug || '';
            const deptSlug =
              rawSlug === 'information-technology' || rawSlug === 'it'
                ? 'it'
                : rawSlug === 'business-administration-economics' || rawSlug === 'ba-economics'
                ? 'ba-economics'
                : rawSlug === 'communication-arts'
                ? 'communication-arts'
                : rawSlug || 'it';

            const programParam = encodeURIComponent(major.name || major.title || '');
            const applyLink = `/apply?major=${deptSlug}${programParam ? `&program=${programParam}` : ''}`;
            const detailLink = `/departments/${deptSlug}`;

            const imgUrl =
              major.imageUrl ||
              major.heroImage ||
              `/images/home_desktopview/img_${(idx % 4) + 2}.jpg`;

            return (
              <div
                key={major.id || idx}
                className="flex flex-col space-y-4"
              >
                {/* 1. Major Card Box (Linked to Department Details) */}
                <Link
                  href={detailLink}
                  className="group relative h-[380px] sm:h-[420px] md:h-[460px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-end p-6 sm:p-7 bg-[#00001C] border border-slate-200/50"
                >
                  {/* Background Photo */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={imgUrl}
                      alt={title || 'SIT Major'}
                      fill
                      className="object-cover object-center opacity-45 group-hover:opacity-65 group-hover:scale-110 transition-all duration-700"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00001C] via-[#00001C]/80 to-transparent z-10" />

                  {/* Card Content at Bottom */}
                  <div className="relative z-20 space-y-2.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-xs text-[#00B6FF] text-[11px] font-bold tracking-wider uppercase">
                      <GraduationCap className="w-3.5 h-3.5 text-[#00B6FF]" />
                      <span>{isLa ? 'ສາຂາວິຊາ' : 'MAJOR'}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug group-hover:text-[#00B6FF] transition-colors line-clamp-2">
                      {title}
                    </h3>

                    {description && (
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 font-normal leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>
                </Link>

                {/* 2. Standalone "View to Apply" Button Outside the Major Box */}
                <Link
                  href={applyLink}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 active:scale-[0.98] group"
                >
                  <span>{t.admissions.viewToApply}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
