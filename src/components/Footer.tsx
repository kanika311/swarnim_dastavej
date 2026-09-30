'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  PenTool, 
  Newspaper, 
  ClipboardList, 
  FileText, 
  Scale, 
  BookOpen, 
  ShieldAlert 
} from 'lucide-react';
import { SiteSettings } from '@/types';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/translations';

export default function Footer() {
  const { language } = useApp();
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

  const displayTitle = language === 'en' ? 'Swarnim Dastavej' : language === 'ur' ? 'سورنم دستاویز' : 'स्वर्णिम दस्तावेज़';
  const displayTagline = getTranslation(language, 'footer_tagline');

  return (
    <footer className="bg-[#FFF8EE] text-[#14386B] dark:bg-[#0B2456] dark:text-[#F7F1E3] text-xs pt-12 pb-8 border-t-4 border-[#C9962A]">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#E4C56A]/80 dark:border-[#C9962A]/40">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-full bg-white p-0.5 flex items-center justify-center border-2 border-[#C9962A] shrink-0 overflow-hidden shadow-sm">
                <Image
                  src="/logo.png?v=4"
                  alt={displayTitle}
                  width={44}
                  height={44}
                  className="w-full h-full object-contain rounded-full"
                  unoptimized
                />
              </div>
              <span className="text-xl font-bold text-[#0C2E5C] dark:text-[#F8E7B0] font-serif tracking-wide">{displayTitle}</span>
            </div>
            <p className="text-[#1B4E8C] dark:text-[#F4EBD8] leading-relaxed text-xs">
              {displayTagline}
            </p>
            <div className="inline-block bg-white dark:bg-[#12356B] border border-[#C9962A] rounded px-2.5 py-1 text-xs text-[#8A6410] dark:text-[#F0C14A] font-mono shadow-sm">
              {getTranslation(language, 'footer_registration')}: RNI No. {settings.registrationNo || 'UPHIN/26/A7984'}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#0C2E5C] dark:text-[#F8E7B0] uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-[#E4C56A] dark:border-[#C9962A]/50 pb-1">
              {getTranslation(language, 'footer_major_categories')}
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs text-[#1B4E8C] dark:text-[#F4EBD8]">
              <li>
                <Link href="/category/state" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">
                  {language === 'en' ? 'Uttar Pradesh' : language === 'ur' ? 'اتر پردیش' : 'उत्तर प्रदेश'}
                </Link>
              </li>
              <li>
                <Link href="/category/sitapur" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">
                  {language === 'en' ? 'Sitapur Spotlight' : language === 'ur' ? 'سیتاپور خصوصی' : 'सीतापुर विशेष'}
                </Link>
              </li>
              <li>
                <Link href="/category/lucknow" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">
                  {language === 'en' ? 'Lucknow Daily' : language === 'ur' ? 'لکھنؤ روزنامہ' : 'लखनऊ दैनिक'}
                </Link>
              </li>
              <li>
                <Link href="/category/national" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">
                  {language === 'en' ? 'National News' : language === 'ur' ? 'قومی خبریں' : 'देश / राष्ट्रीय'}
                </Link>
              </li>
              <li>
                <Link href="/category/politics" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">
                  {language === 'en' ? 'Politics' : language === 'ur' ? 'سیاست' : 'राजनीति'}
                </Link>
              </li>
              <li>
                <Link href="/category/business" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">
                  {language === 'en' ? 'Business' : language === 'ur' ? 'کاروبار' : 'कारोबार'}
                </Link>
              </li>
              <li>
                <Link href="/category/sports" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">
                  {language === 'en' ? 'Sports' : language === 'ur' ? 'کھیل' : 'खेल जगत'}
                </Link>
              </li>
              <li>
                <Link href="/category/videos" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] transition">
                  {language === 'en' ? 'Video News' : language === 'ur' ? 'ویڈیو خبریں' : 'वीडियो न्यूज़'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#0C2E5C] dark:text-[#F8E7B0] uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-[#E4C56A] dark:border-[#C9962A]/50 pb-1">
              {getTranslation(language, 'footer_services_policies')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#1B4E8C] dark:text-[#F4EBD8]">
              <li>
                <Link href="/submit-news" className="text-[#8A6410] dark:text-[#F0C14A] hover:underline flex items-center gap-2 font-medium">
                  <PenTool className="w-3.5 h-3.5 text-[#C9962A] shrink-0" />
                  <span>{language === 'en' ? 'Citizen Journalism' : language === 'ur' ? 'شہری صحافت' : 'नागरिक पत्रकारिता'}</span>
                </Link>
              </li>
              <li>
                <Link href="/epaper" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] flex items-center gap-2">
                  <Newspaper className="w-3.5 h-3.5 text-[#C9962A] shrink-0" />
                  <span>{language === 'en' ? 'Daily E-Paper (Digital)' : language === 'ur' ? 'روزنامہ ای پیپر' : 'दैनिक ई-पेपर (डिजिटल संस्करण)'}</span>
                </Link>
              </li>
              <li>
                <Link href="/classifieds" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] flex items-center gap-2">
                  <ClipboardList className="w-3.5 h-3.5 text-[#C9962A] shrink-0" />
                  <span>{language === 'en' ? 'Classifieds & Tenders' : language === 'ur' ? 'کلاسیفائیڈ اور ٹینڈرز' : 'क्लासिफाइड एवं निविदाएं'}</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#C9962A] shrink-0" />
                  <span>{language === 'en' ? 'Privacy Policy' : language === 'ur' ? 'پرائیویسی پالیسی' : 'गोपनीयता नीति'}</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5 text-[#C9962A] shrink-0" />
                  <span>{language === 'en' ? 'Terms & Conditions' : language === 'ur' ? 'شرائط व ضوابط' : 'नियम एवं शर्तें'}</span>
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#C9962A] shrink-0" />
                  <span>{language === 'en' ? 'Editorial Policy' : language === 'ur' ? 'ادارتی پالیسی' : 'संपादकीय नीति'}</span>
                </Link>
              </li>
              <li>
                <Link href="/grievance" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A] flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#C9962A] shrink-0" />
                  <span>{language === 'en' ? 'Grievance Officer (IT Rules)' : language === 'ur' ? 'ازالہ شکایات افسر' : 'शिकायत निवारण अधिकारी'}</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-xs bg-white dark:bg-[#12356B] text-[#14386B] dark:text-[#F7F1E3] p-3.5 rounded-xl border border-[#E4C56A] dark:border-[#C9962A]/60">
            <h4 className="text-xs font-bold text-[#8A6410] dark:text-[#F0C14A] uppercase tracking-wide flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#C9962A]" />
              {getTranslation(language, 'footer_statutory_imprint')}
            </h4>
            <p>
              <strong className="text-[#0C2E5C] dark:text-white">
                {getTranslation(language, 'footer_editor_in_chief')}:
              </strong>{' '}
              {language === 'en' ? 'Rameshwar Dayal' : language === 'ur' ? 'رامیشور دیال' : settings.editorInChief}
            </p>
            <p>
              <strong className="text-[#0C2E5C] dark:text-white">
                {getTranslation(language, 'footer_publisher')}:
              </strong>{' '}
              {language === 'en' ? 'Swarnim Dastavej Publications' : language === 'ur' ? 'سورنم دستاویز پبلیکیشنز' : settings.publisher}
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
              {getTranslation(language, 'footer_compliance')}
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#14386B] dark:text-[#F7F1E3]">
          <div>
            © {new Date().getFullYear()} {displayTitle}. RNI No. {settings.registrationNo}. {getTranslation(language, 'footer_copyright')}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A]">{getTranslation(language, 'footer_privacy')}</Link>
            <span className="text-[#C9962A]">•</span>
            <Link href="/terms" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A]">{getTranslation(language, 'footer_terms')}</Link>
            <span className="text-[#C9962A]">•</span>
            <Link href="/editorial-policy" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A]">{getTranslation(language, 'footer_editorial_policy')}</Link>
            <span className="text-[#C9962A]">•</span>
            <Link href="/grievance" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A]">{getTranslation(language, 'footer_grievance')}</Link>
            <span className="text-[#C9962A]">•</span>
            <Link href="/epaper" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A]">{getTranslation(language, 'footer_epaper_archive')}</Link>
            <span className="text-[#C9962A]">•</span>
            <Link href="/submit-news" className="hover:text-[#A37B12] dark:hover:text-[#F0C14A]">{getTranslation(language, 'footer_reporter_guidelines')}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

