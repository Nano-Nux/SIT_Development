'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { Hero } from '@/lib/api/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  Info,
  CheckCircle2,
  Send,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Clock,
  BookOpen,
  GraduationCap,
  Calendar,
  User,
  HelpCircle,
  ArrowRight,
  Check,
} from 'lucide-react';

export default function RequestInfoPage() {
  const { t, isLa } = useLanguage();

  const [heroData, setHeroData] = useState<Hero | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Laos',
    city: 'Vientiane',
    currentEducationLevel: 'High School Student',
    graduationYear: '2026',
    programOfInterest: 'Bachelor of Computer Science',
    planToStart: 'Fall 2026',
    hearAboutUs: 'Social Media',
    questions: '',
    prefEmail: true,
    prefPhone: false,
    prefTour: false,
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Program Information',
    'Scholarships & Financial Aid',
  ]);

  useEffect(() => {
    async function loadHero() {
      try {
        const heroRes = await api.getHero('REQUEST_INFO').catch(() => null);
        if (heroRes) setHeroData(heroRes);
      } catch (e) {
        // Fallback to default
      }
    }
    loadHero();
  }, []);

  const interestTopics = [
    { id: 'Program Information', label: t.requestInfo.topicProgram || 'Program Information' },
    { id: 'Campus Tours', label: t.requestInfo.topicCampus || 'Campus Tours' },
    { id: 'Tuition & Fees', label: t.requestInfo.topicTuition || 'Tuition & Fees' },
    { id: 'Scholarships & Financial Aid', label: t.requestInfo.topicScholarships || 'Scholarships & Financial Aid' },
    { id: 'Student Life & Activities', label: t.requestInfo.topicStudentLife || 'Student Life & Activities' },
    { id: 'Housing Options', label: t.requestInfo.topicHousing || 'Housing Options' },
    { id: 'International Student Support', label: t.requestInfo.topicInternational || 'International Student Support' },
    { id: 'Career Services', label: t.requestInfo.topicCareer || 'Career Services' },
    { id: 'Research Opportunities', label: t.requestInfo.topicResearch || 'Research Opportunities' },
    { id: 'Alumni Network', label: t.requestInfo.topicAlumni || 'Alumni Network' },
  ];

  const toggleInterest = (topicId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(topicId) ? prev.filter((t) => t !== topicId) : [...prev, topicId]
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      await api.submitRequestInfo({
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        currentEducationLevel: formData.currentEducationLevel,
        graduationYear: formData.graduationYear,
        programOfInterest: formData.programOfInterest,
        program: formData.programOfInterest,
        intakeTerm: formData.planToStart,
        planToStart: formData.planToStart,
        interests: selectedInterests,
        hearAboutUs: formData.hearAboutUs,
        communicationPreferences: {
          emailUpdates: formData.prefEmail,
          phoneConsultation: formData.prefPhone,
          campusTour: formData.prefTour,
        },
        message: formData.questions,
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('Request Info submission error:', err);
      setErrorMsg(err.message || 'Failed to submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const heroTitle = (isLa && heroData?.titleLa) || heroData?.title || t.requestInfo.heroTitle;
  const heroDesc = (isLa && heroData?.descriptionLa) || heroData?.description || t.requestInfo.heroDesc;

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#00001C] font-sans antialiased selection:bg-[#0400CC] selection:text-white">
      <Header />

      <main className="flex-grow">
        {/* ================= 1. HERO SECTION ================= */}
        <section className="relative w-full bg-[#00001C] pt-36 pb-20 md:pt-48 md:pb-28 text-white overflow-hidden">
          {/* Background image & gradient overlays */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/images/requestinfo_desktopview/img_1.jpg"
              alt="SIT Graduation"
              fill
              className="object-cover object-center opacity-35 brightness-90 mix-blend-luminosity"
              priority
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[#0400CC]/35 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#00001C]/85 via-[#0400CC]/20 to-[#00001C]" />
          </div>

          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10 space-y-8">
            <div className="max-w-3xl space-y-5">
              {/* Info Icon + Accent Line */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white bg-white/5 backdrop-blur-sm">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div className="w-20 sm:w-28 h-[1.5px] bg-white/30" />
              </div>

              {/* Page Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                {heroTitle}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed font-normal max-w-2xl">
                {heroDesc}
              </p>
            </div>

            {/* What You'll Receive Card */}
            <div className="max-w-lg bg-white/[0.08] backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-7 shadow-lg space-y-3.5">
              <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
                <Mail className="w-5 h-5 text-white/90 shrink-0" />
                <span>{t.requestInfo.whatReceive}</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-white/90 pl-1">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                  <span>{t.requestInfo.receive1}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                  <span>{t.requestInfo.receive2}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                  <span>{t.requestInfo.receive3}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                  <span>{t.requestInfo.receive4}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= 2. FORM SECTION ================= */}
        <section className="w-full bg-[#F5F7FA] py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            {submitted ? (
              /* Success State */
              <div className="max-w-2xl mx-auto bg-white rounded-3xl p-10 sm:p-14 text-center shadow-xl border border-slate-200/90 space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#00001C] tracking-tight">
                  {t.requestInfo.successTitle}
                </h2>
                <p className="text-base text-slate-600 leading-relaxed max-w-lg mx-auto">
                  {t.requestInfo.successDescP1}{' '}
                  <strong className="text-[#00001C]">
                    {formData.firstName} {formData.lastName}
                  </strong>
                  . {t.requestInfo.successDescP2}{' '}
                  <strong className="text-[#0400CC]">{formData.programOfInterest}</strong>. {t.requestInfo.successDescP3}{' '}
                  <strong className="text-[#00001C]">{formData.email}</strong>.
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/"
                    className="px-8 py-3.5 bg-[#0400CC] text-white font-bold rounded-xl shadow-md hover:bg-[#0000CC] transition-all text-sm cursor-pointer"
                  >
                    {t.requestInfo.returnHome || 'Return to Homepage'}
                  </Link>
                  <Link
                    href="/apply-now"
                    className="px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all text-sm cursor-pointer"
                  >
                    {t.requestInfo.applyNowBtn || 'Apply Now'}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-16 sm:space-y-20">
                {/* Heading above form */}
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
                    {isLa ? (
                      t.requestInfo.formHeading
                    ) : (
                      <>
                        Tell Us About <span className="text-[#0400CC]">Yourself</span>
                      </>
                    )}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    {t.requestInfo.formSubtitle}
                  </p>
                </div>

                {/* Form Card */}
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm border border-slate-200/90 space-y-12">
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Section 1: Personal Information */}
                    <div className="space-y-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#00001C] border-b-2 border-[#0400CC] pb-3">
                        {t.requestInfo.personalInfo}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        {/* First Name */}
                        <div className="space-y-2">
                          <label className="text-xs sm:text-sm font-bold text-[#00001C] flex items-center gap-1.5">
                            <User className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.requestInfo.firstName}</span>
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder={t.requestInfo.firstNamePlaceholder}
                            required
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-[#00001C] transition-all bg-white"
                          />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                          <label className="text-xs sm:text-sm font-bold text-[#00001C] flex items-center gap-1.5">
                            <User className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.requestInfo.lastName}</span>
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder={t.requestInfo.lastNamePlaceholder}
                            required
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-[#00001C] transition-all bg-white"
                          />
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-xs sm:text-sm font-bold text-[#00001C] flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.requestInfo.email}</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t.requestInfo.emailPlaceholder}
                            required
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-[#00001C] transition-all bg-white"
                          />
                          <span className="text-xs text-slate-500 block pt-0.5">
                            {t.requestInfo.emailNote}
                          </span>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                          <label className="text-xs sm:text-sm font-bold text-[#00001C] flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.requestInfo.phone}</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={t.requestInfo.phonePlaceholder}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-[#00001C] transition-all bg-white"
                          />
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                          <label className="text-xs sm:text-sm font-bold text-[#00001C] flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.requestInfo.country}</span>
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder={t.requestInfo.countryPlaceholder}
                            required
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-[#00001C] transition-all bg-white"
                          />
                        </div>

                        {/* City / Province */}
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-xs sm:text-sm font-bold text-[#00001C] flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.requestInfo.city}</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder={t.requestInfo.cityPlaceholder}
                            required
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-[#00001C] transition-all bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Academic Background */}
                    <div className="space-y-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#00001C] border-b-2 border-[#0400CC] pb-3">
                        {t.requestInfo.academicBackground}
                      </h3>

                      <div className="space-y-6 pt-2">
                        {/* Current Education Level */}
                        <div className="space-y-2">
                          <label className="text-xs sm:text-sm font-bold text-[#00001C] flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.requestInfo.educationLevel}</span>
                          </label>
                          <select
                            name="currentEducationLevel"
                            value={formData.currentEducationLevel}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-[#00001C] transition-all bg-white cursor-pointer"
                          >
                            <option value="High School Student">High School Student (Year 11-12)</option>
                            <option value="High School Graduate">High School Graduate</option>
                            <option value="Current University Student">Current University Student</option>
                            <option value="University Graduate">University Graduate (Bachelor's Degree)</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Expected/Actual Graduation Year */}
                        <div className="space-y-2">
                          <label className="text-xs sm:text-sm font-bold text-[#00001C] flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.requestInfo.gradYear}</span>
                          </label>
                          <select
                            name="graduationYear"
                            value={formData.graduationYear}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-[#00001C] transition-all bg-white cursor-pointer"
                          >
                            <option value="2024">2024 or earlier</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028+</option>
                          </select>
                        </div>

                        {/* Program of Interest */}
                        <div className="space-y-2">
                          <label className="text-xs sm:text-sm font-bold text-[#00001C] flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.requestInfo.programInterest}</span>
                          </label>
                          <select
                            name="programOfInterest"
                            value={formData.programOfInterest}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-[#00001C] font-medium transition-all bg-white cursor-pointer"
                          >
                            <option value="Bachelor of Computer Science">Bachelor of Computer Science (CS)</option>
                            <option value="Bachelor of Business Administration">Bachelor of Business Administration (BBA)</option>
                            <option value="Bachelor of Communication Arts">Bachelor of Communication Arts (CA)</option>
                            <option value="SIT Global Startup School Program">SIT Global Startup School Program</option>
                            <option value="Master of Information Technology">Master of Information Technology (MIT)</option>
                            <option value="Master of Business Administration">Master of Business Administration (MBA)</option>
                            <option value="General University Inquiry">General University Inquiry</option>
                          </select>
                        </div>

                        {/* When do you plan to start? */}
                        <div className="space-y-2">
                          <label className="text-xs sm:text-sm font-bold text-[#00001C] flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#0400CC]" />
                            <span>{t.requestInfo.planToStart}</span>
                          </label>
                          <select
                            name="planToStart"
                            value={formData.planToStart}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-[#00001C] transition-all bg-white cursor-pointer"
                          >
                            <option value="Fall 2026">Fall 2026 (September 2026)</option>
                            <option value="Spring 2027">Spring 2027 (January 2027)</option>
                            <option value="Fall 2027">Fall 2027</option>
                            <option value="Unsure / Exploring Options">Unsure / Still Exploring</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: What Information Are You Most Interested In? */}
                    <div className="space-y-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#00001C] border-b-2 border-[#0400CC] pb-3">
                        {t.requestInfo.interestedIn}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 pt-1">
                        {t.requestInfo.selectApplies}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                        {interestTopics.map((topic) => {
                          const isSelected = selectedInterests.includes(topic.id);
                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => toggleInterest(topic.id)}
                              className={`py-3.5 px-4 sm:py-4 sm:px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all border text-center flex items-center justify-center cursor-pointer ${
                                isSelected
                                  ? 'bg-[#0400CC] text-white border-[#0400CC] shadow-md ring-2 ring-blue-100'
                                  : 'bg-slate-50/70 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {topic.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 4: Additional Information */}
                    <div className="space-y-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#00001C] border-b-2 border-[#0400CC] pb-3">
                        {t.requestInfo.additionalInfo}
                      </h3>

                      <div className="space-y-6 pt-2">
                        {/* How did you hear about SIT? */}
                        <div className="space-y-2">
                          <label className="text-xs sm:text-sm font-bold text-[#00001C] block">
                            {t.requestInfo.hearAbout}
                          </label>
                          <select
                            name="hearAboutUs"
                            value={formData.hearAboutUs}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-[#00001C] transition-all bg-white cursor-pointer"
                          >
                            <option value="Social Media">Social Media (Facebook / Instagram / TikTok)</option>
                            <option value="Friend or Family">Friend, Family or SIT Student</option>
                            <option value="School Counselor">High School Teacher / Counselor</option>
                            <option value="Google Search">Google Search / Online</option>
                            <option value="Education Fair">Education Fair / Campus Event</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Questions or Comments */}
                        <div className="space-y-2">
                          <label className="text-xs sm:text-sm font-bold text-[#00001C] block">
                            {t.requestInfo.questionsComments}
                          </label>
                          <textarea
                            name="questions"
                            rows={4}
                            value={formData.questions}
                            onChange={handleChange}
                            placeholder={t.requestInfo.questionsPlaceholder}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0400CC] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-[#00001C] transition-all bg-white resize-y"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 5: Communication Preferences */}
                    <div className="space-y-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#00001C] border-b-2 border-[#0400CC] pb-3">
                        {t.requestInfo.commPreferences}
                      </h3>

                      <div className="space-y-3.5 pt-2">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            name="prefEmail"
                            checked={formData.prefEmail}
                            onChange={handleChange}
                            className="w-4 h-4 rounded text-[#0400CC] focus:ring-[#0400CC] border-slate-300 mt-1 cursor-pointer"
                          />
                          <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {t.requestInfo.prefEmail}
                          </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            name="prefPhone"
                            checked={formData.prefPhone}
                            onChange={handleChange}
                            className="w-4 h-4 rounded text-[#0400CC] focus:ring-[#0400CC] border-slate-300 mt-1 cursor-pointer"
                          />
                          <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {t.requestInfo.prefPhone}
                          </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            name="prefTour"
                            checked={formData.prefTour}
                            onChange={handleChange}
                            className="w-4 h-4 rounded text-[#0400CC] focus:ring-[#0400CC] border-slate-300 mt-1 cursor-pointer"
                          />
                          <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {t.requestInfo.prefTour}
                          </span>
                        </label>
                      </div>

                      {/* Cyan Notice Box */}
                      <div className="bg-[#EFFFFF] border border-[#BCEAEA]/70 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-slate-700 leading-relaxed mt-6">
                        {t.requestInfo.privacyNotice}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 flex flex-col items-center justify-center space-y-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto min-w-[280px] px-10 py-4 bg-[#0400CC] hover:bg-[#0000CC] text-white font-extrabold text-sm sm:text-base rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{t.requestInfo.sending}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 -rotate-12" />
                            <span>{t.requestInfo.sendBtn}</span>
                          </>
                        )}
                      </button>
                      <p className="text-xs text-slate-500 text-center max-w-md">
                        {t.requestInfo.packetNotice}
                      </p>
                    </div>
                  </form>
                </div>

                {/* Questions? We're Here to Help (Below Form) */}
                <div className="text-center mt-14 sm:mt-20 space-y-3.5 max-w-2xl mx-auto px-4">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] tracking-tight">
                    {t.requestInfo.helpTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
                    {t.requestInfo.helpDesc}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 pt-3 text-xs sm:text-sm font-semibold text-slate-700">
                    <a
                      href="mailto:info@sit.edu.la"
                      className="text-[#0400CC] hover:underline font-bold transition-all"
                    >
                      info@sit.edu.la
                    </a>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <a
                      href="tel:+85621123456"
                      className="text-[#0400CC] hover:underline font-bold transition-all"
                    >
                      +856 21 123 456
                    </a>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <span className="text-slate-600 font-medium">{t.requestInfo.helpHours}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================= 3. CTA BANNER SECTION ================= */}
        <section className="w-full bg-[#0400CC] py-20 md:py-28 text-white relative overflow-hidden text-center">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {t.requestInfo.readyJourneyTitle || 'Ready to Start Your Journey?'}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {t.requestInfo.readyJourneyDesc ||
                'Apply today and join a community of innovators, leaders, and change-makers at Soutsakan Institute of Technology.'}
            </p>
            <div className="pt-4">
              <Link
                href="/apply-now"
                className="inline-block px-10 py-4 bg-white text-[#0400CC] hover:bg-slate-50 font-extrabold text-sm sm:text-base rounded-xl transition-all shadow-xl hover:shadow-2xl uppercase tracking-wider cursor-pointer"
              >
                {t.requestInfo.applyNowBtn || 'APPLY NOW'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
