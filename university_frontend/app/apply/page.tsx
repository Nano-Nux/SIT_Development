'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import {
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  User,
  BookOpen,
  Send,
  FileCheck,
  FileText,
  X,
  Loader2,
  Calendar,
  Phone,
  Mail,
  HelpCircle,
} from 'lucide-react';

function ApplyFormContent() {
  const { t, isLa } = useLanguage();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [uploadedDocs, setUploadedDocs] = useState<{ name: string; url: string }[]>([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    nationality: 'Lao',
    address: '',
    highSchool: '',
    graduationYear: '2026',
    gpa: '',
    englishScore: 'None / SIT Assessment',
    degreeLevel: 'Undergraduate',
    program: 'Bachelor of Computer Science',
    statement: '',
  });

  useEffect(() => {
    const majorParam = searchParams.get('major')?.toLowerCase();
    const programParam = searchParams.get('program');

    if (programParam) {
      const decoded = decodeURIComponent(programParam);
      const lower = decoded.toLowerCase();
      if (lower.includes('computer') || lower.includes('information') || lower.includes('it') || lower.includes('software')) {
        setFormData((prev) => ({ ...prev, program: 'Bachelor of Computer Science' }));
      } else if (lower.includes('business') || lower.includes('economic') || lower.includes('admin') || lower.includes('bba')) {
        setFormData((prev) => ({ ...prev, program: 'Bachelor of Business Administration' }));
      } else if (lower.includes('communication') || lower.includes('art') || lower.includes('media') || lower.includes('pr')) {
        setFormData((prev) => ({ ...prev, program: 'Bachelor of Communication Arts' }));
      } else if (lower.includes('startup') || lower.includes('innovation')) {
        setFormData((prev) => ({ ...prev, program: 'SIT Global Startup School Program' }));
      } else {
        setFormData((prev) => ({ ...prev, program: decoded }));
      }
    } else if (majorParam) {
      if (majorParam === 'it' || majorParam.includes('tech') || majorParam.includes('cs')) {
        setFormData((prev) => ({ ...prev, program: 'Bachelor of Computer Science' }));
      } else if (majorParam.includes('ba') || majorParam.includes('business') || majorParam.includes('econ')) {
        setFormData((prev) => ({ ...prev, program: 'Bachelor of Business Administration' }));
      } else if (majorParam.includes('comm') || majorParam.includes('art') || majorParam.includes('ca')) {
        setFormData((prev) => ({ ...prev, program: 'Bachelor of Communication Arts' }));
      } else if (majorParam.includes('startup')) {
        setFormData((prev) => ({ ...prev, program: 'SIT Global Startup School Program' }));
      }
    }
  }, [searchParams]);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingDoc(true);
    try {
      const res = await api.uploadFile(file);
      if (res && res.url) {
        setUploadedDocs((prev) => [...prev, { name: file.name, url: res.url }]);
      }
    } catch (err) {
      console.error('Document upload failed:', err);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploadingDoc(false);
      e.target.value = '';
    }
  };

  const handleRemoveDoc = (index: number) => {
    setUploadedDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const docUrls = uploadedDocs.map((d) => d.url);
      const docNotes =
        uploadedDocs.length > 0
          ? `\n\nUploaded Documents:\n` + uploadedDocs.map((d) => `- ${d.name}: ${d.url}`).join('\n')
          : '';

      await api.submitApplication({
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        nationality: formData.nationality,
        address: formData.address,
        highSchool: formData.highSchool,
        graduationYear: parseInt(formData.graduationYear) || 2026,
        gpa: formData.gpa,
        degreeLevel: formData.degreeLevel,
        program: formData.program,
        intendedProgram: formData.program,
        statement: (formData.statement || '') + docNotes,
        personalStatement: (formData.statement || '') + docNotes,
        documents: docUrls,
      });
      setSubmitted(true);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Application submission error:', err);
      setErrorMsg(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: t.apply.step1 },
    { num: 2, label: t.apply.step2 },
    { num: 3, label: t.apply.step3 },
    { num: 4, label: t.apply.step4 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FA] text-[#00001C] font-sans antialiased selection:bg-[#0400CC] selection:text-white overflow-x-hidden">
      <Header />

      <main className="flex-grow overflow-x-hidden">
        {/* ================= HERO SECTION ================= */}
        <section className="relative w-full bg-[#00001C] pt-32 pb-16 md:pt-44 md:pb-20 text-white overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-[600px] h-[500px] bg-[#0400CC]/40 rounded-full blur-[140px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#00001C]/60 via-[#0400CC]/10 to-[#00001C]" />
          </div>

          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 relative z-10 space-y-6">
            {/* Top Icon & Rule */}
            <div className="flex items-center gap-4">
              <GraduationCap className="w-8 h-8 md:w-9 md:h-9 text-white" strokeWidth={1.75} />
              <div className="w-16 h-[1.5px] bg-white/40" />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
              {t.apply.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/90 leading-relaxed font-normal max-w-3xl">
              {t.apply.heroDesc}
            </p>

            {/* 3 Inline Bullet Checkmarks */}
            <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-4 sm:gap-8 md:gap-12 pt-4">
              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-5 h-5 text-white shrink-0 stroke-[2.2]" />
                <span className="font-semibold text-sm sm:text-base tracking-wide">
                  {t.apply.rollingAdmissions}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-5 h-5 text-white shrink-0 stroke-[2.2]" />
                <span className="font-semibold text-sm sm:text-base tracking-wide">
                  {t.apply.noFee}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="w-5 h-5 text-white shrink-0 stroke-[2.2]" />
                <span className="font-semibold text-sm sm:text-base tracking-wide">
                  {t.apply.responseWeeks || 'Response in 2-3 Weeks'}
                </span>
              </div>
            </div>
          </div>

          {/* Signature Multi-stop Gradient Line Divider */}
          <div
            className="absolute bottom-0 left-0 w-full h-[4.5px] z-20"
            style={{
              background:
                'linear-gradient(90deg, #0400CC 0%, #1646D7 7.14%, #3A6AE1 14.28%, #5F8AEA 21.42%, #86A8F1 28.57%, #ADC5F7 35.71%, #D5E2FC 42.85%, #FFFFFF 50%, #D5E2FC 57.14%, #ADC5F7 64.28%, #86A8F1 71.42%, #5F8AEA 78.57%, #3A6AE1 85.71%, #1646D7 92.85%, #0400CC 100%)',
            }}
          />
        </section>

        {/* ================= APPLICATION SECTION ================= */}
        <section className="w-full bg-[#F5F7FA] py-10 md:py-16">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            {submitted ? (
              /* Success State */
              <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-14 text-center shadow-md border border-slate-200/90 space-y-6">
                <div className="w-20 h-20 bg-blue-50 text-[#0400CC] rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#00001C] tracking-tight">
                  {t.apply.successTitle}
                </h2>
                <p className="text-base text-slate-600 leading-relaxed max-w-lg mx-auto">
                  {t.apply.successDescP1}{' '}
                  <strong className="text-[#00001C]">
                    {formData.firstName} {formData.lastName}
                  </strong>
                  . {t.apply.successDescP2}{' '}
                  <strong className="text-[#0400CC]">{formData.program}</strong> {t.apply.successDescP3}
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/"
                    className="px-8 py-3.5 bg-[#0400CC] text-white font-bold rounded-xl shadow-md hover:bg-[#0000CC] transition-all text-sm cursor-pointer"
                  >
                    Return to Homepage
                  </Link>
                  <Link
                    href="/how-to-apply"
                    className="px-8 py-3.5 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm cursor-pointer"
                  >
                    View How to Apply Guide
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Stepper Progress Bar */}
                <div className="w-full max-w-xl mx-auto px-2 sm:px-6">
                  <div className="relative">
                    {/* Connecting background track */}
                    <div className="absolute top-4 sm:top-5 left-[12.5%] right-[12.5%] h-[2px] bg-[#E5E7EB] -z-0" />
                    {/* Connecting active track */}
                    <div
                      className="absolute top-4 sm:top-5 left-[12.5%] h-[2px] bg-[#0400CC] transition-all duration-300 -z-0"
                      style={{
                        width: `${((currentStep - 1) / (steps.length - 1)) * 75}%`,
                      }}
                    />

                    <div className="grid grid-cols-4 relative z-10">
                      {steps.map((step) => {
                        const isCompleted = currentStep > step.num;
                        const isCurrent = currentStep === step.num;

                        return (
                          <div
                            key={step.num}
                            onClick={() => {
                              if (isCompleted) setCurrentStep(step.num);
                            }}
                            className={`flex flex-col items-center ${
                              isCompleted ? 'cursor-pointer' : ''
                            }`}
                          >
                            <div
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm ${
                                isCurrent
                                  ? 'bg-[#0400CC] text-white ring-4 ring-blue-100 scale-105'
                                  : isCompleted
                                  ? 'bg-[#0400CC] text-white'
                                  : 'bg-[#E5E7EB] text-[#4A5565]'
                              }`}
                            >
                              {isCompleted ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : step.num}
                            </div>
                            <span
                              className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs md:text-sm font-semibold transition-colors duration-200 text-center leading-tight px-0.5 ${
                                isCurrent
                                  ? 'text-[#0400CC] font-bold'
                                  : isCompleted
                                  ? 'text-slate-800'
                                  : 'text-[#4A5565]'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Main Centered Form Card */}
                <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-slate-200/90 space-y-8">
                  {/* Step Heading */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] tracking-tight">
                      {currentStep === 1 && (t.apply.personalInfo || 'Personal Information')}
                      {currentStep === 2 && (t.apply.academicBackground || 'Academic Background')}
                      {currentStep === 3 && (t.apply.programChoice || 'Program Selection')}
                      {currentStep === 4 && (t.apply.step4Heading?.replace(/^\d+\.\s*/, '') || 'Document Uploads')}
                    </h2>
                  </div>

                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ================= STEP 1: Personal Information ================= */}
                    {currentStep === 1 && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* First Name */}
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-[#00001C] flex items-center gap-2">
                              <User className="w-4 h-4 text-[#0400CC]" />
                              <span>{t.apply.firstName}</span>
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              placeholder={t.apply.firstNamePlaceholder}
                              required
                              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white placeholder-[#99A1AF] transition-all"
                            />
                          </div>

                          {/* Last Name */}
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-[#00001C] flex items-center gap-2">
                              <User className="w-4 h-4 text-[#0400CC]" />
                              <span>{t.apply.lastName}</span>
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              placeholder={t.apply.lastNamePlaceholder}
                              required
                              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white placeholder-[#99A1AF] transition-all"
                            />
                          </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#00001C] flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.apply.email}</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t.apply.emailPlaceholder}
                            required
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white placeholder-[#99A1AF] transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Phone Number */}
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-[#00001C] flex items-center gap-2">
                              <Phone className="w-4 h-4 text-[#0400CC]" />
                              <span>{t.apply.phone}</span>
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder={t.apply.phonePlaceholder}
                              required
                              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white placeholder-[#99A1AF] transition-all"
                            />
                          </div>

                          {/* Date of Birth */}
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-[#00001C] flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#0400CC]" />
                              <span>{t.apply.dateOfBirth}</span>
                            </label>
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white text-slate-700 transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Nationality */}
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-[#00001C] block">
                              {t.apply.nationality}
                            </label>
                            <input
                              type="text"
                              name="nationality"
                              value={formData.nationality}
                              onChange={handleChange}
                              placeholder={t.apply.nationalityPlaceholder}
                              required
                              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white placeholder-[#99A1AF] transition-all"
                            />
                          </div>

                          {/* Gender */}
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-[#00001C] block">
                              Gender
                            </label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white transition-all"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other / Prefer not to say</option>
                            </select>
                          </div>
                        </div>

                        {/* Residential Address */}
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#00001C] block">
                            {t.apply.residentialAddress}
                          </label>
                          <textarea
                            name="address"
                            rows={3}
                            value={formData.address}
                            onChange={handleChange}
                            placeholder={t.apply.addressPlaceholder}
                            required
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white placeholder-[#99A1AF] transition-all resize-y"
                          />
                        </div>
                      </div>
                    )}

                    {/* ================= STEP 2: Academic Background ================= */}
                    {currentStep === 2 && (
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#00001C] flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.apply.highSchool}</span>
                          </label>
                          <input
                            type="text"
                            name="highSchool"
                            value={formData.highSchool}
                            onChange={handleChange}
                            placeholder={t.apply.highSchoolPlaceholder}
                            required
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white placeholder-[#99A1AF] transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-[#00001C] flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#0400CC]" />
                              <span>{t.apply.graduationYear}</span>
                            </label>
                            <input
                              type="number"
                              name="graduationYear"
                              value={formData.graduationYear}
                              onChange={handleChange}
                              placeholder={t.apply.graduationYearPlaceholder}
                              required
                              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white placeholder-[#99A1AF] transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-bold text-[#00001C] flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[#0400CC]" />
                              <span>{t.apply.gpa}</span>
                            </label>
                            <input
                              type="text"
                              name="gpa"
                              value={formData.gpa}
                              onChange={handleChange}
                              placeholder={t.apply.gpaPlaceholder}
                              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white placeholder-[#99A1AF] transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#00001C] flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#0400CC]" />
                            <span>English Proficiency Score / Status</span>
                          </label>
                          <select
                            name="englishScore"
                            value={formData.englishScore}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white transition-all"
                          >
                            <option value="None / SIT Assessment">None / Will take SIT English Placement Test</option>
                            <option value="IELTS 6.0+">IELTS 6.0 or higher</option>
                            <option value="TOEFL iBT 70+">TOEFL iBT 70 or higher</option>
                            <option value="Duolingo 100+">Duolingo English Test 100+</option>
                            <option value="Native / Medium of Instruction">Native English Speaker / English High School</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* ================= STEP 3: Program Selection ================= */}
                    {currentStep === 3 && (
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#00001C] flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.apply.degreeLevel}</span>
                          </label>
                          <select
                            name="degreeLevel"
                            value={formData.degreeLevel}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white transition-all"
                          >
                            <option value="Undergraduate">Undergraduate (Bachelor&apos;s Degree)</option>
                            <option value="Graduate">Graduate (Master&apos;s Degree)</option>
                            <option value="Certificate">Executive Certificate / Professional Diploma</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#00001C] flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.apply.intendedProgram}</span>
                          </label>
                          <select
                            name="program"
                            value={formData.program}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white font-semibold text-[#0400CC] transition-all"
                          >
                            <option value="Bachelor of Computer Science">Bachelor of Computer Science (CS)</option>
                            <option value="Bachelor of Business Administration">Bachelor of Business Administration (BBA)</option>
                            <option value="Bachelor of Communication Arts">Bachelor of Communication Arts (CA)</option>
                            <option value="SIT Global Startup School Program">SIT Global Startup School Program</option>
                            <option value="Master of Information Technology">Master of Information Technology (MIT)</option>
                            <option value="Master of Business Administration">Master of Business Administration (MBA)</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#00001C] flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.apply.statement}</span>
                          </label>
                          <textarea
                            name="statement"
                            rows={4}
                            value={formData.statement}
                            onChange={handleChange}
                            placeholder={t.apply.statementPlaceholder}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white placeholder-[#99A1AF] transition-all resize-y"
                          />
                        </div>
                      </div>
                    )}

                    {/* ================= STEP 4: Document Uploads ================= */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <p className="text-sm text-slate-600">
                          Upload digital copies of your academic transcripts, national ID/passport, or certificates.
                        </p>

                        {/* Upload Dropzone */}
                        <div className="border-2 border-dashed border-slate-300 hover:border-[#0400CC] rounded-2xl p-8 text-center transition-all bg-[#F8FAFC] space-y-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0400CC] flex items-center justify-center mx-auto shadow-sm">
                            {isUploadingDoc ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <Upload className="w-6 h-6" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-[#00001C]">
                              {t.apply.uploadHeading}
                            </p>
                            <p className="text-xs text-slate-500">
                              {t.apply.uploadSubtext}
                            </p>
                          </div>

                          <label className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-sm">
                            <span>Browse Files</span>
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={handleDocUpload}
                              disabled={isUploadingDoc}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Uploaded Documents List */}
                        {uploadedDocs.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-[#00001C] uppercase tracking-wider">
                              Uploaded Documents ({uploadedDocs.length})
                            </p>
                            <div className="space-y-2">
                              {uploadedDocs.map((doc, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl"
                                >
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-[#0400CC]" />
                                    <span className="text-sm font-semibold text-[#00001C] truncate max-w-[240px] sm:max-w-md">
                                      {doc.name}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDoc(idx)}
                                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
                          <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{t.apply.physicalCopyNote}</span>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons Divider & Controls */}
                    <div className="pt-6 border-t border-slate-200/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>{t.apply.prevStep}</span>
                        </button>
                      ) : (
                        <div className="hidden sm:block" />
                      )}

                      {currentStep < 4 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="w-full sm:w-auto px-8 py-3.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer sm:ml-auto"
                        >
                          <span>{t.apply.nextStep}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full sm:w-auto px-8 py-3.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer sm:ml-auto disabled:opacity-50"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>{t.apply.submitting}</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>{t.apply.submitApplication}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* ================= "NEED HELP?" CARD ================= */}
                <div className="max-w-3xl mx-auto bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 text-center border border-slate-200/80 shadow-sm">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#00001C] mb-2">
                    {t.apply.needHelp}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {t.apply.needHelpDesc}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
                    <a
                      href="mailto:admissions@sit.edu.la"
                      className="text-[#0400CC] hover:underline transition-colors"
                    >
                      admissions@sit.edu.la
                    </a>
                    <span className="text-slate-300 hidden sm:inline">|</span>
                    <a
                      href="tel:+85621123456"
                      className="text-[#0400CC] hover:underline transition-colors"
                    >
                      +856 21 123 456
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================= MOBILE BOTTOM CTA BANNER ================= */}
        <section className="md:hidden w-full bg-[#0400CC] py-12 px-6 text-white text-center">
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight">
              Ready to Start Your Journey?
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed font-normal">
              Apply today and join a community of innovators, leaders, and change-makers at Soutsakan Institute of Technology.
            </p>
            <div className="pt-2 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="w-full py-3.5 bg-white text-[#0400CC] font-bold rounded-xl text-sm shadow-md hover:bg-slate-50 transition-all uppercase tracking-wider"
              >
                Apply Now
              </button>
              <Link
                href="/request-info"
                className="w-full py-3.5 border-2 border-white text-white font-bold rounded-xl text-sm hover:bg-white/10 transition-all uppercase tracking-wider block"
              >
                Request Info
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-[#0400CC]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <ApplyFormContent />
    </Suspense>
  );
}
