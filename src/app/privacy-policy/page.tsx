'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import { ShieldCheck, Mail, Phone, MapPin, FileText, CheckCircle2, Lock } from 'lucide-react';
import { SiteSettings } from '@/types';

export default function PrivacyPolicyPage() {
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
            <Lock className="w-4 h-4" />
            <span>विधिक नीतियां एवं पाठक सुरक्षा</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white tracking-tight">
            गोपनीयता नीति (Privacy Policy)
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            स्वर्णिम दस्तावेज़ (Swarnim Dastavej) | RNI पंजीयन संख्या: <span className="font-mono font-bold text-amber-600">{regNo}</span>
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">पाठक गोपनीयता का स्वर्णिम संकल्प:</strong> स्वर्णिम दस्तावेज़ पाठकों एवं नागरिक पत्रकारों के व्यक्तिगत डेटा, स्रोतों की गोपनीयता तथा संवादों की सुरक्षा हेतु उच्चतम मानकों का पालन करता है। हम कभी भी किसी तीसरे पक्ष को वाणिज्यिक लाभ हेतु आपका डेटा साझा नहीं करते।
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          
          {settings?.privacyPolicy ? (
            <div className="whitespace-pre-line font-sans space-y-4">
              {settings.privacyPolicy}
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-serif">1. एकत्रित की जाने वाली जानकारी</h2>
                <p>
                  जब आप हमारे डिजिटल न्यूज़ पोर्टल पर आते हैं या नागरिक पत्रकारिता (Citizen Journalism) के अंतर्गत समाचार, फ़ोटो या वीडियो सबमिट करते हैं, तो हम निम्नलिखित जानकारी सुरक्षित रूप से संकलित कर सकते हैं:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-300">
                  <li>आपका नाम, मोबाइल नंबर और ईमेल पता।</li>
                  <li>जिला एवं स्थान (समाचार की प्रामाणिकता हेतु आवश्यक)।</li>
                  <li>शिकायत दर्ज कराने की स्थिति में विधिक दस्तावेज एवं पहचान पत्र।</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-serif">2. सूचना का उपयोग और सुरक्षा</h2>
                <p>
                  एकत्रित की गई जानकारी का उपयोग केवल समाचार सत्यापन, ई-पेपर वितरण, विधिक अनुपालन (सूचना प्रौद्योगिकी नियमावली 2021) और पाठकीय शिकायतों के निस्तारण हेतु किया जाता है।
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-serif">3. कुकीज़ एवं वेब लॉग्स</h2>
                <p>
                  उपयोगकर्ता अनुभव को सुगम बनाने, भाषा प्राथमिकताएं (हिन्दी/अंग्रेजी/उर्दू) सहेजने और पोर्टल की सुरक्षा सुनिश्चित करने हेतु आवश्यक तकनीकी कुकीज़ का उपयोग किया जाता है।
                </p>
              </div>
            </>
          )}

          {/* Official Contact Box */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              गोपनीयता अधिकारी एवं संपादकीय संपर्क
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium block">कार्यालय का पता:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{address}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium block">ईमेल (आधिकारिक):</span>
                  <a href={`mailto:${email}`} className="font-semibold text-amber-600 hover:underline">
                    {email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium block">फोन / व्हाट्सएप:</span>
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
