'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/home/CTABanner';
import { useLanguage } from '@/context/LanguageContext';
import {
  Code,
  Music,
  Camera,
  Users,
  Trophy,
  Sparkles,
  Palette,
  Compass,
  HeartHandshake,
  BookOpen,
  ArrowRight,
  X,
  Calendar,
  ExternalLink,
  Info,
  Maximize2,
} from 'lucide-react';
import { api, CampusFacility, StudentLifeActivity, HeroData, NewsArticle, EventItem } from '@/lib/api';

// Fallback Campus Facilities matching Figma design
const fallbackFacilities: CampusFacility[] = [
  {
    id: 'fac-1',
    name: 'Art Society & Cultural Center',
    nameLa: 'ສູນສິລະປະ ແລະ ວັດທະນະທຳ',
    description: 'A grand auditorium and dedicated rehearsal stage for theater, traditional Lao dance, and musical performances.',
    descriptionLa: 'ຫໍປະຊຸມໃຫຍ່ ແລະ ເວທີຝຶກຊ້ອມສຳລັບລະຄອນເວທີ, ການຟ້ອນພື້ນເມືອງລາວ ແລະ ການສະແດງດົນຕີ.',
    imageUrl: '/images/life_at_sit_desktopview/img_6.jpg',
    actionType: 'MODAL',
    modalTitle: 'Art Society & Cultural Center Tour',
    modalTitleLa: 'ຢ້ຽມຊົມສູນສິລະປະ ແລະ ວັດທະນະທຳ',
    modalContent: 'Equipped with professional stage lighting, acoustic soundproofing, dressing rooms, and seating for over 500 audience members. Hosts annual cultural galas, youth showcases, and drama productions.',
    modalContentLa: 'ປະກອບດ້ວຍລະບົບແສງສຽງເວທີລະດັບມືອາຊີບ, ຫ້ອງແຕ່ງຕົວ ແລະ ບ່ອນນັ່ງຮອງຮັບຜູ້ຊົມຫຼາຍກວ່າ 500 ທີ່ນັ່ງ. ໃຊ້ສຳລັບຈັດງານເທດສະການວັດທະນະທຳປະຈຳປີ ແລະ ການສະແດງລະຄອນເວທີ.',
    order: 1,
  },
  {
    id: 'fac-2',
    name: 'Sports Athletic Union & Arena',
    nameLa: 'ສະໜາມກິລາ ແລະ ສູນອອກກຳລັງກາຍ',
    description: 'Championship-grade athletic grounds hosting varsity football matches, track meets, and collegiate leagues.',
    descriptionLa: 'ສະໜາມກິລາມາດຕະຖານສາກົນສຳລັບການແຂ່ງຂັນບານເຕະ, ແລ່ນ-ລານ ແລະ ລີກກິລາມະຫາວິທະຍາໄລ.',
    imageUrl: '/images/life_at_sit_desktopview/img_3.jpg',
    actionType: 'MODAL',
    modalTitle: 'Sports Athletic Complex & Arena',
    modalTitleLa: 'ສະໜາມກິລາ ແລະ ສະໂມສອນກິລາ',
    modalContent: 'Features synthetic turf football pitch, multi-purpose courts for basketball and volleyball, professional training equipment, and spectator seating.',
    modalContentLa: 'ປະກອບດ້ວຍສະໜາມບານເຕະຫຍ້າທຽມ, ສະໜາມບານບ້ວງ ແລະ ບານສົ່ງ, ອຸປະກອນຝຶກຊ້ອມມາດຕະຖານ ແລະ ອັດສະຈັນຊົມກິລາ.',
    order: 2,
  },
  {
    id: 'fac-3',
    name: 'Vocal Ensemble & Music Hall',
    nameLa: 'ຫ້ອງຊ້ອມດົນຕີ ແລະ ວົງຂັບຮ້ອງ',
    description: 'Soundproofed acoustic studios and performance halls for vocal choirs, live modern bands, and audio recording.',
    descriptionLa: 'ສະຕູດິໂອສຽງ ແລະ ຫ້ອງສະແດງດົນຕີສຳລັບວົງຂັບຮ້ອງ, ວົງດົນຕີສາກົນ ແລະ ການບັນທຶກສຽງ.',
    imageUrl: '/images/life_at_sit_desktopview/img_4.jpg',
    actionType: 'MODAL',
    modalTitle: 'Vocal Ensemble & Music Studios',
    modalTitleLa: 'ຫ້ອງຊ້ອມດົນຕີ ແລະ ສະຕູດິໂອບັນທຶກສຽງ',
    modalContent: 'State-of-the-art music chambers with acoustic paneling, grand pianos, synthesizers, microphones, and digital audio workstations for music student creators.',
    modalContentLa: 'ຫ້ອງດົນຕີທັນສະໄໝພ້ອມລະບົບກັນສຽງສະທ້ອນ, ເປຍໂນ, ຊິນທິໄຊເຊີ, ໄມໂຄຣໂຟນ ແລະ ໂປຣແກຣມບັນທຶກສຽງດິຈິທັລ.',
    order: 3,
  },
  {
    id: 'fac-4',
    name: 'MC Committee & Media Broadcast Stage',
    nameLa: 'ເວທີພິທີກອນ ແລະ ຫ້ອງກະຈາຍສຽງ',
    description: 'Professional public speaking podiums, television podcast studios, and master-of-ceremonies training spaces.',
    descriptionLa: 'ເວທີຝຶກອົບຮົມພິທີກອນ, ສະຕູດິໂອພອດແຄສ ແລະ ການກະຈາຍສຽງໂທລະພາບລະດັບມືອາຊີບ.',
    imageUrl: '/images/life_at_sit_desktopview/img_5.jpg',
    actionType: 'MODAL',
    modalTitle: 'MC Committee & Media Studios',
    modalTitleLa: 'ສູນພັດທະນາພິທີກອນ ແລະ ສື່ກະຈາຍສຽງ',
    modalContent: 'Dedicated facilities for student emcees, debate societies, and campus news broadcasters with 4K multi-cam capture and live-streaming equipment.',
    modalContentLa: 'ສະຖານທີ່ສະເພາະສຳລັບພິທີກອນນັກສຶກສາ, ຊົມຮົມໂຕ້ວາທີ ແລະ ທີມຂ່າວວິທະຍາເຂດ ພ້ອມກ້ອງ 4K ແລະ ອຸປະກອນຖ່າຍທອດສົດ.',
    order: 4,
  },
];

