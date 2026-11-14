'use client';

import { useLocalizedContent } from '@/context/useLocalizedContent';

import { useUiTranslation } from '@/context/useUiTranslation';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Newspaper, Plus, Edit2, Trash2, Calendar, Eye, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { MultiImageUpload } from '@/components/ui/MultiImageUpload';
import { getGalleryImages } from '@/lib/image-gallery';
import Link from 'next/link';

export default function AdminNewsPage() {
  const localize = useLocalizedContent();
  const tr = useUiTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'la' | 'zh'>('en');
  const [formData, setFormData] = useState({
    title: '',
    titleLa: '',
    titleZh: '',
    slug: '',
    summary: '',
    summaryLa: '',
    summaryZh: '',
    content: '',
    contentLa: '',
    contentZh: '',
    category: 'Academics',
    categoryLa: '',
    categoryZh: '',
    imageUrls: [] as string[],
    author: 'SIT Communications Team',
    authorLa: '',
    authorZh: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getNews({ all: true });
      setItems(data.items || []);
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
      slug: '',
      summary: '',
      summaryLa: '',
      summaryZh: '',
      content: '',
      contentLa: '',
      contentZh: '',
      category: 'Academics',
      categoryLa: 'ດ້ານວິຊາການ',
      categoryZh: '',
      imageUrls: [],
      author: 'SIT Communications Team',
      authorLa: 'ທີມງານສື່ສານ SIT',
      authorZh: '',
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
      slug: item.slug || '',
      summary: item.summary || '',
      summaryLa: item.summaryLa || '',
      summaryZh: item.summaryZh || '',
      content: item.content || '',
      contentLa: item.contentLa || '',
      contentZh: item.contentZh || '',
      category: item.category || 'Academics',
      categoryLa: item.categoryLa || '',
      categoryZh: item.categoryZh || '',
      imageUrls: getGalleryImages(item),
      author: item.author || 'SIT Communications Team',
      authorLa: item.authorLa || '',
      authorZh: item.authorZh || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr('Are you sure you want to delete this news article?'))) return;
    try {
      await api.deleteNews(id);
      loadItems();
    } catch (e) {
      alert(tr('Failed to delete news article'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading || saving) return;
    setSaving(true);
    try {
      if (editingItem) {
        await api.updateNews(editingItem.id, formData);
      } else {
        await api.createNews(formData);
      }
      setModalOpen(false);
      loadItems();
    } catch (e) {
      alert(tr('Failed to save news article'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
            <Newspaper className="w-7 h-7 text-[#0400CC]" />
            {tr('News Articles Manager')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {tr(
              'Publish and manage news stories, research announcements, and press releases in English, Lao, and Chinese.',
            )}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {tr('Write Article')}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">{tr('Title & Details')}</th>
                <th className="px-6 py-4">{tr('Category')}</th>
                <th className="px-6 py-4">{tr('Date')}</th>
                <th className="px-6 py-4">{tr('Reads')}</th>
                <th className="px-6 py-4 text-right">{tr('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    {tr('Loading articles...')}
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-bold text-[#00001C] text-sm">
                          {tr(localize(item, 'title'))}
                        </div>
                        {item.titleLa && (
                          <div className="text-xs font-bold text-[#0400CC]">{item.titleLa}</div>
                        )}
                        <div className="font-mono text-xs text-slate-400">/news/{item.slug}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{item.summary}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded bg-blue-50 text-[#0400CC] font-bold text-xs">
                        {tr(localize(item, 'category'))}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {tr(new Date(item.publishedAt).toLocaleDateString())}
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" /> {item.views ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/news/${item.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0400CC]"
                          title={tr('View Live')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          aria-label={tr('Edit')}
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0400CC]"
                          title={tr('Edit')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600"
                          title={tr('Delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    {tr('No articles found.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          if (!uploading && !saving) setModalOpen(false);
        }}
        title={tr(editingItem ? 'Edit News Article' : 'Write News Article')}
        maxWidth="2xl"
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

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {tr('Slug (URL Identifier) ')}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm font-mono"
            />
          </div>

          {activeLangTab === 'zh' ? (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Article Headline')}
                </label>
                <input
                  type="text"
                  value={formData.titleZh}
                  onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                  placeholder="Enter Chinese title"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Chinese Category')}
                  </label>
                  <input
                    type="text"
                    value={formData.categoryZh}
                    onChange={(e) => setFormData({ ...formData, categoryZh: e.target.value })}
                    placeholder="Enter Chinese category"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Chinese Author')}
                  </label>
                  <input
                    type="text"
                    value={formData.authorZh}
                    onChange={(e) => setFormData({ ...formData, authorZh: e.target.value })}
                    placeholder="Enter Chinese author"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Summary Lead')}
                </label>
                <textarea
                  rows={2}
                  value={formData.summaryZh}
                  onChange={(e) => setFormData({ ...formData, summaryZh: e.target.value })}
                  placeholder="Enter Chinese summary"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Full Article Body')}
                </label>
                <textarea
                  rows={6}
                  value={formData.contentZh}
                  onChange={(e) => setFormData({ ...formData, contentZh: e.target.value })}
                  placeholder="Enter Chinese content"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          ) : activeLangTab === 'en' ? (
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Article Headline (EN) ')}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={tr('e.g. SIT Launches Advanced Cybersecurity Lab')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Category (EN)')}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm bg-white"
                  >
                    <option value="Academics">{tr('Academics')}</option>
                    <option value="Student Achievement">{tr('Student Achievement')}</option>
                    <option value="Campus Life">{tr('Campus Life')}</option>
                    <option value="General">{tr('General')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Author (EN)')}
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Summary Lead (EN) ')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder={tr('Short lead description for cards...')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Full Article Body (EN) ')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder={tr('Full article content paragraphs...')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Lao Article Headline')}
                </label>
                <input
                  type="text"
                  value={formData.titleLa}
                  onChange={(e) => setFormData({ ...formData, titleLa: e.target.value })}
                  placeholder="Enter Lao title"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Lao Category')}
                  </label>
                  <input
                    type="text"
                    value={formData.categoryLa}
                    onChange={(e) => setFormData({ ...formData, categoryLa: e.target.value })}
                    placeholder="Enter Lao category"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Lao Author')}
                  </label>
                  <input
                    type="text"
                    value={formData.authorLa}
                    onChange={(e) => setFormData({ ...formData, authorLa: e.target.value })}
                    placeholder="Enter Lao author"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Lao Summary Lead')}
                </label>
                <textarea
                  rows={2}
                  value={formData.summaryLa}
                  onChange={(e) => setFormData({ ...formData, summaryLa: e.target.value })}
                  placeholder="Enter Lao summary"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Lao Full Article Body')}
                </label>
                <textarea
                  rows={6}
                  value={formData.contentLa}
                  onChange={(e) => setFormData({ ...formData, contentLa: e.target.value })}
                  placeholder="Enter Lao content"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          )}

          <MultiImageUpload
            label={tr('Article Images')}
            value={formData.imageUrls}
            onChange={(imageUrls) => setFormData((prev) => ({ ...prev, imageUrls }))}
            onUploadingChange={setUploading}
            disabled={saving}
          />

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              disabled={uploading || saving}
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
            >
              {tr('Cancel')}
            </button>
            <button
              type="submit"
              disabled={uploading || saving}
              className="px-5 py-2 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              {tr(
                uploading
                  ? tr('Uploading Images...')
                  : saving
                    ? tr('Saving...')
                    : tr('Publish Article'),
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
