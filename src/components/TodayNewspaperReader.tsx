'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { EPaperEdition, EPaperPage, EPaperPricingPlan } from '@/types';
import { playPageTurnSound } from '@/lib/audioSound';
import PdfSinglePage from '@/components/PdfSinglePage';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Calendar, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Share2, 
  Maximize2, 
  X, 
  Volume2, 
  VolumeX, 
  ShieldCheck,
  TrendingUp,
  CloudSun,
  Flame,
  Award,
  Lock,
  Unlock,
  Sparkles,
  CreditCard,
  CheckCircle2,
  Check,
  QrCode,
  Download,
  ExternalLink,
  FileText
} from 'lucide-react';

const NEWSPAPER_CONTENT = {
  hi: {
    mastheadTitle: 'स्वर्णिम दस्तावेज़',
    mastheadMotto: 'सत्य, निष्पक्षता एवं स्वर्णिम सरोकार | लखनऊ एवं सीतापुर का अग्रणी दैनिक',
    dayName: 'रविवार',
    price: 'मूल्य: ₹4.00',
    yearIssue: 'वर्ष 12 | अंक 245',
    editionSuffix: 'मुख्य संस्करण',
    pageLabel: 'पृष्ठ',
    zoomPrompt: 'क्लिक करें ➔ पूरा पन्ना ज़ूम होगा',
    fullPageRead: 'फुल स्क्रीन पढ़ें',
    page1: {
      badge: 'बड़ी खबर • कैबिनेट फैसला',
      headline: 'यूपी में हाईवे नेटवर्क का महा-विस्तार: लखनऊ-सीतापुर-लखीमपुर 6 लेन कॉरिडोर को मंजूरी, यात्रा समय आधा होगा',
      excerpt: '4,200 करोड़ की लागत से 138 किमी लंबा आधुनिक ग्रीनफील्ड एक्सप्रेसवे बनेगा। सीतापुर से लखनऊ अब मात्र 45 मिनट में।',
      photoCaption: 'लखनऊ-सीतापुर एक्सप्रेसवे रूट एवं औद्योगिक गलियारा योजना',
      side1Tag: 'अंतरिक्ष • इसरो',
      side1Title: 'गगनयान मानवरहित मिशन की सफल लैंडिंग, अंतरिक्ष में भारत का दबदबा',
      side2Tag: 'सीतापुर विशेष',
      side2Title: 'सरायन नदी को पुनर्जीवित करने आगे आए युवा, निकाला 10 टन कचरा',
      schemeTag: 'पीएम कुसुम योजना:',
      schemeText: 'किसानों को सोलर पंप पर 70% सब्सिडी, ऑनलाइन आवेदन जारी।',
      schemeDept: 'कृषि विभाग'
    },
    page2: {
      header: 'प्रादेशिक हलचल (उत्तर प्रदेश)',
      leadTag: 'अयोध्या विशेष',
      leadTitle: 'अयोध्या में विश्वस्तरीय रामायण संग्रहालय का निर्माण तेज: 100 देशों की रामायण परंपराएं होंगी प्रदर्शित',
      leadExcerpt: 'सरयू तट पर 10 एकड़ में आधुनिक सांस्कृतिक केंद्र, 3D हॉलोग्राम व वर्चुअल Reality थियेटर का निर्माण कार्य तीव्र गति से जारी।',
      col1Tag: 'कानपुर',
      col1Title: 'गंगा बैराज रिवरफ्रंट को मिली नई सौगात, पर्यटकों के लिए बोटिंग क्लब शुरू',
      col1Excerpt: 'कानपुर विकास प्राधिकरण ने 45 करोड़ की लागत से विकसित रिवरफ्रंट का लोकार्पण किया।',
      col2Tag: 'वाराणसी',
      col2Title: 'काशी विश्वनाथ धाम में 15 करोड़ श्रद्धालुओं का नया कीर्तिमान स्थापित',
      col2Excerpt: 'गंगा आरती दर्शन हेतु श्रद्धालुओं की ऐतिहासिक संख्या, पर्यटन उद्योग को भारी लाभ।',
      bannerTag: 'प्रयागराज महाकुंभ 2025',
      bannerTitle: '45 करोड़ श्रद्धालुओं के आगमन की तैयारी, 25,000 टेंट सिटी और आधुनिक स्वास्थ्य केंद्र',
      footer: 'स्वर्णिम दस्तावेज़ • उत्तर प्रदेश संस्करण'
    },
    page3: {
      header: 'अवध परिक्रमा (लखनऊ व सीतापुर नगर)',
      leadTag: 'लखनऊ मेट्रो',
      leadTitle: 'लखनऊ मेट्रो फेज-2: चारबाग से वसंत कुंज 11.8 किमी रूट की डीपीआर मंजूर, 12 स्टेशनों को कनेक्टिविटी',
      leadExcerpt: 'अमीनाबाद, चौक, ठाकुरगंज और मेडिकल कॉलेज के लाखों व्यापारियों व मरीजों को जाम से मुक्ति मिलेगी।',
      col1Tag: 'सीतापुर नवीन मंडी',
      col1Title: 'गेहूं और सरसों की रिकॉर्ड आवक, किसानों को मिले ₹2,425 प्रति क्विंटल',
      col2Tag: 'नैमिषारण्य धाम',
      col2Title: 'चक्रतीर्थ सौंदर्यीकरण हेतु 120 करोड़ की परियोजना को अंतिम मंजूरी',
      bannerTag: 'जनसमस्या व समाधान',
      bannerTitle: 'सीतापुर-लहरपुर मार्ग पर टूटी पुलिया की मरम्मत शुरू, ग्रामीणों की मांग पर प्रशासन ने लिया संज्ञान',
      footer: 'सीतापुर एवं लखनऊ जिला संवाद ब्यूरो'
    },
    page4: {
      header: 'संपादकीय एवं विचार मंच (Editorial & Op-Ed)',
      leadTag: 'मुख्य संपादकीय',
      leadTitle: 'बुनियादी ढांचे की नई उड़ान और अवध क्षेत्र का कायाकल्प',
      leadExcerpt: 'उत्तर प्रदेश में नए 6-लेन ग्रीनफील्ड एक्सप्रेसवे न केवल यात्रा का समय घटाएंगे बल्कि स्थानीय कृषि मंडियों और सूक्ष्म उद्योगों को दिल्ली तथा अन्य महानगरों से जोड़कर समृद्धि लाएंगे।',
      col1Tag: 'विशेष स्तंभकार',
      col1Title: 'नागरिक पत्रकारिता: लोकतंत्र की जमीनी आवाज',
      col1Excerpt: 'जब आम नागरिक अपनी समस्या को तथ्य व प्रमाण के साथ उजागर करता है, तो जवाबदेही बढ़ती है।',
      thoughtTag: 'आज का स्वर्णिम विचार',
      thoughtQuote: '"सत्यमेव जयते नानृतं — सत्य की ही विजय होती है, असत्य की नहीं।',
      thoughtAuthor: '— मुंडकोपनिषद्',
      footer: 'संपादकीय दृष्टिकोण'
    },
    page5: {
      header: 'कारोबार एवं क्रीड़ा जगत (Business & Sports)',
      col1Tag: 'बाजार हलचल',
      col1Title: 'सेंसेक्स 85,000 के ऐतिहासिक शिखर पर, बैंकिंग व ऑटो शेयरों में भारी उछाल',
      col2Tag: 'क्रिकेट विशेष',
      col2Title: 'बॉर्डर-गावस्कर ट्रॉफी: ग्रीन पार्क में भारतीय टीम का अभ्यास सत्र शुरू',
      rateTitle: 'सर्राफा एवं कमोडिटी भाव (आज का बाजार):',
      gold: 'सोना (24K): ₹76,400',
      silver: 'चांदी: ₹92,000',
      petrol: 'पेट्रोल: ₹94.65/L',
      footer: 'दैनिक कारोबार एवं क्रीड़ा रिपोर्ट'
    },
    page6: {
      header: 'क्लासिफाइड, सार्वजनिक निविदाएं एवं मौसम',
      noticeTag: 'सार्वजनिक सूचना',
      noticeTitle: 'नगर पालिका परिषद: गृहकर एवं जलकल बकाया जमा करने हेतु अंतिम अवसर',
      jobsTitle: 'रोजगार सूचना:',
      jobsText: 'स्वर्णिम दस्तावेज़ डिजिटल डेस्क हेतु उप-संपादक व अनुवादक की आवश्यकता। बायोडाटा भेजें।',
      weatherTitle: 'मौसम पूर्वानुमान:',
      weatherText: 'लखनऊ व सीतापुर: अधिकतम 30°C, न्यूनतम 22°C। आंशिक बादल छाए रहने की संभावना।',
      footer: 'स्वर्णिम दस्तावेज़ दैनिक समाचार पत्र • मुद्रित एवं डिजिटल संस्करण • समापन पृष्ठ'
    }
  },
  en: {
    mastheadTitle: 'Swarnim Dastavej',
    mastheadMotto: 'Truth, Courage & Public Interest | Premier Daily Newspaper of Awadh & UP',
    dayName: 'Sunday',
    price: 'Price: ₹4.00',
    yearIssue: 'Vol. 12 | Issue 245',
    editionSuffix: 'Main Edition',
    pageLabel: 'Page',
    zoomPrompt: 'Click anywhere ➔ Open full broadsheet zoom',
    fullPageRead: 'Read Fullscreen',
    page1: {
      badge: 'BREAKING • CABINET DECISION',
      headline: 'Major Highway Expansion in UP: Lucknow-Sitapur-Lakhimpur 6-Lane Corridor Approved, Travel Time Halved',
      excerpt: 'Modern 138-km greenfield expressway to be built at a cost of ₹4,200 Cr. Sitapur to Lucknow commute now in just 45 minutes.',
      photoCaption: 'Lucknow-Sitapur Expressway Route & Industrial Corridor Plan',
      side1Tag: 'Space • ISRO',
      side1Title: 'Successful Unmanned Gaganyaan Touchdown, India Solidifies Space Dominance',
      side2Tag: 'Sitapur Focus',
      side2Title: 'Youth Step Forward to Rejuvenate Sarayan River, Remove 10 Tons of Waste',
      schemeTag: 'PM-KUSUM Scheme:',
      schemeText: '70% subsidy for farmers on solar agricultural pumps, online portal open.',
      schemeDept: 'Dept of Agriculture'
    },
    page2: {
      header: 'State Panorama (Uttar Pradesh)',
      leadTag: 'Ayodhya Spotlight',
      leadTitle: 'World-Class Ramayana Cultural Museum Fast-Tracked in Ayodhya: Traditions from 100 Nations',
      leadExcerpt: 'State-of-the-art complex spanning 10 acres along the Saryu riverfront featuring 3D holographic theatres and immersive heritage galleries.',
      col1Tag: 'Kanpur',
      col1Title: 'Ganga Barrage Riverfront Unveiled with New Modern Boating Club & Promenade',
      col1Excerpt: 'Kanpur Development Authority opens ₹45 Cr civic waterfront rejuvenation project.',
      col2Tag: 'Varanasi',
      col2Title: 'Kashi Vishwanath Corridor Sets Milestone with 150 Million Pilgrim Visits',
      col2Excerpt: 'Record turnout for historic evening Ganga Aarti bolsters regional hospitality economy.',
      bannerTag: 'Prayagraj Maha Kumbh 2025',
      bannerTitle: 'Preparations in Full Swing: 25,000 Tent Cities & Advanced Medical Hubs for 450 Million Pilgrims',
      footer: 'Swarnim Dastavej • Uttar Pradesh Edition'
    },
    page3: {
      header: 'Awadh Circuit (Lucknow & Sitapur Metropolitan)',
      leadTag: 'Lucknow Metro',
      leadTitle: 'Lucknow Metro Phase-2: DPR Approved for 11.8 km Charbagh-Vasant Kunj Route, 12 Stations Added',
      leadExcerpt: 'Key decongestion relief for Aminabad, Chowk, Thakurganj trade hubs and King George Medical University patients.',
      col1Tag: 'Sitapur Grain Market',
      col1Title: 'Record Arrivals for Wheat & Mustard, Farmers Receive ₹2,425/Quintal MSP',
      col2Tag: 'Naimisharanya Dham',
      col2Title: 'Final Clearance for ₹120 Cr Sacred Chakra Teerth Rejuvenation Project',
      bannerTag: 'Civic Grievance Resolution',
      bannerTitle: 'Emergency Culvert Repairs Begin on Sitapur-Laharpur Highway Following Resident Representations',
      footer: 'Sitapur & Lucknow District News Bureau'
    },
    page4: {
      header: 'Editorial & Opinion Forum (Op-Ed)',
      leadTag: 'Lead Editorial',
      leadTitle: 'Infrastructure Momentum & the Socio-Economic Transformation of Awadh',
      leadExcerpt: 'The upcoming access-controlled expressway network is more than asphalt; it bridges rural agrarian produce directly to national consumer markets.',
      col1Tag: 'Guest Column',
      col1Title: 'Citizen Journalism: The Living Pulse of Grassroots Democracy',
      col1Excerpt: 'When citizens document local civic issues with verified facts, governmental transparency transforms into active civic responsibility.',
      thoughtTag: 'Thought for the Day',
      thoughtQuote: '"Truth alone triumphs, never untruth; through truth the divine path is spread."',
      thoughtAuthor: '— Mundaka Upanishad',
      footer: 'Swarnim Dastavej Editorial Board'
    },
    page5: {
      header: 'Business & Sports Arena',
      col1Tag: 'Market Watch',
      col1Title: 'Sensex Hits Historic 85,000 Peak, Heavy Buying in Banking & Auto Blue-Chips',
      col2Tag: 'Cricket Special',
      col2Title: 'Border-Gavaskar Trophy: Team India Begins Intensive Training Camp at Green Park',
      rateTitle: 'Bullion & Commodity Benchmark Rates (Today):',
      gold: 'Gold (24K): ₹76,400',
      silver: 'Silver: ₹92,000',
      petrol: 'Petrol: ₹94.65/L',
      footer: 'Daily Commerce & Athletic Review'
    },
    page6: {
      header: 'Classifieds, Public Tenders & Weather Outlook',
      noticeTag: 'Public Notice',
      noticeTitle: 'Sitapur Municipal Council: Final Reminder for Property Tax & Water Cess Arrears',
      jobsTitle: 'Employment Opportunity:',
      jobsText: 'Swarnim Dastavej Digital Desk invites applications for Sub-Editors & Translators. Email CV.',
      weatherTitle: 'Regional Forecast:',
      weatherText: 'Lucknow & Sitapur: High 30°C, Low 22°C. Partly cloudy sky with pleasant evening breeze.',
      footer: 'Swarnim Dastavej Daily • Print & Digital Edition • Concluding Page'
    }
  },
  ur: {
    mastheadTitle: 'سورنم دستاویز',
    mastheadMotto: 'سچائی، غیر جانبداری اور عوامی مفاد | اودھ اور یوپی کا معتبر روزنامہ',
    dayName: 'اتوار',
    price: 'قیمت: ₹4.00',
    yearIssue: 'جلد 12 | شمارہ 245',
    editionSuffix: 'مرکزی ایڈیشن',
    pageLabel: 'صفحہ',
    zoomPrompt: 'بڑا کرنے کے لیے کلک کریں',
    fullPageRead: 'مکمل اسکرین پڑھیں',
    page1: {
      badge: 'اہم خبر • کابینہ فیصلہ',
      headline: 'یوپی میں شاہراہوں کی عظیم توسیع: لکھنؤ-سیتاپور-لکھیم پور 6 لین کوریڈور منظور، سفری وقت آدھا',
      excerpt: '4,200 کروڑ روپے کی لاگت سے 138 کلومیٹر طویل جدید گرین فیلڈ ایکسپریس وے تعمیر ہوگا۔ سیتاپور تا لکھنؤ اب صرف 45 منٹ۔',
      photoCaption: 'لکھنؤ-سیتاپور ایکسپریس وے روٹ اور انڈسٹریل کوریڈور منصوبہ',
      side1Tag: 'خلائی سائنس • اسرو',
      side1Title: 'گگن یان بغیر عملے والے مشن کی کامیاب لینڈنگ، خلا میں بھارت کا پرچم بلند',
      side2Tag: 'سیتاپور خاص',
      side2Title: 'سرایان ندی کی بحالی کے لیے نوجوانوں کا جذبہ، 10 ٹن کچرا صاف کیا',
      schemeTag: 'پی ایم کسم اسکیم:',
      schemeText: 'کسانوں کو سولر زرعی پمپوں پر 70% سبسیڈی، آن لائن درخواستیں جاری۔',
      schemeDept: 'محکمہ زراعت'
    },
    page2: {
      header: 'ریاستی احوال (اتر پردیش)',
      leadTag: 'ایودھیا خصوصی',
      leadTitle: 'ایودھیا میں بین الاقوامی رامائن کلچرل میوزیم کی تعمیر تیز: 100 ممالک کی روایات شامل',
      leadExcerpt: 'سریو کنارے 10 ایکڑ رقبے پر جدید ثقافتی مرکز، تھری ڈی ہولوگرام اور ورچوئل رئیلٹی تھیٹر کی تیز رفتار تعمیر۔',
      col1Tag: 'کانپور',
      col1Title: 'گنگا بیراج ریورفرنٹ پر جدید بوٹنگ کلب اور تفریحی مرکز کا شاندار افتتاح',
      col1Excerpt: 'کانپور ڈیولپمنٹ اتھارٹی نے 45 کروڑ کی لاگت سے تیار ریورفرنٹ عوام کے لیے کھول دیا۔',
      col2Tag: 'وارانسی',
      col2Title: 'کاشی وشوناتھ کوریڈور میں 15 کروڑ زائرین کی آمد کا تاریخی ریکارڈ قائم',
      col2Excerpt: 'گنگا آرتی کے مشاہدے کے لیے زائرین کا زبردست ہجوم، مقامی معیشت میں خوشحالی۔',
      bannerTag: 'پریاگ راج مہاکمبھ 2025',
      bannerTitle: '45 کروڑ زائرین کے استقبال کی تیاریاں: 25,000 خیمہ بستی اور ہنگامی طبی مراکز',
      footer: 'سورنم دستاویز • اتر پردیش ایڈیشن'
    },
    page3: {
      header: 'اودھ نامہ (لکھنؤ و سیتاپور ڈسٹرکٹ)',
      leadTag: 'لکھنؤ میٹرو',
      leadTitle: 'لکھنؤ میٹرو فیز 2: چارباغ تا وسنت کنج 11.8 کلومیٹر روٹ منظور، 12 نئے اسٹیشنز',
      leadExcerpt: 'امینہ آباد، چوک، ٹھاکر گنج اور میڈیکل کالج کے لاکھوں شہریوں کو ٹریفک جام سے نجات ملے گی۔',
      col1Tag: 'سیتاپور اناج منڈی',
      col1Title: 'گندم اور سرسوں کی ریکارڈ آمد، کسانوں کو مناسب قیمتیں فراہم',
      col2Tag: 'نیمشارنیا تیرتھ',
      col2Title: 'مقدس چکر تیرتھ کی تزئین و آرائش کے لیے 120 کروڑ کے منصوبے کی منظوری',
      bannerTag: 'عوامی مسائل اور حل',
      bannerTitle: 'سیتاپور-لہرپور روڈ پر خستہ حال پلیا کی فوری مرمت کا آغاز',
      footer: 'سیتاپور و لکھنؤ بیورو'
    },
    page4: {
      header: 'اداریہ اور مضامین (Editorial & Op-Ed)',
      leadTag: 'اداریہ',
      leadTitle: 'انفراسٹرکچر کی تیز رفتار پرواز اور اودھ خطے کی خوشحالی',
      leadExcerpt: 'نئی 6 لین ایکسپریس ویز نہ صرف فاصلے کم کریں گی بلکہ دیہی زراعت اور چھوٹی صنعتوں کو بڑی منڈیوں سے جوڑیں گی۔',
      col1Tag: 'خاص کالم',
      col1Title: 'شہری صحافت: جمہوریت کی سب سے بااثر اور حقیقی آواز',
      col1Excerpt: 'جب عام شہری شواہد کے ساتھ حقائق بیان کرتا ہے، تو انتظامی جوابدہی مضبوط ہوتی ہے۔',
      thoughtTag: 'آج کا سنہری قول',
      thoughtQuote: '"ہمیشہ سچائی کی فتح ہوتی ہے، جھوٹ کی کبھی نہیں."',
      thoughtAuthor: '— منڈک اپنشد',
      footer: 'ادارتی صفحہ'
    },
    page5: {
      header: 'تجارت اور کھیل کود (Business & Sports)',
      col1Tag: 'مارکیٹ رپورٹ',
      col1Title: 'سینसेक्स 85,000 کے تاریخی سنگ میل پر، بینکنگ و آٹو شیئرز میں نمایاں اضافہ',
      col2Tag: 'کرکٹ ورلڈ',
      col2Title: 'بارڈر-گواسکر ٹرافی: گرین پارک اسٹیڈیم میں قومی ٹیم کی بھرپور پریکٹس شروع',
      rateTitle: 'صرافہ اور روزمرہ ریٹس (آج کی قیمتیں):',
      gold: 'سونا (24K): ₹76,400',
      silver: 'چاندی: ₹92,000',
      petrol: 'پیٹرول: ₹94.65/L',
      footer: 'روزنامہ تجارت و کھیل'
    },
    page6: {
      header: 'کلاسیفائیڈ، اشتہارات اور موسم',
      noticeTag: 'عوامی اطلاع',
      noticeTitle: 'میونسپل کونسل: ہاؤس ٹیکس اور پانی کے واجبات جمع کرانے کا آخری موقع',
      jobsTitle: 'ملازمت کی خبر:',
      jobsText: 'سورنم دستاویز ڈیجیٹل ڈیسک کے لیے سب ایڈیٹرز اور مترجمین کی ضرورت ہے۔',
      weatherTitle: 'موسم کا حال:',
      weatherText: 'لکھنؤ و سیتاپور: زیادہ سے زیادہ 30°C، کم سے کم 22°C۔ مطلع جزوی ابر آلود رہے گا۔',
      footer: 'سورنم دستاویز روزنامہ • اختتامی صفحہ'
    }
  }
};

