import { ContactLocation } from './api/types';

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
