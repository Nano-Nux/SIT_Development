'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useUiTranslation } from '@/context/useUiTranslation';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  FileCheck2,
  Search,
  Eye,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  BookOpen,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function AdminApplicationsPage() {
  const tr = useUiTranslation();
  const { lang } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getApplications(
        statusFilter !== 'ALL' ? { status: statusFilter } : undefined,
      );
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (app: any) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setAdminNotes(app.adminNotes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setUpdating(true);
    try {
      const updated = await api.updateApplicationStatus(selectedApp.id, newStatus, adminNotes);
      setSelectedApp(updated);
      loadApplications();
    } catch (e) {
      alert(tr('Failed to update application'));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr('Delete this application submission?'))) return;
    try {
      await api.deleteApplication(id);
      if (selectedApp?.id === id) setSelectedApp(null);
      loadApplications();
    } catch (e) {
      alert(tr('Failed to delete application'));
    }
  };

  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.fullName?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.intendedProgram?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
          <FileCheck2 className="w-7 h-7 text-[#0400CC]" />
          {tr('Student Admissions Submissions')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {tr(
            'Review, evaluate, and manage candidate application files received through the website.',
          )}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['ALL', 'PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0400CC] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tr(st)}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={tr('Search by student name, email...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">{tr('Applicant Name')}</th>
                <th className="px-6 py-4">{tr('Intended Degree')}</th>
                <th className="px-6 py-4">{tr('Submitted Date')}</th>
                <th className="px-6 py-4">{tr('Status')}</th>
                <th className="px-6 py-4 text-right">{tr('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    {tr('Loading submissions...')}
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#00001C]">{item.fullName}</div>
                      <div className="text-xs text-slate-400">
                        {item.email} • {item.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{item.intendedProgram}</div>
                      <div className="text-[11px] text-slate-500">{item.degreeLevel}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {tr(
                        new Date(item.createdAt).toLocaleDateString(
                          lang === 'ZH' ? 'zh-CN' : lang === 'LA' ? 'lo-LA' : 'en-US',
                        ),
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          item.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {tr(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#0400CC] hover:bg-blue-100 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {tr(' Review')}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 cursor-pointer"
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
                    {tr('No applications found.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={tr(`Application Review: ${selectedApp.fullName}`)}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Header info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  {tr('Status')}
                </span>
                <span className="font-bold text-[#0400CC]">{tr(selectedApp.status)}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  {tr('Submitted On')}
                </span>
                <span className="font-semibold text-slate-800">
                  {tr(
                    new Date(selectedApp.createdAt).toLocaleDateString(
                      lang === 'ZH' ? 'zh-CN' : lang === 'LA' ? 'lo-LA' : 'en-US',
                    ),
                  )}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  {tr('Nationality')}
                </span>
                <span className="font-semibold text-slate-800">
                  {selectedApp.nationality || tr('Cambodian')}
                </span>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#00001C] uppercase tracking-wider text-xs border-b border-slate-100 pb-1">
                {tr('Personal Information')}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">{tr('Email:')}</span>{' '}
                  {selectedApp.email}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{tr('Phone:')}</span>{' '}
                  {selectedApp.phone}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{tr('Date of Birth:')}</span>{' '}
                  {selectedApp.dateOfBirth}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{tr('Gender:')}</span>{' '}
                  {selectedApp.gender}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-slate-800">{tr('Address:')}</span>{' '}
                  {selectedApp.address}
                </div>
              </div>
            </div>

            {/* Academic Details */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#00001C] uppercase tracking-wider text-xs border-b border-slate-100 pb-1">
                {tr('Academic Background & Program')}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="col-span-2">
                  <span className="font-semibold text-slate-800">{tr('Intended Program:')}</span>{' '}
                  {selectedApp.intendedProgram}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{tr('Degree Level:')}</span>{' '}
                  {selectedApp.degreeLevel}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{tr('Previous School:')}</span>{' '}
                  {selectedApp.previousSchool}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{tr('GPA / Grade:')}</span>{' '}
                  {selectedApp.gpa || tr('N/A')}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{tr('Graduation Year:')}</span>{' '}
                  {selectedApp.graduationYear}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{tr('English Proficiency:')}</span>{' '}
                  {selectedApp.englishScore || tr('None submitted')}
                </div>
              </div>
            </div>

            {/* Statement */}
            {selectedApp.statement && (
              <div className="space-y-1">
                <h4 className="font-bold text-[#00001C] uppercase tracking-wider text-xs border-b border-slate-100 pb-1">
                  {tr('Applicant Statement of Purpose')}
                </h4>
                <p className="text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-line">
                  "{selectedApp.statement}"
                </p>
              </div>
            )}

            {/* Uploaded Documents */}
            {selectedApp.documents && (
              <div className="space-y-2">
                <h4 className="font-bold text-[#00001C] uppercase tracking-wider text-xs border-b border-slate-100 pb-1">
                  {tr('Uploaded Documents')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(selectedApp.documents)
                    ? selectedApp.documents
                    : (() => {
                        try {
                          const parsed = JSON.parse(selectedApp.documents);
                          return Array.isArray(parsed) ? parsed : [selectedApp.documents];
                        } catch {
                          return [selectedApp.documents];
                        }
                      })()
                  ).map((docUrl: string, dIdx: number) => (
                    <a
                      key={dIdx}
                      href={docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-blue-50 text-[#0400CC] border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all flex items-center gap-1.5"
                    >
                      <span>
                        {tr('Document #')}
                        {dIdx + 1}
                      </span>
                      <span className="text-[10px] text-slate-400">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Committee Workflow & Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <h4 className="font-bold text-[#00001C] uppercase tracking-wider text-xs">
                {tr('Admissions Committee Decision')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Application Status')}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    <option value="PENDING">{tr('PENDING')}</option>
                    <option value="REVIEWED">{tr('UNDER REVIEW')}</option>
                    <option value="ACCEPTED">{tr('ACCEPTED (OFFER ISSUED)')}</option>
                    <option value="REJECTED">{tr('REJECTED')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Committee Notes')}
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder={tr('e.g. Schedule interview, passed EPT')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  {tr('Close')}
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-60"
                >
                  {tr(updating ? tr('Saving...') : tr('Save Decision'))}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
