'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';

export function HeroSection() {
  const [images, setImages] = useState({
    img1: '/images/home_desktopview/img_1.jpg',
    img2: '/images/home_desktopview/img_1.jpg',
    img3: '/images/home_desktopview/img_2.jpg',
    img4: '/images/home_desktopview/img_1.jpg',
  });

  useEffect(() => {
    api.getHero('HOME')
      .then((res) => {
        if (res) {
          setImages({
            img1: res.imageUrl || '/images/home_desktopview/img_1.jpg',
            img2: res.image2Url || '/images/home_desktopview/img_1.jpg',
            img3: res.image3Url || '/images/home_desktopview/img_2.jpg',
            img4: res.image4Url || '/images/home_desktopview/img_1.jpg',
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="relative w-full bg-[#00001C] pt-[90px] sm:pt-[105px] overflow-hidden">
      {/* 4-Panel Vertical Showcase Container */}
      <div className="w-full max-w-[1280px] mx-auto h-[480px] sm:h-[600px] md:h-[720px] grid grid-cols-4 gap-1.5 sm:gap-2 px-2 sm:px-4">
        {/* Panel 1 */}
        <div className="relative h-full overflow-hidden rounded-md sm:rounded-lg group">
          <div className="absolute inset-0 z-0">
            <Image
              src={images.img1}
              alt="SIT University Students"
              fill
              className="object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-[#00001C]/50 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0400CC]/80 via-[#00001C]/60 to-transparent" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 select-none pointer-events-none">
            <span className="text-white/20 font-black text-xl sm:text-2xl md:text-3xl tracking-widest uppercase whitespace-nowrap">
              SIT UNIV
            </span>
          </div>
        </div>

        {/* Panel 2 */}
        <div className="relative h-full overflow-hidden rounded-md sm:rounded-lg group">
          <div className="absolute inset-0 z-0">
            <Image
              src={images.img2}
              alt="SIT University Achievement Award"
              fill
              className="object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-[#00001C]/50 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0400CC]/80 via-[#00001C]/60 to-transparent" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 select-none pointer-events-none">
            <span className="text-white/20 font-black text-xl sm:text-2xl md:text-3xl tracking-widest uppercase whitespace-nowrap">
              SIT UNIV
            </span>
          </div>
        </div>

        {/* Panel 3 */}
        <div className="relative h-full overflow-hidden rounded-md sm:rounded-lg group">
          <div className="absolute inset-0 z-0">
            <Image
              src={images.img3}
              alt="SIT University Academic Excellence"
              fill
              className="object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-[#00001C]/50 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0400CC]/80 via-[#00001C]/60 to-transparent" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 select-none pointer-events-none">
            <span className="text-white/20 font-black text-xl sm:text-2xl md:text-3xl tracking-widest uppercase whitespace-nowrap">
              SIT UNIV
            </span>
          </div>
        </div>

        {/* Panel 4 */}
        <div className="relative h-full overflow-hidden rounded-md sm:rounded-lg group">
          <div className="absolute inset-0 z-0">
            <Image
              src={images.img4}
              alt="SIT University Campus Community"
              fill
              className="object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-[#00001C]/50 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0400CC]/80 via-[#00001C]/60 to-transparent" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 select-none pointer-events-none">
            <span className="text-white/20 font-black text-xl sm:text-2xl md:text-3xl tracking-widest uppercase whitespace-nowrap">
              SIT UNIV
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