// Fallback News & Events from Figma design
const fallbackNewsEvents = [
  {
    id: 'ne-1',
    title: 'Celebrating 68 Years of Excellence with Shih Chien University',
    titleLa: 'ສະເຫຼີມສະຫຼອງ 68 ປີ ແຫ່ງຄວາມເປັນເລີດ ຮ່ວມກັບ ມະຫາວິທະຍາໄລ ຊິ ຈ້ຽນ (Shih Chien)',
    imageUrl: '/images/life_at_sit_desktopview/img_7.jpg',
    category: 'International',
    slug: 'celebrating-68-years-shih-chien-university',
    type: 'news',
  },
  {
    id: 'ne-2',
    title: 'Friendly Sports Competition Commemorating the 116th Anniversary of International',
    titleLa: 'ການແຂ່ງຂັນກິລາມິດຕະພາບ ເນື່ອງໃນໂອກາດວັນແມ່ຍິງສາກົນ ຄົບຮອບ 116 ປີ',
    imageUrl: '/images/life_at_sit_desktopview/img_8.jpg',
    category: 'Sports',
    slug: 'friendly-sports-competition-116th-anniversary',
    type: 'events',
  },
  {
    id: 'ne-3',
    title: 'The Director received the "Educational Excellence" Award in Kuala Lumpur, Malaysia.',
    titleLa: 'ຜູ້ອຳນວຍການຮັບລາງວັນ "ຄວາມເປັນເລີດດ້ານການສຶກສາ" ທີ່ ກົວລາລຳເປີ, ມາເລເຊຍ.',
    imageUrl: '/images/life_at_sit_desktopview/img_9.jpg',
    category: 'Academics',
    slug: 'director-educational-excellence-award-malaysia',
    type: 'news',
  },
  {
    id: 'ne-4',
    title: 'Preparation Meeting for the Commencement of Semester II, Academic Year 2025-2026',
    titleLa: 'ກອງປະຊຸມກຽມຄວາມພ້ອມ ສຳລັບການເປີດພາກຮຽນທີ II ສົກຮຽນ 2025-2026',
    imageUrl: '/images/life_at_sit_desktopview/img_10.jpg',
    category: 'Campus Life',
    slug: 'preparation-meeting-semester-ii-2025-2026',
    type: 'news',
  },
  {
    id: 'ne-5',
    title: 'Social Integration Skills Training Camp',
    titleLa: 'ຄ້າຍຝຶກອົບຮົມທັກສະການປັບຕົວ ແລະ ການເຊື່ອມໂຍງສັງຄົມ',
    imageUrl: '/images/life_at_sit_desktopview/img_11.jpg',
    category: 'Student Camp',
    slug: 'social-integration-skills-training-camp',
    type: 'events',
  },
  {
    id: 'ne-6',
    title: 'Soutsakan Student Market Happening',
    titleLa: 'ງານຕະຫຼາດນັດນັກສຶກສາ ສຸດສະກະນະ (Student Market)',
    imageUrl: '/images/life_at_sit_desktopview/img_12.jpg',
    category: 'Activities',
    slug: 'soutsakan-student-market-happening',
    type: 'events',
  },
];

