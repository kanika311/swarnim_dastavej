'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TodayNewspaperReader from '@/components/TodayNewspaperReader';

export default function EPaperPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <main className="flex-1 max-w-[1380px] w-full mx-auto px-3 sm:px-4 py-6">
        <TodayNewspaperReader />
      </main>

      <Footer />
    </div>
  );
}
