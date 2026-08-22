'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  ChevronDown,
  Search,
  X
} from 'lucide-react';
import { MobileNav } from './MobileNav';
import { useLanguage } from '@/context/LanguageContext';
import { api, Department } from '@/lib/api';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.getDepartments()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDepartments(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load departments for navigation:', err);
      });
  }, []);

  const academicsDropdown = departments.length > 0
    ? departments
        .filter((d) => d.isActive !== false)
        .map((d) => ({
          name: (lang === 'LA' ? (d.nameLa || d.name) : (d.name || d.nameLa)) || d.slug || 'Department',
          href: `/departments/${d.slug}`,
        }))
    : [
        { name: t.nav.deptIT, href: '/departments/it' },
        { name: t.nav.deptBA, href: '/departments/ba-economics' },
        { name: t.nav.deptCA, href: '/departments/communication-arts' },
      ];

  interface NavLinkItem {
    name: string;
    href: string;
    dropdown?: { name: string; href: string }[];
  }

  const navLinks: NavLinkItem[] = [
    {
      name: t.nav.academics,
      href: '/academics',
      dropdown: academicsDropdown,
    },
    {
      name: t.nav.collaborations,
      href: '/collaborations',
    },
    {
      name: t.nav.admission,
      href: '/admissions',
    },
    {
      name: t.nav.lifeAtSIT,
      href: '/life-at-sit',
    },
    {
      name: t.nav.about,
      href: '/about',
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
        {/* Top Info Bar: Solid Dark Blue (Zero Transparency) */}
        <div className="bg-[#00001C] text-white/80 text-[12px] py-1.5 px-4 sm:px-8 border-b border-white/10">
          <div className="max-w-[1280px] mx-auto flex items-center justify-end gap-3 sm:gap-5">
            <div className="hidden md:flex items-center gap-5">
              <Link
                href="/news"
                className="text-white/80 hover:text-white transition-colors"
              >
                {t.nav.newsEvents}
              </Link>
              <span className="text-white/30">|</span>
              <Link
                href="/about#members"
                className="text-white/80 hover:text-white transition-colors"
              >
                {t.nav.alumni}
              </Link>
              <span className="text-white/30">|</span>
              <Link
                href="/contact"
                className="text-white/80 hover:text-white transition-colors"
              >
                {t.nav.careers}
              </Link>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#000028] border border-white/20 rounded-md px-1 py-0.5">
              <button
                onClick={() => setLang('EN')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${lang === 'EN'
                  ? 'bg-[#0400CC] text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
                  }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <span className="text-white/30 text-[10px] mx-0.5">|</span>
              <button
                onClick={() => setLang('LA')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${lang === 'LA'
                  ? 'bg-[#0400CC] text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
                  }`}
                aria-label="Switch to Lao"
              >
                LA
              </button>
            </div>

            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="text-white/80 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Open Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Nav Bar: Transparent / Opacity */}
        <nav
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? 'bg-[#00001C]/75 backdrop-blur-xl shadow-xl py-3 border-b border-white/15'
              : 'bg-[#00001C]/25 backdrop-blur-md py-4 border-b border-white/10 hover:bg-[#00001C]/40'
          }`}
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative h-10 sm:h-12 w-48 sm:w-56">
                <Image
                  src="/assets/sit-logo.png"
                  alt="Soutsaka Institute of Technology"
                  fill
                  className="object-contain object-left brightness-110"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href));
                const hasDropdown = Boolean(link.dropdown && link.dropdown.length > 0);

                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => {
                      if (hasDropdown) setActiveDropdown(link.name);
                    }}
                    onMouseLeave={() => {
                      if (hasDropdown) setActiveDropdown(null);
                    }}
                  >
                    <Link
                      href={link.href}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold tracking-wider transition-all duration-200 ${isActive
                        ? 'bg-white/20 text-white shadow-inner font-bold'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <span>{link.name}</span>
                      {hasDropdown && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180 text-white' : ''
                            }`}
                        />
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    {hasDropdown && link.dropdown && (
                      <div
                        className={`absolute top-full left-0 w-72 pt-2.5 transition-all duration-200 ${activeDropdown === link.name
                          ? 'opacity-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 translate-y-2 pointer-events-none'
                          }`}
                      >
                        <div className="bg-[#00001C]/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-2 overflow-hidden">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block px-3.5 py-2.5 rounded-xl text-xs font-medium text-white/80 hover:bg-[#0400CC] hover:text-white transition-all"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Apply Now CTA Button & Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/apply"
                className="hidden lg:inline-flex items-center justify-center bg-white hover:bg-slate-100 text-[#0400CC] text-[13px] font-bold tracking-wider px-5 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {t.common.applyNow}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex lg:hidden p-1.5 -mr-1 rounded-lg text-white hover:bg-white/10 focus:outline-none cursor-pointer items-center justify-center"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <MobileNav
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          links={navLinks}
        />
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 px-4">
          <div className="bg-[#00001C] border border-white/20 rounded-2xl w-full max-w-xl p-6 shadow-2xl animate-fade-in text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-[#00B6FF]" />
                <span className="font-bold text-sm tracking-wider uppercase">
                  {t.nav.searchTitle}
                </span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.common.searchPlaceholder}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#0400CC]"
                autoFocus
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="text-white/40">{t.common.popular}</span>
              <Link
                href="/academics"
                onClick={() => setSearchOpen(false)}
                className="bg-white/10 hover:bg-[#0400CC] px-2.5 py-1 rounded-md text-white/80 transition-colors"
              >
                {t.nav.deptIT}
              </Link>
              <Link
                href="/admissions"
                onClick={() => setSearchOpen(false)}
                className="bg-white/10 hover:bg-[#0400CC] px-2.5 py-1 rounded-md text-white/80 transition-colors"
              >
                {t.nav.admission}
              </Link>
              <Link
                href="/how-to-apply"
                onClick={() => setSearchOpen(false)}
                className="bg-white/10 hover:bg-[#0400CC] px-2.5 py-1 rounded-md text-white/80 transition-colors"
              >
                {t.nav.tuitionScholarships}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
