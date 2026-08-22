import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AboutHero } from '@/components/about/AboutHero';
import { FounderSection } from '@/components/about/FounderSection';
import { MembersSection } from '@/components/about/MembersSection';
import { HistoryTimeline } from '@/components/about/HistoryTimeline';
import { VisionMissionSection } from '@/components/about/VisionMissionSection';
import { CTABanner } from '@/components/home/CTABanner';
import { ContactSection } from '@/components/about/ContactSection';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <AboutHero />
        <FounderSection />
        <MembersSection />
        <HistoryTimeline />
        <VisionMissionSection />
        <CTABanner />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
