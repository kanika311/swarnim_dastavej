export type Language = 'hi' | 'en' | 'ur';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  hi: {
    site_title: 'स्वर्णिम दस्तावेज़',
    site_tagline: 'सत्य • साहस • जनसरोकार',
    daily: 'दैनिक',
    todays_epaper: 'आज का अखबार',
    home_news: 'लाइव न्यूज़',
    videos: 'वीडियो',
    web_stories: 'वेब स्टोरीज',
    search: 'खोजें',
    search_placeholder: 'खबर, नेता, जिला, खेल या विषय खोजें...',
    trending: 'ट्रेंडिंग:',
    breaking_news: 'ब्रेकिंग न्यूज़',
    filter: 'फ़िल्टर',
    filter_by_topic: 'विषय चुनें (Topics)',
    login: 'लॉगिन',
    register: 'नया पंजीकरण',
    logout: 'लॉगआउट',
    my_profile: 'मेरी प्रोफ़ाइल',
    citizen_journalist: 'नागरिक पत्रकार',
    admin: 'एडमिन',
    reader: 'पाठक',
    submit_news: 'खबर भेजें',
    read_epaper: 'ई-पेपर पढ़ें',
    listen_audio: 'सुनें',
    stop_audio: 'रोकें',
    share: 'शेयर',
    bookmark: 'बुकमार्क',
    read_full: 'पूरी खबर',
    latest_headlines: 'ताज़ा सुर्खियां एवं जमीनी खबरें',
    default_badge: 'डिफ़ॉल्ट',
    all_cities: 'सभी शहर',
    select_language: 'भाषा चुनें',
    admin_dashboard: 'एडमिन डैशबोर्ड',
    // Topics
    topic_all: 'टॉप न्यूज़',
    topic_state_city: 'राज्य-शहर',
    topic_tejaswini: 'तेजस्विनी',
    topic_investigation: 'स्वर्णिम पड़ताल',
    topic_cricket: 'क्रिकेट',
    topic_special: 'स्वर्णिम खास',
    topic_original: 'दस्तावेज़ ओरिजिनल',
    topic_sports: 'स्पोर्ट्स',
    topic_entertainment: 'बॉलीवुड',
    topic_jobs: 'जॉब - एजुकेशन',
    topic_business: 'बिज़नेस',
    topic_farmers: 'किसान व कृषि',
    topic_citizen: 'नागरिक पत्रकारिता',
    topic_grievance: 'शिकायत निवारण',
    // Footer strings
    footer_tagline: 'उत्तर प्रदेश का अग्रणी, निष्पक्ष एवं निर्भीक हिंदी दैनिक समाचार पत्र व डिजिटल मीडिया नेटवर्क।',
    footer_registration: 'पंजीकरण',
    footer_major_categories: 'प्रमुख श्रेणियां',
    footer_services_policies: 'डिजिटल सेवाएं व नीतियां',
    footer_statutory_imprint: 'वैधानिक प्रकटीकरण (STATUTORY IMPRINT)',
    footer_editor_in_chief: 'प्रधान संपादक',
    footer_publisher: 'मुद्रक एवं प्रकाशक',
    footer_compliance: 'सूचना प्रौद्योगिकी (मध्यवर्ती संदर्शिका एवं डिजिटल मीडिया आचार संहिता) नियमावली, 2021 के अनुपालनार्थ।',
    footer_copyright: 'सर्वाधिकार सुरक्षित।',
    footer_privacy: 'गोपनीयता नीति',
    footer_terms: 'नियम एवं शर्तें',
    footer_editorial_policy: 'संपादकीय नीति',
    footer_grievance: 'आचार संहिता एवं शिकायत',
    footer_epaper_archive: 'ई-पेपर अभिलेखागार',
    footer_reporter_guidelines: 'संवाददाता नियम',
    // Profile strings
    role_reader: 'सामान्य पाठक',
    role_citizen_journalist: 'नागरिक पत्रकार',
    role_reporter: 'विशेष संवाददाता',
    role_editor: 'वरिष्ठ संपादक',
    role_admin: 'प्रधान संपादक / एडमिन',
    become_citizen_journalist: 'नागरिक पत्रकार बनें (खबर भेजें)',
    submit_new_story: 'नई खबर दर्ज करें',
    my_submitted_stories: 'मेरी भेजी गई खबरें',
    // E-paper strings
    epaper_date: 'दिनांक',
    epaper_edition: 'संस्करण',
    epaper_pages: 'पन्ने',
    epaper_page: 'पृष्ठ',
    epaper_prev: 'पिछला',
    epaper_next: 'अगला',
    epaper_full_page: 'फुल पेज खोलें',
    epaper_zoom_hint: '🔍 पन्ने पर कहीं भी क्लिक करके बड़ा (Zoomed) पढ़ें।',
    epaper_click_to_zoom: 'क्लिक करें ➔ पूरा पन्ना ज़ूम होगा'
  },
  en: {
    site_title: 'Swarnim Dastavej',
    site_tagline: 'Truth • Courage • Public Interest',
    daily: 'Daily',
    todays_epaper: "Today's Newspaper",
    home_news: 'Live News',
    videos: 'Videos',
    web_stories: 'Web Stories',
    search: 'Search',
    search_placeholder: 'Search news, leader, district, sports...',
    trending: 'Trending:',
    breaking_news: 'Breaking News',
    filter: 'Filter',
    filter_by_topic: 'Filter by Topic',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    my_profile: 'My Profile',
    citizen_journalist: 'Citizen Journalist',
    admin: 'Admin',
    reader: 'Reader',
    submit_news: 'Submit News',
    read_epaper: 'Read E-Paper',
    listen_audio: 'Listen',
    stop_audio: 'Stop',
    share: 'Share',
    bookmark: 'Bookmark',
    read_full: 'Full Story',
    latest_headlines: 'Latest Headlines & Ground Reports',
    default_badge: 'Default',
    all_cities: 'All Cities',
    select_language: 'Select Language',
    admin_dashboard: 'Admin Dashboard',
    // Topics
    topic_all: 'Top News',
    topic_state_city: 'State-City',
    topic_tejaswini: 'Tejaswini',
    topic_investigation: 'Fact Check & Investigation',
    topic_cricket: 'Cricket',
    topic_special: 'Special Stories',
    topic_original: 'Dastavej Originals',
    topic_sports: 'Sports',
    topic_entertainment: 'Entertainment',
    topic_jobs: 'Jobs & Education',
    topic_business: 'Business',
    topic_farmers: 'Agriculture & Farmers',
    topic_citizen: 'Citizen Journalism',
    topic_grievance: 'Grievance Redressal',
    // Footer strings
    footer_tagline: "Uttar Pradesh's Leading, Fearless & Independent Daily Newspaper and Digital Media Network.",
    footer_registration: 'Registration',
    footer_major_categories: 'Major Categories',
    footer_services_policies: 'Digital Services & Policies',
    footer_statutory_imprint: 'STATUTORY IMPRINT & COMPLIANCE',
    footer_editor_in_chief: 'Editor-in-Chief',
    footer_publisher: 'Printer & Publisher',
    footer_compliance: 'In strict compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.',
    footer_copyright: 'All Rights Reserved.',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_editorial_policy: 'Editorial Policy',
    footer_grievance: 'Code of Ethics & Grievance',
    footer_epaper_archive: 'E-Paper Archive',
    footer_reporter_guidelines: 'Reporter Guidelines',
    // Profile strings
    role_reader: 'Reader',
    role_citizen_journalist: 'Citizen Journalist',
    role_reporter: 'Special Reporter',
    role_editor: 'Senior Editor',
    role_admin: 'Chief Editor & Admin',
    become_citizen_journalist: 'Become Citizen Journalist (Submit News)',
    submit_new_story: 'Submit New Story',
    my_submitted_stories: 'My Submitted Stories',
    // E-paper strings
    epaper_date: 'Date',
    epaper_edition: 'Edition',
    epaper_pages: 'Pages',
    epaper_page: 'Page',
    epaper_prev: 'Prev',
    epaper_next: 'Next',
    epaper_full_page: 'Full Page Reader',
    epaper_zoom_hint: '🔍 Click anywhere on page to open high-resolution zoom reader.',
    epaper_click_to_zoom: 'Click to open full zoom reader'
  },
  ur: {
    site_title: 'سورنم دستاویز',
    site_tagline: 'سچائی • ہمت • عوامی مفاد',
    daily: 'روزنامہ',
    todays_epaper: 'آج کا اخبار',
    home_news: 'ہوم (تازہ ترین)',
    videos: 'ویڈیوز',
    web_stories: 'ویب کہانیاں',
    search: 'تلاش کریں',
    search_placeholder: 'خبریں، کھیل، موضوع تلاش کریں...',
    trending: 'ٹرینڈنگ:',
    breaking_news: 'بریکنگ نیوز',
    filter: 'فلٹر',
    filter_by_topic: 'موضوع منتخب کریں',
    login: 'لاگ ان',
    register: 'رجسٹر',
    logout: 'لاگ آؤٹ',
    my_profile: 'میری پروفائل',
    citizen_journalist: 'شہری صحافی',
    admin: 'ایڈمن',
    reader: 'قارئین',
    submit_news: 'خبر بھیجیں',
    read_epaper: 'ای پیپر پڑھیں',
    listen_audio: 'سنیں',
    stop_audio: 'روکیں',
    share: 'شیئر',
    bookmark: 'بک مارک',
    read_full: 'مکمل خبر',
    latest_headlines: 'تازہ سرخیاں اور زمینی رپورٹ',
    default_badge: 'طے شدہ',
    all_cities: 'تمام شہر',
    select_language: 'زبان منتخب کریں',
    admin_dashboard: 'ایڈمن ڈیش بورڈ',
    // Topics
    topic_all: 'اہم خبریں',
    topic_state_city: 'ریاست اور شہر',
    topic_tejaswini: 'تیجسونی',
    topic_investigation: 'تحقیقات',
    topic_cricket: 'کرکٹ',
    topic_special: 'خصوصی خبریں',
    topic_original: 'دستاویز اوریجنل',
    topic_sports: 'کھیل',
    topic_entertainment: 'تفریح',
    topic_jobs: 'روزگار اور تعلیم',
    topic_business: 'کاروبار',
    topic_farmers: 'کسان اور زراعت',
    topic_citizen: 'شہری صحافت',
    topic_grievance: 'شکایات ازالہ',
    // Footer strings
    footer_tagline: 'اتر پردیش کا بااعتماد، بے باک اور غیر جانبدار روزنامہ اور ڈیجیٹل میڈیا نیٹ ورک۔',
    footer_registration: 'رجسٹریشن',
    footer_major_categories: 'اہم زمرہ جات',
    footer_services_policies: 'ڈیجیٹل خدمات و پالیسیاں',
    footer_statutory_imprint: 'قانونی اعلان (Statutory Imprint)',
    footer_editor_in_chief: 'چیف ایڈیٹر',
    footer_publisher: 'پرنٹر اور پبلشر',
    footer_compliance: 'انفارمیشن ٹیکنالوجی رولز 2021 کی مکمل پاسداری میں۔',
    footer_copyright: 'جملہ حقوق محفوظ ہیں۔',
    footer_privacy: 'پرائیویسی پالیسی',
    footer_terms: 'شرائط و ضوابط',
    footer_editorial_policy: 'ادارتی پالیسی',
    footer_grievance: 'ضابطہ اخلاق اور شکایات',
    footer_epaper_archive: 'ای پیپر آرکائیو',
    footer_reporter_guidelines: 'نامہ نگار قوانین',
    // Profile strings
    role_reader: 'قارئین',
    role_citizen_journalist: 'شہری صحافی',
    role_reporter: 'خصوصی نامہ نگار',
    role_editor: 'سینئر ایڈیٹر',
    role_admin: 'چیف ایڈیٹر و ایڈمن',
    become_citizen_journalist: 'شہری صحافی بنیں (خبر بھیجیں)',
    submit_new_story: 'نئی خبر درج کریں',
    my_submitted_stories: 'میری بھیجی گئی خبریں',
    // E-paper strings
    epaper_date: 'تاریخ',
    epaper_edition: 'ایڈیشن',
    epaper_pages: 'صفحات',
    epaper_page: 'صفحہ',
    epaper_prev: 'پچھلا',
    epaper_next: 'اگلا',
    epaper_full_page: 'مکمل صفحہ ریڈر',
    epaper_zoom_hint: '🔍 بڑا کر کے پڑھنے کے لیے صفحے پر کلک کریں۔',
    epaper_click_to_zoom: 'صفحہ بڑا کرنے کے لیے کلک کریں'
  }
};

