'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Globe2,
  Plus,
  Edit2,
  Trash2,
  Building2,
  ExternalLink,
  Search,
  CheckCircle2,
  MapPin,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function AdminPartnersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'la'>('en');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNIVERSITY' | 'INDUSTRY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    nameLa: '',
    type: 'UNIVERSITY',
    logoUrl: '',
    websiteUrl: '',
    country: '',
    countryLa: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getPartners(undefined, true);
      setItems(data || []);
    } catch (e) {
      console.error('Failed to load partners:', e);
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
      type: 'UNIVERSITY',
      logoUrl: '',
      websiteUrl: '',
      country: '',
      countryLa: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setActiveLangTab('en');
    setFormData({
      name: item.name || '',
      nameLa: item.nameLa || '',
      type: item.type || 'UNIVERSITY',
      logoUrl: item.logoUrl || '',
      websiteUrl: item.websiteUrl || '',
      country: item.country || '',
      countryLa: item.countryLa || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    try {
      await api.deletePartner(id);
      loadItems();
    } catch (e) {
      alert('Failed to delete partner');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await api.updatePartner(editingItem.id, formData);
      } else {
        await api.createPartner(formData);
      }
      setModalOpen(false);
      loadItems();
    } catch (e) {
      console.error(e);
      alert('Failed to save partner');
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesFilter =
      activeFilter === 'ALL' || item.type === activeFilter;
    const matchesSearch =
      !searchQuery ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameLa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.countryLa?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const universityCount = items.filter((i) => i.type === 'UNIVERSITY').length;
  const industryCount = items.filter((i) => i.type === 'INDUSTRY').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0400CC] flex items-center justify-center">
              <Globe2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] tracking-tight">
              Partners & Alliances Manager
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Manage global university alliances and corporate industry partners. Upload logos, configure bilingual institution titles, and link official websites.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Partner
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'ALL'
                ? 'bg-white text-[#0400CC] shadow-sm'
                : 'text-slate-600 hover:text-[#00001C]'
            }`}
          >
            All Partners ({items.length})
          </button>
          <button
            onClick={() => setActiveFilter('UNIVERSITY')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'UNIVERSITY'
                ? 'bg-white text-[#0400CC] shadow-sm'
                : 'text-slate-600 hover:text-[#00001C]'
            }`}
          >
            University Partners ({universityCount})
          </button>
          <button
            onClick={() => setActiveFilter('INDUSTRY')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'INDUSTRY'
                ? 'bg-white text-[#0400CC] shadow-sm'
                : 'text-slate-600 hover:text-[#00001C]'
            }`}
          >
            Industry Enterprises ({industryCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search partner or country..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Grid of Partners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#0400CC]" />
            <p className="text-sm font-medium">Loading partners...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-[#0400CC]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header Badge & Country */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      item.type === 'UNIVERSITY'
                        ? 'bg-blue-50 text-[#0400CC] border border-blue-100'
                        : 'bg-purple-50 text-purple-700 border border-purple-100'
                    }`}
                  >
                    {item.type === 'UNIVERSITY' ? 'University' : 'Industry'}
                  </span>
                  {item.country && (
                    <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 truncate max-w-[120px]">
                      <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                      {item.country}
                    </span>
                  )}
                </div>

                {/* Logo Display Box */}
                <div className="w-full h-24 rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-center justify-center mb-4 group-hover:bg-white transition-colors relative overflow-hidden">
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.admin-logo-fallback');
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div
                    className={`admin-logo-fallback ${
                      item.logoUrl ? 'hidden' : ''
                    } flex flex-col items-center justify-center text-slate-300 gap-1`}
                  >
                    {item.type === 'UNIVERSITY' ? (
                      <Globe2 className="w-8 h-8 text-blue-400/60" />
                    ) : (
                      <Building2 className="w-8 h-8 text-purple-400/60" />
                    )}
                    <span className="text-[10px] font-semibold text-slate-400">No Logo</span>
                  </div>
                </div>

                {/* Institution Name */}
                <h3 className="text-sm font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug line-clamp-2 mb-1">
                  {item.name}
                </h3>
                {item.nameLa && (
                  <p className="text-xs font-semibold text-[#0400CC] line-clamp-1 mb-1">
                    {item.nameLa}
                  </p>
                )}
                {item.countryLa && (
                  <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
                    {item.countryLa}
                  </p>
                )}
              </div>

              {/* Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {item.websiteUrl ? (
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#0400CC] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-300 italic">No URL</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    title="Edit Partner"
                    className="p-2 rounded-lg text-slate-500 hover:text-[#0400CC] hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Delete Partner"
                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200/80">
            <Globe2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">No partners found</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {searchQuery ? 'Try clearing your search query' : 'Click "Add Partner" to create your first partner'}
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Partner & Alliance' : 'Add Partner & Alliance'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Language Switcher Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => setActiveLangTab('en')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeLangTab === 'en'
                  ? 'bg-white text-[#0400CC] shadow-sm'
                  : 'text-slate-600 hover:text-[#00001C]'
              }`}
            >
              🇬🇧 English Content
            </button>
            <button
              type="button"
              onClick={() => setActiveLangTab('la')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeLangTab === 'la'
                  ? 'bg-white text-[#0400CC] shadow-sm'
                  : 'text-slate-600 hover:text-[#00001C]'
              }`}
            >
              🇱🇦 ພາສາລາວ (Lao Content)
              {formData.nameLa && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
            </button>
          </div>

          {/* Partner Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Partner Category / Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm bg-white font-medium"
            >
              <option value="UNIVERSITY">🎓 University Partner (Academic Alliance / Dual Degree / Exchange)</option>
              <option value="INDUSTRY">🏢 Industry Enterprise (Corporate Recruiter / Placement Partner)</option>
            </select>
          </div>

          {/* Bilingual fields */}
          {activeLangTab === 'en' ? (
            <div className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Partner / Institution Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Shih Chien University or Google"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Country / Region (English)
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. Taiwan, Thailand, Singapore, Global"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ຊື່ສະຖາບັນ / ຊື່ອົງກອນ (Lao Partner Name)
                </label>
                <input
                  type="text"
                  value={formData.nameLa}
                  onChange={(e) => setFormData({ ...formData, nameLa: e.target.value })}
                  placeholder="ຕົວຢ່າງ: ມະຫາວິທະຍາໄລ ຊິ ຈ້ຽນ ຫຼື ບໍລິສັດ ເບຍລາວ ຈຳກັດ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ປະເທດ / ພາກພື້ນ (Lao Country / Region)
                </label>
                <input
                  type="text"
                  value={formData.countryLa}
                  onChange={(e) => setFormData({ ...formData, countryLa: e.target.value })}
                  placeholder="ຕົວຢ່າງ: ໄຕ້ຫວັນ, ໄທ, ສິງກະໂປ, ສາກົນ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          )}

          {/* Official Website */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Official Website URL
            </label>
            <input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm bg-white"
            />
          </div>

          {/* Logo Upload Field */}
          <div className="pt-1">
            <ImageUpload
              label="Partner Logo (Upload or URL)"
              value={formData.logoUrl}
              onChange={(url) => setFormData({ ...formData, logoUrl: url })}
              placeholder="https://... or upload PNG/SVG/WebP"
              helpText="Upload institution or corporate partner logo. Supports PNG, SVG, JPG, WebP with lossless resolution."
              aspectRatio="square"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {editingItem ? 'Update Partner' : 'Save Partner'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
