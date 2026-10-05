'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import { Article } from '@/types';
import Link from 'next/link';
import { Clock, Eye, MapPin, ChevronRight, ArrowLeft, Play } from 'lucide-react';

import { useApp } from '@/context/AppContext';

export default function CategoryListingPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'all';
  const { language } = useApp();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch(`/api/articles?lang=${language}`)
      .then(res => res.json())
      .then(data => {
        setArticles(data.success && Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => {
        setArticles([]);
      });
  }, [language]);

  const getCategoryTitle = (s: string) => {
    switch (s) {
      case 'state': return { title: 'उत्तर प्रदेश समाचार', subtitle: 'राजधानी लखनऊ, सुल्तानपुर एवं प्रदेश भर की बड़ी खबरें' };
      case 'sultanpur':
      case 'sitapur': return { title: 'सुल्तानपुर विशेष (Sultanpur Local)', subtitle: 'कादीपुर, लंभुआ, जयसिंहपुर, इसौली व नगर क्षेत्र की जमीनी खबरें' };
      case 'lucknow': return { title: 'लखनऊ दैनिक (Lucknow Daily)', subtitle: 'चारबाग, हजरतगंज, गोमती नगर, चौक व प्रशासनिक अपडेट' };
      case 'national': return { title: 'देश / राष्ट्रीय समाचार', subtitle: 'संसद, केंद्र सरकार, इसरो एवं प्रमुख राष्ट्रीय घटनाक्रम' };
      case 'politics': return { title: 'राजनीति हलचल', subtitle: 'चुनावी समीकरण, दल-बदल व राजनीतिक विश्लेषण' };
      case 'business': return { title: 'व्यापार एवं अर्थव्यवस्था', subtitle: 'बाजार, सराफा, कृषि मंडियां व आर्थिक नीतियां' };
      case 'sports': return { title: 'खेल जगत (Sports)', subtitle: 'क्रिकेट, हॉकी व युवा खेल प्रतिभाएं' };
      case 'videos': return { title: 'वीडियो समाचार (Video Journalism)', subtitle: 'घटनास्थल से सीधे लाइव दृश्य और वीडियो कवरेज' };
      default: return { title: `${s.toUpperCase()} समाचार`, subtitle: 'स्वर्णिम दस्तावेज़ विशेष कवरेज' };
    }
  };

  const meta = getCategoryTitle(slug);

  const filtered = articles.filter(a => {
    if ((a.language || 'hi') !== language) return false;
    if (slug === 'all') return true;
    if (slug === 'videos') return a.showOnVideos === true;
    if (slug === 'sultanpur' || slug === 'sitapur') return a.category === 'sultanpur' || a.category === 'sitapur' || a.city === 'सुल्तानपुर' || a.city === 'Sultanpur' || a.city === 'सीतापुर' || a.city === 'Sitapur';
    if (slug === 'lucknow') return a.category === 'lucknow' || a.city === 'लखनऊ' || a.city === 'Lucknow';
    return a.category.toLowerCase() === slug.toLowerCase();
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <BreakingTicker />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-red-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>मुख्य पृष्ठ</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">{meta.title}</span>
        </div>

        {/* Category Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-l-8 border-red-700 border-y border-r border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase">
            <span>विशेष अनुभाग</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-serif mt-1">
            {meta.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {meta.subtitle}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border text-slate-500">
              इस श्रेणी में अभी और खबरें संकलित की जा रही हैं...
            </div>
          ) : (
            filtered.map((art) => {
              const videoUrl = art.mediaGallery?.find((item) => item.type === 'video')?.url;
              return (
              <article
                key={art.id}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-red-500 hover:shadow-lg transition flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    {videoUrl && playingId === art.id ? (
                      <video
                        src={videoUrl}
                        poster={art.coverImage}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : (
                      <>
                        <img
                          src={art.coverImage}
                          alt={art.headline}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {videoUrl && (
                          <button
                            type="button"
                            onClick={() => setPlayingId(art.id)}
                            className="absolute inset-0 flex items-center justify-center bg-black/30"
                            aria-label="वीडियो चलाएँ"
                          >
                            <span className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                              <Play className="w-6 h-6 ml-0.5 fill-current" />
                            </span>
                          </button>
                        )}
                      </>
                    )}
                    <span className="absolute top-2 left-2 bg-slate-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {art.city}
                    </span>
                    {art.isSponsored && (
                      <span className="absolute bottom-2 left-2 bg-purple-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        प्रायोजित
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                      <span className="font-bold text-red-600">{art.author.name}</span>
                      <span>•</span>
                      <span>{new Date(art.publishedAt).toLocaleDateString('hi-IN')}</span>
                    </div>

                    <Link href={`/article/${art.id}`}>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-red-400 line-clamp-2 leading-snug">
                        {art.headline}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-700/60 mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {art.readingTimeMinutes} मिनट
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {art.viewsCount}
                    </span>
                  </div>
                  <Link
                    href={`/article/${art.id}`}
                    className="font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>पढ़ें</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
              );
            })
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
