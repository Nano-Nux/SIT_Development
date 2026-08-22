'use client';

import React, { useState } from 'react';
import { CheckCircle2, GraduationCap, Globe, BookOpen } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { useLanguage } from '@/context/LanguageContext';

interface AdmissionRequirement {
  id: string;
  degreeLevel: string;
  degreeLevelLa?: string | null;
  title: string;
  titleLa?: string | null;
  description: string;
  descriptionLa?: string | null;
  requirementsList: string;
  requirementsListLa?: string | null;
}

interface RequirementsSectionProps {
  data?: AdmissionRequirement[];
}

export function RequirementsSection({ data = [] }: RequirementsSectionProps) {
  const [activeTab, setActiveTab] = useState<'Undergraduate' | 'Graduate' | 'International'>('Undergraduate');
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  const defaultReqs: AdmissionRequirement[] = [
    {
      id: '1',
      degreeLevel: 'Undergraduate',
      title: 'Undergraduate Program Requirements',
      description: 'Entry criteria for secondary school graduates seeking a Bachelor of Science or Bachelor of Arts degree at SIT.',
      requirementsList: JSON.stringify([
        'High School Diploma (BacII) with minimum Grade C or international equivalent (A-Levels, IB, GED)',
        'English Language Proficiency: IELTS 5.5+, TOEFL iBT 65+, or passing score on SIT English Placement Test',
        'Official high school academic transcripts for Grades 10, 11, and 12',
        'Copy of National Identification Card or Passport',
        'Two letters of recommendation from high school teachers or counselors',
        'Personal Statement / Motivation Letter (500 words)',
      ]),
    },
    {
      id: '2',
      degreeLevel: 'Graduate',
      title: 'Master’s Degree Requirements',
      description: 'Criteria for professionals and graduates pursuing an advanced Master of Science or MBA program.',
      requirementsList: JSON.stringify([
        'Accredited Bachelor’s Degree in a relevant field with a minimum cumulative GPA of 3.0 / 4.0',
        'English Proficiency: IELTS 6.5+ or TOEFL iBT 80+',
        'Official undergraduate degree certificate and complete academic transcripts',
        'Updated Curriculum Vitae (CV) demonstrating relevant work or research experience',
        'Two academic or professional letters of recommendation',
        'Statement of Research & Career Intent (800 words)',
      ]),
    },
    {
      id: '3',
      degreeLevel: 'International',
      title: 'International Student Admissions',
      description: 'Specific guidelines, visa assistance, and equivalency requirements for foreign applicants.',
      requirementsList: JSON.stringify([
        'Valid International Passport (minimum 1-year validity)',
        'Certified English translation of secondary school or university degree certificates',
        'Proof of English proficiency (IELTS, TOEFL, Duolingo English Test)',
        'Financial affidavit or bank statement verifying sufficient funds for tuition and living expenses',
        'Student Visa (Type E) application support provided upon acceptance',
      ]),
    },
  ];

  const items = data.length > 0 ? data : defaultReqs;
  const currentReq = items.find((r) => r.degreeLevel.toLowerCase() === activeTab.toLowerCase()) || items[0];

  let list: string[] = [];
  if (isLa && currentReq?.requirementsListLa) {
    try {
      list = JSON.parse(currentReq.requirementsListLa);
    } catch {
      list = [];
    }
  } else if (currentReq?.requirementsList) {
    try {
      list = JSON.parse(currentReq.requirementsList);
    } catch {
      list = [];
    }
  }

  const reqTitle = (isLa && currentReq?.titleLa) ? currentReq.titleLa : currentReq?.title;
  const reqDesc = (isLa && currentReq?.descriptionLa) ? currentReq.descriptionLa : currentReq?.description;

  return (
    <section className="py-20 sm:py-28 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.admissions.criteriaBadge}
          title={t.admissions.criteriaTitle}
          subtitle={t.admissions.criteriaSubtitle}
          align="center"
        />

        {/* Level Switcher Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-slate-200/80 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('Undergraduate')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'Undergraduate' ? 'bg-white text-[#0400CC] shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              {t.admissions.undergraduateTab}
            </button>
            <button
              onClick={() => setActiveTab('Graduate')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'Graduate' ? 'bg-white text-[#0400CC] shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {t.admissions.graduateTab}
            </button>
            <button
              onClick={() => setActiveTab('International')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'International' ? 'bg-white text-[#0400CC] shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              {t.admissions.internationalTab}
            </button>
          </div>
        </div>

        {/* Content Box */}
        {currentReq && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#00001C]">
                {reqTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                {reqDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                {t.admissions.mandatoryChecklist}
              </h4>
              <div className="space-y-3.5">
                {list.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0400CC] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
