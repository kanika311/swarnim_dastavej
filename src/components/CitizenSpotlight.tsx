'use client';

import React from 'react';
import Link from 'next/link';
import { PenTool, CheckCircle, MapPin, Camera, Video, ArrowRight } from 'lucide-react';
import { Article } from '@/types';

interface CitizenSpotlightProps {
  articles: Article[];
}

export default function CitizenSpotlight({ articles }: CitizenSpotlightProps) {
  // Filter or prioritize citizen journalism articles
  const citizenStories = articles.filter(a => 
    a.author.role === 'citizen_journalist' || 
    a.tags.includes('नागरिक पत्रकार') || 
    a.category === 'sultanpur' ||
    a.category === 'sitapur'
  ).slice(0, 3);

  return (
    <section className="mb-10 bg-gradient-to-br from-amber-500/10 via-red-500/5 to-amber-500/15 p-5 md:p-6 rounded-2xl border-2 border-amber-400/50 shadow-sm relative overflow-hidden">
      
      {/* Background watermark badge */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-amber-500/10 pointer-events-none blur-2xl"></div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-amber-300/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-amber-600 to-red-600 text-white text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow">
              स्वर्णिम दूत मंच
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              सत्यापित जन-रिपोर्टिंग
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 font-serif mt-1">
            नागरिक पत्रकारिता: आपकी गली, आपका मोहल्ला, आपकी आवाज़
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            सुल्तानपुर, लखनऊ एवं अवध के जागरूक नागरिकों द्वारा सीधे मौके से भेजी गई जमीनी पड़ताल
          </p>
        </div>

        <Link
          href="/submit-news"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <PenTool className="w-4 h-4" />
          <span>आप भी खबर भेजें (नागरिक पत्रकार बनें)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {citizenStories.map((story) => (
          <Link
            key={story.id}
            href={`/article/${story.id}`}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-amber-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-3 bg-slate-900">
                <img
                  src={story.coverImage}
                  alt={story.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-slate-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                  <MapPin className="w-3 h-3" />
                  {story.city}
                </span>
                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow">
                  ग्राउंड रिपोर्ट
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-amber-400 line-clamp-2 leading-snug">
                {story.headline}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                {story.excerpt}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[9px]">
                  ✍️
                </div>
                <span className="truncate max-w-[120px]">{story.author.name}</span>
              </div>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                सत्यापित खबर
              </span>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}
