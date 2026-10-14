import { ContactInfo, ContactLocation, ContactPhone, ContactEmail, ContactOfficeHour } from './api/types';

export function cleanMapEmbedUrl(input: string = ''): string {
  const value = input.trim();
  return (value.match(/src\s*=\s*["']([^"']+)["']/i)?.[1] || value).replace(/&amp;/g, '&');
}

export function isGoogleMapEmbedUrl(input: string): boolean {
  if (!input.trim()) return true;
  try {
    const url = new URL(cleanMapEmbedUrl(input));
    return url.protocol === 'https:' &&
      ['www.google.com', 'google.com', 'maps.google.com'].includes(url.hostname) &&
      (url.pathname === '/maps/embed' || url.pathname.startsWith('/maps/embed/'));
  } catch {
    return false;
  }
}

// Only legacy records without a campus map field inherit the old primary map.
export function withLegacyCampusMap(locations: ContactLocation[], legacyMap?: string): ContactLocation[] {
  const primary = locations.findIndex((location) => location.isPrimary);
  return locations.map((location, index) => ({
    ...location,
    mapEmbedUrl: cleanMapEmbedUrl(location.mapEmbedUrl ??
      (index === (primary < 0 ? 0 : primary) ? legacyMap : '') ?? ''),
  }));
}

export function parseContactArray<T>(value: unknown, fallback: T[] = []): T[] {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function getCampusContacts(contact?: ContactInfo | null): ContactLocation[] {
  if (!contact) return [];
  const locations = parseContactArray<ContactLocation>(contact.locations, contact.address ? [{
    id: 'main-campus', title: 'Main Campus', address: contact.address,
    addressLa: contact.addressLa, isPrimary: true,
  }] : []);
  const phones = parseContactArray<ContactPhone>(contact.phones,
    (contact.phone || '').split('/').map((number) => number.trim()).filter(Boolean)
      .map((number, index) => ({ id: `phone-${index}`, number, label: '' })));
  const emails = parseContactArray<ContactEmail>(contact.emails,
    (contact.email || '').split('/').map((email) => email.trim()).filter(Boolean)
      .map((email, index) => ({ id: `email-${index}`, email, label: '' })));
  const hours = parseContactArray<ContactOfficeHour>(contact.officeHoursList,
    contact.officeHours ? [{ id: 'hours', days: '', hours: contact.officeHours, hoursLa: contact.officeHoursLa }] : []);
  const primary = locations.findIndex((location) => location.isPrimary);
  return withLegacyCampusMap(locations, contact.mapEmbedUrl).map((location, index) => ({
    ...location,
    phones: location.phones ?? (index === (primary < 0 ? 0 : primary) ? phones : []),
    emails: location.emails ?? (index === (primary < 0 ? 0 : primary) ? emails : []),
    officeHoursList: location.officeHoursList ?? (index === (primary < 0 ? 0 : primary) ? hours : []),
  }));
}
