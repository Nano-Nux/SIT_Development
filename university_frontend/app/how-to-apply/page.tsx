'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import {
  AdmissionTimeline,
  ApplicationReminder,
  AdmissionRequirement,
  AdmissionFaq,
  ApplicationMaterial,
  Hero,
} from '@/lib/api/types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Bell,
  GraduationCap,
  Trophy,
  Users,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageSquare,
  Video,
  Download,
  MapPin,
  ArrowRight,
  Sparkles,
  FileText,
} from 'lucide-react';

export default function HowToApplyPage() {
  const { t, isLa } = useLanguage();

  const [heroData, setHeroData] = useState<Hero | null>(null);
  const [timelines, setTimelines] = useState<AdmissionTimeline[]>([]);
  const [reminders, setReminders] = useState<ApplicationReminder[]>([]);
  const [academicReqs, setAcademicReqs] = useState<AdmissionRequirement[]>([]);
  const [qualificationsReqs, setQualificationsReqs] = useState<AdmissionRequirement[]>([]);
  const [internationalReqs, setInternationalReqs] = useState<AdmissionRequirement[]>([]);
  const [faqs, setFaqs] = useState<AdmissionFaq[]>([]);
  const [materials, setMaterials] = useState<ApplicationMaterial[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [heroRes, timeRes, remRes, reqRes, faqRes, matRes] = await Promise.all([
          api.getHero('HOW_TO_APPLY').catch(() => null),
          api.getTimelines().catch(() => []),
          api.getReminders().catch(() => []),
          api.getRequirements().catch(() => []),
          api.getFaqs().catch(() => []),
          api.getMaterials().catch(() => []),
        ]);

        if (heroRes) setHeroData(heroRes);
        if (timeRes && timeRes.length > 0) setTimelines(timeRes);
        if (remRes && remRes.length > 0) setReminders(remRes);
        if (faqRes && faqRes.length > 0) setFaqs(faqRes);
        if (matRes && matRes.length > 0) setMaterials(matRes);

        if (reqRes && reqRes.length > 0) {
          setAcademicReqs(reqRes.filter((r) => !r.category || r.category === 'ACADEMIC'));
          setQualificationsReqs(reqRes.filter((r) => r.category === 'QUALIFICATIONS'));
          setInternationalReqs(reqRes.filter((r) => r.category === 'INTERNATIONAL'));
        }
      } catch (err) {
        console.error('Error fetching How To Apply data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const parseList = (jsonOrStr: any): string[] => {
    if (!jsonOrStr) return [];
    if (Array.isArray(jsonOrStr)) return jsonOrStr;
    try {
      const parsed = JSON.parse(jsonOrStr);
      return Array.isArray(parsed) ? parsed : [jsonOrStr];
    } catch {
      return [String(jsonOrStr)];
    }
  };

  const heroTitle = (isLa && heroData?.titleLa) || heroData?.title || t.howToApply.heroTitle;
  const heroSubtitle = (isLa && heroData?.subtitleLa) || heroData?.subtitle || t.howToApply.heroSubtitle;
  const heroDesc = (isLa && heroData?.descriptionLa) || heroData?.description || t.howToApply.heroDesc;
  const heroBg = heroData?.imageUrl?.trim() || null;

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#00001C] font-sans antialiased selection:bg-[#0400CC] selection:text-white">
      <Header />

      <main className="flex-grow">
        {/* ================= 1. HERO SECTION ================= */}
        <section className="relative w-full bg-[#00001C] pt-36 pb-24 md:pt-48 md:pb-36 text-white overflow-hidden">
          {heroBg ? (
            <div className="absolute inset-0 z-0">
              <Image
                src={heroBg}
                alt="SIT How to Apply"
                fill
                className="object-cover object-center opacity-30 brightness-75"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#00001C]/80 via-[#0400CC]/60 to-[#00001C]" />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[#0400CC]/35 rounded-full blur-3xl" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#00001C] via-[#0400CC]/15 to-[#00001C]" />
            </div>
          )}

          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10 space-y-10">
            <div className="max-w-3xl space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#00B6FF]" />
                <span className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase">
                  {heroSubtitle}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight uppercase leading-tight">
                {heroTitle}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed font-normal">
                {heroDesc}
              </p>
            </div>

            {/* 3 Glass Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 max-w-4xl">
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-[#00B6FF]">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {t.howToApply.rollingAdmissions}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {t.howToApply.rollingDesc}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-[#00B6FF]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {t.howToApply.avgTime}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {t.howToApply.avgTimeDesc}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-[#00B6FF]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {t.howToApply.noFee}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {t.howToApply.noFeeDesc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. APPLICATION TIMELINE ================= */}
        <section className="w-full bg-white py-20 md:py-28 border-b border-slate-200">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 space-y-16">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#EFFFFF] rounded-full px-4 py-1.5 shadow-sm">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0400CC]">
                  {t.howToApply.timelineBadge}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00001C] tracking-tight uppercase">
                APPLICATION <span className="text-[#0400CC]">TIMELINE</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                {t.howToApply.timelineDesc}
              </p>
            </div>

            {/* Timeline Cards - Full Width regardless of single or multiple items */}
            {(() => {
              const defaultTimelines: AdmissionTimeline[] = [
                {
                  id: 'tl-1',
                  intakeName: 'Fall Semester 2026',
                  intakeNameLa: 'ພາກຮຽນລະດູໃບໄມ້ຫຼົ່ນ 2026',
                  deadlineDate: '2026-08-15',
                  classesBeginDate: '2026-10-01',
                  additionalNotes: '• 1st of October will be starting date of class.\n• Placement Exam 7th of September',
                  additionalNotesLa: '• ວັນທີ 1 ຕຸລາ ຈະເປັນມື້ເລີ່ມຕົ້ນຮຽນ.\n• ສອບເສັງວັດລະດັບວັນທີ 7 ກັນຍາ',
                  status: 'Open Now',
                  statusLa: 'ເປີດຮັບສະໝັກແລ້ວ',
                  order: 1,
                },
                {
                  id: 'tl-2',
                  intakeName: 'Spring Semester 2027',
                  intakeNameLa: 'ພາກຮຽນລະດູໃບໄມ້ປົ່ງ 2027',
                  deadlineDate: '2027-01-15',
                  classesBeginDate: '2027-02-15',
                  additionalNotes: '• Early application scholarship discounts apply.\n• Placement Exam 20th of January',
                  additionalNotesLa: '• ໄດ້ຮັບສ່ວນຫຼຸດທຶນການສຶກສາສຳລັບຜູ້ສະໝັກໄວ.\n• ສອບເສັງວັດລະດັບວັນທີ 20 ມັງກອນ',
                  status: 'Upcoming',
                  statusLa: 'ກຳລັງຈະເປີດຮັບ',
                  order: 2,
                },
              ];

              const displayTimelines = timelines && timelines.length > 0 ? timelines : defaultTimelines;

              return (
                <div className="w-full space-y-8">
                  {displayTimelines.map((item, idx) => {
                    const intake = (isLa && item.intakeNameLa) || item.intakeName;
                    const status = (isLa && item.statusLa) || item.status || 'Open Now';
                    const deadline = item.deadlineDate
                      ? new Date(item.deadlineDate).toLocaleDateString(isLa ? 'lo-LA' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : item.closingDate
                        ? new Date(item.closingDate).toLocaleDateString(isLa ? 'lo-LA' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : 'August 15, 2026';

                    const begin = item.classesBeginDate
                      ? new Date(item.classesBeginDate).toLocaleDateString(isLa ? 'lo-LA' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : 'October 1, 2026';

                    const notes = (isLa && item.additionalNotesLa) || item.additionalNotes;

                    return (
                      <div
                        key={item.id || idx}
                        className="w-full bg-[#F5F7FA] rounded-3xl p-8 sm:p-10 md:p-12 border border-slate-200/90 shadow-sm border-l-8 border-l-[#0400CC] relative hover:shadow-md transition-all space-y-6 sm:space-y-8"
                      >
                        {/* Top Row: Icon + Title + Status Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#0400CC] shadow-sm shrink-0 border border-slate-100">
                              <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#00001C] tracking-tight">
                                {intake}
                              </h3>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs sm:text-sm rounded-full border border-emerald-200 shadow-sm inline-block">
                              {status}
                            </span>
                          </div>
                        </div>

                        {/* Dates Row: 2-column Balanced Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 sm:gap-12 pt-2">
                          <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#6A7282]">
                              {t.howToApply.appDeadline}
                            </p>
                            <p className="text-2xl sm:text-3xl font-black text-[#00001C]">
                              {deadline}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#6A7282]">
                              {t.howToApply.classesBegin}
                            </p>
                            <p className="text-2xl sm:text-3xl font-black text-[#00001C]">
                              {begin}
                            </p>
                          </div>
                        </div>

                        {/* Divider & Additional Notes */}
                        {notes && (
                          <div className="pt-6 sm:pt-8 border-t border-slate-300/80 space-y-3">
                            {notes.split('\n').filter(Boolean).map((line: string, nIdx: number) => (
                              <div key={nIdx} className="flex items-center gap-3 text-sm sm:text-base font-bold text-[#0400CC]">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#0400CC] shrink-0" />
                                <span>{line.replace(/^[•\-\*]\s*/, '')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* ================= 3. APPLICATION REMINDERS ================= */}
            {(() => {
              const defaultReminders: ApplicationReminder[] = [
                {
                  id: 'rem-1',
                  title: 'Early Application Advantage',
                  titleLa: 'ຂໍ້ໄດ້ປຽບຂອງການສະໝັກກ່ອນ',
                  description: 'Applicants who submit early receive priority consideration for merit scholarships and preferred course schedules.',
                  descriptionLa: 'ຜູ້ສະໝັກທີ່ສົ່ງເອກະສານກ່ອນ ຈະໄດ້ຮັບການພິຈາລະນາທຶນການສຶກສາ ແລະ ຕາຕະລາງຮຽນທີ່ຕ້ອງການກ່ອນ.',
                  order: 1,
                },
                {
                  id: 'rem-2',
                  title: 'Rolling Admissions Policy',
                  titleLa: 'ນະໂຍບາຍຮັບສະໝັກແບບຕໍ່ເນື່ອງ',
                  description: 'We review applications as they are received. Decisions are typically released within 2 to 4 weeks after all required materials are verified.',
                  descriptionLa: 'ພວກເຮົາກວດສອບໃບສະໝັກຕາມລຳດັບທີ່ໄດ້ຮັບ. ຜົນການພິຈາລະນາຈະແຈ້ງພາຍໃນ 2 ຫາ 4 ອາທິດຫຼັງຈາກກວດສອບເອກະສານຄົບຖ້ວນ.',
                  order: 2,
                },
                {
                  id: 'rem-3',
                  title: 'Placement Exam & Interview',
                  titleLa: 'ການສອບເສັງວັດລະດັບ ແລະ ສຳພາດ',
                  description: 'Shortlisted candidates may be invited for an English proficiency placement test and brief interview with faculty advisors.',
                  descriptionLa: 'ຜູ້ສະໝັກທີ່ຜ່ານການຄັດເລືອກເບື້ອງຕົ້ນ ອາດຈະໄດ້ຮັບການເຊື້ອເຊີນໃຫ້ເຂົ້າສອບເສັງພາສາອັງກິດ ແລະ ສຳພາດສັ້ນໆກັບອາຈານທີ່ປຶກສາ.',
                  order: 3,
                },
                {
                  id: 'rem-4',
                  title: 'Visa & Housing Support for International Students',
                  titleLa: 'ການສະໜັບສະໜູນວີຊາ ແລະ ທີ່ພັກສຳລັບນັກສຶກສາຕ່າງປະເທດ',
                  description: 'Dedicated international student advisors will guide you through visa processing, dorm bookings, and airport pick-up.',
                  descriptionLa: 'ທີ່ປຶກສານັກສຶກສາຕ່າງປະເທດຈະໃຫ້ຄຳແນະນຳຂັ້ນຕອນການຂໍວີຊາ, ຈອງຫໍພັກ ແລະ ຮັບສົ່ງສະໜາມບິນ.',
                  order: 4,
                },
              ];

              const displayReminders = reminders && reminders.length > 0 ? reminders : defaultReminders;

              return (
                <div className="w-full">
                  <div className="w-full bg-gradient-to-br from-[#EFFFFF] via-[#F8FFFF] to-white border border-[#0400CC]/20 rounded-3xl p-8 sm:p-10 md:p-12 space-y-8 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#0400CC] text-white flex items-center justify-center shadow-md shrink-0">
                        <Bell className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-[#00001C] tracking-tight uppercase">
                          {t.howToApply.remindersTitle}
                        </h3>
                      </div>
                    </div>

                    {/* Bullet List */}
                    <div className="space-y-4 pl-1">
                      {displayReminders.map((rem, idx) => {
                        const title = (isLa && rem.titleLa) || rem.title;
                        const desc = (isLa && rem.descriptionLa) || rem.description;

                        return (
                          <div key={rem.id || idx} className="flex items-start gap-3.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0400CC] shrink-0 mt-2 shadow-sm" />
                            <div className="leading-relaxed">
                              <span className="text-sm sm:text-base font-bold text-[#00001C]">
                                {title}:{' '}
                              </span>
                              <span className="text-xs sm:text-sm text-[#364153]">
                                {desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ================= 4. ADMISSION REQUIREMENTS ================= */}
        <section className="w-full bg-white py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 space-y-16">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 rounded-full px-4 py-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0400CC]">
                  {t.howToApply.requirementsBadge}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00001C] tracking-tight uppercase">
                ADMISSION <span className="text-[#0400CC]">REQUIREMENTS</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t.howToApply.requirementsDesc}
              </p>
            </div>

            {/* Requirement Cards */}
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Card 1: Academic Requirements */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
                <div className="bg-[#0400CC] p-6 sm:p-8 flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {t.howToApply.academicReqTitle}
                  </h3>
                </div>

                <div className="p-8 sm:p-10 space-y-8 divide-y divide-slate-100">
                  {academicReqs.map((req, idx) => {
                    const subtitle = (isLa && req.subtitleLa) || req.subtitle || (req.degreeLevel === 'Graduate' ? t.howToApply.gradSubtitle : t.howToApply.undergradSubtitle);
                    const list = parseList((isLa && req.requirementsListLa) || req.requirementsList);

                    return (
                      <div key={req.id || idx} className={`${idx > 0 ? 'pt-8' : ''} space-y-4`}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-5 bg-[#0400CC] rounded-full" />
                          <h4 className="text-lg sm:text-xl font-extrabold text-[#00001C]">
                            {subtitle}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {list.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-[#0400CC] shrink-0 mt-2" />
                              <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 2: Additional Qualifications */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
                <div className="bg-[#6366F1] p-6 sm:p-8 flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {t.howToApply.qualificationsTitle}
                  </h3>
                </div>

                <div className="p-8 sm:p-10 space-y-6">
                  {qualificationsReqs.map((req, idx) => {
                    const subtitle = (isLa && req.subtitleLa) || req.subtitle || t.howToApply.qualificationsSubtitle;
                    const list = parseList((isLa && req.requirementsListLa) || req.requirementsList);

                    return (
                      <div key={req.id || idx} className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-5 bg-[#6366F1] rounded-full" />
                          <h4 className="text-lg sm:text-xl font-extrabold text-[#00001C]">
                            {subtitle}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {list.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-[#6366F1] shrink-0 mt-2" />
                              <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 3: International Students */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
                <div className="bg-[#EC4899] p-6 sm:p-8 flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {t.howToApply.internationalTitle}
                  </h3>
                </div>

                <div className="p-8 sm:p-10 space-y-6">
                  {internationalReqs.map((req, idx) => {
                    const subtitle = (isLa && req.subtitleLa) || req.subtitle || t.howToApply.internationalSubtitle;
                    const list = parseList((isLa && req.requirementsListLa) || req.requirementsList);

                    return (
                      <div key={req.id || idx} className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-5 bg-[#EC4899] rounded-full" />
                          <h4 className="text-lg sm:text-xl font-extrabold text-[#00001C]">
                            {subtitle}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {list.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-[#EC4899] shrink-0 mt-2" />
                              <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 5. FREQUENTLY ASKED QUESTIONS ================= */}
        <section className="w-full bg-[#F5F7FA] py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 space-y-16">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 rounded-full px-4 py-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0400CC]">
                  {t.howToApply.faqBadge}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00001C] tracking-tight uppercase">
                FREQUENTLY ASKED <span className="text-[#0400CC]">QUESTIONS</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t.howToApply.faqDesc}
              </p>
            </div>

            {/* Accordion FAQ Items */}
            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                const question = (isLa && faq.questionLa) || faq.question;
                const answer = (isLa && faq.answerLa) || faq.answer;

                return (
                  <div
                    key={faq.id || idx}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen
                        ? 'bg-white border-blue-200 shadow-md ring-2 ring-[#0400CC]/10'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-6 sm:p-7 flex items-center justify-between text-left gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <HelpCircle className={`w-5 h-5 shrink-0 ${isOpen ? 'text-[#0400CC]' : 'text-slate-400'}`} />
                        <span className="text-base sm:text-lg font-bold text-[#00001C]">
                          {question}
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#0400CC] shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-0 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100">
                        <div className="pl-8 pt-3">{answer}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Still Have Questions? Banner */}
            <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#0400CC] to-[#00001C] p-8 sm:p-12 text-center text-white space-y-6 shadow-xl">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t.howToApply.stillHaveQuestions}
              </h3>
              <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
                {t.howToApply.stillHaveQuestionsDesc}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href="mailto:admissions@sit.edu.la"
                  className="px-8 py-3.5 bg-white text-[#0400CC] font-bold text-sm rounded-xl shadow-md hover:bg-slate-100 transition-all inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {t.howToApply.emailAdmissions}
                </a>
                <a
                  href="tel:+85621123456"
                  className="px-8 py-3.5 border-2 border-white text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {t.howToApply.callUs}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. APPLICATION SUPPORT ================= */}
        <section className="w-full bg-white py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 space-y-16">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 rounded-full px-4 py-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0400CC]">
                  {t.howToApply.supportBadge}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00001C] tracking-tight uppercase">
                APPLICATION <span className="text-[#0400CC]">SUPPORT</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t.howToApply.supportDesc}
              </p>
            </div>

            {/* Support Cards - Centered & Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
              {/* Card 1: Email Support */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border-t-4 border-t-[#0400CC] border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0400CC] flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#00001C]">{t.howToApply.emailSupport}</h3>
                  <p className="text-xs text-slate-500">{t.howToApply.emailSupportDesc}</p>
                  <p className="text-sm font-extrabold text-[#0400CC]">admissions@sit.edu.la</p>
                </div>
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400">{t.howToApply.emailSupportHours}</p>
                  <a
                    href="mailto:admissions@sit.edu.la"
                    className="w-full py-2.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-xs rounded-xl transition-all text-center block"
                  >
                    {t.howToApply.sendEmail}
                  </a>
                </div>
              </div>

              {/* Card 2: Phone Consultation */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border-t-4 border-t-[#0400CC] border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0400CC] flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#00001C]">{t.howToApply.phoneConsultation}</h3>
                  <p className="text-xs text-slate-500">{t.howToApply.phoneConsultationDesc}</p>
                  <p className="text-sm font-extrabold text-[#0400CC]">+856 21 123 456</p>
                </div>
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400">{t.howToApply.phoneHours}</p>
                  <a
                    href="tel:+85621123456"
                    className="w-full py-2.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-xs rounded-xl transition-all text-center block"
                  >
                    {t.howToApply.callNow}
                  </a>
                </div>
              </div>

              {/* Card 3: Live Chat */}
              {/* <div className="bg-white rounded-3xl p-6 sm:p-7 border-t-4 border-t-[#0400CC] border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0400CC] flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#00001C]">{t.howToApply.liveChat}</h3>
                  <p className="text-xs text-slate-500">{t.howToApply.liveChatDesc}</p>
                  <p className="text-sm font-extrabold text-[#0400CC]">Available on our website</p>
                </div>
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 whitespace-pre-line">{t.howToApply.liveChatHours}</p>
                  <Link
                    href="/contact"
                    className="w-full py-2.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-xs rounded-xl transition-all text-center block"
                  >
                    {t.howToApply.startChat}
                  </Link>
                </div>
              </div> */}

              {/* Card 4: Virtual Info Sessions */}
              {/* <div className="bg-white rounded-3xl p-6 sm:p-7 border-t-4 border-t-[#0400CC] border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0400CC] flex items-center justify-center">
                    <Video className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#00001C]">{t.howToApply.virtualInfo}</h3>
                  <p className="text-xs text-slate-500">{t.howToApply.virtualInfoDesc}</p>
                  <p className="text-sm font-extrabold text-[#0400CC]">Every Tuesday & Thursday</p>
                </div>
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 whitespace-pre-line">{t.howToApply.virtualInfoHours}</p>
                  <Link
                    href="/request-info"
                    className="w-full py-2.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-xs rounded-xl transition-all text-center block"
                  >
                    {t.howToApply.register}
                  </Link>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        {/* ================= 7. DOWNLOAD APPLICATION MATERIALS ================= */}
        <section className="w-full bg-[#F5F7FA] py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 space-y-16">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 rounded-full px-4 py-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0400CC]">
                  {t.howToApply.downloadBadge}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00001C] tracking-tight uppercase">
                DOWNLOAD APPLICATION <span className="text-[#0400CC]">MATERIALS</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t.howToApply.downloadDesc}
              </p>
            </div>

            {/* Dynamic Download Cards */}
            {(() => {
              const defaultMaterials: ApplicationMaterial[] = [
                {
                  id: 'mat-1',
                  title: 'Application Checklist',
                  titleLa: 'ລາຍການກວດສອບການສະໝັກ',
                  description: "Download our comprehensive PDF checklist to ensure you don't miss anything.",
                  descriptionLa: 'ດາວໂຫຼດລາຍການກວດສອບ PDF ທີ່ຄົບຖ້ວນຂອງພວກເຮົາ ເພື່ອໃຫ້ແນ່ໃຈວ່າທ່ານບໍ່ພາດເອກະສານໃດໆ.',
                  fileUrl: '/uploads/documents/sit_application_checklist.pdf',
                  fileType: 'PDF',
                  fileSize: '2.3 MB',
                  icon: 'Download',
                  badgeColor: '#00001C',
                  order: 1,
                },
                {
                  id: 'mat-2',
                  title: 'Full Admission Details',
                  titleLa: 'ລາຍລະອຽດການຮັບສະໝັກຄົບຊຸດ',
                  description: 'Tips and examples for crafting a compelling personal statement and application packet.',
                  descriptionLa: 'ຄຳແນະນຳ ແລະ ຕົວຢ່າງສຳລັບການຂຽນໃບສະແດງເຈດຈຳນົງ ແລະ ຊຸດເອກະສານການສະໝັກ.',
                  fileUrl: '/uploads/documents/sit_full_admission_details.pdf',
                  fileType: 'PDF',
                  fileSize: '1.8 MB',
                  icon: 'BookOpen',
                  badgeColor: '#0400CC',
                  order: 2,
                },
                {
                  id: 'mat-3',
                  title: 'Document Requirements',
                  titleLa: 'ເງື່ອນໄຂເອກະສານປະກອບ',
                  description: 'Detailed list of all required documents with formatting and translation guidelines.',
                  descriptionLa: 'ລາຍການລະອຽດຂອງເອກະສານທີ່ຈຳເປັນທັງໝົດ ພ້ອມທັງຄຳແນະນຳການຈັດຮູບແບບ ແລະ ການແປ.',
                  fileUrl: '/uploads/documents/sit_document_requirements.pdf',
                  fileType: 'PDF',
                  fileSize: '1.5 MB',
                  icon: 'Download',
                  badgeColor: '#6366F1',
                  order: 3,
                },
                {
                  id: 'mat-4',
                  title: 'Payment Plan',
                  titleLa: 'ແຜນການຊຳລະຄ່າຮຽນ',
                  description: 'Special guide for international and local applicants with scholarship options and fee schedules.',
                  descriptionLa: 'ຄູ່ມືພິເສດສຳລັບຜູ້ສະໝັກ ພ້ອມດ້ວຍທາງເລືອກທຶນການສຶກສາ ແລະ ຕາຕະລາງການຊຳລະຄ່າທຳນຽມ.',
                  fileUrl: '/uploads/documents/sit_payment_plan.pdf',
                  fileType: 'PDF',
                  fileSize: '3.2 MB',
                  icon: 'BookOpen',
                  badgeColor: '#A855F7',
                  order: 4,
                },
              ];

              const displayList = materials && materials.length > 0 ? materials : defaultMaterials;

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {displayList.map((item, idx) => {
                    const title = (isLa && item.titleLa) ? item.titleLa : item.title;
                    const desc = (isLa && item.descriptionLa) ? item.descriptionLa : item.description;
                    const headerColor = item.badgeColor || '#0400CC';
                    const isBook = item.icon === 'BookOpen';
                    const fileFormat = item.fileType || 'PDF';
                    const sizeText = item.fileSize ? `, ${item.fileSize}` : '';
                    const downloadUrl = item.fileUrl || '#';

                    return (
                      <div
                        key={item.id || idx}
                        className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                      >
                        {/* Header Banner */}
                        <div
                          style={{ backgroundColor: headerColor }}
                          className="p-6 text-white flex items-center gap-4 transition-transform"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                            {isBook ? <BookOpen className="w-6 h-6" /> : <Download className="w-6 h-6" />}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                              {title}
                            </h3>
                            <span className="text-xs text-white/80 font-medium">
                              {fileFormat}{sizeText}
                            </span>
                          </div>
                        </div>

                        {/* Content & Action */}
                        <div className="p-6 sm:p-8 space-y-6 flex-grow flex flex-col justify-between">
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {desc}
                          </p>

                          <a
                            href={downloadUrl}
                            download={item.title ? `${item.title.replace(/\s+/g, '_')}.${fileFormat.toLowerCase()}` : true}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-xs sm:text-sm rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                            <span>{t.howToApply.downloadGuide}</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* ================= 8. VISIT OUR ADMISSIONS OFFICE ================= */}
            <div className="max-w-5xl mx-auto bg-white rounded-3xl border-l-8 border-l-[#0400CC] border border-slate-200/90 shadow-md p-8 sm:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] tracking-tight">
                    {t.howToApply.visitOfficeTitle}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t.howToApply.visitOfficeDesc}
                  </p>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-[#00001C] block uppercase tracking-wider text-xs">
                        {t.howToApply.location}
                      </span>
                      <span className="text-slate-600">{t.howToApply.locationVal}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#00001C] block uppercase tracking-wider text-xs">
                        {t.howToApply.walkInHours}
                      </span>
                      <span className="text-slate-600 whitespace-pre-line leading-relaxed">
                        {t.howToApply.walkInVal}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative h-56 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                    <Image
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
                      alt="SIT Admissions Office"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Link
                    href="/contact#map"
                    className="w-full py-3.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-xs sm:text-sm rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <MapPin className="w-4 h-4" />
                    {t.howToApply.getDirections}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 9. CTA BANNER ================= */}
        <section className="w-full bg-[#0400CC] py-20 md:py-24 text-white text-center">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {t.howToApply.ctaTitle}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {t.howToApply.ctaDesc}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/apply"
                className="px-10 py-4 bg-white text-[#0400CC] font-bold text-sm sm:text-base rounded-xl shadow-xl hover:bg-slate-100 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                {t.howToApply.applyNow}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/request-info"
                className="px-10 py-4 border-2 border-white text-white font-bold text-sm sm:text-base rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                {t.howToApply.requestInfo}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
