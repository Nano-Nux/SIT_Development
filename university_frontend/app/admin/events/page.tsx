'use client';

import { useLocalizedContent } from '@/context/useLocalizedContent';

import { useUiTranslation } from '@/context/useUiTranslation';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Calendar, Plus, Edit2, Trash2, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import Link from 'next/link';

export default function AdminEventsPage() {
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
    slug: '',
    summary: '',
    summaryLa: '',
    summaryZh: '',
    content: '',
    contentLa: '',
    contentZh: '',
    location: '',
    locationLa: '',
    locationZh: '',
    eventDate: new Date().toISOString().split('T')[0],
    time: '09:00 AM - 04:00 PM',
    timeLa: '',
    timeZh: '',
    imageUrl: '',
    registrationUrl: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getEvents();
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
      slug: '',
      summary: '',
      summaryLa: '',
      summaryZh: '',
      content: '',
      contentLa: '',
      contentZh: '',
      location: 'SIT Main Campus Auditorium',
      locationLa: 'ຫໍປະຊຸມໃຫຍ່ ມະຫາວິທະຍາໄລ SIT',
      locationZh: '',
      eventDate: new Date().toISOString().split('T')[0],
      time: '09:00 AM - 04:00 PM',
      timeLa: '09:00 ໂມງເຊົ້າ - 04:00 ໂມງແລງ',
      timeZh: '',
      imageUrl: '',
      registrationUrl: '',
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
      location: item.location || '',
      locationLa: item.locationLa || '',
      locationZh: item.locationZh || '',
      eventDate: item.eventDate ? new Date(item.eventDate).toISOString().split('T')[0] : '',
      time: item.time || '',
      timeLa: item.timeLa || '',
      timeZh: item.timeZh || '',
      imageUrl: item.imageUrl || '',
      registrationUrl: item.registrationUrl || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr('Are you sure you want to delete this event?'))) return;
    try {
      await api.deleteEvent(id);
      loadItems();
    } catch (e) {
      alert(tr('Failed to delete event'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateEvent(editingItem.id, formData);
      } else {
        await api.createEvent(formData);
      }
      setModalOpen(false);
      loadItems();
    } catch (e) {
      alert(tr('Failed to save event'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-[#0400CC]" />
            {tr('Events Calendar Manager')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {tr(
              'Publish academic open days, workshops, symposia, and orientation dates in English, Lao, and Chinese.',
            )}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {tr('Create Event')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            {tr('Loading events...')}
          </div>
        ) : items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-[#0400CC] bg-blue-50 px-2 py-0.5 rounded">
                    {tr(new Date(item.eventDate).toLocaleDateString())}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {item.time}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#00001C]">
                  {tr(localize(item, 'title'))}
                </h3>
                {item.titleLa && <p className="text-xs font-bold text-[#0400CC]">{item.titleLa}</p>}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00B6FF]" /> {item.location}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/events/${item.slug}`}
                  target="_blank"
                  className="text-xs font-bold text-[#0400CC] hover:underline flex items-center gap-1"
                >
                  <span>{tr('Public View')}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    aria-label={tr('Edit')}
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
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            {tr('No events found.')}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={tr(editingItem ? 'Edit Event' : tr('Create Event'))}
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

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {tr('Event Date')}
              </label>
              <input
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
              />
            </div>
          </div>

          {activeLangTab === 'zh' ? (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Event Title')}
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
                    {tr('Chinese Time Window')}
                  </label>
                  <input
                    type="text"
                    value={formData.timeZh}
                    onChange={(e) => setFormData({ ...formData, timeZh: e.target.value })}
                    placeholder="Enter Chinese time"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Chinese Venue Location')}
                  </label>
                  <input
                    type="text"
                    value={formData.locationZh}
                    onChange={(e) => setFormData({ ...formData, locationZh: e.target.value })}
                    placeholder="Enter Chinese location"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Chinese Summary Brief')}
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
                  {tr('Chinese Full Event Description')}
                </label>
                <textarea
                  rows={5}
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
                  {tr('Event Title (EN) ')}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={tr('e.g. Annual SIT Tech Symposium 2026')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Time Window (EN)')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="09:00 AM - 04:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Venue Location (EN)')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={tr('Auditorium A, SIT Campus')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Summary Brief (EN) ')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder={tr('Short brief for event cards...')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Full Event Description (EN) ')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder={tr('Detailed schedule and speaker list...')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Lao Event Title')}
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
                    {tr('Lao Time Window')}
                  </label>
                  <input
                    type="text"
                    value={formData.timeLa}
                    onChange={(e) => setFormData({ ...formData, timeLa: e.target.value })}
                    placeholder="Enter Lao time"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Lao Venue Location')}
                  </label>
                  <input
                    type="text"
                    value={formData.locationLa}
                    onChange={(e) => setFormData({ ...formData, locationLa: e.target.value })}
                    placeholder="Enter Lao location"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {tr('Lao Summary Brief')}
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
                  {tr('Lao Full Event Description')}
                </label>
                <textarea
                  rows={5}
                  value={formData.contentLa}
                  onChange={(e) => setFormData({ ...formData, contentLa: e.target.value })}
                  placeholder="Enter Lao content"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {tr('RSVP / Registration Link')}
            </label>
            <input
              type="text"
              value={formData.registrationUrl}
              onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
              placeholder="/apply or https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
            />
          </div>

          <ImageUpload
            label={tr('Event Banner Image (SeaweedFS)')}
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            placeholder="/images/home_desktopview/img_2.jpg"
            helpText={tr(
              'Uploaded with 100% original quality to SeaweedFS. Database saves only the returned URL.',
            )}
            aspectRatio="video"
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
              {tr('Save Event')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
