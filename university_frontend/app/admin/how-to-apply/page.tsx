'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  FileCheck2,
  Plus,
  Trash2,
  Calendar,
  Edit2,
  Sparkles,
  Bell,
  GraduationCap,
  Trophy,
  Users,
  HelpCircle,
  CheckCircle2,
  Save,
  Loader2,
  Download,
  FileText,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { FileUpload } from '@/components/ui/FileUpload';
import {
  AdmissionTimeline,
  ApplicationReminder,
  AdmissionRequirement,
  AdmissionFaq,
  ApplicationMaterial,
  Hero,
} from '@/lib/api/types';

export default function AdminHowToApplyPage() {
  const [activeTab, setActiveTab] = useState<'HERO' | 'TIMELINE' | 'REMINDERS' | 'REQUIREMENTS' | 'FAQS' | 'MATERIALS'>('HERO');
  const [loading, setLoading] = useState(true);

  // 1. Hero State
  const [heroForm, setHeroForm] = useState<Partial<Hero>>({
    title: 'HOW TO APPLY',
    titleLa: 'ວິທີການສະໝັກຮຽນ',
    subtitle: 'Step-by-Step Application Guide',
    subtitleLa: 'ຄູ່ມືການສະໝັກຮຽນເທື່ອລະຂັ້ນຕອນ',
    description: 'Your journey to becoming part of the SIT community starts here. Follow our straightforward application process and take the first step toward an exceptional education.',
    descriptionLa: 'ການເດີນທາງຂອງທ່ານເພື່ອກາຍເປັນສ່ວນໜຶ່ງຂອງ SIT ເລີ່ມຕົ້ນທີ່ secret. ປະຕິບັດຕາມຂັ້ນຕອນການສະໝັກທີ່ຊັດເຈນ ແລະ ກ້າວໄປສູ່ການສຶກສາທີ່ໂດດເດັ່ນ.',
    buttonText: 'APPLY NOW',
    buttonTextLa: 'ສະໝັກດຽວນີ້',
    buttonUrl: '/apply',
    imageUrl: '',
  });
  const [savingHero, setSavingHero] = useState(false);
  const [heroLangTab, setHeroLangTab] = useState<'en' | 'la'>('en');

  // 2. Timelines State
  const [timelines, setTimelines] = useState<AdmissionTimeline[]>([]);
  const [timelineModal, setTimelineModal] = useState(false);
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);
  const [timelineLangTab, setTimelineLangTab] = useState<'en' | 'la'>('en');
  const [timelineForm, setTimelineForm] = useState({
    intakeName: '',
    intakeNameLa: '',
    intakeYear: '2026',
    openingDate: new Date().toISOString().split('T')[0],
    closingDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    deadlineDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    classesBeginDate: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
    additionalNotes: '1st of October will be starting date of class.\nPlacement Exam 7th of September',
    additionalNotesLa: 'ວັນທີ 1 ຕຸລາ ຈະເປັນວັນເລີ່ມຮຽນ.\nການສອບເສັງວັດລະດັບ ວັນທີ 7 ກັນຍາ',
    status: 'Open',
    statusLa: 'ເປີດຮັບສະໝັກ',
    order: 0,
  });

  // 3. Reminders State
  const [reminders, setReminders] = useState<ApplicationReminder[]>([]);
  const [reminderModal, setReminderModal] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [reminderLangTab, setReminderLangTab] = useState<'en' | 'la'>('en');
  const [reminderForm, setReminderForm] = useState({
    title: '',
    titleLa: '',
    description: '',
    descriptionLa: '',
    icon: 'bell',
    order: 0,
    isActive: true,
  });

  // 4. Requirements State
  const [requirements, setRequirements] = useState<AdmissionRequirement[]>([]);
  const [reqModal, setReqModal] = useState(false);
  const [editingReqId, setEditingReqId] = useState<string | null>(null);
  const [reqLangTab, setReqLangTab] = useState<'en' | 'la'>('en');
  const [reqForm, setReqForm] = useState({
    category: 'ACADEMIC',
    degreeLevel: 'Undergraduate',
    title: 'Academic Requirements',
    titleLa: 'ເງື່ອນໄຂທາງວິຊາການ',
    subtitle: 'Undergraduate Programs',
    subtitleLa: 'ຫຼັກສູດປະລິນຍາຕີ',
    description: '',
    descriptionLa: '',
    requirementsList: 'High school diploma or equivalent with minimum GPA of 3.0\nOfficial transcripts from all secondary schools attended\nStrong performance in mathematics and science courses\nGraduation certificate or proof of completion',
    requirementsListLa: 'ປະກາສະນິຍະບັດຈົບມັດທະຍົມຕອນປາຍ ຫຼື ທຽບເທົ່າ\nໃບຄະແນນທາງການ\nຜົນການຮຽນທີ່ດີໃນວິຊາຄະນິດສາດ ແລະ ວິທະຍາສາດ\nໃບຢັ້ງຢືນການຈົບການສຶກສາ',
    icon: 'graduation-cap',
    order: 0,
    isActive: true,
  });

  // 5. FAQs State
  const [faqs, setFaqs] = useState<AdmissionFaq[]>([]);
  const [faqModal, setFaqModal] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqLangTab, setFaqLangTab] = useState<'en' | 'la'>('en');
  const [faqForm, setFaqForm] = useState({
    question: '',
    questionLa: '',
    answer: '',
    answerLa: '',
    category: 'General',
    order: 0,
    isActive: true,
  });

  // 6. Downloadable Materials State
  const [materials, setMaterials] = useState<ApplicationMaterial[]>([]);
  const [materialModal, setMaterialModal] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  const [materialLangTab, setMaterialLangTab] = useState<'en' | 'la'>('en');
  const [materialForm, setMaterialForm] = useState({
    title: '',
    titleLa: '',
    description: '',
    descriptionLa: '',
    fileUrl: '',
    fileType: 'PDF',
    fileSize: '',
    icon: 'Download',
    badgeColor: '#0400CC',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [heroRes, timeRes, remRes, reqRes, faqRes, matRes] = await Promise.all([
        api.getHero('HOW_TO_APPLY').catch(() => null),
        api.getTimelines().catch(() => []),
        api.getReminders(true).catch(() => []),
        api.getRequirements().catch(() => []),
        api.getFaqs(undefined, true).catch(() => []),
        api.getMaterials(true).catch(() => []),
      ]);

      if (heroRes) setHeroForm(heroRes);
      setTimelines(timeRes || []);
      setReminders(remRes || []);
      setRequirements(reqRes || []);
      setFaqs(faqRes || []);
      setMaterials(matRes || []);
    } catch (err) {
      console.error('Failed to load How to Apply data in admin:', err);
    } finally {
      setLoading(false);
    }
  };

  // ================= 1. HERO SAVE =================
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHero(true);
    try {
      await api.updateHero('HOW_TO_APPLY', heroForm);
      alert('How to Apply Hero section updated successfully!');
    } catch (err) {
      alert('Failed to save Hero section');
    } finally {
      setSavingHero(false);
    }
  };

  // ================= 2. TIMELINE HANDLERS =================
  const openNewTimeline = () => {
    setEditingTimelineId(null);
    setTimelineForm({
      intakeName: '',
      intakeNameLa: '',
      intakeYear: '2026',
      openingDate: new Date().toISOString().split('T')[0],
      closingDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      deadlineDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      classesBeginDate: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
      additionalNotes: '1st of October will be starting date of class.\nPlacement Exam 7th of September',
      additionalNotesLa: 'ວັນທີ 1 ຕຸລາ ຈະເປັນວັນເລີ່ມຮຽນ.\nການສອບເສັງວັດລະດັບ ວັນທີ 7 ກັນຍາ',
      status: 'Open',
      statusLa: 'ເປີດຮັບສະໝັກ',
      order: timelines.length + 1,
    });
    setTimelineModal(true);
  };

  const openEditTimeline = (item: AdmissionTimeline) => {
    setEditingTimelineId(item.id);
    setTimelineForm({
      intakeName: item.intakeName || '',
      intakeNameLa: item.intakeNameLa || '',
      intakeYear: item.intakeYear || '2026',
      openingDate: item.openingDate ? new Date(item.openingDate).toISOString().split('T')[0] : '',
      closingDate: item.closingDate ? new Date(item.closingDate).toISOString().split('T')[0] : '',
      deadlineDate: item.deadlineDate ? new Date(item.deadlineDate).toISOString().split('T')[0] : '',
      classesBeginDate: item.classesBeginDate ? new Date(item.classesBeginDate).toISOString().split('T')[0] : '',
      additionalNotes: item.additionalNotes || '',
      additionalNotesLa: item.additionalNotesLa || '',
      status: item.status || 'Open',
      statusLa: item.statusLa || 'ເປີດຮັບສະໝັກ',
      order: item.order || 0,
    });
    setTimelineModal(true);
  };

  const handleSaveTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTimelineId) {
        await api.updateTimeline(editingTimelineId, timelineForm);
      } else {
        await api.createTimeline(timelineForm);
      }
      setTimelineModal(false);
      loadAllData();
    } catch (err) {
      alert('Failed to save timeline');
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    if (!confirm('Are you sure you want to delete this intake timeline?')) return;
    try {
      await api.deleteTimeline(id);
      loadAllData();
    } catch (err) {
      alert('Failed to delete timeline');
    }
  };

  // ================= 3. REMINDER HANDLERS =================
  const openNewReminder = () => {
    setEditingReminderId(null);
    setReminderForm({
      title: '',
      titleLa: '',
      description: '',
      descriptionLa: '',
      icon: 'bell',
      order: reminders.length + 1,
      isActive: true,
    });
    setReminderModal(true);
  };

  const openEditReminder = (item: ApplicationReminder) => {
    setEditingReminderId(item.id);
    setReminderForm({
      title: item.title || '',
      titleLa: item.titleLa || '',
      description: item.description || '',
      descriptionLa: item.descriptionLa || '',
      icon: item.icon || 'bell',
      order: item.order || 0,
      isActive: item.isActive ?? true,
    });
    setReminderModal(true);
  };

  const handleSaveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReminderId) {
        await api.updateReminder(editingReminderId, reminderForm);
      } else {
        await api.createReminder(reminderForm);
      }
      setReminderModal(false);
      loadAllData();
    } catch (err) {
      alert('Failed to save reminder');
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;
    try {
      await api.deleteReminder(id);
      loadAllData();
    } catch (err) {
      alert('Failed to delete reminder');
    }
  };

  // ================= 4. REQUIREMENTS HANDLERS =================
  const parseLines = (text: string): string[] => {
    return text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const openNewReq = () => {
    setEditingReqId(null);
    setReqForm({
      category: 'ACADEMIC',
      degreeLevel: 'Undergraduate',
      title: 'Academic Requirements',
      titleLa: 'ເງື່ອນໄຂທາງວິຊາການ',
      subtitle: 'Undergraduate Programs',
      subtitleLa: 'ຫຼັກສູດປະລິນຍາຕີ',
      description: '',
      descriptionLa: '',
      requirementsList: '',
      requirementsListLa: '',
      icon: 'graduation-cap',
      order: requirements.length + 1,
      isActive: true,
    });
    setReqModal(true);
  };

  const openEditReq = (item: AdmissionRequirement) => {
    setEditingReqId(item.id);
    let listStr = '';
    let listLaStr = '';
    try {
      const arr = JSON.parse(item.requirementsList || '[]');
      listStr = Array.isArray(arr) ? arr.join('\n') : item.requirementsList || '';
    } catch {
      listStr = item.requirementsList || '';
    }
    try {
      const arrLa = JSON.parse(item.requirementsListLa || '[]');
      listLaStr = Array.isArray(arrLa) ? arrLa.join('\n') : item.requirementsListLa || '';
    } catch {
      listLaStr = item.requirementsListLa || '';
    }

    setReqForm({
      category: item.category || 'ACADEMIC',
      degreeLevel: item.degreeLevel || 'Undergraduate',
      title: item.title || '',
      titleLa: item.titleLa || '',
      subtitle: item.subtitle || '',
      subtitleLa: item.subtitleLa || '',
      description: item.description || '',
      descriptionLa: item.descriptionLa || '',
      requirementsList: listStr,
      requirementsListLa: listLaStr,
      icon: item.icon || 'graduation-cap',
      order: item.order || 0,
      isActive: item.isActive ?? true,
    });
    setReqModal(true);
  };

  const handleSaveReq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const listArr = parseLines(reqForm.requirementsList);
      const listLaArr = parseLines(reqForm.requirementsListLa);

      const payload = {
        ...reqForm,
        requirementsList: JSON.stringify(listArr),
        requirementsListLa: listLaArr.length > 0 ? JSON.stringify(listLaArr) : undefined,
      };

      if (editingReqId) {
        await api.updateRequirement(editingReqId, payload);
      } else {
        await api.createRequirement(payload);
      }
      setReqModal(false);
      loadAllData();
    } catch (err) {
      alert('Failed to save requirement');
    }
  };

  const handleDeleteReq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this requirement block?')) return;
    try {
      await api.deleteRequirement(id);
      loadAllData();
    } catch (err) {
      alert('Failed to delete requirement');
    }
  };

  // ================= 5. FAQS HANDLERS =================
  const openNewFaq = () => {
    setEditingFaqId(null);
    setFaqForm({
      question: '',
      questionLa: '',
      answer: '',
      answerLa: '',
      category: 'General',
      order: faqs.length + 1,
      isActive: true,
    });
    setFaqModal(true);
  };

  const openEditFaq = (item: AdmissionFaq) => {
    setEditingFaqId(item.id);
    setFaqForm({
      question: item.question || '',
      questionLa: item.questionLa || '',
      answer: item.answer || '',
      answerLa: item.answerLa || '',
      category: item.category || 'General',
      order: item.order || 0,
      isActive: item.isActive ?? true,
    });
    setFaqModal(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaqId) {
        await api.updateFaq(editingFaqId, faqForm);
      } else {
        await api.createFaq(faqForm);
      }
      setFaqModal(false);
      loadAllData();
    } catch (err) {
      alert('Failed to save FAQ');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await api.deleteFaq(id);
      loadAllData();
    } catch (err) {
      alert('Failed to delete FAQ');
    }
  };

  // ================= 6. MATERIAL HANDLERS =================
  const openNewMaterial = () => {
    setEditingMaterialId(null);
    setMaterialForm({
      title: '',
      titleLa: '',
      description: '',
      descriptionLa: '',
      fileUrl: '',
      fileType: 'PDF',
      fileSize: '',
      icon: 'Download',
      badgeColor: '#0400CC',
      order: materials.length + 1,
      isActive: true,
    });
    setMaterialModal(true);
  };

  const openEditMaterial = (item: ApplicationMaterial) => {
    setEditingMaterialId(item.id);
    setMaterialForm({
      title: item.title || '',
      titleLa: item.titleLa || '',
      description: item.description || '',
      descriptionLa: item.descriptionLa || '',
      fileUrl: item.fileUrl || '',
      fileType: item.fileType || 'PDF',
      fileSize: item.fileSize || '',
      icon: item.icon || 'Download',
      badgeColor: item.badgeColor || '#0400CC',
      order: item.order || 0,
      isActive: item.isActive ?? true,
    });
    setMaterialModal(true);
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialForm.fileUrl) {
      alert('Please upload or provide a file URL stored in SeaweedFS.');
      return;
    }
    try {
      if (editingMaterialId) {
        await api.updateMaterial(editingMaterialId, materialForm);
      } else {
        await api.createMaterial(materialForm);
      }
      setMaterialModal(false);
      loadAllData();
    } catch (err) {
      alert('Failed to save downloadable material');
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this downloadable material?')) return;
    try {
      await api.deleteMaterial(id);
      loadAllData();
    } catch (err) {
      alert('Failed to delete downloadable material');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <FileCheck2 className="w-8 h-8 text-[#0400CC]" />
            How To Apply Management
          </h1>
          <p className="text-slate-500 text-sm">
            Dynamically configure Hero banner, Timeline, Reminders, Requirements, Qualifications, International details, and FAQs.
          </p>
        </div>

        <a
          href="/how-to-apply"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-blue-50 text-[#0400CC] font-bold text-xs sm:text-sm rounded-xl border border-blue-200 hover:bg-blue-100 transition-all flex items-center gap-1.5"
        >
          View Public Page →
        </a>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'HERO', label: 'Hero Section', icon: Sparkles },
          { id: 'TIMELINE', label: 'Application Timeline', icon: Calendar },
          { id: 'REMINDERS', label: 'Application Reminders', icon: Bell },
          { id: 'REQUIREMENTS', label: 'Admission Requirements', icon: GraduationCap },
          { id: 'FAQS', label: 'Admission FAQs', icon: HelpCircle },
          { id: 'MATERIALS', label: 'Downloadable Materials', icon: Download },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0400CC] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0400CC]" />
        </div>
      ) : (
        <>
          {/* ================= 1. HERO TAB ================= */}
          {activeTab === 'HERO' && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">How to Apply Hero Banner</h2>
                  <p className="text-xs text-slate-500">Configure title, subtitle, description, and call to action.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setHeroLangTab('en')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer ${heroLangTab === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroLangTab('la')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer ${heroLangTab === 'la' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                  >
                    Lao (ພາສາລາວ)
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveHero} className="space-y-5">
                {heroLangTab === 'en' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">Hero Title (EN)</label>
                      <input
                        type="text"
                        value={heroForm.title || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0400CC] outline-none text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">Hero Subtitle / Badge (EN)</label>
                      <input
                        type="text"
                        value={heroForm.subtitle || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0400CC] outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">Hero Description (EN)</label>
                      <textarea
                        rows={3}
                        value={heroForm.description || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0400CC] outline-none text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">Hero Title (LA)</label>
                      <input
                        type="text"
                        value={heroForm.titleLa || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, titleLa: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0400CC] outline-none text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">Hero Subtitle / Badge (LA)</label>
                      <input
                        type="text"
                        value={heroForm.subtitleLa || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, subtitleLa: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0400CC] outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">Hero Description (LA)</label>
                      <textarea
                        rows={3}
                        value={heroForm.descriptionLa || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, descriptionLa: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0400CC] outline-none text-sm"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Hero Background Image URL (Optional)</label>
                  <input
                    type="text"
                    value={heroForm.imageUrl || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0400CC] outline-none text-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingHero}
                    className="px-6 py-3 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {savingHero ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Hero Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= 2. TIMELINE TAB ================= */}
          {activeTab === 'TIMELINE' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Application Timelines & Intakes</h2>
                  <p className="text-xs text-slate-500">Manage open intakes, deadlines, classes begin date, and exam notes.</p>
                </div>
                <button
                  onClick={openNewTimeline}
                  className="px-4 py-2.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Intake
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {timelines.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 relative border-l-4 border-l-[#0400CC]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0400CC] flex items-center justify-center">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{item.intakeName}</h3>
                          {item.intakeNameLa && <p className="text-[11px] text-slate-400">{item.intakeNameLa}</p>}
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                        {item.status || 'Open'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Application Deadline</span>
                        <span className="font-bold text-slate-800">{item.deadlineDate ? new Date(item.deadlineDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Classes Begin</span>
                        <span className="font-bold text-slate-800">{item.classesBeginDate ? new Date(item.classesBeginDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>

                    {item.additionalNotes && (
                      <div className="space-y-1.5 pt-1 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Class Start & Exam Notes:</span>
                        {item.additionalNotes.split('\n').filter(Boolean).map((line, lIdx) => (
                          <div key={lIdx} className="flex items-center gap-2 text-xs font-bold text-[#0400CC]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0400CC] shrink-0" />
                            <span>{line.replace(/^[•\-\*]\s*/, '')}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => openEditTimeline(item)}
                        className="p-2 text-slate-600 hover:text-[#0400CC] hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-1 text-xs font-bold"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTimeline(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 3. REMINDERS TAB ================= */}
          {activeTab === 'REMINDERS' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Application Reminders</h2>
                  <p className="text-xs text-slate-500">Manage important tips, scholarships bonuses, document notices, and visa timelines.</p>
                </div>
                <button
                  onClick={openNewReminder}
                  className="px-4 py-2.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Reminder
                </button>
              </div>

              <div className="space-y-3">
                {reminders.map((rem) => (
                  <div key={rem.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0400CC] flex items-center justify-center shrink-0 mt-0.5">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{rem.title}</h4>
                        <p className="text-xs text-slate-600">{rem.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEditReminder(rem)}
                        className="p-2 text-slate-600 hover:text-[#0400CC] hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReminder(rem.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. REQUIREMENTS TAB ================= */}
          {activeTab === 'REQUIREMENTS' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Admission Requirements & Qualifications</h2>
                  <p className="text-xs text-slate-500">Manage Academic Requirements, Additional Qualifications, and International criteria.</p>
                </div>
                <button
                  onClick={openNewReq}
                  className="px-4 py-2.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Requirement Block
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {requirements.map((req) => (
                  <div key={req.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-[#0400CC] text-xs font-bold rounded-full">
                          {req.category || 'ACADEMIC'}
                        </span>
                        <span className="text-xs text-slate-400">Order: {req.order}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{req.title}</h3>
                      <h4 className="text-xs font-bold text-[#0400CC]">{req.subtitle}</h4>
                      <p className="text-xs text-slate-500 line-clamp-3">{req.description}</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => openEditReq(req)}
                        className="p-2 text-slate-600 hover:text-[#0400CC] hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReq(req.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 5. FAQS TAB ================= */}
          {activeTab === 'FAQS' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Admission FAQs</h2>
                  <p className="text-xs text-slate-500">Manage all questions and answers displayed in the How to Apply FAQ accordion.</p>
                </div>
                <button
                  onClick={openNewFaq}
                  className="px-4 py-2.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                          {faq.category || 'General'}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">{faq.question}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEditFaq(faq)}
                        className="p-2 text-slate-600 hover:text-[#0400CC] hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 6. DOWNLOADABLE MATERIALS TAB ================= */}
          {activeTab === 'MATERIALS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Download className="w-5 h-5 text-[#0400CC]" />
                    Downloadable Application Materials
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage brochures, admission checklists, forms, and guides. Files are uploaded directly to SeaweedFS and downloadable by students.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewMaterial}
                  className="px-4 py-2.5 bg-[#0400CC] hover:bg-[#0000CC] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Downloadable Material
                </button>
              </div>

              {materials.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0400CC] flex items-center justify-center mx-auto">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">No Downloadable Materials Found</h3>
                    <p className="text-xs text-slate-500 mt-1">Click "Add Downloadable Material" to upload your first guide to SeaweedFS.</p>
                  </div>
                  <button
                    type="button"
                    onClick={openNewMaterial}
                    className="px-4 py-2 bg-[#0400CC] text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer shadow"
                  >
                    <Plus className="w-4 h-4" /> Add Material
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {materials.map((mat) => {
                    const headerBg = mat.badgeColor || '#0400CC';
                    const isBook = mat.icon === 'BookOpen';

                    return (
                      <div
                        key={mat.id}
                        className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
                      >
                        {/* Card Header with Color & Icon */}
                        <div
                          style={{ backgroundColor: headerBg }}
                          className="p-6 text-white flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
                              {isBook ? <BookOpen className="w-6 h-6" /> : <Download className="w-6 h-6" />}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                                {mat.title}
                              </h3>
                              {mat.titleLa && (
                                <p className="text-xs text-white/80 truncate">{mat.titleLa}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white/20 text-white">
                                  {mat.fileType || 'PDF'}, {mat.fileSize || 'Auto'}
                                </span>
                                <span className="text-[11px] text-white/70">Order: {mat.order}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                mat.isActive !== false ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30' : 'bg-red-500/20 text-red-200'
                              }`}
                            >
                              {mat.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                          <div className="space-y-2">
                            {mat.description && (
                              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {mat.description}
                              </p>
                            )}
                            {mat.descriptionLa && (
                              <p className="text-xs text-slate-400 leading-relaxed italic">
                                {mat.descriptionLa}
                              </p>
                            )}
                          </div>

                          {/* SeaweedFS File Link info */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                SeaweedFS File Storage:
                              </span>
                              <span className="font-mono text-slate-700 truncate block text-[11px]">
                                {mat.fileUrl || 'No file attached'}
                              </span>
                            </div>
                            {mat.fileUrl && (
                              <a
                                href={mat.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="p-2 bg-white text-[#0400CC] hover:bg-blue-50 border border-slate-200 rounded-lg shrink-0 inline-flex items-center gap-1 font-bold text-xs"
                                title="Download File"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Test</span>
                              </a>
                            )}
                          </div>

                          {/* Footer Actions */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditMaterial(mat)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-[#0400CC] hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" /> Edit Material
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteMaterial(mat.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Material"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ================= TIMELINE MODAL ================= */}
      {timelineModal && (
        <Modal
          isOpen={timelineModal}
          onClose={() => setTimelineModal(false)}
          title={editingTimelineId ? 'Edit Intake Timeline' : 'Add New Intake Timeline'}
        >
          <form onSubmit={handleSaveTimeline} className="space-y-4">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
              <button
                type="button"
                onClick={() => setTimelineLangTab('en')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${timelineLangTab === 'en' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setTimelineLangTab('la')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${timelineLangTab === 'la' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              >
                Lao
              </button>
            </div>

            {timelineLangTab === 'en' ? (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Intake Name (EN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fall Semester 2026"
                    value={timelineForm.intakeName}
                    onChange={(e) => setTimelineForm({ ...timelineForm, intakeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Additional Notes / Class Start Date & Placement Exam (EN)
                    </label>
                    <span className="text-[11px] text-slate-400">One item per line</span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder={`1st of October will be starting date of class.\nPlacement Exam 7th of September`}
                    value={timelineForm.additionalNotes}
                    onChange={(e) => setTimelineForm({ ...timelineForm, additionalNotes: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0400CC] leading-relaxed font-mono text-xs"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Each line entered will be formatted as a highlighted bullet note (e.g. placement test, start date) on the public timeline box.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Intake Name (LA)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ພາກຮຽນລະດູໃບໄມ້ຫຼົ່ນ 2026"
                    value={timelineForm.intakeNameLa}
                    onChange={(e) => setTimelineForm({ ...timelineForm, intakeNameLa: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Additional Notes / Class Start Date & Placement Exam (LA)
                    </label>
                    <span className="text-[11px] text-slate-400">ແຖວລະ 1 ລາຍການ</span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder={`ວັນທີ 1 ຕຸລາ ຈະເປັນມື້ເລີ່ມຕົ້ນຮຽນ.\nສອບເສັງວັດລະດັບວັນທີ 7 ກັນຍາ`}
                    value={timelineForm.additionalNotesLa}
                    onChange={(e) => setTimelineForm({ ...timelineForm, additionalNotesLa: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0400CC] leading-relaxed font-mono text-xs"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    ແຕ່ລະແຖວຈະສະແດງເປັນລາຍການໝາຍເຫດພ້ອມຈຸດສີຟ້າໃນໜ້າເວັບສາທາລະນະ.
                  </p>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Application Deadline</label>
                <input
                  type="date"
                  value={timelineForm.deadlineDate}
                  onChange={(e) => setTimelineForm({ ...timelineForm, deadlineDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Classes Begin Date</label>
                <input
                  type="date"
                  value={timelineForm.classesBeginDate}
                  onChange={(e) => setTimelineForm({ ...timelineForm, classesBeginDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Status Badge</label>
                <input
                  type="text"
                  value={timelineForm.status}
                  onChange={(e) => setTimelineForm({ ...timelineForm, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Order</label>
                <input
                  type="number"
                  value={timelineForm.order}
                  onChange={(e) => setTimelineForm({ ...timelineForm, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setTimelineModal(false)}
                className="px-4 py-2 border rounded-xl text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0400CC] text-white rounded-xl text-sm font-bold shadow-md cursor-pointer"
              >
                Save Timeline
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= REMINDER MODAL ================= */}
      {reminderModal && (
        <Modal
          isOpen={reminderModal}
          onClose={() => setReminderModal(false)}
          title={editingReminderId ? 'Edit Reminder' : 'Add New Reminder'}
        >
          <form onSubmit={handleSaveReminder} className="space-y-4">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
              <button
                type="button"
                onClick={() => setReminderLangTab('en')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${reminderLangTab === 'en' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setReminderLangTab('la')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${reminderLangTab === 'la' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              >
                Lao
              </button>
            </div>

            {reminderLangTab === 'en' ? (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Title (EN)</label>
                  <input
                    type="text"
                    required
                    value={reminderForm.title}
                    onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Description (EN)</label>
                  <textarea
                    rows={3}
                    required
                    value={reminderForm.description}
                    onChange={(e) => setReminderForm({ ...reminderForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Title (LA)</label>
                  <input
                    type="text"
                    value={reminderForm.titleLa}
                    onChange={(e) => setReminderForm({ ...reminderForm, titleLa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Description (LA)</label>
                  <textarea
                    rows={3}
                    value={reminderForm.descriptionLa}
                    onChange={(e) => setReminderForm({ ...reminderForm, descriptionLa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setReminderModal(false)}
                className="px-4 py-2 border rounded-xl text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0400CC] text-white rounded-xl text-sm font-bold shadow-md cursor-pointer"
              >
                Save Reminder
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= REQUIREMENTS MODAL ================= */}
      {reqModal && (
        <Modal
          isOpen={reqModal}
          onClose={() => setReqModal(false)}
          title={editingReqId ? 'Edit Requirements Block' : 'Add Requirements Block'}
        >
          <form onSubmit={handleSaveReq} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={reqForm.category}
                  onChange={(e) => setReqForm({ ...reqForm, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                >
                  <option value="ACADEMIC">ACADEMIC</option>
                  <option value="QUALIFICATIONS">QUALIFICATIONS</option>
                  <option value="INTERNATIONAL">INTERNATIONAL</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Degree Level</label>
                <input
                  type="text"
                  value={reqForm.degreeLevel}
                  onChange={(e) => setReqForm({ ...reqForm, degreeLevel: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
              <button
                type="button"
                onClick={() => setReqLangTab('en')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${reqLangTab === 'en' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setReqLangTab('la')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${reqLangTab === 'la' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              >
                Lao
              </button>
            </div>

            {reqLangTab === 'en' ? (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Title (EN)</label>
                  <input
                    type="text"
                    required
                    value={reqForm.title}
                    onChange={(e) => setReqForm({ ...reqForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subtitle / Track (EN)</label>
                  <input
                    type="text"
                    value={reqForm.subtitle}
                    onChange={(e) => setReqForm({ ...reqForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Bullet Items (1 per line)</label>
                  <textarea
                    rows={4}
                    value={reqForm.requirementsList}
                    onChange={(e) => setReqForm({ ...reqForm, requirementsList: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Title (LA)</label>
                  <input
                    type="text"
                    value={reqForm.titleLa}
                    onChange={(e) => setReqForm({ ...reqForm, titleLa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subtitle / Track (LA)</label>
                  <input
                    type="text"
                    value={reqForm.subtitleLa}
                    onChange={(e) => setReqForm({ ...reqForm, subtitleLa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Bullet Items (LA - 1 per line)</label>
                  <textarea
                    rows={4}
                    value={reqForm.requirementsListLa}
                    onChange={(e) => setReqForm({ ...reqForm, requirementsListLa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setReqModal(false)}
                className="px-4 py-2 border rounded-xl text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0400CC] text-white rounded-xl text-sm font-bold shadow-md cursor-pointer"
              >
                Save Block
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= FAQ MODAL ================= */}
      {faqModal && (
        <Modal
          isOpen={faqModal}
          onClose={() => setFaqModal(false)}
          title={editingFaqId ? 'Edit FAQ' : 'Add FAQ'}
        >
          <form onSubmit={handleSaveFaq} className="space-y-4">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
              <button
                type="button"
                onClick={() => setFaqLangTab('en')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${faqLangTab === 'en' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setFaqLangTab('la')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${faqLangTab === 'la' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              >
                Lao
              </button>
            </div>

            {faqLangTab === 'en' ? (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Question (EN)</label>
                  <input
                    type="text"
                    required
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Answer (EN)</label>
                  <textarea
                    rows={4}
                    required
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm leading-relaxed"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Question (LA)</label>
                  <input
                    type="text"
                    value={faqForm.questionLa}
                    onChange={(e) => setFaqForm({ ...faqForm, questionLa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Answer (LA)</label>
                  <textarea
                    rows={4}
                    value={faqForm.answerLa}
                    onChange={(e) => setFaqForm({ ...faqForm, answerLa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm leading-relaxed"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <input
                  type="text"
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Order</label>
                <input
                  type="number"
                  value={faqForm.order}
                  onChange={(e) => setFaqForm({ ...faqForm, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setFaqModal(false)}
                className="px-4 py-2 border rounded-xl text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0400CC] text-white rounded-xl text-sm font-bold shadow-md cursor-pointer"
              >
                Save FAQ
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MATERIAL MODAL ================= */}
      {materialModal && (
        <Modal
          isOpen={materialModal}
          onClose={() => setMaterialModal(false)}
          title={editingMaterialId ? 'Edit Downloadable Material' : 'Add Downloadable Material'}
        >
          <form onSubmit={handleSaveMaterial} className="space-y-4">
            {/* Language Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
              <button
                type="button"
                onClick={() => setMaterialLangTab('en')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  materialLangTab === 'en' ? 'bg-white text-[#0400CC] shadow-sm' : 'text-slate-500'
                }`}
              >
                English Details
              </button>
              <button
                type="button"
                onClick={() => setMaterialLangTab('la')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  materialLangTab === 'la' ? 'bg-white text-[#0400CC] shadow-sm' : 'text-slate-500'
                }`}
              >
                Lao Details (ພາສາລາວ)
              </button>
            </div>

            {materialLangTab === 'en' ? (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Document Title (EN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Application Checklist"
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Short Description (EN)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief overview of what this guide or checklist contains..."
                    value={materialForm.description}
                    onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0400CC] leading-relaxed resize-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Document Title (LA)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ລາຍການກວດສອບການສະໝັກ"
                    value={materialForm.titleLa}
                    onChange={(e) => setMaterialForm({ ...materialForm, titleLa: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Short Description (LA)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="ຄຳອະທິບາຍຫຍໍ້ກ່ຽວກັບເອກະສານນີ້..."
                    value={materialForm.descriptionLa}
                    onChange={(e) => setMaterialForm({ ...materialForm, descriptionLa: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0400CC] leading-relaxed resize-none"
                  />
                </div>
              </>
            )}

            {/* SeaweedFS File Upload Zone */}
            <div className="pt-2">
              <FileUpload
                label="Document File (SeaweedFS Upload)"
                required
                value={materialForm.fileUrl}
                onChange={(url, meta) => {
                  setMaterialForm((prev) => ({
                    ...prev,
                    fileUrl: url,
                    fileType: meta?.fileType || prev.fileType,
                    fileSize: meta?.fileSize || prev.fileSize,
                  }));
                }}
                helpText="Upload PDF, DOCX, or ZIP to SeaweedFS. File size & format are auto-extracted."
              />
            </div>

            {/* File Format & Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">File Format / Type</label>
                <input
                  type="text"
                  placeholder="PDF"
                  value={materialForm.fileType}
                  onChange={(e) => setMaterialForm({ ...materialForm, fileType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono uppercase"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">File Size Display</label>
                <input
                  type="text"
                  placeholder="e.g. 2.3 MB"
                  value={materialForm.fileSize}
                  onChange={(e) => setMaterialForm({ ...materialForm, fileSize: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono"
                />
              </div>
            </div>

            {/* Card Header Color & Icon */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Header Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={materialForm.badgeColor}
                    onChange={(e) => setMaterialForm({ ...materialForm, badgeColor: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-200 p-1 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={materialForm.badgeColor}
                    onChange={(e) => setMaterialForm({ ...materialForm, badgeColor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Card Icon</label>
                <select
                  value={materialForm.icon}
                  onChange={(e) => setMaterialForm({ ...materialForm, icon: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="Download">Download Arrow</option>
                  <option value="BookOpen">Book Open</option>
                  <option value="FileText">File Document</option>
                </select>
              </div>
            </div>

            {/* Order & Active Status */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Display Order</label>
                <input
                  type="number"
                  value={materialForm.order}
                  onChange={(e) => setMaterialForm({ ...materialForm, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="matIsActive"
                  checked={materialForm.isActive}
                  onChange={(e) => setMaterialForm({ ...materialForm, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#0400CC] rounded cursor-pointer"
                />
                <label htmlFor="matIsActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Visible to Public
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setMaterialModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold cursor-pointer text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0400CC] hover:bg-[#0000CC] text-white rounded-xl text-sm font-bold shadow-md cursor-pointer transition-all"
              >
                {editingMaterialId ? 'Update Material' : 'Save Material'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