// Fallback Featured Clubs matching Figma design
const featuredClubs = [
  {
    id: 'club-1',
    title: 'Arts Society',
    titleLa: 'ຊົມຮົມ ສິລະປະສ້າງສັນ',
    category: 'ACADEMIC',
    categoryLa: 'ວິຊາການ',
    icon: Code,
    description: 'Empowering students to build creative tech designs, interactive media, and full-stack software solutions.',
    descriptionLa: 'ສົ່ງເສີມນັກສຶກສາໃນການອອກແບບສື່ດິຈິທັລ, ຄວາມຄິດສ້າງສັນ ແລະ ການພັດທະນາຊອບແວ.',
  },
  {
    id: 'club-2',
    title: 'Music Ensemble',
    titleLa: 'ຊົມຮົມ ດົນຕີສາກົນ',
    category: 'ARTS',
    categoryLa: 'ສິລະປະ',
    icon: Music,
    description: 'Live musical rehearsals, vocal choirs, acoustic concerts, and university festival performance showcases.',
    descriptionLa: 'ການຝຶກຊ້ອມດົນຕີສົດ, ວົງຂັບຮ້ອງ, ຄອນເສີດອາຄູສຕິກ ແລະ ການສະແດງໃນງານເທດສະການ.',
  },
  {
    id: 'club-3',
    title: 'Sports Athletic Union',
    titleLa: 'ສະຫະພັນ ກິລານັກສຶກສາ',
    category: 'CREATIVE',
    categoryLa: 'ກິດຈະກຳສ້າງສັນ',
    icon: Camera,
    description: 'Organizing varsity leagues, fitness bootcamps, collegiate football matches, and sports photography.',
    descriptionLa: 'ຈັດການແຂ່ງຂັນກິລາມະຫາວິທະຍາໄລ, ການອອກກຳລັງກາຍ ແລະ ການຖ່າຍພາບກິລາ.',
  },
  {
    id: 'club-4',
    title: 'MC Committee',
    titleLa: 'ຄະນະກຳມະການ ພິທີກອນ',
    category: 'LEADERSHIP',
    categoryLa: 'ຄວາມເປັນຜູ້ນຳ',
    icon: Users,
    description: 'Developing polished public speaking, emcee mastery, event coordination, and bilingual presentation skills.',
    descriptionLa: 'ພັດທະນາທັກສະການເວົ້າໃນທີ່ສາທາລະນະ, ການເປັນພິທີກອນສອງພາສາ ແລະ ການຈັດກິດຈະກຳ.',
  },
];

