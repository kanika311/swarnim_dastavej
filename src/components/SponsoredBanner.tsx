'use client';

import React from 'react';
import { AdBanner } from '@/types';
import { ExternalLink } from 'lucide-react';

interface SponsoredBannerProps {
  ad: AdBanner;
}

export default function SponsoredBanner({ ad }: SponsoredBannerProps) {
  const handleClick = () => {
    fetch('/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId: ad.id, event: 'click' })
    }).catch(() => {});
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-amber-300/60 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-950/20 p-2 shadow-sm">
      <div className="flex items-center justify-between text-[10px] text-amber-800 dark:text-amber-400 px-2 py-0.5 font-bold uppercase tracking-wider mb-1">
        <span>प्रायोजित विज्ञापन (SPONSORED)</span>
        <span>{ad.advertiser}</span>
      </div>

      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block relative aspect-[21/6] sm:aspect-[24/5] w-full rounded-lg overflow-hidden group"
      >
        <img
          src={ad.imageUrl}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-4">
          <div className="max-w-md text-white">
            <h4 className="text-sm sm:text-base font-extrabold group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <span>{ad.title}</span>
              <ExternalLink className="w-3.5 h-3.5 inline opacity-80" />
            </h4>
            <p className="text-[11px] text-slate-200 mt-1 line-clamp-1">
              अधिक जानकारी एवं ऑनलाइन लाभ के लिए क्लिक करें
            </p>
          </div>
        </div>
      </a>
    </div>
  );
}
