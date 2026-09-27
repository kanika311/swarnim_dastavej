'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import { INITIAL_CLASSIFIEDS } from '@/lib/initialData';
import { ClassifiedItem } from '@/types';
import { 
  FileSpreadsheet, 
  MapPin, 
  Phone, 
  PlusCircle, 
  CheckCircle, 
  Building, 
  FileText, 
  Calendar 
} from 'lucide-react';

export default function ClassifiedsPage() {
  const [items, setItems] = useState<ClassifiedItem[]>(INITIAL_CLASSIFIEDS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<any>('public_notice');
  const [city, setCity] = useState('सीतापुर');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const filteredItems = items.filter(item => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !contact.trim()) return;

    try {
      const res = await fetch('/api/classifieds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, city, content, contact })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setItems(prev => [data.data, ...prev]);
        setSuccessMsg(true);
        setTitle('');
        setContent('');
        setContact('');
        setTimeout(() => {
          setSuccessMsg(false);
          setShowSubmitModal(false);
        }, 2000);
      }
    } catch (e) {
      alert('क्लासिफाइड दर्ज करने में त्रुटि।');
    }
  };

  const getBadge = (t: string) => {
    switch (t) {
      case 'obituary': return { label: 'शोक संदेश / श्रद्धांजलि', bg: 'bg-slate-700 text-white' };
      case 'tender': return { label: 'अल्पकालिक निविदा आमंत्रण', bg: 'bg-blue-700 text-white' };
      case 'public_notice': return { label: 'सार्वजनिक सूचना (Public Notice)', bg: 'bg-amber-600 text-white' };
      case 'property': return { label: 'संपत्ति / क्रय-विक्रय', bg: 'bg-emerald-700 text-white' };
      default: return { label: 'क्लासिफाइड', bg: 'bg-slate-600 text-white' };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <BreakingTicker />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-900 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="bg-amber-400 text-slate-950 text-xs font-black uppercase px-2.5 py-0.5 rounded shadow">
              मुद्रित संस्करण का अंतिम पृष्ठ
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif mt-2">
              क्लासिफाइड, निविदाएं एवं सार्वजनिक सूचनाएं
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              सीतापुर, लखनऊ एवं अवध मंडल की अधिकृत नगर पालिका सूचनाएं, अल्पकालिक निविदाएं, शोक संदेश और व्यावसायिक विज्ञापन।
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-md flex items-center gap-2 transition active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>विज्ञापन / सूचना प्रकाशित करें</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-6 text-xs sm:text-sm font-bold border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'all', label: 'सभी सूचनाएं (All)' },
            { id: 'public_notice', label: 'सार्वजनिक सूचना (Notices)' },
            { id: 'tender', label: 'निविदाएं (Tenders)' },
            { id: 'obituary', label: 'शोक संदेश (Obituary)' },
            { id: 'property', label: 'प्रॉपर्टी / भूखंड' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-red-700 text-white shadow'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Classifieds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {filteredItems.map((item) => {
            const badge = getBadge(item.type);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-600" />
                      {item.city}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-700/60 mb-3">
                    {item.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-red-600" />
                    <span>{item.contact}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    दिनांक: {item.publishedDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* SUBMISSION MODAL */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 pb-2 border-b">
                क्लासिफाइड विज्ञापन / सूचना प्रेषण फॉर्म
              </h3>

              {successMsg ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>आपकी सूचना सफलतापूर्वक दर्ज कर ली गई है!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">शीर्षक (Title) *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="उदा: अल्पकालिक निविदा / सार्वजनिक सूचना"
                      className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold mb-1">प्रकार (Type)</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      >
                        <option value="public_notice">सार्वजनिक सूचना</option>
                        <option value="tender">निविदा आमंत्रण</option>
                        <option value="obituary">शोक संदेश</option>
                        <option value="property">प्रॉपर्टी</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">शहर / ज़िला</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">विवरण (Content) *</label>
                    <textarea
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="सूचना अथवा विज्ञापन का संपूर्ण मजमून..."
                      className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">संपर्क सूत्र (Phone / Contact) *</label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="फ़ोन नंबर या संपर्क अधिकारी का नाम"
                      className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="text-xs px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow"
                    >
                      जमा करें
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
