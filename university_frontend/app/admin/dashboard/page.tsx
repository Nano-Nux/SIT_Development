'use client';

import { useLocalizedContent } from '@/context/useLocalizedContent';

import { useLanguage } from '@/context/LanguageContext';
import { useUiTranslation } from '@/context/useUiTranslation';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import {
  FileCheck2,
  Inbox,
  BookOpen,
  Users,
  Newspaper,
  Calendar,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const localize = useLocalizedContent();
  const tr = useUiTranslation();
  const { lang } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (e) {
      console.error('Error loading dashboard stats:', e);
    } finally {
      setLoading(false);
    }
  };

  const counts = stats?.counts || stats?.overview;

  const statCards = [
    {
      title: 'Total Applications',
      value: counts?.totalApplications ?? 0,
      sub: `${counts?.pendingApplications ?? 0} Pending Review`,
      icon: FileCheck2,
      color: 'from-blue-600 to-indigo-600',
      href: '/admin/applications',
    },
    {
      title: 'Information Requests',
      value: counts?.totalInquiries ?? 0,
      sub: `${counts?.pendingInquiries ?? 0} Pending Contact`,
      icon: Inbox,
      color: 'from-cyan-500 to-blue-600',
      href: '/admin/request-info',
    },
    {
      title: 'Degree Programs',
      value: counts?.totalPrograms ?? 0,
      sub: 'Active Undergraduate & Graduate',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-600',
      href: '/admin/programs',
    },
    {
      title: 'Faculty & Mentors',
      value: counts?.totalFaculty ?? 0,
      sub: 'Published Profiles',
      icon: Users,
      color: 'from-purple-500 to-indigo-600',
      href: '/admin/faculty',
    },
    {
      title: 'News Articles',
      value: counts?.totalNews ?? 0,
      sub: 'Published Stories',
      icon: Newspaper,
      color: 'from-amber-500 to-orange-600',
      href: '/admin/news',
    },
    {
      title: 'Upcoming Events',
      value: counts?.totalEvents ?? 0,
      sub: 'Active Calendar Events',
      icon: Calendar,
      color: 'from-rose-500 to-pink-600',
      href: '/admin/events',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#00001C] via-[#0400CC] to-[#00B6FF] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-cyan-200 text-xs font-semibold border border-white/10">
            <Image
              src="/assets/sit-logo-icon.png"
              alt={tr('SIT Emblem')}
              width={18}
              height={18}
              className="w-4 h-4 object-contain"
            />
            <span>{tr('SIT University Central CMS')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {tr('Welcome to the Admin Command Dashboard')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
            {tr(
              'Monitor real-time student applications, manage academic catalog updates, and control dynamic content across all university website pages.',
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-2 bg-white text-[#0400CC] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md hover:bg-slate-100 transition-all"
          >
            <FileCheck2 className="w-4 h-4" />
            {tr('Review Applications')}
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/20 transition-all"
          >
            <span>{tr('Live Site')}</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {tr(localize(card, 'title'))}
                  </span>
                  <div className="text-3xl font-extrabold text-[#00001C] mt-2 group-hover:text-[#0400CC] transition-colors">
                    {loading ? '...' : card.value}
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-1 block">
                    {tr(card.sub)}
                  </span>
                </div>

                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0400CC]">
                <span>{tr('Manage Section')}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Submissions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-[#00001C] flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#0400CC]" />
              {tr('Recent Student Applications')}
            </h2>
            <Link
              href="/admin/applications"
              className="text-xs font-bold text-[#0400CC] hover:underline"
            >
              {tr('View All')}
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentApplications && stats.recentApplications.length > 0 ? (
              stats.recentApplications.map((app: any) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-[#00001C]">{app.fullName}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {app.intendedProgram} • {app.degreeLevel}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {tr(
                        new Date(app.createdAt).toLocaleDateString(
                          lang === 'ZH' ? 'zh-CN' : lang === 'LA' ? 'lo-LA' : 'en-US',
                        ),
                      )}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      app.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : app.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tr(app.status)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                {tr('No recent applications received.')}
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-[#00001C] flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#00B6FF]" />
              {tr('Recent Information Inquiries')}
            </h2>
            <Link
              href="/admin/request-info"
              className="text-xs font-bold text-[#0400CC] hover:underline"
            >
              {tr('View All')}
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
              stats.recentInquiries.map((inq: any) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-[#00001C]">{inq.fullName}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {inq.email} • {inq.programOfInterest}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {tr(
                        new Date(inq.createdAt).toLocaleDateString(
                          lang === 'ZH' ? 'zh-CN' : lang === 'LA' ? 'lo-LA' : 'en-US',
                        ),
                      )}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      inq.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : inq.status === 'CONTACTED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {tr(inq.status)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                {tr('No inquiries received yet.')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
