import { BadRequestException } from '@nestjs/common';
import { imageGalleryData } from './image-gallery';

describe('image gallery persistence', () => {
  it('keeps ordered images and uses the first image as the cover', () => {
    expect(
      imageGalleryData({ imageUrls: ['/second.jpg', '/first.jpg'] }),
    ).toEqual({
      imageUrls: ['/second.jpg', '/first.jpg'],
      imageUrl: '/second.jpg',
    });
  });

  it('clears the cover when every image is removed', () => {
    expect(imageGalleryData({ imageUrl: '/old.jpg', imageUrls: [] })).toEqual({
      imageUrls: [],
      imageUrl: null,
    });
  });

  it('preserves gallery fields when an unrelated field is updated', () => {
    expect(imageGalleryData({})).toEqual({ imageUrl: undefined });
    expect(imageGalleryData({})).not.toHaveProperty('imageUrls');
  });

  it('supports older clients that send only a cover image', () => {
    expect(imageGalleryData({ imageUrl: '/legacy.jpg' })).toEqual({
      imageUrl: '/legacy.jpg',
    });
  });

  it('trims URLs and removes duplicates without changing their order', () => {
    expect(
      imageGalleryData({ imageUrls: [' /a.jpg ', '/b.jpg', '/a.jpg'] }),
    ).toEqual({
      imageUrls: ['/a.jpg', '/b.jpg'],
      imageUrl: '/a.jpg',
    });
  });

  it.each([null, '/a.jpg', {}, [42], [''], ['  '], [null]])(
    'rejects invalid gallery input: %j',
    (imageUrls) => {
      expect(() => imageGalleryData({ imageUrls })).toThrow(
        BadRequestException,
      );
    },
  );
});
