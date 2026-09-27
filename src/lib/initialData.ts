import { Article, CitizenSubmission, EPaperEdition, Poll, AdBanner, ClassifiedItem, GrievanceComplaint, User } from '@/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_1',
    name: 'रामेश्वर दयाल (प्रधान संपादक)',
    email: 'editor@swarnimdastavej.com',
    phone: '+91 94500 12345',
    role: 'admin',
    city: 'लखनऊ',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'verified'
  },
  {
    id: 'user_editor_1',
    name: 'अनुराधा अवस्थी (वरिष्ठ संपादक)',
    email: 'anuradha.editor@swarnimdastavej.com',
    phone: '+91 98390 67890',
    role: 'editor',
    city: 'लखनऊ',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'verified'
  },
  {
    id: 'user_reporter_1',
    name: 'सुनील कुमार वर्मा (विशेष संवाददाता)',
    email: 'sunil.reporter@swarnimdastavej.com',
    phone: '+91 91234 56789',
    role: 'staff_reporter',
    city: 'सीतापुर',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'verified'
  },
  {
    id: 'user_citizen_1',
    name: 'विकास शुक्ला (नागरिक पत्रकार - सीतापुर)',
    email: 'vikas.citizen@gmail.com',
    phone: '+91 99182 34567',
    role: 'citizen_journalist',
    city: 'सीतापुर',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'verified',
    kycDetails: {
      idProofType: 'Aadhaar Card',
      idNumber: 'XXXX-XXXX-4589',
      submittedAt: '2026-09-10T10:00:00Z',
      district: 'सीतापुर'
    }
  },
  {
    id: 'user_reader_1',
    name: 'अमित कुमार सिंह (पाठक)',
    email: 'amit.reader@gmail.com',
    phone: '+91 98890 12345',
    role: 'reader',
    city: 'लखनऊ',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'not_submitted'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'up-expressway-network-expansion-sitapur-lucknow',
    headline: 'यूपी में हाईवे नेटवर्क का महा-विस्तार: लखनऊ-सीतापुर-लखीमपुर 6 लेन कॉरिडोर को मंजूरी, यात्रा समय आधा होगा',
    subHeadline: 'कैबिनेट बैठक में 4,200 करोड़ रुपये की परियोजना पर मुहर, औद्योगिक गलियारे को मिलेगी नई रफ्तार',
    excerpt: 'उत्तर प्रदेश सरकार ने राजधानी लखनऊ से सीतापुर होते हुए लखीमपुर खीरी तक 6 लेन ग्रीनफील्ड एक्सेस-कंट्रोल्ड हाईवे के निर्माण को हरी झंडी दे दी है।',
    body: `उत्तर प्रदेश कैबिनेट की अहम बैठक में राज्य के बुनियादी ढांचे को नई ऊंचाई देने वाला बड़ा फैसला लिया गया है। मुख्यमंत्री की अध्यक्षता में हुई बैठक में लखनऊ-सीतापुर-लखीमपुर 6 लेन कॉरिडोर परियोजना को अंतिम स्वीकृति प्रदान की गई।

परियोजना की मुख्य विशेषताएं:
• 4,200 करोड़ रुपये की अनुमानित लागत से 138 किलोमीटर लंबा आधुनिक एक्सप्रेसवे बनेगा।
• सीतापुर और महोली के पास लॉजिस्टिक्स हब और एग्री-प्रोसेसिंग क्लस्टर स्थापित होंगे।
• लखनऊ से सीतापुर की दूरी अब महज 45 मिनट और लखीमपुर 1 घंटा 15 मिनट में तय होगी।
• स्थानीय किसानों को अपनी उपज लखनऊ व दिल्ली मंडियों तक तीव्र गति से पहुंचाने की सुगम सुविधा मिलेगी।

पीडब्ल्यूडी और यूपीडा के अधिकारियों के अनुसार, भूमि अधिग्रहण की प्रक्रिया अगले माह से शुरू होगी और वर्ष 2028 तक कॉरिडोर को आम जनता के लिए खोलने का लक्ष्य तय किया गया है।`,
    category: 'state',
    city: 'लखनऊ',
    language: 'hi',
    coverImage: 'https://images.unsplash.com/photo-1545158826-6a3196c80251?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_editor_1',
      name: 'अनुराधा अवस्थी',
      role: 'editor'
    },
    isBreaking: true,
    isTrending: true,
    publishedAt: '2026-09-27T08:30:00Z',
    viewsCount: 14850,
    likesCount: 924,
    commentsCount: 68,
    sharesCount: 312,
    tags: ['उत्तर प्रदेश', 'लखनऊ', 'सीतापुर', 'एक्सप्रेसवे', 'बुनियादी ढांचा', 'कैबिनेट'],
    readingTimeMinutes: 3,
    status: 'published'
  },
  {
    id: 'art-2',
    slug: 'sitapur-sarayan-river-cleanliness-drive-citizen-initiative',
    headline: 'सीतापुर में सरायन नदी को पुनर्जीवित करने आगे आए युवा: श्रमदान से निकाला 10 टन कचरा, प्रशासन ने भी दिया साथ',
    subHeadline: 'स्वर्णिम दूत ग्राउंड रिपोर्ट: स्थानीय नागरिकों और स्वयंसेवकों की मुहिम रंग लाई',
    excerpt: 'सीतापुर की ऐतिहासिक सरायन नदी को प्लास्टिक मुक्त बनाने के लिए 300 से अधिक युवाओं ने रविवार सुबह विशाल स्वच्छता अभियान चलाया।',
    body: `सीतापुर की पहचान कही जाने वाली सरायन नदी के अस्तित्व को बचाने के लिए शहर के जागरूक नागरिकों और युवाओं ने मिसाल पेश की है। रविवार सुबह 6 बजे से ही लालबाग और वैदेही वाटिका घाट पर युवाओं, व्यापारियों और सेवानिवृत्त अधिकारियों का हुजूम उमड़ पड़ा।

अभियान के मुख्य बिंदु:
1. पांच घंटे के निरंतर श्रमदान से नदी की धारा से लगभग 10 टन जलकुंभी, प्लास्टिक कचरा और सिल्ट हटाया गया।
2. नगर पालिका परिषद सीतापुर ने कचरा उठाने के लिए 6 ट्रैक्टर-ट्रॉली और 2 जेसीबी मशीनें मौके पर उपलब्ध कराईं।
3. युवाओं ने नदी के दोनों किनारों पर 500 औषधीय व छायादार पौधे रोपने का संकल्प लिया।

स्थानीय समाजसेवी विकास शुक्ला ने बताया कि यह अभियान हर रविवार को निरंतर जारी रहेगा जब तक कि सरायन नदी का जल दोबारा आचमन योग्य नहीं हो जाता।`,
    category: 'sitapur',
    city: 'सीतापुर',
    language: 'hi',
    coverImage: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_citizen_1',
      name: 'विकास शुक्ला (नागरिक पत्रकार)',
      role: 'citizen_journalist'
    },
    isBreaking: false,
    isTrending: true,
    publishedAt: '2026-09-27T09:15:00Z',
    viewsCount: 8920,
    likesCount: 1240,
    commentsCount: 94,
    sharesCount: 520,
    tags: ['सीतापुर', 'सरायन नदी', 'स्वच्छता', 'नागरिक पत्रकार', 'पर्यावरण'],
    readingTimeMinutes: 4,
    status: 'published'
  },
  {
    id: 'art-3',
    slug: 'india-space-mission-isro-gaganyaan-crew-module',
    headline: 'इसरो का नया इतिहास: गगनयान के मानवरहित मिशन की सफल लैंडिंग, अंतरिक्ष में भारत का दबदबा',
    subHeadline: 'बंगाल की खाड़ी में सुरक्षित उतरा क्रू मॉड्यूल, प्रधानमंत्री ने वैज्ञानिकों को दी बधाई',
    excerpt: 'भारतीय अंतरिक्ष अनुसंधान संगठन (इसरो) ने गगनयान मिशन के पहले महत्वपूर्ण चरण को सफलतापूर्वक पूरा कर लिया है।',
    body: `श्रीहरिकोटा स्थित सतीश धवन अंतरिक्ष केंद्र से प्रक्षेपित किए गए गगनयान के मानवरहित टेस्ट व्हीकल ने अपने सभी निर्धारित मानकों को शत-प्रतिशत सटीकता के साथ पूरा किया।

मिशन के अहम पड़ाव:
• क्रू एस्केप सिस्टम ने आपातकालीन स्थिति में अंतरिक्ष यात्रियों को सुरक्षित अलग करने की प्रणाली का सफल परीक्षण किया।
• बंगाल की खाड़ी में नौसेना के विशेष गोताखोरों की मदद से क्रू मॉड्यूल को सुरक्षित बरामद कर लिया गया।
• इसरो प्रमुख ने प्रेस वार्ता में बताया कि सभी सेंसर और लाइफ सपोर्ट सिमुलेशन डेटा सामान्य से बेहतर रहे।

यह सफलता वर्ष 2027 में होने वाले भारत के पहले मानवयुक्त अंतरिक्ष मिशन के लिए निर्णायक मानी जा रही है।`,
    category: 'national',
    city: 'नई दिल्ली',
    language: 'hi',
    coverImage: 'https://images.unsplash.com/photo-1517976487502-5f71bb4028d6?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_reporter_1',
      name: 'सुनील कुमार वर्मा',
      role: 'staff_reporter'
    },
    isBreaking: true,
    isTrending: true,
    publishedAt: '2026-09-27T07:45:00Z',
    viewsCount: 22400,
    likesCount: 3100,
    commentsCount: 142,
    sharesCount: 890,
    tags: ['इसरो', 'गगनयान', 'अंतरिक्ष', 'भारत', 'विज्ञान'],
    readingTimeMinutes: 3,
    status: 'published'
  },
  {
    id: 'art-4',
    slug: 'lucknow-metro-phase-2-charbagh-to-vasant-kunj',
    headline: 'लखनऊ मेट्रो फेज-2: चारबाग से वसंत कुंज रूट की डीपीआर मंजूर, पुराने लखनऊ के 12 स्टेशनों को मिलेगी कनेक्टिविटी',
    subHeadline: 'चौक, अमीनाबाद, ठाकुरगंज और मेडिकल कॉलेज के लाखों निवासियों को जाम से मिलेगा स्थायी छुटकारा',
    excerpt: 'राजधानी लखनऊ के पुराने और घनी आबादी वाले इलाकों को जल्द ही मेट्रो रेल सेवा से जोड़ा जाएगा। 11.8 किमी लंबे ईस्ट-वेस्ट कॉरिडोर को केंद्र से सैद्धांतिक सहमति मिल गई है।',
    body: `पुराने लखनऊ के ऐतिहासिक और व्यस्त बाजारों में अब मेट्रो की गूंज सुनाई देगी। उत्तर प्रदेश मेट्रो रेल कॉरपोरेशन (UPMRC) के ईस्ट-वेस्ट कॉरिडोर को हरी झंडी मिल गई है।

रूट का विवरण:
- कुल लंबाई: 11.165 किलोमीटर
- कुल स्टेशन: 12 (7 भूमिगत और 5 एलिवेटेड)
- प्रमुख स्टेशन: चारबाग (इंटरचेंज), गौतम बुद्ध मार्ग, अमीनाबाद, पांडेगंज, सिटी रेलवे स्टेशन, मेडिकल कॉलेज (KGMU), चौक, ठाकुरगंज, बालागंज, सरफराजगंज, मूसाबाग और वसंत कुंज डिपो।

इस कॉरिडोर के बनने से अमीनाबाद और चौक के थोक बाजारों में प्रतिदिन आने वाले लाखों व्यापारियों और खरीदारों को सुगम व वातानुकूलित यात्रा मिल सकेगी।`,
    category: 'lucknow',
    city: 'लखनऊ',
    language: 'hi',
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_editor_1',
      name: 'रामेश्वर दयाल',
      role: 'admin'
    },
    isBreaking: false,
    isTrending: false,
    publishedAt: '2026-09-26T18:00:00Z',
    viewsCount: 11200,
    likesCount: 810,
    commentsCount: 45,
    sharesCount: 230,
    tags: ['लखनऊ', 'मेट्रो', 'चारबाग', 'अमीनाबाद', 'चौक', 'यातायात'],
    readingTimeMinutes: 3,
    status: 'published'
  },
  {
    id: 'art-5',
    slug: 'ayodhya-ram-mandir-international-ramayan-museum',
    headline: 'अयोध्या में विश्वस्तरीय रामायण संग्रहालय का निर्माण तेज: 100 देशों की रामायण परंपराएं होंगी प्रदर्शित',
    subHeadline: 'सरयू तट पर 10 एकड़ में बन रहा है आधुनिक सांस्कृतिक केंद्र, 3D हॉलोग्राम और वर्चुअल रियलिटी थियेटर भी होंगे',
    excerpt: 'धार्मिक नगरी अयोध्या में श्रीराम जन्मभूमि तीर्थ क्षेत्र के समीप रामायण सांस्कृतिक केंद्र एवं अंतर्राष्ट्रीय संग्रहालय का निर्माण कार्य तेजी से चल रहा है।',
    body: `अयोध्या आने वाले देश-विदेश के श्रद्धालुओं के लिए एक और भव्य आकर्षण आकार ले रहा है। सरयू नदी के तट पर विकसित किए जा रहे अंतर्राष्ट्रीय रामायण संग्रहालय में इंडोनेशिया, थाईलैंड, कंबोडिया, श्रीलंका, नेपाल और मॉरीशस सहित 100 से अधिक देशों में प्रचलित रामायण के विभिन्न स्वरूपों को प्रदर्शित किया जाएगा।

आधुनिक तकनीकों का समावेश:
• आगंतुकों के लिए 360-डिग्री इमर्सिव ऑडियो-विजुअल शो।
• प्राचीन ताड़पत्र पांडुलिपियों का डिजिटलाइज्ड अभिलेखागार।
• युवा पीढ़ी के लिए इंटरेक्टिव डिजिटल कियोस्क।`,
    category: 'state',
    city: 'अयोध्या',
    language: 'hi',
    coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_reporter_1',
      name: 'सुनील कुमार वर्मा',
      role: 'staff_reporter'
    },
    isBreaking: false,
    isTrending: true,
    publishedAt: '2026-09-26T15:30:00Z',
    viewsCount: 16500,
    likesCount: 1450,
    commentsCount: 77,
    sharesCount: 410,
    tags: ['अयोध्या', 'रामायण संग्रहालय', 'संस्कृति', 'उत्तर प्रदेश', 'पर्यटन'],
    readingTimeMinutes: 4,
    status: 'published'
  },
  {
    id: 'art-6',
    slug: 'sponsored-kisan-solar-pump-yojana-uttar-pradesh',
    headline: 'पीएम कुसुम योजना: यूपी के किसानों को सोलर पंप पर 70% तक की छूट, ऑनलाइन आवेदन प्रक्रिया शुरू',
    subHeadline: 'खेतों में बिजली बिल का झंझट खत्म, अतिरिक्त बिजली ग्रिड को बेचकर किसान कमा सकेंगे मुनाफा',
    excerpt: 'कृषि विभाग उत्तर प्रदेश द्वारा संचालित प्रधानमंत्री किसान ऊर्जा सुरक्षा एवं उत्थान महाभियान के तहत पहले आओ-पहले पाओ के आधार पर पंजीकरण जारी है।',
    body: `(प्रायोजित आलेख / Sponsored Article - कृषि एवं ऊर्जा विभाग विशेष)

उत्तर प्रदेश के कृषक बंधुओं के लिए सिंचाई की लागत घटाने का स्वर्णिम अवसर सामने आया है। पीएम कुसुम योजना के तहत 2 एचपी से लेकर 10 एचपी तक के सोलर पंप सेट पर केंद्र व राज्य सरकार द्वारा 70 प्रतिशत तक का भारी अनुदान दिया जा रहा है।

आवेदन की मुख्य शर्तें:
1. किसान उत्तर प्रदेश का मूल निवासी हो तथा उसके पास वैध खतौनी और बैंक खाता हो।
2. कृषि विभाग के आधिकारिक पोर्टल www.upagriculture.com पर टोकन जनरेट कर पंजीकरण किया जा सकता है।
3. योजना से डीजल पंपों के बढ़ते खर्च से हमेशा के लिए मुक्ति मिलेगी।`,
    category: 'business',
    city: 'लखनऊ',
    language: 'hi',
    coverImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_editor_1',
      name: 'संपादकीय डेस्क (प्रायोजित)',
      role: 'editor'
    },
    isBreaking: false,
    isTrending: false,
    isSponsored: true,
    sponsoredBy: 'उत्तर प्रदेश नवीन एवं नवीकरणीय ऊर्जा विकास अभिकरण (UPNEDA)',
    publishedAt: '2026-09-26T11:00:00Z',
    viewsCount: 7800,
    likesCount: 340,
    commentsCount: 18,
    sharesCount: 155,
    tags: ['प्रायोजित', 'सोलर पंप', 'किसान', 'उत्तर प्रदेश', 'योजना'],
    readingTimeMinutes: 2,
    status: 'published'
  },
  {
    id: 'art-7',
    slug: 'india-vs-australia-cricket-test-series-preparation',
    headline: 'बॉर्डर-गावस्कर ट्रॉफी: भारतीय टीम का कैंप कानपुर में शुरू, युवा तेज गेंदबाजों ने अभ्यास सत्र में बरपाया कहर',
    subHeadline: 'रोहित शर्मा और विराट कोहली ने नेट्स पर बिताए 3 घंटे, स्पिन और बाउंस से निपटने की विशेष रणनीति',
    excerpt: 'आगामी टेस्ट श्रृंखला के लिए भारतीय क्रिकेट दल ने ग्रीन पार्क स्टेडियम में अभ्यास सत्र का शुभारंभ किया।',
    body: `भारतीय क्रिकेट टीम के स्टार खिलाड़ियों ने आगामी बॉर्डर-गावस्कर ट्रॉफी की तैयारियों को अंतिम रूप देने के लिए कानपुर के ग्रीन पार्क में कड़ा अभ्यास शुरू किया है।

मुख्य आकर्षण:
• मुख्य कोच ने तेज गेंदबाजों के लिए अलग से यॉर्कर और बाउंसर ड्रिल कराई।
• शुभमन गिल और यशस्वी जायसवाल ने नई गेंद का सामना करने के लिए नई तकनीक पर अभ्यास किया।
• प्रशंसकों की भारी भीड़ स्टेडियम के बाहर अपने चहेते खिलाड़ियों की एक झलक पाने के लिए डटी रही।`,
    category: 'sports',
    city: 'कानपुर',
    language: 'hi',
    coverImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_reporter_1',
      name: 'सुनील कुमार वर्मा',
      role: 'staff_reporter'
    },
    isBreaking: false,
    isTrending: true,
    publishedAt: '2026-09-26T14:15:00Z',
    viewsCount: 19400,
    likesCount: 2800,
    commentsCount: 110,
    sharesCount: 420,
    tags: ['क्रिकेट', 'टीम इंडिया', 'खेल', 'कानपुर', 'टेस्ट क्रिकेट'],
    readingTimeMinutes: 3,
    status: 'published'
  }
];

