'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicsSidebar from '@/components/TopicsSidebar';
import DainikNewsFeed from '@/components/DainikNewsFeed';
import RightSponsoredSidebar from '@/components/RightSponsoredSidebar';
import TodayNewspaperReader from '@/components/TodayNewspaperReader';
import { INITIAL_ARTICLES } from '@/lib/initialData';
import { Article } from '@/types';
import { useApp } from '@/context/AppContext';
import { MapPin, X, Newspaper, Home, Sparkles, Flame } from 'lucide-react';

export default function HomePage() {
  const { selectedCity, setSelectedCity, fontSize, homeViewMode, setHomeViewMode } = useApp();
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [activeTopic, setActiveTopic] = useState<string>('all');

  // Load latest articles if API is active
  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setArticles(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const fontClass = fontSize === 'lg' ? 'text-lg' : fontSize === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className={`min-h-screen flex flex-col bg-[#f8f9fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${fontClass}`}>
      {/* 1. Header (Dainik Bhaskar Style Top Nav) */}
      <Header />

      {/* 2. Top View Mode Switcher: 'आज का अखबार (Default)' vs 'होम (3-Panel Feed)' */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2 shadow-xs">
        <div className="max-w-[1380px] mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHomeViewMode('epaper')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                homeViewMode === 'epaper'
                  ? 'bg-red-700 text-white shadow-sm ring-2 ring-red-400/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Newspaper className="w-4 h-4 text-emerald-400" />
              <span>आज का अखबार (Today&apos;s Newspaper)</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                डिफ़ॉल्ट
              </span>
            </button>

            <button
              onClick={() => setHomeViewMode('news')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                homeViewMode === 'news'
                  ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Home className="w-4 h-4 text-amber-500" />
              <span>होम (3-पैनल लाइव न्यूज़)</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>मुद्रित अखबार का डिजिटल ई-पेपर संस्करण • पेज टर्न व साउंड सपोर्ट</span>
          </div>

        </div>
      </div>

      {/* 3. City Filter Indicator (if a specific city is selected) */}
      {selectedCity !== 'सभी शहर' && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 py-1.5 px-4 text-xs">
          <div className="max-w-[1380px] mx-auto flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>संस्करण फ़िल्टर: आप केवल &lsquo;{selectedCity}&rsquo; की खबरें देख रहे हैं।</span>
            </span>
            <button 
              onClick={() => setSelectedCity('सभी शहर')}
              className="text-red-700 dark:text-red-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>सभी शहर दिखाएं</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        
        {/* VIEW 1: TODAY'S NEWSPAPER (E-PAPER READER WITH 3D FLIP, SOUND & FULL PAGE MODAL) */}
        {homeViewMode === 'epaper' ? (
          <div className="space-y-8">
            {/* The Full Newspaper Reader */}
            <TodayNewspaperReader />

            {/* Quick Switch Callout to Live News */}
            <div className="mt-8 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-transparent border border-amber-300 dark:border-amber-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-600 fill-current" />
                  <span>डिजिटल लाइव ब्रेकिंग न्यूज़ पढ़ना चाहते हैं?</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  दैनिक भास्कर 3-पैनल लेआउट में सीतापुर, लखनऊ और देश-विदेश की ताज़ा खबरें सीधे देखें।
                </p>
              </div>
              <button
                onClick={() => setHomeViewMode('news')}
                className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition shrink-0"
              >
                3-पैनल लाइव न्यूज़ खोलें →
              </button>
            </div>
          </div>
        ) : (
          /* VIEW 2: THREE PANEL MAIN CONTAINER (EXACT DAINIK BHASKAR LAYOUT) */
          <div className="flex flex-col lg:flex-row gap-5 xl:gap-7 items-start">
            
            {/* PANEL 1 (LEFT): Topics & Categories Navigation */}
            <TopicsSidebar
              activeTopic={activeTopic}
              onSelectTopic={setActiveTopic}
            />

            {/* PANEL 2 (CENTER): News Feed, Big Headline, Media & Stream */}
            <DainikNewsFeed
              articles={articles}
              activeTopic={activeTopic}
              onSelectTopic={setActiveTopic}
            />

            {/* PANEL 3 (RIGHT): Google Favorite, Sponsored Ads, Video, E-Paper */}
            <RightSponsoredSidebar />

          </div>
        )}

      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