// Full list of 12+ Clubs for the "VIEW ALL CLUBS" modal
const allStudentClubs = [
  {
    title: 'Arts Society',
    titleLa: 'ຊົມຮົມ ສິລະປະສ້າງສັນ',
    category: 'ACADEMIC',
    categoryLa: 'ວິຊາການ',
    desc: 'Focusing on graphic illustration, UI/UX prototyping, and collaborative visual projects for campus brands.',
    descLa: 'ເນັ້ນໃສ່ການອອກແບບກຣາບຟິກ, ການສ້າງຕົ້ນແບບ UI/UX ແລະ ໂຄງການສິລະປະສຳລັບວິທະຍາເຂດ.',
    schedule: 'Every Tuesday & Thursday, 4:30 PM',
    members: '45+ Members',
  },
  {
    title: 'Music Ensemble',
    titleLa: 'ຊົມຮົມ ດົນຕີສາກົນ',
    category: 'ARTS',
    categoryLa: 'ສິລະປະ',
    desc: 'Live instrumental band, modern jazz, contemporary pop, and university orchestra rehearsals.',
    descLa: 'ວົງດົນຕີສາກົນ, ແຈັສ, ປັອບຮ່ວມສະໄໝ ແລະ ວົງອໍເຄສຕຣາຂອງມະຫາວິທະຍາໄລ.',
    schedule: 'Every Wednesday & Friday, 5:00 PM',
    members: '60+ Members',
  },
  {
    title: 'Sports Athletic Union',
    titleLa: 'ສະຫະພັນ ກິລານັກສຶກສາ',
    category: 'SPORTS',
    categoryLa: 'ກິລາ',
    desc: 'Men’s and women’s varsity football, badminton league, basketball squad, and endurance athletics.',
    descLa: 'ທີມບານເຕະຊາຍ-ຍິງ, ລີກດອກປີກໄກ່, ທີມບານບ້ວງ ແລະ ການແລ່ນມາຣາທອນ.',
    schedule: 'Mon, Wed, Fri, 4:00 PM',
    members: '120+ Members',
  },
  {
    title: 'MC Committee',
    titleLa: 'ຄະນະກຳມະການ ພິທີກອນ',
    category: 'LEADERSHIP',
    categoryLa: 'ຄວາມເປັນຜູ້ນຳ',
    desc: 'Public address training, ceremony hosting, broadcast moderation, and bilingual emceeing mastery.',
    descLa: 'ຝຶກອົບຮົມການເວົ້າໃນງານພິທີການ, ການດຳເນີນລາຍການ ແລະ ພິທີກອນສອງພາສາ.',
    schedule: 'Every Saturday, 9:00 AM',
    members: '35+ Members',
  },
  {
    title: 'SIT Coding & AI League',
    titleLa: 'ຊົມຮົມ ນັກຂຽນໂປຣແກຣມ & AI',
    category: 'ACADEMIC',
    categoryLa: 'ວິຊາການ',
    desc: 'Algorithmic problem solving, hackathons, robotics experiments, and web application development.',
    descLa: 'ການແກ້ໄຂໂຈດຄອມພິວເຕີ, ງານແຮັກກາທອນ, ຫຸ່ນຍົນ ແລະ ການພັດທະນາເວັບແອັບ.',
    schedule: 'Every Monday & Wednesday, 5:00 PM',
    members: '80+ Members',
  },
  {
    title: 'Photography & Filmmaking Guild',
    titleLa: 'ຊົມຮົມ ຖ່າຍຮູບ ແລະ ຮູບເງົາ',
    category: 'CREATIVE',
    categoryLa: 'ຄວາມຄິດສ້າງສັນ',
    desc: 'DSLR photography, cinematic lighting, video editing, and campus documentary storytelling.',
    descLa: 'ການຖ່າຍຮູບກ້ອງ DSLR, ການຈັດແສງຮູບເງົາ, ຕັດຕໍ່ວິດີໂອ ແລະ ເລົ່າເລື່ອງສາລະຄະດີ.',
    schedule: 'Every Thursday, 4:00 PM',
    members: '50+ Members',
  },
  {
    title: 'Lao Traditional Dance Troupe',
    titleLa: 'ຄະນະສິລະປະ ຟ້ອນພື້ນເມືອງລາວ',
    category: 'ARTS',
    categoryLa: 'ສິລະປະ',
    desc: 'Preserving and performing traditional Lao cultural dances for national festivals and international delegations.',
    descLa: 'ອະນຸລັກ ແລະ ສະແດງສິລະປະການຟ້ອນພື້ນເມືອງລາວໃນງານເທດສະການ ແລະ ຕ້ອນຮັບແຂກສາກົນ.',
    schedule: 'Tue & Thu, 5:00 PM',
    members: '40+ Members',
  },
  {
    title: 'Student Entrepreneurship Circle',
    titleLa: 'ຊົມຮົມ ຜູ້ປະກອບການລຸ້ນໃໝ່',
    category: 'LEADERSHIP',
    categoryLa: 'ຄວາມເປັນຜູ້ນຳ',
    desc: 'Startup pitch development, market validation, business model workshops, and seed funding applications.',
    descLa: 'ການນຳສະເໜີແຜນທຸລະກິດສະຕາດອັບ, ເວີກຊັອບໂມເດວທຸລະກິດ ແລະ ການຂໍທຶນສະໜັບສະໜູນ.',
    schedule: 'Every Friday, 3:30 PM',
    members: '45+ Members',
  },
];

