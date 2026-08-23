'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Calendar, User, Eye, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { newsApi, NewsArticle } from '@/lib/api';

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsApi.getNewsArticle(slug)
      .then(setArticle)
      .catch((err) => {
        console.error('Error fetching news article:', err);
        setArticle(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-32 text-slate-400">
          {t.news.loadingArticles}
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return notFound();
  }

  const title = (isLa && article.titleLa) ? article.titleLa : article.title;
  const summary = (isLa && article.summaryLa) ? article.summaryLa : article.summary;
  const content = (isLa && article.contentLa) ? article.contentLa : article.content;
  const category = (isLa && article.categoryLa) ? article.categoryLa : article.category;
  const author = (isLa && article.authorLa) ? article.authorLa : article.author;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow pt-28 sm:pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0400CC] hover:text-[#1E65FF] mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.news.backToAllNews}
          </Link>

          {/* Article Header */}
          <div className="space-y-4 mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0400CC] uppercase tracking-wider">
              {category}
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#00001C] tracking-tight leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-500 pt-2 border-b border-slate-100 pb-6">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-[#0400CC]" />
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString(isLa ? 'lo-LA' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : t.news.recently}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-[#00B6FF]" />
                {author}
              </span>
              {article.views !== undefined && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Eye className="w-4 h-4 text-slate-400" />
                  {article.views} {t.news.reads}
                </span>
              )}
            </div>
          </div>

          {/* Main Image */}
          {article.imageUrl && (
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-video bg-slate-100 mb-10 border border-slate-200">
              <img
                src={article.imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Summary Lead */}
          {summary && (
            <div className="text-base sm:text-xl font-medium text-slate-700 leading-relaxed mb-8 border-l-4 border-[#0400CC] pl-6 py-1">
              {summary}
            </div>
          )}

          {/* Article Full Content */}
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed space-y-6 text-slate-700 whitespace-pre-line">
            {content}
          </div>

          {/* Bottom Actions */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex items-center justify-between">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0400CC] hover:text-[#1E65FF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.news.backToAllNews}</span>
            </Link>
            <Link
              href="/news"
              className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#0400CC] transition-colors"
            >
              {t.news.exploreMore}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
