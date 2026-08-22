'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { api, SpotlightItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export function SpotlightSection({ data }: { data?: SpotlightItem[] }) {
  const [testimonials, setTestimonials] = useState<SpotlightItem[]>(data || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { lang } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (!data || data.length === 0) {
      api.getSpotlights().then((res) => {
        if (res && res.length > 0) {
          setTestimonials(res);
        }
      }).catch(console.error);
    }
  }, [data]);

  if (testimonials.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex % testimonials.length];
  if (!current) return null;

  const quoteText = isLa
    ? (current.quoteLa || current.descriptionLa || current.quote || current.description)
    : (current.quote || current.description || current.quoteLa || current.descriptionLa);
  const authorName = isLa
    ? (current.authorNameLa || current.authorName)
    : (current.authorName || current.authorNameLa);
  const authorRole = isLa
    ? (current.authorRoleLa || current.authorRole)
    : (current.authorRole || current.authorRoleLa);
  const titleText = isLa
    ? (current.titleLa || current.title)
    : (current.title || current.titleLa);
  const hasImage = Boolean(current.imageUrl);

  // If the spotlight has literally nothing, skip
  if (!quoteText && !authorName && !authorRole && !titleText && !hasImage) {
    return null;
  }

  return (
    <section className="w-full bg-[#00001C] py-24 md:py-32 relative overflow-hidden text-white">
      {/* Background Lao floral motif */}
      <div className="absolute left-0 bottom-0 w-[600px] h-[600px] pointer-events-none opacity-10">
        <Image
          src="/images/lao-pattern.png"
          alt="Lao Pattern"
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-12 gap-12 lg:gap-16' : 'max-w-4xl mx-auto'} items-center`}>
          {/* Left Column: Quote & Author */}
          <div className={`${hasImage ? 'lg:col-span-7' : 'w-full text-center sm:text-left'} space-y-8`}>
            {/* Glowing Blue Quote Icon (only if quoteText exists) */}
            {quoteText && (
              <div className="text-[#0400CC] inline-block">
                <Quote className="w-16 h-16 sm:w-20 sm:h-20 fill-[#0400CC] text-[#0400CC] rotate-180 opacity-90" />
              </div>
            )}

            {/* Display Quote */}
            {quoteText && (
              <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold leading-tight sm:leading-tight text-white tracking-tight">
                {quoteText}
              </blockquote>
            )}

            {/* Author Meta (only if any author field exists) */}
            {(authorName || authorRole || titleText) && (
              <div className="pt-2">
                {authorName && (
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {authorName}
                  </h3>
                )}
                {authorRole && (
                  <p className="text-sm sm:text-base text-slate-300 font-medium">
                    {authorRole}
                  </p>
                )}
                {titleText && (
                  <p className="text-xs sm:text-sm text-cyan-400 mt-0.5 font-semibold">
                    {titleText}
                  </p>
                )}
              </div>
            )}

            {/* Previous / Next Controls */}
            {testimonials.length > 1 && (
              <div className={`flex items-center gap-4 pt-4 ${!hasImage ? 'justify-center sm:justify-start' : ''}`}>
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full border border-white/20 hover:border-white/60 hover:bg-white/10 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
                  aria-label="Previous Testimonial"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full border border-white/20 hover:border-white/60 hover:bg-white/10 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
                  aria-label="Next Testimonial"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Student Image Card (only rendered if imageUrl exists) */}
          {hasImage && (
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[460px] aspect-[4/4.5] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-gradient-to-b from-white/10 to-transparent p-2">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src={current.imageUrl!}
                    alt={authorName || titleText || 'Spotlight'}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00001C]/80 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

