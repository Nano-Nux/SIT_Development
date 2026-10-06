'use client';

import { useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
  aspectRatio?: string;
  fit?: 'cover' | 'contain';
}

export function ImageGallery({
  images,
  alt,
  className = '',
  aspectRatio = 'aspect-video',
  fit = 'cover',
}: ImageGalleryProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const id = useId();
  const [index, setIndex] = useState(0);
  const { lang } = useLanguage();
  const isLa = lang === 'LA';

  if (!images.length) return null;

  const navigate = (next: number) => {
    const container = viewport.current;
    if (!container) return;
    const target = Math.max(0, Math.min(images.length - 1, next));
    container.scrollTo({
      left: target * container.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  };

  return (
    <div
      className={`relative min-w-0 overflow-hidden bg-slate-100 ${className}`}
      role="region"
      aria-label={alt}
      aria-roledescription="carousel"
    >
      <div
        id={id}
        ref={viewport}
        tabIndex={images.length > 1 ? 0 : undefined}
        className={`flex w-full overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-[#0400CC] ${aspectRatio}`}
        onScroll={(event) => {
          const container = event.currentTarget;
          if (container.clientWidth)
            setIndex(
              Math.max(
                0,
                Math.min(
                  images.length - 1,
                  Math.round(container.scrollLeft / container.clientWidth),
                ),
              ),
            );
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            navigate(index + (event.key === 'ArrowRight' ? 1 : -1));
          }
        }}
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-full w-full shrink-0 snap-center snap-always"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} (${i + 1}/${images.length})`}
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable={false}
              className={`h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label={isLa ? 'ຮູບກ່ອນໜ້າ' : 'Previous image'}
            aria-controls={id}
            disabled={index === 0}
            onClick={() => navigate(index - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white shadow hover:bg-black/80 disabled:opacity-30 disabled:cursor-default cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={isLa ? 'ຮູບຕໍ່ໄປ' : 'Next image'}
            aria-controls={id}
            disabled={index >= images.length - 1}
            onClick={() => navigate(index + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white shadow hover:bg-black/80 disabled:opacity-30 disabled:cursor-default cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <span
            role="status"
            aria-live="polite"
            className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white"
          >
            {index + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}
