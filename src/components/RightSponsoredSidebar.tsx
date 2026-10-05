'use client';

import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Megaphone
} from 'lucide-react';
import { AdBanner } from '@/types';

function formatExternalUrl(url?: string): string {
  if (!url || url === '#' || url.trim() === '') return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

const DEFAULT_FALLBACK_ADS: AdBanner[] = [
  {
    id: 'ad_bhutan_magical',
    title: 'Experience The Magic Of Bhutan: From serene monasteries to sacred peaks. Luxury stays, flights & visa assistance included.',
    advertiser: 'Bhutan Tourism Partner',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
    targetUrl: 'https://www.tourism.gov.bt',
    placement: 'sidebar',
    isActive: true,
    impressions: 650,
    clicks: 52
  },
  {
    id: 'ad_up_investor',
    title: 'उत्तर प्रदेश औद्योगिक विकास महाकुंभ 2026: नए उद्योग, आधुनिक इंफ्रास्ट्रक्चर व निवेश के अपार अवसर।',
    advertiser: 'उद्योग एवं सूचना विभाग - उत्तर प्रदेश',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    targetUrl: 'https://investup.org.in',
    placement: 'sidebar',
    isActive: true,
    impressions: 480,
    clicks: 39
  },
  {
    id: 'ad_sultanpur_agro',
    title: 'किसान समृद्धि सोलर पंप योजना: 75% तक की सरकारी सब्सिडी के साथ अपने खेतों में लगाएं आधुनिक सोलर पंप।',
    advertiser: 'राष्ट्रीय कृषि एवं सौर ऊर्जा मिशन',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    targetUrl: 'https://pmkusum.mnre.gov.in',
    placement: 'sidebar',
    isActive: true,
    impressions: 410,
    clicks: 31
  }
];

export default function RightSponsoredSidebar() {
  const [adIndex, setAdIndex] = useState(0);
  const [ads, setAds] = useState<AdBanner[]>([]);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const fetchAds = () => {
    fetch('/api/ads', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          const activeAds = d.data.filter((ad: AdBanner) => ad.isActive);
          if (activeAds.length > 0) {
            setAds(activeAds);
            return;
          }
        }
        setAds(DEFAULT_FALLBACK_ADS);
      })
      .catch(() => {
        setAds(DEFAULT_FALLBACK_ADS);
      });
  };

  useEffect(() => {
    fetchAds();
    const interval = setInterval(fetchAds, 20000);
    return () => clearInterval(interval);
  }, []);

  const displayAds = ads.length > 0 ? ads : DEFAULT_FALLBACK_ADS;

  // Auto rotate every 7 seconds
  useEffect(() => {
    if (displayAds.length < 2) return;
    const timer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % displayAds.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [displayAds.length]);

  const currentAd = displayAds[adIndex] || displayAds[0];

  useEffect(() => {
    if (currentAd?.id && !currentAd.id.startsWith('ad_')) {
      fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: currentAd.id, event: 'impression' })
      }).catch(() => {});
    }
  }, [currentAd?.id]);

  const handleAdClick = (ad: AdBanner) => {
    if (!ad?.id) return;
    if (!ad.id.startsWith('ad_')) {
      fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: ad.id, event: 'click' })
      }).catch(() => {});
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdIndex((prev) => (prev - 1 + displayAds.length) % displayAds.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdIndex((prev) => (prev + 1) % displayAds.length);
  };

  return (
    <aside className="w-full min-w-0 lg:w-80 lg:shrink-0 lg:sticky lg:top-24 lg:z-20 lg:self-start space-y-4">
      
      {/* EXCLUSIVELY SPONSORED ADS CONTAINER - TALL FORMAT WITH NAVIGATION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
        
        {/* Header with live pulsing dot & index counter */}
        <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider text-[11px]">
              SPONSORED
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              (प्रायोजित)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {displayAds.length > 1 && (
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-700/70 px-2 py-0.5 rounded-full">
                {adIndex + 1} / {displayAds.length}
              </span>
            )}
            <span className="text-[10px] text-slate-400 dark:text-slate-500">विज्ञापन</span>
          </div>
        </div>

        {/* Tall Visual Card with Left & Right Buttons */}
        <div className="relative p-3 flex-1 flex flex-col">
          
          {/* Main Visual Display - Full Photo Display (Never Cropped or Cut Off) */}
          <div className="relative w-full h-[480px] sm:h-[520px] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center group shadow-inner">
            
            {currentAd.imageUrl && !failedImages[currentAd.id] ? (
              <a 
                href={formatExternalUrl(currentAd.targetUrl)} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => handleAdClick(currentAd)}
                className="w-full h-full relative flex items-center justify-center overflow-hidden"
              >
                {/* Ambient blurred backdrop for seamless, edge-to-edge color fill */}
                <img
                  src={currentAd.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none"
                />
                <div className="absolute inset-0 bg-black/25 pointer-events-none" />

                {/* Main Full Image: object-contain guarantees 100% of photo is visible without cutting */}
                <img
                  key={currentAd.id}
                  src={currentAd.imageUrl}
                  alt={currentAd.title}
                  onError={() => setFailedImages((prev) => ({ ...prev, [currentAd.id]: true }))}
                  className="relative max-w-full max-h-full w-auto h-auto object-contain z-10 transition-transform duration-300 group-hover:scale-[1.01]"
                />

                {/* Top Floating Badge */}
                <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-amber-300 font-extrabold text-[10px] px-2.5 py-1 rounded-md shadow-sm border border-amber-400/30 flex items-center gap-1 z-20">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>प्रायोजित</span>
                </div>
              </a>
            ) : (
              /* Fallback rich tall banner */
              <a
                href={formatExternalUrl(currentAd.targetUrl)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleAdClick(currentAd)}
                className="w-full h-full p-5 bg-gradient-to-br from-amber-800 via-amber-950 to-slate-950 flex flex-col justify-between text-white group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider shadow-xs">
                      प्रायोजित
                    </span>
                    <span className="text-xs font-bold text-amber-200 uppercase">
                      {currentAd.advertiser}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black leading-snug mt-8 text-white group-hover:text-amber-200 transition-colors">
                    {currentAd.title}
                  </h3>
                </div>

                <div className="pt-4 border-t border-white/20 flex items-center justify-between">
                  <span className="text-xs text-slate-300">आधिकारिक विज्ञापन</span>
                  <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-lg shadow-md transition group-hover:bg-amber-300">
                    <span>साइट देखें</span>
                    <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </div>
              </a>
            )}

            {/* Left & Right Navigation Buttons */}
            {displayAds.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black/95 text-white flex items-center justify-center backdrop-blur-md transition shadow-xl cursor-pointer z-30 hover:scale-110 active:scale-95 border border-white/30"
                  aria-label="पिछला विज्ञापन (Previous Ad)"
                  title="पिछला विज्ञापन"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black/95 text-white flex items-center justify-center backdrop-blur-md transition shadow-xl cursor-pointer z-30 hover:scale-110 active:scale-95 border border-white/30"
                  aria-label="अगला विज्ञापन (Next Ad)"
                  title="अगला विज्ञापन"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </>
            )}
          </div>

          {/* Clean Details & CTA Bar Below Image (Does Not Cut Off Or Obscure Photo) */}
          <div className="mt-2.5 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block truncate">
                {currentAd.advertiser}
              </span>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate" title={currentAd.title}>
                {currentAd.title}
              </h3>
            </div>

            <a
              href={formatExternalUrl(currentAd.targetUrl)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleAdClick(currentAd)}
              className="shrink-0 inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:opacity-95 text-slate-950 font-black text-xs px-3.5 py-2 rounded-lg shadow-sm transition cursor-pointer"
            >
              <span>विस्तार से देखें</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>

          {/* Carousel Pagination Dots */}
          {displayAds.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-3 pt-2">
              {displayAds.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAdIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === adIndex 
                      ? 'w-7 bg-amber-500 dark:bg-amber-400' 
                      : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                  aria-label={`विज्ञापन ${idx + 1}`}
                />
              ))}
            </div>
          )}

        </div>

        {/* Footer: Advertise with Us */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            डिजिटल एवं ई-पेपर विज्ञापन
          </span>
          <a
            href="mailto:contact@swarnimdastavej.com?subject=Advertise%20With%20Us"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>विज्ञापन लगवाएं</span>
          </a>
        </div>

      </div>

    </aside>
  );
}
