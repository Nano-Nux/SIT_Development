'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

export function Footer() {
  const { t, lang } = useLanguage();
  const [socialData, setSocialData] = useState<{
    facebook?: string;
    facebookActive?: boolean;
    twitter?: string;
    twitterActive?: boolean;
    instagram?: string;
    instagramActive?: boolean;
    linkedin?: string;
    linkedinActive?: boolean;
    youtube?: string;
    youtubeActive?: boolean;
    tiktok?: string;
    tiktokActive?: boolean;
    telegram?: string;
    telegramActive?: boolean;
    whatsapp?: string;
    whatsappActive?: boolean;
    customLinks?: Array<{ id: string; name: string; url: string; isActive?: boolean }>;
  }>({
    facebook: 'https://facebook.com/situniversity',
    facebookActive: true,
    twitter: 'https://twitter.com/situniversity',
    twitterActive: true,
    instagram: 'https://instagram.com/situniversity',
    instagramActive: true,
    linkedin: 'https://linkedin.com/school/situniversity',
    linkedinActive: true,
    youtube: 'https://youtube.com/@situniversity',
    youtubeActive: true,
    tiktok: 'https://tiktok.com/@situniversity',
    tiktokActive: true,
    telegram: 'https://t.me/situniversity',
    telegramActive: true,
  });

  const [contactDetails, setContactDetails] = useState<{
    address?: string;
    addressLa?: string;
    phone?: string;
    email?: string;
  }>({});

  useEffect(() => {
    api
      .getContact()
      .then((contact) => {
        if (contact) {
          // Parse primary address, phone, email
          let addr = contact.address;
          let addrLa = contact.addressLa;
          if (contact.locations) {
            try {
              const locs = typeof contact.locations === 'string' ? JSON.parse(contact.locations) : contact.locations;
              if (Array.isArray(locs) && locs.length > 0) {
                const primary = locs.find((l: any) => l.isPrimary) || locs[0];
                addr = primary.address || addr;
                addrLa = primary.addressLa || addrLa;
              }
            } catch (e) {}
          }

          let phoneStr = contact.phone;
          if (contact.phones) {
            try {
              const phs = typeof contact.phones === 'string' ? JSON.parse(contact.phones) : contact.phones;
              if (Array.isArray(phs) && phs.length > 0) {
                const primary = phs.find((p: any) => p.isPrimary) || phs[0];
                phoneStr = primary.number || phoneStr;
              }
            } catch (e) {}
          }

          let emailStr = contact.email;
          if (contact.emails) {
            try {
              const ems = typeof contact.emails === 'string' ? JSON.parse(contact.emails) : contact.emails;
              if (Array.isArray(ems) && ems.length > 0) {
                const primary = ems.find((e: any) => e.isPrimary) || ems[0];
                emailStr = primary.email || emailStr;
              }
            } catch (e) {}
          }

          setContactDetails({
            address: addr,
            addressLa: addrLa,
            phone: phoneStr,
            email: emailStr,
          });
        }

        if (contact?.socialLinks) {
          let parsed = contact.socialLinks;
          if (typeof parsed === 'string') {
            try {
              parsed = JSON.parse(parsed);
            } catch (e) {
              console.error('Failed to parse social links for footer:', e);
            }
          }
          if (typeof parsed === 'object') {
            setSocialData((prev) => ({
              ...prev,
              ...parsed,
            }));
          }
        }
      })
      .catch((e) => console.error('Failed to load contact info in footer:', e));
  }, []);

  const isPlatformActive = (key: string, defaultVal = true) => {
    const activeKey = `${key}Active` as keyof typeof socialData;
    if (socialData[activeKey] !== undefined) {
      return Boolean(socialData[activeKey]);
    }
    return defaultVal && Boolean(socialData[key as keyof typeof socialData]);
  };

  return (
    <footer className="bg-[#00001C] text-white pt-16 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Subtle background Lao floral decorative motif on the right */}
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] pointer-events-none opacity-5">
        <Image
          src="/images/lao-pattern.png"
          alt="Lao Pattern"
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Col 1: Brand & Logo (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-block relative h-12 w-60">
              <Image
                src="/assets/sit-logo.png"
                alt="Soutsaka Institute of Technology"
                fill
                className="object-contain object-left brightness-110"
              />
            </Link>

            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              {t.footer.description}
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {/* Facebook */}
              {isPlatformActive('facebook') && socialData.facebook && (
                <a
                  href={socialData.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center text-white transition-all hover:scale-110 shadow-sm"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}

              {/* Twitter / X */}
              {isPlatformActive('twitter') && socialData.twitter && (
                <a
                  href={socialData.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-slate-800 flex items-center justify-center text-white transition-all hover:scale-110 shadow-sm"
                  aria-label="Twitter / X"
                  title="Twitter / X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}

              {/* Instagram */}
              {isPlatformActive('instagram') && socialData.instagram && (
                <a
                  href={socialData.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#E1306C] flex items-center justify-center text-white transition-all hover:scale-110 shadow-sm"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}

              {/* LinkedIn */}
              {isPlatformActive('linkedin') && socialData.linkedin && (
                <a
                  href={socialData.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#0A66C2] flex items-center justify-center text-white transition-all hover:scale-110 shadow-sm"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}

              {/* YouTube */}
              {isPlatformActive('youtube') && socialData.youtube && (
                <a
                  href={socialData.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF0000] flex items-center justify-center text-white transition-all hover:scale-110 shadow-sm"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}

              {/* TikTok */}
              {isPlatformActive('tiktok') && socialData.tiktok && (
                <a
                  href={socialData.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-black flex items-center justify-center text-white transition-all hover:scale-110 shadow-sm"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              )}

              {/* Telegram */}
              {isPlatformActive('telegram') && socialData.telegram && (
                <a
                  href={socialData.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#229ED9] flex items-center justify-center text-white transition-all hover:scale-110 shadow-sm"
                  aria-label="Telegram"
                  title="Telegram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              )}

              {/* WhatsApp */}
              {isPlatformActive('whatsapp', false) && socialData.whatsapp && (
                <a
                  href={socialData.whatsapp.startsWith('http') ? socialData.whatsapp : `https://wa.me/${socialData.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center text-white transition-all hover:scale-110 shadow-sm"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.979-.276-.1-.477-.15-.677.15-.2.301-.776.979-.952 1.18-.175.201-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.787-1.679-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.1-.201.05-.376-.025-.526-.075-.15-.677-1.633-.927-2.235-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.508 0 1.479 1.078 2.908 1.229 3.109.15.2 2.121 3.24 5.138 4.544.718.31 1.278.496 1.716.635.72.229 1.376.196 1.895.119.578-.086 1.782-.728 2.032-1.43.25-.703.25-1.305.175-1.43-.075-.125-.276-.201-.577-.351zM12.04 21.783c-1.802 0-3.567-.484-5.111-1.401l-.366-.218-3.801.996 1.014-3.705-.239-.38a9.88 9.88 0 0 1-1.516-5.26c0-5.467 4.449-9.916 9.917-9.916 2.648 0 5.138 1.032 7.009 2.905a9.854 9.854 0 0 1 2.899 7.007c-.001 5.468-4.45 9.917-9.923 9.917zm8.411-18.327C18.239 1.246 15.244.004 12.04.004 5.469.004.12 5.353.118 11.924c0 2.099.549 4.148 1.593 5.957L0 24l6.302-1.653c1.737.947 3.69 1.446 5.734 1.446h.005c6.568 0 11.918-5.349 11.921-11.921 0-3.184-1.24-6.179-3.511-8.415z" />
                  </svg>
                </a>
              )}

              {/* Custom Links */}
              {Array.isArray(socialData.customLinks) &&
                socialData.customLinks.map((custom) => {
                  if (!custom.isActive || !custom.url) return null;
                  return (
                    <a
                      key={custom.id}
                      href={custom.url.startsWith('http') ? custom.url : `https://${custom.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="h-10 px-3 rounded-full bg-white/10 hover:bg-[#0400CC] flex items-center gap-1.5 text-xs text-white transition-all hover:scale-105 shadow-sm"
                      title={custom.name}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span className="font-semibold">{custom.name}</span>
                    </a>
                  );
                })}
            </div>
          </div>

          {/* Col 2: Quick Links (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-[#1E65FF] text-sm font-bold tracking-widest uppercase">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  {t.footer.academicCalendar}
                </Link>
              </li>
              <li>
                <Link href="/life-at-sit" className="hover:text-white transition-colors">
                  {t.footer.library}
                </Link>
              </li>
              <li>
                <Link href="/life-at-sit#facilities" className="hover:text-white transition-colors">
                  {t.footer.campusMap}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t.footer.careersAtSIT}
                </Link>
              </li>
              <li>
                <Link href="/about#members" className="hover:text-white transition-colors">
                  {t.footer.alumniNetwork}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Us (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-[#1E65FF] text-sm font-bold tracking-widest uppercase">
              {t.footer.contactUs}
            </h3>
            <div className="space-y-3.5 text-sm text-white/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#1E65FF] shrink-0 mt-0.5" />
                <span>
                  {(lang === 'LA' && contactDetails.addressLa)
                    ? contactDetails.addressLa
                    : (contactDetails.address || t.footer.address)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#1E65FF] shrink-0" />
                <span>{contactDetails.phone || '+856 21 123 456'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#1E65FF] shrink-0" />
                <span>{contactDetails.email || 'admissions@sit.edu.la'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>{t.footer.copyright}</p>
          <div className="flex items-center gap-6 uppercase tracking-wider font-semibold">
            <Link href="/about" className="hover:text-white transition-colors">
              {t.footer.privacyPolicy}
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              {t.footer.termsOfUse}
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              {t.footer.accessibility}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
