'use client';

import React from 'react';
import Link from 'next/link';
import { ClassifiedItem } from '@/types';
import { FileSpreadsheet, ArrowRight, MapPin, Phone } from 'lucide-react';

interface ClassifiedsWidgetProps {
  items: ClassifiedItem[];
}

export default function ClassifiedsWidget({ items }: ClassifiedsWidgetProps) {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'obituary': return { label: 'शोक संदेश', color: 'bg-slate-700 text-white' };
      case 'tender': return { label: 'अल्पकालिक निविदा', color: 'bg-blue-700 text-white' };
      case 'public_notice': return { label: 'सार्वजनिक सूचना', color: 'bg-amber-600 text-white' };
      case 'property': return { label: 'संपत्ति / जमीन', color: 'bg-emerald-700 text-white' };
      default: return { label: 'क्लासिफाइड', color: 'bg-slate-600 text-white' };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-red-700 dark:text-red-400" />
          <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 font-serif">
            क्लासिफाइड, निविदाएं एवं सार्वजनिक सूचना
          </h3>
        </div>
        <Link href="/classifieds" className="text-xs font-semibold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1">
          <span>सभी देखें</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.slice(0, 4).map((item) => {
          const badge = getTypeBadge(item.type);
          return (
            <div
              key={item.id}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-red-400 transition"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badge.color}`}>
                  {badge.label}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.city}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
                {item.content}
              </p>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Phone className="w-3 h-3 text-red-600" />
                <span>संपर्क: {item.contact}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
