'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, ArrowRight, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Modal } from '../ui/Modal';
import { api, CampusFacilityItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { getGalleryImages } from '@/lib/image-gallery';

interface CampusFacilitiesSectionProps {
  data?: CampusFacilityItem[];
}

export function CampusFacilitiesSection({ data = [] }: CampusFacilitiesSectionProps) {
  const [facilities, setFacilities] = useState<CampusFacilityItem[]>(data);
  const [selectedFacility, setSelectedFacility] = useState<CampusFacilityItem | null>(null);
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (data.length === 0) {
      api.getCampusFacilities().then((res) => {
        if (res && res.length > 0) {
          setFacilities(res);
        }
      }).catch(console.error);
    }
  }, [data]);

  const items = facilities;

  const handleFacilityClick = (facility: CampusFacilityItem) => {
    if (facility.actionType === 'MODAL') {
      setSelectedFacility(facility);
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.about.facilitiesBadge}
          title={t.about.facilitiesTitle}
          subtitle={t.about.facilitiesSubtitle}
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {items.map((fac, idx) => {
            const isRedirect = fac.actionType === 'REDIRECT';
            const name = (isLa && fac.nameLa) ? fac.nameLa : fac.name;
            const description = (isLa && fac.descriptionLa) ? fac.descriptionLa : fac.description;

            return (
              <div
                key={fac.id || idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <ImageGallery
                      images={getGalleryImages(fac, `/images/life_at_sit_desktopview/img_${idx + 1}.jpg`)}
                      alt={name}
                      aspectRatio="aspect-[16/10]"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-base sm:text-lg font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug mb-2">
                      {name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {isRedirect && fac.destinationUrl ? (
                    <Link
                      href={fac.destinationUrl}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-[#0400CC] text-[#0400CC] hover:text-white text-xs font-bold py-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
                    >
                      <span>{t.about.exploreFacility}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleFacilityClick(fac)}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0400CC]/10 hover:bg-[#0400CC] text-[#0400CC] hover:text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      <span>{t.about.quickView}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Modal */}
      {selectedFacility && (
        <Modal
          isOpen={!!selectedFacility}
          onClose={() => setSelectedFacility(null)}
          title={isLa ? (selectedFacility.modalTitleLa || selectedFacility.nameLa || selectedFacility.modalTitle || selectedFacility.name) : (selectedFacility.modalTitle || selectedFacility.name)}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <ImageGallery
              key={selectedFacility.id}
              images={getGalleryImages(selectedFacility)}
              alt={isLa && selectedFacility.nameLa ? selectedFacility.nameLa : selectedFacility.name}
              fit="contain"
              className="rounded-xl"
            />
            <p className="text-sm text-slate-700 leading-relaxed">
              {isLa
                ? (selectedFacility.modalContentLa || selectedFacility.descriptionLa || selectedFacility.modalContent || selectedFacility.description)
                : (selectedFacility.modalContent || selectedFacility.description)}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedFacility(null)}
                className="px-5 py-2 rounded-xl bg-[#0400CC] text-white font-bold text-xs cursor-pointer hover:bg-[#030099]"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
