'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { EPaperEdition, EPaperPage } from '@/types';
import { playPageTurnSound } from '@/lib/audioSound';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Calendar, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Share2, 
  Maximize2, 
  X, 
  Volume2, 
  VolumeX, 
  ShieldCheck,
  TrendingUp,
  CloudSun,
  Flame,
  Award
} from 'lucide-react';

export default function TodayNewspaperReader() {
  const { epaperEditions, currentUser } = useApp();

  // State for date & edition selection
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-27');
  const [selectedCity, setSelectedCity] = useState<string>('लखनऊ');
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  
  // Flip animation & sound state
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Full Page Lightbox Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalZoom, setModalZoom] = useState<number>(100);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Find edition matching selected date & city, or fallback to first
  const currentEdition: EPaperEdition = 
    epaperEditions.find(e => e.date === selectedDate && (selectedCity === 'सभी' || e.editionCity.includes(selectedCity))) ||
    epaperEditions.find(e => e.date === selectedDate) ||
    epaperEditions[0];

  const totalPages = currentEdition?.pages?.length || 6;
  const currentPage: EPaperPage = currentEdition?.pages?.[activePageIndex] || {
    pageNumber: activePageIndex + 1,
    title: `पृष्ठ ${activePageIndex + 1}`,
    imageUrl: ''
  };

  // Turn page with 3D animation & sound
  const handlePageChange = (newIndex: number, direction: 'next' | 'prev') => {
    if (newIndex < 0 || newIndex >= totalPages || isFlipping) return;

    if (soundEnabled) {
      playPageTurnSound();
    }

    setFlipDirection(direction);
    setIsFlipping(true);

    setTimeout(() => {
      setActivePageIndex(newIndex);
      setIsFlipping(false);
    }, 320);
  };

  const handleNextPage = () => {
    if (activePageIndex < totalPages - 1) {
      handlePageChange(activePageIndex + 1, 'next');
    }
  };

  const handlePrevPage = () => {
    if (activePageIndex > 0) {
      handlePageChange(activePageIndex - 1, 'prev');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) {
        if (e.key === 'Escape') setIsModalOpen(false);
        if (e.key === 'ArrowRight') handleNextPage();
        if (e.key === 'ArrowLeft') handlePrevPage();
      } else {
        if (e.key === 'ArrowRight') handleNextPage();
        if (e.key === 'ArrowLeft') handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePageIndex, totalPages, isModalOpen, isFlipping]);

  const handleShare = () => {
    const shareUrl = window.location.origin + `/epaper?date=${selectedDate}&page=${activePageIndex + 1}`;
    if (navigator.share) {
      navigator.share({
        title: `स्वर्णिम दस्तावेज़ ई-पेपर (${selectedDate} - पृष्ठ ${activePageIndex + 1})`,
        text: `आज का स्वर्णिम दस्तावेज़ ई-पेपर पढ़ें - ${currentPage.title}`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <section className="w-full space-y-4">
      
      {/* 1. EPAPER TOP CONTROLS & DATE SELECTOR (Clean, elegant, no awkward text) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
          
          {/* Left: Date picker & Edition */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 px-2.5 py-1.5 rounded-xl font-bold text-slate-900 dark:text-slate-100">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="hidden sm:inline">दिनांक:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setActivePageIndex(0);
                }}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-1.5 py-0.5 text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:ring-1 focus:ring-amber-500 font-mono font-bold"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setActivePageIndex(0);
                }}
                className="bg-transparent font-bold text-slate-800 dark:text-slate-200 text-xs outline-none cursor-pointer"
              >
                <option value="लखनऊ" className="dark:bg-slate-900">लखनऊ मुख्य संस्करण</option>
                <option value="सीतापुर" className="dark:bg-slate-900">सीतापुर जिला संस्करण</option>
                <option value="दिल्ली" className="dark:bg-slate-900">दिल्ली-एनसीआर</option>
              </select>
            </div>
          </div>

          {/* Right: Sound Icon Only (No Text), Page Navigation & Fullscreen */}
          <div className="flex items-center gap-2 ml-auto">
            
            {/* Page Flip Sound Toggle - ICON ONLY (no 'साउंड ऑन' text) */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                soundEnabled 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-400'
              }`}
              title={soundEnabled ? 'पेज फ्लिप साउंड चालू है (म्यूट करें)' : 'साउंड म्यूट है (अनम्यूट करें)'}
              aria-label="Sound Toggle"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Page Navigation Controls */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => handlePageChange(0, 'prev')}
                disabled={activePageIndex === 0 || isFlipping}
                className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30 transition cursor-pointer"
                title="पहला पृष्ठ"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrevPage}
                disabled={activePageIndex === 0 || isFlipping}
                className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 shadow-xs font-bold text-slate-800 dark:text-slate-100 disabled:opacity-30 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">पिछला</span>
              </button>

              <span className="px-2 sm:px-3 font-mono font-extrabold text-amber-700 dark:text-amber-400 text-xs">
                {activePageIndex + 1} / {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={activePageIndex === totalPages - 1 || isFlipping}
                className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg bg-red-700 hover:bg-red-800 text-white shadow-xs font-bold disabled:opacity-30 transition cursor-pointer"
              >
                <span className="hidden sm:inline">अगला</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handlePageChange(totalPages - 1, 'next')}
                disabled={activePageIndex === totalPages - 1 || isFlipping}
                className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30 transition cursor-pointer"
                title="अंतिम पृष्ठ"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>

            {/* Full Page Lightbox Trigger */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-amber-300 font-bold px-3 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
              title="फुल पेज ज़ूम रीडर खोलें"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">फुल पेज खोलें</span>
            </button>

            {/* Admin CMS link */}
            {(currentUser?.role === 'admin' || currentUser?.role === 'editor') && (
              <Link
                href="/admin?tab=epaper"
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-2.5 py-1.5 rounded-xl shadow-xs text-xs"
                title="एडमिन: ई-पेपर अपडेट करें"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">अपडेट</span>
              </Link>
            )}

          </div>

        </div>

        {/* Page Thumbnail Selector Pills */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">पन्ने:</span>
            {currentEdition.pages.map((p, idx) => (
              <button
                key={p.pageNumber}
                onClick={() => handlePageChange(idx, idx > activePageIndex ? 'next' : 'prev')}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  idx === activePageIndex
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                पेज {p.pageNumber}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-500 italic shrink-0 hidden md:inline">
            🔍 पन्ने पर कहीं भी क्लिक करके बड़ा (Zoomed) पढ़ें।
          </span>
        </div>
      </div>

      {/* 2. THE NEWSPAPER BROADSHEET CANVAS WITH CONTRASTING BACKDROP */}
      <div className="relative mx-auto flex items-center justify-center py-6 px-3 sm:px-12 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 shadow-2xl border border-slate-800 my-2 overflow-hidden">
        {/* Subtle ambient lighting effect in the background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/40 via-transparent to-transparent pointer-events-none"></div>

        {/* Left Arrow Trigger */}
        {activePageIndex > 0 ? (
          <button
            onClick={handlePrevPage}
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-[0_10px_25px_rgba(0,0,0,0.5)] border-2 border-white dark:border-slate-500 flex items-center justify-center hover:bg-red-700 hover:text-white hover:border-red-600 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group"
            aria-label="पिछला पन्ना"
            title="पिछला पन्ना (Previous Page)"
          >
            <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3] group-hover:scale-110 transition-transform" />
            <span className="sr-only">पिछला पन्ना</span>
          </button>
        ) : (
          <div 
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-800/40 border border-slate-700/40 flex items-center justify-center opacity-30 cursor-not-allowed"
            title="प्रथम पृष्ठ पर हैं"
          >
            <ChevronLeft className="w-7 h-7 stroke-[2.5] text-slate-500" />
          </div>
        )}

        {/* Right Arrow Trigger */}
        {activePageIndex < totalPages - 1 ? (
          <button
            onClick={handleNextPage}
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-[0_10px_25px_rgba(0,0,0,0.5)] border-2 border-white dark:border-slate-500 flex items-center justify-center hover:bg-red-700 hover:text-white hover:border-red-600 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group"
            aria-label="अगला पन्ना"
            title="अगला पन्ना (Next Page)"
          >
            <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3] group-hover:scale-110 transition-transform" />
            <span className="sr-only">अगला पन्ना</span>
          </button>
        ) : (
          <div 
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-800/40 border border-slate-700/40 flex items-center justify-center opacity-30 cursor-not-allowed"
            title="अंतिम पृष्ठ पर हैं"
          >
            <ChevronRight className="w-7 h-7 stroke-[2.5] text-slate-500" />
          </div>
        )}

        {/* NEWSPAPER PAGE (Proper Broadsheet Ratio 1:1.414, Max Height ~72vh, Centered) */}
        <div
          onClick={() => setIsModalOpen(true)}
          className={`cursor-pointer bg-[#fbf9f4] text-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-sm shadow-2xl overflow-hidden transition-all duration-300 group hover:shadow-red-500/20 max-h-[72vh] sm:max-h-[76vh] aspect-[1/1.414] w-auto relative flex flex-col justify-between ${
            isFlipping 
              ? flipDirection === 'next' 
                ? 'scale-[0.98] rotate-y-6 opacity-80' 
                : 'scale-[0.98] -rotate-y-6 opacity-80' 
              : 'scale-100 rotate-0 opacity-100'
          }`}
          style={{
            perspective: '1200px',
            transformOrigin: flipDirection === 'next' ? 'left center' : 'right center'
          }}
        >
          {/* Subtle Paper Grain Overlay & Spine Crease */}
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/10 via-black/3 to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/10 via-black/3 to-transparent pointer-events-none z-10"></div>

          {/* Click to Zoom Hover Badge */}
          <div className="absolute top-3 right-3 z-20 bg-slate-950/85 text-amber-300 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:bg-red-700 group-hover:text-white transition shadow-md">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>फुल स्क्रीन पढ़ें</span>
          </div>

          {/* AUTHENTIC BROADSHEET NEWSPAPER PAGE CONTENT (PAGES 1 to 6) */}
          <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between overflow-hidden select-none bg-[#fbf9f4]">
            
            {/* --- PAGE 1: FRONT PAGE (मुख्य पृष्ठ) --- */}
            {activePageIndex === 0 && (
              <div className="flex-1 flex flex-col justify-between space-y-2 text-slate-950">
                {/* Registration & Issue Dateline */}
                <div className="border-b border-slate-800 pb-1 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-slate-700">
                  <span>RNI No. UPHIN/26/A7984</span>
                  <span className="font-bold">वर्ष 12 | अंक 245</span>
                  <span>मूल्य: ₹4.00</span>
                </div>

                {/* Newspaper Masthead */}
                <div className="text-center py-1 border-b-2 border-slate-900">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif tracking-tight text-slate-950">
                    स्वर्णिम दस्तावेज़
                  </h2>
                  <p className="text-[9px] sm:text-[10px] text-slate-600 font-semibold tracking-wider">
                    सत्य, निष्पक्षता एवं स्वर्णिम सरोकार | लखनऊ एवं सीतापुर का अग्रणी हिंदी दैनिक
                  </p>
                  <div className="mt-1 flex items-center justify-between text-[9px] sm:text-[10px] font-bold border-t border-slate-800 pt-0.5 text-slate-800">
                    <span>रविवार, {selectedDate}</span>
                    <span className="bg-red-700 text-white px-1.5 py-0.2 rounded font-sans">{selectedCity} मुख्य संस्करण</span>
                    <span>पृष्ठ: 1/6</span>
                  </div>
                </div>

                {/* Super Lead Headline */}
                <div className="bg-amber-50/60 p-2 rounded border border-amber-200">
                  <span className="bg-red-700 text-white font-extrabold text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded uppercase">
                    बड़ी खबर • कैबिनेट फैसला
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-black font-serif leading-tight mt-1 text-slate-950">
                    यूपी में हाईवे नेटवर्क का महा-विस्तार: लखनऊ-सीतापुर-लखीमपुर 6 लेन कॉरिडोर को मंजूरी, यात्रा समय आधा होगा
                  </h3>
                  <p className="text-[10px] text-slate-700 mt-1 line-clamp-2 leading-relaxed">
                    4,200 करोड़ की लागत से 138 किमी लंबा आधुनिक ग्रीनफील्ड एक्सप्रेसवे बनेगा। सीतापुर से लखनऊ अब मात्र 45 मिनट में।
                  </p>
                </div>

                {/* Lead Photo & 2 Column News */}
                <div className="grid grid-cols-12 gap-2 flex-1 items-start">
                  {/* Photo & Caption (7 cols) */}
                  <div className="col-span-7 space-y-1">
                    <div className="relative aspect-[16/10] w-full rounded overflow-hidden bg-slate-900 border border-slate-300">
                      <img
                        src="https://images.unsplash.com/photo-1545158826-6a3196c80251?w=800&auto=format&fit=crop&q=80"
                        alt="Highways"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[8px] sm:text-[9px] text-slate-600 italic">
                      लखनऊ-सीतापुर एक्सप्रेसवे रूट एवं औद्योगिक गलियारा योजना
                    </p>
                  </div>

                  {/* Side Headlines (5 cols) */}
                  <div className="col-span-5 space-y-2 border-l border-slate-300 pl-2">
                    <div className="border-b border-slate-200 pb-1">
                      <span className="text-red-700 font-bold text-[8px]">अंतरिक्ष • इसरो</span>
                      <h4 className="text-[10px] sm:text-[11px] font-bold font-serif leading-tight">
                        गगनयान मानवरहित मिशन की सफल लैंडिंग, अंतरिक्ष में भारत का दबदबा
                      </h4>
                    </div>
                    <div>
                      <span className="text-emerald-700 font-bold text-[8px]">सीतापुर विशेष</span>
                      <h4 className="text-[10px] sm:text-[11px] font-bold font-serif leading-tight">
                        सरायन नदी को पुनर्जीवित करने आगे आए युवा, निकाला 10 टन कचरा
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Bottom Ad / Scheme Banner */}
                <div className="bg-gradient-to-r from-amber-600 to-red-700 text-white p-2 rounded flex items-center justify-between text-[10px]">
                  <div>
                    <span className="font-bold text-amber-200">पीएम कुसुम योजना:</span>
                    <span className="ml-1">किसानों को सोलर पंप पर 70% सब्सिडी, ऑनलाइन आवेदन जारी।</span>
                  </div>
                  <span className="bg-white text-slate-950 font-black px-2 py-0.5 rounded text-[8px]">
                    कृषि विभाग
                  </span>
                </div>
              </div>
            )}

            {/* --- PAGE 2: STATE NEWS (प्रादेशिक हलचल) --- */}
            {activePageIndex === 1 && (
              <div className="flex-1 flex flex-col justify-between space-y-2 text-slate-950">
                <div className="border-b-2 border-slate-900 pb-1 flex items-center justify-between text-[10px] font-bold">
                  <span>स्वर्णिम दस्तावेज़</span>
                  <span className="text-red-700 uppercase font-black">प्रादेशिक हलचल (उत्तर प्रदेश)</span>
                  <span>पृष्ठ: 2/6</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="border-b border-slate-300 pb-2">
                    <span className="bg-amber-100 text-amber-900 font-bold text-[8px] px-1 rounded">अयोध्या विशेष</span>
                    <h3 className="text-sm sm:text-base font-bold font-serif leading-snug mt-1">
                      अयोध्या में विश्वस्तरीय रामायण संग्रहालय का निर्माण तेज: 100 देशों की रामायण परंपराएं होंगी प्रदर्शित
                    </h3>
                    <p className="text-[10px] text-slate-700 line-clamp-2 mt-0.5">
                      सरयू तट पर 10 एकड़ में आधुनिक सांस्कृतिक केंद्र, 3D हॉलोग्राम व वर्चुअल रियलिटी थियेटर का निर्माण कार्य तीव्र गति से जारी।
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-blue-700 font-bold text-[8px]">कानपुर</span>
                      <h4 className="text-[11px] font-bold font-serif mt-0.5">
                        गंगा बैराज रिवरफ्रंट को मिली नई सौगात, पर्यटकों के लिए बोटिंग क्लब शुरू
                      </h4>
                      <p className="text-[9px] text-slate-600 line-clamp-2 mt-1">
                        कानपुर विकास प्राधिकरण ने 45 करोड़ की लागत से विकसित रिवरफ्रंट का लोकार्पण किया।
                      </p>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-emerald-700 font-bold text-[8px]">वाराणसी</span>
                      <h4 className="text-[11px] font-bold font-serif mt-0.5">
                        काशी विश्वनाथ धाम में 15 करोड़ श्रद्धालुओं का नया कीर्तिमान स्थापित
                      </h4>
                      <p className="text-[9px] text-slate-600 line-clamp-2 mt-1">
                        गंगा आरती दर्शन हेतु श्रद्धालुओं की ऐतिहासिक संख्या, पर्यटन उद्योग को भारी लाभ।
                      </p>
                    </div>
                  </div>

                  <div className="p-2 bg-amber-50 rounded border border-amber-200">
                    <span className="text-red-700 font-bold text-[8px]">प्रयागराज महाकुंभ 2025</span>
                    <h4 className="text-[11px] font-bold font-serif mt-0.5">
                      45 करोड़ श्रद्धालुओं के आगमन की तैयारी, 25,000 टेंट सिटी और आधुनिक स्वास्थ्य केंद्र
                    </h4>
                  </div>
                </div>

                <div className="border-t border-slate-300 pt-1 text-[9px] text-slate-500 text-center">
                  स्वर्णिम दस्तावेज़ • उत्तर प्रदेश संस्करण • {selectedDate}
                </div>
              </div>
            )}

            {/* --- PAGE 3: AWADH / DISTRICT NEWS (अवध परिक्रमा - लखनऊ व सीतापुर) --- */}
            {activePageIndex === 2 && (
              <div className="flex-1 flex flex-col justify-between space-y-2 text-slate-950">
                <div className="border-b-2 border-slate-900 pb-1 flex items-center justify-between text-[10px] font-bold">
                  <span>स्वर्णिम दस्तावेज़</span>
                  <span className="text-red-700 uppercase font-black">अवध परिक्रमा (लखनऊ व सीतापुर नगर)</span>
                  <span>पृष्ठ: 3/6</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="bg-red-100 text-red-800 font-bold text-[8px] px-1 rounded">लखनऊ मेट्रो</span>
                    <h3 className="text-sm font-bold font-serif mt-0.5">
                      लखनऊ मेट्रो फेज-2: चारबाग से वसंत कुंज 11.8 किमी रूट की डीपीआर मंजूर, 12 स्टेशनों को कनेक्टिविटी
                    </h3>
                    <p className="text-[10px] text-slate-700 line-clamp-2 mt-0.5">
                      अमीनाबाद, चौक, ठाकुरगंज और मेडिकल कॉलेज के लाखों व्यापारियों व मरीजों को जाम से मुक्ति मिलेगी।
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-amber-700 font-bold text-[8px]">सीतापुर नवीन मंडी</span>
                      <h4 className="text-[11px] font-bold font-serif mt-0.5">
                        गेहूं और सरसों की रिकॉर्ड आवक, किसानों को मिले ₹2,425 प्रति क्विंटल
                      </h4>
                    </div>

                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-indigo-700 font-bold text-[8px]">नैमिषारण्य धाम</span>
                      <h4 className="text-[11px] font-bold font-serif mt-0.5">
                        चक्रतीर्थ सौंदर्यीकरण हेतु 120 करोड़ की परियोजना को अंतिम मंजूरी
                      </h4>
                    </div>
                  </div>

                  <div className="p-2 bg-red-50/60 rounded border border-red-200">
                    <span className="text-red-700 font-bold text-[8px]">जनसमस्या व समाधान</span>
                    <h4 className="text-[11px] font-bold font-serif mt-0.5">
                      सीतापुर-लहरपुर मार्ग पर टूटी पुलिया की मरम्मत शुरू, ग्रामीणों की मांग पर प्रशासन ने लिया संज्ञान
                    </h4>
                  </div>
                </div>

                <div className="border-t border-slate-300 pt-1 text-[9px] text-slate-500 text-center">
                  सीतापुर एवं लखनऊ जिला संवाद ब्यूरो
                </div>
              </div>
            )}

            {/* --- PAGE 4: EDITORIAL (संपादकीय पृष्ठ) --- */}
            {activePageIndex === 3 && (
              <div className="flex-1 flex flex-col justify-between space-y-2 text-slate-950">
                <div className="border-b-2 border-slate-900 pb-1 flex items-center justify-between text-[10px] font-bold">
                  <span>स्वर्णिम दस्तावेज़</span>
                  <span className="text-amber-800 uppercase font-black">संपादकीय एवं विचार मंच (Editorial & Op-Ed)</span>
                  <span>पृष्ठ: 4/6</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="p-2 bg-white rounded border-l-4 border-slate-900 shadow-xs">
                    <span className="text-[9px] font-extrabold uppercase text-slate-500">मुख्य संपादकीय</span>
                    <h3 className="text-sm font-bold font-serif mt-0.5">
                      बुनियादी ढांचे की नई उड़ान और अवध क्षेत्र का कायाकल्प
                    </h3>
                    <p className="text-[10px] text-slate-700 leading-relaxed mt-1 line-clamp-3">
                      उत्तर प्रदेश में नए 6-लेन ग्रीनफील्ड एक्सप्रेसवे न केवल यात्रा का समय घटाएंगे बल्कि स्थानीय कृषि मंडियों और सूक्ष्म उद्योगों को दिल्ली तथा अन्य महानगरों से जोड़कर समृद्धि लाएंगे।
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[8px] font-bold text-amber-700">विशेष स्तंभकार</span>
                      <h4 className="text-[10px] font-bold font-serif mt-0.5">
                        नागरिक पत्रकारिता: लोकतंत्र की जमीनी आवाज
                      </h4>
                      <p className="text-[9px] text-slate-600 line-clamp-2 mt-0.5">
                        जब आम नागरिक अपनी समस्या को तथ्य व प्रमाण के साथ उजागर करता है, तो जवाबदेही बढ़ती है।
                      </p>
                    </div>

                    <div className="p-2 bg-amber-50 rounded border border-amber-200 flex flex-col justify-between">
                      <span className="text-[8px] font-bold text-red-700">आज का स्वर्णिम विचार</span>
                      <p className="text-[10px] font-serif font-bold italic text-slate-800 mt-1">
                        &quot;सत्यमेव जयते नानृतं — सत्य की ही विजय होती है, असत्य की नहीं।&quot;
                      </p>
                      <span className="text-[8px] text-slate-500 mt-1">— मुंडकोपनिषद्</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-300 pt-1 text-[9px] text-slate-500 text-center">
                  प्रधान संपादक: रामेश्वर दयाल | वरिष्ठ संपादक: अनुराधा अवस्थी
                </div>
              </div>
            )}

            {/* --- PAGE 5: BUSINESS & SPORTS (कारोबार एवं खेल) --- */}
            {activePageIndex === 4 && (
              <div className="flex-1 flex flex-col justify-between space-y-2 text-slate-950">
                <div className="border-b-2 border-slate-900 pb-1 flex items-center justify-between text-[10px] font-bold">
                  <span>स्वर्णिम दस्तावेज़</span>
                  <span className="text-emerald-800 uppercase font-black">कारोबार एवं क्रीड़ा जगत (Business & Sports)</span>
                  <span>पृष्ठ: 5/6</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-emerald-50/50 rounded border border-emerald-200">
                      <span className="text-emerald-700 font-bold text-[8px]">बाजार हलचल</span>
                      <h4 className="text-[11px] font-bold font-serif mt-0.5">
                        सेंसेक्स 85,000 के ऐतिहासिक शिखर पर, बैंकिंग व ऑटो शेयरों में भारी उछाल
                      </h4>
                    </div>

                    <div className="p-2 bg-blue-50/50 rounded border border-blue-200">
                      <span className="text-blue-700 font-bold text-[8px]">क्रिकेट विशेष</span>
                      <h4 className="text-[11px] font-bold font-serif mt-0.5">
                        बॉर्डर-गावस्कर ट्रॉफी: ग्रीन पार्क में भारतीय टीम का अभ्यास सत्र शुरू
                      </h4>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="font-bold text-[9px] text-slate-700">सर्राफा एवं कमोडिटी भाव (आज का बाजार):</span>
                    <div className="grid grid-cols-3 gap-1 mt-1 text-[9px] font-bold text-center">
                      <div className="bg-white p-1 rounded border">सोना (24K): ₹76,400</div>
                      <div className="bg-white p-1 rounded border">चांदी: ₹92,000</div>
                      <div className="bg-white p-1 rounded border">पेट्रोल: ₹94.65/L</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-300 pt-1 text-[9px] text-slate-500 text-center">
                  दैनिक कारोबार एवं क्रीड़ा रिपोर्ट
                </div>
              </div>
            )}

            {/* --- PAGE 6: CLASSIFIEDS & NOTICES (क्लासिफाइड व निविदाएं) --- */}
            {activePageIndex === 5 && (
              <div className="flex-1 flex flex-col justify-between space-y-2 text-slate-950">
                <div className="border-b-2 border-slate-900 pb-1 flex items-center justify-between text-[10px] font-bold">
                  <span>स्वर्णिम दस्तावेज़</span>
                  <span className="text-slate-700 uppercase font-black">क्लासिफाइड, सार्वजनिक निविदाएं एवं मौसम</span>
                  <span>पृष्ठ: 6/6</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="p-2 bg-amber-50/70 rounded border border-amber-300">
                    <span className="text-red-700 font-bold text-[8px]">सार्वजनिक सूचना</span>
                    <h4 className="text-[10px] font-bold font-serif mt-0.5">
                      नगर पालिका परिषद सीतापुर: गृहकर एवं जलकल बकाया जमा करने हेतु अंतिम अवसर
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="font-bold text-slate-800">रोजगार सूचना:</span>
                      <p className="text-slate-600 mt-0.5">
                        स्वर्णिम दस्तावेज़ डिजिटल डेस्क हेतु 2 उप-संपादक व अनुवादक की आवश्यकता। बायोडाटा भेजें।
                      </p>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="font-bold text-slate-800">मौसम पूर्वानुमान:</span>
                      <p className="text-slate-600 mt-0.5">
                        लखनऊ व सीतापुर: अधिकतम 30°C, न्यूनतम 22°C। आंशिक बादल छाए रहने की संभावना।
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-slate-900 pt-1 text-[9px] text-slate-600 text-center font-bold">
                  स्वर्णिम दस्तावेज़ दैनिक समाचार पत्र • मुद्रित एवं डिजिटल संस्करण • समापन पृष्ठ
                </div>
              </div>
            )}

          </div>

          {/* Bottom Bar on Canvas */}
          <div className="bg-slate-950 text-white px-3 py-1 flex items-center justify-between text-[10px]">
            <span className="font-bold text-amber-300">
              पृष्ठ {currentPage.pageNumber} / {totalPages}
            </span>
            <span className="text-slate-400">
              क्लिक करें ➔ पूरा पन्ना ज़ूम होगा
            </span>
          </div>

        </div>

      </div>

      {/* 3. FULL PAGE LIGHTBOX / ZOOM MODAL (High-Res Reader) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          
          {/* Modal Top Toolbar */}
          <div className="bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
            
            {/* Title & Page info */}
            <div className="flex items-center gap-3">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                पृष्ठ {activePageIndex + 1} / {totalPages}
              </span>
              <h3 className="font-bold text-sm sm:text-base font-serif hidden sm:inline text-slate-100">
                {currentEdition.editionTitle} - {selectedDate}
              </h3>
            </div>

            {/* Middle Zoom controls */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1">
              <button
                onClick={() => setModalZoom(prev => Math.max(prev - 25, 75))}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 cursor-pointer"
                title="छोटा करें"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-mono font-bold text-amber-400">
                {modalZoom}%
              </span>
              <button
                onClick={() => setModalZoom(prev => Math.min(prev + 25, 250))}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 cursor-pointer"
                title="बड़ा करें"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setModalZoom(100)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 cursor-pointer"
                title="रीसेट"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right actions & close */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-300 cursor-pointer"
                title="शेयर करें"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition cursor-pointer"
                title="बंद करें (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Modal Main Viewport with Next / Prev Overlay and Zoom Drag */}
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative select-none">
            
            {/* Modal Prev Arrow */}
            {activePageIndex > 0 && (
              <button
                onClick={handlePrevPage}
                className="fixed left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/90 text-white flex items-center justify-center hover:bg-red-600 transition shadow-2xl border border-slate-700 cursor-pointer"
                title="पिछला पृष्ठ (Left Arrow)"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Modal Next Arrow */}
            {activePageIndex < totalPages - 1 && (
              <button
                onClick={handleNextPage}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/90 text-white flex items-center justify-center hover:bg-red-600 transition shadow-2xl border border-slate-700 cursor-pointer"
                title="अगला पृष्ठ (Right Arrow)"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}

            {/* The Zoomed Scaled Newspaper Page */}
            <div
              style={{ width: `${modalZoom}%`, maxWidth: modalZoom > 100 ? 'none' : '820px' }}
              className="transition-all duration-200 bg-[#fbf9f4] text-slate-950 rounded-sm shadow-2xl overflow-hidden p-6 sm:p-10 border border-slate-400 aspect-[1/1.414]"
            >
              {/* High-res modal contents */}
              <div className="border-b-2 border-slate-900 pb-2 mb-4 flex items-center justify-between text-xs font-bold font-mono">
                <span>स्वर्णिम दस्तावेज़ दैनिक समाचार पत्र</span>
                <span className="text-red-700 font-sans font-black">{selectedCity} संस्करण • दिनांक {selectedDate}</span>
                <span>पृष्ठ {activePageIndex + 1}</span>
              </div>

              {activePageIndex === 0 && (
                <div className="space-y-4">
                  <div className="text-center py-2 border-b-2 border-slate-900">
                    <h1 className="text-4xl sm:text-5xl font-black font-serif text-slate-950">
                      स्वर्णिम दस्तावेज़
                    </h1>
                    <p className="text-xs text-slate-600 font-semibold tracking-wider mt-1">
                      सत्य, निष्पक्षता एवं स्वर्णिम सरोकार | लखनऊ एवं सीतापुर का अग्रणी हिंदी दैनिक
                    </p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded border border-amber-300">
                    <span className="bg-red-700 text-white font-extrabold text-xs px-2 py-0.5 rounded">
                      कैबिनेट बड़ा फैसला
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black font-serif mt-2 leading-tight">
                      यूपी में हाईवे नेटवर्क का महा-विस्तार: लखनऊ-सीतापुर-लखीमपुर 6 लेन कॉरिडोर को मंजूरी
                    </h2>
                    <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                      4,200 करोड़ रुपये की अनुमानित लागत से 138 किलोमीटर लंबा ग्रीनफील्ड एक्सेस-कंट्रोल्ड हाईवे बनेगा। सीतापुर और महोली के पास आधुनिक लॉजिस्टिक्स हब और एग्री-प्रोसेसिंग क्लस्टर स्थापित होंगे।
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white border rounded">
                      <span className="text-red-700 font-bold text-xs">इसरो • गगनयान</span>
                      <h3 className="text-base font-bold font-serif mt-1">
                        गगनयान मानवरहित मिशन की सफल लैंडिंग, अंतरिक्ष में भारत का दबदबा
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        क्रू एस्केप सिस्टम ने आपातकालीन स्थिति में अंतरिक्ष यात्रियों को सुरक्षित अलग करने का सफल परीक्षण पूरा किया।
                      </p>
                    </div>
                    <div className="p-3 bg-white border rounded">
                      <span className="text-emerald-700 font-bold text-xs">सीतापुर ग्राउंड रिपोर्ट</span>
                      <h3 className="text-base font-bold font-serif mt-1">
                        सरायन नदी को पुनर्जीवित करने आगे आए युवा, निकाला 10 टन कचरा
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        स्थानीय नागरिकों और स्वयंसेवकों की मुहिम रंग लाई, नगर पालिका ने 6 ट्रैक्टर-ट्रॉली उपलब्ध कराईं।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePageIndex > 0 && (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded border">
                    <h2 className="text-2xl font-black font-serif text-slate-900">
                      {currentPage.title}
                    </h2>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      स्वर्णिम दस्तावेज़ के {selectedCity} संस्करण के विस्तृत पन्ने को आप उच्च रिज़ॉल्यूशन में पढ़ रहे हैं।
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded border space-y-3">
                    <h3 className="text-lg font-bold font-serif">
                      अवध एवं प्रादेशिक विकास कार्यों की प्रमुख सुर्खियां
                    </h3>
                    <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4 leading-relaxed">
                      <li>लखनऊ-सीतापुर एक्सप्रेसवे टेंडर प्रक्रिया अगले माह से शुरू।</li>
                      <li>चारबाग-वसंत कुंज मेट्रो कॉरिडोर के 12 स्टेशनों का सर्वेक्षण पूरा।</li>
                      <li>नैमिषारण्य चक्रतीर्थ सौंदर्यीकरण हेतु 120 करोड़ की परियोजना।</li>
                      <li>सीतापुर नवीन गल्ला मंडी में गेहूं-सरसों की रिकॉर्ड आवक।</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Modal Bottom Bar Thumbnails */}
          <div className="bg-slate-950/95 border-t border-slate-800 p-2 flex items-center justify-center gap-2 overflow-x-auto shrink-0">
            {currentEdition.pages.map((p, idx) => (
              <button
                key={p.pageNumber}
                onClick={() => handlePageChange(idx, idx > activePageIndex ? 'next' : 'prev')}
                className={`relative w-11 h-14 rounded overflow-hidden border-2 transition shrink-0 cursor-pointer flex flex-col items-center justify-center ${
                  idx === activePageIndex ? 'border-amber-500 bg-amber-950/40 text-amber-300 font-bold scale-105' : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-[10px]">पृष्ठ</span>
                <span className="text-xs font-bold">{p.pageNumber}</span>
              </button>
            ))}
          </div>

        </div>
      )}

    </section>
  );
}
