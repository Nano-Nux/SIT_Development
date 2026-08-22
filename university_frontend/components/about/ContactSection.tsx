'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ExternalLink, Send, CheckCircle2 } from 'lucide-react';
import { api, ContactInfo } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export function ContactSection({ data }: { data?: ContactInfo | null }) {
  const [contact, setContact] = useState<ContactInfo | null>(data || null);
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!data) {
      api.getContact().then((res) => {
        if (res) setContact(res);
      }).catch(console.error);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setLoading(true);
    // Simulate or call submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSubmitted(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const address = (isLa && contact?.addressLa) ? contact.addressLa : (contact?.address || t.about.locationAddress);
  const phone = contact?.phone || t.about.phoneNumbers;
  const email = contact?.email || t.about.emailAddresses;
  const officeHours = (isLa && contact?.officeHoursLa) ? contact.officeHoursLa : (contact?.officeHours || t.about.officeHoursTimes);
  const googleMapsUrl = contact?.mapUrl || 'https://maps.google.com/?q=Soutsaka+Institute+of+Technology+Vientiane';
  const mapEmbedUrl =
    contact?.mapEmbedUrl ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.7802457390835!2d102.6286178751789!3d17.98895818300444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x312467e7bd8e66a5%3A0xf85c9af1fa1bea14!2sSoutsaka%20Institute%20of%20Technology!5e0!3m2!1sen!2sth!4v1787336679429!5m2!1sen!2sth';

  return (
    <section id="contact" className="w-full bg-white">
      {/* Top Contact Info & Map Section */}
      <div className="py-20 sm:py-28 max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00001C] tracking-tight">
                {t.about.contactTitle}{' '}
                <span className="text-[#0400CC]">{t.about.contactHighlight}</span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#4A5565] leading-relaxed">
                {t.about.contactDesc}
              </p>
            </div>

            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EFFFFF] flex items-center justify-center text-[#0400CC] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#00001C]">{t.about.ourLocation}</h4>
                  <p className="text-sm sm:text-base text-[#4A5565] whitespace-pre-line leading-relaxed mt-0.5">
                    {address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EFFFFF] flex items-center justify-center text-[#0400CC] shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#00001C]">{t.about.phone}</h4>
                  <p className="text-sm sm:text-base text-[#4A5565] whitespace-pre-line leading-relaxed mt-0.5">
                    {phone}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EFFFFF] flex items-center justify-center text-[#0400CC] shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#00001C]">{t.about.email}</h4>
                  <p className="text-sm sm:text-base text-[#4A5565] whitespace-pre-line leading-relaxed mt-0.5">
                    {email}
                  </p>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EFFFFF] flex items-center justify-center text-[#0400CC] shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#00001C]">{t.about.officeHours}</h4>
                  <p className="text-sm sm:text-base text-[#4A5565] whitespace-pre-line leading-relaxed mt-0.5">
                    {officeHours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Map Preview Card */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 min-h-[340px]">
              {mapEmbedUrl ? (
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Soutsaka Institute of Technology Campus Map"
                  className="w-full h-full"
                />
              ) : (
                <img
                  src="/images/about/campus_map.jpg"
                  alt="SIT Campus Map"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Bottom "Open in Google Maps" Button */}
              <div className="absolute bottom-5 right-5 z-10">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/95 hover:bg-white text-[#00001C] hover:text-[#0400CC] text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 transition-all cursor-pointer backdrop-blur-sm"
                >
                  <span>{t.about.openInGoogleMaps}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Send Us A Message Form Section */}
      <div className="w-full bg-[#F5F7FA] py-20 sm:py-28">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Student Banner (Purple/Blue Container) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#0400CC] p-8 sm:p-12 text-white relative flex flex-col justify-between overflow-hidden min-h-[360px]">
                <div className="absolute inset-0 z-0 opacity-75">
                  <img
                    src="/images/about/contact_student.png"
                    alt="SIT Student"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#00001C]/90 via-[#0400CC]/40 to-transparent z-0" />

                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="relative z-10 space-y-2 mt-auto pt-24">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {t.about.haveQuestion}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                    {t.about.haveQuestionDesc}
                  </p>
                </div>
              </div>

              {/* Right Message Form */}
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] mb-8">
                  {t.about.sendMessageTitle}
                </h3>

                {submitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4 text-emerald-800">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg">{isLa ? 'ສຳເລັດແລ້ວ!' : 'Success!'}</h4>
                      <p className="text-sm text-emerald-700 mt-1">
                        {t.about.messageSentSuccess}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-[#00001C] uppercase mb-2">
                          {t.about.firstName}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC]/20 focus:border-[#0400CC] text-sm text-[#00001C] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#00001C] uppercase mb-2">
                          {t.about.lastName}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC]/20 focus:border-[#0400CC] text-sm text-[#00001C] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-[#00001C] uppercase mb-2">
                          {t.about.emailAddress}
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC]/20 focus:border-[#0400CC] text-sm text-[#00001C] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#00001C] uppercase mb-2">
                          {t.about.subject}
                        </label>
                        <input
                          type="text"
                          placeholder={isLa ? 'ສອບຖາມຂໍ້ມູນຫຼັກສູດ' : 'Program Inquiry'}
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC]/20 focus:border-[#0400CC] text-sm text-[#00001C] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#00001C] uppercase mb-2">
                        {t.about.message}
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder={t.about.messagePlaceholder}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC]/20 focus:border-[#0400CC] text-sm text-[#00001C] transition-all resize-none"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg shadow-[#0400CC]/20 hover:shadow-[#0400CC]/40 transition-all duration-200 cursor-pointer disabled:opacity-50"
                      >
                        <span>{loading ? (isLa ? 'ກຳລັງສົ່ງ...' : 'Sending...') : t.about.submitMessage}</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
