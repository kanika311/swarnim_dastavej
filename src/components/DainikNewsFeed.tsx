'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { 
  Play, 
  Volume2, 
  Bookmark, 
  Share2, 
  Clock, 
  Eye, 
  ChevronRight, 
  Flame, 
  Check, 
  TrendingUp, 
  MessageSquare,
  Sparkles,
  MapPin,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface DainikNewsFeedProps {
  articles: Article[];
  activeTopic: string;
  onSelectTopic: (topicId: string) => void;
  onOpenFilterDrawer?: () => void;
}

export default function DainikNewsFeed({
  articles,
  activeTopic,
  onSelectTopic,
  onOpenFilterDrawer
}: DainikNewsFeedProps) {
  const { savedArticleIds, toggleSaveArticle, selectedCity } = useApp();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTrendingTag, setActiveTrendingTag] = useState<string | null>(null);

  const trendingTags = [
    'चुनाव आयोग विवाद',
    'एशियन गेम्स',
    'UN जनरल डिबेट',
    'बारिश अलर्ट',
    'लखनऊ-सीतापुर एक्सप्रेसवे',
    'गगनयान मिशन',
    'बैंक हड़ताल'
  ];

  // Filter based on active topic, city, and trending tag
  const filteredArticles = articles.filter((art) => {
    // City filter
    if (selectedCity !== 'सभी शहर' && art.city !== selectedCity) {
      return false;
    }

    // Trending tag search filter
    if (activeTrendingTag) {
      const match = 
        art.headline.toLowerCase().includes(activeTrendingTag.toLowerCase()) ||
        art.tags.some(t => t.toLowerCase().includes(activeTrendingTag.toLowerCase()));
      if (!match) return false;
    }

    // Topic filter
    if (activeTopic === 'all') return true;
    if (activeTopic === 'state-city') return art.category === 'state' || art.category === 'lucknow' || art.category === 'sitapur';
    if (activeTopic === 'sports' || activeTopic === 'cricket') return art.category === 'sports';
    if (activeTopic === 'business') return art.category === 'business';
    if (activeTopic === 'entertainment') return art.category === 'entertainment';
    if (activeTopic === 'citizen') return art.author.role === 'citizen_journalist';
    if (activeTopic === 'investigation' || activeTopic === 'special') return art.isTrending;
    
    return true;
  });

  const leadArticle = filteredArticles[0] || articles[0];
  const streamArticles = filteredArticles.slice(1);

  // Audio Speech Synthesis for Featured Story
  const handleAudioListen = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!('speechSynthesis' in window)) {
      alert('आपके ब्राउज़र में वॉइस सपोर्ट उपलब्ध नहीं है');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToSpeak = `${leadArticle.headline}. ${leadArticle.subHeadline || leadArticle.excerpt}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleShare = (art: Article, e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: art.headline,
        text: art.excerpt,
        url: window.location.origin + `/article/${art.id}`
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin + `/article/${art.id}`);
      alert('खबर का लिंक कॉपी कर लिया गया है!');
    }
  };

  return (
    <div className="flex-1 min-w-0 space-y-6">
      
      {/* 1. TRENDING TAGS BAR WITH FILTER BUTTON */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-xs flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none">
        
        {/* Mobile Filter Button (right next to Trending) */}
        {onOpenFilterDrawer && (
          <button
            onClick={onOpenFilterDrawer}
            className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 shadow-xs transition active:scale-95 cursor-pointer"
            title="विषय फ़िल्टर"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>फ़िल्टर</span>
            {activeTopic !== 'all' && (
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            )}
          </button>
        )}

        <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-extrabold text-[13px] shrink-0">
          <Flame className="w-4 h-4 fill-current animate-bounce" />
          <span>ट्रेंडिंग:</span>
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap text-[13px]">
          {trendingTags.map((tag) => {
            const isTagActive = activeTrendingTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTrendingTag(isTagActive ? null : tag)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition border ${
                  isTagActive
                    ? 'bg-red-600 text-white border-red-600 font-bold shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-medium'
                }`}
              >
                <span>{tag}</span>
                <span className="text-slate-400 text-xs">›</span>
              </button>
            );
          })}
          {activeTrendingTag && (
            <button
              onClick={() => setActiveTrendingTag(null)}
              className="text-xs text-red-600 underline font-bold px-2"
            >
              फ़िल्टर हटाएं ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN FEATURED STORY (DAINIK BHASKAR STYLE) */}
      {leadArticle && (
        <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition">
          
          {/* BIG HEADLINE (Dainik Bhaskar Signature Emerald/Dark Bold Font Size) */}
          <Link href={`/article/${leadArticle.id}`} className="block group">
            <h1 className="text-2xl sm:text-3xl md:text-[32px] font-extrabold text-emerald-800 dark:text-emerald-400 group-hover:text-emerald-950 dark:group-hover:text-emerald-300 leading-snug tracking-tight font-serif">
              {leadArticle.headline}
            </h1>
          </Link>

          {/* Subtitle / Excerpt */}
          {leadArticle.subHeadline && (
            <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
              {leadArticle.subHeadline}
            </p>
          )}

          {/* Big Media Player / Image Container */}
          <div className="relative mt-4 aspect-video w-full rounded-xl overflow-hidden bg-slate-950 group">
            <img
              src={leadArticle.coverImage}
              alt={leadArticle.headline}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            
            {/* Dainik Bhaskar Style Center Play Button Circle */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
              <div className="w-16 h-16 rounded-full bg-black/75 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-xs shadow-2xl transition transform group-hover:scale-110">
                <Play className="w-7 h-7 fill-current ml-1 text-white" />
              </div>
            </div>

            {/* Bottom Badges */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="bg-slate-950/80 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                | स्वर्णिम विशेष ग्राउंड रिपोर्ट
              </span>
              <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                {leadArticle.city}
              </span>
            </div>

            <div className="absolute bottom-3 right-3 bg-black/85 text-white text-[12px] font-mono px-2 py-0.5 rounded">
              0:49
            </div>
          </div>

          {/* Bulleted Key Takeaways (Dainik Bhaskar Signature Format) */}
          <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200 text-sm sm:text-[15px] font-semibold leading-relaxed">
              <span className="text-emerald-700 dark:text-emerald-400 font-black text-lg leading-none mt-0.5">●</span>
              <span>
                138 किलोमीटर लंबा 6-लेन ग्रीनफील्ड कॉरिडोर: सीतापुर और लखनऊ के बीच की दूरी अब मात्र 45 मिनट में तय होगी।
              </span>
            </div>
            <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200 text-sm sm:text-[15px] font-semibold leading-relaxed">
              <span className="text-emerald-700 dark:text-emerald-400 font-black text-lg leading-none mt-0.5">●</span>
              <span>
                4,200 करोड़ की लागत से बनने वाले इस आधुनिक हाईवे पर 3 बड़े लॉजिस्टिक्स हब और एग्री-प्रोसेसिंग क्लस्टर बनेंगे।
              </span>
            </div>
            <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200 text-sm sm:text-[15px] font-semibold leading-relaxed">
              <span className="text-emerald-700 dark:text-emerald-400 font-black text-lg leading-none mt-0.5">●</span>
              <span>
                कैबिनेट बैठक में मिली हरी झंडी, अगले महीने से शुरू होगी भूमि अधिग्रहण प्रक्रिया।
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                ब्यूरो: {leadArticle.author.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {leadArticle.readingTimeMinutes} मिनट पठन
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {leadArticle.viewsCount.toLocaleString('en-IN')} देखा गया
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Listen TTS Audio */}
              <button
                onClick={handleAudioListen}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                  isPlayingAudio
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                }`}
                title="खबर सुनें (Text to Speech)"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingAudio ? 'रोकें' : 'सुनें'}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={() => toggleSaveArticle(leadArticle.id)}
                className={`p-1.5 rounded-lg border transition ${
                  savedArticleIds.includes(leadArticle.id)
                    ? 'bg-amber-100 border-amber-400 text-amber-700'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="बुकमार्क"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              {/* Share */}
              <button
                onClick={(e) => handleShare(leadArticle, e)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="शेयर करें"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Read Full */}
              <Link
                href={`/article/${leadArticle.id}`}
                className="ml-1 text-xs font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-0.5"
              >
                <span>पूरी खबर</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </article>
      )}

      {/* 3. CONTINUOUS CLEAN NEWS STREAM (Big Font Size, High Contrast, Clear Layout) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b-2 border-red-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-700"></span>
            <span>ताज़ा सुर्खियां एवं जमीनी खबरें</span>
          </h2>
          <span className="text-xs text-slate-500">
            {streamArticles.length} अन्य खबरें उपलब्ध
          </span>
        </div>

        {streamArticles.map((art) => {
          const isSaved = savedArticleIds.includes(art.id);

          return (
            <article
              key={art.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition group flex flex-col sm:flex-row gap-4 sm:gap-6"
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-56 aspect-[16/10] shrink-0 rounded-xl overflow-hidden bg-slate-950">
                <img
                  src={art.coverImage}
                  alt={art.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-slate-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                  {art.city}
                </span>
                {art.isSponsored && (
                  <span className="absolute bottom-2 left-2 bg-purple-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    प्रायोजित
                  </span>
                )}
              </div>

              {/* Story Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="font-extrabold text-red-700 dark:text-red-400">
                      {art.category === 'sitapur' ? 'सीतापुर हलचल' : art.category === 'lucknow' ? 'लखनऊ दैनिक' : art.category === 'sports' ? 'खेल जगत' : art.category}
                    </span>
                    <span>•</span>
                    <span>{art.author.name}</span>
                    {art.author.role === 'citizen_journalist' && (
                      <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        नागरिक पत्रकार
                      </span>
                    )}
                  </div>

                  {/* Big Readable Headline */}
                  <Link href={`/article/${art.id}`}>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-red-400 leading-snug font-serif">
                      {art.headline}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                {/* Footer bar */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {art.readingTimeMinutes} मिनट
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {art.viewsCount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSaveArticle(art.id)}
                      className={`p-1 rounded ${isSaved ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
                      title="बुकमार्क"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleShare(art, e)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                      title="शेयर"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/article/${art.id}`}
                      className="font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-0.5 ml-2"
                    >
                      <span>विस्तार से</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
}
