'use client';

import { useLocalizedContent } from '@/context/useLocalizedContent';

import { useUiTranslation } from '@/context/useUiTranslation';

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
import { getDepartmentHref, getExternalDepartmentUrl } from '@/lib/department-links';

interface BoxStatForm {
  value: string;
  label: string;
  valueLa?: string;
  valueZh?: string;
  labelLa?: string;
  labelZh?: string;
}

export default function AdminDepartmentsPage() {
  const localize = useLocalizedContent();
  const tr = useUiTranslation();
  const [items, setItems] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Department | null>(null);
  const [modalTab, setModalTab] = useState<
    'basic' | 'description' | 'heroBoxes' | 'focusAreas' | 'careerOutcomes'
  >('basic');
  const [activeLang, setActiveLang] = useState<'en' | 'la' | 'zh'>('en');
  const [isExternal, setIsExternal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameLa: '',
    nameZh: '',
    slug: '',
    externalUrl: '',
    description: '',
    descriptionLa: '',
    descriptionZh: '',
    heroImage: '',
    imageUrl: '',
    order: 1,
    isActive: true,

    // Field 3: Hero Stat Boxes (4 items)
    heroBox1Value: '',
    heroBox1Label: '',
    heroBox1ValueLa: '',
    heroBox1ValueZh: '',
    heroBox1LabelLa: '',
    heroBox1LabelZh: '',

    heroBox2Value: '',
    heroBox2Label: '',
    heroBox2ValueLa: '',
    heroBox2ValueZh: '',
    heroBox2LabelLa: '',
    heroBox2LabelZh: '',

    heroBox3Value: '',
    heroBox3Label: '',
    heroBox3ValueLa: '',
    heroBox3ValueZh: '',
    heroBox3LabelLa: '',
    heroBox3LabelZh: '',

    heroBox4Value: '',
    heroBox4Label: '',
    heroBox4ValueLa: '',
    heroBox4ValueZh: '',
    heroBox4LabelLa: '',
    heroBox4LabelZh: '',

    // Field 4: Core Focus Areas (newline or comma-separated)
    coreFocusAreasText: '',
    coreFocusAreasTextLa: '',
    coreFocusAreasTextZh: '',

    // Field 5: Career Outcome Description
    careerOutcomeDesc: '',
    careerOutcomeDescLa: '',
    careerOutcomeDescZh: '',

    // Field 6: Career Outcomes 4 Boxes
    careerPlacementRate: '',
    careerPlacementRateLa: '',
    careerPlacementRateZh: '',
    careerAvgSalary: '',
    careerAvgSalaryLa: '',
    careerAvgSalaryZh: '',
    careerPartnerCompanies: '',
    careerPartnerCompaniesLa: '',
    careerPartnerCompaniesZh: '',
    careerTimeToEmployment: '',
    careerTimeToEmploymentLa: '',
    careerTimeToEmploymentZh: '',
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
    setIsExternal(false);
    setEditingItem(null);
    setModalTab('basic');
    setActiveLang('en');
    setFormData({
      name: '',
      nameLa: '',
      nameZh: '',
      slug: '',
      externalUrl: '',
      description: '',
      descriptionLa: '',
      descriptionZh: '',
      heroImage: '',
      imageUrl: '',
      order: items.length + 1,
      isActive: true,

      heroBox1Value: '',
      heroBox1Label: '',
      heroBox1ValueLa: '',
      heroBox1ValueZh: '',
      heroBox1LabelLa: '',
      heroBox1LabelZh: '',

      heroBox2Value: '',
      heroBox2Label: '',
      heroBox2ValueLa: '',
      heroBox2ValueZh: '',
      heroBox2LabelLa: '',
      heroBox2LabelZh: '',

      heroBox3Value: '',
      heroBox3Label: '',
      heroBox3ValueLa: '',
      heroBox3ValueZh: '',
      heroBox3LabelLa: '',
      heroBox3LabelZh: '',

      heroBox4Value: '',
      heroBox4Label: '',
      heroBox4ValueLa: '',
      heroBox4ValueZh: '',
      heroBox4LabelLa: '',
      heroBox4LabelZh: '',

      coreFocusAreasText: '',
      coreFocusAreasTextLa: '',
      coreFocusAreasTextZh: '',

      careerOutcomeDesc: '',
      careerOutcomeDescLa: '',
      careerOutcomeDescZh: '',

      careerPlacementRate: '',
      careerPlacementRateLa: '',
      careerPlacementRateZh: '',
      careerAvgSalary: '',
      careerAvgSalaryLa: '',
      careerAvgSalaryZh: '',
      careerPartnerCompanies: '',
      careerPartnerCompaniesLa: '',
      careerPartnerCompaniesZh: '',
      careerTimeToEmployment: '',
      careerTimeToEmploymentLa: '',
      careerTimeToEmploymentZh: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Department) => {
    setIsExternal(Boolean(item.externalUrl));
    setEditingItem(item);
    setModalTab('basic');
    setActiveLang('en');

    // Parse Hero Box-descriptions
    const boxesEn: BoxStatItem[] = parseJsonArray(item.boxDescriptions);
    const boxesLa: BoxStatItem[] = parseJsonArray(item.boxDescriptionsLa);
    const boxesZh: BoxStatItem[] = parseJsonArray(item.boxDescriptionsZh);

    // Parse Core Focus Areas
    const focusEn: string[] = parseJsonArray(item.coreFocusAreas);
    const focusLa: string[] = parseJsonArray(item.coreFocusAreasLa);
    const focusZh: string[] = parseJsonArray(item.coreFocusAreasZh);

    setFormData({
      name: item.name || item.title || '',
      nameLa: item.nameLa || item.titleLa || '',
      nameZh: item.nameZh || item.titleZh || '',
      slug: item.slug || '',
      externalUrl: item.externalUrl || '',
      description: item.description || '',
      descriptionLa: item.descriptionLa || '',
      descriptionZh: item.descriptionZh || '',
      heroImage: item.heroImage || '',
      imageUrl: item.imageUrl || item.image || '',
      order: item.order !== undefined ? item.order : 1,
      isActive: item.isActive !== undefined ? item.isActive : true,

      heroBox1Value: boxesEn[0]?.value || '',
      heroBox1Label: boxesEn[0]?.label || '',
      heroBox1ValueLa: boxesLa[0]?.value || '',
      heroBox1ValueZh: boxesZh[0]?.value || '',
      heroBox1LabelLa: boxesLa[0]?.label || '',
      heroBox1LabelZh: boxesZh[0]?.label || '',

      heroBox2Value: boxesEn[1]?.value || '',
      heroBox2Label: boxesEn[1]?.label || '',
      heroBox2ValueLa: boxesLa[1]?.value || '',
      heroBox2ValueZh: boxesZh[1]?.value || '',
      heroBox2LabelLa: boxesLa[1]?.label || '',
      heroBox2LabelZh: boxesZh[1]?.label || '',

      heroBox3Value: boxesEn[2]?.value || '',
      heroBox3Label: boxesEn[2]?.label || '',
      heroBox3ValueLa: boxesLa[2]?.value || '',
      heroBox3ValueZh: boxesZh[2]?.value || '',
      heroBox3LabelLa: boxesLa[2]?.label || '',
      heroBox3LabelZh: boxesZh[2]?.label || '',

      heroBox4Value: boxesEn[3]?.value || '',
      heroBox4Label: boxesEn[3]?.label || '',
      heroBox4ValueLa: boxesLa[3]?.value || '',
      heroBox4ValueZh: boxesZh[3]?.value || '',
      heroBox4LabelLa: boxesLa[3]?.label || '',
      heroBox4LabelZh: boxesZh[3]?.label || '',

      coreFocusAreasText: focusEn.join('\n'),
      coreFocusAreasTextLa: focusLa.join('\n'),
      coreFocusAreasTextZh: focusZh.join('\n'),

      careerOutcomeDesc: item.careerOutcomeDesc || '',
      careerOutcomeDescLa: item.careerOutcomeDescLa || '',
      careerOutcomeDescZh: item.careerOutcomeDescZh || '',

      careerPlacementRate: item.careerPlacementRate || '',
      careerPlacementRateLa: item.careerPlacementRateLa || '',
      careerPlacementRateZh: item.careerPlacementRateZh || '',
      careerAvgSalary: item.careerAvgSalary || '',
      careerAvgSalaryLa: item.careerAvgSalaryLa || '',
      careerAvgSalaryZh: item.careerAvgSalaryZh || '',
      careerPartnerCompanies: item.careerPartnerCompanies || '',
      careerPartnerCompaniesLa: item.careerPartnerCompaniesLa || '',
      careerPartnerCompaniesZh: item.careerPartnerCompaniesZh || '',
      careerTimeToEmployment: item.careerTimeToEmployment || '',
      careerTimeToEmploymentLa: item.careerTimeToEmploymentLa || '',
      careerTimeToEmploymentZh: item.careerTimeToEmploymentZh || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        tr(
          'Are you sure you want to delete this department / major? All related programs and settings will be affected.',
        ),
      )
    )
      return;
    try {
      await api.deleteDepartment(id);
      loadItems();
    } catch (e) {
      alert(tr('Failed to delete department'));
    }
  };

  const handleApplyPresetCS = () => {
    setFormData((prev) => ({
      ...prev,
      heroBox1Value: '15+',
      heroBox1Label: 'PROGRAMMING LANGUAGES',
      heroBox1ValueLa: '15+',
      heroBox1ValueZh: '15+',
      heroBox1LabelLa: 'ພາສາການຂຽນໂປຣແກຣມ',
      heroBox1LabelZh: '',

      heroBox2Value: '8',
      heroBox2Label: 'SPECIALIZED LABS',
      heroBox2ValueLa: '8',
      heroBox2ValueZh: '8',
      heroBox2LabelLa: 'ຫ້ອງທົດລອງສະເພາະດ້ານ',
      heroBox2LabelZh: '',

      heroBox3Value: '95%',
      heroBox3Label: 'JOB PLACEMENT',
      heroBox3ValueLa: '95%',
      heroBox3ValueZh: '95%',
      heroBox3LabelLa: 'ອັດຕາການໄດ້ຮັບວຽກເຮັດ',
      heroBox3LabelZh: '',

      heroBox4Value: '40+',
      heroBox4Label: 'INDUSTRY PARTNERS',
      heroBox4ValueLa: '40+',
      heroBox4ValueZh: '40+',
      heroBox4LabelLa: 'ຄູ່ຮ່ວມງານພາກອຸດສາຫະກຳ',
      heroBox4LabelZh: '',
    }));
  };

  const handleClearHeroBoxes = () => {
    setFormData((prev) => ({
      ...prev,
      heroBox1Value: '',
      heroBox1Label: '',
      heroBox1ValueLa: '',
      heroBox1ValueZh: '',
      heroBox1LabelLa: '',
      heroBox1LabelZh: '',

      heroBox2Value: '',
      heroBox2Label: '',
      heroBox2ValueLa: '',
      heroBox2ValueZh: '',
      heroBox2LabelLa: '',
      heroBox2LabelZh: '',

      heroBox3Value: '',
      heroBox3Label: '',
      heroBox3ValueLa: '',
      heroBox3ValueZh: '',
      heroBox3LabelLa: '',
      heroBox3LabelZh: '',

      heroBox4Value: '',
      heroBox4Label: '',
      heroBox4ValueLa: '',
      heroBox4ValueZh: '',
      heroBox4LabelLa: '',
      heroBox4LabelZh: '',
    }));
  };

  const handleClearCareerBoxes = () => {
    setFormData((prev) => ({
      ...prev,
      careerPlacementRate: '',
      careerPlacementRateLa: '',
      careerPlacementRateZh: '',
      careerAvgSalary: '',
      careerAvgSalaryLa: '',
      careerAvgSalaryZh: '',
      careerPartnerCompanies: '',
      careerPartnerCompaniesLa: '',
      careerPartnerCompaniesZh: '',
      careerTimeToEmployment: '',
      careerTimeToEmploymentLa: '',
      careerTimeToEmploymentZh: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const externalUrl = isExternal ? getExternalDepartmentUrl(formData.externalUrl) : null;
    if (isExternal && !externalUrl) {
      alert(
        'Enter a valid external website URL starting with https:// or http://, without credentials.',
      );
      return;
    }
    if (!formData.name.trim() || !formData.slug.trim()) {
      setModalTab('basic');
      setActiveLang('en');
      alert(tr('Enter a department name and URL slug.'));
      return;
    }

    // Assemble Hero Box-descriptions array if any value exists
    const hasHeroBoxesEn =
      formData.heroBox1Value ||
      formData.heroBox2Value ||
      formData.heroBox3Value ||
      formData.heroBox4Value;
    const heroBoxesEn: BoxStatItem[] = [];
    if (formData.heroBox1Value || formData.heroBox1Label)
      heroBoxesEn.push({ value: formData.heroBox1Value, label: formData.heroBox1Label });
    if (formData.heroBox2Value || formData.heroBox2Label)
      heroBoxesEn.push({ value: formData.heroBox2Value, label: formData.heroBox2Label });
    if (formData.heroBox3Value || formData.heroBox3Label)
      heroBoxesEn.push({ value: formData.heroBox3Value, label: formData.heroBox3Label });
    if (formData.heroBox4Value || formData.heroBox4Label)
      heroBoxesEn.push({ value: formData.heroBox4Value, label: formData.heroBox4Label });

    const heroBoxesLa: BoxStatItem[] = [];
    const heroBoxesZh: BoxStatItem[] = [];
    if (formData.heroBox1ValueLa || formData.heroBox1LabelLa)
      heroBoxesLa.push({ value: formData.heroBox1ValueLa, label: formData.heroBox1LabelLa });
    if (formData.heroBox1ValueZh || formData.heroBox1LabelZh)
      heroBoxesZh.push({ value: formData.heroBox1ValueZh, label: formData.heroBox1LabelZh });
    if (formData.heroBox2ValueLa || formData.heroBox2LabelLa)
      heroBoxesLa.push({ value: formData.heroBox2ValueLa, label: formData.heroBox2LabelLa });
    if (formData.heroBox2ValueZh || formData.heroBox2LabelZh)
      heroBoxesZh.push({ value: formData.heroBox2ValueZh, label: formData.heroBox2LabelZh });
    if (formData.heroBox3ValueLa || formData.heroBox3LabelLa)
      heroBoxesLa.push({ value: formData.heroBox3ValueLa, label: formData.heroBox3LabelLa });
    if (formData.heroBox3ValueZh || formData.heroBox3LabelZh)
      heroBoxesZh.push({ value: formData.heroBox3ValueZh, label: formData.heroBox3LabelZh });
    if (formData.heroBox4ValueLa || formData.heroBox4LabelLa)
      heroBoxesLa.push({ value: formData.heroBox4ValueLa, label: formData.heroBox4LabelLa });
    if (formData.heroBox4ValueZh || formData.heroBox4LabelZh)
      heroBoxesZh.push({ value: formData.heroBox4ValueZh, label: formData.heroBox4LabelZh });

    // Assemble Focus Areas
    const focusAreasEn = formData.coreFocusAreasText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const focusAreasLa = formData.coreFocusAreasTextLa
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const focusAreasZh = formData.coreFocusAreasTextZh
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: any = {
      name: formData.name,
      nameLa: formData.nameLa || null,
      nameZh: formData.nameZh || null,
      slug: formData.slug.trim().toLowerCase(),
      externalUrl,
      description: formData.description,
      descriptionLa: formData.descriptionLa || null,
      descriptionZh: formData.descriptionZh || null,
      heroImage: formData.heroImage || null,
      imageUrl: formData.imageUrl || null,
      order: Number(formData.order) || 0,
      isActive: formData.isActive,

      boxDescriptions: heroBoxesEn.length > 0 ? JSON.stringify(heroBoxesEn) : null,
      boxDescriptionsLa: heroBoxesLa.length > 0 ? JSON.stringify(heroBoxesLa) : null,
      boxDescriptionsZh: heroBoxesZh.length > 0 ? JSON.stringify(heroBoxesZh) : null,

      coreFocusAreas: focusAreasEn.length > 0 ? JSON.stringify(focusAreasEn) : null,
      coreFocusAreasLa: focusAreasLa.length > 0 ? JSON.stringify(focusAreasLa) : null,
      coreFocusAreasZh: focusAreasZh.length > 0 ? JSON.stringify(focusAreasZh) : null,

      careerOutcomeDesc: formData.careerOutcomeDesc || null,
      careerOutcomeDescLa: formData.careerOutcomeDescLa || null,
      careerOutcomeDescZh: formData.careerOutcomeDescZh || null,

      careerPlacementRate: formData.careerPlacementRate || null,
      careerPlacementRateLa: formData.careerPlacementRateLa || null,
      careerPlacementRateZh: formData.careerPlacementRateZh || null,
      careerAvgSalary: formData.careerAvgSalary || null,
      careerAvgSalaryLa: formData.careerAvgSalaryLa || null,
      careerAvgSalaryZh: formData.careerAvgSalaryZh || null,
      careerPartnerCompanies: formData.careerPartnerCompanies || null,
      careerPartnerCompaniesLa: formData.careerPartnerCompaniesLa || null,
      careerPartnerCompaniesZh: formData.careerPartnerCompaniesZh || null,
      careerTimeToEmployment: formData.careerTimeToEmployment || null,
      careerTimeToEmploymentLa: formData.careerTimeToEmploymentLa || null,
      careerTimeToEmploymentZh: formData.careerTimeToEmploymentZh || null,
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
      alert(tr('Failed to save department / major'));
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-[#0400CC]" />
            {tr('Departments & Featured Majors')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {tr(
              'Manage academic departments, hero banners, stats boxes, focus areas, and career outcomes for all SIT majors in one unified location.',
            )}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#0400CC] hover:bg-[#030099] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {tr('Add Department / Major')}
        </button>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            {tr('Loading departments & majors...')}
          </div>
        ) : items.length > 0 ? (
          items.map((item, idx) => {
            const boxes: BoxStatItem[] = parseJsonArray(item.boxDescriptions);
            const focusAreas: string[] = parseJsonArray(item.coreFocusAreas);
            const hasCareerBoxes =
              item.careerPlacementRate ||
              item.careerAvgSalary ||
              item.careerPartnerCompanies ||
              item.careerTimeToEmployment;

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
                        alt={tr(localize(item, 'name'))}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        {tr('No Image')}
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 bg-[#00001C]/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {tr('Order: ')}
                      {item.order}
                    </span>
                    {item.isActive === false && (
                      <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {tr('Inactive')}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-[#00001C] leading-snug">
                        {tr(localize(item, 'name'))}
                      </h3>
                      {item.nameLa && (
                        <p className="text-xs font-bold text-[#0400CC] mt-0.5">{tr(item.nameLa)}</p>
                      )}
                      <span className="text-xs font-mono text-[#0400CC] block mt-1 break-all">
                        {tr(getDepartmentHref(item))}
                      </span>
                      {item.externalUrl && (
                        <span className="text-xs font-semibold text-emerald-700">
                          {tr('External Website')}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {tr(localize(item, 'description'))}
                    </p>

                    {/* Feature Chips */}
                    <div className="pt-2 flex flex-wrap gap-1.5 text-[11px]">
                      {boxes.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#0400CC] font-semibold border border-blue-100">
                          <Sparkles className="w-3 h-3" />
                          {boxes.length}
                          {tr(' Hero Stat Boxes')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-400">
                          {tr('No Hero Stats')}
                        </span>
                      )}

                      {focusAreas.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                          <Target className="w-3 h-3" />
                          {focusAreas.length}
                          {tr(' Focus Areas')}
                        </span>
                      ) : null}

                      {hasCareerBoxes ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                          <Briefcase className="w-3 h-3" />
                          {tr('Career Metrics')}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between mt-2 bg-slate-50/50">
                  <Link
                    href={getDepartmentHref(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#0400CC] hover:underline flex items-center gap-1"
                  >
                    <span>
                      {tr(item.externalUrl ? tr('Visit External Website') : tr('View Public Page'))}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      aria-label={tr('Edit')}
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 rounded-lg text-slate-600 hover:text-[#0400CC] hover:bg-blue-50 transition-colors cursor-pointer"
                      title={tr('Edit Department')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title={tr('Delete Department')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16 text-slate-400">
            {tr('No departments found. Click "Add Department" to create one.')}
          </div>
        )}
      </div>

      {/* Unified Edit/Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={tr(
          editingItem ? `Edit Department: ${editingItem.name}` : 'Create Department / Major',
        )}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3 rounded-xl border border-slate-200 p-4">
            <label
              htmlFor="department-link-destination"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              {tr('Link destination')}
            </label>
            <select
              id="department-link-destination"
              value={isExternal ? 'external' : 'internal'}
              onChange={(e) => setIsExternal(e.target.value === 'external')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
            >
              <option value="internal">{tr('Department page on this website')}</option>
              <option value="external">{tr('External website')}</option>
            </select>
            {isExternal && (
              <div className="space-y-2">
                <label
                  htmlFor="department-external-url"
                  className="block text-xs font-bold text-slate-700"
                >
                  {tr('External website URL ')}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="department-external-url"
                  type="url"
                  required
                  value={formData.externalUrl}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
                />
                <p className="text-xs text-slate-500">
                  {tr(
                    'Clicking this department in navigation or department cards opens this website in the same tab. Page content is optional.',
                  )}
                </p>
              </div>
            )}
          </div>
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
                  {tr(tab.label)}
                </button>
              );
            })}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl">
            <span className="text-xs font-semibold text-slate-500 pl-2">
              {tr('Editing Language:')}
            </span>
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
                {tr('🇬🇧 English')}
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
                {tr('🇱🇦 ພາສາລາວ (Lao)')}
                {formData.nameLa && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>
              <button
                type="button"
                onClick={() => setActiveLang('zh')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLang === 'zh'
                    ? 'bg-white text-[#0400CC] shadow-sm'
                    : 'text-slate-600 hover:text-[#00001C]'
                }`}
              >
                {tr('中文 (Chinese)')}
                {formData.nameZh && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>
            </div>
          </div>

          {/* TAB 1: BASIC INFO & MEDIA */}
          {modalTab === 'basic' && (
            <div className="space-y-4">
              {activeLang === 'zh' ? (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Chinese Title')}
                  </label>
                  <input
                    type="text"
                    value={formData.nameZh}
                    onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                    placeholder="请输入中文名称"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              ) : activeLang === 'en' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Department / Major Name (EN) ')}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={tr('e.g. Department of Information Technology')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('ຊື່ພາກວິຊາ / ສາຂາວິຊາ (Lao Title)')}
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
                    {tr('URL Slug ')}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder={tr('e.g. it, ba-economics, communication-arts')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block break-all">
                    {tr(
                      isExternal
                        ? `Links to: ${formData.externalUrl || tr('Enter a website URL above')}`
                        : `Live at: /departments/${formData.slug || 'slug'}`,
                    )}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Display Order')}
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <ImageUpload
                  label={tr('Department Hero Banner')}
                  value={formData.heroImage}
                  onChange={(url) => setFormData({ ...formData, heroImage: url })}
                  placeholder="/images/department_it_desktopview/img_1.jpg"
                  helpText={tr('Wide banner image shown in public department hero section.')}
                  aspectRatio="wide"
                />

                <ImageUpload
                  label={tr('Featured Major Showcase Card Image')}
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  placeholder="/images/home_desktopview/img_2.jpg"
                  helpText={tr('Card image displayed in the Homepage Featured Majors section.')}
                  aspectRatio="video"
                />
              </div>
            </div>
          )}

          {/* TAB 2: DESCRIPTION */}
          {modalTab === 'description' && (
            <div className="space-y-4">
              {activeLang === 'zh' ? (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Chinese Overview Description')}
                  </label>
                  <textarea
                    rows={5}
                    value={formData.descriptionZh}
                    onChange={(e) => setFormData({ ...formData, descriptionZh: e.target.value })}
                    placeholder="请输入中文说明"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm leading-relaxed"
                  />
                </div>
              ) : activeLang === 'en' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Department Overview Description (EN) ')}
                    {!isExternal && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    required={!isExternal}
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={tr(
                      'Describe the department mission, curriculum philosophy, and learning objectives...',
                    )}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm leading-relaxed"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('ເນື້ອຫາຄຳອະທິບາຍ (Lao Overview Description)')}
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
                  <span className="font-bold block">{tr('Optional Hero Stat Boxes')}</span>
                  {tr(
                    'Appear in Computer Science / IT hero. If left blank, public facing will not show anything.',
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyPresetCS}
                    className="px-3 py-1.5 rounded-lg bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {tr('Apply CS Preset (15+, 8, 95%, 40+)')}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearHeroBoxes}
                    className="px-3 py-1.5 rounded-lg bg-white text-slate-600 hover:text-red-600 border border-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    {tr('Clear All')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Box 1 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-xs font-extrabold text-[#0400CC] uppercase tracking-wider block">
                    {tr('Box 1 (e.g. 15+ Languages)')}
                  </span>
                  {activeLang === 'zh' ? (
                    <>
                      <input
                        type="text"
                        placeholder="请输入中文统计数值"
                        value={formData.heroBox1ValueZh}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox1ValueZh: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="请输入中文统计标签"
                        value={formData.heroBox1LabelZh}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox1LabelZh: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  ) : activeLang === 'en' ? (
                    <>
                      <input
                        type="text"
                        placeholder={tr('Value (e.g. 15+)')}
                        value={formData.heroBox1Value}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox1Value: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder={tr('Label (e.g. PROGRAMMING LANGUAGES)')}
                        value={formData.heroBox1Label}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox1Label: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="ຄ່າ (ຕົວຢ່າງ: 15+)"
                        value={formData.heroBox1ValueLa}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox1ValueLa: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="ຫົວຂໍ້ (ຕົວຢ່າງ: ພາສາການຂຽນໂປຣແກຣມ)"
                        value={formData.heroBox1LabelLa}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox1LabelLa: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  )}
                </div>

                {/* Box 2 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-xs font-extrabold text-[#0400CC] uppercase tracking-wider block">
                    {tr('Box 2 (e.g. 8 Labs)')}
                  </span>
                  {activeLang === 'zh' ? (
                    <>
                      <input
                        type="text"
                        placeholder="请输入中文统计数值"
                        value={formData.heroBox2ValueZh}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox2ValueZh: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="请输入中文统计标签"
                        value={formData.heroBox2LabelZh}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox2LabelZh: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  ) : activeLang === 'en' ? (
                    <>
                      <input
                        type="text"
                        placeholder={tr('Value (e.g. 8)')}
                        value={formData.heroBox2Value}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox2Value: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder={tr('Label (e.g. SPECIALIZED LABS)')}
                        value={formData.heroBox2Label}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox2Label: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="ຄ່າ (ຕົວຢ່າງ: 8)"
                        value={formData.heroBox2ValueLa}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox2ValueLa: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="ຫົວຂໍ້ (ຕົວຢ່າງ: ຫ້ອງທົດລອງສະເພາະດ້ານ)"
                        value={formData.heroBox2LabelLa}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox2LabelLa: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  )}
                </div>

                {/* Box 3 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-xs font-extrabold text-[#0400CC] uppercase tracking-wider block">
                    {tr('Box 3 (e.g. 95% Job Placement)')}
                  </span>
                  {activeLang === 'zh' ? (
                    <>
                      <input
                        type="text"
                        placeholder="请输入中文统计数值"
                        value={formData.heroBox3ValueZh}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox3ValueZh: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="请输入中文统计标签"
                        value={formData.heroBox3LabelZh}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox3LabelZh: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  ) : activeLang === 'en' ? (
                    <>
                      <input
                        type="text"
                        placeholder={tr('Value (e.g. 95%)')}
                        value={formData.heroBox3Value}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox3Value: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder={tr('Label (e.g. JOB PLACEMENT)')}
                        value={formData.heroBox3Label}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox3Label: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="ຄ່າ (ຕົວຢ່າງ: 95%)"
                        value={formData.heroBox3ValueLa}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox3ValueLa: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="ຫົວຂໍ້ (ຕົວຢ່າງ: ອັດຕາການໄດ້ຮັບວຽກເຮັດ)"
                        value={formData.heroBox3LabelLa}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox3LabelLa: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  )}
                </div>

                {/* Box 4 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-xs font-extrabold text-[#0400CC] uppercase tracking-wider block">
                    {tr('Box 4 (e.g. 40+ Partners)')}
                  </span>
                  {activeLang === 'zh' ? (
                    <>
                      <input
                        type="text"
                        placeholder="请输入中文统计数值"
                        value={formData.heroBox4ValueZh}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox4ValueZh: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="请输入中文统计标签"
                        value={formData.heroBox4LabelZh}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox4LabelZh: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  ) : activeLang === 'en' ? (
                    <>
                      <input
                        type="text"
                        placeholder={tr('Value (e.g. 40+)')}
                        value={formData.heroBox4Value}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox4Value: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder={tr('Label (e.g. INDUSTRY PARTNERS)')}
                        value={formData.heroBox4Label}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox4Label: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="ຄ່າ (ຕົວຢ່າງ: 40+)"
                        value={formData.heroBox4ValueLa}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox4ValueLa: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="ຫົວຂໍ້ (ຕົວຢ່າງ: ຄູ່ຮ່ວມງານພາກອຸດສາຫະກຳ)"
                        value={formData.heroBox4LabelLa}
                        onChange={(e) =>
                          setFormData({ ...formData, heroBox4LabelLa: e.target.value })
                        }
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
                {tr('Enter core focus area tracks (one per line). These will be displayed in the ')}
                <strong>{tr('Core Focus Areas')}</strong>
                {tr(' grid on the public department page.')}
              </p>

              {activeLang === 'zh' ? (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Chinese Core Focus Areas (one per line)')}
                  </label>
                  <textarea
                    rows={8}
                    value={formData.coreFocusAreasTextZh}
                    onChange={(e) =>
                      setFormData({ ...formData, coreFocusAreasTextZh: e.target.value })
                    }
                    placeholder="请输入中文重点领域，每行一项"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm font-mono leading-relaxed"
                  />
                </div>
              ) : activeLang === 'en' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {tr('Core Focus Areas (EN - One per line)')}
                  </label>
                  <textarea
                    rows={8}
                    value={formData.coreFocusAreasText}
                    onChange={(e) =>
                      setFormData({ ...formData, coreFocusAreasText: e.target.value })
                    }
                    placeholder={tr(
                      'Software Development\nWeb & Mobile Apps\nCybersecurity\nCloud Computing\nAI & Machine Learning\nData Science\nDevOps\nIoT Systems\nBlockchain\nNetwork Architecture\nUX/UI Design\nDatabase Systems',
                    )}
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
                    onChange={(e) =>
                      setFormData({ ...formData, coreFocusAreasTextLa: e.target.value })
                    }
                    placeholder={tr(
                      'ການພັດທະນາຊອບແວ\nແອັບເວັບ ແລະ ມືຖື\nຄວາມປອດໄພທາງໄຊເບີ\nລະບົບຄລາວ\nປັນຍາປະດິດ & ML\nວິທະຍາສາດຂໍ້ມູນ',
                    )}
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
                  {tr('Field 5: Career Outcome Description ')}
                  {tr(
                    activeLang === 'zh' ? '(中文)' : activeLang === 'la' ? tr('(Lao)') : tr('(EN)'),
                  )}
                </label>
                {activeLang === 'zh' ? (
                  <textarea
                    rows={3}
                    value={formData.careerOutcomeDescZh}
                    onChange={(e) =>
                      setFormData({ ...formData, careerOutcomeDescZh: e.target.value })
                    }
                    placeholder="请输入中文就业成果说明"
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                ) : activeLang === 'en' ? (
                  <textarea
                    rows={3}
                    value={formData.careerOutcomeDesc}
                    onChange={(e) =>
                      setFormData({ ...formData, careerOutcomeDesc: e.target.value })
                    }
                    placeholder={tr(
                      "e.g. Our graduates are highly sought after by top tech companies worldwide. Here's where your IT degree from SIT can take you.",
                    )}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                ) : (
                  <textarea
                    rows={3}
                    value={formData.careerOutcomeDescLa}
                    onChange={(e) =>
                      setFormData({ ...formData, careerOutcomeDescLa: e.target.value })
                    }
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
                      {tr('Field 6: Career Outcomes Boxes (Optional)')}
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {tr(
                        'Job placement rate, average starting salary, partner companies, avg time to employment.',
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearCareerBoxes}
                    className="text-xs text-slate-500 hover:text-red-600 font-semibold cursor-pointer"
                  >
                    {tr('Clear Boxes')}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Metric 1: Job Placement Rate */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#0400CC]" />
                      {tr('1. Job Placement Rate')}
                    </span>
                    {activeLang === 'zh' ? (
                      <input
                        type="text"
                        placeholder="请输入中文统计数值"
                        value={formData.careerPlacementRateZh}
                        onChange={(e) =>
                          setFormData({ ...formData, careerPlacementRateZh: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    ) : activeLang === 'en' ? (
                      <input
                        type="text"
                        placeholder={tr('e.g. 95%')}
                        value={formData.careerPlacementRate}
                        onChange={(e) =>
                          setFormData({ ...formData, careerPlacementRate: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="ຕົວຢ່າງ: 95%"
                        value={formData.careerPlacementRateLa}
                        onChange={(e) =>
                          setFormData({ ...formData, careerPlacementRateLa: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    )}
                  </div>

                  {/* Metric 2: Average Starting Salary */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      {tr('2. Average Starting Salary')}
                    </span>
                    {activeLang === 'zh' ? (
                      <input
                        type="text"
                        placeholder="请输入中文统计数值"
                        value={formData.careerAvgSalaryZh}
                        onChange={(e) =>
                          setFormData({ ...formData, careerAvgSalaryZh: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    ) : activeLang === 'en' ? (
                      <input
                        type="text"
                        placeholder={tr('e.g. $92K or $45,000 / yr')}
                        value={formData.careerAvgSalary}
                        onChange={(e) =>
                          setFormData({ ...formData, careerAvgSalary: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="ຕົວຢ່າງ: $92K"
                        value={formData.careerAvgSalaryLa}
                        onChange={(e) =>
                          setFormData({ ...formData, careerAvgSalaryLa: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    )}
                  </div>

                  {/* Metric 3: Partner Companies */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      {tr('3. Partner Companies')}
                    </span>
                    {activeLang === 'zh' ? (
                      <input
                        type="text"
                        placeholder="请输入中文统计数值"
                        value={formData.careerPartnerCompaniesZh}
                        onChange={(e) =>
                          setFormData({ ...formData, careerPartnerCompaniesZh: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    ) : activeLang === 'en' ? (
                      <input
                        type="text"
                        placeholder={tr('e.g. 200+ or 40+ Partners')}
                        value={formData.careerPartnerCompanies}
                        onChange={(e) =>
                          setFormData({ ...formData, careerPartnerCompanies: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="ຕົວຢ່າງ: 200+"
                        value={formData.careerPartnerCompaniesLa}
                        onChange={(e) =>
                          setFormData({ ...formData, careerPartnerCompaniesLa: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    )}
                  </div>

                  {/* Metric 4: Avg Time to Employment */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      {tr('4. Avg Time to Employment')}
                    </span>
                    {activeLang === 'zh' ? (
                      <input
                        type="text"
                        placeholder="请输入中文统计数值"
                        value={formData.careerTimeToEmploymentZh}
                        onChange={(e) =>
                          setFormData({ ...formData, careerTimeToEmploymentZh: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    ) : activeLang === 'en' ? (
                      <input
                        type="text"
                        placeholder={tr('e.g. 3 Months')}
                        value={formData.careerTimeToEmployment}
                        onChange={(e) =>
                          setFormData({ ...formData, careerTimeToEmployment: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="ຕົວຢ່າງ: 3 ເດືອນ"
                        value={formData.careerTimeToEmploymentLa}
                        onChange={(e) =>
                          setFormData({ ...formData, careerTimeToEmploymentLa: e.target.value })
                        }
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
              <label
                htmlFor="isActiveDept"
                className="text-xs font-semibold text-slate-700 cursor-pointer"
              >
                {tr('Active & Published')}
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                {tr('Cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                {tr(editingItem ? tr('Update Department / Major') : tr('Save Department / Major'))}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