export const INITIAL_SUBMISSIONS: CitizenSubmission[] = [
  {
    id: 'sub-101',
    headline: 'सीतापुर-लहरपुर मार्ग पर पुलिया टूटने से 20 गांवों का संपर्क कटा, स्कूल जाने वाले बच्चे परेशान',
    subHeadline: 'बारिश के बाद धंसी पुलिया, ग्रामीणों ने खुद बांस-बल्ली लगाकर बनाया कामचलाऊ रास्ता',
    body: 'सीतापुर जिले के लहरपुर तहसील अंतर्गत ग्राम पंचायत मानपुर के पास मुख्य मार्ग की पुलिया धंस जाने से दो दर्जन गांवों का आवागमन पूरी तरह ठप हो गया है। प्राथमिक विद्यालय और कन्या इंटर कॉलेज जाने वाली छात्राओं को प्रतिदिन जान जोखिम में डालकर नाला पार करना पड़ रहा है। ग्रामीणों का आरोप है कि पिछले छह माह से लोक निर्माण विभाग को लगातार प्रार्थना पत्र दिए गए, परंतु कोई ठोस कार्रवाई नहीं हुई।',
    category: 'sitapur',
    city: 'सीतापुर',
    language: 'hi',
    submittedBy: {
      id: 'user_citizen_1',
      name: 'विकास शुक्ला',
      role: 'citizen_journalist',
      phone: '+91 99182 34567',
      district: 'सीतापुर'
    },
    media: [
      {
        id: 'med-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&auto=format&fit=crop&q=80',
        caption: 'धंसी हुई पुलिया और ग्रामीणों द्वारा लगाया गया अस्थायी लकड़ी का पुल'
      }
    ],
    hasRecordedVideo: true,
    geoTag: {
      locationName: 'मानपुर चौराहा, लहरपुर रोड, सीतापुर',
      coordinates: '27.7123, 80.8912'
    },
    status: 'pending_review',
    submittedAt: '2026-09-27T10:15:00Z',
    updatedAt: '2026-09-27T10:15:00Z',
    revisionHistory: [
      {
        timestamp: '2026-09-27T10:15:00Z',
        action: 'SUBMITTED',
        performedBy: 'विकास शुक्ला (नागरिक पत्रकार)',
        note: 'मौके से रिकॉर्ड किया गया वीडियो और फोटोग्राफ संलग्न हैं।'
      }
    ]
  },
  {
    id: 'sub-102',
    headline: 'हजरतगंज लखनऊ में ऐतिहासिक इमारत पर अवैध विज्ञापन होर्डिंग लगाने का प्रयास, स्थानीय नागरिकों के विरोध से रुका कार्य',
    subHeadline: 'पुरातत्व एवं विरासत संरक्षण नियमों का खुला उल्लंघन, नगर निगम ने लिया संज्ञान',
    body: 'राजधानी लखनऊ के हृदय स्थल हजरतगंज में ब्रिटिश कालीन ऐतिहासिक इमारत पर कुछ निजी एजेंसियों द्वारा देर रात भारी लोहे के होर्डिंग फ्रेम वेल्ड किए जा रहे थे। सुबह की सैर पर निकले वरिष्ठ नागरिकों और विरासत प्रेमियों ने इसका कड़ा विरोध किया और मौके पर 112 डायल कर पुलिस को सूचना दी।',
    category: 'lucknow',
    city: 'लखनऊ',
    language: 'hi',
    submittedBy: {
      id: 'user_reporter_1',
      name: 'सुनील कुमार वर्मा',
      role: 'staff_reporter',
      phone: '+91 91234 56789',
      district: 'लखनऊ'
    },
    media: [
      {
        id: 'med-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        caption: 'हजरतगंज स्थित धरोहर इमारत'
      }
    ],
    status: 'pending_review',
    submittedAt: '2026-09-27T11:30:00Z',
    updatedAt: '2026-09-27T11:30:00Z',
    revisionHistory: [
      {
        timestamp: '2026-09-27T11:30:00Z',
        action: 'SUBMITTED',
        performedBy: 'सुनील कुमार वर्मा (विशेष संवाददाता)',
        note: 'विभागीय प्रतिक्रिया भी शाम तक जोड़ी जाएगी।'
      }
    ]
  },
  {
    id: 'sub-103',
    headline: 'महमूदाबाद सीतापुर: सामुदायिक स्वास्थ्य केंद्र में डॉक्टरों की कमी, मरीज 40 किमी दूर जिला अस्पताल रेफर होने को विवश',
    subHeadline: 'अल्ट्रासाउंड और डिजिटल एक्स-रे मशीनें धूल फांक रहीं, टेक्नीशियन के पद 3 वर्षों से रिक्त',
    body: 'महमूदाबाद ब्लॉक के सामुदायिक स्वास्थ्य केंद्र में चिकित्सा सुविधाओं की बदहाली चरम पर है। तीन लाख से अधिक ग्रामीण आबादी वाले इस क्षेत्र में 5 स्वीकृत डॉक्टरों के सापेक्ष केवल 1 संविदा चिकित्सक तैनात हैं।',
    category: 'sitapur',
    city: 'सीतापुर',
    language: 'hi',
    submittedBy: {
      id: 'user_citizen_1',
      name: 'विकास शुक्ला',
      role: 'citizen_journalist',
      district: 'सीतापुर'
    },
    media: [],
    status: 'sent_back',
    editorComments: 'कृपया स्वास्थ्य केंद्र अधीक्षक अथवा मुख्य चिकित्सा अधिकारी (CMO) का आधिकारिक पक्ष भी जोड़ें तथा अस्पताल परिसर की वास्तविक तस्वीर संलग्न करें।',
    reviewedBy: 'अनुराधा अवस्थी (वरिष्ठ संपादक)',
    reviewedAt: '2026-09-26T16:20:00Z',
    submittedAt: '2026-09-26T14:00:00Z',
    updatedAt: '2026-09-26T16:20:00Z',
    revisionHistory: [
      {
        timestamp: '2026-09-26T14:00:00Z',
        action: 'SUBMITTED',
        performedBy: 'विकास शुक्ला'
      },
      {
        timestamp: '2026-09-26T16:20:00Z',
        action: 'SENT_BACK',
        performedBy: 'अनुराधा अवस्थी (संपादक)',
        note: 'अस्पताल अधीक्षक का बयान और तस्वीर अपेक्षित है।'
      }
    ]
  }
];

