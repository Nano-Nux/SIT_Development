'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import {
  ContactLocation,
  ContactPhone,
  ContactEmail,
  ContactOfficeHour,
} from '@/lib/api/types';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  ExternalLink,
} from 'lucide-react';

export default function ContactPage() {
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    programOfInterest: 'General Inquiry',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getContact()
      .then(setContactInfo)
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.fullName || !formData.email || !formData.message) {
        throw new Error('Please fill in your name, email, and message.');
      }
      await api.submitRequestInfo(formData);
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        programOfInterest: 'General Inquiry',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse array fields
  const parseArray = <T,>(field: any, fallback: T[]): T[] => {
    if (!field) return fallback;
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return fallback;
  };

  // Locations array
  const defaultLocations: ContactLocation[] = [
    {
      id: 'loc-1',
      title: 'Main Campus',
      titleLa: 'ວິທະຍາເຂດຫຼັກ',
      address:
        contactInfo?.address ||
        'Building 123, Russian Federation Boulevard (110), Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh, Kingdom of Cambodia',
      addressLa:
        contactInfo?.addressLa ||
        'ອາຄານ 123, ຖະໜົນນະວັດຕະກຳ, ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ',
      isPrimary: true,
    },
  ];
  const locations: ContactLocation[] = parseArray<ContactLocation>(
    contactInfo?.locations,
    defaultLocations
  );

  // Phones array
  const defaultPhones: ContactPhone[] = [
    {
      id: 'phone-1',
      number: contactInfo?.phone || '+856 21 123 456',
      label: 'General Inquiries',
      labelLa: 'ສອບຖາມທົ່ວໄປ',
      isPrimary: true,
    },
  ];
  const phones: ContactPhone[] = parseArray<ContactPhone>(
    contactInfo?.phones,
    defaultPhones
  );

  // Emails array
  const defaultEmails: ContactEmail[] = [
    {
      id: 'email-1',
      email: contactInfo?.email || 'info@sit.edu.la',
      label: 'Admissions & Inquiries',
      labelLa: 'ສອບຖາມ ແລະ ຮັບສະໝັກ',
      isPrimary: true,
    },
  ];
  const emails: ContactEmail[] = parseArray<ContactEmail>(
    contactInfo?.emails,
    defaultEmails
  );

  // Office Hours array
  const defaultHours: ContactOfficeHour[] = [
    {
      id: 'oh-1',
      days: 'Monday - Friday',
      daysLa: 'ວັນຈັນ - ວັນສຸກ',
      hours: '8:00 AM - 5:00 PM',
      hoursLa: '8:00 ໂມງເຊົ້າ - 5:00 ໂມງແລງ',
    },
    {
      id: 'oh-2',
      days: 'Saturday',
      daysLa: 'ວັນເສົາ',
      hours: '8:00 AM - 12:00 PM',
      hoursLa: '8:00 ໂມງເຊົ້າ - 12:00 ໂມງທ່ຽງ',
    },
  ];
  const officeHoursList: ContactOfficeHour[] = parseArray<ContactOfficeHour>(
    contactInfo?.officeHoursList,
    defaultHours
  );

  const mapEmbedUrl =
    contactInfo?.mapEmbedUrl ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.7802457390835!2d102.6286178751789!3d17.98895818300444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x312467e7bd8e66a5%3A0xf85c9af1fa1bea14!2sSoutsaka%20Institute%20of%20Technology!5e0!3m2!1sen!2sth!4v1787336679429!5m2!1sen!2sth';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 bg-[#00001C] text-white overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#00B6FF] text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#00B6FF]" />
              <span>{t.contact.reachOut}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {t.contact.contactTitle}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              {t.contact.contactDesc}
            </p>
          </div>
        </section>

        {/* Contact Info & Interactive Message Form */}
        <section className="py-16 sm:py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Contact Cards */}
              <div className="lg:col-span-5 space-y-6">
                {/* Campus Locations Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-xl font-bold text-[#00001C] pb-4 border-b border-slate-100 flex items-center justify-between">
                    <span>{t.contact.campusDetails}</span>
                    <span className="text-xs font-semibold text-[#0400CC] bg-blue-50 px-2.5 py-1 rounded-full">
                      {locations.length} {locations.length === 1 ? 'Campus' : 'Campuses'}
                    </span>
                  </h3>

                  <div className="space-y-5 text-sm">
                    {/* Multiple Locations list */}
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        {t.contact.campusLocation}
                      </span>
                      {locations.map((loc, idx) => {
                        const title = (isLa && loc.titleLa) ? loc.titleLa : loc.title;
                        const address = (isLa && loc.addressLa) ? loc.addressLa : loc.address;
                        const notes = (isLa && loc.notesLa) ? loc.notesLa : loc.notes;

                        return (
                          <div
                            key={loc.id || idx}
                            className={`p-4 rounded-2xl border transition-all ${
                              loc.isPrimary
                                ? 'border-[#0400CC]/30 bg-blue-50/20'
                                : 'border-slate-100 bg-slate-50/70'
                            }`}
                          >
                            <div className="flex items-start gap-3.5">
                              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0400CC] shrink-0 mt-0.5">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-slate-900 text-sm">{title}</span>
                                  {loc.isPrimary && (
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                      Primary
                                    </span>
                                  )}
                                </div>
                                <p className="font-medium text-slate-700 text-xs sm:text-sm leading-snug">
                                  {address}
                                </p>
                                {notes && (
                                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                                    {notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Phone Contacts (Array) */}
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        {t.contact.phoneContacts}
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {phones.map((phone, idx) => {
                          const label = (isLa && phone.labelLa) ? phone.labelLa : phone.label;
                          return (
                            <a
                              key={phone.id || idx}
                              href={`tel:${phone.number.replace(/[^\d+]/g, '')}`}
                              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all text-xs sm:text-sm group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                  <Phone className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  {label && (
                                    <span className="text-[11px] font-semibold text-slate-400 block truncate">
                                      {label}
                                    </span>
                                  )}
                                  <span className="font-bold text-slate-900 group-hover:text-[#0400CC] transition-colors">
                                    {phone.number}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[11px] text-[#0400CC] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                Call
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </div>

                    {/* Email Contacts (Array) */}
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        {t.contact.directEmail}
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {emails.map((email, idx) => {
                          const label = (isLa && email.labelLa) ? email.labelLa : email.label;
                          return (
                            <a
                              key={email.id || idx}
                              href={`mailto:${email.email}`}
                              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all text-xs sm:text-sm group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0400CC] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                  <Mail className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  {label && (
                                    <span className="text-[11px] font-semibold text-slate-400 block truncate">
                                      {label}
                                    </span>
                                  )}
                                  <span className="font-bold text-slate-900 group-hover:text-[#0400CC] transition-colors truncate block">
                                    {email.email}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[11px] text-[#0400CC] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                Email
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </div>

                    {/* Office Hours (Array) */}
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        {t.contact.officeHours}
                      </span>
                      <div className="space-y-2">
                        {officeHoursList.map((hour, idx) => {
                          const days = (isLa && hour.daysLa) ? hour.daysLa : hour.days;
                          const hours = (isLa && hour.hoursLa) ? hour.hoursLa : hour.hours;
                          const notes = (isLa && hour.notesLa) ? hour.notesLa : hour.notes;

                          return (
                            <div
                              key={hour.id || idx}
                              className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm"
                            >
                              <div className="flex items-center gap-2.5">
                                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                                <div>
                                  <span className="font-semibold text-slate-800">{days}</span>
                                  {notes && (
                                    <span className="text-[11px] text-slate-400 block">{notes}</span>
                                  )}
                                </div>
                              </div>
                              <span className="font-bold text-[#0400CC] shrink-0">{hours}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Links Card */}
                {(() => {
                  let socialObj: any = {};
                  if (contactInfo?.socialLinks) {
                    if (typeof contactInfo.socialLinks === 'string') {
                      try {
                        socialObj = JSON.parse(contactInfo.socialLinks);
                      } catch (e) {}
                    } else if (typeof contactInfo.socialLinks === 'object') {
                      socialObj = contactInfo.socialLinks;
                    }
                  }

                  const activeSocials = [
                    {
                      name: 'Facebook',
                      url: socialObj.facebook || 'https://facebook.com/situniversity',
                      active: socialObj.facebookActive !== undefined ? socialObj.facebookActive : Boolean(socialObj.facebook),
                      color: '#1877F2',
                      icon: (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      ),
                    },
                    {
                      name: 'Twitter / X',
                      url: socialObj.twitter || 'https://twitter.com/situniversity',
                      active: socialObj.twitterActive !== undefined ? socialObj.twitterActive : Boolean(socialObj.twitter),
                      color: '#000000',
                      icon: (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ),
                    },
                    {
                      name: 'Instagram',
                      url: socialObj.instagram || 'https://instagram.com/situniversity',
                      active: socialObj.instagramActive !== undefined ? socialObj.instagramActive : Boolean(socialObj.instagram),
                      color: '#E1306C',
                      icon: (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      ),
                    },
                    {
                      name: 'LinkedIn',
                      url: socialObj.linkedin || 'https://linkedin.com/school/situniversity',
                      active: socialObj.linkedinActive !== undefined ? socialObj.linkedinActive : Boolean(socialObj.linkedin),
                      color: '#0A66C2',
                      icon: (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      ),
                    },
                    {
                      name: 'YouTube',
                      url: socialObj.youtube || 'https://youtube.com/@situniversity',
                      active: socialObj.youtubeActive !== undefined ? socialObj.youtubeActive : Boolean(socialObj.youtube),
                      color: '#FF0000',
                      icon: (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      ),
                    },
                    {
                      name: 'TikTok',
                      url: socialObj.tiktok || 'https://tiktok.com/@situniversity',
                      active: socialObj.tiktokActive !== undefined ? socialObj.tiktokActive : Boolean(socialObj.tiktok),
                      color: '#000000',
                      icon: (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                        </svg>
                      ),
                    },
                    {
                      name: 'Telegram',
                      url: socialObj.telegram || 'https://t.me/situniversity',
                      active: socialObj.telegramActive !== undefined ? socialObj.telegramActive : Boolean(socialObj.telegram),
                      color: '#229ED9',
                      icon: (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                      ),
                    },
                    {
                      name: 'WhatsApp',
                      url: socialObj.whatsapp ? (socialObj.whatsapp.startsWith('http') ? socialObj.whatsapp : `https://wa.me/${socialObj.whatsapp.replace(/\D/g, '')}`) : '',
                      active: Boolean(socialObj.whatsappActive && socialObj.whatsapp),
                      color: '#25D366',
                      icon: (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.979-.276-.1-.477-.15-.677.15-.2.301-.776.979-.952 1.18-.175.201-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.787-1.679-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.1-.201.05-.376-.025-.526-.075-.15-.677-1.633-.927-2.235-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.508 0 1.479 1.078 2.908 1.229 3.109.15.2 2.121 3.24 5.138 4.544.718.31 1.278.496 1.716.635.72.229 1.376.196 1.895.119.578-.086 1.782-.728 2.032-1.43.25-.703.25-1.305.175-1.43-.075-.125-.276-.201-.577-.351zM12.04 21.783c-1.802 0-3.567-.484-5.111-1.401l-.366-.218-3.801.996 1.014-3.705-.239-.38a9.88 9.88 0 0 1-1.516-5.26c0-5.467 4.449-9.916 9.917-9.916 2.648 0 5.138 1.032 7.009 2.905a9.854 9.854 0 0 1 2.899 7.007c-.001 5.468-4.45 9.917-9.923 9.917zm8.411-18.327C18.239 1.246 15.244.004 12.04.004 5.469.004.12 5.353.118 11.924c0 2.099.549 4.148 1.593 5.957L0 24l6.302-1.653c1.737.947 3.69 1.446 5.734 1.446h.005c6.568 0 11.918-5.349 11.921-11.921 0-3.184-1.24-6.179-3.511-8.415z" />
                        </svg>
                      ),
                    },
                  ].filter((item) => item.active && item.url);

                  const customList = Array.isArray(socialObj.customLinks)
                    ? socialObj.customLinks.filter((c: any) => c.isActive && c.url)
                    : [];

                  return (
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
                      <h3 className="text-lg font-bold text-[#00001C] pb-3 border-b border-slate-100 flex items-center justify-between">
                        <span>Connect on Social Media</span>
                        <span className="text-xs font-semibold text-[#0400CC] bg-blue-50 px-2.5 py-0.5 rounded-full">
                          Official
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Follow SIT University across our official platforms for real-time updates and campus highlights.
                      </p>

                      <div className="grid grid-cols-2 gap-2.5 pt-2">
                        {activeSocials.map((s) => (
                          <a
                            key={s.name}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all text-xs font-bold text-slate-800 hover:text-[#0400CC] group shadow-2xs"
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                              style={{ backgroundColor: s.color }}
                            >
                              {s.icon}
                            </div>
                            <span className="truncate">{s.name}</span>
                          </a>
                        ))}

                        {customList.map((c: any) => (
                          <a
                            key={c.id || c.name}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all text-xs font-bold text-slate-800 hover:text-[#0400CC] group shadow-2xs"
                          >
                            <div className="w-7 h-7 rounded-lg bg-[#0400CC] flex items-center justify-center text-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                              <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate">{c.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Right Column: Send a Message Form */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#00001C]">
                      {t.contact.sendMessage}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {t.contact.sendMessageDesc}
                    </p>
                  </div>

                  {success && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-700 text-sm">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>{t.contact.successMsg}</span>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          {t.contact.fullName} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Soutsaka Phommachanh"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          {t.contact.email} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="e.g. student@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          {t.contact.phone}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. +856 20 1234 5678"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          {t.contact.messageContent} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder={t.contact.messagePlaceholder}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] disabled:opacity-60 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      {loading ? t.contact.sendingBtn : t.contact.sendBtn}
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Embed Section (Single Google Map) */}
        {mapEmbedUrl && (
          <section className="h-96 w-full bg-slate-200 relative">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              title="SIT University Map"
              className="w-full h-full grayscale-[0.15]"
            />
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
