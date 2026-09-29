'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicsSidebar, { MobileTopicsDrawer } from '@/components/TopicsSidebar';
import DainikNewsFeed from '@/components/DainikNewsFeed';
import RightSponsoredSidebar from '@/components/RightSponsoredSidebar';
import TodayNewspaperReader from '@/components/TodayNewspaperReader';
import { INITIAL_ARTICLES } from '@/lib/initialData';
import { Article } from '@/types';
import { useApp } from '@/context/AppContext';
import { MapPin, X } from 'lucide-react';

export default function HomePage() {
  const { selectedCity, setSelectedCity, fontSize, homeViewMode, language } = useApp();
  const [articles, setArticles] = useState<Article[]>(() => {
    const matching = INITIAL_ARTICLES.filter(a => (a.language || 'hi') === language);
    return matching.length > 0 ? matching : INITIAL_ARTICLES;
  });
  const [activeTopic, setActiveTopic] = useState<string>('all');
  const [showMobileTopicsDrawer, setShowMobileTopicsDrawer] = useState<boolean>(false);

  // Load latest articles whenever active language changes
  useEffect(() => {
    fetch(`/api/articles?lang=${language}`)
      .then((res) => res.json())
      .then((data) => {
        const incoming: Article[] = data.success && Array.isArray(data.data) ? data.data : [];
        const base = INITIAL_ARTICLES.filter(a => (a.language || 'hi') === language);
        const seen = new Set(incoming.map(a => a.id));
        const merged = [
          ...incoming.filter(a => !a.language || a.language === language),
          ...base.filter(a => !seen.has(a.id)),
        ];
        setArticles(merged.length > 0 ? merged : (base.length > 0 ? base : INITIAL_ARTICLES));
      })
      .catch(() => {
        const filtered = INITIAL_ARTICLES.filter(a => (a.language || 'hi') === language);
        setArticles(filtered.length > 0 ? filtered : INITIAL_ARTICLES);
      });
  }, [language]);

  const fontClass = fontSize === 'lg' ? 'text-lg' : fontSize === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className={`min-h-screen flex flex-col bg-[#f8f9fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${fontClass}`}>
      <Header />

      {/* City filter, only when a city is selected */}
      {selectedCity !== 'सभी शहर' && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 py-1.5 px-4 text-xs">
          <div className="max-w-[1380px] mx-auto flex flex-wrap items-center justify-between gap-2">
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
      <main className="flex-1 max-w-[1380px] w-full min-w-0 mx-auto px-3 sm:px-4 py-4 sm:py-6">
        
        {homeViewMode === 'epaper' ? (
          <TodayNewspaperReader />
        ) : (
          <div className="w-full min-w-0">
            <div className="flex flex-col lg:flex-row gap-5 xl:gap-7 items-stretch lg:items-start w-full min-w-0">
              {/* PANEL 1 (LEFT): Topics & Categories Navigation (Hidden on mobile, visible on desktop lg) */}
              <TopicsSidebar
                activeTopic={activeTopic}
                onSelectTopic={setActiveTopic}
              />

              {/* PANEL 2 (CENTER): News Feed, Big Headline, Media & Stream (Shows DIRECTLY on mobile!) */}
              <DainikNewsFeed
                articles={articles}
                activeTopic={activeTopic}
                onSelectTopic={setActiveTopic}
                onOpenFilterDrawer={() => setShowMobileTopicsDrawer(true)}
              />

              {/* PANEL 3 (RIGHT): Google Favorite, Sponsored Ads, Video, E-Paper */}
              <RightSponsoredSidebar />
            </div>

            {/* Mobile Filter Drawer / Bottom Sheet */}
            <MobileTopicsDrawer
              isOpen={showMobileTopicsDrawer}
              onClose={() => setShowMobileTopicsDrawer(false)}
              activeTopic={activeTopic}
              onSelectTopic={setActiveTopic}
            />
          </div>
        )}

      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
