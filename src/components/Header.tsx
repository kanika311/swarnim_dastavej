'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import RevertNotice from '@/components/RevertNotice';
import { 
  Search, 
  Home,
  PlayCircle,
  Tv,
  BookOpen,
  Newspaper, 
  UserCheck, 
  Sun, 
  Moon, 
  MapPin, 
  PenSquare, 
  ShieldCheck, 
  Menu, 
  X,
  ChevronDown,
  User as UserIcon,
  LogOut,
  PenTool,
  Check,
  Globe,
  LayoutDashboard
} from 'lucide-react';
import { UserRole } from '@/types';
import AuthModal from '@/components/AuthModal';
import { ALL_INDIA_LOCATIONS, TOP_FEATURED_CITIES } from '@/lib/locations';
import { getLocalizedUserName, getLocalizedUserFirstName, getLocalizedUserRole, getTranslation } from '@/lib/translations';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    currentUser, 
    openAuthModal,
    logout,
    switchRole,
    selectedCity, 
    setSelectedCity,
    fontSize, 
    setFontSize,
    isDarkMode, 
    toggleDarkMode,
    notifications,
    homeViewMode,
    setHomeViewMode,
    language,
    setLanguage,
    lastUpdatedTime,
    t
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMobileLang, setShowMobileLang] = useState(false);

  const languageMenuRef = useRef<HTMLDivElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showLanguageMenu && !showRoleMenu && !showMobileLang) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (showLanguageMenu && languageMenuRef.current && !languageMenuRef.current.contains(target)) {
        setShowLanguageMenu(false);
      }
      if (showRoleMenu && roleMenuRef.current && !roleMenuRef.current.contains(target)) {
        setShowRoleMenu(false);
      }
      if (showMobileLang && mobileLangRef.current && !mobileLangRef.current.contains(target)) {
        setShowMobileLang(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowLanguageMenu(false);
        setShowRoleMenu(false);
        setShowMobileLang(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showLanguageMenu, showRoleMenu, showMobileLang]);

  const cities = ['सभी शहर', 'लखनऊ', 'सीतापुर', 'कानपुर', 'अयोध्या', 'वाराणसी', 'प्रयागराज', 'दिल्ली'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchModal(false);
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'reader': return 'पाठक (Reader)';
      case 'citizen_journalist': return 'नागरिक पत्रकार';
      case 'staff_reporter': return 'संवाददाता';
      case 'editor': return 'संपादक';
      case 'admin': return 'व्यवस्थापक (CMS)';
      case 'super_admin': return 'प्रधान संपादक';
      default: return role;
    }
  };

  const formatHeaderDateTime = (dateStr: string, lang: string) => {
    const d = dateStr ? new Date(dateStr) : new Date();
    const validDate = isNaN(d.getTime()) ? new Date() : d;

    if (lang === 'en') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayName = days[validDate.getDay()];
      const monthName = months[validDate.getMonth()];
      const dateNum = validDate.getDate();
      const year = validDate.getFullYear();
      const timeStr = validDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      return `${dayName}, ${monthName} ${dateNum}, ${year} • ${timeStr}`;
    }

    if (lang === 'ur') {
      const daysUr = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
      const monthsUr = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
      const dayName = daysUr[validDate.getDay()];
      const monthName = monthsUr[validDate.getMonth()];
      const dateNum = validDate.getDate();
      const year = validDate.getFullYear();
      const timeStr = validDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      return `${dayName}، ${dateNum} ${monthName} ${year} • ${timeStr}`;
    }

    // Default Hindi
    const daysHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    const monthsHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
    const dayName = daysHi[validDate.getDay()];
    const monthName = monthsHi[validDate.getMonth()];
    const dateNum = validDate.getDate();
    const year = validDate.getFullYear();
    const timeStr = validDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${dayName}, ${dateNum} ${monthName} ${year} | ${timeStr}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      
      {/* MAIN TOP BAR (EXACT DAINIK BHASKAR STYLE) */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2.5 sm:gap-4">
        
        {/* LEFT: Sun Logo + Brand Title + Subtitle Date */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Logo & Live Time (Bhaskar Style) */}
          <Link 
            href="/" 
            onClick={() => setHomeViewMode('news')}
            className="flex items-center gap-2 sm:gap-3 group shrink-0"
          >
            {/* Official Brand Logo (New 3D Golden Emblem) */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white shadow-md border-2 border-amber-400/80 dark:border-amber-500/80 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/logo.png?v=4"
                alt="स्वर्णिम दस्तावेज़"
                width={48}
                height={48}
                className="w-full h-full object-contain rounded-full"
                priority
                unoptimized
              />
            </div>

            <div className="shrink-0 py-0.5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-serif tracking-tight whitespace-nowrap">
                  {t('site_title')}
                </span>
                <span className="hidden md:inline-block text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-1.5 py-0.2 rounded shrink-0">
                  {t('daily')}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                {formatHeaderDateTime(lastUpdatedTime, language)}
              </p>
            </div>
          </Link>
        </div>

        {/* CENTER: Navigation Items with Icons (Bhaskar Style) */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 2xl:gap-5 text-xs xl:text-sm font-semibold text-slate-700 dark:text-slate-200 shrink-0">
          
          {/* 1. Live news (Default Home View) */}
          <button
            onClick={() => {
              setHomeViewMode('news');
              if (pathname !== '/') router.push('/');
            }}
            className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1 rounded-xl transition cursor-pointer whitespace-nowrap shrink-0 ${
              pathname === '/' && homeViewMode === 'news'
                ? 'bg-amber-600 text-white font-extrabold shadow-xs'
                : 'hover:text-red-700 dark:hover:text-amber-400'
            }`}
          >
            <Home className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{language === 'en' ? 'Live News' : t('home_news')}</span>
          </button>

          {/* 2. Today's Newspaper (आज का ई-पेपर) */}
          <button
            onClick={() => {
              setHomeViewMode('epaper');
              if (pathname !== '/') router.push('/');
            }}
            className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1 rounded-xl transition cursor-pointer whitespace-nowrap shrink-0 ${
              pathname === '/' && homeViewMode === 'epaper'
                ? 'bg-red-700 text-white font-extrabold shadow-xs'
                : 'hover:text-red-700 dark:hover:text-amber-400'
            }`}
          >
            <Newspaper className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{language === 'en' ? "Today's Paper" : t('todays_epaper')}</span>
            <span className="hidden xl:inline-block text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase shrink-0">
              {language === 'en' ? 'E-Paper' : 'ई-पेपर'}
            </span>
          </button>

          {/* Videos */}
          <Link
            href="/category/videos"
            className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:text-red-600 dark:hover:text-amber-400 transition whitespace-nowrap shrink-0"
          >
            <PlayCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{t('videos')}</span>
          </Link>

          {/* Web Stories */}
          <Link
            href="/category/state"
            className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-xl hover:text-red-600 dark:hover:text-amber-400 transition whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{t('web_stories')}</span>
          </Link>

        </nav>

        {/* RIGHT UTILITIES & ACTIONS (CLEAN & ELEGANT) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* 📍 All India State / City Location Selector Button (Desktop Only) */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="hidden lg:flex relative p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
            title={selectedCity ? `शहर: ${selectedCity}` : 'राज्य व शहर चुनें (Select State & City)'}
            aria-label="राज्य व शहर चुनें"
          >
            <MapPin className="w-4 h-4 text-red-600" />
            {selectedCity && selectedCity !== 'सभी शहर' && selectedCity !== 'All Cities' && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Quick Search Button (Desktop Only) */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="hidden lg:flex p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
            title={t('search')}
            aria-label="खोजें (Search)"
          >
            <Search className="w-4 h-4 text-amber-600" />
          </button>

          {/* Notifications (Desktop Only) */}
          <div className="hidden lg:block">
            <RevertNotice />
          </div>

          {/* Language Selector Dropdown (Desktop Only) */}
          <div ref={languageMenuRef} className="hidden lg:block relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer shrink-0 select-none"
              title="भाषा बदलें (Change Language)"
              aria-label="भाषा चुनें"
            >
              <Globe className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-wide text-slate-800 dark:text-slate-100 uppercase">
                {(language || 'hi').toUpperCase()}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 mb-1">
                  भाषा चुनें (Language)
                </div>
                
                <button
                  onClick={() => {
                    setLanguage('hi');
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    language === 'hi'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">HI</span>
                    <span>हिन्दी (Hindi)</span>
                  </span>
                  {language === 'hi' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>

                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    language === 'en'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold flex items-center justify-center">EN</span>
                    <span>English</span>
                  </span>
                  {language === 'en' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>

                <button
                  onClick={() => {
                    setLanguage('ur');
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    language === 'ur'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center justify-center">UR</span>
                    <span>اردو (Urdu)</span>
                  </span>
                  {language === 'ur' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle (Desktop Only) */}
          <button
            onClick={toggleDarkMode}
            className="hidden lg:flex p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
            title={isDarkMode ? 'लाइट मोड' : 'डार्क मोड'}
            aria-label="थीम बदलें"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>


          {/* Real User Profile / Login Button (Desktop only, mobile is inside the menu) */}
          {currentUser ? (
            <div ref={roleMenuRef} className="hidden lg:block relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-semibold transition"
                title={language === 'en' ? 'My Profile' : language === 'ur' ? 'میری پروفائل' : 'मेरी प्रोफ़ाइल'}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[11px] shrink-0 border border-amber-300">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getLocalizedUserFirstName(currentUser.name, language).charAt(0) || 'U'
                  )}
                </div>
                <div className="hidden xl:flex flex-col text-left leading-tight">
                  <span className="text-[12px] font-bold text-slate-900 dark:text-white truncate max-w-[90px]">
                    {getLocalizedUserFirstName(currentUser.name, language)}
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                    {currentUser.role === 'citizen_journalist'
                      ? getLocalizedUserRole('citizen_journalist', language, true)
                      : getLocalizedUserRole('reader', language, true)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 text-xs">
                  {/* User Profile Header */}
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {getLocalizedUserName(currentUser.name, language)}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {currentUser.email || currentUser.phone}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      {currentUser.role === 'citizen_journalist' ? (
                        <>
                          <PenTool className="w-3 h-3 text-red-600" />
                          <span>{getLocalizedUserRole('citizen_journalist', language)} ({currentUser.city || (language === 'en' ? 'Sitapur' : 'सीतापुर')})</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3 h-3 text-amber-600" />
                          <span>{getLocalizedUserRole('reader', language)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Journalist Actions (Reference: Yogsathi User Menu) */}
                  <div className="py-2 space-y-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowRoleMenu(false)}
                      className="w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold transition cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>डैशबोर्ड (Dashboard)</span>
                    </Link>

                    <Link
                      href="/dashboard?tab=submit"
                      onClick={() => setShowRoleMenu(false)}
                      className="w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-700 dark:text-red-400 font-bold transition cursor-pointer"
                    >
                      <PenSquare className="w-4 h-4 text-red-600 shrink-0" />
                      <span>नई खबर / रिपोर्ट दर्ज करें</span>
                    </Link>

                    <Link
                      href="/dashboard?tab=my_reports"
                      onClick={() => setShowRoleMenu(false)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>मेरी भेजी गई खबरें व स्टेटस</span>
                    </Link>

                    <Link
                      href="/dashboard?tab=profile"
                      onClick={() => setShowRoleMenu(false)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>मेरी प्रोफ़ाइल (Profile)</span>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <button
                      onClick={() => {
                        logout();
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Logout' : language === 'ur' ? 'لاگ آؤٹ' : 'लॉगआउट (Logout)'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="hidden lg:flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs transition"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>लॉगिन</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button (extreme RIGHT side) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition cursor-pointer shrink-0 ml-0.5"
            aria-label="मेनू खोलें"
            title="मेनू"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* SEARCH MODAL */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Search className="w-4 h-4 text-amber-600" />
                स्वर्णिम दस्तावेज़ खोजें
              </span>
              <button 
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="mt-3">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="खबर, नेता, जिला, खेल या विषय खोजें..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>ट्रेंडिंग: सीतापुर हाईवे, गगनयान, सरायन नदी, ई-पेपर</span>
                <button
                  type="submit"
                  className="bg-red-700 text-white font-bold px-4 py-1.5 rounded-lg hover:bg-red-800"
                >
                  खोजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE MENU DRAWER (RESPONSIVE MENU WITH PROFILE & LANGUAGE) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
          
          {/* 🔍 QUICK SEARCH BAR (MOBILE) */}
          <form
            onSubmit={(e) => {
              handleSearch(e);
              setMobileMenuOpen(false);
            }}
            className="relative"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="खबर, ई-पेपर, जिला या विषय खोजें..."
              className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg transition cursor-pointer"
            >
              खोजें
            </button>
          </form>

          {/* 1. USER PROFILE OR LOGIN CARD */}
          {currentUser ? (
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs shrink-0 border border-amber-300">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getLocalizedUserFirstName(currentUser.name, language).charAt(0) || 'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                    {getLocalizedUserName(currentUser.name, language)}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {currentUser.email || currentUser.phone}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    {currentUser.role === 'citizen_journalist' ? (
                      <>
                        <PenTool className="w-3 h-3 text-red-600" />
                        <span>{getLocalizedUserRole('citizen_journalist', language)}</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-3 h-3 text-amber-600" />
                        <span>{getLocalizedUserRole('reader', language)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* User Dashboard & Journalism Links */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold text-xs transition cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>पत्रकार डैशबोर्ड (Journalist Dashboard)</span>
                </Link>

                <Link
                  href="/dashboard?tab=submit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold text-xs transition cursor-pointer"
                >
                  <PenSquare className="w-4 h-4 text-red-600 shrink-0" />
                  <span>नई खबर / रिपोर्ट दर्ज करें</span>
                </Link>

                <Link
                  href="/dashboard?tab=my_reports"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                >
                  <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>मेरी भेजी गई खबरें व स्टेटस</span>
                </Link>

                <Link
                  href="/dashboard?tab=profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                >
                  <UserIcon className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>मेरी प्रोफ़ाइल (Profile)</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-xl flex items-center gap-2 text-slate-500 hover:text-red-600 font-semibold text-xs transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Logout' : language === 'ur' ? 'لاگ آؤٹ' : 'लॉगआउट (Logout)'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-500/10 to-red-500/10 rounded-2xl p-4 border border-amber-300 dark:border-amber-800/60 flex items-center justify-between gap-3">
              <div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  स्वर्णिम दस्तावेज़ परिवार
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  खबरें भेजने एवं व्यक्तिगत अनुभव हेतु लॉगिन करें
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-xs shrink-0 cursor-pointer"
              >
                लॉगिन
              </button>
            </div>
          )}

          {/* 🌟 1-LINE QUICK CONTROLS: LANGUAGE, LOCATION, THEME (LOGOS ONLY, NO TEXT) */}
          <div className="relative flex items-center justify-around py-2 px-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            
            {/* 1. Language Logo / Selector */}
            <div ref={mobileLangRef} className="relative flex-1 flex justify-center">
              <button
                type="button"
                onClick={() => setShowMobileLang(!showMobileLang)}
                className="p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center justify-center"
                title="भाषा (Language)"
                aria-label="भाषा बदलें"
              >
                <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </button>

              {showMobileLang && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50">
                  <button
                    type="button"
                    onClick={() => { setLanguage('hi'); setShowMobileLang(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-bold transition ${language === 'hi' ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    अ हिन्दी
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLanguage('en'); setShowMobileLang(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-bold transition ${language === 'en' ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    A English
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLanguage('ur'); setShowMobileLang(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-bold transition ${language === 'ur' ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    ع اردو
                  </button>
                </div>
              )}
            </div>

            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700" />

            {/* 2. Location Logo */}
            <div className="flex-1 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLocationModal(true);
                }}
                className="relative p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center justify-center"
                title={selectedCity ? `शहर: ${selectedCity}` : "स्थान चुनें (Select Location)"}
                aria-label="स्थान चुनें"
              >
                <MapPin className="w-5 h-5 text-red-600" />
                {selectedCity && selectedCity !== 'सभी शहर' && selectedCity !== 'All Cities' && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-slate-800" />
                )}
              </button>
            </div>

            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700" />

            {/* 3. Theme Toggle Logo */}
            <div className="flex-1 flex justify-center">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center justify-center"
                title={isDarkMode ? "लाइट मोड" : "डार्क मोड"}
                aria-label="थीम बदलें"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                )}
              </button>
            </div>

          </div>

          {/* 2. NAVIGATION TILES */}
          <div className="space-y-2">
            <button 
              onClick={() => {
                setHomeViewMode('news');
                setMobileMenuOpen(false);
                if (pathname !== '/') router.push('/');
              }}
              className="w-full p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-between text-left border border-amber-200/60 dark:border-amber-900/60 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-5 h-5 text-amber-600" />
                <span className="text-sm">{language === 'en' ? 'Live News Feed' : t('home_news')}</span>
              </div>
              <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">LIVE</span>
            </button>

            <button 
              onClick={() => {
                setHomeViewMode('epaper');
                setMobileMenuOpen(false);
                if (pathname !== '/') router.push('/');
              }}
              className="w-full p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold flex items-center justify-between text-left border border-red-200/60 dark:border-red-900/60 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Newspaper className="w-5 h-5 text-red-600" />
                <span className="text-sm">{language === 'en' ? "Today's E-Paper" : t('todays_epaper')}</span>
              </div>
              <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full">E-Paper</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link 
                href="/dashboard?tab=submit" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              >
                <PenSquare className="w-4 h-4 text-red-600" />
                <span>खबर भेजें</span>
              </Link>
              <Link 
                href="/category/videos" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              >
                <PlayCircle className="w-4 h-4 text-red-600" />
                <span>वीडियो</span>
              </Link>
            </div>
          </div>

        </div>
      )}

      {/* ALL INDIA LOCATION SELECTION MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-start justify-center pt-6 sm:pt-14 px-3 sm:px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    अखिल भारतीय राज्य व शहर चयन (All India Locations)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    28 राज्य व केंद्र शासित प्रदेश — अपना ज़िला या संस्करण चुनें
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowLocationModal(false);
                  setLocationSearchQuery('');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  autoFocus
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  placeholder="राज्य या शहर खोजें (उदा: Lucknow, Patna, Jaipur, Sitapur, Kanpur, Mumbai)..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {locationSearchQuery && (
                  <button
                    onClick={() => setLocationSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Chips: Top / Featured Cities */}
            <div className="px-4 py-2.5 bg-amber-50/40 dark:bg-amber-950/20 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 shrink-0">
                त्वरित चयन:
              </span>
              {TOP_FEATURED_CITIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setSelectedCity(c.name);
                    setShowLocationModal(false);
                    setLocationSearchQuery('');
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition cursor-pointer ${
                    selectedCity === c.name || (c.name === 'सभी शहर' && (selectedCity === 'सभी शहर' || selectedCity === 'All Cities'))
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Body: All 28 States & UTs with their respective cities */}
            <div className="p-4 overflow-y-auto space-y-4 max-h-[55vh]">
              {(() => {
                const q = locationSearchQuery.trim().toLowerCase();
                const filteredStates = ALL_INDIA_LOCATIONS.filter(state => {
                  if (!q) return true;
                  const stateMatches = state.name.toLowerCase().includes(q) || state.nameHi.includes(q);
                  const cityMatches = state.cities.some(c => c.name.toLowerCase().includes(q) || c.nameHi.includes(q));
                  return stateMatches || cityMatches;
                });

                if (filteredStates.length === 0) {
                  return (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      कोई राज्य या शहर नहीं मिला &lsquo;{locationSearchQuery}&rsquo;।
                      <div className="mt-2">
                        <button
                          onClick={() => {
                            setSelectedCity(locationSearchQuery.trim());
                            setShowLocationModal(false);
                            setLocationSearchQuery('');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                        >
                          &lsquo;{locationSearchQuery.trim()}&rsquo; को फ़िल्टर के रूप में चुनें
                        </button>
                      </div>
                    </div>
                  );
                }

                return filteredStates.map(state => {
                  const matchingCities = q 
                    ? state.cities.filter(c => c.name.toLowerCase().includes(q) || c.nameHi.includes(q) || state.name.toLowerCase().includes(q) || state.nameHi.includes(q))
                    : state.cities;

                  return (
                    <div key={state.name} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/30">
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          <span>{state.name}</span>
                          <span className="text-slate-400 font-normal">({state.nameHi})</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCity(state.nameHi);
                            setShowLocationModal(false);
                            setLocationSearchQuery('');
                          }}
                          className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                        >
                          पूरा राज्य ({state.nameHi}) चुनें →
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {matchingCities.map(city => (
                          <button
                            key={city.name}
                            onClick={() => {
                              setSelectedCity(city.nameHi);
                              setShowLocationModal(false);
                              setLocationSearchQuery('');
                            }}
                            className={`px-2 py-1 rounded-lg text-xs transition cursor-pointer ${
                              selectedCity === city.nameHi || selectedCity === city.name
                                ? 'bg-amber-600 text-white font-bold shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-300 font-medium'
                            }`}
                          >
                            <span>{city.nameHi}</span>
                            <span className="text-[10px] text-slate-400 ml-1">({city.name})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Authentication & Role Modal (Reader vs Citizen Journalist) */}
      <AuthModal />

    </header>
  );
}
