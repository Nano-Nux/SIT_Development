'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Building, Award, Globe, Users, Rocket, Cpu } from 'lucide-react';
import { api, HistoryMilestone } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

const defaultMilestones: HistoryMilestone[] = [
  {
    year: '2010',
    title: 'Foundation & First Campus',
    titleLa: 'ການສ້າງຕັ້ງ & ວິທະຍາເຂດທຳອິດ',
    description: 'SIT was established with just 150 students and 20 faculty members in a renovated building in Vientiane. Dr. Soutsakan Phommachanh’s vision of creating a world-class tech university in Laos began to take shape.',
    descriptionLa: 'SIT ໄດ້ຮັບການສ້າງຕັ້ງຂຶ້ນໂດຍມີນັກສຶກສາພຽງ 150 ຄົນ ແລະ ຄູອາຈານ 20 ທ່ານ ໃນນະຄອນຫຼວງວຽງຈັນ. ວິໄສທັດຂອງທ່ານ ດຣ. ສຸດສະຄອນ ພົມມະຈັນ ໃນການສ້າງມະຫາວິທະຍາໄລເຕັກໂນໂລຊີລະດັບໂລກໃນລາວໄດ້ເລີ່ມຕົ້ນຂຶ້ນ.',
    order: 1,
  },
  {
    year: '2012',
    title: 'First Accreditation',
    titleLa: 'ການຮັບຮອງວິທະຍາຖານະຄັ້ງທຳອິດ',
    description: 'Received national accreditation and launched our flagship Information Technology program. The first cohort of students began groundbreaking research in sustainable technology solutions.',
    descriptionLa: 'ໄດ້ຮັບການຮັບຮອງມາດຕະຖານລະດັບຊາດ ແລະ ເປີດໂຕຫຼັກສູດເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ. ນັກສຶກສາລຸ້ນທຳອິດໄດ້ເລີ່ມຕົ້ນການຄົ້ນຄວ້າບຸກເບີກດ້ານນະວັດຕະກໍາເຕັກໂນໂລຊີທີ່ຍືນຍົງ.',
    order: 2,
  },
  {
    year: '2014',
    title: 'International Partnerships',
    titleLa: 'ການຮ່ວມມືສາກົນ',
    description: 'Established strategic partnerships with MIT, Stanford, and leading Asian universities. Student exchange programs and collaborative research initiatives began, bringing global perspectives to campus.',
    descriptionLa: 'ສ້າງການພົວພັນຮ່ວມມືຍຸດທະສາດກັບມະຫາວິທະຍາໄລຊັ້ນນຳລະດັບສາກົນ. ໂຄງການແລກປ່ຽນນັກສຶກສາ ແລະ ການວິໄຈຮ່ວມໄດ້ເລີ່ມຕົ້ນຂຶ້ນ, ນຳເອົາທັດສະນະລະດັບໂລກມາສູ່ວິທະຍາເຂດ.',
    order: 3,
  },
  {
    year: '2016',
    title: 'First Graduation & Campus Expansion',
    titleLa: 'ພິທີມອບຮັບປະລິນຍາບັດຄັ້ງທຳອິດ & ຂະຫຍາຍວິທະຍາເຂດ',
    description: 'Celebrated the graduation of our first class of 120 students, with 95% employment rate. Opened the new Science & Engineering Complex, tripling our capacity and research facilities.',
    descriptionLa: 'ສະເຫຼີມສະຫຼອງການຈົບການສຶກສາຂອງນັກສຶກສາລຸ້ນທຳອິດ 120 ຄົນ ດ້ວຍອັດຕາການມີວຽກເຮັດງານທຳ 95%. ເປີດອາຄານວິທະຍາສາດ & ວິສະວະກຳສາດໃໝ່, ເພີ່ມຂີດຄວາມສາມາດເປັນ 3 ເທົ່າ.',
    order: 4,
  },
  {
    year: '2018',
    title: 'Innovation Hub Launch',
    titleLa: 'ເປີດໂຕສູນນະວັດຕະກຳ SIT Innovation Hub',
    description: 'Launched the SIT Innovation Hub and startup incubator, which has since supported over 100 student ventures. Three startups achieved unicorn status, putting Laos on the global tech map.',
    descriptionLa: 'ເປີດສູນນະວັດຕະກຳ ແລະ ບົ່ມເພາະທຸລະກິດສະຕາດອັບ, ເຊິ່ງໄດ້ສະໜັບສະໜູນຫຼາຍກວ່າ 100 ໂຄງການນັກສຶກສາ, ຊ່ວຍຍົກລະດັບປະເທດລາວສູ່ແຜນທີ່ເຕັກໂນໂລຊີສາກົນ.',
    order: 5,
  },
  {
    year: '2020',
    title: 'Regional Excellence Recognition',
    titleLa: 'ການຍອມຮັບຄວາມເປັນເລີດໃນພາກພື້ນ',
    description: 'Ranked among Top 10 universities in Southeast Asia for Computer Science. Received the ASEAN Education Excellence Award for innovation in STEM education.',
    descriptionLa: 'ຕິດອັນດັບ 1 ໃນ 10 ມະຫາວິທະຍາໄລຊັ້ນນຳໃນອາຊີຕາເວັນອອກສ່ຽງໃຕ້ດ້ານວິທະຍາສາດຄອມພິວເຕີ. ໄດ້ຮັບລາງວັນ ASEAN Education Excellence Award.',
    order: 6,
  },
  {
    year: '2022',
    title: 'Research & AI Center',
    titleLa: 'ສູນວິໄຈ & ປັນຍາປະດິດ (AI Center)',
    description: 'Opened the state-of-the-art AI Research Center and established partnerships with leading tech companies. Launched graduate programs in AI, Data Science, and Cybersecurity.',
    descriptionLa: 'ເປີດສູນວິໄຈ AI ທີ່ທັນສະໄໝ ແລະ ສ້າງການຮ່ວມມືກັບບໍລິສັດເຕັກໂນໂລຊີຊັ້ນນຳ. ເປີດຫຼັກສູດປະລິນຍາໂທດ້ານ AI, Data Science ແລະ Cybersecurity.',
    order: 7,
  },
  {
    year: '2024',
    title: 'Global Campus Network',
    titleLa: 'ເຄືອຂ່າຍວິທະຍາເຂດທົ່ວໂລກ',
    description: 'Reached 5,000+ alumni across 50 countries. Opened satellite campuses in three major cities and launched online learning platforms reaching thousands of students regionally.',
    descriptionLa: 'ມີສິດເກົ່າຫຼາຍກວ່າ 5,000 ຄົນໃນ 50 ປະເທດ. ເປີດເຄືອຂ່າຍວິທະຍາເຂດ ແລະ ລະບົບການຮຽນອອນລາຍທີ່ເຂົ້າເຖິງນັກສຶກສາຫຼາຍພັນຄົນໃນພາກພື້ນ.',
    order: 8,
  },
  {
    year: '2026',
    title: 'Future Forward Initiative',
    titleLa: 'ຂໍ້ລິເລີ່ມແຫ່ງອະນາຄົດ Future Forward',
    description: 'Launching new programs in Quantum Computing, Sustainable Technology, and Biotech. Building the region’s most advanced research facilities and expanding scholarships for underrepresented students.',
    descriptionLa: 'ເປີດຫຼັກສູດໃໝ່ດ້ານ Quantum Computing, ເຕັກໂນໂລຊີຍືນຍົງ ແລະ Biotech. ສ້າງສິ່ງອຳນວຍຄວາມສະດວກການວິໄຈທີ່ທັນສະໄໝທີ່ສຸດໃນພາກພື້ນ.',
    order: 9,
  },
];

