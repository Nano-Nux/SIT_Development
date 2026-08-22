'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  Award,
  Layers,
  GraduationCap,
  BookOpen,
  Users,
  UserCheck,
  Star,
  Globe2,
  Share2,
  MapPin,
  Building2,
  Newspaper,
  Calendar,
  HeartHandshake,
  Compass,
  FileCheck2,
  Inbox,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, token, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !token && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [loading, token, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !token) {
    return (
      <div className="min-h-screen bg-[#00001C] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0400CC] border-t-[#00B6FF] rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-400">Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  const menuSections = [
    {
      group: 'Overview',
      items: [
        { name: 'Dashboard Analytics', href: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Homepage & Core',
      items: [
        { name: 'Hero Sections', href: '/admin/hero', icon: Sparkles },
        { name: 'Core Values', href: '/admin/core-values', icon: Award },
        { name: 'Spotlights', href: '/admin/spotlights', icon: Star },
        { name: 'Partners & Alliances', href: '/admin/partners', icon: Globe2 },
        { name: 'Social Media Links', href: '/admin/social-links', icon: Share2 },
        { name: 'Contact Information', href: '/admin/contact', icon: MapPin },
      ],
    },
    {
      group: 'Academics & Faculty',
      items: [
        { name: 'Departments & Majors', href: '/admin/departments', icon: GraduationCap },
        { name: 'Degree Programs', href: '/admin/programs', icon: BookOpen },
        { name: 'Faculty & Mentors', href: '/admin/faculty', icon: Users },
        { name: 'Program Directors', href: '/admin/program-directors', icon: UserCheck },
      ],
    },
    {
      group: 'Campus & Student Life',
      items: [
        { name: 'Campus Facilities', href: '/admin/campus', icon: Building2 },
        { name: 'Student Life & Clubs', href: '/admin/student-life', icon: HeartHandshake },
        { name: 'About, Founder & Vision', href: '/admin/about', icon: Compass },
      ],
    },
    {
      group: 'News & Events',
      items: [
        { name: 'News Articles', href: '/admin/news', icon: Newspaper },
        { name: 'Events Calendar', href: '/admin/events', icon: Calendar },
      ],
    },
    {
      group: 'Admissions & Inquiries',
      items: [
        { name: 'How To Apply & Admissions', href: '/admin/how-to-apply', icon: FileCheck2 },
        { name: 'Student Applications', href: '/admin/applications', icon: FileCheck2 },
        { name: 'Information Requests', href: '/admin/request-info', icon: Inbox },
      ],
    },
    {
      group: 'System & Media',
      items: [
        { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Navigation */}
      <header className="bg-[#00001C] text-white border-b border-white/10 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0400CC] to-[#00B6FF] flex items-center justify-center shadow-md">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                SIT <span className="text-[#00B6FF]">CMS</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {user && (
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                <div className="flex flex-col text-right hidden md:block">
                  <span className="text-xs font-bold text-white leading-tight">{user.fullName || user.email}</span>
                  <span className="text-[10px] text-cyan-300 font-semibold uppercase">{user.role}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Admin Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block overflow-y-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Mobile close button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
            <span className="font-bold text-xs uppercase text-slate-500">Navigation Menu</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {menuSections.map((sec, sidx) => (
              <div key={sidx} className="space-y-1">
                <h4 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {sec.group}
                </h4>
                {sec.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#0400CC] text-white font-bold shadow-sm'
                          : 'text-slate-600 hover:text-[#0400CC] hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Backdrop for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Admin Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
