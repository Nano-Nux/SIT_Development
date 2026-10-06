import { BadRequestException } from '@nestjs/common';

export function imageGalleryData(data: {
  imageUrl?: string | null;
  imageUrls?: unknown;
}): { imageUrl?: string | null; imageUrls?: string[] } {
  // Older clients can still save a single cover; unrelated edits preserve the gallery.
  if (data.imageUrls === undefined) return { imageUrl: data.imageUrl };

  if (
    !Array.isArray(data.imageUrls) ||
    data.imageUrls.some(
      (url: unknown) => typeof url !== 'string' || !url.trim(),
    )
  ) {
    throw new BadRequestException(
      'imageUrls must be an array of non-empty image URLs',
    );
  }

  const imageUrls = [
    ...new Set<string>(data.imageUrls.map((url: string) => url.trim())),
  ];
  return { imageUrls, imageUrl: imageUrls[0] ?? null };
}
