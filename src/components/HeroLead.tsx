'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { Clock, Eye, Share2, Flame, Bookmark, Volume2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface HeroLeadProps {
  leadArticle: Article;
  sideArticles: Article[];
}

export default function HeroLead({ leadArticle, sideArticles }: HeroLeadProps) {
  const { savedArticleIds, toggleSaveArticle } = useApp();
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

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

  const handleAudioListen = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPlayingAudio(!isPlayingAudio);
    if ('speechSynthesis' in window) {
      if (!isPlayingAudio) {
        const utterance = new SpeechSynthesisUtterance(leadArticle.headline + '. ' + leadArticle.excerpt);
        utterance.lang = 'hi-IN';
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.cancel();
      }
    }
  };

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BIG LEAD STORY (7 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 group hover:shadow-md transition">
          <Link href={`/article/${leadArticle.id}`} className="block relative">
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
              <img
                src={leadArticle.coverImage}
                alt={leadArticle.headline}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
              
              {/* Badges on Image */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded shadow-md flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  बड़ी खबर
                </span>
                <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded shadow">
                  {leadArticle.city}
                </span>
                {leadArticle.isSponsored && (
                  <span className="bg-purple-600 text-white font-bold text-xs px-2 py-0.5 rounded shadow">
                    प्रायोजित / Sponsored
                  </span>
                )}
              </div>

              {/* Headline overlay on image for impact */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight tracking-tight drop-shadow-md group-hover:text-amber-300 transition-colors font-serif">
                  {leadArticle.headline}
                </h2>
                {leadArticle.subHeadline && (
                  <p className="hidden sm:block text-slate-200 text-xs sm:text-sm mt-1.5 font-medium line-clamp-2 drop-shadow">
                    {leadArticle.subHeadline}
                  </p>
                )}
              </div>
            </div>
          </Link>

          {/* Story Meta & Controls */}
          <div className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                रिपोर्ट: {leadArticle.author.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {leadArticle.readingTimeMinutes} मिनट पठन
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {leadArticle.viewsCount.toLocaleString('hi-IN')} देखा गया
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Text-to-speech button */}
              <button
                onClick={handleAudioListen}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition ${
                  isPlayingAudio 
                    ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse' 
                    : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:text-red-700'
                }`}
                title="खबर सुनें (Audio Read)"
              >
                <Volume2 className="w-3.5 h-3.5 text-red-600" />
                <span>{isPlayingAudio ? 'रुकें' : 'सुनें'}</span>
              </button>

              <button
                onClick={() => toggleSaveArticle(leadArticle.id)}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                title="बुकमार्क करें"
              >
                <Bookmark className={`w-4 h-4 ${savedArticleIds.includes(leadArticle.id) ? 'fill-red-600 text-red-600' : ''}`} />
              </button>

              <button
                onClick={(e) => handleShare(leadArticle, e)}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                title="शेयर करें"
              >
                <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>
        </div>

        {/* SIDE STORIES LIST (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          <div className="bg-red-700 text-white px-3 py-1.5 rounded-t-lg font-bold text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>
              प्रमुख खबरें (Top Headlines)
            </span>
            <span className="text-[10px] text-red-200">लखनऊ - सीतापुर</span>
          </div>

          <div className="flex-1 flex flex-col justify-between space-y-3">
            {sideArticles.slice(0, 3).map((art, idx) => (
              <Link
                key={art.id}
                href={`/article/${art.id}`}
                className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex gap-3 hover:border-red-500 transition group shadow-sm"
              >
                <div className="relative w-24 h-20 shrink-0 rounded overflow-hidden bg-slate-900">
                  <img
                    src={art.coverImage}
                    alt={art.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-1 left-1 bg-black/70 text-amber-300 text-[9px] font-bold px-1 rounded">
                    {art.city}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-red-400 line-clamp-2 leading-snug">
                    {art.headline}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>{art.category === 'sitapur' ? 'सीतापुर' : art.category === 'state' ? 'उत्तर प्रदेश' : art.category}</span>
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3" />
                      {art.viewsCount}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