export default function TodayNewspaperReader() {
  const { 
    epaperEditions, 
    currentUser, 
    openAuthModal,
    language, 
    setLanguage, 
    t, 
    pricingPlans, 
    unlockEPaper, 
    isEPaperUnlocked 
  } = useApp();

  // Helper to match city across Hindi, English and Urdu naming
  const matchCity = (edCity?: string, selCity?: string) => {
    if (!edCity || !selCity || selCity === 'सभी') return true;
    const c1 = edCity.toLowerCase().trim();
    const c2 = selCity.toLowerCase().trim();
    if (c1 === c2 || c1.includes(c2) || c2.includes(c1)) return true;
    if ((c1.includes('lucknow') || c1.includes('लखनऊ') || c1.includes('لکھنؤ')) && 
        (c2.includes('lucknow') || c2.includes('लखनऊ') || c2.includes('لکھنؤ'))) return true;
    if ((c1.includes('sitapur') || c1.includes('सीतापुर') || c1.includes('سیتاپور')) && 
        (c2.includes('sitapur') || c2.includes('सीतापुर') || c2.includes('سیتاپور'))) return true;
    if ((c1.includes('delhi') || c1.includes('दिल्ली') || c1.includes('دہلی')) && 
        (c2.includes('delhi') || c2.includes('दिल्ली') || c2.includes('دہلی'))) return true;
    return false;
  };

  // State for date & edition selection (defaults to latest available edition)
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-30');
  const [selectedCity, setSelectedCity] = useState<string>('लखनऊ');
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [pdfPageCount, setPdfPageCount] = useState(0);

  // Automatically sync to latest uploaded edition's date whenever editions load
  useEffect(() => {
    if (epaperEditions && epaperEditions.length > 0) {
      const activeList = epaperEditions.filter(e => e.isActive !== false);
      const sorted = [...activeList].sort((a, b) => b.date.localeCompare(a.date));
      if (sorted.length > 0) {
        const hasCurrent = sorted.some(e => e.date === selectedDate);
        if (!hasCurrent) {
          setSelectedDate(sorted[0].date);
        }
      }
    }
  }, [epaperEditions, selectedDate]);
  
  // Unlock & Payment State
  const [selectedPlanForUnlock, setSelectedPlanForUnlock] = useState<EPaperPricingPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  
  // Flip animation & sound state
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Full Page Lightbox Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalZoom, setModalZoom] = useState<number>(100);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [imprint, setImprint] = useState({
    registrationNo: 'UPHIN/26/A7984',
    editorInChief: 'रामेश्वर दयाल'
  });

  const content = NEWSPAPER_CONTENT[language as 'hi' | 'en' | 'ur'] || NEWSPAPER_CONTENT.hi;

  const localizedCity = 
    language === 'en' 
      ? (selectedCity === 'लखनऊ' || selectedCity === 'Lucknow' ? 'Lucknow' : selectedCity === 'सीतापुर' || selectedCity === 'Sitapur' ? 'Sitapur' : selectedCity)
      : language === 'ur'
      ? (selectedCity === 'لکھنؤ' || selectedCity === 'लखनऊ' || selectedCity === 'Lucknow' ? 'لکھنؤ' : selectedCity === 'سیتاپور' || selectedCity === 'सीतापुर' || selectedCity === 'Sitapur' ? 'سیتاپور' : selectedCity)
      : (selectedCity === 'Lucknow' || selectedCity === 'لکھنؤ' ? 'लखनऊ' : selectedCity === 'Sitapur' || selectedCity === 'سیتاپور' ? 'सीतापुर' : selectedCity);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setImprint({
            registrationNo: d.data.registrationNo || 'UPHIN/26/A7984',
            editorInChief: d.data.editorInChief || 'रामेश्वर दयाल'
          });
        }
      })
      .catch(() => {});
  }, []);

  const publishedEditions = epaperEditions.filter((edition) => edition.isActive !== false);
  const langEditions = publishedEditions.filter(e => (e.language || 'hi') === language);
  const candidatePool = langEditions.length > 0 ? langEditions : publishedEditions;

  const currentEdition: EPaperEdition | undefined =
    candidatePool.find(e => e.date === selectedDate && matchCity(e.editionCity, selectedCity)) ||
    candidatePool.find(e => e.date === selectedDate) ||
    publishedEditions.find(e => e.date === selectedDate) ||
    candidatePool[0] ||
    publishedEditions[0];

  const currentPage: EPaperPage = currentEdition?.pages?.[activePageIndex] || {
    pageNumber: activePageIndex + 1,
    title: `${content.pageLabel} ${activePageIndex + 1}`,
    imageUrl: ''
  };

  // Resolve active PDF URL for uploaded editions
  const activePdfUrl: string | undefined =
    currentPage?.pdfUrl ||
    (currentPage as any)?.pdfPageUrl ||
    currentEdition?.pdfUrl ||
    (currentEdition as any)?.pdfPageUrl ||
    currentEdition?.pages?.find(p => p.pdfUrl || (p as any)?.pdfPageUrl)?.pdfUrl ||
    (currentEdition?.pages?.find(p => (p as any)?.pdfPageUrl) as any)?.pdfPageUrl;

  const totalPages = activePdfUrl && pdfPageCount > 0
    ? pdfPageCount
    : (currentEdition?.pages?.length || 6);

  const isCurrentEditionUnlocked = isEPaperUnlocked(currentEdition?.id, selectedDate);
  const isPageLocked = !isCurrentEditionUnlocked;

  const handleOpenCheckout = (plan?: EPaperPricingPlan) => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    const chosen = plan || pricingPlans.find(p => p.price === 1) || pricingPlans[0];
    setSelectedPlanForUnlock(chosen);
    setIsCheckoutOpen(true);
    setPaymentDone(false);
  };

  const handleExecuteUnlock = (plan: EPaperPricingPlan) => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const unlockKey = plan.duration === 'single_edition'
        ? [selectedDate, currentEdition?.id || ''].filter(Boolean)
        : 'all';
      unlockEPaper(unlockKey, plan.title);
      setIsProcessingPayment(false);
      setPaymentDone(true);
      setTimeout(() => {
        setIsCheckoutOpen(false);
        setPaymentDone(false);
      }, 1000);
    }, 700);
  };

  // Turn page with 3D animation & sound
  const handlePageChange = (newIndex: number, direction: 'next' | 'prev') => {
    if (newIndex < 0 || newIndex >= totalPages || isFlipping) return;

    if (soundEnabled) {
      playPageTurnSound();
    }

    setFlipDirection(direction);
    setIsFlipping(true);

    setTimeout(() => {
      setActivePageIndex(newIndex);
      setIsFlipping(false);
    }, 320);
  };

  const handleNextPage = () => {
    if (activePageIndex < totalPages - 1) {
      handlePageChange(activePageIndex + 1, 'next');
    }
  };

  const handlePrevPage = () => {
    if (activePageIndex > 0) {
      handlePageChange(activePageIndex - 1, 'prev');
    }
  };

  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
    didSwipe.current = false;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 48) return;
    didSwipe.current = true;
    if (delta < 0) handleNextPage();
    else handlePrevPage();
  };

  useEffect(() => {
    setPdfPageCount(0);
  }, [activePdfUrl]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) {
        if (e.key === 'Escape') setIsModalOpen(false);
        if (e.key === 'ArrowRight') handleNextPage();
        if (e.key === 'ArrowLeft') handlePrevPage();
      } else {
        if (e.key === 'ArrowRight') handleNextPage();
        if (e.key === 'ArrowLeft') handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePageIndex, totalPages, isModalOpen, isFlipping]);

  const handleShare = () => {
    const shareUrl = window.location.origin + `/epaper?date=${selectedDate}&page=${activePageIndex + 1}`;
    if (navigator.share) {
      navigator.share({
        title: `${content.mastheadTitle} (${selectedDate} - ${content.pageLabel} ${activePageIndex + 1})`,
        text: `${content.mastheadMotto}`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!currentEdition) {
    return (
      <section className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-sm text-slate-600 dark:text-slate-300">
        {language === 'en' ? "Today's newspaper is not available yet." : language === 'ur' ? 'آج کا اخبار ابھی دستیاب نہیں ہے۔' : 'आज का अखबार अभी उपलब्ध नहीं है।'}
      </section>
    );
  }

  return (
    <section className="w-full space-y-4">
      
      {/* 1. EPAPER TOP CONTROLS & DATE SELECTOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
          
          {/* Left: Date picker & Edition */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 px-2.5 py-1.5 rounded-xl font-bold text-slate-900 dark:text-slate-100">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="hidden sm:inline">{t('epaper_date')}:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setActivePageIndex(0);
                }}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-1.5 py-0.5 text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:ring-1 focus:ring-amber-500 font-mono font-bold"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setActivePageIndex(0);
                }}
                className="bg-transparent font-bold text-slate-800 dark:text-slate-200 text-xs outline-none cursor-pointer"
              >
                <option value="लखनऊ" className="dark:bg-slate-900">{language === 'en' ? 'Lucknow Main Edition' : language === 'ur' ? 'لکھنؤ مرکزی ایڈیشن' : 'लखनऊ मुख्य संस्करण'}</option>
                <option value="सीतापुर" className="dark:bg-slate-900">{language === 'en' ? 'Sitapur District Edition' : language === 'ur' ? 'سیتاپور ضلعی ایڈیشن' : 'सीतापुर जिला संस्करण'}</option>
                <option value="दिल्ली" className="dark:bg-slate-900">{language === 'en' ? 'Delhi-NCR' : language === 'ur' ? 'دہلی این سی آر' : 'दिल्ली-एनसीआर'}</option>
              </select>
            </div>
          </div>

          {/* Right: Sound Icon Only, Page Navigation & Fullscreen */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto">
            
            {/* Page Flip Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                soundEnabled 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-400'
              }`}
              title={soundEnabled ? 'Mute' : 'Unmute'}
              aria-label="Sound Toggle"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Page Navigation Controls */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={handlePrevPage}
                disabled={activePageIndex === 0 || isFlipping}
                className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 shadow-xs font-bold text-slate-800 dark:text-slate-100 disabled:opacity-30 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{t('epaper_prev')}</span>
              </button>

              <span className="px-2 sm:px-3 font-mono font-extrabold text-amber-700 dark:text-amber-400 text-xs">
                {activePageIndex + 1} / {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={activePageIndex === totalPages - 1 || isFlipping}
                className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg bg-red-700 hover:bg-red-800 text-white shadow-xs font-bold disabled:opacity-30 transition cursor-pointer"
              >
                <span className="hidden sm:inline">{t('epaper_next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Full Page Lightbox Trigger */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-amber-300 font-bold px-3 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
              title={t('epaper_full_page')}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t('epaper_full_page')}</span>
            </button>

            {/* Direct PDF Link if uploaded */}
            {activePdfUrl && isCurrentEditionUnlocked ? (
              <a
                href={activePdfUrl}
                download={`swarnim-dastavej-${selectedDate}.pdf`}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1.5 rounded-xl shadow-xs text-xs transition"
                title="इस तारीख का अखबार डाउनलोड करें"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PDF</span>
              </a>
            ) : activePdfUrl ? (
              <button
                type="button"
                onClick={() => handleOpenCheckout()}
                className="flex items-center gap-1.5 bg-slate-200 text-slate-600 font-black px-3 py-1.5 rounded-xl shadow-xs text-xs"
                title="इस तारीख का अखबार खरीदने के बाद डाउनलोड होगा"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            ) : null}

          </div>

        </div>
      </div>

      {/* 2. THE NEWSPAPER BROADSHEET CANVAS (LIGHT DESK BACKGROUND) */}
      <div className="relative mx-auto flex items-center justify-center py-6 sm:py-8 px-10 sm:px-16 rounded-2xl bg-[#f0f4f8] dark:bg-slate-900/60 shadow-inner border border-slate-200/80 dark:border-slate-800 my-2 overflow-hidden max-w-full">
        {/* Left Arrow Trigger */}
        {activePageIndex > 0 ? (
          <button
            onClick={handlePrevPage}
            className="absolute left-1.5 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-13 sm:h-13 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-lg border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-red-700 hover:text-white hover:border-red-600 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group"
            aria-label="Previous Page"
            title="Previous Page"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5] group-hover:scale-110 transition-transform" />
          </button>
        ) : (
          <div 
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-slate-200/50 dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700 flex items-center justify-center opacity-40 cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2] text-slate-400" />
          </div>
        )}

        {/* Right Arrow Trigger */}
        {activePageIndex < totalPages - 1 ? (
          <button
            onClick={handleNextPage}
            className="absolute right-1.5 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-13 sm:h-13 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-lg border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-red-700 hover:text-white hover:border-red-600 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group"
            aria-label="Next Page"
            title="Next Page"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5] group-hover:scale-110 transition-transform" />
          </button>
        ) : (
          <div 
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-slate-200/50 dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700 flex items-center justify-center opacity-40 cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6 stroke-[2] text-slate-400" />
          </div>
        )}

        {/* NEWSPAPER PAGE (Broadsheet Ratio 1:1.414) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => {
            if (didSwipe.current) {
              didSwipe.current = false;
              return;
            }
            if (isPageLocked) handleOpenCheckout();
            else setIsModalOpen(true);
          }}
          className={`cursor-pointer touch-pan-y bg-[#fbf9f4] text-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-sm shadow-2xl overflow-hidden transition-all duration-300 group hover:shadow-red-500/20 w-full max-w-[min(100%,520px)] aspect-[1/1.414] max-h-[76vh] relative flex flex-col justify-between ${
            isFlipping 
              ? flipDirection === 'next' 
                ? 'scale-[0.98] rotate-y-6 opacity-80' 
                : 'scale-[0.98] -rotate-y-6 opacity-80' 
              : 'scale-100 rotate-0 opacity-100'
          }`}
          style={{
            perspective: '1200px',
            transformOrigin: flipDirection === 'next' ? 'left center' : 'right center'
          }}
        >
          {/* Paper Grain Overlay & Spine Crease */}
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/10 via-black/3 to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/10 via-black/3 to-transparent pointer-events-none z-10"></div>

          {/* Click to Zoom Hover Badge or Lock Indicator */}
          {isPageLocked ? (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleOpenCheckout();
              }}
              className="absolute top-3 right-3 z-30 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 shadow-lg border border-amber-300 animate-pulse"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Locked • Unlock at ₹1' : '🔒 लॉक है • ₹1 में खोलें'}</span>
            </div>
          ) : (
            <div className="absolute top-3 right-3 z-20 bg-slate-950/85 text-amber-300 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:bg-red-700 group-hover:text-white transition shadow-md">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{content.fullPageRead}</span>
            </div>
          )}

          {/* PAYWALL OVERLAY WHEN PAGE IS LOCKED (Page 2 onwards) */}
          {isPageLocked && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleOpenCheckout();
              }}
              className="absolute inset-0 z-30 bg-slate-950/45 flex flex-col justify-between p-4 sm:p-5 text-white text-center select-none"
            >
              {/* Top Banner */}
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{!currentUser ? (language === 'en' ? 'Login to read' : 'पढ़ने के लिए लॉगिन करें') : (language === 'en' ? 'This date is locked' : 'यह तारीख का अखबार लॉक है')}</span>
                </span>
              </div>

              {/* Center Pitch & Callout */}
              <div className="space-y-2.5 max-w-sm mx-auto my-auto py-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg border-2 border-white/20">
                  <Lock className="w-6 h-6 stroke-[2.5]" />
                </div>
                
                <h3 className="text-base sm:text-lg font-black text-amber-300 font-serif leading-tight">
                  {!currentUser
                    ? (language === 'en' ? 'Login first, then buy this paper' : 'पहले लॉगिन करें, फिर यह अखबार खरीदें')
                    : (language === 'en' ? 'Buy this date’s paper to read it' : 'पढ़ने के लिए इस तारीख का अखबार खरीदें')}
                </h3>
                
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {!currentUser
                    ? (language === 'en'
                      ? 'The paper stays hidden until you log in. After login you can pay for this date and read it.'
                      : 'लॉगिन से पहले अखबार नहीं खुलता। लॉगिन के बाद इस तारीख का भुगतान करके पूरा पढ़ सकते हैं।')
                    : (language === 'en'
                      ? 'Without payment the paper stays blurred. Buy this date to read and download it.'
                      : 'भुगतान के बिना अखबार धुंधला रहता है। इस तारीख को खरीदने पर पूरा पढ़ और डाउनलोड कर सकते हैं।')}
                </p>

                {/* Quick Plan Pills */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-left">
                  {pricingPlans.slice(0, 3).map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCheckout(plan);
                      }}
                      className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                        plan.isPopular || plan.price === 1
                          ? 'bg-amber-500/20 border-amber-400 text-white hover:bg-amber-500/30 ring-1 ring-amber-400/40'
                          : 'bg-white/10 border-white/20 text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-[10px] text-amber-300 font-bold truncate">
                        {plan.duration === 'single_edition' ? '1 दिन' : plan.duration === 'yearly' ? '1 वर्ष' : '1 माह'}
                      </div>
                      <div className="text-sm font-black text-white">₹{plan.price}</div>
                    </button>
                  ))}
                </div>

                {/* Primary Unlock Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCheckout(pricingPlans.find(p => p.price === 1) || pricingPlans[0]);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{!currentUser ? (language === 'en' ? 'Login to continue' : 'जारी रखने के लिए लॉगिन करें') : (language === 'en' ? 'Unlock Today at ₹1 Only' : 'मात्र ₹1 में आज का पूरा अंक अनलॉक करें')}</span>
                </button>
              </div>

              {/* Bottom Assurance */}
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'en' ? 'Instant Access • Safe & Secure Payment' : 'तत्काल सक्रियता • 100% सुरक्षित भुगतान'}</span>
              </div>
            </div>
          )}

          {/* AUTHENTIC BROADSHEET NEWSPAPER PAGE CONTENT OR EMBEDDED PDF */}
          {activePdfUrl ? (
            <div className="flex-1 w-full min-h-0 relative overflow-hidden bg-white">
              <div className={isPageLocked ? 'w-full h-full blur-md pointer-events-none select-none' : 'w-full h-full'}>
                <PdfSinglePage
                  url={activePdfUrl}
                  pageNumber={activePageIndex + 1}
                  onPageCount={setPdfPageCount}
                />
              </div>
              {!isPageLocked && (
                <div 
                  onClick={() => setIsModalOpen(true)}
                  className="absolute bottom-2 right-2 bg-slate-950/80 hover:bg-red-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs shadow-md cursor-pointer flex items-center gap-1 transition z-20"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{content.fullPageRead}</span>
                </div>
              )}
            </div>
          ) : (
            <div className={`p-3 sm:p-4 flex-1 flex flex-col justify-between overflow-hidden select-none bg-[#fbf9f4] ${isPageLocked ? 'filter blur-[7px] pointer-events-none' : ''}`}>
            
            {/* PAGE 1: FRONT PAGE */}
            {activePageIndex === 0 && (
              <div className="flex-1 flex flex-col justify-between space-y-2 text-slate-950">
                <div className="border-b border-slate-800 pb-1 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-slate-700">
                  <span>RNI No. {imprint.registrationNo}</span>
                  <span className="font-bold">{content.yearIssue}</span>
                  <span>{content.price}</span>
                </div>

                <div className="text-center py-1 border-b-2 border-slate-900">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif tracking-tight text-slate-950">
                    {content.mastheadTitle}
                  </h2>
                  <p className="text-[9px] sm:text-[10px] text-slate-600 font-semibold tracking-wider">
                    {content.mastheadMotto}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-[9px] sm:text-[10px] font-bold border-t border-slate-800 pt-0.5 text-slate-800">
                    <span>{content.dayName}, {selectedDate}</span>
                    <span className="bg-red-700 text-white px-1.5 py-0.2 rounded font-sans">{localizedCity} {content.editionSuffix}</span>
                    <span>{content.pageLabel}: 1/6</span>
                  </div>
                </div>

                <div className="bg-amber-50/60 p-2 rounded border border-amber-200">
                  <span className="bg-red-700 text-white font-extrabold text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded uppercase">
                    {content.page1.badge}
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-black font-serif leading-tight mt-1 text-slate-950">
                    {content.page1.headline}
                  </h3>
                  <p className="text-[10px] text-slate-700 mt-1 line-clamp-2 leading-relaxed">
                    {content.page1.excerpt}
                  </p>
                </div>

                <div className="grid grid-cols-12 gap-2 flex-1 items-start">
                  <div className="col-span-7 space-y-1">
                    <div className="relative aspect-[16/10] w-full rounded overflow-hidden bg-slate-900 border border-slate-300">
                      <img
                        src="https://images.unsplash.com/photo-1545158826-6a3196c80251?w=800&auto=format&fit=crop&q=80"
                        alt="Highways"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[8px] text-slate-500 italic">
                      {content.page1.photoCaption}
                    </p>
                  </div>

                  <div className="col-span-5 space-y-1.5 divide-y divide-slate-200 text-slate-900">
                    <div className="pt-0.5">
                      <span className="text-[8px] font-bold text-red-700 uppercase">{content.page1.side1Tag}</span>
                      <h4 className="text-[10px] font-bold font-serif leading-tight mt-0.5">
                        {content.page1.side1Title}
                      </h4>
                    </div>
                    <div className="pt-1.5">
                      <span className="text-[8px] font-bold text-emerald-800 uppercase">{content.page1.side2Tag}</span>
                      <h4 className="text-[10px] font-bold font-serif leading-tight mt-0.5">
                        {content.page1.side2Title}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="bg-red-700 text-white p-1.5 rounded flex items-center justify-between text-[9px] font-bold">
                  <span className="font-extrabold">{content.page1.schemeTag}</span>
                  <span className="truncate mx-2">{content.page1.schemeText}</span>
                  <span className="bg-white text-red-700 px-1 py-0.2 rounded text-[8px] shrink-0">{content.page1.schemeDept}</span>
                </div>
              </div>
            )}

            {/* PAGE 2: STATE NEWS */}
            {activePageIndex === 1 && (
              <div className="flex-1 flex flex-col justify-between space-y-2 text-slate-950">
                <div className="border-b-2 border-slate-900 pb-1 flex items-center justify-between text-[10px] font-bold">
                  <span>{content.mastheadTitle}</span>
                  <span className="text-red-700 uppercase font-black">{content.page2.header}</span>
                  <span>{content.pageLabel}: 2/6</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-red-700 font-bold text-[8px]">{content.page2.leadTag}</span>
                    <h3 className="text-xs sm:text-sm font-bold font-serif mt-0.5">
                      {content.page2.leadTitle}
                    </h3>
                    <p className="text-[10px] text-slate-600 mt-1 line-clamp-2">
                      {content.page2.leadExcerpt}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <span className="font-bold text-amber-700">{content.page2.col1Tag}</span>
                      <h4 className="font-serif font-bold text-[10px] mt-0.5">{content.page2.col1Title}</h4>
                      <p className="text-slate-600 text-[8px] mt-0.5">{content.page2.col1Excerpt}</p>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <span className="font-bold text-blue-700">{content.page2.col2Tag}</span>
                      <h4 className="font-serif font-bold text-[10px] mt-0.5">{content.page2.col2Title}</h4>
                      <p className="text-slate-600 text-[8px] mt-0.5">{content.page2.col2Excerpt}</p>
                    </div>
                  </div>

                  <div className="p-1.5 bg-amber-50/80 rounded border border-amber-300 text-[9px]">
                    <span className="font-bold text-red-800">{content.page2.bannerTag}: </span>
                    <span>{content.page2.bannerTitle}</span>
                  </div>
                </div>

                <div className="border-t border-slate-300 pt-1 text-[9px] text-slate-500 text-center">
                  {content.page2.footer}
                </div>
              </div>
            )}

            {/* PAGE 3: AWADH DISTRICT ROUNDUP */}
            {activePageIndex === 2 && (
              <div className="flex-1 flex flex-col justify-between space-y-2 text-slate-950">
                <div className="border-b-2 border-slate-900 pb-1 flex items-center justify-between text-[10px] font-bold">
                  <span>{content.mastheadTitle}</span>
                  <span className="text-red-700 uppercase font-black">{content.page3.header}</span>
                  <span>{content.pageLabel}: 3/6</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-red-700 font-bold text-[8px]">{content.page3.leadTag}</span>
                    <h3 className="text-xs sm:text-sm font-bold font-serif mt-0.5">
                      {content.page3.leadTitle}
                    </h3>
                    <p className="text-[10px] text-slate-600 mt-1 line-clamp-2">
                      {content.page3.leadExcerpt}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <span className="font-bold text-amber-700">{content.page3.col1Tag}</span>
                      <h4 className="font-serif font-bold text-[10px] mt-0.5">{content.page3.col1Title}</h4>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <span className="font-bold text-emerald-700">{content.page3.col2Tag}</span>
                      <h4 className="font-serif font-bold text-[10px] mt-0.5">{content.page3.col2Title}</h4>
                    </div>
                  </div>

                  <div className="p-1.5 bg-slate-100 rounded border border-slate-300 text-[9px]">
                    <span className="font-bold text-slate-800">{content.page3.bannerTag}: </span>
                    <span>{content.page3.bannerTitle}</span>
                  </div>
                </div>

                <div className="border-t border-slate-300 pt-1 text-[9px] text-slate-500 text-center">
                  {content.page3.footer}
                </div>
              </div>
            )}

            {/* PAGE 4: EDITORIAL & OP-ED */}
            {activePageIndex === 3 && (
              <div className="flex-1 flex flex-col justify-between space-y-2 text-slate-950">
                <div className="border-b-2 border-slate-900 pb-1 flex items-center justify-between text-[10px] font-bold">
                  <span>{content.mastheadTitle}</span>
                  <span className="text-red-700 uppercase font-black">{content.page4.header}</span>
                  <span>{content.pageLabel}: 4/6</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="p-2 bg-amber-50/40 rounded border border-amber-200">
                    <span className="text-red-700 font-bold text-[8px]">{content.page4.leadTag}</span>
                    <h3 className="text-xs sm:text-sm font-bold font-serif mt-0.5">
                      {content.page4.leadTitle}
                    </h3>
                    <p className="text-[9px] text-slate-700 mt-1 line-clamp-3 leading-relaxed">
                      {content.page4.leadExcerpt}
                    </p>
                  </div>

                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-800 font-bold text-[8px]">{content.page4.col1Tag}</span>
                    <h4 className="font-bold font-serif text-[10px] mt-0.5">{content.page4.col1Title}</h4>
                    <p className="text-slate-600 text-[8px] mt-0.5 line-clamp-2">{content.page4.col1Excerpt}</p>
                  </div>

                  <div className="p-1.5 bg-slate-50 rounded border border-slate-200 text-center">
                    <span className="text-[8px] font-bold text-amber-700">{content.page4.thoughtTag}</span>
                    <blockquote className="text-[9px] italic text-slate-800 font-serif mt-0.5">
                      {content.page4.thoughtQuote}
                    </blockquote>
                    <p className="text-[8px] text-slate-500">{content.page4.thoughtAuthor}</p>
                  </div>
                </div>

                <div className="border-t border-slate-300 pt-1 text-[9px] text-slate-500 text-center">
                  {content.page4.footer}
                </div>
              </div>
            )}

            {/* PAGE 5: BUSINESS & SPORTS */}
            {activePageIndex === 4 && (
              <div className="flex-1 flex flex-col justify-between space-y-2 text-slate-950">
                <div className="border-b-2 border-slate-900 pb-1 flex items-center justify-between text-[10px] font-bold">
                  <span>{content.mastheadTitle}</span>
                  <span className="text-emerald-800 uppercase font-black">{content.page5.header}</span>
                  <span>{content.pageLabel}: 5/6</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-emerald-50/50 rounded border border-emerald-200">
                      <span className="text-emerald-700 font-bold text-[8px]">{content.page5.col1Tag}</span>
                      <h4 className="text-[11px] font-bold font-serif mt-0.5">
                        {content.page5.col1Title}
                      </h4>
                    </div>

                    <div className="p-2 bg-blue-50/50 rounded border border-blue-200">
                      <span className="text-blue-700 font-bold text-[8px]">{content.page5.col2Tag}</span>
                      <h4 className="text-[11px] font-bold font-serif mt-0.5">
                        {content.page5.col2Title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="font-bold text-[9px] text-slate-700">{content.page5.rateTitle}</span>
                    <div className="grid grid-cols-3 gap-1 mt-1 text-[9px] font-bold text-center">
                      <div className="bg-white p-1 rounded border">{content.page5.gold}</div>
                      <div className="bg-white p-1 rounded border">{content.page5.silver}</div>
                      <div className="bg-white p-1 rounded border">{content.page5.petrol}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-300 pt-1 text-[9px] text-slate-500 text-center">
                  {content.page5.footer}
                </div>
              </div>
            )}

            {/* PAGE 6: CLASSIFIEDS & NOTICES */}
            {activePageIndex === 5 && (
              <div className="flex-1 flex flex-col justify-between space-y-2 text-slate-950">
                <div className="border-b-2 border-slate-900 pb-1 flex items-center justify-between text-[10px] font-bold">
                  <span>{content.mastheadTitle}</span>
                  <span className="text-slate-700 uppercase font-black">{content.page6.header}</span>
                  <span>{content.pageLabel}: 6/6</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="p-2 bg-amber-50/70 rounded border border-amber-300">
                    <span className="text-red-700 font-bold text-[8px]">{content.page6.noticeTag}</span>
                    <h4 className="text-[10px] font-bold font-serif mt-0.5">
                      {content.page6.noticeTitle}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="font-bold text-slate-800">{content.page6.jobsTitle}</span>
                      <p className="text-slate-600 mt-0.5">
                        {content.page6.jobsText}
                      </p>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="font-bold text-slate-800">{content.page6.weatherTitle}</span>
                      <p className="text-slate-600 mt-0.5">
                        {content.page6.weatherText}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-slate-900 pt-1 text-[9px] text-slate-600 text-center font-bold">
                  {content.page6.footer}
                </div>
              </div>
            )}

          </div>
          )}

          {/* Bottom Bar on Canvas */}
          <div className="bg-slate-950 text-white px-3 py-1 flex items-center justify-between text-[10px]">
            <span className="font-bold text-amber-300">
              {content.pageLabel} {currentPage.pageNumber} / {totalPages}
            </span>
            <span className="text-slate-400">
              {content.zoomPrompt}
            </span>
          </div>

        </div>

      </div>

      {/* 3. FULL PAGE LIGHTBOX / ZOOM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          
          {/* Modal Top Toolbar */}
          <div className="bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
            
            {/* Title & Page info */}
            <div className="flex items-center gap-3">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                {content.pageLabel} {activePageIndex + 1} / {totalPages}
              </span>
              <h3 className="font-bold text-sm sm:text-base font-serif hidden sm:inline text-slate-100">
                {currentEdition.editionTitle} - {selectedDate}
              </h3>
            </div>

            {/* Middle Zoom controls */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1">
              <button
                onClick={() => setModalZoom(prev => Math.max(prev - 25, 75))}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-mono font-bold text-amber-400">
                {modalZoom}%
              </span>
              <button
                onClick={() => setModalZoom(prev => Math.min(prev + 25, 250))}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setModalZoom(100)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right actions & close */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-300 cursor-pointer"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Modal Main Viewport */}
          <div
            className="flex-1 overflow-auto p-4 flex items-center justify-center relative select-none touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            
            {/* Modal Prev Arrow */}
            {activePageIndex > 0 && (
              <button
                onClick={handlePrevPage}
                className="fixed left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/90 text-white flex items-center justify-center hover:bg-red-600 transition shadow-2xl border border-slate-700 cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Modal Next Arrow */}
            {activePageIndex < totalPages - 1 && (
              <button
                onClick={handleNextPage}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/90 text-white flex items-center justify-center hover:bg-red-600 transition shadow-2xl border border-slate-700 cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}

            {/* The Zoomed Scaled Newspaper Page OR Fullscreen PDF */}
            {activePdfUrl ? (
              <div
                style={{ width: `${modalZoom}%`, maxWidth: modalZoom > 100 ? 'none' : '980px', height: '86vh' }}
                className="transition-all duration-200 bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-700 relative"
              >
                {/* Paywall Overlay inside Fullscreen Modal if locked */}
                <div className={isPageLocked ? 'absolute inset-0 blur-md pointer-events-none' : 'absolute inset-0'}>
                  <PdfSinglePage url={activePdfUrl} pageNumber={activePageIndex + 1} />
                </div>
                {isPageLocked && (
                  <div className="absolute inset-0 z-30 bg-slate-950/45 flex flex-col items-center justify-center p-6 text-white text-center">
                    <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-amber-400/60 shadow-2xl space-y-4">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-bold shadow-lg">
                        <Lock className="w-7 h-7 stroke-[2.5]" />
                      </div>
                      <h3 className="text-lg font-black text-amber-300">
                        {language === 'en' ? 'Buy this date to read the paper' : 'इस तारीख का अखबार खरीदें'}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {language === 'en'
                          ? 'Full screen reading is available after unlocking today\'s edition starting at just ₹1.'
                          : 'फुल स्क्रीन वाचन हेतु मात्र ₹1 में आज का पूरा अखबार अनलॉक करें या ₹340 वार्षिक प्लान चुनें।'}
                      </p>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false);
                            handleOpenCheckout();
                          }}
                          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg hover:from-amber-400 hover:to-amber-500 transition cursor-pointer"
                        >
                          {language === 'en' ? 'Unlock Now (Starting ₹1)' : 'मात्र ₹1 में अभी अनलॉक करें'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
            <div
              style={{ width: `${modalZoom}%`, maxWidth: modalZoom > 100 ? 'none' : '820px' }}
              className="transition-all duration-200 bg-[#fbf9f4] text-slate-950 rounded-sm shadow-2xl overflow-hidden p-6 sm:p-10 border border-slate-400 aspect-[1/1.414] relative"
            >
              {/* Paywall Overlay inside Fullscreen Modal if locked */}
              {isPageLocked && (
                <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center">
                  <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-amber-400/60 shadow-2xl space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-bold shadow-lg">
                      <Lock className="w-7 h-7 stroke-[2.5]" />
                    </div>
                    <h3 className="text-lg font-black text-amber-300">
                      {language === 'en' ? 'Buy this date to read the paper' : 'इस तारीख का अखबार खरीदें'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {language === 'en'
                        ? 'Full screen reading is available after unlocking today\'s edition starting at just ₹1.'
                        : 'फुल स्क्रीन वाचन हेतु मात्र ₹1 में आज का पूरा अखबार अनलॉक करें या ₹340 वार्षिक प्लान चुनें।'}
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          handleOpenCheckout();
                        }}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg hover:from-amber-400 hover:to-amber-500 transition cursor-pointer"
                      >
                        {language === 'en' ? 'Unlock Now (Starting ₹1)' : 'मात्र ₹1 में अभी अनलॉक करें'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* High-res modal contents */}
              <div className="border-b-2 border-slate-900 pb-2 mb-4 flex items-center justify-between text-xs font-bold font-mono">
                <span>{content.mastheadTitle}</span>
                <span className="text-red-700 font-sans font-black">{localizedCity} {content.editionSuffix} • {selectedDate}</span>
                <span>{content.pageLabel} {activePageIndex + 1}</span>
              </div>

              {activePageIndex === 0 && (
                <div className="space-y-4">
                  <div className="text-center py-2 border-b-2 border-slate-900">
                    <h1 className="text-4xl sm:text-5xl font-black font-serif text-slate-950">
                      {content.mastheadTitle}
                    </h1>
                    <p className="text-xs text-slate-600 font-semibold tracking-wider mt-1">
                      {content.mastheadMotto}
                    </p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded border border-amber-300">
                    <span className="bg-red-700 text-white font-extrabold text-xs px-2 py-0.5 rounded">
                      {content.page1.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black font-serif mt-2 leading-tight">
                      {content.page1.headline}
                    </h2>
                    <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                      {content.page1.excerpt}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white border rounded">
                      <span className="text-red-700 font-bold text-xs">{content.page1.side1Tag}</span>
                      <h3 className="text-base font-bold font-serif mt-1">
                        {content.page1.side1Title}
                      </h3>
                    </div>
                    <div className="p-3 bg-white border rounded">
                      <span className="text-emerald-700 font-bold text-xs">{content.page1.side2Tag}</span>
                      <h3 className="text-base font-bold font-serif mt-1">
                        {content.page1.side2Title}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {activePageIndex === 1 && (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded border">
                    <span className="text-red-700 font-bold text-xs">{content.page2.leadTag}</span>
                    <h2 className="text-2xl font-black font-serif text-slate-900 mt-1">
                      {content.page2.leadTitle}
                    </h2>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {content.page2.leadExcerpt}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded border space-y-3">
                    <h3 className="text-lg font-bold font-serif">{content.page2.header}</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                      <div>
                        <strong>{content.page2.col1Tag}: </strong>{content.page2.col1Title}
                      </div>
                      <div>
                        <strong>{content.page2.col2Tag}: </strong>{content.page2.col2Title}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <span className="font-bold text-red-700">{content.page2.bannerTag}: </span>
                      <span>{content.page2.bannerTitle}</span>
                    </div>
                  </div>
                </div>
              )}

              {activePageIndex === 2 && (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded border">
                    <span className="text-red-700 font-bold text-xs">{content.page3.leadTag}</span>
                    <h2 className="text-2xl font-black font-serif text-slate-900 mt-1">
                      {content.page3.leadTitle}
                    </h2>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {content.page3.leadExcerpt}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded border space-y-3">
                    <h3 className="text-lg font-bold font-serif">{content.page3.header}</h3>
                    <div className="space-y-2 text-xs text-slate-700">
                      <div><strong>{content.page3.col1Tag}: </strong>{content.page3.col1Title}</div>
                      <div><strong>{content.page3.col2Tag}: </strong>{content.page3.col2Title}</div>
                      <div className="pt-2 border-t border-slate-200">
                        <span className="font-bold text-red-700">{content.page3.bannerTag}: </span>
                        <span>{content.page3.bannerTitle}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePageIndex === 3 && (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded border">
                    <span className="text-red-700 font-bold text-xs">{content.page4.leadTag}</span>
                    <h2 className="text-2xl font-black font-serif text-slate-900 mt-1">
                      {content.page4.leadTitle}
                    </h2>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {content.page4.leadExcerpt}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded border space-y-2">
                    <span className="text-xs font-bold text-amber-700">{content.page4.thoughtTag}</span>
                    <blockquote className="text-base italic text-slate-800 font-serif">
                      {content.page4.thoughtQuote}
                    </blockquote>
                    <p className="text-xs text-slate-600 font-semibold">{content.page4.thoughtAuthor}</p>
                  </div>
                </div>
              )}

              {activePageIndex === 4 && (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded border">
                    <span className="text-emerald-700 font-bold text-xs">{content.page5.col1Tag}</span>
                    <h2 className="text-2xl font-black font-serif text-slate-900 mt-1">
                      {content.page5.col1Title}
                    </h2>
                  </div>
                  <div className="p-4 bg-slate-50 rounded border">
                    <span className="text-blue-700 font-bold text-xs">{content.page5.col2Tag}</span>
                    <h3 className="text-xl font-black font-serif text-slate-900 mt-1">
                      {content.page5.col2Title}
                    </h3>
                    <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-4 text-xs font-bold text-slate-800">
                      <span>{content.page5.gold}</span>
                      <span>{content.page5.silver}</span>
                      <span>{content.page5.petrol}</span>
                    </div>
                  </div>
                </div>
              )}

              {activePageIndex === 5 && (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded border">
                    <span className="text-purple-700 font-bold text-xs">{content.page6.noticeTag}</span>
                    <h2 className="text-2xl font-black font-serif text-slate-900 mt-1">
                      {content.page6.noticeTitle}
                    </h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-700">
                      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded">
                        <strong className="text-slate-900">{content.page6.jobsTitle}</strong> {content.page6.jobsText}
                      </div>
                      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded">
                        <strong className="text-slate-900">{content.page6.weatherTitle}</strong> {content.page6.weatherText}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}

          </div>

          {/* Modal Bottom Bar Thumbnails */}
          <div className="bg-slate-950/95 border-t border-slate-800 p-2 flex items-center justify-center gap-2 overflow-x-auto shrink-0">
            {currentEdition.pages.map((p, idx) => (
              <button
                key={p.pageNumber}
                onClick={() => handlePageChange(idx, idx > activePageIndex ? 'next' : 'prev')}
                className={`relative w-11 h-14 rounded overflow-hidden border-2 transition shrink-0 cursor-pointer flex flex-col items-center justify-center ${
                  idx === activePageIndex ? 'border-amber-500 bg-amber-950/40 text-amber-300 font-bold scale-105' : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-[10px]">{content.pageLabel}</span>
                <span className="text-xs font-bold">{p.pageNumber}</span>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* 4. INSTANT CHECKOUT & UNLOCK MODAL */}
      {isCheckoutOpen && selectedPlanForUnlock && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {language === 'en' ? 'E-Paper Unlock & Subscription' : 'ई-पेपर अनलॉक एवं सदस्यता'}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {selectedPlanForUnlock.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Plan Summary */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold block uppercase tracking-wider">
                  {selectedPlanForUnlock.durationLabel}
                </span>
                <span className="font-black text-lg text-slate-900 dark:text-white">
                  {selectedPlanForUnlock.title}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">{selectedPlanForUnlock.description}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black text-amber-600">₹{selectedPlanForUnlock.price}</span>
                <span className="text-[10px] text-slate-400 block font-semibold">कुल देय (Total)</span>
              </div>
            </div>

            {/* Switch Plan Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {language === 'en' ? 'Select Different Plan:' : 'अन्य प्लान चुनें:'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {pricingPlans.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlanForUnlock(p)}
                    className={`p-2 rounded-xl text-left border transition cursor-pointer text-xs ${
                      selectedPlanForUnlock.id === p.id
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold ring-2 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-extrabold">₹{p.price}</div>
                    <div className="text-[10px] text-slate-400 truncate">{p.duration === 'single_edition' ? '1 दिन' : p.duration === 'yearly' ? '1 वर्ष' : '1 माह'}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Methods / QR Code */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>UPI / QR / GPay / PhonePe / Cards</span>
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  100% Instant
                </span>
              </div>

              {/* QR Box Visual */}
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border flex items-center justify-center shrink-0">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=swarnimdastavej@okhdfcbank%26pn=Swarnim%20Dastavej%26am=1"
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[11px] space-y-0.5">
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200">swarnim@okhdfcbank</div>
                  <div className="text-slate-400 text-[10px]">स्कैन करें या नीचे दिए बटन से तुरंत अनलॉक करें</div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>सभी UPI ऐप्स मान्य</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instant One-Click Unlock Button (For Demo & Seamless Flow) */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isProcessingPayment || paymentDone}
                onClick={() => handleExecuteUnlock(selectedPlanForUnlock)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:opacity-95 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{language === 'en' ? 'Processing Payment...' : 'भुगतान प्रक्रियाधीन...'}</span>
                  </>
                ) : paymentDone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>{language === 'en' ? 'Unlocked Successfully!' : 'सफलतापूर्वक अनलॉक हुआ! ✓'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>
                      {language === 'en' 
                        ? `Pay ₹${selectedPlanForUnlock.price} & Unlock Instantly` 
                        : `₹${selectedPlanForUnlock.price} भुगतान करें व तुरंत अनलॉक करें`}
                    </span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-400">
                🔒 256-बिट SSL एन्क्रिप्टेड सुरक्षित भुगतान • तुरंत पन्ना अनलॉक
              </p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
