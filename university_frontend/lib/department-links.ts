export function getExternalDepartmentUrl(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function getDepartmentHref(department: { slug: string; externalUrl?: string | null }): string {
  return getExternalDepartmentUrl(department.externalUrl) || `/departments/${department.slug}`;
}
