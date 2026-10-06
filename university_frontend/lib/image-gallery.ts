export function getGalleryImages(
  item: { imageUrls?: string[] | null; imageUrl?: string | null },
  fallback?: string,
): string[] {
  const images =
    item.imageUrls?.filter((url) => typeof url === 'string' && url.trim()) ??
    [];
  const cover = item.imageUrl || fallback;
  return images.length ? [...new Set(images)] : cover ? [cover] : [];
}
