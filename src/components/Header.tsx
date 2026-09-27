'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
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
  Bell, 
  Menu, 
  X,
  ChevronDown,
  User as UserIcon,
  LogOut,
  PenTool,
  Check,
  Globe
} from 'lucide-react';
import { UserRole } from '@/types';
import AuthModal from '@/components/AuthModal';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    currentUser, 
    openAuthModal,
    logout,
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
    t
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      
      {/* MAIN TOP BAR (EXACT DAINIK BHASKAR STYLE) */}
      <div className="max-w-[1380px] mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 min-w-0">
        
        {/* LEFT: Sun Logo + Brand Title + Subtitle Date */}
        <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">

          {/* Logo & Live Time (Bhaskar Style) */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            {/* Official Brand Logo (New 3D Golden Emblem) */}
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white shadow-md border-2 border-amber-400/80 dark:border-amber-500/80 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/logo.png?v=4"
                alt="स्वर्णिम दस्तावेज़"
                width={56}
                height={56}
                className="w-full h-full object-contain rounded-full"
                priority
                unoptimized
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-serif truncate">
                  {t('site_title')}
                </span>
                <span className="hidden sm:inline text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-1.5 py-0.2 rounded">
                  {t('daily')}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                Sun, Sep 27, 2026
              </p>
            </div>
          </Link>
        </div>

        {/* CENTER / RIGHT: Navigation Items with Icons (Bhaskar Style) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[15px] font-semibold text-slate-700 dark:text-slate-200">
          
          {/* 1. Today's Newspaper (आज का अखबार - Default First) */}
          <button
            onClick={() => {
              setHomeViewMode('epaper');
              if (pathname !== '/') router.push('/');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition cursor-pointer ${
              pathname === '/' && homeViewMode === 'epaper'
                ? 'bg-red-700 text-white font-extrabold shadow-xs'
                : 'hover:text-red-700 dark:hover:text-amber-400'
            }`}
          >
            <Newspaper className="w-4 h-4 text-emerald-500" />
            <span>{t('todays_epaper')}</span>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
              {language === 'en' ? 'E-Paper' : 'ई-पेपर'}
            </span>
          </button>

          {/* 2. Live news */}
          <button
            onClick={() => {
              setHomeViewMode('news');
              if (pathname !== '/') router.push('/');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition cursor-pointer ${
              pathname === '/' && homeViewMode === 'news'
                ? 'bg-amber-600 text-white font-extrabold shadow-xs'
                : 'hover:text-red-700 dark:hover:text-amber-400'
            }`}
          >
            <Home className="w-4 h-4 text-amber-600" />
            <span>{t('home_news')}</span>
          </button>

          {/* Videos */}
          <Link
            href="/category/videos"
            className="flex items-center gap-1.5 hover:text-red-600 dark:hover:text-amber-400 transition"
          >
            <PlayCircle className="w-4 h-4 text-red-600" />
            <span>{t('videos')}</span>
          </Link>

          {/* Web Stories */}
          <Link
            href="/category/state"
            className="flex items-center gap-1.5 hover:text-red-600 dark:hover:text-amber-400 transition"
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>{t('web_stories')}</span>
          </Link>

        </nav>

        {/* RIGHT UTILITIES & ACTIONS (CLEAN & ELEGANT) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Quick Search Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title="Search"
          >
            <Search className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">{t('search')}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={isDarkMode ? 'लाइट मोड' : 'डार्क मोड'}
            aria-label="थीम बदलें"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Selector Dropdown (Desktop only, mobile version is in the menu!) */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-1 p-1 sm:px-2 sm:py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="भाषा बदलें (Change Language)"
              aria-label="भाषा चुनें"
            >
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-xs">
                {language === 'hi' ? 'अ' : language === 'en' ? 'A' : 'ع'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
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
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black flex items-center justify-center">अ</span>
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
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold flex items-center justify-center">A</span>
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
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center justify-center">ع</span>
                    <span>اردو (Urdu)</span>
                  </span>
                  {language === 'ur' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              </div>
            )}
          </div>


          {/* Real User Profile / Login Button (Desktop only, mobile is inside the menu) */}
          {currentUser ? (
            <div className="hidden lg:block relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-semibold transition"
                title="मेरी प्रोफ़ाइल"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[11px]">
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div className="hidden xl:flex flex-col text-left leading-tight">
                  <span className="text-[12px] font-bold text-slate-900 dark:text-white truncate max-w-[90px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                    {currentUser.role === 'citizen_journalist' ? 'नागरिक पत्रकार' : currentUser.role === 'admin' ? 'एडमिन' : 'पाठक'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 text-xs">
                  {/* User Profile Header */}
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {currentUser.email || currentUser.phone}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      {currentUser.role === 'citizen_journalist' ? (
                        <>
                          <PenTool className="w-3 h-3 text-red-600" />
                          <span>नागरिक पत्रकार ({currentUser.city || 'सीतापुर'})</span>
                        </>
                      ) : currentUser.role === 'admin' ? (
                        <>
                          <ShieldCheck className="w-3 h-3 text-amber-600" />
                          <span>प्रधान संपादक / एडमिन</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3 h-3 text-amber-600" />
                          <span>सामान्य पाठक (Reader)</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Role Specific Actions */}
                  <div className="py-2 space-y-1">
                    {currentUser.role === 'reader' && (
                      <button
                        onClick={() => {
                          setShowRoleMenu(false);
                          openAuthModal('register', 'citizen_journalist');
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-red-700 dark:text-red-400 font-bold transition"
                      >
                        <PenSquare className="w-4 h-4 text-red-600" />
                        <span>नागरिक पत्रकार बनें (खबर भेजें)</span>
                      </button>
                    )}

                    {currentUser.role === 'citizen_journalist' && (
                      <>
                        <Link
                          href="/submit-news"
                          onClick={() => setShowRoleMenu(false)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        >
                          <PenSquare className="w-3.5 h-3.5 text-red-600" />
                          <span>नई खबर दर्ज करें</span>
                        </Link>
                        <Link
                          href="/submit-news?tab=my_submissions"
                          onClick={() => setShowRoleMenu(false)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                          <span>मेरी भेजी गई खबरें</span>
                        </Link>
                      </>
                    )}

                    {currentUser.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setShowRoleMenu(false)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600 font-bold transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                        <span>CMS एडमिन डैशबोर्ड</span>
                      </Link>
                    )}
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
                      <span>लॉगआउट (Logout)</span>
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
          
          {/* 1. USER PROFILE OR LOGIN CARD */}
          {currentUser ? (
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {currentUser.email || currentUser.phone}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    {currentUser.role === 'citizen_journalist' ? (
                      <>
                        <PenTool className="w-3 h-3 text-red-600" />
                        <span>नागरिक पत्रकार</span>
                      </>
                    ) : currentUser.role === 'admin' ? (
                      <>
                        <ShieldCheck className="w-3 h-3 text-amber-600" />
                        <span>प्रधान संपादक / एडमिन</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-3 h-3 text-amber-600" />
                        <span>सामान्य पाठक (Reader)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Role specific quick action */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                {currentUser.role === 'reader' && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('register', 'citizen_journalist');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 text-red-700 dark:text-red-400 font-bold text-xs transition cursor-pointer"
                  >
                    <PenSquare className="w-4 h-4 text-red-600" />
                    <span>नागरिक पत्रकार बनें (खबर भेजें)</span>
                  </button>
                )}

                {currentUser.role === 'citizen_journalist' && (
                  <>
                    <Link
                      href="/submit-news"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold text-xs"
                    >
                      <PenSquare className="w-4 h-4 text-red-600" />
                      <span>नई खबर दर्ज करें</span>
                    </Link>
                    <Link
                      href="/submit-news?tab=my_submissions"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                    >
                      <UserCheck className="w-4 h-4 text-amber-600" />
                      <span>मेरी भेजी गई खबरें</span>
                    </Link>
                  </>
                )}

                {currentUser.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 bg-red-700 text-white font-bold text-xs shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>CMS एडमिन डैशबोर्ड खोलें</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-xl flex items-center gap-2 text-slate-500 hover:text-red-600 font-semibold text-xs transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>लॉगआउट (Logout)</span>
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

          {/* 2. LANGUAGE SELECTOR (MOBILE) */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-700">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>भाषा चुनें (Language):</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setLanguage('hi')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  language === 'hi'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-black">अ</span>
                <span>हिन्दी</span>
              </button>

              <button
                onClick={() => setLanguage('en')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-black">A</span>
                <span>English</span>
              </button>

              <button
                onClick={() => setLanguage('ur')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  language === 'ur'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-black">ع</span>
                <span>اردو</span>
              </button>
            </div>
          </div>

          {/* 3. NAVIGATION TILES */}
          <div className="space-y-2">
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
                <span className="text-sm">{t('todays_epaper')}</span>
              </div>
              <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full">डिफ़ॉल्ट</span>
            </button>

            <button 
              onClick={() => {
                setHomeViewMode('news');
                setMobileMenuOpen(false);
                if (pathname !== '/') router.push('/');
              }}
              className="w-full p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-2.5 text-left border border-amber-200/60 dark:border-amber-900/60 cursor-pointer"
            >
              <Home className="w-5 h-5 text-amber-600" />
              <span className="text-sm">{t('home_news')}</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link 
                href="/submit-news" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              >
                <PenSquare className="w-4 h-4 text-red-600" />
                <span>खबर भेजें</span>
              </Link>
              <Link 
                href="/videos" 
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

      {/* Authentication & Role Modal (Reader vs Citizen Journalist) */}
      <AuthModal />

    </header>
  );
}
