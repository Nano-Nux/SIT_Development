'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Calendar, Clock, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { eventsApi, EventItem } from '@/lib/api';

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi.getEvent(slug)
      .then(setEvent)
      .catch((err) => {
        console.error('Error fetching event:', err);
        setEvent(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-32 text-slate-400">
          {t.events.loadingEvents}
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return notFound();
  }

  const dateObj = new Date(event.eventDate);
  const formattedDate = dateObj.toLocaleDateString(isLa ? 'lo-LA' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const title = (isLa && event.titleLa) ? event.titleLa : event.title;
  const summary = (isLa && event.summaryLa) ? event.summaryLa : event.summary;
  const content = (isLa && event.contentLa) ? event.contentLa : event.content;
  const location = (isLa && event.locationLa) ? event.locationLa : event.location;
  const time = (isLa && event.timeLa) ? event.timeLa : event.time;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow pt-28 sm:pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0400CC] hover:text-[#1E65FF] mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.events.backToAllEvents}
          </Link>

          <div className="space-y-4 mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 uppercase tracking-wider">
              {t.events.universityEventBadge}
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#00001C] tracking-tight leading-tight">
              {title}
            </h1>

            {/* Event Key Meta Card */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#0400CC] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-medium block">{t.events.dateLabel}</span>
                  <span className="font-bold text-[#00001C]">{formattedDate}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#0400CC] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-medium block">{t.events.timeLabel}</span>
                  <span className="font-bold text-[#00001C]">{time}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00B6FF] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-medium block">{t.events.locationLabel}</span>
                  <span className="font-bold text-[#00001C]">{location}</span>
                </div>
              </div>
            </div>
          </div>

          {event.imageUrl && (
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-video bg-slate-100 mb-10 border border-slate-200">
              <img
                src={event.imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {summary && (
            <div className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed mb-8 border-l-4 border-[#0400CC] pl-6 py-1">
              {summary}
            </div>
          )}

          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed space-y-6 text-slate-700 whitespace-pre-line">
            {content}
          </div>

          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[#00001C] to-[#0400CC] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-xl font-bold">{t.events.reservePlace}</h3>
              <p className="text-xs sm:text-sm text-slate-300">{t.events.reservePlaceDesc}</p>
            </div>
            <Link
              href={event.registrationUrl || '/apply'}
              className="inline-flex items-center gap-2 bg-white text-[#0400CC] hover:bg-slate-100 font-bold text-sm px-7 py-3.5 rounded-xl shadow-md shrink-0"
            >
              {t.events.registerForEvent}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