// Club gallery photos matching Figma design
const clubGalleryImages = [
  {
    src: '/images/life_at_sit_desktopview/img_13.jpg',
    caption: 'Theater & Drama Society Grand Stage Performance',
    captionLa: 'ການສະແດງລະຄອນເວທີສຸດຍິ່ງໃຫຍ່ ຂອງຊົມຮົມການສະແດງ',
  },
  {
    src: '/images/life_at_sit_desktopview/img_15.jpg',
    caption: 'Acoustic Music Band Live Outdoor Jam Session',
    captionLa: 'ການຫຼິ້ນດົນຕີອາຄູສຕິກສົດ ບັນຍາກາດກາງແຈ້ງ',
  },
  {
    src: '/images/life_at_sit_desktopview/img_17.jpg',
    caption: 'Student Creative Workshop & Crafting Booth',
    captionLa: 'ບູດກິດຈະກຳສ້າງສັນ ແລະ ເວີກຊັອບງານສິລະປະນັກສຶກສາ',
  },
  {
    src: '/images/life_at_sit_desktopview/img_14.jpg',
    caption: 'University Music Festival Live Stage Concert',
    captionLa: 'ຄອນເສີດເວທີໃຫຍ່ ໃນງານເທດສະການດົນຕີມະຫາວິທະຍາໄລ',
  },
  {
    src: '/images/life_at_sit_desktopview/img_16.jpg',
    caption: 'Traditional Lao Dance Troupe Cultural Showcase',
    captionLa: 'ການສະແດງຟ້ອນພື້ນເມືອງລາວ ໂດຍຄະນະສິລະປະນັກສຶກສາ',
  },
  {
    src: '/images/life_at_sit_desktopview/img_18.jpg',
    caption: 'Inter-Collegiate Varsity Football Championship Match',
    captionLa: 'ການແຂ່ງຂັນບານເຕະຊິງຊະນະເລີດ ລະຫວ່າງຄະນະວິຊາ',
  },
];

