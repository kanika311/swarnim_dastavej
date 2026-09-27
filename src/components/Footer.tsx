'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Phone, MapPin, Award, FileText, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs pt-12 pb-8 border-t-4 border-red-700">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Top Grid: Branding & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Col 1: About Newspaper */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-red-700 text-amber-300 font-bold flex items-center justify-center border border-amber-400">
                स्वर्ण
              </div>
              <span className="text-xl font-bold text-white font-serif tracking-wide">स्वर्णिम दस्तावेज़</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              उत्तर प्रदेश का विश्वसनीय और निष्पक्ष हिंदी दैनिक समाचार पत्र एवं डिजिटल न्यूज़ नेटवर्क। राजधानी लखनऊ और सीतापुर सहित संपूर्ण अवध क्षेत्र की जमीनी आवाज़।
            </p>
            <div className="inline-block bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-[11px] text-amber-400 font-mono">
              पंजीकरण: RNI No. UPHIN/26/A7984
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-800 pb-1">
              प्रमुख श्रेणियां
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-[11px]">
              <li><Link href="/category/state" className="hover:text-amber-400 transition">उत्तर प्रदेश</Link></li>
              <li><Link href="/category/sitapur" className="hover:text-amber-400 transition">सीतापुर विशेष</Link></li>
              <li><Link href="/category/lucknow" className="hover:text-amber-400 transition">लखनऊ दैनिक</Link></li>
              <li><Link href="/category/national" className="hover:text-amber-400 transition">देश / राष्ट्रीय</Link></li>
              <li><Link href="/category/politics" className="hover:text-amber-400 transition">राजनीति</Link></li>
              <li><Link href="/category/business" className="hover:text-amber-400 transition">कारोबार</Link></li>
              <li><Link href="/category/sports" className="hover:text-amber-400 transition">खेल जगत</Link></li>
              <li><Link href="/category/videos" className="hover:text-amber-400 transition">वीडियो न्यूज़</Link></li>
            </ul>
          </div>

          {/* Col 3: Citizen Journalism & Digital Modules */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-800 pb-1">
              डिजिटल सेवाएं
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/submit-news" className="text-amber-400 hover:underline flex items-center gap-1">
                  ✍️ नागरिक पत्रकारिता (Citizen Journalism)
                </Link>
              </li>
              <li>
                <Link href="/epaper" className="hover:text-white flex items-center gap-1">
                  📰 दैनिक ई-पेपर (डिजिटल संस्करण)
                </Link>
              </li>
              <li>
                <Link href="/classifieds" className="hover:text-white flex items-center gap-1">
                  📋 क्लासिफाइड एवं निविदाएं (Classifieds)
                </Link>
              </li>
              <li>
                <Link href="/grievance" className="hover:text-white flex items-center gap-1">
                  ⚖️ शिकायत निवारण अधिकारी (IT Rules 2021)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-white flex items-center gap-1">
                  🔒 संपादकीय सीएमएस लॉगिन
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Statutory Disclosures & Grievance Redressal */}
          <div className="space-y-2 text-[11px] bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              वैधानिक प्रकटीकरण (Statutory Imprint)
            </h4>
            <p className="text-slate-300">
              <strong className="text-white">प्रधान संपादक:</strong> रामेश्वर दयाल
            </p>
            <p className="text-slate-300">
              <strong className="text-white">मुद्रक एवं प्रकाशक:</strong> स्वर्णिम दस्तावेज़ प्रकाशन, लखनऊ
            </p>
            <p className="text-slate-300 flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>हजरतगंज, लखनऊ, उत्तर प्रदेश - 226001</span>
            </p>
            <p className="text-slate-300 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>editor@swarnimdastavej.com</span>
            </p>
            <div className="pt-1 text-[10px] text-slate-400 border-t border-slate-800">
              सूचना प्रौद्योगिकी (मध्यवर्ती संदर्शिका एवं डिजिटल मीडिया आचार संहिता) नियमावली, 2021 के अनुपालनार्थ।
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Ethics */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} स्वर्णिम दस्तावेज़ (Swarnim Dastavej). सर्वाधिकार सुरक्षित।
          </div>
          <div className="flex items-center gap-4">
            <Link href="/grievance" className="hover:text-slate-300">आचार संहिता एवं शिकायत</Link>
            <span>•</span>
            <Link href="/epaper" className="hover:text-slate-300">ई-पेपर अभिलेखागार</Link>
            <span>•</span>
            <Link href="/submit-news" className="hover:text-slate-300">संवाददाता नियम</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
