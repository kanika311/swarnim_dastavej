'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
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
  Newspaper,
  X
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
  const { t } = useApp();

  return (
    <aside className="hidden lg:block w-56 shrink-0 lg:sticky lg:top-24 lg:z-20 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-none">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm">
        
        {/* Section title (Dainik Bhaskar style minimal header) */}
        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t('filter_by_topic')}
          </span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>

        {/* Topics List */}
        <nav className="space-y-1 py-1">
          {TOPICS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTopic === item.id;
            const topicLabel = t('topic_' + item.id.replace(/-/g, '_')) || item.label;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTopic(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group cursor-pointer ${
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
                    {topicLabel}
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
            <span>{t('read_epaper')}</span>
          </Link>
          <Link
            href="/submit-news"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-bold text-red-700 dark:text-red-400 bg-red-50/70 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/60 transition"
          >
            <Megaphone className="w-4 h-4" />
            <span>{t('submit_news')}</span>
          </Link>
        </div>

      </div>
    </aside>
  );
}

export interface MobileTopicsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTopic: string;
  onSelectTopic: (id: string) => void;
}

export function MobileTopicsDrawer({
  isOpen,
  onClose,
  activeTopic,
  onSelectTopic,
}: MobileTopicsDrawerProps) {
  const { t } = useApp();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 h-dvh w-[86%] max-w-[360px] bg-white dark:bg-slate-900 rounded-r-2xl flex flex-col shadow-2xl border-r border-slate-200 dark:border-slate-800 animate-in slide-in-from-left duration-300 overflow-hidden">
        <div className="shrink-0 px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <span>{t('filter_by_topic')}</span>
            </h3>
            <p className="text-[11px] text-slate-500">{t('filter')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Topics List */}
        <div className="topics-scroll flex-1 min-h-0 overflow-y-scroll p-2.5 space-y-1">
          {TOPICS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTopic === item.id;
            const topicLabel = t('topic_' + item.id.replace(/-/g, '_')) || item.label;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTopic(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`p-1 rounded-lg shrink-0 ${
                      isActive
                        ? 'bg-black/15 text-slate-950'
                        : `${item.color} bg-slate-100 dark:bg-slate-800`
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </span>
                  <span className="text-xs font-bold truncate">{topicLabel}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase shrink-0 ${
                      isActive
                        ? 'bg-slate-950 text-white'
                        : item.badge === 'NEW'
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Footer Links */}
        <div className="shrink-0 p-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <Link
            href="/epaper"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold text-[11px]"
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>{t('read_epaper')}</span>
          </Link>
          <Link
            href="/submit-news"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-red-600 text-white font-bold text-[11px]"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>{t('submit_news')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
