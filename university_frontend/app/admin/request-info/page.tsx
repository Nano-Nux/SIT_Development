'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Inbox, Search, Trash2, Mail, Phone, Calendar, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function AdminRequestInfoPage() {
  const [items, setItems] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedInq, setSelectedInq] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState('PENDING');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadInquiries();
  }, [statusFilter]);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await api.getRequestInfo(statusFilter !== 'ALL' ? { status: statusFilter } : undefined);
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (inq: any) => {
    setSelectedInq(inq);
    setNewStatus(inq.status);
    setAdminNotes(inq.adminNotes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedInq) return;
    try {
      const updated = await api.updateRequestInfoStatus(selectedInq.id, newStatus, adminNotes);
      setSelectedInq(updated);
      loadInquiries();
    } catch (e) {
      alert('Failed to update inquiry status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete inquiry record?')) return;
    try {
      await api.deleteRequestInfo(id);
      if (selectedInq?.id === id) setSelectedInq(null);
      loadInquiries();
    } catch (e) {
      alert('Failed to delete inquiry');
    }
  };

  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.fullName?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.programOfInterest?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
          <Inbox className="w-7 h-7 text-[#0400CC]" />
          Information Inquiries & Prospect Leads
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review prospect inquiries received through the Request Info and Contact forms.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['ALL', 'PENDING', 'CONTACTED', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0400CC] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Inquirer Name</th>
                <th className="px-6 py-4">Program Interest</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">Loading inquiries...</td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#00001C]">{item.fullName}</div>
                      <div className="text-xs text-slate-400">{item.email} • {item.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{item.programOfInterest}</div>
                      <div className="text-[11px] text-slate-400">{item.intakeTerm || 'General'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        item.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'CONTACTED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#0400CC] hover:bg-blue-100 font-bold text-xs cursor-pointer"
                        >
                          View & Reply
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
                  <td colSpan={5} className="text-center py-12 text-slate-400">No inquiries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInq && (
        <Modal
          isOpen={!!selectedInq}
          onClose={() => setSelectedInq(null)}
          title={`Inquiry from ${selectedInq.fullName}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div><span className="font-bold text-slate-900">Email:</span> {selectedInq.email}</div>
                <div><span className="font-bold text-slate-900">Phone:</span> {selectedInq.phone || 'N/A'}</div>
                <div><span className="font-bold text-slate-900">Location:</span> {selectedInq.city || 'Vientiane'}, {selectedInq.country || 'Laos'}</div>
                <div><span className="font-bold text-slate-900">Program Interest:</span> {selectedInq.programOfInterest}</div>
                <div><span className="font-bold text-slate-900">Education Level:</span> {selectedInq.currentEducationLevel || 'N/A'}</div>
                <div><span className="font-bold text-slate-900">Graduation Year:</span> {selectedInq.graduationYear || 'N/A'}</div>
                <div><span className="font-bold text-slate-900">Target Intake:</span> {selectedInq.planToStart || selectedInq.intakeTerm || 'N/A'}</div>
                <div><span className="font-bold text-slate-900">Heard About Us:</span> {selectedInq.hearAboutUs || 'N/A'}</div>
              </div>
            </div>

            {/* Areas of Interest */}
            {selectedInq.interests && (
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                  Requested Topics:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(selectedInq.interests)
                    ? selectedInq.interests
                    : (() => {
                        try {
                          const parsed = JSON.parse(selectedInq.interests);
                          return Array.isArray(parsed) ? parsed : [selectedInq.interests];
                        } catch {
                          return [selectedInq.interests];
                        }
                      })()
                  ).map((item: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-blue-50 text-[#0400CC] border border-blue-200 rounded-lg text-xs font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Communication Preferences */}
            {selectedInq.communicationPreferences && (
              <div className="space-y-1 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1 uppercase tracking-wider text-[10px]">
                  Communication Preferences:
                </span>
                <p>{typeof selectedInq.communicationPreferences === 'string' ? selectedInq.communicationPreferences : JSON.stringify(selectedInq.communicationPreferences)}</p>
              </div>
            )}

            {selectedInq.message && (
              <div>
                <span className="font-bold block mb-1 text-slate-900">Inquiry Message:</span>
                <p className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-slate-700 whitespace-pre-line">
                  {selectedInq.message}
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Follow-up Notes</label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Sent brochure via Telegram"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedInq(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500"
                >
                  Close
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-5 py-2 bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold rounded-xl shadow"
                >
                  Update Follow-up
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