export function getTranslation(lang: Language, key: string): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['hi'];
  return dict[key] || TRANSLATIONS['hi'][key] || key;
}

// User name localization helper
export function getLocalizedUserName(rawName: string | undefined | null, lang: Language = 'hi'): string {
  if (!rawName) return lang === 'en' ? 'Reader' : lang === 'ur' ? 'قارئین' : 'पाठक';
  
  // Clean off any hardcoded role suffixes
  const cleanName = rawName
    .replace(/\s*\(पाठक\)/gi, '')
    .replace(/\s*\(दैनिक पाठक\)/gi, '')
    .replace(/\s*\(Reader\)/gi, '')
    .replace(/\s*\(नागरिक पत्रकार[^)]*\)/gi, '')
    .replace(/\s*\(विशेष संवाददाता\)/gi, '')
    .replace(/\s*\(वरिष्ठ संपादक\)/gi, '')
    .replace(/\s*\(प्रधान संपादक\)/gi, '')
    .trim();

  if (lang === 'en') {
    const enMap: Record<string, string> = {
      'अमित कुमार सिंह': 'Amit Kumar Singh',
      'प्रियंका मिश्रा': 'Priyanka Mishra',
      'राजेश तिवारी': 'Rajesh Tiwari',
      'काजल वर्मा': 'Kajal Verma',
      'रामेश्वर दयाल': 'Rameshwar Dayal',
      'अनुराधा अवस्थी': 'Anuradha Awasthi',
      'सुनील कुमार वर्मा': 'Sunil Kumar Verma',
      'विकास शुक्ला': 'Vikas Shukla',
      'मो० रिज़वान खान': 'Mohd. Rizwan Khan',
      'दीपक अवस्थी': 'Deepak Awasthi'
    };
    return enMap[cleanName] || cleanName;
  }

  if (lang === 'ur') {
    const urMap: Record<string, string> = {
      'अमित कुमार सिंह': 'امیت کمار سنگھ',
      'प्रियंका मिश्रा': 'پرینکا مشرا',
      'राजेश तिवारी': 'راجیش تیواری',
      'काजल वर्मा': 'کاجل ورما',
      'रामेश्वर दयाल': 'رامیشور دیال',
      'अनुराधा अवस्थी': 'انورادھا اوستھی',
      'सुनील कुमार वर्मा': 'سنیل کمار ورما',
      'विकास शुक्ला': 'وکاس شکلا',
      'मो० रिज़वान खान': 'محمد رضوان خان',
      'दीपक अवस्थी': 'دیپک اوستھی'
    };
    return urMap[cleanName] || cleanName;
  }

  return cleanName;
}

