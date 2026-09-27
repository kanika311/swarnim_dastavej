'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Flame, 
  MapPin, 
  Sparkles, 
  Eye, 
  Trophy, 
  Star, 
  Film, 
  Activity, 
  Clapperboard, 
  GraduationCap, 
  TrendingUp, 
  Wheat, 
  Megaphone, 
  Scale,
  Newspaper
} from 'lucide-react';

export interface TopicItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  badge?: string;
  href?: string;
}

interface TopicsSidebarProps {
  activeTopic: string;
  onSelectTopic: (id: string) => void;
}

export const TOPICS: TopicItem[] = [
  { id: 'all', label: 'टॉप न्यूज़', icon: Flame, color: 'text-orange-500' },
  { id: 'state-city', label: 'राज्य-शहर', icon: MapPin, color: 'text-red-500' },
  { id: 'tejaswini', label: 'तेजस्विनी', icon: Sparkles, color: 'text-rose-500', badge: 'NEW' },
  { id: 'investigation', label: 'स्वर्णिम पड़ताल', icon: Eye, color: 'text-amber-600' },
  { id: 'cricket', label: 'क्रिकेट', icon: Trophy, color: 'text-blue-500' },
  { id: 'special', label: 'स्वर्णिम खास', icon: Star, color: 'text-amber-500' },
  { id: 'original', label: 'दस्तावेज़ ओरिजिनल', icon: Film, color: 'text-amber-700' },
  { id: 'sports', label: 'स्पोर्ट्स', icon: Activity, color: 'text-emerald-500' },
  { id: 'entertainment', label: 'बॉलीवुड', icon: Clapperboard, color: 'text-purple-500' },
  { id: 'jobs', label: 'जॉब - एजुकेशन', icon: GraduationCap, color: 'text-indigo-500' },
  { id: 'business', label: 'बिज़नेस', icon: TrendingUp, color: 'text-green-600' },
  { id: 'farmers', label: 'किसान व कृषि', icon: Wheat, color: 'text-lime-600' },
  { id: 'citizen', label: 'नागरिक पत्रकारिता', icon: Megaphone, color: 'text-red-600', badge: 'लाइव' },
  { id: 'grievance', label: 'शिकायत निवारण', icon: Scale, color: 'text-blue-600' },
];

export default function TopicsSidebar({ activeTopic, onSelectTopic }: TopicsSidebarProps) {
  return (
    <aside className="w-full lg:w-56 shrink-0 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-96px)] lg:overflow-y-auto scrollbar-none">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm">
        
        {/* Section title (Dainik Bhaskar style minimal header) */}
        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            प्रमुख विषय (Topics)
          </span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>

        {/* Topics List */}
        <nav className="space-y-1 py-1">
          {TOPICS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTopic === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTopic(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-amber-50 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold shadow-xs border-l-4 border-amber-500 pl-2.5'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`p-1 rounded-md transition-transform group-hover:scale-110 ${item.color}`}>
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </span>
                  <span className={`text-[14px] tracking-wide ${isActive ? 'text-slate-950 dark:text-white font-bold' : ''}`}>
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs uppercase ${
                    item.badge === 'NEW' 
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* E-Paper & Quick Portal Link */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 px-1">
          <Link
            href="/epaper"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/60 transition"
          >
            <Newspaper className="w-4 h-4" />
            <span>दैनिक ई-पेपर पढ़ें</span>
          </Link>
          <Link
            href="/submit-news"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-bold text-red-700 dark:text-red-400 bg-red-50/70 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/60 transition"
          >
            <Megaphone className="w-4 h-4" />
            <span>अपनी खबर भेजें</span>
          </Link>
        </div>

      </div>
    </aside>
  );
}