const milestoneIcons: Record<string, React.ReactNode> = {
  '2010': <Building className="w-5 h-5 text-[#0400CC]" />,
  '2012': <Award className="w-5 h-5 text-[#0400CC]" />,
  '2014': <Globe className="w-5 h-5 text-[#0400CC]" />,
  '2016': <Users className="w-5 h-5 text-[#0400CC]" />,
  '2018': <Rocket className="w-5 h-5 text-[#0400CC]" />,
  '2020': <Award className="w-5 h-5 text-[#0400CC]" />,
  '2022': <Building className="w-5 h-5 text-[#0400CC]" />,
  '2024': <Globe className="w-5 h-5 text-[#0400CC]" />,
  '2026': <Rocket className="w-5 h-5 text-[#0400CC]" />,
};

export function HistoryTimeline({ data }: { data?: HistoryMilestone[] }) {
  const [milestones, setMilestones] = useState<HistoryMilestone[]>(
    data && data.length > 0 ? data : defaultMilestones
  );
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (!data || data.length === 0) {
      api.getHistory().then((res) => {
        if (res && res.length > 0) {
          setMilestones(res);
        }
      }).catch(console.error);
    }
  }, [data]);

  return (
    <section id="history" className="w-full bg-[#F5F7FA] py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <div className="mb-3 text-[#0400CC]">
            <Calendar className="w-12 h-12 text-[#0400CC] stroke-[2]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
            {t.about.historyTitle}{' '}
            <span className="text-[#0400CC]">{t.about.historyHighlight}</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#4A5565] max-w-xl">
            {t.about.historySubtitle}
          </p>
          <div className="w-24 h-1 bg-[#0400CC] mt-4 rounded-full" />
        </div>

        {/* Timeline Structure */}
        <div className="relative">
          {/* Central Blue Line on Desktop */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-[#0400CC] hidden md:block" />

          {/* Left Blue Line on Mobile */}
          <div className="absolute left-4 top-4 bottom-4 w-1 bg-[#0400CC] block md:hidden" />

          <div className="space-y-10 md:space-y-16">
            {milestones.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const title = (isLa && item.titleLa) ? item.titleLa : item.title;
              const description = (isLa && item.descriptionLa) ? item.descriptionLa : item.description;
              const icon = milestoneIcons[item.year] || <Building className="w-5 h-5 text-[#0400CC]" />;

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  } pl-10 md:pl-0`}
                >
                  {/* Timeline Card */}
                  <div className="w-full md:w-[45%]">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#EFFFFF] flex items-center justify-center">
                          {icon}
                        </div>
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#00001C]">
                          {item.year}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#0400CC] mb-2 leading-snug">
                        {title}
                      </h3>

                      <p className="text-sm sm:text-base text-[#4A5565] leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>

                  {/* Central Node Dot on Desktop */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0400CC] border-4 border-white shadow hidden md:block z-10" />

                  {/* Left Node Dot on Mobile */}
                  <div className="absolute left-2.5 top-8 w-4 h-4 rounded-full bg-[#0400CC] border-4 border-white shadow block md:hidden z-10" />

                  {/* Spacer for opposite side on Desktop */}
                  <div className="hidden md:block w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Campus Gallery Showcase at Bottom of Timeline (Matching SVG) */}
        <div className="mt-20 pt-10 border-t border-slate-200/80">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-base sm:text-lg text-[#4A5565] leading-relaxed font-normal">
              {isLa
                ? 'ໃນປັດຈຸບັນ, SIT ຢືນຢັນຢ່າງພາກພູມໃຈໃນສິ່ງທີ່ເປັນໄປໄດ້ ເມື່ອການສຶກສາພົບກັບນະວັດຕະກຳ, ເມື່ອປະເພນີຕ້ອນຮັບຄວາມກ້າວໜ້າ, ແລະ ເມື່ອຊຸມຊົນຮ່ວມແຮງຮ່ວມໃຈສ້າງສິ່ງທີ່ຍິ່ງໃຫຍ່. ປະຫວັດສາດຂອງພວກເຮົາບໍ່ພຽງແຕ່ເປັນອະດີດເທົ່ານັ້ນ — ແຕ່ເປັນພື້ນຖານສຳລັບອະນາຄົດທີ່ສົດໃສຍິ່ງຂຶ້ນ.'
                : 'Today, SIT stands proud as a testament to what’s possible when education meets innovation, when tradition embraces progress, and when a community comes together to build something extraordinary. Our history is not just our past—it’s the foundation for an even brighter future.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-4xl mx-auto">
            <div className="md:col-span-8 relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/about/history_campus_1.jpg"
                alt="SIT Campus Main Building"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="relative aspect-[16/10] md:aspect-auto md:flex-1 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/about/history_campus_2.jpg"
                  alt="SIT Graduation"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative aspect-[16/10] md:aspect-auto md:flex-1 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/about/history_campus_3.jpg"
                  alt="SIT Student Coding"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
