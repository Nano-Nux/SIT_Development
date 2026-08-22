'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { api, FounderInfo } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export function FounderSection({ data }: { data?: FounderInfo | null }) {
  const [founder, setFounder] = useState<FounderInfo | null>(data || null);
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (!data) {
      api.getFounder().then((res) => {
        if (res) setFounder(res);
      }).catch(console.error);
    }
  }, [data]);

  const name = (isLa && founder?.nameLa) ? founder.nameLa : (founder?.name || 'Dr. Soutsaka Bounmanit');
  const designation = (isLa && founder?.designationLa) ? founder.designationLa : (founder?.designation || 'Founder & President');
  const rawQuote = isLa ? (founder?.quoteLa || founder?.quote) : founder?.quote;
  const quote = typeof rawQuote === 'string' ? rawQuote.trim() : '';
  const imageUrl = founder?.imageUrl?.trim() || '/images/about/founder_portrait.jpg';

  const defaultBio = isLa
    ? `ຫຼັກສູດຂອງພວກເຮົາຖືກອອກແບບມາເພື່ອສ້າງຄວາມເຂັ້ມແຂງໃຫ້ນັກສຶກສາມີເຄື່ອງມືທີ່ຈຳເປັນເພື່ອຄວາມສຳເລັດໃນຂົງເຂດຕ່າງໆ ລວມທັງເຕັກໂນໂລຊີສຳລັບທຸລະກິດ, ການຄຸ້ມຄອງ, ການຕະຫຼາດດິຈິຕອນ, ການເງິນ ແລະ ການບັນຊີ.\n\nໜຶ່ງໃນຈຸດເດັ່ນຂອງຫຼັກສູດຂອງພວກເຮົາແມ່ນການເນັ້ນໃສ່ການນຳໃຊ້ຕົວຈິງ. ຜ່ານໂອກາດການຮຽນຮູ້ຈາກປະສົບການຕົວຈິງ, ຂໍ້ລິເລີ່ມການເປັນຜູ້ປະກອບການ ແລະ ໂຄງການແກ້ໄຂບັນຫາຕົວຈິງ, ນັກສຶກສາຂອງພວກເຮົາຈະໄດ້ພັດທະນາທັກສະຕົວຈິງທີ່ໄດ້ຮັບຄຸນຄ່າສູງໃນວົງການວິຊາຊີບ.\n\nຍິ່ງໄປກວ່ານັ້ນ, ຫຼັກສູດຂອງພວກເຮົາຍັງມອບໂອກາດທີ່ໜ້າຕື່ນເຕັ້ນສຳລັບການເປີດກວ້າງສູ່ລະດັບສາກົນ ຜ່ານໂຄງການແລກປ່ຽນໄລຍະສັ້ນ ແລະ ໄລຍະຍາວກັບມະຫາວິທະຍາໄລຄູ່ຮ່ວມງານຊັ້ນນຳຂອງພວກເຮົາ. ທັດສະນະລະດັບໂລກນີ້ບໍ່ພຽງແຕ່ເປີດກວ້າງວິໄສທັດເທົ່ານັ້ນ ແຕ່ຍັງປູກຝັງຄວາມເຂົ້າໃຈ ແລະ ການຮ່ວມມືຂ້າມວັດທະນະທຳ.\n\nທີ່ SIT, ພວກເຮົາຖືກຂັບເຄື່ອນດ້ວຍວິໄສທັດຮ່ວມກັນໃນການສົ່ງເສີມການເປັນຜູ້ປະກອບການ ແລະ ປະກອບສ່ວນເຂົ້າໃນການພັດທະນາແບບຍືນຍົງໃນພາກພື້ນຂອງພວກເຮົາ. ຜ່ານການບົ່ມເພາະກຸ່ມຜູ້ປະກອບການທີ່ມີຄວາມຫຼາກຫຼາຍ ແລະ ປ່ຽມດ້ວຍພອນສະຫວັນ, ພວກເຮົາຕັ້ງເປົ້າໝາຍທີ່ຈະສ້າງຜົນກະທົບທາງບວກຕໍ່ເສດຖະກິດທ້ອງຖິ່ນ ແລະ ສ້າງໂອກາດວຽກເຮັດງານທຳ. ຂ້າພະເຈົ້າຂໍເຊີນຊວນທ່ານຮ່ວມເດີນທາງໃນການເດີນທາງແຫ່ງການຫັນປ່ຽນນີ້ກັບພວກເຮົາທີ່ SIT ແລະ ເຂົ້າຮ່ວມຊຸມຊົນແຫ່ງການຮຽນຮູ້, ນັກນະວັດຕະກຳ ແລະ ຜູ້ນຳການປ່ຽນແປງ.`
    : `Our program is designed to empower students with the necessary tools for success in areas including technology for business, management, digital marketing, finance, and accounting.\n\nOne of the hallmarks of our program is its focus on real-world application. Through experiential learning opportunities, entrepreneurship initiatives, and problem-solving projects, our students develop practical skills that are highly valued in the professional sphere.\n\nFurthermore, our program offers exciting opportunities for international exposure through short and long-term exchange programs with our esteemed university partners. This global perspective not only broadens horizons but also nurtures cross-cultural understanding and collaboration.\n\nAt SiT, we are driven by a shared vision of fostering entrepreneurship and contributing to sustainable development in our region. By nurturing a diverse and talented pool of entrepreneurs, we aim to positively impact the local economy, and create job opportunities. I invite you to embark on this transformative journey with us at SiT and join our vibrant community of learners, innovators, and change-makers as we strive towards excellence together.`;

  const rawBiography = (isLa && founder?.biographyLa) ? founder.biographyLa : (founder?.biography || defaultBio);
  const biography = typeof rawBiography === 'string' && rawBiography.trim() ? rawBiography : defaultBio;
  const bioParagraphs = biography.split('\n\n').map((p) => p.trim()).filter(Boolean);

  return (
    <section id="founder" className="w-full bg-white py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          {/* Blue Figma Quote Icon (99) */}
          <div className="mb-3 text-[#0400CC]">
            <svg
              className="w-12 h-12 text-[#0400CC]"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 12C9.58 12 6 15.58 6 20C6 24.42 9.58 28 14 28C14 33 10 36 6 36V40C14 40 20 34 20 24V14C20 12.9 19.1 12 18 12H14ZM34 12C29.58 12 26 15.58 26 20C26 24.42 29.58 28 34 28C34 33 30 36 26 36V40C34 40 40 34 40 24V14C40 12.9 39.1 12 38 12H34Z"
                fill="#0400CC"
              />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
            {t.about.founderTitle}{' '}
            <span className="text-[#0400CC]">{t.about.founderHighlight}</span>
          </h2>
          <div className="w-24 h-1 bg-[#0400CC] mt-4 rounded-full" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Portrait & Title (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            <div className="relative w-full max-w-[380px] aspect-[3/4] mb-6">
              {/* Offset Blue Background Accent */}
              <div className="absolute inset-0 bg-[#0400CC] rounded-3xl translate-x-3 translate-y-3 z-0" />
              {/* Photo Card */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl z-10 bg-slate-100">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Caption */}
            <div className="text-center lg:text-left space-y-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00001C]">
                {name}
              </h3>
              <p className="text-sm sm:text-base font-bold text-[#0400CC] tracking-wider">
                {designation}
              </p>
              <p className="text-sm text-[#62748E] font-medium">
                Soutsaka Institute of Technology
              </p>
            </div>
          </div>

          {/* Right Column: Founder's Letter (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6 text-[#4A5565] text-base md:text-lg leading-relaxed relative">
            {/* Body Bio Paragraphs */}
            <div className="relative z-10 space-y-4">
              {bioParagraphs.map((paragraph, idx) => (
                <p key={idx} className="font-normal text-[#4A5565] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Featured Founder Quote (Only shown if quote is present from admin dashboard) */}
            {quote ? (
              <div className="relative z-10 mt-8 p-6 sm:p-8 bg-[#EFFFFF] border-l-4 border-[#0400CC] rounded-r-2xl space-y-3 shadow-sm">
                <p className="text-lg sm:text-xl font-bold text-[#00001C] italic leading-relaxed">
                  “{quote}”
                </p>
              </div>
            ) : null}

            {/* Founder Signoff */}
            <div className="relative z-10 pt-4 text-sm sm:text-base space-y-0.5 text-[#00001C]">
              <p className="font-bold">{name.replace('Dr. ', '')}</p>
              <p className="text-[#62748E]">{isLa ? 'ຜູ້ກໍ່ຕັ້ງ' : 'Founder'}</p>
              <p className="text-[#62748E]">Soutsaka Institute of Technology</p>
            </div>
          </div>
        </div>

        {/* Stats Block (Responsive for Mobile and Desktop matching SVG) */}
        <div className="mt-16 sm:mt-24 w-full bg-gradient-to-r from-[#00001C] via-[#0400CC] to-[#00001C] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/15">
            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {t.about.founderStat1Number}
              </span>
              <span className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300">
                {t.about.founderStat1Label}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-6 lg:pt-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {t.about.founderStat2Number}
              </span>
              <span className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300">
                {t.about.founderStat2Label}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-6 lg:pt-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {t.about.founderStat3Number}
              </span>
              <span className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300">
                {t.about.founderStat3Label}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-6 lg:pt-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {t.about.founderStat4Number}
              </span>
              <span className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300">
                {t.about.founderStat4Label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
