'use client';

import { useEffect, useState } from 'react';
import { api, HeroData } from '@/lib/api';
import { HeroVideo } from '@/components/ui/HeroVideo';

export function HeroSection() {
  const [hero, setHero] = useState<HeroData | null>(null);

  useEffect(() => {
    api.getHero('HOME').then(setHero).catch(console.error);
  }, []);

  return (
    <section className="relative w-full bg-[#00001C] pt-[90px] sm:pt-[105px] overflow-hidden">
      <div className="w-full max-w-[1280px] mx-auto h-[480px] sm:h-[600px] md:h-[720px] px-2 sm:px-4">
        <HeroVideo
          key={hero?.bgVideoUrl || 'video'}
          src={hero?.bgVideoUrl}
          className="h-full w-full rounded-md sm:rounded-lg"
        />
      </div>
    </section>
  );
}
