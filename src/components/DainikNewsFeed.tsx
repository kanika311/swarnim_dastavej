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
  const { savedArticleIds, toggleSaveArticle, selectedCity, language, t } = useApp();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [activeTrendingTag, setActiveTrendingTag] = useState<string | null>(null);

  const trendingTags = language === 'en' ? [
    'Election Commission Dispute',
    'Asian Games 2026',
    'UN General Debate',
    'Monsoon Alert',
    'Lucknow-Sultanpur Expressway',
    'Gaganyaan Mission',
    'Bank Strike'
  ] : language === 'ur' ? [
    'الیکشن کمیشن تنازعہ',
    'ایشین گیمز',
    'اقوام متحدہ بحث',
    'بارش الرٹ',
    'لکھنؤ-سلطان پور ایکسپریس وے',
    'گگن یان مشن',
    'بینک ہڑتال'
  ] : [
    'चुनाव आयोग विवाद',
    'एशियन गेम्स',
    'UN जनरल डिबेट',
    'बारिश अलर्ट',
    'लखनऊ-सुल्तानपुर एक्सप्रेसवे',
    'गगनयान मिशन',
    'बैंक हड़ताल'
  ];

  // Filter based on active topic, city, and trending tag
  const filteredArticles = articles.filter((art) => {
    // Language filter: if article language is specified, match current language
    if (art.language && art.language !== language) {
      return false;
    }

    // City filter (Bilingual & resilient matching)
    if (selectedCity && selectedCity !== 'सभी शहर' && selectedCity !== 'All Cities') {
      const cityQuery = selectedCity.trim().toLowerCase();
      const artCity = (art.city || '').trim().toLowerCase();
      const matchCity = 
        artCity === cityQuery ||
        artCity.includes(cityQuery) ||
        cityQuery.includes(artCity) ||
        (cityQuery.includes('लखनऊ') && artCity.includes('lucknow')) ||
        (cityQuery.includes('lucknow') && artCity.includes('लखनऊ')) ||
        (cityQuery.includes('सीतापुर') && artCity.includes('sitapur')) ||
        (cityQuery.includes('sitapur') && artCity.includes('सीतापुर')) ||
        (cityQuery.includes('सुल्तानपुर') && artCity.includes('sultanpur')) ||
        (cityQuery.includes('sultanpur') && artCity.includes('सुल्तानपुर')) ||
        art.tags.some(t => t.toLowerCase().includes(cityQuery)) ||
        art.headline.toLowerCase().includes(cityQuery);
      if (!matchCity) {
        return false;
      }
    }

    // Trending tag search filter
    if (activeTrendingTag) {
      const match = 
        art.headline.toLowerCase().includes(activeTrendingTag.toLowerCase()) ||
        art.tags.some(t => t.toLowerCase().includes(activeTrendingTag.toLowerCase()));
      if (!match) return false;
    }

    if (activeTopic === 'all') return true;
    if (activeTopic === 'state-city') {
      return art.category === 'state-city' || art.category === 'state' || art.category === 'lucknow' || art.category === 'sultanpur' || art.category === 'sitapur';
    }
    if (activeTopic === 'sports') return art.category === 'sports' || art.category === 'cricket';
    if (activeTopic === 'cricket') return art.category === 'cricket' || art.category === 'sports';
    if (activeTopic === 'entertainment') return art.category === 'entertainment';
    if (activeTopic === 'citizen') return art.category === 'citizen' || art.author.role === 'citizen_journalist';
    return art.category === activeTopic;
  });

  const leadArticle = filteredArticles[0] || articles[0];
  const streamArticles = filteredArticles.slice(1);

  // Audio Speech Synthesis for Featured Story
  const handleAudioListen = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!('speechSynthesis' in window)) {
      alert(language === 'en' ? 'Voice support not available in browser' : 'आपके ब्राउज़र में वॉइस सपोर्ट उपलब्ध नहीं है');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToSpeak = `${leadArticle.headline}. ${leadArticle.subHeadline || leadArticle.excerpt}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = language === 'en' ? 'en-IN' : language === 'ur' ? 'ur-PK' : 'hi-IN';
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
    <div className="flex-1 w-full min-w-0 space-y-4 sm:space-y-6">
      
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
        <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition min-w-0">
          
          {/* BIG HEADLINE (Dainik Bhaskar Signature Emerald/Dark Bold Font Size) */}
          <Link href={`/article/${leadArticle.id}`} className="block group">
            <h1 className="text-xl sm:text-3xl md:text-[32px] font-extrabold text-emerald-800 dark:text-emerald-400 group-hover:text-emerald-950 dark:group-hover:text-emerald-300 leading-snug tracking-tight font-serif break-words">
              {leadArticle.headline}
            </h1>
          </Link>

          {/* Subtitle / Excerpt */}
          {leadArticle.subHeadline && (
            <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
              {leadArticle.subHeadline}
            </p>
          )}

          {(() => {
            const leadVideo = leadArticle.mediaGallery?.find((item) => item.type === 'video')?.url;
            const takeaways = (leadArticle.body || leadArticle.excerpt || '')
              .split(/\n+/)
              .map((line) => line.replace(/^[\s•●\-–]+/, '').trim())
              .filter((line) => line.length > 0)
              .slice(0, 4);
            const videoOn = Boolean(leadVideo && playingVideoId === leadArticle.id);
            return (
              <>
                <div className="relative mt-4 aspect-video w-full rounded-xl overflow-hidden bg-slate-950 group">
                  {videoOn ? (
                    <video
                      src={leadVideo}
                      poster={leadArticle.coverImage}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <>
                      <img
                        src={leadArticle.coverImage}
                        alt={leadArticle.headline}
                        className="w-full h-full object-cover"
                      />
                      {leadVideo && (
                        <button
                          type="button"
                          onClick={() => setPlayingVideoId(leadArticle.id)}
                          className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/10 transition cursor-pointer"
                          aria-label="Play video"
                        >
                          <span className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl">
                            <Play className="w-7 h-7 fill-current ml-1 text-white" />
                          </span>
                        </button>
                      )}
                    </>
                  )}
                  {!videoOn && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-none">
                      <span className="bg-slate-950/80 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                        {language === 'en' ? '| Swarnim Ground Report' : language === 'ur' ? '| سوَرنم زمینی رپورٹ' : '| स्वर्णिम विशेष ग्राउंड रिपोर्ट'}
                      </span>
                      <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                        {leadArticle.city}
                      </span>
                    </div>
                  )}
                </div>
                {takeaways.length > 0 && (
                  <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 space-y-2">
                    {takeaways.map((line) => (
                      <div key={line} className="flex items-start gap-2 text-slate-800 dark:text-slate-200 text-sm sm:text-[15px] font-semibold leading-relaxed">
                        <span className="text-emerald-700 dark:text-emerald-400 font-black text-lg leading-none mt-0.5">●</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            );
          })()}

          {/* Action Toolbar */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {language === 'en' ? 'Bureau: ' : language === 'ur' ? 'بیورو: ' : 'ब्यूरो: '}{leadArticle.author.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {leadArticle.readingTimeMinutes} {language === 'en' ? 'min read' : language === 'ur' ? 'منٹ مطالعہ' : 'मिनट पठन'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {leadArticle.viewsCount.toLocaleString('en-IN')} {language === 'en' ? 'views' : language === 'ur' ? 'ملاحظات' : 'देखा गया'}
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
                title={language === 'en' ? 'Listen (TTS)' : language === 'ur' ? 'خبر سنیں (TTS)' : 'खबर सुनें (Text to Speech)'}
              >
                <Volume2 className="w-4 h-4" />
                <span>
                  {isPlayingAudio 
                    ? (language === 'en' ? 'Stop' : language === 'ur' ? 'روکیں' : 'रोकें') 
                    : (language === 'en' ? 'Listen' : language === 'ur' ? 'سنیں' : 'सुनें')}
                </span>
              </button>

              {/* Bookmark */}
              <button
                onClick={() => toggleSaveArticle(leadArticle.id)}
                className={`p-1.5 rounded-lg border transition ${
                  savedArticleIds.includes(leadArticle.id)
                    ? 'bg-amber-100 border-amber-400 text-amber-700'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={language === 'en' ? 'Bookmark' : language === 'ur' ? 'بک مارک' : 'बुकमार्क'}
              >
                <Bookmark className="w-4 h-4" />
              </button>

              {/* Share */}
              <button
                onClick={(e) => handleShare(leadArticle, e)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title={language === 'en' ? 'Share' : language === 'ur' ? 'شیئر' : 'शेयर करें'}
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Read Full */}
              <Link
                href={`/article/${leadArticle.id}`}
                className="ml-1 text-xs font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-0.5"
              >
                <span>{language === 'en' ? 'Full Story' : language === 'ur' ? 'مکمل خبر' : 'पूरी खबर'}</span>
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
            <span>
              {language === 'en' ? 'Top Headlines & Ground News' : language === 'ur' ? 'تازہ سرخیاں اور زمینی خبریں' : 'ताज़ा सुर्खियां एवं जमीनी खबरें'}
            </span>
          </h2>
          <span className="text-xs text-slate-500">
            {streamArticles.length} {language === 'en' ? 'more stories available' : language === 'ur' ? 'مزید خبریں دستیاب' : 'अन्य खबरें उपलब्ध'}
          </span>
        </div>

        {streamArticles.map((art) => {
          const isSaved = savedArticleIds.includes(art.id);

          const getCategoryDisplay = () => {
            if (language === 'en') {
              if (art.category === 'sultanpur' || art.category === 'sitapur') return 'Sultanpur Local';
              if (art.category === 'lucknow') return 'Lucknow Daily';
              if (art.category === 'sports') return 'Sports Arena';
              if (art.category === 'business') return 'Business & Economy';
              if (art.category === 'state') return 'Uttar Pradesh';
              return art.category.toUpperCase();
            }
            if (language === 'ur') {
              if (art.category === 'sultanpur' || art.category === 'sitapur') return 'سلطان پور خبریں';
              if (art.category === 'lucknow') return 'لکھنؤ نامہ';
              if (art.category === 'sports') return 'کھیل کود';
              if (art.category === 'business') return 'کاروبار';
              if (art.category === 'state') return 'ریاستی خبریں';
              return art.category;
            }
            if (art.category === 'sultanpur' || art.category === 'sitapur') return 'सुल्तानपुर हलचल';
            if (art.category === 'lucknow') return 'लखनऊ दैनिक';
            if (art.category === 'sports') return 'खेल जगत';
            if (art.category === 'business') return 'व्यापार';
            if (art.category === 'state') return 'उत्तर प्रदेश';
            return art.category;
          };

          return (
            <article
              key={art.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition group flex flex-col md:flex-row gap-4 md:gap-6 min-w-0"
            >
              {/* Thumbnail */}
              <div className="relative w-full md:w-56 aspect-[16/10] shrink-0 rounded-xl overflow-hidden bg-slate-950">
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
                    {language === 'en' ? 'Sponsored' : language === 'ur' ? 'سپانسر شدہ' : 'प्रायोजित'}
                  </span>
                )}
              </div>

              {/* Story Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="font-extrabold text-red-700 dark:text-red-400">
                      {getCategoryDisplay()}
                    </span>
                    <span>•</span>
                    <span>{art.author.name}</span>
                    {art.author.role === 'citizen_journalist' && (
                      <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        {language === 'en' ? 'Citizen Journalist' : language === 'ur' ? 'شہری صحافی' : 'नागरिक पत्रकार'}
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
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {art.readingTimeMinutes} {language === 'en' ? 'min' : language === 'ur' ? 'منٹ' : 'मिनट'}
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
                      title={language === 'en' ? 'Bookmark' : language === 'ur' ? 'بک مارک' : 'बुकमार्क'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleShare(art, e)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                      title={language === 'en' ? 'Share' : language === 'ur' ? 'شیئر' : 'शेयर'}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/article/${art.id}`}
                      className="font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-0.5 ml-2"
                    >
                      <span>{language === 'en' ? 'Read More' : language === 'ur' ? 'مزید پڑھیں' : 'विस्तार से'}</span>
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