export const INITIAL_EPAPER_EDITIONS: EPaperEdition[] = [
  {
    id: 'epaper-2026-09-27-lucknow',
    date: '2026-09-27',
    editionCity: 'लखनऊ',
    editionTitle: 'स्वर्णिम दस्तावेज़ - लखनऊ दैनिक मुख्य संस्करण',
    pagesCount: 6,
    thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
    pages: [
      {
        pageNumber: 1,
        title: 'मुख्य पृष्ठ (Front Page) - लखनऊ-सीतापुर एक्सप्रेसवे, गगनयान टेस्ट',
        imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 2,
        title: 'प्रदेश एवं प्रादेशिक हलचल (State & Regional News)',
        imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 3,
        title: 'अवध परिक्रमा (लखनऊ व सीतापुर नगर विशेष)',
        imageUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 4,
        title: 'संपादकीय पृष्ठ (Editorial & Op-Ed) - स्वर्णिम दृष्टिकोण',
        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 5,
        title: 'कारोबार एवं क्रीड़ा जगत (Business & Sports)',
        imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 6,
        title: 'क्लासिफाइड, सार्वजनिक निविदाएं एवं शोक संदेश',
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'epaper-2026-09-26-lucknow',
    date: '2026-09-26',
    editionCity: 'लखनऊ',
    editionTitle: 'स्वर्णिम दस्तावेज़ - लखनऊ दैनिक (26 सितम्बर)',
    pagesCount: 6,
    thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80',
    pages: [
      {
        pageNumber: 1,
        title: 'मुख्य पृष्ठ',
        imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80'
      }
    ]
  }
];

export const INITIAL_POLL: Poll = {
  id: 'poll-1',
  question: 'क्या उत्तर प्रदेश में नए एक्सप्रेसवे नेटवर्क से ग्रामीण अर्थव्यवस्था और किसानों की आय में भारी उछाल आएगा?',
  questionHi: 'क्या उत्तर प्रदेश में नए एक्सप्रेसवे नेटवर्क से ग्रामीण अर्थव्यवस्था और किसानों की आय में भारी उछाल आएगा?',
  options: [
    { id: 'opt-1', textHi: 'हाँ, उत्पादों को बड़ी मंडियां मिलेंगी', textEn: 'Yes, easier market access', votes: 1420 },
    { id: 'opt-2', textHi: 'नहीं, केवल बड़े उद्योगों को लाभ होगा', textEn: 'No, only big industries benefit', votes: 310 },
    { id: 'opt-3', textHi: 'कह नहीं सकते / समीक्षा आवश्यक है', textEn: 'Cannot say yet', votes: 115 }
  ],
  totalVotes: 1845,
  isActive: true
};

export const INITIAL_ADS: AdBanner[] = [
  {
    id: 'ad-1',
    title: 'उत्तर प्रदेश पर्यटन - अवध महोत्सव 2026',
    advertiser: 'UP Tourism Department',
    imageUrl: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&auto=format&fit=crop&q=80',
    targetUrl: 'https://uptourism.gov.in',
    placement: 'header_top',
    impressions: 24800,
    clicks: 1420,
    isActive: true
  },
  {
    id: 'ad-2',
    title: 'स्वर्णिम दस्तावेज़ मोबाइल ऐप - जल्द आ रहा है प्ले स्टोर पर',
    advertiser: 'स्वर्णिम दस्तावेज़ डिजिटल',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
    targetUrl: '#',
    placement: 'sidebar',
    impressions: 18200,
    clicks: 980,
    isActive: true
  }
];

export const INITIAL_CLASSIFIEDS: ClassifiedItem[] = [
  {
    id: 'clf-1',
    type: 'public_notice',
    title: 'सार्वजनिक सूचना: नगर पालिका परिषद सीतापुर',
    content: 'सर्वसाधारण को सूचित किया जाता है कि वार्ड संख्या 14 एवं 15 में पाइपलाइन इंटरकनेक्शन कार्य हेतु 28 एवं 29 सितम्बर को प्रातः 10 से सायं 4 बजे तक जलापूर्ति बाधित रहेगी। नागरिक पर्याप्त जल भंडारण कर लें। - अधिशासी अधिकारी, नपाप सीतापुर।',
    contact: '05862-242100',
    city: 'सीतापुर',
    publishedDate: '2026-09-27'
  },
  {
    id: 'clf-2',
    type: 'tender',
    title: 'अल्पकालिक निविदा आमंत्रण सूचना (PCC रोड निर्माण)',
    content: 'ग्राम पंचायत रायपुर कलां अंतर्गत 400 मीटर सीसी रोड एवं नाली निर्माण कार्य हेतु पंजीकृत ठेकेदारों से मुहरबंद निविदाएं आमंत्रित की जाती हैं। अनुमानित लागत रु 8.50 लाख। निविदा प्रपत्र जमा करने की अंतिम तिथि 05 अक्टूबर 2026।',
    contact: 'ग्राम विकास अधिकारी, ब्लॉक सिधौली (सीतापुर)',
    city: 'सीतापुर',
    publishedDate: '2026-09-27'
  },
  {
    id: 'clf-3',
    type: 'obituary',
    title: 'पुण्यतिथि स्मरण: स्वर्गीय पं. बैजनाथ वाजपेयी जी',
    content: 'आपकी सादगी, कर्तव्यनिष्ठा और समाज सेवा के मूल्य हमारे जीवन का सदैव मार्गदर्शन करते रहेंगे। आपकी 10वीं पुण्यतिथि पर भावभीनी श्रद्धांजलि। - समस्त वाजपेयी परिवार, चौक, लखनऊ।',
    contact: 'वाजपेयी परिवार, लखनऊ',
    city: 'लखनऊ',
    publishedDate: '2026-09-27'
  },
  {
    id: 'clf-4',
    type: 'property',
    title: 'व्यावसायिक भूमि विक्रय हेतु उपलब्ध: सीतापुर बाईपास',
    content: 'सीतापुर बाईपास नेशनल हाईवे-24 पर 12,000 वर्ग फुट व्यावसायिक भूखंड गोदाम / मैरिज लॉन हेतु तत्काल बिक्री के लिए उपलब्ध। स्पष्ट दाखिल-खारिज और चौड़ा फ्रंट।',
    contact: '+91 98390 11223',
    city: 'सीतापुर',
    publishedDate: '2026-09-26'
  }
];

export const INITIAL_GRIEVANCES: GrievanceComplaint[] = [
  {
    id: 'grv-001',
    tokenNumber: 'SD-GRV-2026-8941',
    complainantName: 'राधेश्याम त्रिपाठी एडवोकेट',
    complainantEmail: 'radheshyam.adv@gmail.com',
    complainantPhone: '+91 94150 99887',
    articleUrl: 'https://swarnimdastavej.com/article/art-1',
    category: 'other',
    complaintDetails: 'खबर में उल्लिखित तहसील क्षेत्र के सीमांकन में एक गांव का नाम मुद्रण त्रुटिवश गलत प्रकाशित हो गया है, कृपया सुधार करें।',
    status: 'resolved',
    submittedAt: '2026-09-25T11:20:00Z',
    resolutionNotes: 'संपादकीय टीम द्वारा तहसील रिकॉर्ड से मिलान कर खबर में संबंधित गांव का नाम संशोधित कर दिया गया है। शिकायतकर्ता को ईमेल द्वारा सूचित किया गया।',
    resolvedAt: '2026-09-25T14:45:00Z'
  },
  {
    id: 'grv-002',
    tokenNumber: 'SD-GRV-2026-9022',
    complainantName: 'सुरेश चंद्र मौर्या',
    complainantEmail: 'suresh.maurya@yahoo.com',
    complainantPhone: '+91 98380 44556',
    category: 'defamation',
    complaintDetails: 'सीतापुर व्यापार मंडल की बैठक से संबंधित पूर्व प्रकाशित एक समाचार में व्यक्त किए गए कथन पर आपत्ति है।',
    status: 'under_review',
    submittedAt: '2026-09-26T16:00:00Z'
  }
];
