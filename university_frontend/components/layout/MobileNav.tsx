'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, ChevronDown, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface NavLink {
  name: string;
  href: string;
  dropdown?: { name: string; href: string }[];
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
}

export function MobileNav({ isOpen, onClose, links }: MobileNavProps) {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const { t } = useLanguage();

  if (!isOpen) return null;

  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#00001C]/92 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-10 flex flex-col justify-between overflow-y-auto text-white">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#000014]/60 backdrop-blur-md">
            <Link href="/" onClick={onClose} className="relative h-10 w-44">
              <Image
                src="/assets/sit-logo.png"
                alt="SIT University"
                fill
                className="object-contain object-left brightness-110"
              />
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-5 space-y-2">
            <Link
              href="/"
              onClick={onClose}
              className={`block px-4 py-2.5 rounded-xl text-sm font-bold tracking-wider transition-colors ${pathname === '/'
                  ? 'bg-[#0400CC] text-white shadow-lg'
                  : 'text-white/80 hover:bg-white/10'
                }`}
            >
              {t.nav.home}
            </Link>

            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));

              if (link.dropdown && link.dropdown.length > 0) {
                const isDropdownOpen = !!openDropdowns[link.name];
                return (
                  <div key={link.name} className="border-b border-white/5 pb-1">
                    <div
                      className={`flex items-center justify-between rounded-xl transition-colors ${
                        isActive
                          ? 'bg-[#0400CC] text-white shadow-lg'
                          : 'text-white/90 hover:bg-white/5'
                      }`}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-bold tracking-wider"
                      >
                        {link.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleDropdown(link.name)}
                        className={`p-2.5 mr-1 rounded-lg transition-colors cursor-pointer ${
                          isActive
                            ? 'text-white/80 hover:text-white hover:bg-white/20'
                            : 'text-white/50 hover:text-white hover:bg-white/10'
                        }`}
                        aria-label={`Toggle ${link.name} submenu`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180 text-white' : ''
                          }`}
                        />
                      </button>
                    </div>
                    {isDropdownOpen && (
                      <div className="pl-4 pr-2 py-1 space-y-1 bg-white/5 rounded-xl my-1 border border-white/5">
                        {link.dropdown.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={onClose}
                              className={`block px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                                isSubActive
                                  ? 'bg-[#0400CC]/80 text-white font-semibold'
                                  : 'text-white/70 hover:text-white hover:bg-[#0400CC]/40'
                              }`}
                            >
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-bold tracking-wider transition-colors ${isActive
                      ? 'bg-[#0400CC] text-white shadow-lg'
                      : 'text-white/80 hover:bg-white/10'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-[#000014]/60 backdrop-blur-md space-y-3">
          <Link
            href="/apply"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-white text-[#0400CC] text-sm font-extrabold py-3 px-4 rounded-xl shadow-md hover:bg-slate-100 transition-all active:scale-[0.98]"
          >
            {t.common.applyNow}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/request-info"
            onClick={onClose}
            className="w-full flex items-center justify-center text-xs font-bold py-2.5 px-4 text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
          >
            {t.common.requestInfo}
          </Link>
          <div className="flex items-center justify-between pt-2 text-[11px] text-white/40">
            <Link href="/news" onClick={onClose} className="hover:text-white">
              {t.nav.newsEvents}
            </Link>
            <span>•</span>
            <Link href="/contact" onClick={onClose} className="hover:text-white">
              {t.nav.contact}
            </Link>
            <span>•</span>
            <Link href="/admin/login" onClick={onClose} className="hover:text-white">
              {t.nav.admin}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
