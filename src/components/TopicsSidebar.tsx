'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  RiFireLine,
  RiBuilding4Line,
  RiGovernmentLine,
  RiTrophyLine,
  RiLineChartLine,
  RiMovie2Line,
  RiGraduationCapLine,
  RiPlantLine,
  RiSearchEyeLine,
  RiMegaphoneLine,
  RiNewspaperLine,
  RiEditBoxLine,
  RiCloseLine
} from 'react-icons/ri';

export interface TopicItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  href?: string;
}

interface TopicsSidebarProps {
  activeTopic: string;
  onSelectTopic: (id: string) => void;
}

export const TOPICS: TopicItem[] = [
  { id: 'all', label: 'टॉप न्यूज़', icon: RiFireLine },
  { id: 'state-city', label: 'राज्य-शहर', icon: RiBuilding4Line },
  { id: 'national', label: 'देश और राजनीति', icon: RiGovernmentLine },
  { id: 'sports', label: 'खेल व क्रिकेट', icon: RiTrophyLine },
  { id: 'business', label: 'बिज़नेस', icon: RiLineChartLine },
  { id: 'entertainment', label: 'बॉलीवुड व सिनेमा', icon: RiMovie2Line },
  { id: 'jobs', label: 'जॉब - एजुकेशन', icon: RiGraduationCapLine },
  { id: 'farmers', label: 'किसान व कृषि', icon: RiPlantLine },
  { id: 'investigation', label: 'स्वर्णिम पड़ताल', icon: RiSearchEyeLine },
  { id: 'citizen', label: 'नागरिक पत्रकारिता', icon: RiMegaphoneLine },
];

export default function TopicsSidebar({ activeTopic, onSelectTopic }: TopicsSidebarProps) {
  const { t } = useApp();

  return (
    <aside className="hidden lg:block w-56 shrink-0 lg:sticky lg:top-24 lg:z-20 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-none">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 shadow-xs">
        
        {/* Section title (Clean editorial headline) */}
        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1.5 flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('filter_by_topic')}
          </span>
          <span className="w-2 h-2 rounded-full bg-red-600"></span>
        </div>

        {/* Topics List */}
        <nav className="space-y-0.5 py-1">
          {TOPICS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTopic === item.id;
            const topicLabel = t('topic_' + item.id.replace(/-/g, '_')) || item.label;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTopic(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-red-50/80 dark:bg-red-950/30 text-red-700 dark:text-red-400 font-bold border-l-[3px] border-red-600 pl-2'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                    isActive 
                      ? 'bg-red-100/80 dark:bg-red-900/40 text-red-700 dark:text-red-400' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:bg-red-50 dark:group-hover:bg-slate-700/60'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className={`text-[13px] tracking-wide ${isActive ? 'font-bold text-red-700 dark:text-red-300' : ''}`}>
                    {topicLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* E-Paper & Journalist Portal Action Links */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 px-0.5">
          <Link
            href="/epaper"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 hover:text-amber-800 dark:hover:bg-amber-950/40 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700/60 transition group"
          >
            <RiNewspaperLine className="w-4 h-4 text-amber-600 shrink-0 group-hover:scale-110 transition-transform" />
            <span>{t('read_epaper')}</span>
          </Link>
          <Link
            href="/submit-news"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-300 border border-slate-200 dark:border-slate-700/60 transition group"
          >
            <RiEditBoxLine className="w-4 h-4 text-red-600 shrink-0 group-hover:scale-110 transition-transform" />
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

      <div className="relative z-10 h-dvh w-[86%] max-w-[340px] bg-white dark:bg-slate-900 rounded-r-2xl flex flex-col shadow-2xl border-r border-slate-200 dark:border-slate-800 animate-in slide-in-from-left duration-300 overflow-hidden">
        <div className="shrink-0 px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>{t('filter_by_topic')}</span>
            </h3>
            <p className="text-[11px] text-slate-500">{t('filter')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <RiCloseLine className="w-5 h-5" />
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
                    ? 'bg-red-700 text-white font-bold shadow-xs'
                    : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold truncate">{topicLabel}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Footer Links */}
        <div className="shrink-0 p-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <Link
            href="/epaper"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
          >
            <RiNewspaperLine className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('read_epaper')}</span>
          </Link>
          <Link
            href="/submit-news"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-red-700 text-white font-bold text-xs"
          >
            <RiEditBoxLine className="w-3.5 h-3.5" />
            <span>{t('submit_news')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
