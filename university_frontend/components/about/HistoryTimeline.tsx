'use client';

import { useUiTranslation } from '@/context/useUiTranslation';

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
    titleZh: '创立与首个校区',
    description:
      'SIT was established with just 150 students and 20 faculty members in a renovated building in Vientiane. Dr. Soutsakan Phommachanh’s vision of creating a world-class tech university in Laos began to take shape.',
    descriptionLa:
      'SIT ໄດ້ຮັບການສ້າງຕັ້ງຂຶ້ນໂດຍມີນັກສຶກສາພຽງ 150 ຄົນ ແລະ ຄູອາຈານ 20 ທ່ານ ໃນນະຄອນຫຼວງວຽງຈັນ. ວິໄສທັດຂອງທ່ານ ດຣ. ສຸດສະຄອນ ພົມມະຈັນ ໃນການສ້າງມະຫາວິທະຍາໄລເຕັກໂນໂລຊີລະດັບໂລກໃນລາວໄດ້ເລີ່ມຕົ້ນຂຶ້ນ.',
    descriptionZh:
      'SIT 最初在万象一栋改建楼宇中创立，仅有150名学生与20名教师。Soutsakan Phommachanh 博士在老挝建设一流技术大学的愿景开始成形。',
    order: 1,
  },
  {
    year: '2012',
    title: 'First Accreditation',
    titleLa: 'ການຮັບຮອງວິທະຍາຖານະຄັ້ງທຳອິດ',
    titleZh: '首次认证',
    description:
      'Received national accreditation and launched our flagship Information Technology program. The first cohort of students began groundbreaking research in sustainable technology solutions.',
    descriptionLa:
      'ໄດ້ຮັບການຮັບຮອງມາດຕະຖານລະດັບຊາດ ແລະ ເປີດໂຕຫຼັກສູດເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ. ນັກສຶກສາລຸ້ນທຳອິດໄດ້ເລີ່ມຕົ້ນການຄົ້ນຄວ້າບຸກເບີກດ້ານນະວັດຕະກໍາເຕັກໂນໂລຊີທີ່ຍືນຍົງ.',
    descriptionZh:
      '获得国家认证，开设旗舰信息技术课程。首届学生开始开展可持续技术解决方案的创新研究。',
    order: 2,
  },
  {
    year: '2014',
    title: 'International Partnerships',
    titleLa: 'ການຮ່ວມມືສາກົນ',
    titleZh: '国际合作',
    description:
      'Established strategic partnerships with MIT, Stanford, and leading Asian universities. Student exchange programs and collaborative research initiatives began, bringing global perspectives to campus.',
    descriptionLa:
      'ສ້າງການພົວພັນຮ່ວມມືຍຸດທະສາດກັບມະຫາວິທະຍາໄລຊັ້ນນຳລະດັບສາກົນ. ໂຄງການແລກປ່ຽນນັກສຶກສາ ແລະ ການວິໄຈຮ່ວມໄດ້ເລີ່ມຕົ້ນຂຶ້ນ, ນຳເອົາທັດສະນະລະດັບໂລກມາສູ່ວິທະຍາເຂດ.',
    descriptionZh:
      '与 MIT、斯坦福及亚洲领先高校建立战略合作，启动学生交换与联合研究，为校园带来全球视野。',
    order: 3,
  },
  {
    year: '2016',
    title: 'First Graduation & Campus Expansion',
    titleLa: 'ພິທີມອບຮັບປະລິນຍາບັດຄັ້ງທຳອິດ & ຂະຫຍາຍວິທະຍາເຂດ',
    titleZh: '首届毕业典礼与校区扩建',
    description:
      'Celebrated the graduation of our first class of 120 students, with 95% employment rate. Opened the new Science & Engineering Complex, tripling our capacity and research facilities.',
    descriptionLa:
      'ສະເຫຼີມສະຫຼອງການຈົບການສຶກສາຂອງນັກສຶກສາລຸ້ນທຳອິດ 120 ຄົນ ດ້ວຍອັດຕາການມີວຽກເຮັດງານທຳ 95%. ເປີດອາຄານວິທະຍາສາດ & ວິສະວະກຳສາດໃໝ່, ເພີ່ມຂີດຄວາມສາມາດເປັນ 3 ເທົ່າ.',
    descriptionZh:
      '首届120名学生顺利毕业，就业率达95%。新的科学与工程综合楼投入使用，教学容量和研究设施扩大至原来的三倍。',
    order: 4,
  },
  {
    year: '2018',
    title: 'Innovation Hub Launch',
    titleLa: 'ເປີດໂຕສູນນະວັດຕະກຳ SIT Innovation Hub',
    titleZh: '创新中心启用',
    description:
      'Launched the SIT Innovation Hub and startup incubator, which has since supported over 100 student ventures. Three startups achieved unicorn status, putting Laos on the global tech map.',
    descriptionLa:
      'ເປີດສູນນະວັດຕະກຳ ແລະ ບົ່ມເພາະທຸລະກິດສະຕາດອັບ, ເຊິ່ງໄດ້ສະໜັບສະໜູນຫຼາຍກວ່າ 100 ໂຄງການນັກສຶກສາ, ຊ່ວຍຍົກລະດັບປະເທດລາວສູ່ແຜນທີ່ເຕັກໂນໂລຊີສາກົນ.',
    descriptionZh:
      'SIT 创新中心与创业孵化器投入使用，支持了100多个学生创业项目。其中三家企业成为独角兽，让老挝走上全球科技舞台。',
    order: 5,
  },
  {
    year: '2020',
    title: 'Regional Excellence Recognition',
    titleLa: 'ການຍອມຮັບຄວາມເປັນເລີດໃນພາກພື້ນ',
    titleZh: '区域卓越认可',
    description:
      'Ranked among Top 10 universities in Southeast Asia for Computer Science. Received the ASEAN Education Excellence Award for innovation in STEM education.',
    descriptionLa:
      'ຕິດອັນດັບ 1 ໃນ 10 ມະຫາວິທະຍາໄລຊັ້ນນຳໃນອາຊີຕາເວັນອອກສ່ຽງໃຕ້ດ້ານວິທະຍາສາດຄອມພິວເຕີ. ໄດ້ຮັບລາງວັນ ASEAN Education Excellence Award.',
    descriptionZh: '计算机科学跻身东南亚大学前10名，并凭借 STEM 教育创新获得东盟教育卓越奖。',
    order: 6,
  },
  {
    year: '2022',
    title: 'Research & AI Center',
    titleLa: 'ສູນວິໄຈ & ປັນຍາປະດິດ (AI Center)',
    titleZh: '研究与人工智能中心',
    description:
      'Opened the state-of-the-art AI Research Center and established partnerships with leading tech companies. Launched graduate programs in AI, Data Science, and Cybersecurity.',
    descriptionLa:
      'ເປີດສູນວິໄຈ AI ທີ່ທັນສະໄໝ ແລະ ສ້າງການຮ່ວມມືກັບບໍລິສັດເຕັກໂນໂລຊີຊັ້ນນຳ. ເປີດຫຼັກສູດປະລິນຍາໂທດ້ານ AI, Data Science ແລະ Cybersecurity.',
    descriptionZh:
      '先进的人工智能研究中心启用，并与领先科技企业建立合作。开设人工智能、数据科学和网络安全研究生课程。',
    order: 7,
  },
  {
    year: '2024',
    title: 'Global Campus Network',
    titleLa: 'ເຄືອຂ່າຍວິທະຍາເຂດທົ່ວໂລກ',
    titleZh: '全球校园网络',
    description:
      'Reached 5,000+ alumni across 50 countries. Opened satellite campuses in three major cities and launched online learning platforms reaching thousands of students regionally.',
    descriptionLa:
      'ມີສິດເກົ່າຫຼາຍກວ່າ 5,000 ຄົນໃນ 50 ປະເທດ. ເປີດເຄືອຂ່າຍວິທະຍາເຂດ ແລະ ລະບົບການຮຽນອອນລາຍທີ່ເຂົ້າເຖິງນັກສຶກສາຫຼາຍພັນຄົນໃນພາກພື້ນ.',
    descriptionZh:
      '校友超过5,000人，遍布50个国家。在三个主要城市开设分校区，并推出覆盖地区数千名学生的在线学习平台。',
    order: 8,
  },
  {
    year: '2026',
    title: 'Future Forward Initiative',
    titleLa: 'ຂໍ້ລິເລີ່ມແຫ່ງອະນາຄົດ Future Forward',
    titleZh: '面向未来计划',
    description:
      'Launching new programs in Quantum Computing, Sustainable Technology, and Biotech. Building the region’s most advanced research facilities and expanding scholarships for underrepresented students.',
    descriptionLa:
      'ເປີດຫຼັກສູດໃໝ່ດ້ານ Quantum Computing, ເຕັກໂນໂລຊີຍືນຍົງ ແລະ Biotech. ສ້າງສິ່ງອຳນວຍຄວາມສະດວກການວິໄຈທີ່ທັນສະໄໝທີ່ສຸດໃນພາກພື້ນ.',
    descriptionZh:
      '开设量子计算、可持续技术和生物科技新课程，建设地区先进研究设施，并扩大面向代表性不足学生群体的奖学金。',
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
  const tr = useUiTranslation();
  const [milestones, setMilestones] = useState<HistoryMilestone[]>(
    data && data.length > 0 ? data : defaultMilestones,
  );
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (!data || data.length === 0) {
      api
        .getHistory()
        .then((res) => {
          if (res && res.length > 0) {
            setMilestones(res);
          }
        })
        .catch(console.error);
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
              const title =
                lang === 'ZH'
                  ? item?.titleZh || item.title
                  : isLa && item.titleLa
                    ? item.titleLa
                    : item.title;
              const description =
                lang === 'ZH'
                  ? item?.descriptionZh || item.description
                  : isLa && item.descriptionLa
                    ? item.descriptionLa
                    : item.description;
              const icon = milestoneIcons[item.year] || (
                <Building className="w-5 h-5 text-[#0400CC]" />
              );

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
                          {tr(item.year)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#0400CC] mb-2 leading-snug">
                        {tr(title)}
                      </h3>

                      <p className="text-sm sm:text-base text-[#4A5565] leading-relaxed">
                        {tr(description)}
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
              {tr(
                isLa
                  ? 'ໃນປັດຈຸບັນ, SIT ຢືນຢັນຢ່າງພາກພູມໃຈໃນສິ່ງທີ່ເປັນໄປໄດ້ ເມື່ອການສຶກສາພົບກັບນະວັດຕະກຳ, ເມື່ອປະເພນີຕ້ອນຮັບຄວາມກ້າວໜ້າ, ແລະ ເມື່ອຊຸມຊົນຮ່ວມແຮງຮ່ວມໃຈສ້າງສິ່ງທີ່ຍິ່ງໃຫຍ່. ປະຫວັດສາດຂອງພວກເຮົາບໍ່ພຽງແຕ່ເປັນອະດີດເທົ່ານັ້ນ — ແຕ່ເປັນພື້ນຖານສຳລັບອະນາຄົດທີ່ສົດໃສຍິ່ງຂຶ້ນ.'
                  : tr(
                      'Today, SIT stands proud as a testament to what’s possible when education meets innovation, when tradition embraces progress, and when a community comes together to build something extraordinary. Our history is not just our past—it’s the foundation for an even brighter future.',
                    ),
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-4xl mx-auto">
            <div className="md:col-span-8 relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/about/history_campus_1.jpg"
                alt={tr('SIT Campus Main Building')}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="relative aspect-[16/10] md:aspect-auto md:flex-1 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/about/history_campus_2.jpg"
                  alt={tr('SIT Graduation')}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative aspect-[16/10] md:aspect-auto md:flex-1 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/about/history_campus_3.jpg"
                  alt={tr('SIT Student Coding')}
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
