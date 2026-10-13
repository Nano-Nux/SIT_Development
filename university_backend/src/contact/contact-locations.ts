import { BadRequestException } from '@nestjs/common';

type CampusLocation = { isPrimary?: boolean; mapEmbedUrl?: string; [key: string]: unknown };

export function cleanMapEmbedUrl(input: string = ''): string {
  const value = input.trim();
  return (value.match(/src\s*=\s*["']([^"']+)["']/i)?.[1] || value).replace(/&amp;/g, '&');
}

export function normalizeLocations(value: unknown, legacyMap = '', validate = false): CampusLocation[] {
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
    return { ...location, mapEmbedUrl };
  });
}
