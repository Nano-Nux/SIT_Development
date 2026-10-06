'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Calendar, Search, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { newsApi, NewsArticle } from '@/lib/api';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { getGalleryImages } from '@/lib/image-gallery';

export default function NewsPage() {
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [category, search]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await newsApi.getNews({
        category: category !== 'All' ? category : undefined,
        search: search || undefined,
      });
      setNews(data.items || []);
    } catch (e) {
      console.error('Failed to fetch news:', e);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Academics', 'Student Achievement', 'Campus Life', 'General'];

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
                <span>{t.news.newsroom}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {t.news.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300">
                {t.news.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="py-8 bg-[#F8FAFC] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-[#0400CC] text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0400CC]/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.news.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
              />
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-16 text-slate-400">{t.news.loadingArticles}</div>
            ) : news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item, idx) => {
                  const title = (isLa && item.titleLa) ? item.titleLa : item.title;
                  const summary = (isLa && item.summaryLa) ? item.summaryLa : item.summary;
                  const categoryName = (isLa && item.categoryLa) ? item.categoryLa : item.category;

                  return (
                    <article
                      key={item.id || idx}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                    >
                      <div>
                        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                          <ImageGallery
                            images={getGalleryImages(item, `/images/home_desktopview/img_${(idx % 3) + 1}.jpg`)}
                            alt={title}
                            aspectRatio="aspect-[16/10]"
                          />
                          <span className="absolute top-3 left-3 bg-[#0400CC] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {categoryName}
                          </span>
                        </div>

                        <div className="p-6 sm:p-7 space-y-3">
                          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#0400CC]" />
                              {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(isLa ? 'lo-LA' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : t.news.recently}
                            </span>
                          </div>

                          <h3 className="text-lg sm:text-xl font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug">
                            <Link href={`/news/${item.slug}`}>
                              {title}
                            </Link>
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                            {summary}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 sm:p-7 pt-0">
                        <Link
                          href={`/news/${item.slug}`}
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0400CC] hover:text-[#1E65FF] transition-colors"
                        >
                          <span>{t.common.readFullStory}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500">
                {t.news.noArticlesFound}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
