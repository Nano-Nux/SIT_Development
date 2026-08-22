'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/lib/api';
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Plus,
  Trash2,
  Eye,
  Sparkles,
  HelpCircle,
  Globe,
  Check,
  Zap,
} from 'lucide-react';

interface CustomSocialLink {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
}

interface SocialPlatformsState {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  telegram: string;
  whatsapp: string;
  customLinks: CustomSocialLink[];
}

interface ActiveTogglesState {
  facebook: boolean;
  twitter: boolean;
  instagram: boolean;
  linkedin: boolean;
  youtube: boolean;
  tiktok: boolean;
  telegram: boolean;
  whatsapp: boolean;
}

export default function AdminSocialLinksPage() {
  const [loading, setLoading] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'primary' | 'media' | 'messaging' | 'custom'>('all');

  const [links, setLinks] = useState<SocialPlatformsState>({
    facebook: 'https://facebook.com/situniversity',
    twitter: 'https://twitter.com/situniversity',
    instagram: 'https://instagram.com/situniversity',
    linkedin: 'https://linkedin.com/school/situniversity',
    youtube: 'https://youtube.com/@situniversity',
    tiktok: 'https://tiktok.com/@situniversity',
    telegram: 'https://t.me/situniversity',
    whatsapp: '',
    customLinks: [],
  });

  const [toggles, setToggles] = useState<ActiveTogglesState>({
    facebook: true,
    twitter: true,
    instagram: true,
    linkedin: true,
    youtube: true,
    tiktok: true,
    telegram: true,
    whatsapp: false,
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const linksRef = useRef(links);
  const togglesRef = useRef(toggles);

  useEffect(() => {
    linksRef.current = links;
  }, [links]);

  useEffect(() => {
    togglesRef.current = toggles;
  }, [toggles]);

  useEffect(() => {
    loadSocialLinks();
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const loadSocialLinks = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const contact = await api.getContact();
      let parsedSocial: any = {};
      if (contact && contact.socialLinks) {
        if (typeof contact.socialLinks === 'string') {
          try {
            parsedSocial = JSON.parse(contact.socialLinks);
          } catch (e) {
            console.error('Failed to parse social links string', e);
          }
        } else if (typeof contact.socialLinks === 'object') {
          parsedSocial = contact.socialLinks;
        }
      }

      const initialLinks: SocialPlatformsState = {
        facebook: parsedSocial.facebook || (parsedSocial.facebook === '' ? '' : 'https://facebook.com/situniversity'),
        twitter: parsedSocial.twitter || (parsedSocial.twitter === '' ? '' : 'https://twitter.com/situniversity'),
        instagram: parsedSocial.instagram || (parsedSocial.instagram === '' ? '' : 'https://instagram.com/situniversity'),
        linkedin: parsedSocial.linkedin || (parsedSocial.linkedin === '' ? '' : 'https://linkedin.com/school/situniversity'),
        youtube: parsedSocial.youtube || (parsedSocial.youtube === '' ? '' : 'https://youtube.com/@situniversity'),
        tiktok: parsedSocial.tiktok || (parsedSocial.tiktok === '' ? '' : 'https://tiktok.com/@situniversity'),
        telegram: parsedSocial.telegram || (parsedSocial.telegram === '' ? '' : 'https://t.me/situniversity'),
        whatsapp: parsedSocial.whatsapp || '',
        customLinks: Array.isArray(parsedSocial.customLinks) ? parsedSocial.customLinks : [],
      };

      const initialToggles: ActiveTogglesState = {
        facebook: parsedSocial.facebookActive !== undefined ? !!parsedSocial.facebookActive : Boolean(initialLinks.facebook),
        twitter: parsedSocial.twitterActive !== undefined ? !!parsedSocial.twitterActive : Boolean(initialLinks.twitter),
        instagram: parsedSocial.instagramActive !== undefined ? !!parsedSocial.instagramActive : Boolean(initialLinks.instagram),
        linkedin: parsedSocial.linkedinActive !== undefined ? !!parsedSocial.linkedinActive : Boolean(initialLinks.linkedin),
        youtube: parsedSocial.youtubeActive !== undefined ? !!parsedSocial.youtubeActive : Boolean(initialLinks.youtube),
        tiktok: parsedSocial.tiktokActive !== undefined ? !!parsedSocial.tiktokActive : Boolean(initialLinks.tiktok),
        telegram: parsedSocial.telegramActive !== undefined ? !!parsedSocial.telegramActive : Boolean(initialLinks.telegram),
        whatsapp: parsedSocial.whatsappActive !== undefined ? !!parsedSocial.whatsappActive : Boolean(initialLinks.whatsapp),
      };

      setLinks(initialLinks);
      setToggles(initialToggles);
    } catch (err: any) {
      console.error('Error loading social links:', err);
      setErrorMessage('Could not load current social links. Using default settings.');
    } finally {
      setLoading(false);
    }
  };

  // Immediate API save function
  const saveToApi = useCallback(async (
    targetLinks: SocialPlatformsState,
    targetToggles: ActiveTogglesState
  ) => {
    setAutoSaveStatus('saving');
    setErrorMessage(null);

    try {
      const payloadSocial = {
        facebook: targetLinks.facebook.trim(),
        facebookActive: targetToggles.facebook,
        twitter: targetLinks.twitter.trim(),
        twitterActive: targetToggles.twitter,
        instagram: targetLinks.instagram.trim(),
        instagramActive: targetToggles.instagram,
        linkedin: targetLinks.linkedin.trim(),
        linkedinActive: targetToggles.linkedin,
        youtube: targetLinks.youtube.trim(),
        youtubeActive: targetToggles.youtube,
        tiktok: targetLinks.tiktok.trim(),
        tiktokActive: targetToggles.tiktok,
        telegram: targetLinks.telegram.trim(),
        telegramActive: targetToggles.telegram,
        whatsapp: targetLinks.whatsapp.trim(),
        whatsappActive: targetToggles.whatsapp,
        customLinks: targetLinks.customLinks.map((item) => ({
          id: item.id,
          name: item.name.trim(),
          url: item.url.trim(),
          isActive: item.isActive,
        })),
      };

      await api.updateContact({
        socialLinks: payloadSocial,
      });

      setAutoSaveStatus('saved');
    } catch (err: any) {
      console.error('Failed to auto-save social links:', err);
      setAutoSaveStatus('error');
      setErrorMessage(err.message || 'Failed to auto-save social links. Please check network connection.');
    }
  }, []);

  // Debounced save for text typing
  const debouncedSave = useCallback((
    nextLinks: SocialPlatformsState,
    nextToggles: ActiveTogglesState
  ) => {
    setAutoSaveStatus('saving');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      saveToApi(nextLinks, nextToggles);
    }, 600);
  }, [saveToApi]);

  // Handle URL change (auto-saved on debounce + onBlur)
  const handleLinkChange = (key: keyof Omit<SocialPlatformsState, 'customLinks'>, value: string) => {
    const nextLinks = { ...links, [key]: value };
    setLinks(nextLinks);
    debouncedSave(nextLinks, toggles);
  };

  const handleLinkBlur = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    saveToApi(linksRef.current, togglesRef.current);
  };

  // Handle Toggle Switch (immediate API save)
  const handleToggle = (key: keyof ActiveTogglesState) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    const nextToggles = { ...toggles, [key]: !toggles[key] };
    setToggles(nextToggles);
    saveToApi(linksRef.current, nextToggles);
  };

  // Handle Custom Link Change
  const handleCustomLinkChange = (index: number, field: 'name' | 'url' | 'isActive', value: any) => {
    const nextCustom = [...links.customLinks];
    nextCustom[index] = { ...nextCustom[index], [field]: value };
    const nextLinks = { ...links, customLinks: nextCustom };
    setLinks(nextLinks);

    if (field === 'isActive') {
      // Immediate save on status toggle
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      saveToApi(nextLinks, toggles);
    } else {
      // Debounce on text typing
      debouncedSave(nextLinks, toggles);
    }
  };

  // Handle Add Custom Link (immediate API save)
  const handleAddCustomLink = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const newLink: CustomSocialLink = {
      id: 'custom_' + Date.now(),
      name: 'Discord / Threads / Other',
      url: 'https://',
      isActive: true,
    };
    const nextLinks = {
      ...links,
      customLinks: [...links.customLinks, newLink],
    };
    setLinks(nextLinks);
    saveToApi(nextLinks, toggles);
  };

  // Handle Remove Custom Link (immediate API save)
  const handleRemoveCustomLink = (index: number) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const nextLinks = {
      ...links,
      customLinks: links.customLinks.filter((_, i) => i !== index),
    };
    setLinks(nextLinks);
    saveToApi(nextLinks, toggles);
  };

  const handleCopy = (key: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Platform definitions with brand styling & icons
  const platforms = [
    {
      key: 'facebook' as const,
      name: 'Facebook',
      category: 'primary',
      badge: 'Official Page',
      hint: 'Primary official SIT University Facebook page for announcements, campus news & events.',
      placeholder: 'https://facebook.com/situniversity',
      color: '#1877F2',
      bgLight: 'bg-blue-50',
      textBrand: 'text-[#1877F2]',
      borderBrand: 'border-[#1877F2]/30',
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      key: 'twitter' as const,
      name: 'Twitter / X',
      category: 'primary',
      badge: 'X Handle',
      hint: 'Official Twitter / X handle for quick announcements, research highlights & live updates.',
      placeholder: 'https://twitter.com/situniversity',
      color: '#0F1419',
      bgLight: 'bg-slate-100',
      textBrand: 'text-slate-900',
      borderBrand: 'border-slate-400/30',
      iconSvg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      key: 'instagram' as const,
      name: 'Instagram',
      category: 'primary',
      badge: 'Photos & Reels',
      hint: 'Official SIT Instagram profile for campus life, student showcases, culture and visual reels.',
      placeholder: 'https://instagram.com/situniversity',
      color: '#E1306C',
      bgLight: 'bg-pink-50',
      textBrand: 'text-[#E1306C]',
      borderBrand: 'border-[#E1306C]/30',
      iconSvg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      key: 'linkedin' as const,
      name: 'LinkedIn',
      category: 'primary',
      badge: 'Professional & Alumni',
      hint: 'Official LinkedIn school & institutional page for career development, faculty & corporate partners.',
      placeholder: 'https://linkedin.com/school/situniversity',
      color: '#0A66C2',
      bgLight: 'bg-sky-50',
      textBrand: 'text-[#0A66C2]',
      borderBrand: 'border-[#0A66C2]/30',
      iconSvg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      key: 'youtube' as const,
      name: 'YouTube',
      category: 'media',
      badge: 'Video & Livestreams',
      hint: 'Official YouTube channel for campus tours, graduation ceremonies, faculty lectures and events.',
      placeholder: 'https://youtube.com/@situniversity',
      color: '#FF0000',
      bgLight: 'bg-red-50',
      textBrand: 'text-[#FF0000]',
      borderBrand: 'border-[#FF0000]/30',
      iconSvg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      key: 'tiktok' as const,
      name: 'TikTok',
      category: 'media',
      badge: 'Short Videos',
      hint: 'Official TikTok channel for student highlights, campus viral trends, and interactive moments.',
      placeholder: 'https://tiktok.com/@situniversity',
      color: '#000000',
      bgLight: 'bg-slate-100',
      textBrand: 'text-black',
      borderBrand: 'border-slate-300',
      iconSvg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.43c.01 1.73-.5 3.48-1.57 4.86-1.07 1.39-2.65 2.37-4.38 2.68-1.74.32-3.56.02-5.16-.78-1.6-1.01-2.73-2.64-3.13-4.52-.41-1.87-.07-3.87.97-5.46 1.05-1.59 2.74-2.69 4.63-2.99.37-.06.74-.08 1.11-.08v4.13c-.6-.01-1.22.1-1.75.4-.53.3-.94.77-1.17 1.33-.23.57-.24 1.22-.04 1.79.2.57.6 1.05 1.12 1.35.53.3 1.16.39 1.76.27.61-.12 1.14-.49 1.49-1 .35-.51.52-1.13.52-1.75V.02z" />
        </svg>
      ),
    },
    {
      key: 'telegram' as const,
      name: 'Telegram',
      category: 'messaging',
      badge: 'Channel & Alerts',
      hint: 'Official broadcast channel for immediate university notices, emergency alerts & academic updates.',
      placeholder: 'https://t.me/situniversity',
      color: '#24A1DE',
      bgLight: 'bg-sky-50',
      textBrand: 'text-[#24A1DE]',
      borderBrand: 'border-[#24A1DE]/30',
      iconSvg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      key: 'whatsapp' as const,
      name: 'WhatsApp Business',
      category: 'messaging',
      badge: 'Admissions Chat',
      hint: 'Direct instant messaging for prospective students, admissions inquiries, and international applicants.',
      placeholder: 'https://wa.me/8562012345678',
      color: '#25D366',
      bgLight: 'bg-emerald-50',
      textBrand: 'text-[#25D366]',
      borderBrand: 'border-[#25D366]/30',
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.979-.276-.1-.477-.15-.677.15-.2.301-.776.979-.952 1.18-.175.201-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.787-1.679-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.1-.201.05-.376-.025-.526-.075-.15-.677-1.633-.927-2.235-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.508 0 1.479 1.078 2.908 1.229 3.109.15.2 2.121 3.24 5.138 4.544.718.31 1.278.496 1.716.635.72.229 1.376.196 1.895.119.578-.086 1.782-.728 2.032-1.43.25-.703.25-1.305.175-1.43-.075-.125-.276-.201-.577-.351zM12.04 21.783c-1.802 0-3.567-.484-5.111-1.401l-.366-.218-3.801.996 1.014-3.705-.239-.38a9.88 9.88 0 0 1-1.516-5.26c0-5.467 4.449-9.916 9.917-9.916 2.648 0 5.138 1.032 7.009 2.905a9.854 9.854 0 0 1 2.899 7.007c-.001 5.468-4.45 9.917-9.923 9.917zm8.411-18.327C18.239 1.246 15.244.004 12.04.004 5.469.004.12 5.353.118 11.924c0 2.099.549 4.148 1.593 5.957L0 24l6.302-1.653c1.737.947 3.69 1.446 5.734 1.446h.005c6.568 0 11.918-5.349 11.921-11.921 0-3.184-1.24-6.179-3.511-8.415z" />
        </svg>
      ),
    },
  ];

  const filteredPlatforms = platforms.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  const activeCount = Object.values(toggles).filter(Boolean).length + links.customLinks.filter((c) => c.isActive && c.url).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header with Live Auto-Save Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0400CC] text-xs font-bold tracking-wide uppercase">
            <Share2 className="w-3.5 h-3.5 text-[#0400CC]" />
            <span>Social Network & Link Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#00001C] tracking-tight">
            Official Social Media Links
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Configure, enable, and verify university social channels across Facebook, Twitter / X, Instagram, LinkedIn, YouTube, TikTok, Telegram, and custom links. All changes update in real time.
          </p>
        </div>

        {/* Real-Time Live Auto-Save Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          {autoSaveStatus === 'saving' && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-50 text-[#0400CC] border border-blue-200/80 text-xs sm:text-sm font-bold shadow-xs">
              <div className="w-4 h-4 border-2 border-[#0400CC] border-t-transparent rounded-full animate-spin" />
              <span>Saving in real-time...</span>
            </div>
          )}

          {autoSaveStatus === 'saved' && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs sm:text-sm font-bold shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Saved live automatically</span>
            </div>
          )}

          {autoSaveStatus === 'error' && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-xs sm:text-sm font-bold shadow-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Failed to save</span>
            </div>
          )}

          {autoSaveStatus === 'idle' && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 text-slate-600 border border-slate-200 text-xs sm:text-sm font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Auto-save enabled</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter Tabs & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#0400CC] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Platforms ({platforms.length + links.customLinks.length})
          </button>
          <button
            onClick={() => setActiveTab('primary')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'primary'
                ? 'bg-[#0400CC] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Primary (FB, X, IG, LinkedIn)
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'media'
                ? 'bg-[#0400CC] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Video (YouTube, TikTok)
          </button>
          <button
            onClick={() => setActiveTab('messaging')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'messaging'
                ? 'bg-[#0400CC] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Messaging (Telegram, WhatsApp)
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-[#0400CC] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Custom ({links.customLinks.length})
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Active on Public Site:
          </span>
          <span className="text-[#0400CC] font-extrabold text-sm">{activeCount}</span>
        </div>
      </div>

      {/* Main Grid: Social Link Cards + Live Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left 7/12 Cols: Social Config Cards */}
        <div className="xl:col-span-7 space-y-6">
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              <div className="w-8 h-8 border-4 border-[#0400CC] border-t-[#00B6FF] rounded-full animate-spin mx-auto mb-3" />
              <span>Loading Social Media Configurations...</span>
            </div>
          ) : (
            <>
              {/* Presets Grid */}
              {activeTab !== 'custom' && (
                <div className="space-y-4">
                  {filteredPlatforms.map((platform) => {
                    const currentUrl = links[platform.key];
                    const isEnabled = toggles[platform.key];
                    const isCopied = copiedKey === platform.key;

                    return (
                      <div
                        key={platform.key}
                        className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-sm ${
                          isEnabled
                            ? 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                            : 'border-slate-200/60 bg-slate-50/50 opacity-80'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                          {/* Platform Identity */}
                          <div className="flex items-center gap-3.5">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                              style={{ backgroundColor: platform.color }}
                            >
                              {platform.iconSvg}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-base text-[#00001C]">
                                  {platform.name}
                                </h3>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                  {platform.badge}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                {platform.hint}
                              </p>
                            </div>
                          </div>

                          {/* Active / Inactive Switch Toggle */}
                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <span className={`text-xs font-bold ${isEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {isEnabled ? 'Active' : 'Disabled'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggle(platform.key)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isEnabled ? 'bg-[#0400CC]' : 'bg-slate-300'
                              }`}
                              role="switch"
                              aria-checked={isEnabled}
                            >
                              <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                  isEnabled ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* URL Input & Quick Actions */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                            <label htmlFor={`url-${platform.key}`}>Destination Profile / Channel URL</label>
                            {currentUrl && (
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleCopy(platform.key, currentUrl)}
                                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#0400CC] transition-colors"
                                  title="Copy URL"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span className="text-emerald-600 font-bold">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                                <a
                                  href={currentUrl.startsWith('http') ? currentUrl : `https://${currentUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-[#0400CC] hover:underline font-bold"
                                  title="Open in new tab"
                                >
                                  <span>Test Link</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>

                          <div className="relative">
                            <input
                              id={`url-${platform.key}`}
                              type="url"
                              value={currentUrl}
                              onChange={(e) => handleLinkChange(platform.key, e.target.value)}
                              onBlur={handleLinkBlur}
                              placeholder={platform.placeholder}
                              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0400CC] focus:border-transparent transition-all font-mono"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                              <Globe className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Custom Social Channels Section */}
              {(activeTab === 'all' || activeTab === 'custom') && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-bold text-[#00001C] flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#00B6FF]" />
                        Custom Channels & Additional Networks
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Add custom communities such as Discord, WeChat, Threads, GitHub, ResearchGate, or Podcast links.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomLink}
                      className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-[#0400CC] font-bold text-xs px-3.5 py-2 rounded-xl border border-blue-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Custom Link</span>
                    </button>
                  </div>

                  {links.customLinks.length === 0 ? (
                    <div className="text-center py-8 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                      <Globe className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-semibold text-slate-600">No custom links added yet.</p>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                        Click "Add Custom Link" above if you want to display extra social or community channels.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {links.customLinks.map((customItem, idx) => (
                        <div
                          key={customItem.id || idx}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                                  Platform Name
                                </label>
                                <input
                                  type="text"
                                  value={customItem.name}
                                  onChange={(e) => handleCustomLinkChange(idx, 'name', e.target.value)}
                                  onBlur={handleLinkBlur}
                                  placeholder="e.g. Discord, Threads, GitHub"
                                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                                  URL Link
                                </label>
                                <input
                                  type="url"
                                  value={customItem.url}
                                  onChange={(e) => handleCustomLinkChange(idx, 'url', e.target.value)}
                                  onBlur={handleLinkBlur}
                                  placeholder="https://..."
                                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#0400CC]"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 pt-4 sm:pt-0">
                              <button
                                type="button"
                                onClick={() => handleCustomLinkChange(idx, 'isActive', !customItem.isActive)}
                                className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  customItem.isActive
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-slate-200 text-slate-600 border-slate-300'
                                }`}
                              >
                                {customItem.isActive ? 'Active' : 'Disabled'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveCustomLink(idx)}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Remove link"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right 5/12 Cols: Real-Time Live Preview & Quick Guidelines */}
        <div className="xl:col-span-5 space-y-6 sticky top-24">
          {/* Live Preview Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#00001C] font-bold text-base">
                <Eye className="w-4 h-4 text-[#0400CC]" />
                <span>Live Interactive Preview</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0400CC] border border-blue-200">
                WYSIWYG
              </span>
            </div>

            {/* Dark Theme Footer Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Public Footer Appearance (Dark Mode)</span>
                <span className="text-[11px] font-normal text-slate-400">Sit Website Footer</span>
              </div>
              <div className="bg-[#00001C] rounded-2xl p-6 text-white border border-white/10 shadow-inner">
                <p className="text-xs text-white/70 mb-4 leading-relaxed">
                  Empowering the next generation of leaders through innovation, excellence, and global perspective.
                </p>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {platforms.map((p) => {
                    const isEnabled = toggles[p.key];
                    const url = links[p.key];
                    if (!isEnabled || !url) return null;

                    return (
                      <a
                        key={p.key}
                        href={url.startsWith('http') ? url : `https://${url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0400CC] flex items-center justify-center text-white transition-all hover:scale-110 shadow-sm"
                        title={p.name}
                      >
                        {p.iconSvg}
                      </a>
                    );
                  })}

                  {links.customLinks.map((custom) => {
                    if (!custom.isActive || !custom.url) return null;
                    return (
                      <a
                        key={custom.id}
                        href={custom.url.startsWith('http') ? custom.url : `https://${custom.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="h-9 px-3 rounded-full bg-white/10 hover:bg-[#0400CC] flex items-center gap-1.5 text-xs text-white transition-all hover:scale-105"
                        title={custom.name}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{custom.name}</span>
                      </a>
                    );
                  })}

                  {activeCount === 0 && (
                    <span className="text-xs text-white/40 italic">
                      No active social links to display.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Light Theme Contact Page Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Contact Page Appearance (Light Mode)</span>
                <span className="text-[11px] font-normal text-slate-400">Campus Contact Section</span>
              </div>
              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Connect With SIT Online
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  {platforms.map((p) => {
                    const isEnabled = toggles[p.key];
                    const url = links[p.key];
                    if (!isEnabled || !url) return null;

                    return (
                      <div
                        key={p.key}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs font-semibold text-slate-700"
                      >
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: p.color }}
                        >
                          <div className="scale-75">{p.iconSvg}</div>
                        </div>
                        <span className="truncate">{p.name}</span>
                      </div>
                    );
                  })}

                  {links.customLinks.map((custom) => {
                    if (!custom.isActive || !custom.url) return null;
                    return (
                      <div
                        key={custom.id}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs font-semibold text-slate-700"
                      >
                        <div className="w-6 h-6 rounded-lg bg-[#0400CC] flex items-center justify-center text-white shrink-0">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{custom.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guidelines Card */}
          <div className="bg-gradient-to-br from-slate-900 to-[#00001C] rounded-3xl p-6 text-white space-y-4 shadow-md">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>Real-Time Updates</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-[#00B6FF] font-bold">•</span>
                <span>
                  <strong>Instant Sync:</strong> Toggling a platform on/off, changing URLs, or adding/removing custom links immediately saves to the backend and updates the live site.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00B6FF] font-bold">•</span>
                <span>
                  <strong>Full URLs:</strong> Always enter the complete web address (e.g. <code>https://facebook.com/situniversity</code>).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00B6FF] font-bold">•</span>
                <span>
                  <strong>Verification:</strong> Click <em>"Test Link"</em> next to any field to test that the destination profile opens properly.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
