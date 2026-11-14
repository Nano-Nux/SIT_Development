'use client';

import { useLocalizedContent } from '@/context/useLocalizedContent';

import { useUiTranslation } from '@/context/useUiTranslation';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Compass, Save, CheckCircle2, Plus, Trash2, User, Eye, Target } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function AdminAboutPage() {
  const localize = useLocalizedContent();
  const tr = useUiTranslation();
  const [tab, setTab] = useState<'FOUNDER' | 'VISION' | 'MEMBERS' | 'HISTORY'>('FOUNDER');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Active language tabs for each section
  const [founderLangTab, setFounderLangTab] = useState<'en' | 'la' | 'zh'>('en');
  const [visionLangTab, setVisionLangTab] = useState<'en' | 'la' | 'zh'>('en');
  const [memberLangTab, setMemberLangTab] = useState<'en' | 'la' | 'zh'>('en');
  const [historyLangTab, setHistoryLangTab] = useState<'en' | 'la' | 'zh'>('en');

  // Founder State
  const [founder, setFounder] = useState({
    name: '',
    nameLa: '',
    nameZh: '',
    designation: '',
    designationLa: '',
    designationZh: '',
    quote: '',
    quoteLa: '',
    quoteZh: '',
    biography: '',
    biographyLa: '',
    biographyZh: '',
    imageUrl: '',
  });

  // Vision State
  const [visionMission, setVisionMission] = useState({
    vision: '',
    visionLa: '',
    visionZh: '',
    mission: '',
    missionLa: '',
    missionZh: '',
    corePillars: 'World-Class Quality, Tech Innovation, Ethical Leadership, Global Mobility',
    corePillarsLa: '',
    corePillarsZh: '',
  });

  // Members State
  const [members, setMembers] = useState<any[]>([]);
  const [memberModal, setMemberModal] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: '',
    nameLa: '',
    nameZh: '',
    position: '',
    positionLa: '',
    positionZh: '',
    category: 'Board of Trustees',
    categoryLa: '',
    categoryZh: '',
    biography: '',
    biographyLa: '',
    biographyZh: '',
    imageUrl: '',
    order: 1,
  });

  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [historyModal, setHistoryModal] = useState(false);
  const [historyForm, setHistoryForm] = useState({
    year: '2026',
    title: '',
    titleLa: '',
    titleZh: '',
    description: '',
    descriptionLa: '',
    descriptionZh: '',
    order: 1,
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [f, vm, mems, hist] = await Promise.all([
        api.getFounder(),
        api.getVisionMission(),
        api.getMembers(),
        api.getHistory(),
      ]);

      if (f) {
        setFounder({
          name: f.name || '',
          nameLa: f.nameLa || '',
          nameZh: f.nameZh || '',
          designation: f.designation || '',
          designationLa: f.designationLa || '',
          designationZh: f.designationZh || '',
          quote: f.quote || '',
          quoteLa: f.quoteLa || '',
          quoteZh: f.quoteZh || '',
          biography: f.biography || '',
          biographyLa: f.biographyLa || '',
          biographyZh: f.biographyZh || '',
          imageUrl: f.imageUrl || '',
        });
      }
      if (vm) {
        let pillarsStr = vm.corePillars || '';
        try {
          const parsed = JSON.parse(vm.corePillars);
          if (Array.isArray(parsed)) pillarsStr = parsed.join(', ');
        } catch {}

        let pillarsLaStr = vm.corePillarsLa || '';
        let pillarsZhStr = vm.corePillarsZh || '';
        try {
          const parsedLa = JSON.parse(vm.corePillarsLa);
          if (Array.isArray(parsedLa)) pillarsLaStr = parsedLa.join(', ');
        } catch {}
        try {
          const parsedZh = JSON.parse(vm.corePillarsZh);
          if (Array.isArray(parsedZh)) pillarsZhStr = parsedZh.join(', ');
        } catch {}

        setVisionMission({
          vision: vm.vision || '',
          visionLa: vm.visionLa || '',
          visionZh: vm.visionZh || '',
          mission: vm.mission || '',
          missionLa: vm.missionLa || '',
          missionZh: vm.missionZh || '',
          corePillars: pillarsStr,
          corePillarsLa: pillarsLaStr,
          corePillarsZh: pillarsZhStr,
        });
      }
      setMembers(mems || []);
      setHistory(hist || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFounder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.upsertFounder(founder);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert(tr('Failed to save founder info'));
    }
  };

  const handleSaveVision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pillarsArr = visionMission.corePillars
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const pillarsLaArr = visionMission.corePillarsLa
        ? visionMission.corePillarsLa
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const pillarsZhArr = visionMission.corePillarsZh
        ? visionMission.corePillarsZh
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      await api.upsertVisionMission({
        ...visionMission,
        corePillars: JSON.stringify(pillarsArr),
        corePillarsLa: pillarsLaArr.length > 0 ? JSON.stringify(pillarsLaArr) : undefined,
        corePillarsZh: pillarsZhArr.length > 0 ? JSON.stringify(pillarsZhArr) : null,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert(tr('Failed to save vision/mission'));
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createMember(memberForm);
      setMemberModal(false);
      const res = await api.getMembers();
      setMembers(res || []);
    } catch (e) {
      alert(tr('Failed to save council member'));
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm(tr('Delete member?'))) return;
    try {
      await api.deleteMember(id);
      const res = await api.getMembers();
      setMembers(res || []);
    } catch (e) {
      alert(tr('Failed to delete member'));
    }
  };

  const handleSaveHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createHistory(historyForm);
      setHistoryModal(false);
      const res = await api.getHistory();
      setHistory(res || []);
    } catch (e) {
      alert(tr('Failed to save history milestone'));
    }
  };

  const handleDeleteHistory = async (id: string) => {
    if (!confirm(tr('Delete milestone?'))) return;
    try {
      await api.deleteHistory(id);
      const res = await api.getHistory();
      setHistory(res || []);
    } catch (e) {
      alert(tr('Failed to delete milestone'));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
          <Compass className="w-7 h-7 text-[#0400CC]" />
          {tr('About SIT Content Manager')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {tr(
            'Manage Founder message, Vision & Mission, Board Members, and Historical Milestones in English, Lao, and Chinese.',
          )}
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
        <button
          onClick={() => setTab('FOUNDER')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            tab === 'FOUNDER'
              ? 'bg-[#0400CC] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          {tr('Founder Information')}
        </button>
        <button
          onClick={() => setTab('VISION')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            tab === 'VISION'
              ? 'bg-[#0400CC] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          {tr('Vision & Mission')}
        </button>
        <button
          onClick={() => setTab('MEMBERS')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            tab === 'MEMBERS'
              ? 'bg-[#0400CC] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          {tr('Board & Council Members')}
        </button>
        <button
          onClick={() => setTab('HISTORY')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            tab === 'HISTORY'
              ? 'bg-[#0400CC] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          {tr('Historical Timeline')}
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-700 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{tr('Content updated successfully!')}</span>
        </div>
      )}

      {/* Tab 1: Founder */}
      {tab === 'FOUNDER' && (
        <form
          onSubmit={handleSaveFounder}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl space-y-4"
        >
          {/* Language Switcher Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-2">
            <button
              type="button"
              onClick={() => setFounderLangTab('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                founderLangTab === 'en'
                  ? 'bg-white text-[#0400CC] shadow-sm'
                  : 'text-slate-600 hover:text-[#00001C]'
              }`}
            >
              {tr('🇬🇧 English')}
            </button>
            <button
              type="button"
              onClick={() => setFounderLangTab('la')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                founderLangTab === 'la'
                  ? 'bg-white text-[#0400CC] shadow-sm'
                  : 'text-slate-600 hover:text-[#00001C]'
              }`}
            >
              {tr('🇱🇦 ພາສາລາວ (Lao)')}
              {founder.nameLa && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>
            <button
              type="button"
              onClick={() => setFounderLangTab('zh')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                founderLangTab === 'zh'
                  ? 'bg-white text-[#0400CC] shadow-sm'
                  : 'text-slate-600 hover:text-[#00001C]'
              }`}
            >
              {tr('中文 (Chinese)')}
              {founder.nameZh && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>
          </div>

          {founderLangTab === 'zh' ? (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Founder Full Name')}
                </label>
                <input
                  type="text"
                  value={founder.nameZh}
                  onChange={(e) => setFounder({ ...founder, nameZh: e.target.value })}
                  placeholder="请输入中文名称"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Designation')}
                </label>
                <input
                  type="text"
                  value={founder.designationZh}
                  onChange={(e) => setFounder({ ...founder, designationZh: e.target.value })}
                  placeholder="请输入中文职务"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Quote')}
                </label>
                <textarea
                  rows={3}
                  value={founder.quoteZh}
                  onChange={(e) => setFounder({ ...founder, quoteZh: e.target.value })}
                  placeholder="请输入中文寄语"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Biography')}
                </label>
                <textarea
                  rows={5}
                  value={founder.biographyZh}
                  onChange={(e) => setFounder({ ...founder, biographyZh: e.target.value })}
                  placeholder="请输入中文个人简介"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
            </div>
          ) : founderLangTab === 'en' ? (
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Founder Full Name (EN) ')}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={founder.name}
                  onChange={(e) => setFounder({ ...founder, name: e.target.value })}
                  placeholder={tr('e.g. Dr. Thanousone Phonamat')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Designation (EN) ')}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={founder.designation}
                  onChange={(e) => setFounder({ ...founder, designation: e.target.value })}
                  placeholder={tr('e.g. Founder & Chairman of the Board')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Featured Founder Quote (EN)')}
                </label>
                <textarea
                  rows={3}
                  value={founder.quote}
                  onChange={(e) => setFounder({ ...founder, quote: e.target.value })}
                  placeholder={tr('Inspiring quote from the founder...')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Founder Biography (EN)')}
                </label>
                <textarea
                  rows={5}
                  value={founder.biography}
                  onChange={(e) => setFounder({ ...founder, biography: e.target.value })}
                  placeholder={tr('Full background and biography...')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('ຊື່ເຕັມຜູ້ກໍ່ຕັ້ງ (Lao Founder Full Name)')}
                </label>
                <input
                  type="text"
                  value={founder.nameLa}
                  onChange={(e) => setFounder({ ...founder, nameLa: e.target.value })}
                  placeholder="ຕົວຢ່າງ: ທ່ານ ດຣ. ທະນູສອນ ໂພນອາມາດ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('ຕຳແໜ່ງ (Lao Designation)')}
                </label>
                <input
                  type="text"
                  value={founder.designationLa}
                  onChange={(e) => setFounder({ ...founder, designationLa: e.target.value })}
                  placeholder="ຕົວຢ່າງ: ຜູ້ກໍ່ຕັ້ງ ແລະ ປະທານສະພາບໍລິຫານ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('ຄຳຄົມ / ຄຳປາໄສຜູ້ກໍ່ຕັ້ງ (Lao Quote)')}
                </label>
                <textarea
                  rows={3}
                  value={founder.quoteLa}
                  onChange={(e) => setFounder({ ...founder, quoteLa: e.target.value })}
                  placeholder="ຄຳປາໄສສ້າງແຮງບັນດານໃຈຈາກຜູ້ກໍ່ຕັ້ງ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('ຊີວະປະຫວັດຜູ້ກໍ່ຕັ້ງ (Lao Biography)')}
                </label>
                <textarea
                  rows={5}
                  value={founder.biographyLa}
                  onChange={(e) => setFounder({ ...founder, biographyLa: e.target.value })}
                  placeholder="ປະຫວັດຄວາມເປັນມາ ແລະ ຜົນງານ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
            </div>
          )}

          <ImageUpload
            label={tr('Founder Official Portrait (SeaweedFS)')}
            value={founder.imageUrl}
            onChange={(url) => setFounder({ ...founder, imageUrl: url })}
            placeholder="/images/about_desktopview/img_1.jpg"
            helpText={tr('Preserves full portrait resolution in SeaweedFS without downscaling.')}
            aspectRatio="portrait"
          />
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {tr(' Save Founder Info')}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Vision & Mission */}
      {tab === 'VISION' && (
        <form
          onSubmit={handleSaveVision}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl space-y-4"
        >
          {/* Language Switcher Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-2">
            <button
              type="button"
              onClick={() => setVisionLangTab('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                visionLangTab === 'en'
                  ? 'bg-white text-[#0400CC] shadow-sm'
                  : 'text-slate-600 hover:text-[#00001C]'
              }`}
            >
              {tr('🇬🇧 English')}
            </button>
            <button
              type="button"
              onClick={() => setVisionLangTab('la')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                visionLangTab === 'la'
                  ? 'bg-white text-[#0400CC] shadow-sm'
                  : 'text-slate-600 hover:text-[#00001C]'
              }`}
            >
              {tr('🇱🇦 ພາສາລາວ (Lao)')}
              {visionMission.visionLa && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setVisionLangTab('zh')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                visionLangTab === 'zh'
                  ? 'bg-white text-[#0400CC] shadow-sm'
                  : 'text-slate-600 hover:text-[#00001C]'
              }`}
            >
              {tr('中文 (Chinese)')}
              {visionMission.visionZh && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          </div>

          {visionLangTab === 'zh' ? (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Vision Statement')}
                </label>
                <textarea
                  rows={4}
                  value={visionMission.visionZh}
                  onChange={(e) => setVisionMission({ ...visionMission, visionZh: e.target.value })}
                  placeholder="请输入中文内容"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Mission Statement')}
                </label>
                <textarea
                  rows={4}
                  value={visionMission.missionZh}
                  onChange={(e) =>
                    setVisionMission({ ...visionMission, missionZh: e.target.value })
                  }
                  placeholder="请输入中文内容"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Core Pillars (comma separated)')}
                </label>
                <input
                  type="text"
                  value={visionMission.corePillarsZh}
                  onChange={(e) =>
                    setVisionMission({ ...visionMission, corePillarsZh: e.target.value })
                  }
                  placeholder="请输入中文核心支柱，以逗号分隔"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
            </div>
          ) : visionLangTab === 'en' ? (
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Institutional Vision Statement (EN) ')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={visionMission.vision}
                  onChange={(e) => setVisionMission({ ...visionMission, vision: e.target.value })}
                  placeholder={tr('Vision statement in English...')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Institutional Mission Statement (EN) ')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={visionMission.mission}
                  onChange={(e) => setVisionMission({ ...visionMission, mission: e.target.value })}
                  placeholder={tr('Mission statement in English...')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Core Pillars (EN - Comma separated)')}
                </label>
                <input
                  type="text"
                  value={visionMission.corePillars}
                  onChange={(e) =>
                    setVisionMission({ ...visionMission, corePillars: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('ວິໄສທັດຂອງສະຖາບັນ (Lao Vision Statement)')}
                </label>
                <textarea
                  rows={4}
                  value={visionMission.visionLa}
                  onChange={(e) => setVisionMission({ ...visionMission, visionLa: e.target.value })}
                  placeholder="ວິໄສທັດຂອງມະຫາວິທະຍາໄລເປັນພາສາລາວ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('ພັນທະກິດຂອງສະຖາບັນ (Lao Mission Statement)')}
                </label>
                <textarea
                  rows={4}
                  value={visionMission.missionLa}
                  onChange={(e) =>
                    setVisionMission({ ...visionMission, missionLa: e.target.value })
                  }
                  placeholder="ພັນທະກິດຂອງມະຫາວິທະຍາໄລເປັນພາສາລາວ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ເສົາຄ້ຳຫຼັກ (Lao Core Pillars - ຂັ້ນດ້ວຍຈຸດ)
                </label>
                <input
                  type="text"
                  value={visionMission.corePillarsLa}
                  onChange={(e) =>
                    setVisionMission({ ...visionMission, corePillarsLa: e.target.value })
                  }
                  placeholder="ຕົວຢ່າງ: ຄຸນນະພາບມາດຕະຖານສາກົນ, ນະວັດຕະກຳເຕັກໂນໂລຊີ, ຄວາມເປັນຜູ້ນຳທີ່ມີຈັນຍາບັນ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>
            </div>
          )}

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {tr(' Save Vision & Mission')}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Members */}
      {tab === 'MEMBERS' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setMemberLangTab('en');
                setMemberForm({
                  name: '',
                  nameLa: '',
                  nameZh: '',
                  position: '',
                  positionLa: '',
                  positionZh: '',
                  category: 'Board of Trustees',
                  categoryLa: '',
                  categoryZh: '',
                  biography: '',
                  biographyLa: '',
                  biographyZh: '',
                  imageUrl: '',
                  order: members.length + 1,
                });
                setMemberModal(true);
              }}
              className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {tr(' Add Board Member')}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {members.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0400CC] uppercase">
                    {tr(localize(m, 'category'))}
                  </span>
                  <h3 className="text-base font-bold text-[#00001C] mt-2">
                    {tr(localize(m, 'name'))}
                  </h3>
                  {m.nameLa && <p className="text-xs font-bold text-[#0400CC]">{m.nameLa}</p>}
                  <p className="text-xs font-semibold text-[#0400CC] mb-2">
                    {tr(localize(m, 'position'))}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-3">
                    {tr(localize(m, 'biography'))}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleDeleteMember(m.id)}
                    className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Modal
            isOpen={memberModal}
            onClose={() => setMemberModal(false)}
            title={tr(' Add Board Member')}
          >
            <form onSubmit={handleSaveMember} className="space-y-4">
              {/* Language Switcher Tabs */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-2">
                <button
                  type="button"
                  onClick={() => setMemberLangTab('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    memberLangTab === 'en'
                      ? 'bg-white text-[#0400CC] shadow-sm'
                      : 'text-slate-600 hover:text-[#00001C]'
                  }`}
                >
                  {tr('🇬🇧 English')}
                </button>
                <button
                  type="button"
                  onClick={() => setMemberLangTab('la')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    memberLangTab === 'la'
                      ? 'bg-white text-[#0400CC] shadow-sm'
                      : 'text-slate-600 hover:text-[#00001C]'
                  }`}
                >
                  {tr('🇱🇦 ພາສາລາວ (Lao)')}
                  {memberForm.nameLa && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setMemberLangTab('zh')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    memberLangTab === 'zh'
                      ? 'bg-white text-[#0400CC] shadow-sm'
                      : 'text-slate-600 hover:text-[#00001C]'
                  }`}
                >
                  {tr('中文 (Chinese)')}
                  {memberForm.nameZh && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Category')}
                </label>
                <select
                  value={memberForm.category}
                  onChange={(e) => setMemberForm({ ...memberForm, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="Board of Trustees">{tr('Board of Trustees')}</option>
                  <option value="University Council">{tr('University Council')}</option>
                  <option value="Academic Advisory Board">{tr('Academic Advisory Board')}</option>
                </select>
              </div>

              {memberLangTab === 'zh' ? (
                <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('Chinese Full Name')}
                    </label>
                    <input
                      type="text"
                      value={memberForm.nameZh}
                      onChange={(e) => setMemberForm({ ...memberForm, nameZh: e.target.value })}
                      placeholder="请输入中文名称"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('Chinese Position')}
                    </label>
                    <input
                      type="text"
                      value={memberForm.positionZh}
                      onChange={(e) => setMemberForm({ ...memberForm, positionZh: e.target.value })}
                      placeholder="请输入中文职位"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('Chinese Biography')}
                    </label>
                    <textarea
                      rows={3}
                      value={memberForm.biographyZh}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, biographyZh: e.target.value })
                      }
                      placeholder="请输入中文个人简介"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('Chinese Category')}
                    </label>
                    <input
                      type="text"
                      value={memberForm.categoryZh}
                      onChange={(e) => setMemberForm({ ...memberForm, categoryZh: e.target.value })}
                      placeholder="请输入中文分类"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                </div>
              ) : memberLangTab === 'en' ? (
                <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('Full Name (EN) ')}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      placeholder={tr('e.g. Prof. Somlith Boungnaphone')}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('Position (EN) ')}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={memberForm.position}
                      onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })}
                      placeholder={tr('e.g. Vice Chairman')}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('Biography (EN)')}
                    </label>
                    <textarea
                      rows={3}
                      value={memberForm.biography}
                      onChange={(e) => setMemberForm({ ...memberForm, biography: e.target.value })}
                      placeholder={tr('Short bio...')}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('ຊື່ເຕັມ (Lao Full Name)')}
                    </label>
                    <input
                      type="text"
                      value={memberForm.nameLa}
                      onChange={(e) => setMemberForm({ ...memberForm, nameLa: e.target.value })}
                      placeholder="ຕົວຢ່າງ: ສຈ. ສົມລິດ ບຸ່ງນະໂພນ"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('ຕຳແໜ່ງ (Lao Position)')}
                    </label>
                    <input
                      type="text"
                      value={memberForm.positionLa}
                      onChange={(e) => setMemberForm({ ...memberForm, positionLa: e.target.value })}
                      placeholder="ຕົວຢ່າງ: ຮອງປະທານສະພາບໍລິຫານ"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('ຊີວະປະຫວັດ (Lao Biography)')}
                    </label>
                    <textarea
                      rows={3}
                      value={memberForm.biographyLa}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, biographyLa: e.target.value })
                      }
                      placeholder="ຊີວະປະຫວັດຫຍໍ້..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('ໝວດໝູ່ພາສາລາວ (Lao Category)')}
                    </label>
                    <input
                      type="text"
                      value={memberForm.categoryLa}
                      onChange={(e) => setMemberForm({ ...memberForm, categoryLa: e.target.value })}
                      placeholder="ຕົວຢ່າງ: ສະພາບໍລິຫານ"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                </div>
              )}

              <ImageUpload
                label={tr('Member Photo (SeaweedFS)')}
                value={memberForm.imageUrl}
                onChange={(url) => setMemberForm({ ...memberForm, imageUrl: url })}
                placeholder="/images/home_desktopview/img_5.jpg"
                helpText={tr('Direct upload to SeaweedFS with 100% full fidelity.')}
                aspectRatio="portrait"
              />
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMemberModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 cursor-pointer"
                >
                  {tr('Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0400CC] text-white text-xs font-bold shadow cursor-pointer"
                >
                  {tr('Save Member')}
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {/* Tab 4: History */}
      {tab === 'HISTORY' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setHistoryLangTab('en');
                setHistoryForm({
                  year: '2026',
                  title: '',
                  titleLa: '',
                  titleZh: '',
                  description: '',
                  descriptionLa: '',
                  descriptionZh: '',
                  order: history.length + 1,
                });
                setHistoryModal(true);
              }}
              className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {tr(' Add Historical Milestone')}
            </button>
          </div>
          <div className="space-y-3 max-w-3xl">
            {history.map((h) => (
              <div
                key={h.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black text-[#0400CC] w-16">{h.year}</span>
                  <div>
                    <h3 className="text-sm font-bold text-[#00001C]">{tr(localize(h, 'title'))}</h3>
                    {h.titleLa && <p className="text-xs font-bold text-[#0400CC]">{h.titleLa}</p>}
                    <p className="text-xs text-slate-500 mt-0.5">
                      {tr(localize(h, 'description'))}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteHistory(h.id)}
                  className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <Modal
            isOpen={historyModal}
            onClose={() => setHistoryModal(false)}
            title={tr('Add Milestone')}
          >
            <form onSubmit={handleSaveHistory} className="space-y-4">
              {/* Language Switcher Tabs */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-2">
                <button
                  type="button"
                  onClick={() => setHistoryLangTab('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    historyLangTab === 'en'
                      ? 'bg-white text-[#0400CC] shadow-sm'
                      : 'text-slate-600 hover:text-[#00001C]'
                  }`}
                >
                  {tr('🇬🇧 English')}
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryLangTab('la')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    historyLangTab === 'la'
                      ? 'bg-white text-[#0400CC] shadow-sm'
                      : 'text-slate-600 hover:text-[#00001C]'
                  }`}
                >
                  {tr('🇱🇦 ພາສາລາວ (Lao)')}
                  {historyForm.titleLa && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryLangTab('zh')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    historyLangTab === 'zh'
                      ? 'bg-white text-[#0400CC] shadow-sm'
                      : 'text-slate-600 hover:text-[#00001C]'
                  }`}
                >
                  {tr('中文 (Chinese)')}
                  {historyForm.titleZh && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Year')}
                  </label>
                  <input
                    type="text"
                    required
                    value={historyForm.year}
                    onChange={(e) => setHistoryForm({ ...historyForm, year: e.target.value })}
                    placeholder={tr('2026')}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Order')}
                  </label>
                  <input
                    type="number"
                    value={historyForm.order}
                    onChange={(e) =>
                      setHistoryForm({ ...historyForm, order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              {historyLangTab === 'zh' ? (
                <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('Chinese Milestone Title')}
                    </label>
                    <input
                      type="text"
                      value={historyForm.titleZh}
                      onChange={(e) => setHistoryForm({ ...historyForm, titleZh: e.target.value })}
                      placeholder="请输入中文标题"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('Chinese Description')}
                    </label>
                    <textarea
                      rows={3}
                      value={historyForm.descriptionZh}
                      onChange={(e) =>
                        setHistoryForm({ ...historyForm, descriptionZh: e.target.value })
                      }
                      placeholder="请输入中文说明"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                </div>
              ) : historyLangTab === 'en' ? (
                <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('Milestone Title (EN) ')}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={historyForm.title}
                      onChange={(e) => setHistoryForm({ ...historyForm, title: e.target.value })}
                      placeholder={tr('e.g. Foundation of SIT')}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('Description (EN) ')}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={historyForm.description}
                      onChange={(e) =>
                        setHistoryForm({ ...historyForm, description: e.target.value })
                      }
                      placeholder={tr('Details of milestone in English...')}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('ຫົວຂໍ້ປະຫວັດສາດ (Lao Milestone Title)')}
                    </label>
                    <input
                      type="text"
                      value={historyForm.titleLa}
                      onChange={(e) => setHistoryForm({ ...historyForm, titleLa: e.target.value })}
                      placeholder="ຕົວຢ່າງ: ການສ້າງຕັ້ງມະຫາວິທະຍາໄລ SIT"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {tr('ລາຍລະອຽດ (Lao Description)')}
                    </label>
                    <textarea
                      rows={3}
                      value={historyForm.descriptionLa}
                      onChange={(e) =>
                        setHistoryForm({ ...historyForm, descriptionLa: e.target.value })
                      }
                      placeholder="ລາຍລະອຽດເຫດການສຳຄັນເປັນພາສາລາວ..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setHistoryModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 cursor-pointer"
                >
                  {tr('Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0400CC] text-white text-xs font-bold shadow cursor-pointer"
                >
                  {tr('Save Milestone')}
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </div>
  );
}