export function getLocalizedUserFirstName(rawName: string | undefined | null, lang: Language = 'hi'): string {
  const full = getLocalizedUserName(rawName, lang);
  return full.split(' ')[0] || full;
}

export function getLocalizedUserRole(role: string | undefined, lang: Language = 'hi', short = false): string {
  if (lang === 'en') {
    switch (role) {
      case 'citizen_journalist': return short ? 'Citizen Journalist' : 'Citizen Journalist';
      case 'staff_reporter': return short ? 'Reporter' : 'Special Staff Reporter';
      case 'editor': return short ? 'Editor' : 'Senior Editor';
      case 'admin':
      case 'super_admin': return short ? 'Admin' : 'Chief Editor & Admin';
      case 'reader':
      default: return short ? 'Reader' : 'Reader (Citizen)';
    }
  }
  if (lang === 'ur') {
    switch (role) {
      case 'citizen_journalist': return short ? 'شہری صحافی' : 'شہری صحافی (پریس)';
      case 'staff_reporter': return short ? 'نامہ نگار' : 'خصوصی نامہ نگار';
      case 'editor': return short ? 'ایڈیٹر' : 'سینئر ایڈیٹر';
      case 'admin':
      case 'super_admin': return short ? 'ایڈمن' : 'چیف ایڈیٹر و ایڈمن';
      case 'reader':
      default: return short ? 'قارئین' : 'عام قارئین';
    }
  }
  switch (role) {
    case 'citizen_journalist': return short ? 'नागरिक पत्रकार' : 'नागरिक पत्रकार';
    case 'staff_reporter': return short ? 'संवाददाता' : 'विशेष संवाददाता';
    case 'editor': return short ? 'संपादक' : 'वरिष्ठ संपादक';
    case 'admin':
    case 'super_admin': return short ? 'एडमिन' : 'प्रधान संपादक / एडमिन';
    case 'reader':
    default: return short ? 'पाठक' : 'सामान्य पाठक (Reader)';
  }
}
