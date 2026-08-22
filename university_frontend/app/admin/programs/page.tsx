'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BookOpen, Plus, Edit2, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function AdminProgramsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'la'>('en');
  const [formData, setFormData] = useState({
    name: '',
    nameLa: '',
    slug: '',
    degree: 'Bachelor of Science',
    degreeLa: '',
    duration: '4 Years',
    durationLa: '',
    description: '',
    descriptionLa: '',
    heroImage: '',
    coreFocusAreas: 'Full-Stack Systems, AI & Machine Learning, Cloud Architecture',
    coreFocusAreasLa: '',
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
      slug: '',
      degree: 'Bachelor of Science',
      degreeLa: 'ປະລິນຍາຕີ ວິທະຍາສາດ',
      duration: '4 Years',
      durationLa: '4 ປີ',
      description: '',
      descriptionLa: '',
      heroImage: '',
      coreFocusAreas: 'Full-Stack Systems, AI & Machine Learning, Cloud Architecture',
      coreFocusAreasLa: 'ລະບົບຟູນສະແຕັກ, ປັນຍາປະດິດ & ການຮຽນຮູ້ຂອງເຄື່ອງ, ສະຖາປັດຕະຍະກຳຄລາວ',
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
    try {
      if (item.coreFocusAreasLa) {
        const parsedLa = JSON.parse(item.coreFocusAreasLa);
        focusStrLa = Array.isArray(parsedLa) ? parsedLa.join(', ') : item.coreFocusAreasLa;
      }
    } catch {
      focusStrLa = item.coreFocusAreasLa || '';
    }

    setFormData({
      name: item.name || '',
      nameLa: item.nameLa || '',
      slug: item.slug || '',
      degree: item.degree || '',
      degreeLa: item.degreeLa || '',
      duration: item.duration || '',
      durationLa: item.durationLa || '',
      description: item.description || '',
      descriptionLa: item.descriptionLa || '',
      heroImage: item.heroImage || '',
      coreFocusAreas: focusStr,
      coreFocusAreasLa: focusStrLa,
      departmentId: item.departmentId || item.department?.id || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    try {
      await api.deleteProgram(id);
      loadData();
    } catch (e) {
      alert('Failed to delete program');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const focusArr = formData.coreFocusAreas
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const focusArrLa = formData.coreFocusAreasLa
      ? formData.coreFocusAreasLa.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      coreFocusAreas: JSON.stringify(focusArr),
      coreFocusAreasLa: focusArrLa.length > 0 ? JSON.stringify(focusArrLa) : undefined,
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
      alert('Failed to save program');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-[#0400CC]" />
            Academic Degree Programs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage degree curricula, duration, department assignments, and syllabus focus areas in English and Lao.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Degree Program
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading programs...</div>
        ) : items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-slate-100 relative">
                  {item.heroImage ? (
                    <img src={item.heroImage} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Image</div>
                  )}
                  <span className="absolute top-2 left-2 bg-[#0400CC] text-white text-[10px] font-bold px-2.5 py-0.5 rounded">
                    {item.degree}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#0400CC]" />
                      {item.duration}
                    </span>
                    {item.department && (
                      <span className="text-[#0400CC] font-bold bg-blue-50 px-2 py-0.5 rounded">
                        {item.department.name}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#00001C]">{item.name}</h3>
                  {item.nameLa && (
                    <p className="text-xs font-bold text-[#0400CC]">{item.nameLa}</p>
                  )}
                  <span className="text-xs font-mono text-slate-400 block">/academics/{item.slug}</span>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
                <button
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
          <div className="col-span-full text-center py-12 text-slate-400">No programs found.</div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Degree Program' : 'Create Degree Program'}
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
              🇬🇧 English
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
              🇱🇦 ພາສາລາວ (Lao)
              {formData.nameLa && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>
          </div>

          {activeLangTab === 'en' ? (
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Program Name (EN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Degree Awarded (EN)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="Bachelor of Science"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Duration (EN)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="4 Years"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description (EN) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the academic program overview..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Core Focus Areas (Comma separated - EN)
                </label>
                <input
                  type="text"
                  value={formData.coreFocusAreas}
                  onChange={(e) => setFormData({ ...formData, coreFocusAreas: e.target.value })}
                  placeholder="e.g. AI & Deep Learning, Cloud Architecture, Cyber Defense"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ຊື່ຫຼັກສູດ (Lao Program Name)
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
                    ວຸດທິປະລິນຍາ (Lao Degree)
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
                    ໄລຍະເວລາຮຽນ (Lao Duration)
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
                  ເນື້ອຫາຄຳອະທິບາຍ (Lao Description)
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
                  ຂະແໜງການຮຽນຮູ້ຫຼັກ (Lao Core Focus Areas - Comma separated)
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
                Slug (URL Identifier)
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
                Department
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm bg-white"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ImageUpload
            label="Program Hero Banner (SeaweedFS)"
            value={formData.heroImage}
            onChange={(url) => setFormData({ ...formData, heroImage: url })}
            placeholder="/images/home_desktopview/img_1.jpg"
            helpText="Uploaded to SeaweedFS in original resolution with zero compression."
            aspectRatio="wide"
          />

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Save Program
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
