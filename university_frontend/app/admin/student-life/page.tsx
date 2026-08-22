'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { HeartHandshake, Plus, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function AdminStudentLifePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'la'>('en');
  const [formData, setFormData] = useState({
    title: '',
    titleLa: '',
    description: '',
    descriptionLa: '',
    category: 'Clubs & Societies',
    categoryLa: '',
    imageUrl: '',
    order: 1,
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getStudentLife();
      setItems(data || []);
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
      title: '',
      titleLa: '',
      description: '',
      descriptionLa: '',
      category: 'Academic',
      categoryLa: 'ວິຊາການ',
      imageUrl: '',
      order: items.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setActiveLangTab('en');
    setFormData({
      title: item.title || '',
      titleLa: item.titleLa || '',
      description: item.description || '',
      descriptionLa: item.descriptionLa || '',
      category: item.category || 'Academic',
      categoryLa: item.categoryLa || '',
      imageUrl: item.imageUrl || '',
      order: item.order || 1,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    try {
      await api.deleteStudentLife(id);
      loadItems();
    } catch (e) {
      alert('Failed to delete activity');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateStudentLife(editingItem.id, formData);
      } else {
        await api.createStudentLife(formData);
      }
      setModalOpen(false);
      loadItems();
    } catch (e) {
      alert('Failed to save student life item');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
            <HeartHandshake className="w-7 h-7 text-[#0400CC]" />
            Student Life & Activities Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage clubs, athletic teams, cultural events, and community activities in English and Lao.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Activity / Club
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading student life...</div>
        ) : items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] bg-slate-100 relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Image</div>
                  )}
                  <span className="absolute top-2 left-2 bg-[#00001C]/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-[#00001C]">{item.title}</h3>
                  {item.titleLa && (
                    <p className="text-xs font-bold text-[#0400CC]">{item.titleLa}</p>
                  )}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#0400CC] hover:bg-slate-50 cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">No student activities found.</div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Activity / Club' : 'Add Activity / Club'}
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
              {formData.titleLa && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const cat = e.target.value;
                  const laoCatMap: Record<string, string> = {
                    'Academic': 'ວິຊາການ',
                    'Arts': 'ສິລະປະ',
                    'Creative': 'ຄວາມຄິດສ້າງສັນ',
                    'Leadership': 'ຄວາມເປັນຜູ້ນຳ',
                    'Sports': 'ກິລາ',
                    'Volunteerism': 'ຈິດອາສາ',
                    'Clubs & Societies': 'ຊົມຮົມ & ສະໂມສອນ',
                  };
                  setFormData({
                    ...formData,
                    category: cat,
                    categoryLa: laoCatMap[cat] || formData.categoryLa,
                  });
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm bg-white"
              >
                <option value="Academic">Academic (ວິຊາການ)</option>
                <option value="Arts">Arts & Music (ສິລະປະ & ດົນຕີ)</option>
                <option value="Creative">Creative & Media (ຄວາມຄິດສ້າງສັນ)</option>
                <option value="Leadership">Leadership & Governance (ຄວາມເປັນຜູ້ນຳ)</option>
                <option value="Sports">Sports & Athletics (ກິລາ)</option>
                <option value="Volunteerism">Volunteerism (ຈິດອາສາ)</option>
                <option value="Clubs & Societies">Clubs & Societies (ຊົມຮົມທົ່ວໄປ)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
              />
            </div>
          </div>

          {activeLangTab === 'en' ? (
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Activity Title (EN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. AI & Robotics Club"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
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
                  placeholder="Describe the club goals and weekly activities..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ຊື່ກິດຈະກຳ / ຊົມຮົມ (Lao Activity Title)
                </label>
                <input
                  type="text"
                  value={formData.titleLa}
                  onChange={(e) => setFormData({ ...formData, titleLa: e.target.value })}
                  placeholder="ຕົວຢ່າງ: ຊົມຮົມ AI & ຫຸ່ນຍົນ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ເນື້ອຫາຄຳອະທິບາຍ (Lao Description)
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionLa}
                  onChange={(e) => setFormData({ ...formData, descriptionLa: e.target.value })}
                  placeholder="ອະທິບາຍເປົ້າໝາຍຊົມຮົມ ແລະ ກິດຈະກຳປະຈຳອາທິດ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ໝວດໝູ່ພາສາລາວ (Lao Category)
                </label>
                <input
                  type="text"
                  value={formData.categoryLa}
                  onChange={(e) => setFormData({ ...formData, categoryLa: e.target.value })}
                  placeholder="ຕົວຢ່າງ: ຊົມຮົມ & ສະໂມສອນ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          )}

          <ImageUpload
            label="Activity Cover Image (SeaweedFS)"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            placeholder="/images/life_at_sit_desktopview/img_2.jpg"
            helpText="Full quality photo uploaded directly to SeaweedFS."
            aspectRatio="video"
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
              Save Activity
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
