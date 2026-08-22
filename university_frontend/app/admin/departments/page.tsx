'use client';

import React, { useState, useEffect } from 'react';
import { api, Department, BoxStatItem } from '@/lib/api';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  Briefcase,
  Target,
  FileText,
  CheckCircle2,
  X,
  TrendingUp,
  Building2,
  Award,
  Clock,
  Code2,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import Link from 'next/link';

interface BoxStatForm {
  value: string;
  label: string;
  valueLa?: string;
  labelLa?: string;
}

export default function AdminDepartmentsPage() {
  const [items, setItems] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Department | null>(null);
  const [modalTab, setModalTab] = useState<'basic' | 'description' | 'heroBoxes' | 'focusAreas' | 'careerOutcomes'>('basic');
  const [activeLang, setActiveLang] = useState<'en' | 'la'>('en');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameLa: '',
    slug: '',
    description: '',
    descriptionLa: '',
    heroImage: '',
    imageUrl: '',
    order: 1,
    isActive: true,

    // Field 3: Hero Stat Boxes (4 items)
    heroBox1Value: '',
    heroBox1Label: '',
    heroBox1ValueLa: '',
    heroBox1LabelLa: '',

    heroBox2Value: '',
    heroBox2Label: '',
    heroBox2ValueLa: '',
    heroBox2LabelLa: '',

    heroBox3Value: '',
    heroBox3Label: '',
    heroBox3ValueLa: '',
    heroBox3LabelLa: '',

    heroBox4Value: '',
    heroBox4Label: '',
    heroBox4ValueLa: '',
    heroBox4LabelLa: '',

    // Field 4: Core Focus Areas (newline or comma-separated)
    coreFocusAreasText: '',
    coreFocusAreasTextLa: '',

    // Field 5: Career Outcome Description
    careerOutcomeDesc: '',
    careerOutcomeDescLa: '',

    // Field 6: Career Outcomes 4 Boxes
    careerPlacementRate: '',
    careerPlacementRateLa: '',
    careerAvgSalary: '',
    careerAvgSalaryLa: '',
    careerPartnerCompanies: '',
    careerPartnerCompaniesLa: '',
    careerTimeToEmployment: '',
    careerTimeToEmploymentLa: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getDepartments();
      setItems(data || []);
    } catch (e) {
      console.error('Failed to load departments:', e);
    } finally {
      setLoading(false);
    }
  };

  const parseJsonArray = (val: any): any[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const res = JSON.parse(val);
      return Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setModalTab('basic');
    setActiveLang('en');
    setFormData({
      name: '',
      nameLa: '',
      slug: '',
      description: '',
      descriptionLa: '',
      heroImage: '',
      imageUrl: '',
      order: items.length + 1,
      isActive: true,

      heroBox1Value: '',
      heroBox1Label: '',
      heroBox1ValueLa: '',
      heroBox1LabelLa: '',

      heroBox2Value: '',
      heroBox2Label: '',
      heroBox2ValueLa: '',
      heroBox2LabelLa: '',

      heroBox3Value: '',
      heroBox3Label: '',
      heroBox3ValueLa: '',
      heroBox3LabelLa: '',

      heroBox4Value: '',
      heroBox4Label: '',
      heroBox4ValueLa: '',
      heroBox4LabelLa: '',

      coreFocusAreasText: '',
      coreFocusAreasTextLa: '',

      careerOutcomeDesc: '',
      careerOutcomeDescLa: '',

      careerPlacementRate: '',
      careerPlacementRateLa: '',
      careerAvgSalary: '',
      careerAvgSalaryLa: '',
      careerPartnerCompanies: '',
      careerPartnerCompaniesLa: '',
      careerTimeToEmployment: '',
      careerTimeToEmploymentLa: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Department) => {
    setEditingItem(item);
    setModalTab('basic');
    setActiveLang('en');

    // Parse Hero Box-descriptions
    const boxesEn: BoxStatItem[] = parseJsonArray(item.boxDescriptions);
    const boxesLa: BoxStatItem[] = parseJsonArray(item.boxDescriptionsLa);

    // Parse Core Focus Areas
    const focusEn: string[] = parseJsonArray(item.coreFocusAreas);
    const focusLa: string[] = parseJsonArray(item.coreFocusAreasLa);

    setFormData({
      name: item.name || item.title || '',
      nameLa: item.nameLa || item.titleLa || '',
      slug: item.slug || '',
      description: item.description || '',
      descriptionLa: item.descriptionLa || '',
      heroImage: item.heroImage || '',
      imageUrl: item.imageUrl || item.image || '',
      order: item.order !== undefined ? item.order : 1,
      isActive: item.isActive !== undefined ? item.isActive : true,

      heroBox1Value: boxesEn[0]?.value || '',
      heroBox1Label: boxesEn[0]?.label || '',
      heroBox1ValueLa: boxesLa[0]?.value || '',
      heroBox1LabelLa: boxesLa[0]?.label || '',

      heroBox2Value: boxesEn[1]?.value || '',
      heroBox2Label: boxesEn[1]?.label || '',
      heroBox2ValueLa: boxesLa[1]?.value || '',
      heroBox2LabelLa: boxesLa[1]?.label || '',

      heroBox3Value: boxesEn[2]?.value || '',
      heroBox3Label: boxesEn[2]?.label || '',
      heroBox3ValueLa: boxesLa[2]?.value || '',
      heroBox3LabelLa: boxesLa[2]?.label || '',

      heroBox4Value: boxesEn[3]?.value || '',
      heroBox4Label: boxesEn[3]?.label || '',
      heroBox4ValueLa: boxesLa[3]?.value || '',
      heroBox4LabelLa: boxesLa[3]?.label || '',

      coreFocusAreasText: focusEn.join('\n'),
      coreFocusAreasTextLa: focusLa.join('\n'),

      careerOutcomeDesc: item.careerOutcomeDesc || '',
      careerOutcomeDescLa: item.careerOutcomeDescLa || '',

      careerPlacementRate: item.careerPlacementRate || '',
      careerPlacementRateLa: item.careerPlacementRateLa || '',
      careerAvgSalary: item.careerAvgSalary || '',
      careerAvgSalaryLa: item.careerAvgSalaryLa || '',
      careerPartnerCompanies: item.careerPartnerCompanies || '',
      careerPartnerCompaniesLa: item.careerPartnerCompaniesLa || '',
      careerTimeToEmployment: item.careerTimeToEmployment || '',
      careerTimeToEmploymentLa: item.careerTimeToEmploymentLa || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department / major? All related programs and settings will be affected.')) return;
    try {
      await api.deleteDepartment(id);
      loadItems();
    } catch (e) {
      alert('Failed to delete department');
    }
  };

  const handleApplyPresetCS = () => {
    setFormData((prev) => ({
      ...prev,
      heroBox1Value: '15+',
      heroBox1Label: 'PROGRAMMING LANGUAGES',
      heroBox1ValueLa: '15+',
      heroBox1LabelLa: 'ພາສາການຂຽນໂປຣແກຣມ',

      heroBox2Value: '8',
      heroBox2Label: 'SPECIALIZED LABS',
      heroBox2ValueLa: '8',
      heroBox2LabelLa: 'ຫ້ອງທົດລອງສະເພາະດ້ານ',

      heroBox3Value: '95%',
      heroBox3Label: 'JOB PLACEMENT',
      heroBox3ValueLa: '95%',
      heroBox3LabelLa: 'ອັດຕາການໄດ້ຮັບວຽກເຮັດ',

      heroBox4Value: '40+',
      heroBox4Label: 'INDUSTRY PARTNERS',
      heroBox4ValueLa: '40+',
      heroBox4LabelLa: 'ຄູ່ຮ່ວມງານພາກອຸດສາຫະກຳ',
    }));
  };

  const handleClearHeroBoxes = () => {
    setFormData((prev) => ({
      ...prev,
      heroBox1Value: '',
      heroBox1Label: '',
      heroBox1ValueLa: '',
      heroBox1LabelLa: '',

      heroBox2Value: '',
      heroBox2Label: '',
      heroBox2ValueLa: '',
      heroBox2LabelLa: '',

      heroBox3Value: '',
      heroBox3Label: '',
      heroBox3ValueLa: '',
      heroBox3LabelLa: '',

      heroBox4Value: '',
      heroBox4Label: '',
      heroBox4ValueLa: '',
      heroBox4LabelLa: '',
    }));
  };

  const handleClearCareerBoxes = () => {
    setFormData((prev) => ({
      ...prev,
      careerPlacementRate: '',
      careerPlacementRateLa: '',
      careerAvgSalary: '',
      careerAvgSalaryLa: '',
      careerPartnerCompanies: '',
      careerPartnerCompaniesLa: '',
      careerTimeToEmployment: '',
      careerTimeToEmploymentLa: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Assemble Hero Box-descriptions array if any value exists
    const hasHeroBoxesEn = formData.heroBox1Value || formData.heroBox2Value || formData.heroBox3Value || formData.heroBox4Value;
    const heroBoxesEn: BoxStatItem[] = [];
    if (formData.heroBox1Value || formData.heroBox1Label) heroBoxesEn.push({ value: formData.heroBox1Value, label: formData.heroBox1Label });
    if (formData.heroBox2Value || formData.heroBox2Label) heroBoxesEn.push({ value: formData.heroBox2Value, label: formData.heroBox2Label });
    if (formData.heroBox3Value || formData.heroBox3Label) heroBoxesEn.push({ value: formData.heroBox3Value, label: formData.heroBox3Label });
    if (formData.heroBox4Value || formData.heroBox4Label) heroBoxesEn.push({ value: formData.heroBox4Value, label: formData.heroBox4Label });

    const heroBoxesLa: BoxStatItem[] = [];
    if (formData.heroBox1ValueLa || formData.heroBox1LabelLa) heroBoxesLa.push({ value: formData.heroBox1ValueLa, label: formData.heroBox1LabelLa });
    if (formData.heroBox2ValueLa || formData.heroBox2LabelLa) heroBoxesLa.push({ value: formData.heroBox2ValueLa, label: formData.heroBox2LabelLa });
    if (formData.heroBox3ValueLa || formData.heroBox3LabelLa) heroBoxesLa.push({ value: formData.heroBox3ValueLa, label: formData.heroBox3LabelLa });
    if (formData.heroBox4ValueLa || formData.heroBox4LabelLa) heroBoxesLa.push({ value: formData.heroBox4ValueLa, label: formData.heroBox4LabelLa });

    // Assemble Focus Areas
    const focusAreasEn = formData.coreFocusAreasText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const focusAreasLa = formData.coreFocusAreasTextLa
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: any = {
      name: formData.name,
      nameLa: formData.nameLa || null,
      slug: formData.slug.trim().toLowerCase(),
      description: formData.description,
      descriptionLa: formData.descriptionLa || null,
      heroImage: formData.heroImage || null,
      imageUrl: formData.imageUrl || null,
      order: Number(formData.order) || 0,
      isActive: formData.isActive,

      boxDescriptions: heroBoxesEn.length > 0 ? JSON.stringify(heroBoxesEn) : null,
      boxDescriptionsLa: heroBoxesLa.length > 0 ? JSON.stringify(heroBoxesLa) : null,

      coreFocusAreas: focusAreasEn.length > 0 ? JSON.stringify(focusAreasEn) : null,
      coreFocusAreasLa: focusAreasLa.length > 0 ? JSON.stringify(focusAreasLa) : null,

      careerOutcomeDesc: formData.careerOutcomeDesc || null,
      careerOutcomeDescLa: formData.careerOutcomeDescLa || null,

      careerPlacementRate: formData.careerPlacementRate || null,
      careerPlacementRateLa: formData.careerPlacementRateLa || null,
      careerAvgSalary: formData.careerAvgSalary || null,
      careerAvgSalaryLa: formData.careerAvgSalaryLa || null,
      careerPartnerCompanies: formData.careerPartnerCompanies || null,
      careerPartnerCompaniesLa: formData.careerPartnerCompaniesLa || null,
      careerTimeToEmployment: formData.careerTimeToEmployment || null,
      careerTimeToEmploymentLa: formData.careerTimeToEmploymentLa || null,
    };

    try {
      if (editingItem) {
        await api.updateDepartment(editingItem.id, payload);
      } else {
        await api.createDepartment(payload);
      }
      setModalOpen(false);
      loadItems();
    } catch (e) {
      console.error(e);
      alert('Failed to save department / major');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-[#0400CC]" />
            Departments & Featured Majors
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage academic departments, hero banners, stats boxes, focus areas, and career outcomes for all SIT majors in one unified location.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Department / Major
        </button>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">Loading departments & majors...</div>
        ) : items.length > 0 ? (
          items.map((item, idx) => {
            const boxes: BoxStatItem[] = parseJsonArray(item.boxDescriptions);
            const focusAreas: string[] = parseJsonArray(item.coreFocusAreas);
            const hasCareerBoxes = item.careerPlacementRate || item.careerAvgSalary || item.careerPartnerCompanies || item.careerTimeToEmployment;

            return (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  {/* Hero Banner / Showcase Image */}
                  <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden group">
                    {item.heroImage || item.imageUrl ? (
                      <img
                        src={item.heroImage || item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No Image
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 bg-[#00001C]/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      Order: {item.order}
                    </span>
                    {item.isActive === false && (
                      <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-[#00001C] leading-snug">{item.name}</h3>
                      {item.nameLa && (
                        <p className="text-xs font-bold text-[#0400CC] mt-0.5">{item.nameLa}</p>
                      )}
                      <span className="text-xs font-mono text-[#0400CC] block mt-1">/departments/{item.slug}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Feature Chips */}
                    <div className="pt-2 flex flex-wrap gap-1.5 text-[11px]">
                      {boxes.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#0400CC] font-semibold border border-blue-100">
                          <Sparkles className="w-3 h-3" />
                          {boxes.length} Hero Stat Boxes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-400">
                          No Hero Stats
                        </span>
                      )}

                      {focusAreas.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                          <Target className="w-3 h-3" />
                          {focusAreas.length} Focus Areas
                        </span>
                      ) : null}

                      {hasCareerBoxes ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                          <Briefcase className="w-3 h-3" />
                          Career Metrics
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between mt-2 bg-slate-50/50">
                  <Link
                    href={`/departments/${item.slug}`}
                    target="_blank"
                    className="text-xs font-bold text-[#0400CC] hover:underline flex items-center gap-1"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 rounded-lg text-slate-600 hover:text-[#0400CC] hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit Department"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Department"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16 text-slate-400">No departments found. Click "Add Department" to create one.</div>
        )}
      </div>

      {/* Unified Edit/Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? `Edit Department: ${editingItem.name}` : 'Create Department / Major'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Modal Sub-Navigation Tabs */}
          <div className="flex flex-wrap gap-1 border-b border-slate-200 pb-2">
            {[
              { id: 'basic', label: '1. Basic Info & Media', icon: GraduationCap },
              { id: 'description', label: '2. Description', icon: FileText },
              { id: 'heroBoxes', label: '3. Hero Stat Boxes', icon: Sparkles },
              { id: 'focusAreas', label: '4. Focus Areas', icon: Target },
              { id: 'careerOutcomes', label: '5 & 6. Career Outcomes', icon: Briefcase },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setModalTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    modalTab === tab.id
                      ? 'bg-[#0400CC] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl">
            <span className="text-xs font-semibold text-slate-500 pl-2">Editing Language:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLang === 'en'
                    ? 'bg-white text-[#0400CC] shadow-sm'
                    : 'text-slate-600 hover:text-[#00001C]'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => setActiveLang('la')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLang === 'la'
                    ? 'bg-white text-[#0400CC] shadow-sm'
                    : 'text-slate-600 hover:text-[#00001C]'
                }`}
              >
                🇱🇦 ພາສາລາວ (Lao)
                {formData.nameLa && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>
            </div>
          </div>

          {/* TAB 1: BASIC INFO & MEDIA */}
          {modalTab === 'basic' && (
            <div className="space-y-4">
              {activeLang === 'en' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department / Major Name (EN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Department of Information Technology"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ຊື່ພາກວິຊາ / ສາຂາວິຊາ (Lao Title)
                  </label>
                  <input
                    type="text"
                    value={formData.nameLa}
                    onChange={(e) => setFormData({ ...formData, nameLa: e.target.value })}
                    placeholder="ຕົວຢ່າງ: ພາກວິຊາເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. it, ba-economics, communication-arts"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Live at: /departments/{formData.slug || 'slug'}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <ImageUpload
                  label="Department Hero Banner"
                  value={formData.heroImage}
                  onChange={(url) => setFormData({ ...formData, heroImage: url })}
                  placeholder="/images/department_it_desktopview/img_1.jpg"
                  helpText="Wide banner image shown in public department hero section."
                  aspectRatio="wide"
                />

                <ImageUpload
                  label="Featured Major Showcase Card Image"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  placeholder="/images/home_desktopview/img_2.jpg"
                  helpText="Card image displayed in the Homepage Featured Majors section."
                  aspectRatio="video"
                />
              </div>
            </div>
          )}

          {/* TAB 2: DESCRIPTION */}
          {modalTab === 'description' && (
            <div className="space-y-4">
              {activeLang === 'en' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department Overview Description (EN) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the department mission, curriculum philosophy, and learning objectives..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm leading-relaxed"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ເນື້ອຫາຄຳອະທິບາຍ (Lao Overview Description)
                  </label>
                  <textarea
                    rows={5}
                    value={formData.descriptionLa}
                    onChange={(e) => setFormData({ ...formData, descriptionLa: e.target.value })}
                    placeholder="ອະທິບາຍພາລະກິດ ແລະ ຫຼັກສູດຂອງພາກວິຊາເປັນພາສາລາວ..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm leading-relaxed"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HERO STAT BOXES (OPTIONAL) */}
          {modalTab === 'heroBoxes' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <div className="text-xs text-blue-900">
                  <span className="font-bold block">Optional Hero Stat Boxes</span>
                  Appear in Computer Science / IT hero. If left blank, public facing will not show anything.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyPresetCS}
                    className="px-3 py-1.5 rounded-lg bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Apply CS Preset (15+, 8, 95%, 40+)
                  </button>
                  <button
                    type="button"
                    onClick={handleClearHeroBoxes}
                    className="px-3 py-1.5 rounded-lg bg-white text-slate-600 hover:text-red-600 border border-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Box 1 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-xs font-extrabold text-[#0400CC] uppercase tracking-wider block">Box 1 (e.g. 15+ Languages)</span>
                  {activeLang === 'en' ? (
                    <>
                      <input
                        type="text"
                        placeholder="Value (e.g. 15+)"
                        value={formData.heroBox1Value}
                        onChange={(e) => setFormData({ ...formData, heroBox1Value: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Label (e.g. PROGRAMMING LANGUAGES)"
                        value={formData.heroBox1Label}
                        onChange={(e) => setFormData({ ...formData, heroBox1Label: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="ຄ່າ (ຕົວຢ່າງ: 15+)"
                        value={formData.heroBox1ValueLa}
                        onChange={(e) => setFormData({ ...formData, heroBox1ValueLa: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="ຫົວຂໍ້ (ຕົວຢ່າງ: ພາສາການຂຽນໂປຣແກຣມ)"
                        value={formData.heroBox1LabelLa}
                        onChange={(e) => setFormData({ ...formData, heroBox1LabelLa: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  )}
                </div>

                {/* Box 2 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-xs font-extrabold text-[#0400CC] uppercase tracking-wider block">Box 2 (e.g. 8 Labs)</span>
                  {activeLang === 'en' ? (
                    <>
                      <input
                        type="text"
                        placeholder="Value (e.g. 8)"
                        value={formData.heroBox2Value}
                        onChange={(e) => setFormData({ ...formData, heroBox2Value: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Label (e.g. SPECIALIZED LABS)"
                        value={formData.heroBox2Label}
                        onChange={(e) => setFormData({ ...formData, heroBox2Label: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="ຄ່າ (ຕົວຢ່າງ: 8)"
                        value={formData.heroBox2ValueLa}
                        onChange={(e) => setFormData({ ...formData, heroBox2ValueLa: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="ຫົວຂໍ້ (ຕົວຢ່າງ: ຫ້ອງທົດລອງສະເພາະດ້ານ)"
                        value={formData.heroBox2LabelLa}
                        onChange={(e) => setFormData({ ...formData, heroBox2LabelLa: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  )}
                </div>

                {/* Box 3 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-xs font-extrabold text-[#0400CC] uppercase tracking-wider block">Box 3 (e.g. 95% Job Placement)</span>
                  {activeLang === 'en' ? (
                    <>
                      <input
                        type="text"
                        placeholder="Value (e.g. 95%)"
                        value={formData.heroBox3Value}
                        onChange={(e) => setFormData({ ...formData, heroBox3Value: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Label (e.g. JOB PLACEMENT)"
                        value={formData.heroBox3Label}
                        onChange={(e) => setFormData({ ...formData, heroBox3Label: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="ຄ່າ (ຕົວຢ່າງ: 95%)"
                        value={formData.heroBox3ValueLa}
                        onChange={(e) => setFormData({ ...formData, heroBox3ValueLa: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="ຫົວຂໍ້ (ຕົວຢ່າງ: ອັດຕາການໄດ້ຮັບວຽກເຮັດ)"
                        value={formData.heroBox3LabelLa}
                        onChange={(e) => setFormData({ ...formData, heroBox3LabelLa: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  )}
                </div>

                {/* Box 4 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-xs font-extrabold text-[#0400CC] uppercase tracking-wider block">Box 4 (e.g. 40+ Partners)</span>
                  {activeLang === 'en' ? (
                    <>
                      <input
                        type="text"
                        placeholder="Value (e.g. 40+)"
                        value={formData.heroBox4Value}
                        onChange={(e) => setFormData({ ...formData, heroBox4Value: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Label (e.g. INDUSTRY PARTNERS)"
                        value={formData.heroBox4Label}
                        onChange={(e) => setFormData({ ...formData, heroBox4Label: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="ຄ່າ (ຕົວຢ່າງ: 40+)"
                        value={formData.heroBox4ValueLa}
                        onChange={(e) => setFormData({ ...formData, heroBox4ValueLa: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="ຫົວຂໍ້ (ຕົວຢ່າງ: ຄູ່ຮ່ວມງານພາກອຸດສາຫະກຳ)"
                        value={formData.heroBox4LabelLa}
                        onChange={(e) => setFormData({ ...formData, heroBox4LabelLa: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CORE FOCUS AREAS */}
          {modalTab === 'focusAreas' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Enter core focus area tracks (one per line). These will be displayed in the <strong>Core Focus Areas</strong> grid on the public department page.
              </p>

              {activeLang === 'en' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Core Focus Areas (EN - One per line)
                  </label>
                  <textarea
                    rows={8}
                    value={formData.coreFocusAreasText}
                    onChange={(e) => setFormData({ ...formData, coreFocusAreasText: e.target.value })}
                    placeholder={"Software Development\nWeb & Mobile Apps\nCybersecurity\nCloud Computing\nAI & Machine Learning\nData Science\nDevOps\nIoT Systems\nBlockchain\nNetwork Architecture\nUX/UI Design\nDatabase Systems"}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm font-mono leading-relaxed"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ຂົງເຂດຈຸດສຸມຫຼັກ (Lao Core Focus Areas - 1 ຫົວຂໍ້ຕໍ່ແຖວ)
                  </label>
                  <textarea
                    rows={8}
                    value={formData.coreFocusAreasTextLa}
                    onChange={(e) => setFormData({ ...formData, coreFocusAreasTextLa: e.target.value })}
                    placeholder={"ການພັດທະນາຊອບແວ\nແອັບເວັບ ແລະ ມືຖື\nຄວາມປອດໄພທາງໄຊເບີ\nລະບົບຄລາວ\nປັນຍາປະດິດ & ML\nວິທະຍາສາດຂໍ້ມູນ"}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm font-mono leading-relaxed"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CAREER OUTCOMES (OPTIONAL) */}
          {modalTab === 'careerOutcomes' && (
            <div className="space-y-6">
              {/* Field 5: Career Outcome Description */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Field 5: Career Outcome Description {activeLang === 'la' ? '(Lao)' : '(EN)'}
                </label>
                {activeLang === 'en' ? (
                  <textarea
                    rows={3}
                    value={formData.careerOutcomeDesc}
                    onChange={(e) => setFormData({ ...formData, careerOutcomeDesc: e.target.value })}
                    placeholder="e.g. Our graduates are highly sought after by top tech companies worldwide. Here's where your IT degree from SIT can take you."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                ) : (
                  <textarea
                    rows={3}
                    value={formData.careerOutcomeDescLa}
                    onChange={(e) => setFormData({ ...formData, careerOutcomeDescLa: e.target.value })}
                    placeholder="ນັກສຶກສາທີ່ຈົບການສຶກສາຈາກພວກເຮົາແມ່ນເປັນທີ່ຕ້ອງການສູງຈາກບໍລິສັດເຕັກໂນໂລຊີຊັ້ນນຳ..."
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                )}
              </div>

              {/* Field 6: Career Outcomes 4 Metric Boxes */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Field 6: Career Outcomes Boxes (Optional)
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Job placement rate, average starting salary, partner companies, avg time to employment.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearCareerBoxes}
                    className="text-xs text-slate-500 hover:text-red-600 font-semibold cursor-pointer"
                  >
                    Clear Boxes
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Metric 1: Job Placement Rate */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#0400CC]" />
                      1. Job Placement Rate
                    </span>
                    {activeLang === 'en' ? (
                      <input
                        type="text"
                        placeholder="e.g. 95%"
                        value={formData.careerPlacementRate}
                        onChange={(e) => setFormData({ ...formData, careerPlacementRate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="ຕົວຢ່າງ: 95%"
                        value={formData.careerPlacementRateLa}
                        onChange={(e) => setFormData({ ...formData, careerPlacementRateLa: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    )}
                  </div>

                  {/* Metric 2: Average Starting Salary */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      2. Average Starting Salary
                    </span>
                    {activeLang === 'en' ? (
                      <input
                        type="text"
                        placeholder="e.g. $92K or $45,000 / yr"
                        value={formData.careerAvgSalary}
                        onChange={(e) => setFormData({ ...formData, careerAvgSalary: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="ຕົວຢ່າງ: $92K"
                        value={formData.careerAvgSalaryLa}
                        onChange={(e) => setFormData({ ...formData, careerAvgSalaryLa: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    )}
                  </div>

                  {/* Metric 3: Partner Companies */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      3. Partner Companies
                    </span>
                    {activeLang === 'en' ? (
                      <input
                        type="text"
                        placeholder="e.g. 200+ or 40+ Partners"
                        value={formData.careerPartnerCompanies}
                        onChange={(e) => setFormData({ ...formData, careerPartnerCompanies: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="ຕົວຢ່າງ: 200+"
                        value={formData.careerPartnerCompaniesLa}
                        onChange={(e) => setFormData({ ...formData, careerPartnerCompaniesLa: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    )}
                  </div>

                  {/* Metric 4: Avg Time to Employment */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      4. Avg Time to Employment
                    </span>
                    {activeLang === 'en' ? (
                      <input
                        type="text"
                        placeholder="e.g. 3 Months"
                        value={formData.careerTimeToEmployment}
                        onChange={(e) => setFormData({ ...formData, careerTimeToEmployment: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="ຕົວຢ່າງ: 3 ເດືອນ"
                        value={formData.careerTimeToEmploymentLa}
                        onChange={(e) => setFormData({ ...formData, careerTimeToEmploymentLa: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActiveDept"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-[#0400CC]"
              />
              <label htmlFor="isActiveDept" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Active & Published
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                {editingItem ? 'Update Department / Major' : 'Save Department / Major'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
