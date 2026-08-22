'use client';

import React, { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import {
  ArrowRight,
  Clock,
  BookOpen,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Briefcase,
  User,
  Mail,
  Award,
} from 'lucide-react';
import { academicsApi, ProgramItem } from '@/lib/api';

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [program, setProgram] = useState<ProgramItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    academicsApi.getProgram(slug)
      .then(setProgram)
      .catch((err) => {
        console.error('Error fetching program:', err);
        setProgram(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-32 text-slate-400">
          {t.common.loading}
        </div>
        <Footer />
      </div>
    );
  }

  if (!program) {
    return notFound();
  }

  const programName = (isLa && program.nameLa) ? program.nameLa : program.name;
  const programDegree = (isLa && program.degreeLa) ? program.degreeLa : program.degree;
  const programDuration = (isLa && program.durationLa) ? program.durationLa : program.duration;
  const programDesc = (isLa && program.descriptionLa) ? program.descriptionLa : program.description;
  const deptName = program.department ? ((isLa && program.department.nameLa) ? program.department.nameLa : program.department.name) : null;

  let focusAreas: string[] = [];
  if (isLa && program.coreFocusAreasLa) {
    try {
      focusAreas = JSON.parse(program.coreFocusAreasLa);
    } catch {
      focusAreas = [];
    }
  } else if (program.coreFocusAreas) {
    try {
      focusAreas = JSON.parse(program.coreFocusAreas);
    } catch {
      focusAreas = [];
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#00001C] text-white overflow-hidden">
          <div className="absolute top-10 right-10 w-96 h-96 bg-[#0400CC]/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#00B6FF]/20 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-[#0400CC] text-white text-xs font-bold uppercase tracking-wider">
                  {programDegree}
                </span>
                {deptName && (
                  <span className="px-3.5 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-medium border border-white/20">
                    {deptName}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {programName}
              </h1>

              <div className="flex items-center gap-6 text-sm text-slate-300 font-medium">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00B6FF]" />
                  {t.departmentDetail.durationLabel} {programDuration}
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#00B6FF]" />
                  {t.departmentDetail.instructionLabel} English
                </span>
              </div>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {programDesc}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  {t.departmentDetail.applyDegree}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/request-info"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-xl border border-white/20 transition-all cursor-pointer"
                >
                  {t.departmentDetail.requestInformation}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Core Focus Areas & Curriculum Overview */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Details */}
              <div className="lg:col-span-8 space-y-12">
                <div>
                  <SectionHeader
                    badge={t.departmentDetail.curriculumStructureBadge}
                    title={t.departmentDetail.programOverviewTitle}
                    align="left"
                    className="mb-8"
                  />
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
                    {t.departmentDetail.programOverviewDesc}
                  </p>

                  {focusAreas.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {focusAreas.map((area, idx) => (
                        <div
                          key={idx}
                          className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 flex items-start gap-3.5"
                        >
                          <CheckCircle2 className="w-5 h-5 text-[#0400CC] shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-bold text-[#00001C]">{area}</h4>
                            <p className="text-xs text-slate-500 mt-1">{t.departmentDetail.coreModuleTrack}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Program Director Section */}
                {program.directors && program.directors.length > 0 && (
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-3xl p-8 border border-slate-200 space-y-6">
                    <h3 className="text-xl font-bold text-[#00001C]">
                      {t.departmentDetail.leadershipTitle}
                    </h3>
                    {program.directors.map((dir: any, idx: number) => {
                      const dirName = (isLa && dir.nameLa) ? dir.nameLa : dir.name;
                      const dirPos = (isLa && dir.positionLa) ? dir.positionLa : dir.position;
                      const dirBio = (isLa && dir.biographyLa) ? dir.biographyLa : dir.biography;

                      return (
                        <div key={dir.id || idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border-2 border-white shadow-md">
                            <img
                              src={dir.imageUrl || '/images/home_desktopview/img_5.jpg'}
                              alt={dirName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-[#00001C]">{dirName}</h4>
                            <p className="text-xs font-semibold text-[#0400CC]">{dirPos}</p>
                            <p className="text-xs sm:text-sm text-slate-600 mt-2">{dirBio}</p>
                            {dir.email && (
                              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-[#0400CC]" />
                                {dir.email}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Summary Card */}
              <div className="lg:col-span-4 sticky top-28 space-y-6">
                <div className="bg-[#F8FAFC] rounded-3xl p-7 border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-[#00001C] pb-4 border-b border-slate-200">
                    {t.departmentDetail.degreeQuickFacts}
                  </h3>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{t.departmentDetail.awardedDegree}</span>
                      <span className="font-bold text-[#00001C]">{programDegree}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{t.departmentDetail.programDuration}</span>
                      <span className="font-bold text-[#00001C]">{programDuration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{t.departmentDetail.instruction}</span>
                      <span className="font-bold text-[#00001C]">{t.departmentDetail.englishMedium}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{t.departmentDetail.studyMode}</span>
                      <span className="font-bold text-[#00001C]">{t.departmentDetail.fullTimeOnCampus}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{t.departmentDetail.nextIntake}</span>
                      <span className="font-bold text-[#0400CC]">{t.departmentDetail.fall2026}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <Link
                      href="/apply"
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      {t.departmentDetail.applyOnlineNow}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/request-info"
                      className="w-full inline-flex items-center justify-center text-xs font-semibold py-2.5 rounded-xl text-[#0400CC] border border-[#0400CC]/30 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      {t.departmentDetail.downloadSyllabusInquire}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
