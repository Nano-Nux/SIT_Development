'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/home/CTABanner';
import { useLanguage } from '@/context/LanguageContext';
import {
  Code,
  Database,
  Briefcase,
  Cpu,
  Layers,
  Globe,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  TrendingUp,
  Building2,
  Award,
  Code2,
} from 'lucide-react';
import { api, Department, ProgramItem, FacultyMember, BoxStatItem } from '@/lib/api';

interface DeptPageProps {
  params: Promise<{ slug: string }>;
}

export default function DepartmentDetailPage({ params }: DeptPageProps) {
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';
  const resolvedParams = use(params);
  const slug = resolvedParams.slug || 'it';
  const [department, setDepartment] = useState<(Department & { programs?: ProgramItem[]; faculty?: FacultyMember[] }) | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    api.getDepartment(slug)
      .then((res) => {
        setDepartment(res);
      })
      .catch((err) => {
        console.error('Failed to load department:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const parseJsonArray = (val: any): any[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const res = JSON.parse(val);
      return Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  };

  // 1. Title & URL Slug
  const title = (isLa && department?.nameLa) ? department.nameLa : (department?.name || department?.title || t.departmentDetail.departmentTitle);
  // 2. Description
  const description = (isLa && department?.descriptionLa) ? department.descriptionLa : (department?.description || t.departmentDetail.departmentDesc);
  const heroImage = department?.heroImage || department?.imageUrl || '/images/about_desktopview/img_1.jpg';
  const programs = department?.programs || [];
  const faculty = department?.faculty || [];

  // 3. Box-descriptions (Optional Hero Stats)
  const rawBoxes = (isLa && department?.boxDescriptionsLa) ? department.boxDescriptionsLa : department?.boxDescriptions;
  const heroBoxes: BoxStatItem[] = parseJsonArray(rawBoxes);

  const boxIcons = [Code2, Database, Briefcase, Cpu];

  // 4. Core Focus Areas
  const rawDeptFocus = (isLa && department?.coreFocusAreasLa) ? department.coreFocusAreasLa : department?.coreFocusAreas;
  let focusAreas: string[] = parseJsonArray(rawDeptFocus);

  if (focusAreas.length === 0) {
    // Fallback: extract focus areas dynamically from programs under this department
    programs.forEach((p) => {
      const rawAreas = (isLa && p.coreFocusAreasLa) ? p.coreFocusAreasLa : p.coreFocusAreas;
      if (rawAreas) {
        try {
          const parsed = JSON.parse(rawAreas);
          if (Array.isArray(parsed)) {
            focusAreas.push(...parsed);
          }
        } catch {
          // ignore
        }
      }
    });
  }
  focusAreas = Array.from(new Set(focusAreas));

  // 5. Career Outcome Description
  const careerOutcomeDesc = (isLa && department?.careerOutcomeDescLa) ? department.careerOutcomeDescLa : department?.careerOutcomeDesc;

  // 6. Career Outcomes Boxes (Optional)
  const placementRate = (isLa && department?.careerPlacementRateLa) ? department.careerPlacementRateLa : department?.careerPlacementRate;
  const avgSalary = (isLa && department?.careerAvgSalaryLa) ? department.careerAvgSalaryLa : department?.careerAvgSalary;
  const partnerCompanies = (isLa && department?.careerPartnerCompaniesLa) ? department.careerPartnerCompaniesLa : department?.careerPartnerCompanies;
  const timeToEmployment = (isLa && department?.careerTimeToEmploymentLa) ? department.careerTimeToEmploymentLa : department?.careerTimeToEmployment;

  const careerBoxes: { value: string; label: string; icon: any }[] = [];
  if (placementRate) careerBoxes.push({ value: placementRate, label: t.departmentDetail.jobPlacementRate, icon: Briefcase });
  if (avgSalary) careerBoxes.push({ value: avgSalary, label: t.departmentDetail.avgStartingSalary, icon: TrendingUp });
  if (partnerCompanies) careerBoxes.push({ value: partnerCompanies, label: t.departmentDetail.partnerCompanies, icon: Building2 });
  if (timeToEmployment) careerBoxes.push({ value: timeToEmployment, label: t.departmentDetail.avgTimeToEmployment, icon: Award });

  const hasCareerSection = Boolean(careerOutcomeDesc || careerBoxes.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#00001C]">
      <Header />

      <main className="flex-grow">
        {/* 1 & 2. Department Hero with Title, Description, and Optional 3. Box-Descriptions */}
        <section className="relative w-full bg-[#00001C] pt-36 pb-24 md:pt-48 md:pb-36 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt={title}
              fill
              className="object-cover object-center opacity-25 brightness-75"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#00001C]/80 via-[#0400CC]/70 to-[#00001C]" />
          </div>

          <div className="max-w-[1280px] mx-auto px-6 relative z-10 space-y-8">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="border border-white/30 rounded-md px-3 py-1 backdrop-blur-sm">
                  <span className="text-xs font-bold tracking-widest text-white uppercase">
                    {t.departmentDetail.departmentBadge}
                  </span>
                </div>
                <div className="w-12 h-[1px] bg-white/40" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl font-normal">
                {description}
              </p>
            </div>

            {/* 3. Optional Hero Stat Boxes (Only displayed if populated) */}
            {heroBoxes.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
                {heroBoxes.map((stat, idx) => {
                  const IconComponent = boxIcons[idx % boxIcons.length];
                  return (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col justify-between space-y-4 hover:bg-white/15 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#0400CC]/50 flex items-center justify-center text-white">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                          {stat.value}
                        </div>
                        <div className="text-xs font-bold tracking-wider text-white/70 uppercase mt-1">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 4. Core Focus Areas (Only displayed if populated) */}
        {focusAreas.length > 0 && (
          <section className="w-full bg-[#F5F7FA] py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
                  {t.departmentDetail.coreFocusAreas}
                </h2>
                <p className="text-base sm:text-lg text-[#4A5565] leading-relaxed">
                  {t.departmentDetail.coreFocusAreasDesc}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {focusAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-center font-bold text-sm sm:text-base text-[#00001C] hover:border-[#0400CC] hover:shadow-md hover:text-[#0400CC] transition-all min-h-[100px]"
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Academic Degree Programs in this Department */}
        {programs.length > 0 && (
          <section className="w-full bg-white py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6">
              <div className="mb-12">
                <span className="block text-xs md:text-sm font-bold tracking-widest text-[#0400CC] uppercase mb-2">
                  {t.departmentDetail.curriculumTracks}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
                  {t.departmentDetail.offeredPrograms}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {programs.map((prog, idx) => {
                  const progName = (isLa && prog.nameLa) ? prog.nameLa : prog.name;
                  const progDegree = (isLa && prog.degreeLa) ? prog.degreeLa : prog.degree;
                  const progDuration = (isLa && prog.durationLa) ? prog.durationLa : prog.duration;
                  const progDesc = (isLa && prog.descriptionLa) ? prog.descriptionLa : prog.description;

                  return (
                    <div
                      key={prog.id || idx}
                      className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-[#0400CC] transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0400CC] text-xs font-bold uppercase">
                          <span>{progDegree}</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#00001C] leading-snug">
                          {progName}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {progDesc}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-2">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#0400CC]" />
                            {progDuration}
                          </span>
                        </div>
                      </div>

                      <div className="pt-6">
                        <Link
                          href={`/academics/${prog.slug}`}
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0400CC] hover:text-[#0000CC]"
                        >
                          <span>{t.departmentDetail.viewProgramDetails}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 5 & 6. Career Outcomes Section (Optional - only displayed if populated) */}
        {hasCareerSection && (
          <section className="w-full bg-[#F8FAFC] py-20 md:py-28 border-t border-slate-200/60">
            <div className="max-w-[1280px] mx-auto px-6 space-y-16">
              {/* Header: Description */}
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
                  Career <span className="text-[#0400CC]">Outcomes</span>
                </h2>
                <p className="text-base sm:text-lg text-[#4A5565] leading-relaxed">
                  {careerOutcomeDesc || t.departmentDetail.careerOutcomesDescDefault}
                </p>
              </div>

              {/* 6. Career Outcomes Boxes */}
              {careerBoxes.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {careerBoxes.map((box, idx) => {
                    const IconComp = box.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#0400CC] transition-all flex flex-col items-center text-center space-y-4"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0400CC] flex items-center justify-center">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
                            {box.value}
                          </div>
                          <div className="text-xs font-bold tracking-wider text-slate-500 uppercase mt-2">
                            {box.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Launch Career Banner */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0400CC] to-[#000066] p-8 sm:p-12 text-white shadow-xl text-center space-y-6">
                <div className="max-w-2xl mx-auto space-y-3">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                    {t.departmentDetail.launchCareer}
                  </h3>
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                    {t.departmentDetail.launchCareerDesc}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <Link
                    href="/collaborations"
                    className="inline-flex items-center gap-2 bg-white text-[#00001C] hover:bg-slate-100 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow transition-all cursor-pointer uppercase"
                  >
                    <span>{t.departmentDetail.meetOurAlumni}</span>
                  </Link>
                  <Link
                    href="/apply"
                    className="inline-flex items-center gap-2 bg-transparent text-white hover:bg-white/10 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl border border-white/30 transition-all cursor-pointer uppercase"
                  >
                    <span>{t.departmentDetail.viewCareerSupport}</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Faculty in this department */}
        {faculty.length > 0 && (
          <section className="w-full bg-white py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6">
              <div className="mb-12">
                <span className="block text-xs md:text-sm font-bold tracking-widest text-[#0400CC] uppercase mb-2">
                  {t.departmentDetail.expertMentors}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
                  {t.departmentDetail.facultyAndScholars}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {faculty.map((member, idx) => {
                  const memberName = (isLa && member.nameLa) ? member.nameLa : member.name;
                  const memberPosition = (isLa && member.positionLa) ? member.positionLa : member.position;
                  const memberBio = (isLa && member.biographyLa) ? member.biographyLa : member.biography;

                  return (
                    <div key={member.id || idx} className="group flex flex-col">
                      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-md group-hover:shadow-xl transition-all duration-300 mb-5">
                        <Image
                          src={member.imageUrl || '/images/home_desktopview/img_5.jpg'}
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
                        {memberBio && (
                          <p className="text-xs text-[#62748E] font-medium pt-0.5 line-clamp-2">
                            {memberBio}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <CTABanner />
      </main>

      <Footer />
    </div>
  );
}
