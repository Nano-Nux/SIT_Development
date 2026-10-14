import { BadRequestException } from '@nestjs/common';

type CampusContactRow = { id: string; number?: string; email?: string; days?: string; daysLa?: string; hours?: string; hoursLa?: string; [key: string]: unknown };
type LegacyContact = { phones?: unknown; emails?: unknown; officeHoursList?: unknown };

function contactRows(value: unknown): CampusContactRow[] {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

type CampusLocation = { isPrimary?: boolean; mapEmbedUrl?: string; phones?: CampusContactRow[]; emails?: CampusContactRow[]; officeHoursList?: CampusContactRow[]; [key: string]: unknown };

export function cleanMapEmbedUrl(input: string = ''): string {
  const value = input.trim();
  return (value.match(/src\s*=\s*["']([^"']+)["']/i)?.[1] || value).replace(/&amp;/g, '&');
}

export function normalizeLocations(value: unknown, legacyMap = '', validate = false, legacy: LegacyContact = {}): CampusLocation[] {
  let parsed: unknown;
  try {
    parsed = typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    throw new BadRequestException('Campus locations must be a valid array.');
  }
  if (!Array.isArray(parsed) || parsed.some((location) => !location || typeof location !== 'object' || Array.isArray(location))) {
    throw new BadRequestException('Campus locations must be a valid array.');
  }
  const locations = parsed as CampusLocation[];
  const primary = locations.findIndex((location) => location.isPrimary);
  return locations.map((location, index) => {
    const input = location.mapEmbedUrl ?? (index === (primary < 0 ? 0 : primary) ? legacyMap : '');
    if (typeof input !== 'string') throw new BadRequestException('Campus map must be a Google Maps embed URL.');
    const mapEmbedUrl = cleanMapEmbedUrl(input);
    if (validate && mapEmbedUrl) {
      let valid = false;
      try {
        const url = new URL(mapEmbedUrl);
        valid = url.protocol === 'https:' &&
          ['www.google.com', 'google.com', 'maps.google.com'].includes(url.hostname) &&
          (url.pathname === '/maps/embed' || url.pathname.startsWith('/maps/embed/'));
      } catch {}
      if (!valid) throw new BadRequestException('Use the Google Maps embed URL or iframe for each campus.');
    }
    const isPrimary = index === (primary < 0 ? 0 : primary);
    const details: Pick<CampusLocation, 'phones' | 'emails' | 'officeHoursList'> = {};
    for (const field of ['phones', 'emails', 'officeHoursList'] as const) {
      const rows = location[field] ?? (isPrimary ? contactRows(legacy[field]) : []);
      if (!Array.isArray(rows) || rows.some((row) => !row || typeof row !== 'object' || Array.isArray(row))) {
        throw new BadRequestException(`Campus ${field} must be an array.`);
      }
      if (validate) {
        for (const row of rows) {
          const required = field === 'phones' ? ['number'] : field === 'emails' ? ['email'] : ['days', 'hours'];
          if (required.some((key) => typeof row[key] !== 'string' || !(row[key] as string).trim())) {
            throw new BadRequestException(`Complete all required campus ${field} fields.`);
          }
        }
      }
      details[field] = rows;
    }
    return { ...location, mapEmbedUrl, ...details };
  });
}
