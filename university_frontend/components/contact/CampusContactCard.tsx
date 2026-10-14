import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { ContactLocation } from '@/lib/api/types';
import { cleanMapEmbedUrl } from '@/lib/contact-locations';

type Labels = { campusLocation: string; phoneContacts: string; directEmail: string; officeHours: string };

export function CampusContactCard({ campus, isLa = false, labels, preview = false, wide = false }: {
  campus: ContactLocation; isLa?: boolean; labels: Labels; preview?: boolean; wide?: boolean;
}) {
  const title = isLa && campus.titleLa ? campus.titleLa : campus.title;
  const address = isLa && campus.addressLa ? campus.addressLa : campus.address;
  const notes = isLa && campus.notesLa ? campus.notesLa : campus.notes;
  return (
    <section aria-label={title} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-slate-100">
        <h3 className="text-xl sm:text-2xl font-bold text-[#00001C]">{title}</h3>
      </div>
      <div className={wide && campus.mapEmbedUrl ? 'grid grid-cols-1 lg:grid-cols-2' : ''}>
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#0400CC] shrink-0 mt-1" />
            <div className="space-y-1">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500">{labels.campusLocation}</h4>
              <p className="text-sm text-slate-800 whitespace-pre-line">{address}</p>
              {notes && <p className="text-xs text-slate-500 whitespace-pre-line">{notes}</p>}
            </div>
          </div>
          {!!campus.phones?.length && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500">{labels.phoneContacts}</h4>
              {campus.phones.map((phone) => (
                <a key={phone.id} href={`tel:${phone.number.replace(/[^\d+]/g, '')}`} className="flex items-start gap-3 text-sm text-slate-800 hover:text-[#0400CC] break-all">
                  <Phone className="w-5 h-5 text-[#0400CC] shrink-0" />
                  <span><span className="block text-xs text-slate-500">{isLa && phone.labelLa ? phone.labelLa : phone.label}</span>{phone.number}</span>
                </a>
              ))}
            </div>
          )}
          {!!campus.emails?.length && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500">{labels.directEmail}</h4>
              {campus.emails.map((email) => (
                <a key={email.id} href={`mailto:${email.email}`} className="flex items-start gap-3 text-sm text-slate-800 hover:text-[#0400CC] break-all">
                  <Mail className="w-5 h-5 text-[#0400CC] shrink-0" />
                  <span><span className="block text-xs text-slate-500">{isLa && email.labelLa ? email.labelLa : email.label}</span>{email.email}</span>
                </a>
              ))}
            </div>
          )}
          {!!campus.officeHoursList?.length && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500">{labels.officeHours}</h4>
              {campus.officeHoursList.map((hour) => (
                <div key={hour.id} className="flex items-start gap-3 text-sm text-slate-800">
                  <Clock className="w-5 h-5 text-[#0400CC] shrink-0" />
                  <div>
                    <p className="font-semibold">{isLa && hour.daysLa ? hour.daysLa : hour.days}</p>
                    <p>{isLa && hour.hoursLa ? hour.hoursLa : hour.hours}</p>
                    {(hour.notes || hour.notesLa) && <p className="text-xs text-slate-500">{isLa && hour.notesLa ? hour.notesLa : hour.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {campus.mapEmbedUrl && (
          <iframe key={campus.mapEmbedUrl} src={cleanMapEmbedUrl(campus.mapEmbedUrl)} title={`${title} map`}
            loading={preview ? 'eager' : 'lazy'} allowFullScreen referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-80 lg:min-h-80 border-0" />
        )}
      </div>
    </section>
  );
}
