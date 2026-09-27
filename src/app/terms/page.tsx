'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import { Scale, Mail, Phone, MapPin, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SiteSettings } from '@/types';

export default function TermsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setSettings(d.data);
        }
      })
      .catch(() => {});
  }, []);

  const email = settings?.email || 'swarnimdastavej@gmail.com';
  const phone = settings?.phone || '+91 95196 231111';
  const address = settings?.address || 'Argada hussainganj, behind jwala hotel. Lucknow -226001';
  const regNo = settings?.registrationNo || 'UPHIN/26/A7984';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Header />
      <BreakingTicker />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* Breadcrumb & Header */}
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-xs text-amber-600 font-semibold mb-2 uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>विधिक नियम, शर्तें एवं आचार संहिता</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white tracking-tight">
            नियम एवं शर्तें (Terms and Conditions)
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            स्वर्णिम दस्तावेज़ (Swarnim Dastavej) | पंजीयन संख्या: <span className="font-mono font-bold text-amber-600">{regNo}</span>
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          
          {settings?.termsOfService ? (
            <div className="whitespace-pre-line font-sans space-y-4">
              {settings.termsOfService}
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-serif">1. सेवा शर्तों की स्वीकृति</h2>
                <p>
                  स्वर्णिम दस्तावेज़ (Swarnim Dastavej) पोर्टल, ई-पेपर, अथवा किसी भी डिजिटल सेवा का उपयोग करके आप इन नियमों और शर्तों से पूर्णतः सहमत होते हैं।
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-serif">2. बौद्धिक संपदा अधिकार</h2>
                <p>
                  पोर्टल पर प्रकाशित सभी आलेख, समाचार, विश्लेषण, चित्र, और ई-पेपर स्वर्णिम दस्तावेज़ की बौद्धिक संपदा हैं। इनका अनधिकृत वितरण कानूनी रूप से वर्जित है।
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-serif">3. विधिक क्षेत्राधिकार</h2>
                <p>
                  किसी भी विधिक विवाद की स्थिति में न्यायिक क्षेत्राधिकार केवल न्यायालय लखनऊ, उत्तर प्रदेश होगा।
                </p>
              </div>
            </>
          )}

          {/* Official Contact Box */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              विधिक एवं विनियामक संपर्क
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium block">कार्यालय:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{address}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium block">ईमेल:</span>
                  <a href={`mailto:${email}`} className="font-semibold text-amber-600 hover:underline">
                    {email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium block">फोन:</span>
                  <a href={`tel:${phone}`} className="font-semibold text-amber-600 hover:underline">
                    {phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium block">पंजीकरण क्रमांक:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{regNo}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
