'use client';

import { useLocalizedContent } from '@/context/useLocalizedContent';

import { useUiTranslation } from '@/context/useUiTranslation';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Sparkles, Save, CheckCircle2, AlertCircle, Video, ExternalLink, Eye } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { VideoUpload } from '@/components/ui/VideoUpload';
import { HeroVideo } from '@/components/ui/HeroVideo';

export default function AdminHeroPage() {
  const localize = useLocalizedContent();
  const tr = useUiTranslation();
  const [selectedPage, setSelectedPage] = useState('HOME');
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'la' | 'zh'>('en');
  const [formData, setFormData] = useState({
    page: 'HOME',
    title: '',
    titleLa: '',
    titleZh: '',
    subtitle: '',
    subtitleLa: '',
    subtitleZh: '',
    description: '',
    descriptionLa: '',
    descriptionZh: '',
    buttonText: '',
    buttonTextLa: '',
    buttonTextZh: '',
    buttonUrl: '',
    imageUrl: '',
    image2Url: '',
    image3Url: '',
    image4Url: '',
    bgVideoUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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
          titleZh: data.titleZh || '',
          subtitle: data.subtitle || '',
          subtitleLa: data.subtitleLa || '',
          subtitleZh: data.subtitleZh || '',
          description: data.description || '',
          descriptionLa: data.descriptionLa || '',
          descriptionZh: data.descriptionZh || '',
          buttonText: data.buttonText || '',
          buttonTextLa: data.buttonTextLa || '',
          buttonTextZh: data.buttonTextZh || '',
          buttonUrl: data.buttonUrl || '',
          imageUrl: data.page === 'HOME' ? '' : data.imageUrl || '',
          image2Url: data.image2Url || '',
          image3Url: data.image3Url || '',
          image4Url: data.image4Url || '',
          bgVideoUrl: data.bgVideoUrl || '',
        });
      } else {
        setFormData({
          page: pageCode,
          title: '',
          titleLa: '',
          titleZh: '',
          subtitle: '',
          subtitleLa: '',
          subtitleZh: '',
          description: '',
          descriptionLa: '',
          descriptionZh: '',
          buttonText: '',
          buttonTextLa: '',
          buttonTextZh: '',
          buttonUrl: '',
          imageUrl: '',
          image2Url: '',
          image3Url: '',
          image4Url: '',
          bgVideoUrl: '',
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
    if (uploading || saving || loading) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.upsertHero({
        ...formData,
        imageUrl: selectedPage === 'HOME' ? undefined : formData.imageUrl,
      });
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
          {tr('Hero Sections Manager')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {tr(
            'Customize the homepage video, headlines, background imagery, and CTA actions for each main university page in English, Lao, and Chinese.',
          )}
        </p>
      </div>

      {/* Page Tabs & Live View Link */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex flex-wrap gap-2">
          {pages.map((p) => (
            <button
              key={p.code}
              disabled={uploading || saving || loading}
              onClick={() => setSelectedPage(p.code)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedPage === p.code
                  ? 'bg-[#0400CC] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tr(localize(p, 'name'))}
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
            <span>{tr('View Live Page')}</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </Link>
        )}
      </div>

      {/* Hero Editor Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-4xl space-y-6">
        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-700 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>
              {tr('Hero banner updated successfully! Live page will reflect updates immediately.')}
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{tr(error)}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">{tr('Loading banner settings...')}</div>
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
                <span>{tr('🇬🇧 English')}</span>
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
                <span>{tr('Lao')}</span>
                {formData.titleLa && (
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500"
                    title={tr('Lao translation present')}
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('zh')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeLangTab === 'zh'
                    ? 'bg-white text-[#0400CC] shadow-sm'
                    : 'text-slate-600 hover:text-[#00001C]'
                }`}
              >
                <span>{tr('Chinese')}</span>
                {formData.titleZh && (
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500"
                    title={tr('Chinese translation present')}
                  />
                )}
              </button>
            </div>

            {/* English Fields */}
            {activeLangTab === 'zh' ? (
              /* Chinese Fields */
              <div className="space-y-6 p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    {tr('Chinese Content Fields')}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    {tr('ZH')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {tr('Chinese Subtitle')}
                    </label>
                    <input
                      type="text"
                      name="subtitleZh"
                      value={formData.subtitleZh}
                      onChange={handleChange}
                      placeholder="Enter Chinese subtitle"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {tr('Chinese Headline Title')}
                    </label>
                    <input
                      type="text"
                      name="titleZh"
                      value={formData.titleZh}
                      onChange={handleChange}
                      placeholder="Enter Chinese title"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {tr('Chinese Description')}
                  </label>
                  <textarea
                    name="descriptionZh"
                    rows={3}
                    value={formData.descriptionZh}
                    onChange={handleChange}
                    placeholder="Enter Chinese description"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Chinese Button Text
                    </label>
                    <input
                      type="text"
                      name="buttonTextZh"
                      value={formData.buttonTextZh}
                      onChange={handleChange}
                      placeholder="中文"
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
            ) : activeLangTab === 'en' ? (
              <div className="space-y-6 p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {tr('English Content Fields')}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0400CC]">
                    {tr('EN')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {tr('Subtitle / Badge Label (EN)')}
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      placeholder={tr('e.g. WELCOME TO SIT UNIVERSITY')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {tr('Main Headline Title (EN) ')}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder={tr(
                        'e.g. Shaping Future Leaders Through Innovation & Excellence',
                      )}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {tr('Hero Paragraph Description (EN)')}
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={tr('Write compelling descriptive text for the banner...')}
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
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    {tr('Lao Content Fields')}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    {tr('LA')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {tr('Lao Subtitle')}
                    </label>
                    <input
                      type="text"
                      name="subtitleLa"
                      value={formData.subtitleLa}
                      onChange={handleChange}
                      placeholder="Enter Lao subtitle"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {tr('Lao Headline Title')}
                    </label>
                    <input
                      type="text"
                      name="titleLa"
                      value={formData.titleLa}
                      onChange={handleChange}
                      placeholder="Enter Lao title"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {tr('Lao Description')}
                  </label>
                  <textarea
                    name="descriptionLa"
                    rows={3}
                    value={formData.descriptionLa}
                    onChange={handleChange}
                    placeholder="Enter Lao description"
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

            {/* Hero Media */}
            {selectedPage === 'HOME' ? (
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#0400CC]" />
                  <h3 className="text-sm font-extrabold text-[#00001C] uppercase tracking-wider">
                    {tr('Homepage Hero Video')}
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  {tr('Upload the video visitors will see at the top of the homepage.')}
                </p>

                <VideoUpload
                  value={formData.bgVideoUrl}
                  onChange={(bgVideoUrl) => setFormData((prev) => ({ ...prev, bgVideoUrl }))}
                  onUploadingChange={setUploading}
                  disabled={saving}
                />
              </div>
            ) : (
              <div className="border-t border-slate-200 pt-6 space-y-3">
                <ImageUpload
                  label={tr('Banner Background Image (SeaweedFS)')}
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  placeholder="/images/about_desktopview/img_1.jpg"
                  helpText={tr('Full resolution banner background stored directly in SeaweedFS.')}
                  aspectRatio="wide"
                />
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] disabled:opacity-60 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                {tr(
                  uploading
                    ? tr('Uploading Video...')
                    : saving
                      ? tr('Saving Changes...')
                      : tr('Save Banner Updates'),
                )}
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
              {tr('Live Preview (')}
              {tr(
                activeLangTab === 'zh' ? 'Chinese' : activeLangTab === 'en' ? tr('English') : 'Lao',
              )}
              ) — {tr(localize(currentPage, 'name'))}
            </h3>
          </div>
          <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {tr('Previewing: ')}
            {tr(selectedPage)}
          </span>
        </div>

        {selectedPage === 'HOME' ? (
          <HeroVideo
            key={formData.bgVideoUrl || 'video'}
            src={formData.bgVideoUrl}
            className="aspect-video w-full rounded-2xl border border-slate-700"
          />
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-[#00001C] p-6 sm:p-8 min-h-[180px] flex flex-col justify-center text-center border border-slate-700">
            {formData.imageUrl && (
              <div className="absolute inset-0 z-0">
                <Image
                  src={formData.imageUrl}
                  alt={tr('Background')}
                  fill
                  className="object-cover opacity-25"
                />
                <div className="absolute inset-0 bg-[#0400CC]/40" />
              </div>
            )}
            <div className="relative z-10 space-y-2">
              <span className="inline-block text-[11px] font-bold tracking-widest text-blue-300 uppercase">
                {tr(
                  activeLangTab === 'zh'
                    ? formData.subtitleZh || formData.subtitle || 'Chinese'
                    : activeLangTab === 'en'
                      ? formData.subtitle || tr('SUBTITLE')
                      : formData.subtitleLa || formData.subtitle || 'Chinese content',
                )}
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-white">
                {tr(
                  activeLangTab === 'zh'
                    ? formData.titleZh || formData.title || 'Chinese'
                    : activeLangTab === 'en'
                      ? formData.title || tr('Headline Title')
                      : formData.titleLa || formData.title || 'Chinese content',
                )}
              </h4>
              <p className="text-xs text-white/80 max-w-xl mx-auto line-clamp-2">
                {tr(
                  activeLangTab === 'zh'
                    ? formData.descriptionZh || formData.description || 'Chinese'
                    : activeLangTab === 'en'
                      ? formData.description || tr('Hero description...')
                      : formData.descriptionLa || formData.description || '...',
                )}
              </p>
              {(formData.buttonText || formData.buttonTextLa) && (
                <div className="pt-2">
                  <span className="inline-block bg-[#0400CC] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    {tr(
                      activeLangTab === 'zh'
                        ? formData.buttonTextZh || formData.buttonText || 'Chinese'
                        : activeLangTab === 'en'
                          ? formData.buttonText || tr('Button')
                          : formData.buttonTextLa || formData.buttonText || 'Chinese content',
                    )}
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
