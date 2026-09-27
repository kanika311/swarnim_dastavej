'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Mail, Phone, MapPin, Award, FileText, Heart } from 'lucide-react';
import { SiteSettings } from '@/types';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'स्वर्णिम दस्तावेज़ (Swarnim Dastavej)',
    tagline: 'उत्तर प्रदेश का विश्वसनीय और निष्पक्ष हिंदी दैनिक समाचार पत्र एवं डिजिटल न्यूज़ नेटवर्क।',
    email: 'swarnimdastavej@gmail.com',
    phone: '+91 95196 231111',
    address: 'Argada hussainganj, behind jwala hotel. Lucknow -226001',
    registrationNo: 'UPHIN/26/A7984',
    editorInChief: 'रामेश्वर दयाल',
    publisher: 'स्वर्णिम दस्तावेज़ प्रकाशन',
    privacyPolicy: '',
    termsOfService: '',
    editorialPolicy: '',
    updatedAt: ''
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(prev => ({ ...prev, ...data.data }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#FFF8EE] text-[#14386B] dark:bg-[#0B2456] dark:text-[#F7F1E3] text-xs pt-12 pb-8 border-t-4 border-[#C9962A]">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#E4C56A]/80 dark:border-[#C9962A]/40">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-full bg-white p-0.5 flex items-center justify-center border-2 border-[#C9962A] shrink-0 overflow-hidden shadow-sm">
                <Image
                  src="/logo.png?v=4"
                  alt="स्वर्णिम दस्तावेज़"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain rounded-full"
                  unoptimized
                />
              </div>
              <span className="text-xl font-bold text-[#0C2E5C] dark:text-[#F8E7B0] font-serif tracking-wide">स्वर्णिम दस्तावेज़</span>
            </div>
            <p className="text-[#1B4E8C] dark:text-[#F4EBD8] leading-relaxed text-xs">
              {settings.tagline}
            </p>
            <div className="inline-block bg-white dark:bg-[#12356B] border border-[#C9962A] rounded px-2.5 py-1 text-xs text-[#8A6410] dark:text-[#F0C14A] font-mono shadow-sm">
              पंजीकरण: RNI No. {settings.registrationNo || 'UPHIN/26/A7984'}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#0C2E5C] dark:text-[#F8E7B0] uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-[#E4C56A] dark:border-[#C9962A]/50 pb-1">
              प्रमुख श्रेणियां
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs text-[#1B4E8C] dark:text-[#F4EBD8]">
              <li><Link href="/category/state" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">उत्तर प्रदेश</Link></li>
              <li><Link href="/category/sitapur" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">सीतापुर विशेष</Link></li>
              <li><Link href="/category/lucknow" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">लखनऊ दैनिक</Link></li>
              <li><Link href="/category/national" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">देश / राष्ट्रीय</Link></li>
              <li><Link href="/category/politics" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">राजनीति</Link></li>
              <li><Link href="/category/business" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">कारोबार</Link></li>
              <li><Link href="/category/sports" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">खेल जगत</Link></li>
              <li><Link href="/category/videos" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">वीडियो न्यूज़</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#0C2E5C] dark:text-[#F8E7B0] uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-[#E4C56A] dark:border-[#C9962A]/50 pb-1">
              डिजिटल सेवाएं व नीतियां
            </h4>
            <ul className="space-y-2 text-xs text-[#1B4E8C] dark:text-[#F4EBD8]">
              <li>
                <Link href="/submit-news" className="text-[#8A6410] dark:text-[#F0C14A] hover:underline flex items-center gap-1">
                  ✍️ नागरिक पत्रकारिता (Citizen Journalism)
                </Link>
              </li>
              <li>
                <Link href="/epaper" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] flex items-center gap-1">
                  📰 दैनिक ई-पेपर (डिजिटल संस्करण)
                </Link>
              </li>
              <li>
                <Link href="/classifieds" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] flex items-center gap-1">
                  📋 क्लासिफाइड एवं निविदाएं (Classifieds)
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] flex items-center gap-1">
                  📜 गोपनीयता नीति (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] flex items-center gap-1">
                  ⚖️ नियम एवं शर्तें (Terms & Conditions)
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] flex items-center gap-1">
                  📰 संपादकीय नीति (Editorial Policy)
                </Link>
              </li>
              <li>
                <Link href="/grievance" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] flex items-center gap-1">
                  🛡️ शिकायत निवारण अधिकारी (IT Rules 2021)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] flex items-center gap-1">
                  🔒 संपादकीय CMS लॉगिन
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-xs bg-white dark:bg-[#12356B] text-[#14386B] dark:text-[#F7F1E3] p-3.5 rounded-xl border border-[#E4C56A] dark:border-[#C9962A]/60">
            <h4 className="text-xs font-bold text-[#8A6410] dark:text-[#F0C14A] uppercase tracking-wide flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#C9962A]" />
              वैधानिक प्रकटीकरण (Statutory Imprint)
            </h4>
            <p>
              <strong className="text-[#0C2E5C] dark:text-white">प्रधान संपादक:</strong> {settings.editorInChief}
            </p>
            <p>
              <strong className="text-[#0C2E5C] dark:text-white">मुद्रक एवं प्रकाशक:</strong> {settings.publisher}
            </p>
            <p className="flex items-start gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C9962A] shrink-0 mt-0.5" />
              <span className="leading-snug">{settings.address}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#C9962A] shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] underline font-mono text-xs break-all">
                {settings.email}
              </a>
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#C9962A] shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] font-mono text-xs">
                {settings.phone}
              </a>
            </p>
            <div className="pt-2 text-xs text-[#1B4E8C] dark:text-[#F4EBD8] border-t border-[#E4C56A]/80 dark:border-[#C9962A]/40">
              सूचना प्रौद्योगिकी (मध्यवर्ती संदर्शिका एवं डिजिटल मीडिया आचार संहिता) नियमावली, 2021 के अनुपालनार्थ।
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#14386B] dark:text-[#F7F1E3]">
          <div>
            © {new Date().getFullYear()} स्वर्णिम दस्तावेज़ (Swarnim Dastavej). RNI No. {settings.registrationNo}. सर्वाधिकार सुरक्षित।
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A]">गोपनीयता नीति</Link>
            <span className="text-[#C9962A]">•</span>
            <Link href="/terms" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A]">नियम एवं शर्तें</Link>
            <span className="text-[#C9962A]">•</span>
            <Link href="/editorial-policy" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A]">संपादकीय नीति</Link>
            <span className="text-[#C9962A]">•</span>
            <Link href="/grievance" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A]">आचार संहिता एवं शिकायत</Link>
            <span className="text-[#C9962A]">•</span>
            <Link href="/epaper" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A]">ई-पेपर अभिलेखागार</Link>
            <span className="text-[#C9962A]">•</span>
            <Link href="/submit-news" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A]">संवाददाता नियम</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