export default function LifeAtSITPage() {
  const { lang, t } = useLanguage();
  const isLa = lang === 'LA';

  const [hero, setHero] = useState<HeroData | null>(null);
  const [facilities, setFacilities] = useState<CampusFacility[]>([]);
  const [studentLife, setStudentLife] = useState<StudentLifeActivity[]>([]);
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedFacility, setSelectedFacility] = useState<CampusFacility | null>(null);
  const [allClubsOpen, setAllClubsOpen] = useState(false);
  const [selectedClubCategory, setSelectedClubCategory] = useState<string>('ALL');
  const [lightboxImage, setLightboxImage] = useState<{ src: string; caption: string; captionLa?: string } | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getHero('LIFE_AT_SIT').catch(() => null),
      api.getCampusFacilities().catch(() => []),
      api.getStudentLife().catch(() => []),
      api.getNews().catch(() => null),
      api.getEvents().catch(() => []),
    ]).then(([heroRes, facRes, lifeRes, newsRes, eventsRes]) => {
      if (heroRes?.imageUrl && heroRes.imageUrl.trim() !== '') {
        setBgImage(heroRes.imageUrl.trim());
      }
      if (facRes && facRes.length > 0) setFacilities(facRes);
      else setFacilities(fallbackFacilities);

      if (lifeRes && lifeRes.length > 0) setStudentLife(lifeRes);
      
      const newsItems = Array.isArray(newsRes) ? newsRes : (newsRes?.items || []);
      if (newsItems.length > 0) setNewsList(newsItems);

      const eventItems = Array.isArray(eventsRes) ? eventsRes : ((eventsRes as any)?.items || (eventsRes as any)?.data || []);
      if (eventItems.length > 0) setEventsList(eventItems);
      
      setLoading(false);
    });
  }, []);

  const heroSubtitle = t.lifeAtSit.heroSubtitle;

  const rawTitle = t.lifeAtSit.heroTitle || (isLa ? 'ຊີວິດໃນ SIT' : 'Life at SIT');

  let mainTitle = isLa ? 'ຊີວິດໃນ' : 'Life at';
  let subTitleAccent = 'SIT';

  if (/ sit$/i.test(rawTitle.trim())) {
    mainTitle = rawTitle.trim().replace(/ sit$/i, '').trim();
    subTitleAccent = 'SIT';
  } else if (rawTitle.toLowerCase() === 'life at sit' || rawTitle.toLowerCase() === 'life') {
    mainTitle = 'Life at';
    subTitleAccent = 'SIT';
  } else if (rawTitle.includes('ໃນ SIT') || rawTitle.includes('ໃນ sit')) {
    const parts = rawTitle.split(/ໃນ SIT|ໃນ sit/i);
    mainTitle = `${parts[0].trim()} ໃນ`.trim();
    subTitleAccent = 'SIT';
  } else if (rawTitle.includes('ທີ່ SIT') || rawTitle.includes('ທີ່ sit')) {
    const parts = rawTitle.split(/ທີ່ SIT|ທີ່ sit/i);
    mainTitle = `${parts[0].trim()} ທີ່`.trim();
    subTitleAccent = 'SIT';
  } else if (rawTitle === 'ຊີວິດ' || rawTitle === 'ຊີວິດໃນ SIT' || rawTitle === 'ຊີວິດ ທີ່ SIT') {
    mainTitle = 'ຊີວິດໃນ';
    subTitleAccent = 'SIT';
  } else {
    mainTitle = rawTitle.trim();
    subTitleAccent = 'SIT';
  }

  const displayFacilities = facilities.length > 0 ? facilities : fallbackFacilities;

  // Handle facility card click
  const handleFacilityClick = (fac: CampusFacility) => {
    if (fac.actionType === 'REDIRECT' && fac.destinationUrl) {
      window.location.href = fac.destinationUrl;
    } else {
      setSelectedFacility(fac);
    }
  };

  // Filter all clubs in modal
  const filteredClubs = selectedClubCategory === 'ALL'
    ? allStudentClubs
    : allStudentClubs.filter(c => c.category === selectedClubCategory);

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#00001C] font-sans antialiased selection:bg-[#0400CC] selection:text-white">
      <Header />

      <main className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative w-full min-h-[580px] md:h-[692px] bg-[#00001C] pt-36 pb-6 md:pt-44 md:pb-8 text-white overflow-hidden flex flex-col justify-end">
          {/* Background image & gradient overlay layers matching Academics / Collaborations */}
          <div className="absolute inset-0 z-0">
            {/* Dynamic background photo from Admin Dashboard (Blank by default) */}
            {bgImage && (
              <Image
                src={bgImage}
                alt={rawTitle}
                fill
                className="object-cover object-center"
                priority
              />
            )}
            {/* 2. Blue overlay (#0400CC at 60% opacity) */}
            <div className="absolute inset-0 bg-[#0400CC]/60" />
            {/* 3. Dark gradient overlay from bottom to transparent top */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#00001C] via-[#00001C]/40 to-transparent" />
            {/* 4. Large SIT Logo Watermark Emblem (opacity 0.1, rotated 90deg on upper right) */}
            <div className="absolute -top-32 -right-32 md:-top-48 md:-right-24 w-[600px] h-[600px] md:w-[920px] md:h-[920px] opacity-10 pointer-events-none select-none z-0 rotate-90">
              <Image
                src="/images/academics_desktopview/img_2.png"
                alt="SIT Emblem Watermark"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Main Content Container (at bottom of hero) */}
          <div className="max-w-[1280px] w-full mx-auto px-6 relative z-10 space-y-3 md:space-y-4 mt-auto pb-4 md:pb-8">
            {/* Badge / Pill */}
            <div>
              <div className="inline-flex items-center border border-white/20 bg-white/10 rounded-lg px-4 py-1.5 backdrop-blur-md shadow-sm">
                <span className="text-xs sm:text-sm font-bold tracking-widest text-[#EFFFFF]">
                  {heroSubtitle}
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                {mainTitle}
              </h1>

              {/* Next line: 'at SIT' */}
              <div className="relative flex items-end min-h-[52px] pt-1">
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-r from-[#EFFFFF] via-[#EFFFFF] to-[#EFFFFF]/70 bg-clip-text text-transparent">
                  {subTitleAccent}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. CAMPUS & FACILITIES SECTION */}
        {/* ========================================================================= */}
        <section id="facilities" className="w-full bg-white py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00001C] tracking-tight uppercase">
                {t.lifeAtSit.campusFacilitiesTitle} <span className="text-[#0400CC]">{t.lifeAtSit.campusFacilitiesHighlight}</span>
              </h2>
              <p className="text-base sm:text-lg text-[#4A5565] leading-relaxed">
                {t.lifeAtSit.campusFacilitiesDesc}
              </p>
            </div>

            {/* 2x2 Grid of Facilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {displayFacilities.slice(0, 4).map((fac, idx) => {
                const facName = (isLa && fac.nameLa) ? fac.nameLa : fac.name;
                const facDesc = (isLa && fac.descriptionLa) ? fac.descriptionLa : fac.description;
                const imageSrc = fac.imageUrl || `/images/life_at_sit_desktopview/img_${(idx % 4) + 3}.jpg`;

                return (
                  <div
                    key={fac.id || idx}
                    onClick={() => handleFacilityClick(fac)}
                    className="group relative h-[320px] sm:h-[380px] md:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer bg-[#00001C] flex flex-col justify-end p-6 sm:p-8"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={imageSrc}
                        alt={facName}
                        fill
                        unoptimized
                        className="object-cover object-center group-hover:scale-105 transition-all duration-700 brightness-95 group-hover:brightness-100"
                      />
                    </div>

                    {/* Dark Gradient Overlay for optimal contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00001C] via-[#00001C]/60 to-transparent z-10" />

                    {/* Content */}
                    <div className="relative z-20 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
                          {facName}
                        </h3>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 ml-3">
                          <Maximize2 className="w-4 h-4" />
                        </span>
                      </div>
                      {facDesc && (
                        <p className="text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed">
                          {facDesc}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. NEWS AND EVENTS SECTION */}
        {/* ========================================================================= */}
        <section id="news-events" className="w-full bg-[#F5F7FA] py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
            {/* Section Header */}
            <div className="mb-12 sm:mb-14">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00001C] tracking-tight uppercase">
                {t.lifeAtSit.newsEventsTitle} <span className="text-[#0400CC]">{t.lifeAtSit.newsEventsHighlight}</span>
              </h2>
            </div>

            {/* 3-Column Grid of News & Events (6 cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {fallbackNewsEvents.map((item, idx) => {
                const itemTitle = (isLa && item.titleLa) ? item.titleLa : item.title;
                const linkHref = `/${item.type || 'news'}/${item.slug}`;

                return (
                  <Link
                    key={item.id || idx}
                    href={linkHref}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 flex flex-col justify-between"
                  >
                    {/* Top Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={item.imageUrl}
                        alt={itemTitle}
                        fill
                        unoptimized
                        className="object-cover object-center group-hover:scale-105 transition-all duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#0400CC] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow">
                        {item.category}
                      </span>
                    </div>

                    {/* Headline */}
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <h3 className="text-base sm:text-lg font-bold text-[#00001C] group-hover:text-[#0400CC] transition-colors leading-snug">
                        {itemTitle}
                      </h3>

                      <div className="flex items-center text-xs sm:text-sm font-bold text-[#0400CC] group-hover:underline">
                        <span>{t.lifeAtSit.viewDetails}</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. STUDENT LIFE & ACTIVITIES SECTION */}
        {/* ========================================================================= */}
        <section id="activities" className="w-full bg-white py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
            {/* Section Header */}
            <div className="w-full mb-12 sm:mb-14 space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00001C] tracking-tight uppercase">
                {t.lifeAtSit.studentLifeTitle} <span className="text-[#0400CC]">{t.lifeAtSit.studentLifeHighlight}</span>
              </h2>
              <p className="text-base sm:text-lg text-[#4A5565] leading-relaxed w-full">
                {t.lifeAtSit.studentLifeDesc}
              </p>
            </div>

            {/* 4 Featured Club Cards (2 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8">
              {featuredClubs.map((club, idx) => {
                const IconComponent = club.icon;
                const clubTitle = (isLa && club.titleLa) ? club.titleLa : club.title;
                const categoryText = (isLa && club.categoryLa) ? club.categoryLa : club.category;

                return (
                  <div
                    key={club.id || idx}
                    className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#0400CC]/50 transition-all duration-300 flex items-center gap-5"
                  >
                    {/* Cyan circular icon background */}
                    <div className="w-14 h-14 rounded-full bg-[#E6F7FF] flex items-center justify-center text-[#0088FF] shrink-0">
                      <IconComponent className="w-7 h-7 stroke-[2.2]" />
                    </div>

                    {/* Text Details */}
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-bold text-[#00001C]">
                        {clubTitle}
                      </h3>
                      <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#718096]">
                        {categoryText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* "VIEW ALL CLUBS" Button */}
            <div className="mb-14 sm:mb-16">
              <button
                onClick={() => setAllClubsOpen(true)}
                className="group inline-flex items-center gap-2 text-sm sm:text-base font-extrabold text-[#0400CC] tracking-wider uppercase border-b-2 border-[#0400CC] pb-1 hover:text-[#030099] transition-all cursor-pointer"
              >
                <span>{t.lifeAtSit.viewAllClubs}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>

            {/* Club Activities Photo Gallery (6 Images Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubGalleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxImage(img)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer bg-slate-900"
                >
                    <Image
                      src={img.src}
                      alt={isLa ? (img.captionLa || img.caption) : img.caption}
                      fill
                      unoptimized
                      className="object-cover object-center group-hover:scale-105 transition-all duration-500"
                    />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {isLa ? (img.captionLa || img.caption) : img.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CTA BANNER */}
        {/* ========================================================================= */}
        <CTABanner />
      </main>

      <Footer />

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Facility Detail Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedFacility(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/9] w-full bg-slate-900">
              <Image
                src={selectedFacility.imageUrl || '/images/life_at_sit_desktopview/img_3.jpg'}
                alt={selectedFacility.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#0400CC] bg-[#EFFFFF] px-3 py-1 rounded-md">
                {t.lifeAtSit.facilityBadge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#00001C]">
                {isLa
                  ? (selectedFacility.modalTitleLa || selectedFacility.nameLa || selectedFacility.name)
                  : (selectedFacility.modalTitle || selectedFacility.name)}
              </h3>
              <p className="text-sm sm:text-base text-[#4A5565] leading-relaxed whitespace-pre-line">
                {isLa
                  ? (selectedFacility.modalContentLa || selectedFacility.descriptionLa || selectedFacility.description)
                  : (selectedFacility.modalContent || selectedFacility.description)}
              </p>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  {t.lifeAtSit.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Clubs Directory Modal */}
      {allClubsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#00001C]">
                  {t.lifeAtSit.allClubsModalTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A5565] mt-1">
                  {t.lifeAtSit.allClubsModalDesc}
                </p>
              </div>
              <button
                onClick={() => setAllClubsOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-6 sm:px-8 py-3 border-b border-slate-100 flex flex-wrap gap-2 bg-white">
              {['ALL', 'ACADEMIC', 'ARTS', 'CREATIVE', 'LEADERSHIP', 'SPORTS'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedClubCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider transition-all cursor-pointer ${
                    selectedClubCategory === cat
                      ? 'bg-[#0400CC] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Clubs Grid Container */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-grow space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredClubs.map((club, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-[#0400CC] bg-white transition-all space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-base sm:text-lg text-[#00001C]">
                        {isLa ? club.titleLa : club.title}
                      </h4>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-[#EFFFFF] text-[#0400CC]">
                        {isLa ? (club.categoryLa || club.category) : club.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isLa ? club.descLa : club.desc}
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>🕒 {club.schedule}</span>
                      <span className="text-[#0400CC]">👥 {club.members}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setAllClubsOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#0400CC] hover:bg-[#030099] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
              >
                {t.lifeAtSit.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Club Photos */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={lightboxImage.src}
                alt={isLa ? (lightboxImage.captionLa || lightboxImage.caption) : lightboxImage.caption}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
            <p className="text-white text-sm sm:text-base font-semibold mt-4 text-center">
              {isLa ? (lightboxImage.captionLa || lightboxImage.caption) : lightboxImage.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
