'use client';

import { useLocalizedContent } from '@/context/useLocalizedContent';

import { useUiTranslation } from '@/context/useUiTranslation';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BookOpen, Plus, Edit2, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function AdminProgramsPage() {
  const localize = useLocalizedContent();
  const tr = useUiTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'la' | 'zh'>('en');
  const [formData, setFormData] = useState({
    name: '',
    nameLa: '',
    nameZh: '',
    slug: '',
    degree: 'Bachelor of Science',
    degreeLa: '',
    degreeZh: '',
    duration: '4 Years',
    durationLa: '',
    durationZh: '',
    description: '',
    descriptionLa: '',
    descriptionZh: '',
    heroImage: '',
    coreFocusAreas: 'Full-Stack Systems, AI & Machine Learning, Cloud Architecture',
    coreFocusAreasLa: '',
    coreFocusAreasZh: '',
    departmentId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [progs, depts] = await Promise.all([api.getPrograms(), api.getDepartments()]);
      setItems(progs || []);
      setDepartments(depts || []);
      if (depts && depts.length > 0) {
        setFormData((prev) => ({ ...prev, departmentId: depts[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setActiveLangTab('en');
    setFormData({
      name: '',
      nameLa: '',
      nameZh: '',
      slug: '',
      degree: 'Bachelor of Science',
      degreeLa: 'ປະລິນຍາຕີ ວິທະຍາສາດ',
      degreeZh: '',
      duration: '4 Years',
      durationLa: '4 ປີ',
      durationZh: '',
      description: '',
      descriptionLa: '',
      descriptionZh: '',
      heroImage: '',
      coreFocusAreas: 'Full-Stack Systems, AI & Machine Learning, Cloud Architecture',
      coreFocusAreasLa: 'ລະບົບຟູນສະແຕັກ, ປັນຍາປະດິດ & ການຮຽນຮູ້ຂອງເຄື່ອງ, ສະຖາປັດຕະຍະກຳຄລາວ',
      coreFocusAreasZh: '',
      departmentId: departments[0]?.id || '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setActiveLangTab('en');
    let focusStr = '';
    try {
      const parsed = JSON.parse(item.coreFocusAreas);
      focusStr = Array.isArray(parsed) ? parsed.join(', ') : item.coreFocusAreas;
    } catch {
      focusStr = item.coreFocusAreas || '';
    }

    let focusStrLa = '';
    let focusStrZh = '';
    try {
      if (item.coreFocusAreasLa) {
        const parsedLa = JSON.parse(item.coreFocusAreasLa);
        focusStrLa = Array.isArray(parsedLa) ? parsedLa.join(', ') : item.coreFocusAreasLa;
      }
    } catch {
      focusStrLa = item.coreFocusAreasLa || '';
    }
    try {
      if (item.coreFocusAreasZh) {
        const parsedZh = JSON.parse(item.coreFocusAreasZh);
        focusStrZh = Array.isArray(parsedZh) ? parsedZh.join(', ') : item.coreFocusAreasZh;
      }
    } catch {
      focusStrZh = item.coreFocusAreasZh || '';
    }

    setFormData({
      name: item.name || '',
      nameLa: item.nameLa || '',
      nameZh: item.nameZh || '',
      slug: item.slug || '',
      degree: item.degree || '',
      degreeLa: item.degreeLa || '',
      degreeZh: item.degreeZh || '',
      duration: item.duration || '',
      durationLa: item.durationLa || '',
      durationZh: item.durationZh || '',
      description: item.description || '',
      descriptionLa: item.descriptionLa || '',
      descriptionZh: item.descriptionZh || '',
      heroImage: item.heroImage || '',
      coreFocusAreas: focusStr,
      coreFocusAreasLa: focusStrLa,
      coreFocusAreasZh: focusStrZh,
      departmentId: item.departmentId || item.department?.id || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr('Are you sure you want to delete this program?'))) return;
    try {
      await api.deleteProgram(id);
      loadData();
    } catch (e) {
      alert(tr('Failed to delete program'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const focusArr = formData.coreFocusAreas
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const focusArrLa = formData.coreFocusAreasLa
      ? formData.coreFocusAreasLa
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const focusArrZh = formData.coreFocusAreasZh
      ? formData.coreFocusAreasZh
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const payload = {
      ...formData,
      coreFocusAreas: JSON.stringify(focusArr),
      coreFocusAreasLa: focusArrLa.length > 0 ? JSON.stringify(focusArrLa) : undefined,
      coreFocusAreasZh: focusArrZh.length > 0 ? JSON.stringify(focusArrZh) : null,
    };

    try {
      if (editingItem) {
        await api.updateProgram(editingItem.id, payload);
      } else {
        await api.createProgram(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (e) {
      alert(tr('Failed to save program'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-[#0400CC]" />
            {tr('Academic Degree Programs')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {tr(
              'Manage degree curricula, duration, department assignments, and syllabus focus areas in English, Lao, and Chinese.',
            )}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {tr('Add Degree Program')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            {tr('Loading programs...')}
          </div>
        ) : items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-slate-100 relative">
                  {item.heroImage ? (
                    <img
                      src={item.heroImage}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      {tr('No Image')}
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-[#0400CC] text-white text-[10px] font-bold px-2.5 py-0.5 rounded">
                    {tr(localize(item, 'degree'))}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#0400CC]" />
                      {tr(localize(item, 'duration'))}
                    </span>
                    {item.department && (
                      <span className="text-[#0400CC] font-bold bg-blue-50 px-2 py-0.5 rounded">
                        {tr(localize(item.department, 'name'))}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#00001C]">
                    {tr(localize(item, 'name'))}
                  </h3>
                  {item.nameLa && <p className="text-xs font-bold text-[#0400CC]">{item.nameLa}</p>}
                  <span className="text-xs font-mono text-slate-400 block">
                    /academics/{item.slug}
                  </span>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {tr(localize(item, 'description'))}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
                <button
                  aria-label={tr('Edit')}
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg text-slate-500 hover:text-[#0400CC] hover:bg-slate-50 cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            {tr('No programs found.')}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={tr(editingItem ? 'Edit Degree Program' : 'Create Degree Program')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Language Switcher Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-2">
            <button
              type="button"
              onClick={() => setActiveLangTab('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLangTab === 'en'
                  ? 'bg-white text-[#0400CC] shadow-sm'
                  : 'text-slate-600 hover:text-[#00001C]'
              }`}
            >
              {tr('🇬🇧 English')}
            </button>
            <button
              type="button"
              onClick={() => setActiveLangTab('la')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLangTab === 'la'
                  ? 'bg-white text-[#0400CC] shadow-sm'
                  : 'text-slate-600 hover:text-[#00001C]'
              }`}
            >
              {tr('🇱🇦 ພາສາລາວ (Lao)')}
              {formData.nameLa && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>
            <button
              type="button"
              onClick={() => setActiveLangTab('zh')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLangTab === 'zh'
                  ? 'bg-white text-[#0400CC] shadow-sm'
                  : 'text-slate-600 hover:text-[#00001C]'
              }`}
            >
              {tr('中文 (Chinese)')}
              {formData.nameZh && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>
          </div>

          {activeLangTab === 'zh' ? (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Program Name')}
                </label>
                <input
                  type="text"
                  value={formData.nameZh}
                  onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                  placeholder="请输入中文名称"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Chinese Degree')}
                  </label>
                  <input
                    type="text"
                    value={formData.degreeZh}
                    onChange={(e) => setFormData({ ...formData, degreeZh: e.target.value })}
                    placeholder="请输入中文学位名称"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Chinese Duration')}
                  </label>
                  <input
                    type="text"
                    value={formData.durationZh}
                    onChange={(e) => setFormData({ ...formData, durationZh: e.target.value })}
                    placeholder="请输入中文学制"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Description')}
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionZh}
                  onChange={(e) => setFormData({ ...formData, descriptionZh: e.target.value })}
                  placeholder="请输入中文说明"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Core Focus Areas - Comma separated')}
                </label>
                <input
                  type="text"
                  value={formData.coreFocusAreasZh}
                  onChange={(e) => setFormData({ ...formData, coreFocusAreasZh: e.target.value })}
                  placeholder="请输入中文重点领域，以逗号分隔"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          ) : activeLangTab === 'en' ? (
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Program Name (EN) ')}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={tr('e.g. Bachelor of Science in Computer Science')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Degree Awarded (EN)')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder={tr('Bachelor of Science')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Duration (EN)')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder={tr('4 Years')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Description (EN) ')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={tr('Describe the academic program overview...')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Core Focus Areas (Comma separated - EN)')}
                </label>
                <input
                  type="text"
                  value={formData.coreFocusAreas}
                  onChange={(e) => setFormData({ ...formData, coreFocusAreas: e.target.value })}
                  placeholder={tr('e.g. AI & Deep Learning, Cloud Architecture, Cyber Defense')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('ຊື່ຫຼັກສູດ (Lao Program Name)')}
                </label>
                <input
                  type="text"
                  value={formData.nameLa}
                  onChange={(e) => setFormData({ ...formData, nameLa: e.target.value })}
                  placeholder="ຕົວຢ່າງ: ປະລິນຍາຕີ ວິທະຍາສາດຄອມພິວເຕີ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('ວຸດທິປະລິນຍາ (Lao Degree)')}
                  </label>
                  <input
                    type="text"
                    value={formData.degreeLa}
                    onChange={(e) => setFormData({ ...formData, degreeLa: e.target.value })}
                    placeholder="ຕົວຢ່າງ: ປະລິນຍາຕີ ວິທະຍາສາດ"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('ໄລຍະເວລາຮຽນ (Lao Duration)')}
                  </label>
                  <input
                    type="text"
                    value={formData.durationLa}
                    onChange={(e) => setFormData({ ...formData, durationLa: e.target.value })}
                    placeholder="ຕົວຢ່າງ: 4 ປີ"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('ເນື້ອຫາຄຳອະທິບາຍ (Lao Description)')}
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionLa}
                  onChange={(e) => setFormData({ ...formData, descriptionLa: e.target.value })}
                  placeholder="ອະທິບາຍພາບລວມຂອງຫຼັກສູດເປັນພາສາລາວ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('ຂະແໜງການຮຽນຮູ້ຫຼັກ (Lao Core Focus Areas - Comma separated)')}
                </label>
                <input
                  type="text"
                  value={formData.coreFocusAreasLa}
                  onChange={(e) => setFormData({ ...formData, coreFocusAreasLa: e.target.value })}
                  placeholder="ຕົວຢ່າງ: ປັນຍາປະດິດ, ສະຖາປັດຕະຍະກຳຄລາວ, ຄວາມປອດໄພທາງໄຊເບີ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {tr('Slug (URL Identifier)')}
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {tr('Department')}
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm bg-white"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {tr(localize(d, 'name'))}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ImageUpload
            label={tr('Program Hero Banner (SeaweedFS)')}
            value={formData.heroImage}
            onChange={(url) => setFormData({ ...formData, heroImage: url })}
            placeholder="/images/home_desktopview/img_1.jpg"
            helpText={tr('Uploaded to SeaweedFS in original resolution with zero compression.')}
            aspectRatio="wide"
          />

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
            >
              {tr('Cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              {tr('Save Program')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
