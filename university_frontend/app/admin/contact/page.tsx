'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  ContactLocation,
  ContactPhone,
  ContactEmail,
  ContactOfficeHour,
  ContactInfo,
} from '@/lib/api/types';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowUp,
  ArrowDown,
  Globe,
  ExternalLink,
  Info,
  Building2,
  Headphones,
  Navigation,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function AdminContactPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'locations' | 'map' | 'phones' | 'emails' | 'hours'>('locations');
  const [previewModal, setPreviewModal] = useState(false);
  const [previewLang, setPreviewLang] = useState<'en' | 'la'>('en');

  // State data
  const [locations, setLocations] = useState<ContactLocation[]>([]);
  const [phones, setPhones] = useState<ContactPhone[]>([]);
  const [emails, setEmails] = useState<ContactEmail[]>([]);
  const [officeHours, setOfficeHours] = useState<ContactOfficeHour[]>([]);
  const [mapEmbedUrl, setMapEmbedUrl] = useState<string>('');
  const [mapInput, setMapInput] = useState<string>('');

  // Modals for CRUD
  const [locationModal, setLocationModal] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [locationForm, setLocationForm] = useState<ContactLocation>({
    id: '',
    title: '',
    titleLa: '',
    address: '',
    addressLa: '',
    isPrimary: false,
    notes: '',
    notesLa: '',
  });
  const [locationLangTab, setLocationLangTab] = useState<'en' | 'la'>('en');

  const [phoneModal, setPhoneModal] = useState(false);
  const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
  const [phoneForm, setPhoneForm] = useState<ContactPhone>({
    id: '',
    number: '',
    label: '',
    labelLa: '',
    isPrimary: false,
  });

  const [emailModal, setEmailModal] = useState(false);
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null);
  const [emailForm, setEmailForm] = useState<ContactEmail>({
    id: '',
    email: '',
    label: '',
    labelLa: '',
    isPrimary: false,
  });

  const [hourModal, setHourModal] = useState(false);
  const [editingHourId, setEditingHourId] = useState<string | null>(null);
  const [hourForm, setHourForm] = useState<ContactOfficeHour>({
    id: '',
    days: '',
    daysLa: '',
    hours: '',
    hoursLa: '',
    notes: '',
    notesLa: '',
  });
  const [hourLangTab, setHourLangTab] = useState<'en' | 'la'>('en');

  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const parseArrayField = <T,>(data: any, fallback: T[]): T[] => {
    if (!data) return fallback;
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('JSON parse error:', e);
      }
    }
    return fallback;
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getContact();

      // Parse locations
      const parsedLocs = parseArrayField<ContactLocation>(data.locations, [
        {
          id: 'loc-1',
          title: 'Main Campus',
          titleLa: 'ວິທະຍາເຂດຫຼັກ',
          address:
            data.address ||
            'Building 123, Russian Federation Boulevard (110), Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh, Kingdom of Cambodia',
          addressLa:
            data.addressLa ||
            'ອາຄານ 123, ຖະໜົນນະວັດຕະກຳ, ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ',
          isPrimary: true,
        },
      ]);
      setLocations(parsedLocs);

      // Parse phones
      const parsedPhones = parseArrayField<ContactPhone>(data.phones, [
        {
          id: 'phone-1',
          number: '+856 21 123 456',
          label: 'General Inquiries',
          labelLa: 'ສອບຖາມທົ່ວໄປ',
          isPrimary: true,
        },
        {
          id: 'phone-2',
          number: '+856 20 555 1234',
          label: 'Admissions Hotline',
          labelLa: 'ສາຍດ່ວນຮັບສະໝັກ',
          isPrimary: false,
        },
      ]);
      setPhones(parsedPhones);

      // Parse emails
      const parsedEmails = parseArrayField<ContactEmail>(data.emails, [
        {
          id: 'email-1',
          email: 'info@sit.edu.la',
          label: 'General Inquiries',
          labelLa: 'ສອບຖາມທົ່ວໄປ',
          isPrimary: true,
        },
        {
          id: 'email-2',
          email: 'admissions@sit.edu.la',
          label: 'Admissions Office',
          labelLa: 'ຫ້ອງການຮັບສະໝັກ',
          isPrimary: false,
        },
      ]);
      setEmails(parsedEmails);

      // Parse office hours
      const parsedHours = parseArrayField<ContactOfficeHour>(data.officeHoursList, [
        {
          id: 'oh-1',
          days: 'Monday - Friday',
          daysLa: 'ວັນຈັນ - ວັນສຸກ',
          hours: '8:00 AM - 5:00 PM',
          hoursLa: '8:00 ໂມງເຊົ້າ - 5:00 ໂມງແລງ',
          notes: 'Regular Working Hours',
          notesLa: 'ໂມງການປົກກະຕິ',
        },
        {
          id: 'oh-2',
          days: 'Saturday',
          daysLa: 'ວັນເສົາ',
          hours: '8:00 AM - 12:00 PM',
          hoursLa: '8:00 ໂມງເຊົ້າ - 12:00 ໂມງທ່ຽງ',
          notes: 'Weekend Support',
          notesLa: 'ການຊ່ວຍເຫຼືອທ້າຍອາທິດ',
        },
      ]);
      setOfficeHours(parsedHours);

      // Map Embed URL
      const mapUrl =
        data.mapEmbedUrl ||
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.7802457390835!2d102.6286178751789!3d17.98895818300444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x312467e7bd8e66a5%3A0xf85c9af1fa1bea14!2sSoutsaka%20Institute%20of%20Technology!5e0!3m2!1sen!2sth!4v1787336679429!5m2!1sen!2sth';
      setMapEmbedUrl(mapUrl);
      setMapInput(mapUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to load contact information.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      // Clean map input
      let finalMapUrl = mapEmbedUrl.trim();
      const iframeMatch = mapInput.match(/src=["']([^"']+)["']/i);
      if (iframeMatch && iframeMatch[1]) {
        finalMapUrl = iframeMatch[1];
        setMapEmbedUrl(finalMapUrl);
      } else if (mapInput.trim()) {
        finalMapUrl = mapInput.trim();
        setMapEmbedUrl(finalMapUrl);
      }

      // Determine primary fallback values
      const primaryLoc = locations.find((l) => l.isPrimary) || locations[0];
      const address = primaryLoc ? primaryLoc.address : '';
      const addressLa = primaryLoc ? primaryLoc.addressLa || '' : '';
      const phone = phones.map((p) => p.number).filter(Boolean).join(' / ');
      const email = emails.map((e) => e.email).filter(Boolean).join(' / ');
      const hours = officeHours.map((h) => `${h.days}: ${h.hours}`).join(', ');
      const hoursLa = officeHours.map((h) => `${h.daysLa || h.days}: ${h.hoursLa || h.hours}`).join(', ');

      const payload: Partial<ContactInfo> = {
        address,
        addressLa,
        phone,
        email,
        officeHours: hours,
        officeHoursLa: hoursLa,
        mapEmbedUrl: finalMapUrl,
        locations: JSON.stringify(locations),
        phones: JSON.stringify(phones),
        emails: JSON.stringify(emails),
        officeHoursList: JSON.stringify(officeHours),
      };

      await api.updateContact(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update contact settings.');
    } finally {
      setSaving(false);
    }
  };

  // --- Location Handlers ---
  const openAddLocation = () => {
    setEditingLocationId(null);
    setLocationForm({
      id: `loc-${Date.now()}`,
      title: '',
      titleLa: '',
      address: '',
      addressLa: '',
      isPrimary: locations.length === 0,
      notes: '',
      notesLa: '',
    });
    setLocationLangTab('en');
    setLocationModal(true);
  };

  const openEditLocation = (loc: ContactLocation) => {
    setEditingLocationId(loc.id);
    setLocationForm({ ...loc });
    setLocationLangTab('en');
    setLocationModal(true);
  };

  const saveLocationModal = () => {
    if (!locationForm.title.trim() || !locationForm.address.trim()) {
      alert('Please provide at least an English campus title and address.');
      return;
    }

    let updated: ContactLocation[];
    if (editingLocationId) {
      updated = locations.map((loc) => {
        if (loc.id === editingLocationId) {
          return { ...locationForm };
        }
        if (locationForm.isPrimary) {
          return { ...loc, isPrimary: false };
        }
        return loc;
      });
    } else {
      const newLoc: ContactLocation = {
        ...locationForm,
        id: locationForm.id || `loc-${Date.now()}`,
        isPrimary: Boolean(locationForm.isPrimary),
      };
      if (newLoc.isPrimary) {
        updated = [...locations.map((l) => ({ ...l, isPrimary: false })), newLoc];
      } else {
        updated = [...locations, newLoc];
      }
    }

    // Ensure at least one primary
    if (!updated.some((l) => l.isPrimary) && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    setLocations(updated);
    setLocationModal(false);
  };

  const deleteLocation = (id: string) => {
    if (!confirm('Are you sure you want to delete this campus location?')) return;
    const filtered = locations.filter((l) => l.id !== id);
    if (filtered.length > 0 && !filtered.some((l) => l.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    setLocations(filtered);
  };

  const moveLocation = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === locations.length - 1)
    )
      return;
    const newLocs = [...locations];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newLocs[index];
    newLocs[index] = newLocs[targetIndex];
    newLocs[targetIndex] = temp;
    setLocations(newLocs);
  };

  const setPrimaryLocation = (id: string) => {
    setLocations(
      locations.map((loc) => ({
        ...loc,
        isPrimary: loc.id === id,
      }))
    );
  };

  // --- Phone Handlers ---
  const openAddPhone = () => {
    setEditingPhoneId(null);
    setPhoneForm({
      id: `phone-${Date.now()}`,
      number: '',
      label: '',
      labelLa: '',
      isPrimary: phones.length === 0,
    });
    setPhoneModal(true);
  };

  const openEditPhone = (p: ContactPhone) => {
    setEditingPhoneId(p.id);
    setPhoneForm({ ...p });
    setPhoneModal(true);
  };

  const savePhoneModal = () => {
    if (!phoneForm.number.trim()) {
      alert('Please provide a valid phone number.');
      return;
    }

    let updated: ContactPhone[];
    if (editingPhoneId) {
      updated = phones.map((p) => {
        if (p.id === editingPhoneId) {
          return { ...phoneForm };
        }
        if (phoneForm.isPrimary) {
          return { ...p, isPrimary: false };
        }
        return p;
      });
    } else {
      const newPhone: ContactPhone = {
        ...phoneForm,
        id: phoneForm.id || `phone-${Date.now()}`,
        isPrimary: Boolean(phoneForm.isPrimary),
      };
      if (newPhone.isPrimary) {
        updated = [...phones.map((p) => ({ ...p, isPrimary: false })), newPhone];
      } else {
        updated = [...phones, newPhone];
      }
    }

    if (!updated.some((p) => p.isPrimary) && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    setPhones(updated);
    setPhoneModal(false);
  };

  const deletePhone = (id: string) => {
    if (!confirm('Are you sure you want to remove this phone number?')) return;
    const filtered = phones.filter((p) => p.id !== id);
    if (filtered.length > 0 && !filtered.some((p) => p.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    setPhones(filtered);
  };

  const movePhone = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === phones.length - 1)
    )
      return;
    const nextArr = [...phones];
    const target = direction === 'up' ? index - 1 : index + 1;
    const tmp = nextArr[index];
    nextArr[index] = nextArr[target];
    nextArr[target] = tmp;
    setPhones(nextArr);
  };

  // --- Email Handlers ---
  const openAddEmail = () => {
    setEditingEmailId(null);
    setEmailForm({
      id: `email-${Date.now()}`,
      email: '',
      label: '',
      labelLa: '',
      isPrimary: emails.length === 0,
    });
    setEmailModal(true);
  };

  const openEditEmail = (em: ContactEmail) => {
    setEditingEmailId(em.id);
    setEmailForm({ ...em });
    setEmailModal(true);
  };

  const saveEmailModal = () => {
    if (!emailForm.email.trim()) {
      alert('Please provide a valid email address.');
      return;
    }

    let updated: ContactEmail[];
    if (editingEmailId) {
      updated = emails.map((e) => {
        if (e.id === editingEmailId) {
          return { ...emailForm };
        }
        if (emailForm.isPrimary) {
          return { ...e, isPrimary: false };
        }
        return e;
      });
    } else {
      const newEmail: ContactEmail = {
        ...emailForm,
        id: emailForm.id || `email-${Date.now()}`,
        isPrimary: Boolean(emailForm.isPrimary),
      };
      if (newEmail.isPrimary) {
        updated = [...emails.map((e) => ({ ...e, isPrimary: false })), newEmail];
      } else {
        updated = [...emails, newEmail];
      }
    }

    if (!updated.some((e) => e.isPrimary) && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    setEmails(updated);
    setEmailModal(false);
  };

  const deleteEmail = (id: string) => {
    if (!confirm('Are you sure you want to remove this email address?')) return;
    const filtered = emails.filter((e) => e.id !== id);
    if (filtered.length > 0 && !filtered.some((e) => e.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    setEmails(filtered);
  };

  const moveEmail = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === emails.length - 1)
    )
      return;
    const nextArr = [...emails];
    const target = direction === 'up' ? index - 1 : index + 1;
    const tmp = nextArr[index];
    nextArr[index] = nextArr[target];
    nextArr[target] = tmp;
    setEmails(nextArr);
  };

  // --- Office Hours Handlers ---
  const openAddHour = () => {
    setEditingHourId(null);
    setHourForm({
      id: `oh-${Date.now()}`,
      days: '',
      daysLa: '',
      hours: '',
      hoursLa: '',
      notes: '',
      notesLa: '',
    });
    setHourLangTab('en');
    setHourModal(true);
  };

  const openEditHour = (h: ContactOfficeHour) => {
    setEditingHourId(h.id);
    setHourForm({ ...h });
    setHourLangTab('en');
    setHourModal(true);
  };

  const saveHourModal = () => {
    if (!hourForm.days.trim() || !hourForm.hours.trim()) {
      alert('Please specify the days and working hours (e.g. Monday - Friday, 8:00 AM - 5:00 PM).');
      return;
    }

    let updated: ContactOfficeHour[];
    if (editingHourId) {
      updated = officeHours.map((h) => (h.id === editingHourId ? { ...hourForm } : h));
    } else {
      updated = [...officeHours, { ...hourForm, id: hourForm.id || `oh-${Date.now()}` }];
    }

    setOfficeHours(updated);
    setHourModal(false);
  };

  const deleteHour = (id: string) => {
    if (!confirm('Are you sure you want to remove this office hours schedule?')) return;
    setOfficeHours(officeHours.filter((h) => h.id !== id));
  };

  const moveHour = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === officeHours.length - 1)
    )
      return;
    const nextArr = [...officeHours];
    const target = direction === 'up' ? index - 1 : index + 1;
    const tmp = nextArr[index];
    nextArr[index] = nextArr[target];
    nextArr[target] = tmp;
    setOfficeHours(nextArr);
  };

  // Map Embed URL extraction helper
  const handleMapInputChange = (value: string) => {
    setMapInput(value);
    const iframeMatch = value.match(/src=["']([^"']+)["']/i);
    if (iframeMatch && iframeMatch[1]) {
      setMapEmbedUrl(iframeMatch[1]);
    } else if (value.trim().startsWith('http')) {
      setMapEmbedUrl(value.trim());
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-[#0400CC] border-t-[#00B6FF] rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading Contact Configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0400CC] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Contact & Campus Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C] tracking-tight">
            Contact Us & Locations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Configure campus physical locations (array), single Google Maps interactive embed, phone numbers (array), direct emails (array), and office working hours.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setPreviewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Preview Public View</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0400CC] hover:bg-[#030099] disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-900/20 transition-all cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">
              Contact information and campus settings updated successfully!
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'locations'
              ? 'bg-white text-[#0400CC] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Locations ({locations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'map'
              ? 'bg-white text-[#0400CC] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Google Map (1)</span>
        </button>

        <button
          onClick={() => setActiveTab('phones')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'phones'
              ? 'bg-white text-[#0400CC] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Phone Numbers ({phones.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('emails')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'emails'
              ? 'bg-white text-[#0400CC] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email Addresses ({emails.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hours')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'hours'
              ? 'bg-white text-[#0400CC] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Office Hours ({officeHours.length})</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: LOCATIONS (ARRAY)
      ======================================================== */}
      {activeTab === 'locations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-[#00001C] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0400CC]" />
                  <span>Campus Locations (Multiple / Array)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage multiple physical campus addresses, administration buildings, and regional study centers.
                </p>
              </div>
              <button
                onClick={openAddLocation}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0400CC] text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Campus Location</span>
              </button>
            </div>

            {locations.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 space-y-3">
                <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-600">No campus locations configured yet.</p>
                <button
                  onClick={openAddLocation}
                  className="px-4 py-2 rounded-xl bg-[#0400CC] text-white text-xs font-bold cursor-pointer"
                >
                  Add Primary Location
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {locations.map((loc, idx) => (
                  <div
                    key={loc.id || idx}
                    className={`p-5 rounded-2xl border transition-all ${
                      loc.isPrimary
                        ? 'border-[#0400CC]/30 bg-blue-50/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#0400CC]/10 text-[#0400CC] flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">{loc.title}</h3>
                            {loc.titleLa && (
                              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                                {loc.titleLa}
                              </span>
                            )}
                            {loc.isPrimary && (
                              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Primary Campus
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-xs sm:text-sm text-slate-600">
                            <p className="flex items-start gap-2">
                              <span className="font-semibold text-slate-400 text-xs uppercase shrink-0 mt-0.5">EN:</span>
                              <span className="text-slate-800">{loc.address}</span>
                            </p>
                            {loc.addressLa && (
                              <p className="flex items-start gap-2 text-slate-700">
                                <span className="font-semibold text-slate-400 text-xs uppercase shrink-0 mt-0.5">LA:</span>
                                <span>{loc.addressLa}</span>
                              </p>
                            )}
                          </div>

                          {(loc.notes || loc.notesLa) && (
                            <div className="text-xs text-slate-500 bg-slate-100/70 px-3 py-1.5 rounded-lg inline-block">
                              <span className="font-semibold">Notes: </span>
                              {loc.notes} {loc.notesLa && `(${loc.notesLa})`}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {!loc.isPrimary && (
                          <button
                            onClick={() => setPrimaryLocation(loc.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 text-xs font-semibold text-slate-600 hover:text-[#0400CC] hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Make Primary Campus"
                          >
                            Set Primary
                          </button>
                        )}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => moveLocation(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 hover:bg-slate-100 disabled:opacity-30 text-slate-600 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveLocation(idx, 'down')}
                            disabled={idx === locations.length - 1}
                            className="p-1.5 hover:bg-slate-100 disabled:opacity-30 text-slate-600 border-l border-slate-200 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => openEditLocation(loc)}
                          className="p-2 rounded-lg text-slate-500 hover:text-[#0400CC] hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit Location"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteLocation(loc.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Location"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: GOOGLE MAP (SINGLE)
      ======================================================== */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="pb-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#00001C] flex items-center gap-2">
                <Navigation className="w-5 h-5 text-[#0400CC]" />
                <span>Google Map Embed (Single Location Map)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                There is only one primary Google Map for the university. Paste either the direct embed URL or full iframe HTML code from Google Maps.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Google Map Embed URL or &lt;iframe&gt; Code
                </label>
                <textarea
                  rows={3}
                  value={mapInput}
                  onChange={(e) => handleMapInputChange(e.target.value)}
                  placeholder='Paste Google Map Embed URL (e.g. https://www.google.com/maps/embed?pb=...) or full <iframe src="..." /> code'
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-xs sm:text-sm font-mono text-slate-800 bg-slate-50/50"
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>Clean Extracted URL: <span className="font-mono text-slate-700">{mapEmbedUrl || 'None'}</span></span>
                  {mapEmbedUrl && (
                    <a
                      href={mapEmbedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#0400CC] hover:underline font-semibold"
                    >
                      <span>Open in Browser</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Guide Card */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 text-xs text-slate-700">
                <Info className="w-4 h-4 text-[#0400CC] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-[#00001C]">How to get your Google Maps Embed URL:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-slate-600 pl-1">
                    <li>Search for SIT University or your campus on <strong>Google Maps</strong>.</li>
                    <li>Click the <strong>Share</strong> button on the left panel.</li>
                    <li>Switch to the <strong>&quot;Embed a map&quot;</strong> tab.</li>
                    <li>Click <strong>&quot;Copy HTML&quot;</strong> and paste it directly into the input box above.</li>
                  </ol>
                </div>
              </div>

              {/* Live Map Preview Card */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Map Preview</span>
                <div className="rounded-2xl border border-slate-200 overflow-hidden h-80 sm:h-96 w-full bg-slate-100 relative shadow-inner">
                  {mapEmbedUrl ? (
                    <iframe
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      title="Google Map Preview"
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Navigation className="w-8 h-8 text-slate-300" />
                      <span className="text-xs font-medium">No valid Google Map URL provided</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: PHONES (ARRAY)
      ======================================================== */}
      {activeTab === 'phones' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-[#00001C] flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#0400CC]" />
                  <span>Phone Numbers (Multiple / Array)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage department hotline numbers, admissions counseling desks, and emergency telephone lines.
                </p>
              </div>
              <button
                onClick={openAddPhone}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0400CC] text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Phone Number</span>
              </button>
            </div>

            {phones.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 space-y-3">
                <Phone className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-600">No phone contacts added yet.</p>
                <button
                  onClick={openAddPhone}
                  className="px-4 py-2 rounded-xl bg-[#0400CC] text-white text-xs font-bold cursor-pointer"
                >
                  Add First Phone
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phones.map((phone, idx) => (
                  <div
                    key={phone.id || idx}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      phone.isPrimary
                        ? 'border-[#0400CC]/30 bg-blue-50/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                            {phone.label || 'Contact Phone'}
                          </span>
                          {phone.labelLa && (
                            <span className="text-[10px] text-slate-400">({phone.labelLa})</span>
                          )}
                          {phone.isPrimary && (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#0400CC]">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                          {phone.number}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => movePhone(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-slate-100 disabled:opacity-30 text-slate-600 cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => movePhone(idx, 'down')}
                          disabled={idx === phones.length - 1}
                          className="p-1 hover:bg-slate-100 disabled:opacity-30 text-slate-600 border-l border-slate-200 cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => openEditPhone(phone)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0400CC] hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePhone(phone.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: EMAILS (ARRAY)
      ======================================================== */}
      {activeTab === 'emails' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-[#00001C] flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#0400CC]" />
                  <span>Email Addresses (Multiple / Array)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage department inboxes, student admissions email addresses, and general inquiries mailboxes.
                </p>
              </div>
              <button
                onClick={openAddEmail}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0400CC] text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Email Address</span>
              </button>
            </div>

            {emails.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 space-y-3">
                <Mail className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-600">No email addresses added yet.</p>
                <button
                  onClick={openAddEmail}
                  className="px-4 py-2 rounded-xl bg-[#0400CC] text-white text-xs font-bold cursor-pointer"
                >
                  Add First Email
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emails.map((email, idx) => (
                  <div
                    key={email.id || idx}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      email.isPrimary
                        ? 'border-[#0400CC]/30 bg-blue-50/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0400CC] flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                            {email.label || 'Email Contact'}
                          </span>
                          {email.labelLa && (
                            <span className="text-[10px] text-slate-400">({email.labelLa})</span>
                          )}
                          {email.isPrimary && (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#0400CC]">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                          {email.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => moveEmail(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-slate-100 disabled:opacity-30 text-slate-600 cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveEmail(idx, 'down')}
                          disabled={idx === emails.length - 1}
                          className="p-1 hover:bg-slate-100 disabled:opacity-30 text-slate-600 border-l border-slate-200 cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => openEditEmail(email)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0400CC] hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteEmail(email.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: OFFICE HOURS (ARRAY)
      ======================================================== */}
      {activeTab === 'hours' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-[#00001C] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#0400CC]" />
                  <span>Office Hours & Schedules (Multiple / Array)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure regular operating schedules, weekday and weekend timings for university campus offices.
                </p>
              </div>
              <button
                onClick={openAddHour}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0400CC] text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Schedule Slot</span>
              </button>
            </div>

            {officeHours.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 space-y-3">
                <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-600">No working hours configured yet.</p>
                <button
                  onClick={openAddHour}
                  className="px-4 py-2 rounded-xl bg-[#0400CC] text-white text-xs font-bold cursor-pointer"
                >
                  Add Weekday Hours
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {officeHours.map((hour, idx) => (
                  <div
                    key={hour.id || idx}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">
                            {hour.days}
                          </span>
                          {hour.daysLa && (
                            <span className="text-xs text-slate-500">
                              ({hour.daysLa})
                            </span>
                          )}
                        </div>

                        <div className="text-xs sm:text-sm font-extrabold text-[#0400CC]">
                          {hour.hours}
                          {hour.hoursLa && (
                            <span className="text-xs text-slate-500 font-normal ml-1">
                              / {hour.hoursLa}
                            </span>
                          )}
                        </div>

                        {(hour.notes || hour.notesLa) && (
                          <p className="text-xs text-slate-400 italic">
                            {hour.notes} {hour.notesLa && `(${hour.notesLa})`}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => moveHour(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-slate-100 disabled:opacity-30 text-slate-600 cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveHour(idx, 'down')}
                          disabled={idx === officeHours.length - 1}
                          className="p-1 hover:bg-slate-100 disabled:opacity-30 text-slate-600 border-l border-slate-200 cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => openEditHour(hour)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0400CC] hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteHour(hour.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: LOCATION (ADD / EDIT)
      ======================================================== */}
      {locationModal && (
        <Modal
          isOpen={locationModal}
          onClose={() => setLocationModal(false)}
          title={editingLocationId ? 'Edit Campus Location' : 'Add Campus Location'}
        >
          <div className="space-y-5">
            {/* Language switch */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content Language</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setLocationLangTab('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    locationLangTab === 'en' ? 'bg-white text-[#0400CC] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLocationLangTab('la')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    locationLangTab === 'la' ? 'bg-white text-[#0400CC] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Lao (ພາສາລາວ)
                </button>
              </div>
            </div>

            {locationLangTab === 'en' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Campus Title (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={locationForm.title}
                    onChange={(e) => setLocationForm({ ...locationForm, title: e.target.value })}
                    placeholder="e.g. Main Technology Campus"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Address (English) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={locationForm.address}
                    onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                    placeholder="e.g. Building 123, Russian Federation Boulevard (110), Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Notes / Building details (Optional)
                  </label>
                  <input
                    type="text"
                    value={locationForm.notes || ''}
                    onChange={(e) => setLocationForm({ ...locationForm, notes: e.target.value })}
                    placeholder="e.g. Administrative Hall, Admissions Desk on 1st Floor"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Campus Title (Lao)
                  </label>
                  <input
                    type="text"
                    value={locationForm.titleLa || ''}
                    onChange={(e) => setLocationForm({ ...locationForm, titleLa: e.target.value })}
                    placeholder="e.g. ວິທະຍາເຂດຫຼັກ ເຕັກໂນໂລຊີ"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Address (Lao)
                  </label>
                  <textarea
                    rows={3}
                    value={locationForm.addressLa || ''}
                    onChange={(e) => setLocationForm({ ...locationForm, addressLa: e.target.value })}
                    placeholder="e.g. ອາຄານ 123, ຖະໜົນນະວັດຕະກຳ, ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Notes / Building details (Lao)
                  </label>
                  <input
                    type="text"
                    value={locationForm.notesLa || ''}
                    onChange={(e) => setLocationForm({ ...locationForm, notesLa: e.target.value })}
                    placeholder="e.g. ຫ້ອງການຮັບສະໝັກ ຊັ້ນ 1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrimaryLoc"
                checked={locationForm.isPrimary || false}
                onChange={(e) => setLocationForm({ ...locationForm, isPrimary: e.target.checked })}
                className="w-4 h-4 rounded text-[#0400CC] focus:ring-[#0400CC]"
              />
              <label htmlFor="isPrimaryLoc" className="text-xs font-bold text-slate-700 cursor-pointer">
                Set as Primary Campus Location
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setLocationModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveLocationModal}
                className="px-6 py-2 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {editingLocationId ? 'Update Location' : 'Add Location'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================
          MODAL: PHONE (ADD / EDIT)
      ======================================================== */}
      {phoneModal && (
        <Modal
          isOpen={phoneModal}
          onClose={() => setPhoneModal(false)}
          title={editingPhoneId ? 'Edit Phone Number' : 'Add Phone Number'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={phoneForm.number}
                onChange={(e) => setPhoneForm({ ...phoneForm, number: e.target.value })}
                placeholder="e.g. +856 21 123 456"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Department / Purpose (EN)
                </label>
                <input
                  type="text"
                  value={phoneForm.label}
                  onChange={(e) => setPhoneForm({ ...phoneForm, label: e.target.value })}
                  placeholder="e.g. Admissions Hotline"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Department / Purpose (LA)
                </label>
                <input
                  type="text"
                  value={phoneForm.labelLa || ''}
                  onChange={(e) => setPhoneForm({ ...phoneForm, labelLa: e.target.value })}
                  placeholder="e.g. ສາຍດ່ວນຮັບສະໝັກ"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrimaryPhone"
                checked={phoneForm.isPrimary || false}
                onChange={(e) => setPhoneForm({ ...phoneForm, isPrimary: e.target.checked })}
                className="w-4 h-4 rounded text-[#0400CC] focus:ring-[#0400CC]"
              />
              <label htmlFor="isPrimaryPhone" className="text-xs font-bold text-slate-700 cursor-pointer">
                Set as Primary Phone Number
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPhoneModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={savePhoneModal}
                className="px-6 py-2 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {editingPhoneId ? 'Update Phone' : 'Add Phone'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================
          MODAL: EMAIL (ADD / EDIT)
      ======================================================== */}
      {emailModal && (
        <Modal
          isOpen={emailModal}
          onClose={() => setEmailModal(false)}
          title={editingEmailId ? 'Edit Email Address' : 'Add Email Address'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                placeholder="e.g. admissions@sit.edu.la"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Department / Purpose (EN)
                </label>
                <input
                  type="text"
                  value={emailForm.label}
                  onChange={(e) => setEmailForm({ ...emailForm, label: e.target.value })}
                  placeholder="e.g. Admissions Office"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Department / Purpose (LA)
                </label>
                <input
                  type="text"
                  value={emailForm.labelLa || ''}
                  onChange={(e) => setEmailForm({ ...emailForm, labelLa: e.target.value })}
                  placeholder="e.g. ຫ້ອງການຮັບສະໝັກ"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrimaryEmail"
                checked={emailForm.isPrimary || false}
                onChange={(e) => setEmailForm({ ...emailForm, isPrimary: e.target.checked })}
                className="w-4 h-4 rounded text-[#0400CC] focus:ring-[#0400CC]"
              />
              <label htmlFor="isPrimaryEmail" className="text-xs font-bold text-slate-700 cursor-pointer">
                Set as Primary Email Address
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEmailModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEmailModal}
                className="px-6 py-2 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {editingEmailId ? 'Update Email' : 'Add Email'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================
          MODAL: OFFICE HOURS (ADD / EDIT)
      ======================================================== */}
      {hourModal && (
        <Modal
          isOpen={hourModal}
          onClose={() => setHourModal(false)}
          title={editingHourId ? 'Edit Office Hours' : 'Add Office Hours'}
        >
          <div className="space-y-4">
            {/* Language switch */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content Language</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setHourLangTab('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    hourLangTab === 'en' ? 'bg-white text-[#0400CC] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setHourLangTab('la')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    hourLangTab === 'la' ? 'bg-white text-[#0400CC] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Lao (ພາສາລາວ)
                </button>
              </div>
            </div>

            {hourLangTab === 'en' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Operating Days (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={hourForm.days}
                    onChange={(e) => setHourForm({ ...hourForm, days: e.target.value })}
                    placeholder="e.g. Monday - Friday"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Working Hours (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={hourForm.hours}
                    onChange={(e) => setHourForm({ ...hourForm, hours: e.target.value })}
                    placeholder="e.g. 8:00 AM - 5:00 PM"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Notes / Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    value={hourForm.notes || ''}
                    onChange={(e) => setHourForm({ ...hourForm, notes: e.target.value })}
                    placeholder="e.g. Closed on Public Holidays"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Operating Days (Lao)
                  </label>
                  <input
                    type="text"
                    value={hourForm.daysLa || ''}
                    onChange={(e) => setHourForm({ ...hourForm, daysLa: e.target.value })}
                    placeholder="e.g. ວັນຈັນ - ວັນສຸກ"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Working Hours (Lao)
                  </label>
                  <input
                    type="text"
                    value={hourForm.hoursLa || ''}
                    onChange={(e) => setHourForm({ ...hourForm, hoursLa: e.target.value })}
                    placeholder="e.g. 8:00 ໂມງເຊົ້າ - 5:00 ໂມງແລງ"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Notes / Remarks (Lao)
                  </label>
                  <input
                    type="text"
                    value={hourForm.notesLa || ''}
                    onChange={(e) => setHourForm({ ...hourForm, notesLa: e.target.value })}
                    placeholder="e.g. ປິດໃນວັນພັກລັດຖະການ"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setHourModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveHourModal}
                className="px-6 py-2 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {editingHourId ? 'Update Hours' : 'Add Hours'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================
          MODAL: PUBLIC VIEW PREVIEW
      ======================================================== */}
      {previewModal && (
        <Modal
          isOpen={previewModal}
          onClose={() => setPreviewModal(false)}
          title="Public Site Contact View Preview"
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between bg-slate-100 p-2 rounded-xl">
              <span className="text-xs font-bold text-slate-600">Simulate Language:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewLang('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewLang === 'en' ? 'bg-[#0400CC] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English View
                </button>
                <button
                  onClick={() => setPreviewLang('la')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewLang === 'la' ? 'bg-[#0400CC] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lao View (ພາສາລາວ)
                </button>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 space-y-6">
              {/* Campus Locations Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-[#00001C] uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0400CC]" />
                  <span>{previewLang === 'la' ? 'ທີ່ຕັ້ງວິທະຍາເຂດ' : 'Campus Locations'}</span>
                </h4>
                <div className="space-y-3">
                  {locations.map((loc, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          {previewLang === 'la' && loc.titleLa ? loc.titleLa : loc.title}
                        </span>
                        {loc.isPrimary && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">
                        {previewLang === 'la' && loc.addressLa ? loc.addressLa : loc.address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phones & Emails */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-[#00001C] uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#0400CC]" />
                    <span>{previewLang === 'la' ? 'ເບີໂທລະສັບຕິດຕໍ່' : 'Phone Numbers'}</span>
                  </h4>
                  <div className="space-y-2">
                    {phones.map((p, i) => (
                      <div key={i} className="text-xs flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50">
                        <span className="text-slate-500 truncate">
                          {previewLang === 'la' && p.labelLa ? p.labelLa : p.label}:
                        </span>
                        <span className="font-bold text-slate-900">{p.number}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-[#00001C] uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#0400CC]" />
                    <span>{previewLang === 'la' ? 'ອີເມວຕິດຕໍ່' : 'Email Addresses'}</span>
                  </h4>
                  <div className="space-y-2">
                    {emails.map((e, i) => (
                      <div key={i} className="text-xs flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50">
                        <span className="text-slate-500 truncate">
                          {previewLang === 'la' && e.labelLa ? e.labelLa : e.label}:
                        </span>
                        <span className="font-bold text-[#0400CC]">{e.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-[#00001C] uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0400CC]" />
                  <span>{previewLang === 'la' ? 'ໂມງລັດຖະການ' : 'Office Hours'}</span>
                </h4>
                <div className="space-y-2">
                  {officeHours.map((h, i) => (
                    <div key={i} className="text-xs flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-700 font-semibold">
                        {previewLang === 'la' && h.daysLa ? h.daysLa : h.days}
                      </span>
                      <span className="font-bold text-slate-900">
                        {previewLang === 'la' && h.hoursLa ? h.hoursLa : h.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Preview */}
              {mapEmbedUrl && (
                <div className="rounded-2xl border border-slate-200 overflow-hidden h-60 w-full bg-slate-200">
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="Map"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewModal(false)}
                className="px-6 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
