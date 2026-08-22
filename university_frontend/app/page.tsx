import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { IntroSection } from '@/components/home/IntroSection';
import { CoreValuesSection } from '@/components/home/CoreValuesSection';
import { MajorsSection } from '@/components/home/MajorsSection';
import { SpotlightSection } from '@/components/home/SpotlightSection';
import { FacultySection } from '@/components/home/FacultySection';
import { CTABanner } from '@/components/home/CTABanner';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <IntroSection />
        <CoreValuesSection />
        <MajorsSection />
        <SpotlightSection />
        <FacultySection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
