'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Bell, ChevronRight } from 'lucide-react';

interface BreakingTickerProps {
  items?: string[];
}

export default function BreakingTicker({
  items = [
    'कैबिनेट फैसला: लखनऊ-सीतापुर-लखीमपुर 6 लेन एक्सेस कंट्रोल्ड कॉरिडोर को 4,200 करोड़ की मंजूरी',
    'इसरो का बड़ा कारनामा: गगनयान मानवरहित क्रू मॉड्यूल बंगाल की खाड़ी में सुरक्षित उतरा',
    'सीतापुर: सरायन नदी स्वच्छता अभियान में युवाओं ने निकाला 10 टन कचरा, प्रशासन ने की सराहना',
    'लखनऊ मेट्रो: चारबाग से वसंत कुंज 11 किमी ईस्ट-वेस्ट रूट की अंतिम डीपीआर मंजूर'
  ]
}: BreakingTickerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className="bg-red-700 text-white text-xs md:text-sm border-b border-red-800 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-bold shrink-0 bg-red-900/80 px-2.5 py-1 rounded shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
          </span>
          <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span className="tracking-wide">ब्रेकिंग न्यूज़</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="transition-all duration-500 ease-in-out font-medium line-clamp-1">
            <Link 
              href={`/category/state`} 
              className="hover:underline flex items-center gap-1.5 text-white/95 hover:text-amber-200"
            >
              <span>{items[currentIndex]}</span>
              <ChevronRight className="w-3.5 h-3.5 inline opacity-70" />
            </Link>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-red-200 shrink-0 text-[11px]">
          <Bell className="w-3.5 h-3.5" />
          <span>अपडेट: अभी-अभी</span>
        </div>
      </div>
    </div>
  );
}
