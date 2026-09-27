'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  ExternalLink, 
  ChevronRight, 
  ArrowUpRight, 
  Download, 
  CloudSun, 
  TrendingUp, 
  FileText,
  Megaphone
} from 'lucide-react';
import { AdBanner } from '@/types';

export default function RightSponsoredSidebar() {
  const [adIndex, setAdIndex] = useState(0);
  const [ads, setAds] = useState<AdBanner[]>([]);

  useEffect(() => {
    fetch('/api/ads')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setAds(d.data.filter((ad: AdBanner) => ad.isActive));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (ads.length < 2) return;
    const timer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [ads.length]);

  return (
    <aside className="w-full min-w-0 lg:w-80 lg:shrink-0 lg:sticky lg:top-24 lg:z-20 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-none space-y-4">
      
      {/* 1. GOOGLE NEWS FAVORITE CARD (Dainik Bhaskar Style) */}
      <div className="bg-amber-50/70 dark:bg-slate-800/80 border border-amber-200/80 dark:border-slate-700 rounded-xl p-3.5 shadow-xs flex items-center justify-between gap-3 hover:border-amber-400 transition group">
        <div className="flex-1">
          <Link 
            href="https://news.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-amber-400 leading-snug flex items-center gap-1"
          >
            <span>स्वर्णिम दस्तावेज़ को Google पर पसंदीदा सोर्स बनाएं</span>
            <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Google News Badge Button */}
        <Link 
          href="https://news.google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="shrink-0 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-xs"
        >
          {/* Google colors icon */}
          <div className="flex items-center gap-0.5 text-[11px] font-black">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </div>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
            +Follow us
          </span>
        </Link>
      </div>

      {/* 2. SPONSORED AD CAROUSEL */}
      {ads.length > 0 && ads[adIndex] && (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span className="font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            प्रायोजित (Sponsored)
          </span>
          <span className="text-slate-400 text-[10px]">विज्ञापन</span>
        </div>

        <div className="relative p-3">
          <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
            <a href={ads[adIndex].targetUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={ads[adIndex].imageUrl}
              alt={ads[adIndex].title}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            </a>
            <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded">
              प्रायोजित
            </div>
          </div>

          <div className="mt-2.5">
            <p className="text-[11px] text-slate-400 font-medium">
              {ads[adIndex].advertiser}
            </p>
            <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 mt-0.5 line-clamp-2 leading-snug">
              {ads[adIndex].title}
            </h4>
          </div>

          {/* Carousel Pagination Dots (like Bhaskar) */}
          <div className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {ads.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setAdIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === adIndex 
                    ? 'w-5 bg-amber-600 dark:bg-amber-400' 
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label={`विज्ञापन ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      )}

      {/* 3. VIDEO WIDGET (Dainik Bhaskar Style: 'वीडियो और देखें') */}
      <div className="bg-slate-950 text-white rounded-xl overflow-hidden shadow-md border border-slate-800">
        <div className="p-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <h3 className="font-extrabold text-base tracking-wide">
              वीडियो (Videos)
            </h3>
          </div>
          <Link
            href="/category/videos"
            className="text-[12px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 transition"
          >
            <span>और देखें</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Video Card */}
        <Link href="/article/art-2" className="block relative group">
          <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80"
              alt="बारिश से हाहाकार"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition">
              <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>

            {/* Video duration pill */}
            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-mono px-1.5 py-0.5 rounded">
              0:49
            </span>
          </div>

          <div className="p-3 bg-slate-900">
            <span className="text-[11px] font-bold text-amber-400 uppercase">
              सीतापुर - लखनऊ वेदर अलर्ट
            </span>
            <h4 className="text-[14px] font-bold text-white group-hover:text-amber-300 line-clamp-2 mt-1 leading-snug">
              बारिश से हाहाकार: घाघरा व सरायन नदी का जलस्तर खतरे के निशान के पास, तटवर्ती गांवों में अलर्ट
            </h4>
          </div>
        </Link>
      </div>

      {/* 4. E-PAPER TODAY'S EDITION WIDGET */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-[14px] text-slate-900 dark:text-white">
              आज का ई-पेपर (E-Paper)
            </span>
          </div>
          <span className="text-[10px] font-bold bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
            निशुल्क
          </span>
        </div>

        <div className="flex gap-3 items-center">
          <div className="w-20 aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 overflow-hidden shrink-0 shadow-xs relative">
            <img
              src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&auto=format&fit=crop&q=80"
              alt="E-paper preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end justify-center p-1">
              <span className="text-[9px] font-bold text-white">27 सितम्बर</span>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100 leading-snug">
              लखनऊ एवं सीतापुर संयुक्त संस्करण
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              6 मुख्य पृष्ठ • रंगीन मुद्रित स्वरूप
            </p>
            <Link
              href="/epaper"
              className="inline-flex items-center gap-1 mt-2.5 text-[12px] font-bold text-white bg-red-700 hover:bg-red-800 px-3 py-1.5 rounded-md shadow-xs transition"
            >
              <span>ई-पेपर खोलें</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. WEATHER & MANDI QUICK WIDGET */}
      <div className="bg-gradient-to-br from-slate-50 to-amber-50/40 dark:from-slate-800 dark:to-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs text-slate-700 dark:text-slate-300 space-y-2">
        <div className="flex items-center justify-between font-bold text-[13px] text-slate-900 dark:text-white">
          <span className="flex items-center gap-1.5">
            <CloudSun className="w-4 h-4 text-amber-500" />
            स्थानीय मौसम व मंडी भाव
          </span>
          <span className="text-[10px] text-slate-400">आज</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
          <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">सीतापुर: 29°C</span>
            <span className="text-slate-500">हल्के बादल, आर्द्रता 72%</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">लखनऊ: 30°C</span>
            <span className="text-slate-500">साफ धूप, हवा 12 km/h</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
          <span className="text-slate-600 dark:text-slate-400">सीतापुर नवीन मंडी (गेहूं):</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">₹2,425 / क्विंटल</span>
        </div>
      </div>

      {/* 6. CITIZEN JOURNALISM CTA BOX */}
      <div className="bg-gradient-to-r from-red-700 to-amber-700 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <span className="bg-amber-300 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
            नागरिक पत्रकारिता मंच
          </span>
          <h4 className="text-[15px] font-bold mt-2 font-serif leading-snug">
            अपने क्षेत्र की समस्या या खबर सीधे संपादक तक पहुंचाएं
          </h4>
          <p className="text-[11px] text-slate-100 mt-1 opacity-90">
            सड़क, पानी, बिजली या जनसरोकार से जुड़े मुद्दे फोटो-वीडियो सहित साझा करें।
          </p>
          <Link
            href="/submit-news"
            className="inline-flex items-center gap-1.5 mt-3 bg-white text-red-800 hover:bg-amber-100 font-extrabold text-[12px] px-3.5 py-1.5 rounded-lg shadow-sm transition"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>खबर भेजें / शिकायत दर्ज करें</span>
          </Link>
        </div>
      </div>

    </aside>
  );
}
