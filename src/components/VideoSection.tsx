'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Video, Eye, Clock } from 'lucide-react';

export default function VideoSection() {
  const videos = [
    {
      id: 'vid-1',
      title: 'गगनयान टेस्ट व्हीकल की समुद्र में सफल लैंडिंग का ऐतिहासिक वीडियो',
      duration: '02:45',
      views: '45.2K',
      city: 'नई दिल्ली',
      thumbnail: 'https://images.unsplash.com/photo-1517976487502-5f71bb4028d6?w=600&auto=format&fit=crop&q=80',
      category: 'राष्ट्रीय'
    },
    {
      id: 'vid-2',
      title: 'गोमती नदी सुल्तानपुर: 300 युवाओं ने कैसे 5 घंटे में बदल दी तस्वीर',
      duration: '03:12',
      views: '28.9K',
      city: 'सुल्तानपुर',
      thumbnail: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80',
      category: 'ग्राउंड रिपोर्ट'
    },
    {
      id: 'vid-3',
      title: 'लखनऊ मेट्रो ईस्ट-वेस्ट कॉरिडोर: चारबाग से वसंत कुंज के प्रस्तावित 12 स्टेशन',
      duration: '01:50',
      views: '19.4K',
      city: 'लखनऊ',
      thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
      category: 'मेट्रो अपडेट'
    },
    {
      id: 'vid-4',
      title: 'कानपुर ग्रीन पार्क में रोहित-विराट का 3 घंटे का स्पेशल नेट सेशन',
      duration: '04:15',
      views: '62.1K',
      city: 'कानपुर',
      thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
      category: 'स्पोर्ट्स स्पेशल'
    }
  ];

  return (
    <section className="mb-10 bg-slate-900 text-white p-5 md:p-6 rounded-2xl shadow-lg border border-slate-800">
      <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold font-serif">वीडियो पत्रकारिता (Video News)</h3>
            <p className="text-xs text-slate-400">घटनास्थल से सीधी तस्वीरें और वीडियो रिपोर्ट</p>
          </div>
        </div>
        <Link href="/category/videos" className="text-xs font-semibold text-amber-400 hover:underline">
          सभी वीडियो देखें →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="group cursor-pointer bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-red-500 transition shadow"
            onClick={() => alert(`वीडियो प्लेयर: '${vid.title}' चल रहा है!`)}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <img
                src={vid.thumbnail}
                alt={vid.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                {vid.duration}
              </span>
              <span className="absolute top-2 left-2 bg-red-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {vid.category}
              </span>
            </div>

            <div className="p-3">
              <h4 className="text-xs font-bold line-clamp-2 group-hover:text-amber-300 transition-colors">
                {vid.title}
              </h4>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                <span>{vid.city}</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {vid.views}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
