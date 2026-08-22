'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Star, Plus, Edit2, Trash2, Quote } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function AdminSpotlightsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'la'>('en');
  const [formData, setFormData] = useState({
    type: 'STUDENT',
    title: '',
    titleLa: '',
    subtitle: '',
    subtitleLa: '',
    quote: '',
    quoteLa: '',
    description: '',
    descriptionLa: '',
    authorName: '',
    authorNameLa: '',
    authorRole: '',
    authorRoleLa: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getSpotlights();
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
      type: 'STUDENT',
      title: '',
      titleLa: '',
      subtitle: '',
      subtitleLa: '',
      quote: '',
      quoteLa: '',
      description: '',
      descriptionLa: '',
      authorName: '',
      authorNameLa: '',
      authorRole: '',
      authorRoleLa: '',
      imageUrl: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setActiveLangTab('en');
    setFormData({
      type: item.type || 'STUDENT',
      title: item.title || '',
      titleLa: item.titleLa || '',
      subtitle: item.subtitle || '',
      subtitleLa: item.subtitleLa || '',
      quote: item.quote || '',
      quoteLa: item.quoteLa || '',
      description: item.description || '',
      descriptionLa: item.descriptionLa || '',
      authorName: item.authorName || '',
      authorNameLa: item.authorNameLa || '',
      authorRole: item.authorRole || '',
      authorRoleLa: item.authorRoleLa || '',
      imageUrl: item.imageUrl || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this spotlight?')) return;
    try {
      await api.deleteSpotlight(id);
      loadItems();
    } catch (e) {
      alert('Failed to delete spotlight');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateSpotlight(editingItem.id, formData);
      } else {
        await api.createSpotlight(formData);
      }
      setModalOpen(false);
      loadItems();
    } catch (e) {
      alert('Failed to save spotlight');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
            <Star className="w-7 h-7 text-[#0400CC]" />
            Spotlights & Testimonials Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage student success stories, faculty achievements, and alumni testimonials in English and Lao.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Spotlight Story
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading spotlights...</div>
        ) : items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-[#0400CC] uppercase">
                    {item.type || 'SPOTLIGHT'}
                  </span>
                  {item.subtitle && (
                    <span className="text-xs text-slate-400 font-semibold">{item.subtitle}</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#00001C]">
                  {item.title || item.titleLa || item.quote || item.description || 'Untitled Spotlight'}
                </h3>
                {item.titleLa && (
                  <p className="text-xs font-bold text-[#0400CC]">{item.titleLa}</p>
                )}

                {item.quote && (
                  <p className="text-xs sm:text-sm italic text-slate-600 border-l-2 border-[#0400CC] pl-3">
                    "{item.quote}"
                  </p>
                )}

                {item.description && (
                  <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                )}

                {(item.imageUrl || item.authorName || item.authorRole) && (
                  <div className="pt-2 flex items-center gap-3">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.authorName || 'Spotlight'}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                    )}
                    <div>
                      {item.authorName && (
                        <h4 className="text-xs sm:text-sm font-bold text-[#00001C]">{item.authorName}</h4>
                      )}
                      {item.authorRole && (
                        <p className="text-[11px] text-[#0400CC] font-medium">{item.authorRole}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
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
          <div className="col-span-full text-center py-12 text-slate-400">No spotlights found.</div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Spotlight' : 'Add Spotlight'}
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

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Spotlight Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm bg-white"
            >
              <option value="STUDENT">Student Story</option>
              <option value="FACULTY">Faculty Research</option>
              <option value="ALUMNI">Alumni Success</option>
            </select>
          </div>

          {activeLangTab === 'en' ? (
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subtitle Tag (EN)
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. STUDENT SUCCESS STORY"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Headline Title (EN) <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Building Next-Gen AI Applications"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Quote / Testimonial (EN) <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="What did they say?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Story Details / Description (EN) <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full narrative details..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Author Full Name (EN) <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Author Role / Class Year (EN) <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.authorRole}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                    placeholder="Class of 2025 • CS Graduate"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ປ້າຍຫົວຂໍ້ຍ່ອຍ (Lao Subtitle)
                </label>
                <input
                  type="text"
                  value={formData.subtitleLa}
                  onChange={(e) => setFormData({ ...formData, subtitleLa: e.target.value })}
                  placeholder="ຕົວຢ່າງ: ເລື່ອງລາວຄວາມສຳເລັດຂອງນັກສຶກສາ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ຫົວຂໍ້ເລື່ອງລາວ (Lao Title)
                </label>
                <input
                  type="text"
                  value={formData.titleLa}
                  onChange={(e) => setFormData({ ...formData, titleLa: e.target.value })}
                  placeholder="ຕົວຢ່າງ: ການສ້າງແອັບພລິເຄຊັນ AI ລຸ້ນໃໝ່"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ຄຳຄົມ / ຄຳເວົ້າ (Lao Quote)
                </label>
                <textarea
                  rows={2}
                  value={formData.quoteLa}
                  onChange={(e) => setFormData({ ...formData, quoteLa: e.target.value })}
                  placeholder="ຄຳເວົ້າຂອງເຈົ້າຂອງເລື່ອງລາວ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ເນື້ອເລື່ອງລະອຽດ (Lao Description)
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionLa}
                  onChange={(e) => setFormData({ ...formData, descriptionLa: e.target.value })}
                  placeholder="ເນື້ອຫາເລື່ອງລາວລະອຽດເປັນພາສາລາວ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ຊື່ເຈົ້າຂອງເລື່ອງ (Lao Author Name)
                  </label>
                  <input
                    type="text"
                    value={formData.authorNameLa}
                    onChange={(e) => setFormData({ ...formData, authorNameLa: e.target.value })}
                    placeholder="ຕົວຢ່າງ: ມາຢາ ລິນ"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ຕຳແໜ່ງ / ລຸ້ນປີ (Lao Author Role)
                  </label>
                  <input
                    type="text"
                    value={formData.authorRoleLa}
                    onChange={(e) => setFormData({ ...formData, authorRoleLa: e.target.value })}
                    placeholder="ຕົວຢ່າງ: ຮຸ່ນປີ 2025 • ນັກສຶກສາຈົບໃໝ່ CS"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <ImageUpload
            label="Author / Feature Photo (SeaweedFS)"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            placeholder="/images/home_desktopview/img_3.png"
            helpText="Full resolution upload saved to SeaweedFS."
            aspectRatio="square"
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
              Save Spotlight
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
