'use client';

import { useEffect, useState } from 'react';
import { Plus, Save, Eye, Edit2, Trash2, ArrowUp, ArrowDown, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { ContactLocation, ContactPhone, ContactEmail, ContactOfficeHour } from '@/lib/api/types';
import { cleanMapEmbedUrl, getCampusContacts, isGoogleMapEmbedUrl } from '@/lib/contact-locations';
import { CampusContactCard } from '@/components/contact/CampusContactCard';
import { Modal } from '@/components/ui/Modal';
import { dictionaries } from '@/lib/i18n';
import { useLanguage } from '@/context/LanguageContext';

const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0400CC] text-sm';
const buttonClass = 'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 cursor-pointer';
const newId = () => crypto.randomUUID();
const emptyCampus = (): ContactLocation => ({
  id: newId(), title: '', titleLa: '', address: '', addressLa: '', notes: '', notesLa: '',
  mapEmbedUrl: '', phones: [], emails: [], officeHoursList: [], isPrimary: false,
});
const message = (error: unknown) => error instanceof Error ? error.message : 'Could not save campus contact information.';

type RowField<T> = { key: keyof T & string; label: string; required?: boolean; type?: string };
function ContactRowsEditor<T extends { id: string }>({ title, rows, fields, create, onChange }: {
  title: string; rows: T[]; fields: RowField<T>[]; create: () => T; onChange: (rows: T[]) => void;
}) {
  return (
    <div className="space-y-3 border-t border-slate-100 pt-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <button type="button" className={buttonClass} onClick={() => onChange([...rows, create()])}>
          <Plus className="w-4 h-4" />Add
        </button>
      </div>
      {rows.length === 0 && <p className="text-xs text-slate-500">No {title.toLowerCase()} added for this campus.</p>}
      {rows.map((row, index) => (
        <div key={row.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{title} {index + 1}</span>
            <button type="button" aria-label={`Remove ${title.toLowerCase()} ${index + 1}`} className="p-2 text-red-600 cursor-pointer"
              onClick={() => onChange(rows.filter((item) => item.id !== row.id))}><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((field) => (
              <label key={field.key} className="space-y-1 text-xs font-semibold text-slate-600">
                <span>{field.label}{field.required ? ' *' : ''}</span>
                <input className={inputClass} value={String(row[field.key] ?? '')} type={field.type || 'text'} required={field.required}
                  onChange={(event) => onChange(rows.map((item) => item.id === row.id ? { ...item, [field.key]: event.target.value } : item))} />
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const phoneFields: RowField<ContactPhone>[] = [
  { key: 'number', label: 'Phone number', required: true, type: 'tel' },
  { key: 'label', label: 'Label (English)' }, { key: 'labelLa', label: 'Label (Lao)' },
];
const emailFields: RowField<ContactEmail>[] = [
  { key: 'email', label: 'Email address', required: true, type: 'email' },
  { key: 'label', label: 'Label (English)' }, { key: 'labelLa', label: 'Label (Lao)' },
];
const hourFields: RowField<ContactOfficeHour>[] = [
  { key: 'days', label: 'Days (English)', required: true }, { key: 'daysLa', label: 'Days (Lao)' },
  { key: 'hours', label: 'Hours (English)', required: true }, { key: 'hoursLa', label: 'Hours (Lao)' },
  { key: 'notes', label: 'Notes (English)' }, { key: 'notesLa', label: 'Notes (Lao)' },
];

export default function AdminContactPage() {
  const { t } = useLanguage();
  const [campuses, setCampuses] = useState<ContactLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [editing, setEditing] = useState<ContactLocation | null>(null);
  const [mapInput, setMapInput] = useState('');
  const [formError, setFormError] = useState('');
  const [preview, setPreview] = useState(false);
  const [previewLang, setPreviewLang] = useState<'en' | 'la'>('en');

  useEffect(() => {
    let active = true;
    api.getContact().then((contact) => {
      if (active) setCampuses(getCampusContacts(contact));
    }).catch((cause: unknown) => {
      if (active) setError(message(cause));
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const changeCampuses = (next: ContactLocation[]) => {
    setCampuses(next);
    setSuccess(false);
  };
  const openEditor = (campus?: ContactLocation) => {
    setEditing(campus ? structuredClone(campus) : { ...emptyCampus(), isPrimary: campuses.length === 0 });
    setMapInput(campus?.mapEmbedUrl || '');
    setFormError('');
  };
  const submitCampus = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    if (!editing.title.trim() || !editing.address.trim()) {
      setFormError('Enter the campus name and address in English.');
      return;
    }
    if (!isGoogleMapEmbedUrl(mapInput)) {
      setFormError('Paste a Google Maps embed URL or iframe from Share > Embed a map.');
      return;
    }
    const campus = { ...editing, title: editing.title.trim(), address: editing.address.trim(), mapEmbedUrl: cleanMapEmbedUrl(mapInput) };
    const exists = campuses.some((item) => item.id === campus.id);
    let next = exists ? campuses.map((item) => item.id === campus.id ? campus : item) : [...campuses, campus];
    if (campus.isPrimary) next = next.map((item) => ({ ...item, isPrimary: item.id === campus.id }));
    if (next.length && !next.some((item) => item.isPrimary)) next = next.map((item, index) => ({ ...item, isPrimary: index === 0 }));
    changeCampuses(next);
    setEditing(null);
  };
  const removeCampus = (campus: ContactLocation) => {
    if (!confirm(`Delete the entire contact section for ${campus.title}, including its phones, emails, hours, and map?`)) return;
    let next = campuses.filter((item) => item.id !== campus.id);
    if (next.length && !next.some((item) => item.isPrimary)) next = next.map((item, index) => ({ ...item, isPrimary: index === 0 }));
    changeCampuses(next);
  };
  const moveCampus = (index: number, direction: number) => {
    const next = [...campuses];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    changeCampuses(next);
  };
  const saveAll = async () => {
    setSaving(true); setError(''); setSuccess(false);
    try {
      await api.updateContact({ locations: campuses });
      setSuccess(true);
    } catch (cause: unknown) { setError(message(cause)); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="p-8 text-slate-500">Loading campus contact sections...</p>;

  return (
    <div className="space-y-6 pb-16">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 flex flex-wrap items-center justify-between gap-5">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00001C]">Campus Contact Sections</h1>
          <p className="text-sm text-slate-500">Each campus has its own location, phone numbers, emails, office hours, and Google Map.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className={buttonClass} onClick={() => setPreview(true)}><Eye className="w-4 h-4" />Preview Public View</button>
          <button className={`${buttonClass} bg-[#0400CC] text-white hover:bg-[#030099]`} disabled={saving || !!error && campuses.length === 0} onClick={saveAll}>
            <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
      {error && <p role="alert" className="p-4 rounded-xl bg-red-50 text-red-700">{error}</p>}
      {success && <p role="status" className="p-4 rounded-xl bg-emerald-50 text-emerald-700">Campus contact sections saved.</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-bold text-slate-800">{campuses.length} campus contact {campuses.length === 1 ? 'section' : 'sections'}</h2>
        <button className={buttonClass} onClick={() => openEditor()}><Plus className="w-4 h-4" />Add Campus Contact Section</button>
      </div>
      {campuses.length === 0 && <div className="rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-500">
        <MapPin className="w-8 h-8 mx-auto mb-3" />Add a campus to create its complete contact section.
      </div>}
      {campuses.map((campus, index) => (
        <div key={campus.id} className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-500">Section {index + 1}{campus.isPrimary ? ' - Primary campus' : ''}</span>
            <div className="flex flex-wrap gap-2">
              {!campus.isPrimary && <button className={buttonClass} onClick={() => changeCampuses(campuses.map((item) => ({ ...item, isPrimary: item.id === campus.id })))}>Set Primary</button>}
              <button className={buttonClass} aria-label={`Move ${campus.title} up`} disabled={index === 0} onClick={() => moveCampus(index, -1)}><ArrowUp className="w-4 h-4" /></button>
              <button className={buttonClass} aria-label={`Move ${campus.title} down`} disabled={index === campuses.length - 1} onClick={() => moveCampus(index, 1)}><ArrowDown className="w-4 h-4" /></button>
              <button className={buttonClass} onClick={() => openEditor(campus)}><Edit2 className="w-4 h-4" />Edit Section</button>
              <button className={`${buttonClass} text-red-600`} aria-label={`Delete ${campus.title} contact section`} onClick={() => removeCampus(campus)}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <CampusContactCard campus={campus} labels={t.contact} preview wide />
        </div>
      ))}
      {editing && (
        <Modal isOpen onClose={() => setEditing(null)} title={campuses.some((campus) => campus.id === editing.id) ? 'Edit Campus Contact Section' : 'Add Campus Contact Section'} maxWidth="4xl">
          <form onSubmit={submitCampus} className="space-y-5">
            <p className="text-sm text-slate-500">All details below belong to this campus. Apply the section, then Save All Changes to publish it.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ['title', 'Campus name (English)', true], ['titleLa', 'Campus name (Lao)', false],
                ['address', 'Address (English)', true], ['addressLa', 'Address (Lao)', false],
                ['notes', 'Building / location notes (English)', false], ['notesLa', 'Building / location notes (Lao)', false],
              ] as const).map(([key, label, required]) => (
                <label key={key} className="space-y-1 text-xs font-semibold text-slate-600">
                  <span>{label}{required ? ' *' : ''}</span>
                  <textarea rows={key.startsWith('address') ? 3 : 1} className={inputClass} value={editing[key] || ''} required={required}
                    onChange={(event) => setEditing({ ...editing, [key]: event.target.value })} />
                </label>
              ))}
            </div>
            <ContactRowsEditor<ContactPhone> title="Phone Numbers" rows={editing.phones || []} fields={phoneFields}
              create={() => ({ id: newId(), number: '', label: '', labelLa: '' })} onChange={(phones) => setEditing({ ...editing, phones })} />
            <ContactRowsEditor<ContactEmail> title="Email Addresses" rows={editing.emails || []} fields={emailFields}
              create={() => ({ id: newId(), email: '', label: '', labelLa: '' })} onChange={(emails) => setEditing({ ...editing, emails })} />
            <ContactRowsEditor<ContactOfficeHour> title="Office Hours" rows={editing.officeHoursList || []} fields={hourFields}
              create={() => ({ id: newId(), days: '', daysLa: '', hours: '', hoursLa: '', notes: '', notesLa: '' })}
              onChange={(officeHoursList) => setEditing({ ...editing, officeHoursList })} />
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <label className="block space-y-2 text-sm font-bold text-slate-800">
                <span>Google Map for this campus</span>
                <textarea className={`${inputClass} font-mono`} rows={3} value={mapInput} onChange={(event) => setMapInput(event.target.value)} placeholder="Paste a Google Maps embed URL or full iframe code" />
              </label>
              <p className="text-xs text-slate-500">Google Maps: Share, then Embed a map, then Copy HTML. Leave blank to remove the map.</p>
              {mapInput.trim() && !isGoogleMapEmbedUrl(mapInput) && <p className="text-xs text-red-600">Use a Google Maps embed URL or iframe.</p>}
              {mapInput.trim() && isGoogleMapEmbedUrl(mapInput) && <iframe key={cleanMapEmbedUrl(mapInput)} src={cleanMapEmbedUrl(mapInput)}
                title={`${editing.title || 'Campus'} map preview`} loading="eager" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="w-full h-72 rounded-xl border-0" />}
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={!!editing.isPrimary} onChange={(event) => setEditing({ ...editing, isPrimary: event.target.checked })} />Primary campus
            </label>
            {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button type="button" className={buttonClass} onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className={`${buttonClass} bg-[#0400CC] text-white hover:bg-[#030099]`}>Apply Contact Section</button>
            </div>
          </form>
        </Modal>
      )}
      {preview && (
        <Modal isOpen onClose={() => setPreview(false)} title="Campus Contact Sections Preview" maxWidth="4xl">
          <div className="space-y-6">
            <div className="flex gap-2">
              {(['en', 'la'] as const).map((language) => <button key={language} className={`${buttonClass} ${previewLang === language ? 'bg-[#0400CC] text-white hover:bg-[#030099]' : ''}`}
                onClick={() => setPreviewLang(language)}>{language === 'en' ? 'English' : 'Lao'}</button>)}
            </div>
            {campuses.map((campus) => <CampusContactCard key={campus.id} campus={campus} isLa={previewLang === 'la'} labels={dictionaries[previewLang === 'la' ? 'LA' : 'EN'].contact} preview wide />)}
            {!campuses.length && <p className="text-sm text-slate-500">No campus contact sections to preview.</p>}
          </div>
        </Modal>
      )}
    </div>
  );
}
