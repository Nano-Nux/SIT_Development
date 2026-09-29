'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Sparkles, Save, CheckCircle2, AlertCircle, Image as ImageIcon, ExternalLink, Eye } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function AdminHeroPage() {
  const [selectedPage, setSelectedPage] = useState('HOME');
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'la'>('en');
  const [formData, setFormData] = useState({
    page: 'HOME',
    title: '',
    titleLa: '',
    subtitle: '',
    subtitleLa: '',
    description: '',
    descriptionLa: '',
    buttonText: '',
    buttonTextLa: '',
    buttonUrl: '',
    imageUrl: '',
    image2Url: '',
    image3Url: '',
    image4Url: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pages = [
    { code: 'HOME', name: 'Homepage Hero', href: '/' },
    { code: 'ABOUT', name: 'About SIT Page', href: '/about' },
    { code: 'ACADEMICS', name: 'Academics Directory', href: '/academics' },
    { code: 'ADMISSIONS', name: 'Admissions Page', href: '/admissions' },
    { code: 'LIFE_AT_SIT', name: 'Life at SIT Page', href: '/life-at-sit' },
    { code: 'COLLABORATIONS', name: 'Collaborations Page', href: '/collaborations' },
  ];

  const currentPage = pages.find((p) => p.code === selectedPage);

  useEffect(() => {
    fetchHeroData(selectedPage);
  }, [selectedPage]);

  const fetchHeroData = async (pageCode: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const data = await api.getHero(pageCode);
      if (data) {
        setFormData({
          page: data.page,
          title: data.title || '',
          titleLa: data.titleLa || '',
          subtitle: data.subtitle || '',
          subtitleLa: data.subtitleLa || '',
          description: data.description || '',
          descriptionLa: data.descriptionLa || '',
          buttonText: data.buttonText || '',
          buttonTextLa: data.buttonTextLa || '',
          buttonUrl: data.buttonUrl || '',
          imageUrl: data.imageUrl || '',
          image2Url: data.image2Url || '',
          image3Url: data.image3Url || '',
          image4Url: data.image4Url || '',
        });
      } else {
        setFormData({
          page: pageCode,
          title: '',
          titleLa: '',
          subtitle: '',
          subtitleLa: '',
          description: '',
          descriptionLa: '',
          buttonText: '',
          buttonTextLa: '',
          buttonUrl: '',
          imageUrl: '',
          image2Url: '',
          image3Url: '',
          image4Url: '',
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.upsertHero(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update Hero settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-[#0400CC]" />
          Hero Sections Manager
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize headlines, subheadings, background imagery, and CTA actions for each main university page in English and Lao.
        </p>
      </div>

      {/* Page Tabs & Live View Link */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex flex-wrap gap-2">
          {pages.map((p) => (
            <button
              key={p.code}
              onClick={() => setSelectedPage(p.code)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedPage === p.code
                  ? 'bg-[#0400CC] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {currentPage && (
          <Link
            href={currentPage.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0400CC] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Page</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </Link>
        )}
      </div>

      {/* Hero Editor Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-4xl space-y-6">
        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-700 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Hero banner updated successfully! Live page will reflect updates immediately.</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading banner settings...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Language Switcher Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setActiveLangTab('en')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeLangTab === 'en'
                    ? 'bg-white text-[#0400CC] shadow-sm'
                    : 'text-slate-600 hover:text-[#00001C]'
                }`}
              >
                <span>🇬🇧 English</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('la')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeLangTab === 'la'
                    ? 'bg-white text-[#0400CC] shadow-sm'
                    : 'text-slate-600 hover:text-[#00001C]'
                }`}
              >
                <span>🇱🇦 ພາສາລາວ (Lao)</span>
                {formData.titleLa && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Lao translation present" />
                )}
              </button>
            </div>

            {/* English Fields */}
            {activeLangTab === 'en' ? (
              <div className="space-y-6 p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">English Content Fields</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0400CC]">EN</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Subtitle / Badge Label (EN)
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      placeholder="e.g. WELCOME TO SIT UNIVERSITY"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Main Headline Title (EN) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Shaping Future Leaders Through Innovation & Excellence"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Hero Paragraph Description (EN)
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write compelling descriptive text for the banner..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Action Button Text (EN)
                    </label>
                    <input
                      type="text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleChange}
                      placeholder="e.g. Explore Programs"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Action Button URL / Destination
                    </label>
                    <input
                      type="text"
                      name="buttonUrl"
                      value={formData.buttonUrl}
                      onChange={handleChange}
                      placeholder="e.g. /academics or /apply"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                    />
                  </div>
                </div> */}
              </div>
            ) : (
              /* Lao Fields */
              <div className="space-y-6 p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">ຊ່ອງປ້ອນຂໍ້ມູນພາສາລາວ (Lao Content Fields)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">LA</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      ຫົວຂໍ້ຍ່ອຍ / ປ້າຍຂໍ້ຄວາມ (Lao Subtitle)
                    </label>
                    <input
                      type="text"
                      name="subtitleLa"
                      value={formData.subtitleLa}
                      onChange={handleChange}
                      placeholder="ຕົວຢ່າງ: ຍິນດີຕ້ອນຮັບສູ່ ມະຫາວິທະຍາໄລ SIT"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      ຫົວຂໍ້ຫຼັກ (Lao Headline Title)
                    </label>
                    <input
                      type="text"
                      name="titleLa"
                      value={formData.titleLa}
                      onChange={handleChange}
                      placeholder="ຕົວຢ່າງ: ສ້າງຜູ້ນຳແຫ່ງອະນາຄົດຜ່ານນະວັດຕະກຳ ແລະ ຄວາມເປັນເລີດ"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    ເນື້ອຫາຄຳອະທິບາຍ (Lao Description)
                  </label>
                  <textarea
                    name="descriptionLa"
                    rows={3}
                    value={formData.descriptionLa}
                    onChange={handleChange}
                    placeholder="ຂຽນເນື້ອຫາຄຳອະທິບາຍສຳລັບປ້າຍໂຄສະນາ..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      ຂໍ້ຄວາມເທິງປຸ່ມ (Lao Button Text)
                    </label>
                    <input
                      type="text"
                      name="buttonTextLa"
                      value={formData.buttonTextLa}
                      onChange={handleChange}
                      placeholder="ຕົວຢ່າງ: ສຳຫຼວດຫຼັກສູດ"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Action Button URL / Destination
                    </label>
                    <input
                      type="text"
                      name="buttonUrl"
                      value={formData.buttonUrl}
                      onChange={handleChange}
                      placeholder="e.g. /academics or /apply"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                    />
                  </div>
                </div> */}
              </div>
            )}

            {/* Images Section */}
            {selectedPage === 'HOME' ? (
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#0400CC]" />
                  <h3 className="text-sm font-extrabold text-[#00001C] uppercase tracking-wider">
                    Homepage 4-Panel Hero Showcase Images (SeaweedFS)
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Upload images directly to SeaweedFS in full original quality for each of the 4 showcase panels on the homepage.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <ImageUpload
                    label="Panel 1 Image (Left)"
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    placeholder="/images/home_desktopview/img_1.jpg"
                    aspectRatio="portrait"
                  />
                  <ImageUpload
                    label="Panel 2 Image"
                    value={formData.image2Url}
                    onChange={(url) => setFormData({ ...formData, image2Url: url })}
                    placeholder="/images/home_desktopview/img_1.jpg"
                    aspectRatio="portrait"
                  />
                  <ImageUpload
                    label="Panel 3 Image"
                    value={formData.image3Url}
                    onChange={(url) => setFormData({ ...formData, image3Url: url })}
                    placeholder="/images/home_desktopview/img_2.jpg"
                    aspectRatio="portrait"
                  />
                  <ImageUpload
                    label="Panel 4 Image (Right)"
                    value={formData.image4Url}
                    onChange={(url) => setFormData({ ...formData, image4Url: url })}
                    placeholder="/images/home_desktopview/img_1.jpg"
                    aspectRatio="portrait"
                  />
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-200 pt-6 space-y-3">
                <ImageUpload
                  label="Banner Background Image (SeaweedFS)"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  placeholder="/images/about_desktopview/img_1.jpg"
                  helpText="Full resolution banner background stored directly in SeaweedFS."
                  aspectRatio="wide"
                />
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] disabled:opacity-60 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                {saving ? 'Saving Changes...' : 'Save Banner Updates'}
                <Save className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Live Banner Preview */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white max-w-4xl space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Preview ({activeLangTab === 'en' ? 'English' : 'Lao'}) — {currentPage?.name}
            </h3>
          </div>
          <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Previewing: {selectedPage}
          </span>
        </div>

        {selectedPage === 'HOME' ? (
          <div className="grid grid-cols-4 gap-2 h-44 rounded-2xl overflow-hidden bg-[#00001C] p-2 border border-slate-700">
            {[formData.imageUrl || '/images/home_desktopview/img_1.jpg',
              formData.image2Url || '/images/home_desktopview/img_1.jpg',
              formData.image3Url || '/images/home_desktopview/img_2.jpg',
              formData.image4Url || '/images/home_desktopview/img_1.jpg'].map((img, i) => (
              <div key={i} className="relative h-full rounded-lg overflow-hidden bg-slate-800">
                <Image src={img} alt={`Panel ${i + 1}`} fill className="object-cover brightness-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0400CC]/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black text-white/40 tracking-widest uppercase whitespace-nowrap">
                  SIT UNIV
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-[#00001C] p-6 sm:p-8 min-h-[180px] flex flex-col justify-center text-center border border-slate-700">
            {formData.imageUrl && (
              <div className="absolute inset-0 z-0">
                <Image src={formData.imageUrl} alt="Background" fill className="object-cover opacity-25" />
                <div className="absolute inset-0 bg-[#0400CC]/40" />
              </div>
            )}
            <div className="relative z-10 space-y-2">
              <span className="inline-block text-[11px] font-bold tracking-widest text-blue-300 uppercase">
                {activeLangTab === 'en' ? (formData.subtitle || 'SUBTITLE') : (formData.subtitleLa || formData.subtitle || 'ຫົວຂໍ້ຍ່ອຍ')}
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-white">
                {activeLangTab === 'en' ? (formData.title || 'Headline Title') : (formData.titleLa || formData.title || 'ຫົວຂໍ້ຫຼັກ')}
              </h4>
              <p className="text-xs text-white/80 max-w-xl mx-auto line-clamp-2">
                {activeLangTab === 'en' ? (formData.description || 'Hero description...') : (formData.descriptionLa || formData.description || 'ເນື້ອຫາຄຳອະທິບາຍ...')}
              </p>
              {(formData.buttonText || formData.buttonTextLa) && (
                <div className="pt-2">
                  <span className="inline-block bg-[#0400CC] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    {activeLangTab === 'en' ? (formData.buttonText || 'Button') : (formData.buttonTextLa || formData.buttonText || 'ປຸ່ມ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
