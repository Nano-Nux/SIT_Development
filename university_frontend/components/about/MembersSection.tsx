'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { api, MemberItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

const defaultMembers: MemberItem[] = [
  {
    id: 'm-1',
    name: 'Dr. Sarah Jenkins',
    nameLa: 'ດຣ. ຊາຣາ ເຈນກິນສ໌',
    position: 'Vice Chairman & Academic Advisor',
    positionLa: 'ຮອງປະທານສະພາ ແລະ ທີ່ປຶກສາວິຊາການ',
    category: 'Board of Trustees',
    categoryLa: 'ສະພາພິບານ',
    imageUrl: '/images/about_desktopview/img_2.jpg',
  },
  {
    id: 'm-2',
    name: 'Prof. David Chen',
    nameLa: 'ສຈ. ເດວິດ ເຊນ',
    position: 'Member of University Council',
    positionLa: 'ກຳມະການສະພາມະຫາວິທະຍາໄລ',
    category: 'University Council',
    categoryLa: 'ສະພາມະຫາວິທະຍາໄລ',
    imageUrl: '/images/about_desktopview/img_3.jpg',
  },
  {
    id: 'm-3',
    name: 'Dr. Elena Rostova',
    nameLa: 'ດຣ. ເອເລນາ ໂຣສໂຕວາ',
    position: 'Member of University Council',
    positionLa: 'ກຳມະການສະພາມະຫາວິທະຍາໄລ',
    category: 'University Council',
    categoryLa: 'ສະພາມະຫາວິທະຍາໄລ',
    imageUrl: '/images/about_desktopview/img_4.jpg',
  },
  {
    id: 'm-4',
    name: 'Dr. Krisada Wannakring',
    nameLa: 'ດຣ. ກິດສະດາ ວັນນະກຣິງ',
    position: 'Dean, College of Engineering',
    positionLa: 'ຄະນະບໍດີ ຄະນະວິສະວະກຳສາດ',
    category: 'Board of Trustees',
    categoryLa: 'ສະພາພິບານ',
    imageUrl: '/images/about/member_default.jpg',
  },
];

export function MembersSection({ data }: { data?: MemberItem[] }) {
  const [members, setMembers] = useState<MemberItem[]>(data && data.length > 0 ? data : defaultMembers);
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (!data || data.length === 0) {
      Promise.all([
        api.getMembers(),
        api.getFounder().catch(() => null),
      ]).then(([res, founderRes]) => {
        if (res && res.length > 0) {
          const founderName = founderRes?.name?.toLowerCase().trim() || '';
          const founderNameLa = founderRes?.nameLa?.toLowerCase().trim() || '';

          // Filter out founder from members section
          const nonFounderMembers = res.filter((m: MemberItem) => {
            const mName = m.name?.toLowerCase().trim() || '';
            const mNameLa = m.nameLa?.toLowerCase().trim() || '';
            const mPos = m.position?.toLowerCase().trim() || '';
            const mPosLa = m.positionLa?.toLowerCase().trim() || '';
            const mCat = m.category?.toLowerCase().trim() || '';

            if (founderName && (mName === founderName || mName.includes(founderName) || founderName.includes(mName))) {
              return false;
            }
            if (founderNameLa && (mNameLa === founderNameLa || mNameLa.includes(founderNameLa) || founderNameLa.includes(mNameLa))) {
              return false;
            }
            if (mName.includes('mengly') || mName.includes('soutsaka')) {
              return false;
            }
            if (mPos.includes('founder') || mPosLa.includes('ຜູ້ກໍ່ຕັ້ງ') || mCat === 'founder') {
              return false;
            }
            return true;
          });

          setMembers(nonFounderMembers.length > 0 ? nonFounderMembers : defaultMembers);
        }
      }).catch(console.error);
    }
  }, [data]);

  return (
    <section id="members" className="w-full bg-white py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="block text-xs md:text-sm font-bold tracking-widest text-[#0400CC] uppercase mb-2">
              {t.home.mentorsBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
              {t.about.meetMembers}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#4A5565] max-w-md leading-relaxed">
            {t.home.facultyDesc}
          </p>
        </div>

        {/* Dynamic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, idx) => {
            const memberName = (isLa && member.nameLa) ? member.nameLa : member.name;
            const memberPosition = (isLa && member.positionLa) ? member.positionLa : member.position;
            const memberCategory = (isLa && member.categoryLa) ? member.categoryLa : member.category;

            return (
              <div key={member.id || idx} className="group flex flex-col">
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white shadow-md group-hover:shadow-xl transition-all duration-300 mb-5">
                  <Image
                    src={member.imageUrl || '/images/about/member_default.jpg'}
                    alt={memberName}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug">
                    {memberName}
                  </h3>
                  <p className="text-xs sm:text-[13px] font-extrabold tracking-wider text-[#0400CC] uppercase">
                    {memberPosition}
                  </p>
                  {memberCategory && (
                    <p className="text-xs sm:text-sm text-[#62748E] font-medium pt-0.5">
                      {memberCategory}
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
