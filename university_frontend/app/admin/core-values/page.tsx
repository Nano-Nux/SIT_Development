'use client';

import { useLocalizedContent } from '@/context/useLocalizedContent';

import { useUiTranslation } from '@/context/useUiTranslation';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Award, Plus, Edit2, Trash2, Save, X, Sparkles } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function AdminCoreValuesPage() {
  const localize = useLocalizedContent();
  const tr = useUiTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'la' | 'zh'>('en');
  const [formData, setFormData] = useState({
    title: '',
    titleLa: '',
    titleZh: '',
    description: '',
    descriptionLa: '',
    descriptionZh: '',
    icon: 'Award',
    order: 1,
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getCoreValues();
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
      titleZh: '',
      description: '',
      descriptionLa: '',
      descriptionZh: '',
      icon: 'Award',
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
      titleZh: item.titleZh || '',
      description: item.description || '',
      descriptionLa: item.descriptionLa || '',
      descriptionZh: item.descriptionZh || '',
      icon: item.icon || 'Award',
      order: item.order || 1,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr('Are you sure you want to delete this core value?'))) return;
    try {
      await api.deleteCoreValue(id);
      loadItems();
    } catch (e) {
      alert(tr('Failed to delete item'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateCoreValue(editingItem.id, formData);
      } else {
        await api.createCoreValue(formData);
      }
      setModalOpen(false);
      loadItems();
    } catch (e) {
      alert(tr('Failed to save core value'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
            <Award className="w-7 h-7 text-[#0400CC]" />
            {tr('Core Values Management')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {tr(
              'Manage the institutional pillars displayed on the homepage in English, Lao, and Chinese.',
            )}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {tr('Add New Core Value')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            {tr('Loading values...')}
          </div>
        ) : items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-[#0400CC]">
                    {tr('Order: ')}
                    {item.order}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {tr('Icon: ')}
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#00001C] mb-1">
                  {tr(localize(item, 'title'))}
                </h3>
                {item.titleLa && (
                  <p className="text-xs font-bold text-[#0400CC] mb-2">{item.titleLa}</p>
                )}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tr(localize(item, 'description'))}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  aria-label={tr('Edit')}
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg text-slate-500 hover:text-[#0400CC] hover:bg-slate-50 cursor-pointer"
                  title={tr('Edit')}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  title={tr('Delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            {tr('No core values found.')}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={tr(editingItem ? 'Edit Core Value' : 'Create Core Value')}
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
              {tr('Lao')}
              {formData.titleLa && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
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
              {tr('Chinese')}
              {formData.titleZh && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>
          </div>

          {activeLangTab === 'zh' ? (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Title')}
                </label>
                <input
                  type="text"
                  value={formData.titleZh}
                  onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                  placeholder="Enter Chinese title"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Description')}
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionZh}
                  onChange={(e) => setFormData({ ...formData, descriptionZh: e.target.value })}
                  placeholder="Enter Chinese description"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          ) : activeLangTab === 'en' ? (
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Title (EN) ')}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={tr('e.g. Integrity & Ethics')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
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
                  placeholder={tr('Describe this core institutional value...')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Lao Title')}
                </label>
                <input
                  type="text"
                  value={formData.titleLa}
                  onChange={(e) => setFormData({ ...formData, titleLa: e.target.value })}
                  placeholder="Enter Lao title"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Lao Description')}
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionLa}
                  onChange={(e) => setFormData({ ...formData, descriptionLa: e.target.value })}
                  placeholder="Enter Lao description"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {tr('Icon (Award, Lightbulb, Shield, Globe)')}
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {tr('Display Order')}
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
              />
            </div>
          </div>

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
              {tr('Save Core Value')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
