'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { api, NewsArticle, EventItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface NewsEventsSectionProps {
  newsData?: NewsArticle[];
  eventsData?: EventItem[];
}

export function NewsEventsSection({
  newsData = [],
  eventsData = [],
}: NewsEventsSectionProps) {
  const [news, setNews] = useState<NewsArticle[]>(newsData);
  const [events, setEvents] = useState<EventItem[]>(eventsData);
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  useEffect(() => {
    if (newsData.length === 0) {
      api.getNews({ limit: 2 }).then((res) => {
        if (res && res.items) setNews(res.items);
      }).catch(console.error);
    }
  }, [newsData]);

  useEffect(() => {
    if (eventsData.length === 0) {
      api.getEvents({ limit: 2 }).then((res: any) => {
        if (Array.isArray(res)) setEvents(res);
        else if (res && res.items) setEvents(res.items);
      }).catch(console.error);
    }
  }, [eventsData]);

  const newsList = news.slice(0, 2);
  const eventsList = events.slice(0, 2);

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Left Col: Latest News */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-[#0400CC] uppercase tracking-wider block mb-1">
                  {t.home.newsBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00001C]">
                  {t.home.newsTitle}
                </h2>
              </div>
              <Link
                href="/news"
                className="text-xs sm:text-sm font-bold text-[#0400CC] hover:text-[#1E65FF] flex items-center gap-1"
              >
                {t.common.viewAll}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-6">
              {newsList.map((item, idx) => {
                const title = (isLa && item.titleLa) ? item.titleLa : item.title;
                const summary = (isLa && item.summaryLa) ? item.summaryLa : item.summary;
                const category = (isLa && item.categoryLa) ? item.categoryLa : item.category;

                return (
                  <article
                    key={item.id || idx}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col sm:flex-row gap-6 items-start"
                  >
                    <div className="w-full sm:w-44 sm:h-32 aspect-video sm:aspect-auto rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={item.imageUrl || `/images/home_desktopview/img_${idx + 1}.jpg`}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="text-[#0400CC] font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                          {category}
                        </span>
                        <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(isLa ? 'lo-LA' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug">
                        <Link href={`/news/${item.slug}`}>
                          {title}
                        </Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {summary}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Right Col: Upcoming Events */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-[#00B6FF] uppercase tracking-wider block mb-1">
                  {t.home.eventsBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00001C]">
                  {t.home.eventsTitle}
                </h2>
              </div>
              <Link
                href="/events"
                className="text-xs sm:text-sm font-bold text-[#0400CC] hover:text-[#1E65FF] flex items-center gap-1"
              >
                {t.home.allEvents}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {eventsList.map((event, idx) => {
                const dateObj = new Date(event.eventDate);
                const month = dateObj.toLocaleDateString(isLa ? 'lo-LA' : 'en-US', { month: 'short' });
                const day = dateObj.getDate();
                const eventTitle = (isLa && event.titleLa) ? event.titleLa : event.title;
                const eventTime = (isLa && event.timeLa) ? event.timeLa : event.time;
                const eventLocation = (isLa && event.locationLa) ? event.locationLa : event.location;

                return (
                  <div
                    key={event.id || idx}
                    className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200 hover:border-[#0400CC]/30 hover:bg-white hover:shadow-md transition-all duration-300 flex items-start gap-4 group"
                  >
                    {/* Date Badge */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#00001C] to-[#0400CC] text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 leading-none">
                        {month}
                      </span>
                      <span className="text-lg font-black leading-tight mt-0.5">
                        {day}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug">
                        <Link href={`/events/${event.slug}`}>
                          {eventTitle}
                        </Link>
                      </h3>
                      <div className="flex flex-col gap-1 text-xs text-slate-500 font-medium">
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
