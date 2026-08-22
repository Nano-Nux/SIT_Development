'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Building2, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function AdminCampusPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'la'>('en');
  const [formData, setFormData] = useState({
    name: '',
    nameLa: '',
    description: '',
    descriptionLa: '',
    imageUrl: '',
    actionType: 'MODAL',
    destinationUrl: '',
    modalTitle: '',
    modalTitleLa: '',
    modalContent: '',
    modalContentLa: '',
    order: 1,
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getCampusFacilities();
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
      name: '',
      nameLa: '',
      description: '',
      descriptionLa: '',
      imageUrl: '',
      actionType: 'MODAL',
      destinationUrl: '',
      modalTitle: '',
      modalTitleLa: '',
      modalContent: '',
      modalContentLa: '',
      order: items.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setActiveLangTab('en');
    setFormData({
      name: item.name || '',
      nameLa: item.nameLa || '',
      description: item.description || '',
      descriptionLa: item.descriptionLa || '',
      imageUrl: item.imageUrl || '',
      actionType: item.actionType || 'MODAL',
      destinationUrl: item.destinationUrl || '',
      modalTitle: item.modalTitle || '',
      modalTitleLa: item.modalTitleLa || '',
      modalContent: item.modalContent || '',
      modalContentLa: item.modalContentLa || '',
      order: item.order || 1,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campus facility?')) return;
    try {
      await api.deleteCampusFacility(id);
      loadItems();
    } catch (e) {
      alert('Failed to delete facility');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateCampusFacility(editingItem.id, formData);
      } else {
        await api.createCampusFacility(formData);
      }
      setModalOpen(false);
      loadItems();
    } catch (e) {
      alert('Failed to save campus facility');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-[#0400CC]" />
            Campus Facilities Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure campus spaces, laboratories, and interactive click actions in English and Lao.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Facility
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading facilities...</div>
        ) : items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-slate-100 relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Image</div>
                  )}
                  <span className="absolute top-2 left-2 bg-[#00001C]/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Action: {item.actionType}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-[#00001C]">{item.name}</h3>
                  {item.nameLa && (
                    <p className="text-xs font-bold text-[#0400CC]">{item.nameLa}</p>
                  )}
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
          <div className="col-span-full text-center py-12 text-slate-400">No facilities found.</div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Campus Facility' : 'Add Campus Facility'}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Action Type on Click
              </label>
              <select
                value={formData.actionType}
                onChange={(e) => setFormData({ ...formData, actionType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm bg-white"
              >
                <option value="MODAL">Open Popup Modal</option>
                <option value="REDIRECT">Redirect to Page / URL</option>
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
                  Facility Name (EN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Modern Innovation Hub"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Summary Description (EN) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              {formData.actionType === 'MODAL' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Modal Dialog Title (EN)
                    </label>
                    <input
                      type="text"
                      value={formData.modalTitle}
                      onChange={(e) => setFormData({ ...formData, modalTitle: e.target.value })}
                      placeholder="e.g. Innovation Hub Tour & Facilities"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Modal Detailed Content (EN)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.modalContent}
                      onChange={(e) => setFormData({ ...formData, modalContent: e.target.value })}
                      placeholder="Detailed equipment specifications, hours, research opportunities..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ຊື່ສະຖານທີ່ (Lao Facility Name)
                </label>
                <input
                  type="text"
                  value={formData.nameLa}
                  onChange={(e) => setFormData({ ...formData, nameLa: e.target.value })}
                  placeholder="ຕົວຢ່າງ: ສູນນະວັດຕະກຳທັນສະໄໝ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ເນື້ອຫາຄຳອະທິບາຍຫຍໍ້ (Lao Summary Description)
                </label>
                <textarea
                  rows={2}
                  value={formData.descriptionLa}
                  onChange={(e) => setFormData({ ...formData, descriptionLa: e.target.value })}
                  placeholder="ຄຳອະທິບາຍຫຍໍ້ເປັນພາສາລາວ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              {formData.actionType === 'MODAL' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      ຫົວຂໍ້ປ໊ອບອັບ (Lao Modal Title)
                    </label>
                    <input
                      type="text"
                      value={formData.modalTitleLa}
                      onChange={(e) => setFormData({ ...formData, modalTitleLa: e.target.value })}
                      placeholder="ຕົວຢ່າງ: ຢ້ຽມຊົມສູນນະວັດຕະກຳ & ສິ່ງອຳນວຍຄວາມສະດວກ"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      ເນື້ອຫາລະອຽດໃນປ໊ອບອັບ (Lao Modal Detailed Content)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.modalContentLa}
                      onChange={(e) => setFormData({ ...formData, modalContentLa: e.target.value })}
                      placeholder="ລາຍລະອຽດອຸປະກອນ, ເວລາເປີດ-ປິດ, ໂອກາດການຄົ້ນຄວ້າ..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {formData.actionType === 'REDIRECT' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Destination URL / Link
              </label>
              <input
                type="text"
                value={formData.destinationUrl}
                onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                placeholder="e.g. /life-at-sit#sports"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
              />
            </div>
          )}

          <ImageUpload
            label="Facility Photo / Diagram (SeaweedFS)"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            placeholder="/images/life_at_sit_desktopview/img_1.jpg"
            helpText="Uploaded to SeaweedFS in raw original quality."
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
              Save Facility
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
