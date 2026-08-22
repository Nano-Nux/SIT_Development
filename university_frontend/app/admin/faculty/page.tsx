'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Users, Plus, Edit2, Trash2, Mail, Star } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function AdminFacultyPage() {
  const [items, setItems] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'la'>('en');
  const [formData, setFormData] = useState({
    name: '',
    nameLa: '',
    position: '',
    positionLa: '',
    departmentName: '',
    departmentNameLa: '',
    departmentId: '',
    biography: '',
    biographyLa: '',
    imageUrl: '',
    email: '',
    isFeatured: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fac, depts] = await Promise.all([api.getFaculty(), api.getDepartments()]);
      setItems(fac || []);
      setDepartments(depts || []);
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
      position: '',
      positionLa: '',
      departmentName: departments[0]?.name || 'Department of Information Technology',
      departmentNameLa: departments[0]?.nameLa || 'ພາກວິຊາເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ',
      departmentId: departments[0]?.id || '',
      biography: '',
      biographyLa: '',
      imageUrl: '',
      email: '',
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setActiveLangTab('en');
    setFormData({
      name: item.name || '',
      nameLa: item.nameLa || '',
      position: item.position || '',
      positionLa: item.positionLa || '',
      departmentName: item.departmentName || '',
      departmentNameLa: item.departmentNameLa || '',
      departmentId: item.departmentId || '',
      biography: item.biography || '',
      biographyLa: item.biographyLa || '',
      imageUrl: item.imageUrl || '',
      email: item.email || '',
      isFeatured: Boolean(item.isFeatured ?? item.featured),
    });
    setModalOpen(true);
  };

  const handleToggleFeatured = async (item: any) => {
    const nextVal = !Boolean(item.isFeatured ?? item.featured);
    try {
      await api.updateFaculty(item.id, { isFeatured: nextVal });
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, isFeatured: nextVal, featured: nextVal } : it))
      );
    } catch (e) {
      alert('Failed to update featured status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      await api.deleteFaculty(id);
      loadData();
    } catch (e) {
      alert('Failed to delete faculty');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateFaculty(editingItem.id, formData);
      } else {
        await api.createFaculty(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (e) {
      alert('Failed to save faculty');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#0400CC]" />
            Faculty & Mentors Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage professors, lecturers, and academic advisors in English and Lao.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Faculty Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading faculty...</div>
        ) : items.length > 0 ? (
          items.map((item, idx) => {
            const isFeatured = Boolean(item.isFeatured ?? item.featured);
            return (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] bg-slate-100 relative">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Photo</div>
                    )}
                    {isFeatured && (
                      <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-current" /> Featured on Homepage
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-[#00001C]">{item.name}</h3>
                        {item.nameLa && (
                          <p className="text-xs font-bold text-[#0400CC]">{item.nameLa}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        title={isFeatured ? 'Remove from Homepage' : 'Feature on Homepage'}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isFeatured
                            ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-[#0400CC]">{item.position}</p>
                    {item.positionLa && (
                      <p className="text-[11px] text-slate-500">{item.positionLa}</p>
                    )}
                    <p className="text-xs text-slate-500 font-medium">{item.departmentName}</p>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.biography}</p>
                    {item.email && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 pt-1">
                        <Mail className="w-3.5 h-3.5 text-[#0400CC]" /> {item.email}
                      </p>
                    )}
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
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">No faculty members found.</div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Faculty Member' : 'Add Faculty Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Language Switcher Tabs */}
          <div className="flex border-b border-slate-200 mb-4">
            <button
              type="button"
              onClick={() => setActiveLangTab('en')}
              className={`py-2 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeLangTab === 'en'
                  ? 'border-[#0400CC] text-[#0400CC]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setActiveLangTab('la')}
              className={`py-2 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeLangTab === 'la'
                  ? 'border-[#0400CC] text-[#0400CC]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Lao (ພາສາລາວ)
            </button>
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Affiliated Department
            </label>
            <select
              value={formData.departmentId}
              onChange={(e) => {
                const dept = departments.find((d) => d.id === e.target.value);
                setFormData({
                  ...formData,
                  departmentId: e.target.value,
                  departmentName: dept ? dept.name : formData.departmentName,
                  departmentNameLa: dept ? (dept.nameLa || '') : formData.departmentNameLa,
                });
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} {dept.nameLa ? `(${dept.nameLa})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Tab 1: English */}
          {activeLangTab === 'en' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Sarah Jenkins"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Position / Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g. Dean & Professor of Computer Science"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department Name (English)
                  </label>
                  <input
                    type="text"
                    value={formData.departmentName}
                    onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                    placeholder="e.g. Department of Information Technology"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Biography (English)
                </label>
                <textarea
                  rows={3}
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  placeholder="Brief biography, background, and academic credentials..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Lao */}
          {activeLangTab === 'la' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ຊື່ ແລະ ນາມສະກຸນ (Lao Full Name)
                </label>
                <input
                  type="text"
                  value={formData.nameLa}
                  onChange={(e) => setFormData({ ...formData, nameLa: e.target.value })}
                  placeholder="ຕົວຢ່າງ: ດຣ. ຊາຣາ ເຈນກິນສ໌"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ຕຳແໜ່ງ / ວຸດທິ (Lao Position)
                  </label>
                  <input
                    type="text"
                    value={formData.positionLa}
                    onChange={(e) => setFormData({ ...formData, positionLa: e.target.value })}
                    placeholder="ຕົວຢ່າງ: ສາດສະດາຈານ & ຄະນະບໍດີ"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ຊື່ພາກວິຊາ (Lao Department Name)
                  </label>
                  <input
                    type="text"
                    value={formData.departmentNameLa}
                    onChange={(e) => setFormData({ ...formData, departmentNameLa: e.target.value })}
                    placeholder="ຕົວຢ່າງ: ພາກວິຊາເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ຊີວະປະຫວັດຫຍໍ້ (Lao Biography)
                </label>
                <textarea
                  rows={3}
                  value={formData.biographyLa}
                  onChange={(e) => setFormData({ ...formData, biographyLa: e.target.value })}
                  placeholder="ຂຽນຊີວະປະຫວັດ ແລະ ປະສົບການເປັນພາສາລາວ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. s.jenkins@sit.edu.kh"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
            />
          </div>

          <ImageUpload
            label="Faculty Portrait / Photo (SeaweedFS)"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            placeholder="/images/home_desktopview/img_5.jpg"
            helpText="Full resolution upload directly to SeaweedFS without compression."
            aspectRatio="portrait"
          />

          <div className="flex items-center gap-3 pt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-[#0400CC] rounded cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
              Feature on HomePage & Featured Mentors
              <span className="block font-normal text-[11px] text-slate-500">
                When checked, this faculty member will appear in the "Meet Our Faculty & Mentors" section on the Homepage.
              </span>
            </label>
          </div>

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
              Save Faculty Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
