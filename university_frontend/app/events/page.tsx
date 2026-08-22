'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { eventsApi, EventItem } from '@/lib/api';

export default function EventsPage() {
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi
      .getEvents()
      .then((data) => setEvents(data || []))
      .catch((err) => {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 bg-[#00001C] text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#00B6FF] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>{t.events.calendar}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {t.events.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300">
                {t.events.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Events List */}
        <section className="py-16 sm:py-24 bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-16 text-slate-400">{t.events.loadingEvents}</div>
            ) : events.length > 0 ? (
              <div className="space-y-6">
                {events.map((event, idx) => {
                  const dateObj = new Date(event.eventDate);
                  const month = dateObj.toLocaleDateString(isLa ? 'lo-LA' : 'en-US', { month: 'short' });
                  const day = dateObj.getDate();
                  const eventTitle = (isLa && event.titleLa) ? event.titleLa : event.title;
                  const eventSummary = (isLa && event.summaryLa) ? event.summaryLa : event.summary;
                  const eventTime = (isLa && event.timeLa) ? event.timeLa : event.time;
                  const eventLocation = (isLa && event.locationLa) ? event.locationLa : event.location;

                  return (
                    <div
                      key={event.id || idx}
                      className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:-translate-y-1"
                    >
                      <div className="flex items-start sm:items-center gap-6">
                        {/* Date badge */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00001C] to-[#0400CC] text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 leading-none">
                            {month}
                          </span>
                          <span className="text-xl font-black leading-tight mt-0.5">
                            {day}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg sm:text-xl font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug">
                            <Link href={`/events/${event.slug}`}>
                              {eventTitle}
                            </Link>
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                            {eventSummary}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold pt-1">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#0400CC]" />
                              {eventTime}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#00B6FF]" />
                              {eventLocation}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 w-full sm:w-auto">
                        <Link
                          href={`/events/${event.slug}`}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-[#0400CC] text-[#0400CC] hover:text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl border border-slate-200 hover:border-[#0400CC] transition-all"
                        >
                          {t.events.viewDetailsRSVP}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500">
                {t.events.noEventsFound}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
