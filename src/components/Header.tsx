'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  PenTool
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
    setHomeViewMode
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
      <div className="max-w-[1380px] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        
        {/* LEFT: Sun Logo + Brand Title + Subtitle Date */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            aria-label="मेनू खोलें"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo & Live Time (Bhaskar Style) */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Radiant Sun Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-red-700 rounded-full flex items-center justify-center text-white border-2 border-amber-300">
                <span className="text-xs sm:text-sm font-black tracking-tighter">स्वर्ण</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-serif">
                  स्वर्णिम दस्तावेज़
                </span>
                <span className="hidden sm:inline text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-1.5 py-0.2 rounded">
                  दैनिक
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Sun, Sep 27, 2026 | Updated 02:53 PM IST
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
            <span>आज का अखबार</span>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
              ई-पेपर
            </span>
          </button>

          {/* 2. Home (3-Panel Live Feed) */}
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
            <span>होम (लाइव न्यूज़)</span>
          </button>

          {/* Videos */}
          <Link
            href="/category/videos"
            className="flex items-center gap-1.5 hover:text-red-600 dark:hover:text-amber-400 transition"
          >
            <PlayCircle className="w-4 h-4 text-red-600" />
            <span>वीडियो</span>
          </Link>

          {/* Search Trigger */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-1.5 hover:text-red-600 dark:hover:text-amber-400 transition"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>सर्च</span>
          </button>

          {/* Watch */}
          <Link
            href="/category/videos"
            className="flex items-center gap-1.5 hover:text-red-600 dark:hover:text-amber-400 transition"
          >
            <Tv className="w-4 h-4 text-blue-600" />
            <span>वॉच</span>
          </Link>

          {/* Web Stories */}
          <Link
            href="/category/state"
            className="flex items-center gap-1.5 hover:text-red-600 dark:hover:text-amber-400 transition"
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>वेब स्टोरीज</span>
          </Link>

        </nav>

        {/* RIGHT UTILITIES & ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* City Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <select
              aria-label="शहर चुनें"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs font-bold focus:outline-none cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c} value={c} className="dark:bg-slate-900">{c}</option>
              ))}
            </select>
          </div>

          {/* Font Resizer */}
          <div className="hidden md:flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 text-[11px] font-bold">
            <button 
              onClick={() => setFontSize('sm')} 
              className={`px-1.5 py-0.5 rounded ${fontSize === 'sm' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500'}`}
              title="छोटा फ़ॉन्ट"
            >
              A-
            </button>
            <button 
              onClick={() => setFontSize('base')} 
              className={`px-1.5 py-0.5 rounded ${fontSize === 'base' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500'}`}
              title="सामान्य फ़ॉन्ट"
            >
              A
            </button>
            <button 
              onClick={() => setFontSize('lg')} 
              className={`px-1.5 py-0.5 rounded ${fontSize === 'lg' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500'}`}
              title="बड़ा फ़ॉन्ट"
            >
              A+
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDarkMode ? 'लाइट मोड' : 'डार्क मोड'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Citizen Reporter Button */}
          <Link
            href="/submit-news"
            className="hidden sm:flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs transition"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>खबर भेजें</span>
          </Link>

          {/* Real User Profile / Login Button */}
          {currentUser ? (
            <div className="relative">
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
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs transition"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>लॉगिन</span>
            </button>
          )}

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

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <button 
              onClick={() => {
                setHomeViewMode('epaper');
                setMobileMenuOpen(false);
                if (pathname !== '/') router.push('/');
              }}
              className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold flex items-center gap-2 text-left"
            >
              <Newspaper className="w-4 h-4 text-emerald-600" />
              <span>आज का अखबार</span>
            </button>
            <button 
              onClick={() => {
                setHomeViewMode('news');
                setMobileMenuOpen(false);
                if (pathname !== '/') router.push('/');
              }}
              className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-2 text-left"
            >
              <Home className="w-4 h-4 text-amber-600" />
              <span>होम (लाइव न्यूज़)</span>
            </button>
            <Link 
              href="/submit-news" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center gap-2"
            >
              <PenSquare className="w-4 h-4 text-red-600" />
              <span>खबर भेजें</span>
            </Link>
          </div>
        </div>
      )}

      {/* Authentication & Role Modal (Reader vs Citizen Journalist) */}
      <AuthModal />

    </header>
  );
}
