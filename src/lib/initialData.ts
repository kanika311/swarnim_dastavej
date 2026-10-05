import { Article, CitizenSubmission, EPaperEdition, Poll, AdBanner, ClassifiedItem, GrievanceComplaint, User, EPaperPricingPlan } from '@/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_1',
    name: 'रामेश्वर दयाल (प्रधान संपादक)',
    email: 'swarnimdastavej@gmail.com',
    phone: '+91 95196 231111',
    password: 'admin123@swarnim',
    role: 'admin',
    city: 'लखनऊ',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'verified',
    isActive: true,
    createdAt: '2026-08-01T10:00:00Z',
    lastLoginAt: '2026-09-28T09:15:00Z'
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
    kycStatus: 'verified',
    isActive: true,
    createdAt: '2026-08-05T11:00:00Z',
    lastLoginAt: '2026-09-28T08:30:00Z'
  },
  {
    id: 'user_reporter_1',
    name: 'सुनील कुमार वर्मा (विशेष संवाददाता)',
    email: 'sunil.reporter@swarnimdastavej.com',
    phone: '+91 91234 56789',
    role: 'staff_reporter',
    city: 'सुल्तानपुर',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'verified',
    isActive: true,
    createdAt: '2026-08-10T14:20:00Z',
    lastLoginAt: '2026-09-27T17:40:00Z'
  },
  {
    id: 'user_citizen_1',
    name: 'विकास शुक्ला (नागरिक पत्रकार - सुल्तानपुर)',
    email: 'vikas.citizen@gmail.com',
    phone: '+91 99182 34567',
    role: 'citizen_journalist',
    city: 'सुल्तानपुर',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'verified',
    kycDetails: {
      idProofType: 'Aadhaar Card',
      idNumber: 'XXXX-XXXX-4589',
      submittedAt: '2026-09-10T10:00:00Z',
      district: 'सुल्तानपुर'
    },
    isActive: true,
    createdAt: '2026-09-10T09:30:00Z',
    lastLoginAt: '2026-09-28T07:45:00Z'
  },
  {
    id: 'user_citizen_2',
    name: 'मो० रिज़वान खान (नागरिक पत्रकार - लखनऊ)',
    email: 'rizwan.journalist@yahoo.com',
    phone: '+91 94520 88712',
    role: 'citizen_journalist',
    city: 'लखनऊ',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'verified',
    kycDetails: {
      idProofType: 'Voter ID',
      idNumber: 'UP/24/182/9012',
      submittedAt: '2026-09-12T11:00:00Z',
      district: 'लखनऊ'
    },
    isActive: true,
    createdAt: '2026-09-12T10:15:00Z',
    lastLoginAt: '2026-09-26T16:20:00Z'
  },
  {
    id: 'user_citizen_3',
    name: 'दीपक अवस्थी (नागरिक पत्रकार - लखीमपुर)',
    email: 'deepak.awasthi@rediffmail.com',
    phone: '+91 98380 55432',
    role: 'citizen_journalist',
    city: 'लखीमपुर खीरी',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'pending',
    kycDetails: {
      idProofType: 'Aadhaar Card',
      idNumber: 'XXXX-XXXX-8921',
      submittedAt: '2026-09-27T08:30:00Z',
      district: 'लखीमपुर खीरी'
    },
    isActive: true,
    createdAt: '2026-09-27T08:00:00Z',
    lastLoginAt: '2026-09-27T08:45:00Z'
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
    kycStatus: 'not_submitted',
    isActive: true,
    createdAt: '2026-09-15T12:00:00Z',
    lastLoginAt: '2026-09-28T09:30:00Z'
  },
  {
    id: 'user_reader_2',
    name: 'प्रियंका मिश्रा (दैनिक पाठक)',
    email: 'priyanka.mishra24@gmail.com',
    phone: '+91 94150 77621',
    role: 'reader',
    city: 'सुल्तानपुर',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'not_submitted',
    isActive: true,
    createdAt: '2026-09-18T16:40:00Z',
    lastLoginAt: '2026-09-28T06:10:00Z'
  },
  {
    id: 'user_reader_3',
    name: 'राकेश चंद्र गुप्ता',
    email: 'rakesh.gupta.kanpur@gmail.com',
    phone: '+91 98391 22345',
    role: 'reader',
    city: 'कानपुर',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'not_submitted',
    isActive: true,
    createdAt: '2026-09-20T14:10:00Z',
    lastLoginAt: '2026-09-27T19:50:00Z'
  },
  {
    id: 'user_reader_4',
    name: 'सुमन लता रस्तोगी',
    email: 'suman.rastogi@yahoo.co.in',
    phone: '+91 97920 44556',
    role: 'reader',
    city: 'अयोध्या',
    preferredLanguage: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    kycStatus: 'not_submitted',
    isActive: false,
    createdAt: '2026-09-22T09:15:00Z',
    lastLoginAt: '2026-09-24T11:20:00Z'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'up-expressway-network-expansion-sultanpur-lucknow',
    headline: 'यूपी में हाईवे नेटवर्क का महा-विस्तार: लखनऊ-सुल्तानपुर 6 लेन कॉरिडोर को मंजूरी, यात्रा समय आधा होगा',
    subHeadline: 'कैबिनेट बैठक में 4,200 करोड़ रुपये की परियोजना पर मुहर, औद्योगिक गलियारे को मिलेगी नई रफ्तार',
    excerpt: 'उत्तर प्रदेश सरकार ने राजधानी लखनऊ से सुल्तानपुर तक 6 लेन ग्रीनफील्ड एक्सेस-कंट्रोल्ड हाईवे के निर्माण को हरी झंडी दे दी है।',
    body: `उत्तर प्रदेश कैबिनेट की अहम बैठक में राज्य के बुनियादी ढांचे को नई ऊंचाई देने वाला बड़ा फैसला लिया गया है। मुख्यमंत्री की अध्यक्षता में हुई बैठक में लखनऊ-सुल्तानपुर 6 लेन कॉरिडोर परियोजना को अंतिम स्वीकृति प्रदान की गई।

परियोजना की मुख्य विशेषताएं:
• 4,200 करोड़ रुपये की अनुमानित लागत से 138 किलोमीटर लंबा आधुनिक एक्सप्रेसवे बनेगा।
• सुल्तानपुर और कूरेभार के पास लॉजिस्टिक्स हब और एग्री-प्रोसेसिंग क्लस्टर स्थापित होंगे।
• लखनऊ से सुल्तानपुर की दूरी अब मात्र 1 घंटे में तय होगी।
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
    tags: ['उत्तर प्रदेश', 'लखनऊ', 'सुल्तानपुर', 'एक्सप्रेसवे', 'बुनियादी ढांचा', 'कैबिनेट'],
    readingTimeMinutes: 3,
    status: 'published'
  },
  {
    id: 'art-2',
    slug: 'sultanpur-gomti-river-cleanliness-drive-citizen-initiative',
    headline: 'सुल्तानपुर में गोमती नदी को पुनर्जीवित करने आगे आए युवा: श्रमदान से निकाला 10 टन कचरा, प्रशासन ने भी दिया साथ',
    subHeadline: 'स्वर्णिम दूत ग्राउंड रिपोर्ट: स्थानीय नागरिकों और स्वयंसेवकों की मुहिम रंग लाई',
    excerpt: 'सुल्तानपुर की ऐतिहासिक गोमती नदी को प्लास्टिक मुक्त बनाने के लिए 300 से अधिक युवाओं ने रविवार सुबह विशाल स्वच्छता अभियान चलाया।',
    body: `सुल्तानपुर की पहचान कही जाने वाली गोमती नदी के अस्तित्व को बचाने के लिए शहर के जागरूक नागरिकों और युवाओं ने मिसाल पेश की है। रविवार सुबह 6 बजे से ही लालबाग और वैदेही वाटिका घाट पर युवाओं, व्यापारियों और सेवानिवृत्त अधिकारियों का हुजूम उमड़ पड़ा।

अभियान के मुख्य बिंदु:
1. पांच घंटे के निरंतर श्रमदान से नदी की धारा से लगभग 10 टन जलकुंभी, प्लास्टिक कचरा और सिल्ट हटाया गया।
2. नगर पालिका परिषद सुल्तानपुर ने कचरा उठाने के लिए 6 ट्रैक्टर-ट्रॉली और 2 जेसीबी मशीनें मौके पर उपलब्ध कराईं।
3. युवाओं ने नदी के दोनों किनारों पर 500 औषधीय व छायादार पौधे रोपने का संकल्प लिया।

स्थानीय समाजसेवी विकास शुक्ला ने बताया कि यह अभियान हर रविवार को निरंतर जारी रहेगा जब तक कि सरायन नदी का जल दोबारा आचमन योग्य नहीं हो जाता।`,
    category: 'sultanpur',
    city: 'सुल्तानपुर',
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
    tags: ['सुल्तानपुर', 'गोमती नदी', 'स्वच्छता', 'नागरिक पत्रकार', 'पर्यावरण'],
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
  },
  // ENGLISH ARTICLES
  {
    id: 'art-en-1',
    slug: 'up-expressway-network-expansion-lucknow-sultanpur',
    headline: 'Mega Expansion of UP Highway Network: Lucknow-Sultanpur 6-Lane Corridor Approved, Travel Time Halved',
    subHeadline: 'Cabinet approves ₹4,200 crore high-speed greenfield project to accelerate industrial corridors and agribusiness',
    excerpt: 'Uttar Pradesh government gives green signal to the 138-km 6-lane access-controlled greenfield expressway connecting capital Lucknow with Sultanpur.',
    body: `In a landmark cabinet meeting chaired by the Chief Minister, the Uttar Pradesh government approved the major high-speed Lucknow-Sultanpur 6-lane expressway project.

Key Highlights of the Project:
• Constructed at an estimated cost of ₹4,200 crore spanning 138 kilometers of modern greenfield expressway.
• Dedicated logistics hub and agro-processing clusters to be established near Sultanpur and Kurebhar.
• Commuting time between Lucknow and Sultanpur slashed to just 1 hour.
• Direct, high-speed freight access for regional sugarcane and grain farmers to major agricultural mandis in Lucknow and Delhi NCR.

Officials from PWD and UPEIDA confirmed that land acquisition will commence next month, with target commissioning slated for 2028.`,
    category: 'state',
    city: 'Lucknow',
    language: 'en',
    coverImage: 'https://images.unsplash.com/photo-1545158826-6a3196c80251?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_editor_1',
      name: 'Anuradha Awasthi',
      role: 'editor'
    },
    isBreaking: true,
    isTrending: true,
    publishedAt: '2026-09-27T08:30:00Z',
    viewsCount: 16800,
    likesCount: 1120,
    commentsCount: 84,
    sharesCount: 420,
    tags: ['Uttar Pradesh', 'Lucknow', 'Sultanpur', 'Expressway', 'Infrastructure', 'Cabinet'],
    readingTimeMinutes: 3,
    status: 'published'
  },
  {
    id: 'art-en-2',
    slug: 'sultanpur-gomti-river-cleanliness-drive-citizen-initiative',
    headline: 'Youth Step Forward to Revitalize Gomti River in Sultanpur: 10 Tons of Waste Removed with Citizen Action',
    subHeadline: 'Swarnim Dastavej Ground Report: Community-driven environmental action inspires civic authorities',
    excerpt: 'Over 300 passionate volunteers and young citizens gathered early Sunday morning at Sultanpur ghats to clean the historic Gomti river.',
    body: `Demonstrating exemplary civic consciousness, citizens and youths in Sultanpur spearheaded a massive cleanup movement along the banks of the Gomti river.

Key Milestones:
1. Five hours of volunteer manual labor retrieved over 10 tons of water hyacinth, plastics, and debris.
2. Sultanpur Municipal Council assisted by providing 6 tractor-trolleys and earthmoving machinery.
3. Volunteers took a pledge to plant 500 indigenous shade and medicinal trees along both river banks.

Local social activist Vikas Shukla stated that the weekend drives will continue until the historic waterbody achieves clean ecological balance.`,
    category: 'sultanpur',
    city: 'Sultanpur',
    language: 'en',
    coverImage: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_citizen_1',
      name: 'Vikas Shukla (Citizen Journalist)',
      role: 'citizen_journalist'
    },
    isBreaking: false,
    isTrending: true,
    publishedAt: '2026-09-27T09:15:00Z',
    viewsCount: 9400,
    likesCount: 1350,
    commentsCount: 105,
    sharesCount: 580,
    tags: ['Sultanpur', 'Gomti River', 'Cleanliness', 'Environment', 'Citizen Journalism'],
    readingTimeMinutes: 3,
    status: 'published'
  },
  {
    id: 'art-en-3',
    slug: 'isro-gaganyaan-crew-module-unmanned-mission-success',
    headline: 'ISRO Scripts History: Flawless Splashdown of Gaganyaan Crew Module in Bay of Bengal',
    subHeadline: 'Unmanned test vehicle accomplishes all critical mission milestones with pin-point precision; PM congratulates scientists',
    excerpt: 'Indian Space Research Organisation (ISRO) successfully validated the Crew Escape System and emergency splashdown procedures for India’s premier human spaceflight mission.',
    body: `The Indian Space Research Organisation (ISRO) recorded another historic milestone from the Satish Dhawan Space Centre in Sriharikota with the successful execution of the Gaganyaan unmanned flight test vehicle.

Mission Milestones:
• Crew Escape System executed flawless separation sequence at supersonic velocity.
• Three stage drogue and main parachute deployment brought the module gently into Bay of Bengal waters.
• Indian Navy recovery divers retrieved the intact crew module within 40 minutes.
• All avionics and life-support simulation telemetry functioned within optimal operational parameters.`,
    category: 'national',
    city: 'New Delhi',
    language: 'en',
    coverImage: 'https://images.unsplash.com/photo-1517976487502-5f71bb4028d6?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_reporter_1',
      name: 'Sunil Kumar Verma',
      role: 'staff_reporter'
    },
    isBreaking: true,
    isTrending: true,
    publishedAt: '2026-09-27T07:45:00Z',
    viewsCount: 25800,
    likesCount: 3890,
    commentsCount: 190,
    sharesCount: 1100,
    tags: ['ISRO', 'Gaganyaan', 'Space Mission', 'India', 'Science'],
    readingTimeMinutes: 3,
    status: 'published'
  },
  {
    id: 'art-en-4',
    slug: 'lucknow-metro-phase-2-charbagh-to-vasant-kunj',
    headline: 'Lucknow Metro Phase-2: Charbagh to Vasant Kunj DPR Approved, 12 Stations to Transform Old City Connectivity',
    subHeadline: 'Major relief for commuters across Aminabad, Chowk, and KGMU medical hub',
    excerpt: 'The Union Ministry gives in-principle clearance for the 11.16 km East-West Metro Corridor traversing the historic heart of Lucknow.',
    body: `Historic commercial districts in Old Lucknow are set to welcome modern metro rail connectivity. The UP Metro Rail Corporation (UPMRC) has secured clearance for the 11.165 km East-West Corridor comprising 12 stations (7 underground and 5 elevated).

The new line links Charbagh Railway Terminus through Aminabad, Chowk, and KGMU to Vasant Kunj, slashing congested road journey times from 90 minutes to under 20 minutes.`,
    category: 'lucknow',
    city: 'Lucknow',
    language: 'en',
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_editor_1',
      name: 'Rameshwar Dayal',
      role: 'admin'
    },
    isBreaking: false,
    isTrending: false,
    publishedAt: '2026-09-26T18:00:00Z',
    viewsCount: 12400,
    likesCount: 920,
    commentsCount: 52,
    sharesCount: 280,
    tags: ['Lucknow', 'Metro', 'Urban Transport', 'Aminabad', 'Chowk'],
    readingTimeMinutes: 3,
    status: 'published'
  },
  {
    id: 'art-en-5',
    slug: 'ayodhya-international-ramayan-museum-construction',
    headline: 'World-Class International Ramayana Museum in Ayodhya: Traditions of Over 100 Nations to Be Showcased',
    subHeadline: '10-acre cultural complex on Saryu banks to feature immersive 3D holographic theatres and digitised palm-leaf manuscripts',
    excerpt: 'Construction of the sprawling International Ramayana Museum and cultural pavilion is in full swing near the sacred banks of river Saryu.',
    body: `Pilgrims and international scholars visiting Ayodhya will soon experience a premier global cultural repository. The 10-acre complex will house Ramayana traditions and folk arts spanning Indonesia, Thailand, Cambodia, Sri Lanka, Nepal, and Mauritius with 360-degree immersive projection theatres.`,
    category: 'state',
    city: 'Ayodhya',
    language: 'en',
    coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_reporter_1',
      name: 'Sunil Kumar Verma',
      role: 'staff_reporter'
    },
    isBreaking: false,
    isTrending: true,
    publishedAt: '2026-09-26T15:30:00Z',
    viewsCount: 17200,
    likesCount: 1600,
    commentsCount: 95,
    sharesCount: 460,
    tags: ['Ayodhya', 'Heritage', 'Culture', 'Tourism', 'Uttar Pradesh'],
    readingTimeMinutes: 4,
    status: 'published'
  },
  {
    id: 'art-en-6',
    slug: 'pm-kusum-solar-pump-scheme-uttar-pradesh',
    headline: 'PM-KUSUM Scheme: Up to 70% Subsidy on Solar Pumps for UP Farmers, Online Registrations Open',
    subHeadline: 'Eliminate diesel fuel costs for tubewells and earn revenue by supplying surplus clean power to grid',
    excerpt: 'The Uttar Pradesh Agriculture Department invites applications on a first-come basis for 2 HP to 10 HP high-efficiency solar water pumping systems.',
    body: `(Sponsored Article - Department of Agriculture & UPNEDA)
Farmers across Uttar Pradesh can now drastically cut their irrigation costs with up to 70% direct government subsidies on solar pump systems, coupled with guaranteed grid buy-back for surplus solar energy.`,
    category: 'business',
    city: 'Lucknow',
    language: 'en',
    coverImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_editor_1',
      name: 'Editorial Desk (Sponsored)',
      role: 'editor'
    },
    isBreaking: false,
    isTrending: false,
    isSponsored: true,
    sponsoredBy: 'UP New & Renewable Energy Development Agency (UPNEDA)',
    publishedAt: '2026-09-26T11:00:00Z',
    viewsCount: 8400,
    likesCount: 410,
    commentsCount: 22,
    sharesCount: 180,
    tags: ['Sponsored', 'Solar Energy', 'Farmers', 'Agriculture', 'Subsidy'],
    readingTimeMinutes: 2,
    status: 'published'
  },
  {
    id: 'art-en-7',
    slug: 'border-gavaskar-trophy-team-india-training-camp',
    headline: 'Border-Gavaskar Trophy: Team India Kicks Off High-Intensity Training Camp in Kanpur, Young Pacers Fire in Nets',
    subHeadline: 'Rohit Sharma and Virat Kohli lead comprehensive batting sessions tackling pace and bounce',
    excerpt: 'The Indian cricket contingent commenced intensive practice drills at Green Park Stadium ahead of the premier test series.',
    body: `Star cricketers assembled at Kanpur’s historic Green Park stadium to fine-tune strategies for the forthcoming Border-Gavaskar Trophy. The coaching staff oversaw dedicated yorker drills and short-ball countering techniques under lights.`,
    category: 'sports',
    city: 'Kanpur',
    language: 'en',
    coverImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_reporter_1',
      name: 'Sunil Kumar Verma',
      role: 'staff_reporter'
    },
    isBreaking: false,
    isTrending: true,
    publishedAt: '2026-09-26T14:15:00Z',
    viewsCount: 21500,
    likesCount: 3100,
    commentsCount: 135,
    sharesCount: 520,
    tags: ['Cricket', 'Team India', 'Sports', 'Kanpur', 'Test Cricket'],
    readingTimeMinutes: 3,
    status: 'published'
  },
  // URDU ARTICLES
  {
    id: 'art-ur-1',
    slug: 'up-expressway-network-expansion-lucknow-sultanpur-ur',
    headline: 'یوپی میں ہائی وے نیٹ ورک کی بڑی توسیع: لکھنؤ-سلطان پور 6 لین کوریڈور کی منظوری، سفری وقت آدھا ہوگا',
    subHeadline: 'کابینہ میٹنگ میں 4,200 کروڑ روپے کے منصوبے پر مہر، صنعتی کوریڈور کو نئی رفتار ملے گی',
    excerpt: 'اتر پردیش حکومت نے راجدھانی لکھنؤ سے سلطان پور تک 6 لین ایکسپریس وے کی تعمیر کو منظوری دے دی ہے۔',
    body: `اتر پردیش کابینہ کی اہم میٹنگ میں ریاست کے بنیادی ڈھانچے کو نئی بلندی دینے والا بڑا فیصلہ لیا گیا ہے۔ لکھنؤ-سلطان پور 6 لین کوریڈور منصوبے کو حتمی منظوری مل گئی ہے۔`,
    category: 'state',
    city: 'لکھنؤ',
    language: 'ur',
    coverImage: 'https://images.unsplash.com/photo-1545158826-6a3196c80251?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_editor_1',
      name: 'انورادھا اوستھی',
      role: 'editor'
    },
    isBreaking: true,
    isTrending: true,
    publishedAt: '2026-09-27T08:30:00Z',
    viewsCount: 6500,
    likesCount: 420,
    commentsCount: 38,
    sharesCount: 180,
    tags: ['اتر پردیش', 'لکھنؤ', 'سلطان پور', 'ایکسپریس وے'],
    readingTimeMinutes: 3,
    status: 'published'
  },
  {
    id: 'art-ur-2',
    slug: 'isro-gaganyaan-crew-module-unmanned-mission-success-ur',
    headline: 'اسرو کی تاریخی کامیابی: گگن یان مشن کے کرو ماڈیول کی بحیرہ بنگال میں محفوظ لینڈنگ',
    subHeadline: 'خلا میں ہندوستان کا دبدبہ، بغیر پائلٹ کے ٹیسٹ وہیکل نے تمام طے شدہ معیارات کامیابی سے مکمل کیے',
    excerpt: 'ہندوستانی خلائی تحقیقی تنظیم (اسرو) نے گگن یان مشن کے پہلے اہم مرحلے کو کامیابی کے ساتھ مکمل کر لیا ہے۔',
    body: `سری ہریکوٹا سے داغے گئے گگن یان کے بغیر پائلٹ ٹیسٹ وہیکل نے بحیرہ بنگال میں محفوظ لینڈنگ کی۔ تمام سسٹمز بہترین حالت میں پائے گئے۔`,
    category: 'national',
    city: 'نئی دہلی',
    language: 'ur',
    coverImage: 'https://images.unsplash.com/photo-1517976487502-5f71bb4028d6?w=1000&auto=format&fit=crop&q=80',
    author: {
      id: 'user_reporter_1',
      name: 'سنیل کمار ورما',
      role: 'staff_reporter'
    },
    isBreaking: true,
    isTrending: true,
    publishedAt: '2026-09-27T07:45:00Z',
    viewsCount: 8200,
    likesCount: 710,
    commentsCount: 49,
    sharesCount: 260,
    tags: ['اسرو', 'گگن یان', 'خلائی سائنس', 'ہندوستان'],
    readingTimeMinutes: 3,
    status: 'published'
  }
];

export const SEED_ARTICLE_IDS = new Set(INITIAL_ARTICLES.map((article) => article.id));
export const SEED_ARTICLE_HEADLINES = new Set(INITIAL_ARTICLES.map((article) => article.headline.trim()));

export function isSeedArticle(article: { id?: string; headline?: string }) {
  if (article.id && SEED_ARTICLE_IDS.has(article.id)) return true;
  if (article.headline && SEED_ARTICLE_HEADLINES.has(article.headline.trim())) return true;
  return false;
}

export const INITIAL_SUBMISSIONS: CitizenSubmission[] = [
  {
    id: 'sub-101',
    headline: 'सुल्तानपुर-कुड़वार मार्ग पर पुलिया टूटने से 20 गांवों का संपर्क कटा, स्कूल जाने वाले बच्चे परेशान',
    subHeadline: 'बारिश के बाद धंसी पुलिया, ग्रामीणों ने खुद बांस-बल्ली लगाकर बनाया कामचलाऊ रास्ता',
    body: 'सुल्तानपुर जिले के कुड़वार तहसील अंतर्गत ग्राम पंचायत के पास मुख्य मार्ग की पुलिया धंस जाने से दो दर्जन गांवों का आवागमन पूरी तरह ठप हो गया है। प्राथमिक विद्यालय और कन्या इंटर कॉलेज जाने वाली छात्राओं को प्रतिदिन जान जोखिम में डालकर नाला पार करना पड़ रहा है। ग्रामीणों का आरोप है कि पिछले छह माह से लोक निर्माण विभाग को लगातार प्रार्थना पत्र दिए गए, परंतु कोई ठोस कार्रवाई नहीं हुई।',
    category: 'sultanpur',
    city: 'सुल्तानपुर',
    language: 'hi',
    submittedBy: {
      id: 'user_citizen_1',
      name: 'विकास शुक्ला',
      role: 'citizen_journalist',
      phone: '+91 99182 34567',
      district: 'सुल्तानपुर'
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
      locationName: 'कुड़वार चौराहा, मुख्य मार्ग, सुल्तानपुर',
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
    headline: 'कादीपुर सुल्तानपुर: सामुदायिक स्वास्थ्य केंद्र में डॉक्टरों की कमी, मरीज 40 किमी दूर जिला अस्पताल रेफर होने को विवश',
    subHeadline: 'अल्ट्रासाउंड और डिजिटल एक्स-रे मशीनें धूल फांक रहीं, टेक्नीशियन के पद 3 वर्षों से रिक्त',
    body: 'महमूदाबाद ब्लॉक के सामुदायिक स्वास्थ्य केंद्र में चिकित्सा सुविधाओं की बदहाली चरम पर है। तीन लाख से अधिक ग्रामीण आबादी वाले इस क्षेत्र में 5 स्वीकृत डॉक्टरों के सापेक्ष केवल 1 संविदा चिकित्सक तैनात हैं।',
    category: 'sultanpur',
    city: 'सुल्तानपुर',
    language: 'hi',
    submittedBy: {
      id: 'user_citizen_1',
      name: 'विकास शुक्ला',
      role: 'citizen_journalist',
      district: 'सुल्तानपुर'
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
    editionTitle: 'स्वर्णिम दस्तावेज़ - लखनऊ दैनिक मुख्य संस्करण (हिन्दी)',
    language: 'hi',
    pagesCount: 6,
    isActive: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
    pages: [
      {
        pageNumber: 1,
        title: 'मुख्य पृष्ठ (Front Page) - लखनऊ-सुल्तानपुर एक्सप्रेसवे, गगनयान टेस्ट',
        imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 2,
        title: 'प्रदेश एवं प्रादेशिक हलचल (State & Regional News)',
        imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 3,
        title: 'अवध परिक्रमा (लखनऊ व सुल्तानपुर नगर विशेष)',
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
    id: 'epaper-2026-09-27-en-lucknow',
    date: '2026-09-27',
    editionCity: 'Lucknow',
    editionTitle: 'Swarnim Dastavej - English National & Regional Edition',
    language: 'en',
    pagesCount: 6,
    isActive: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80',
    pages: [
      {
        pageNumber: 1,
        title: 'Front Page - Mega Expressway Approved, Gaganyaan Module Splashdown Success',
        imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 2,
        title: 'National & State Digest - Infrastructure & Governance Decisions',
        imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 3,
        title: 'Awadh & City Chronicle - Lucknow, Sultanpur & Ayodhya Spotlight',
        imageUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 4,
        title: 'Editorial & Opinion - Swarnim Dastavej Perspectives',
        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 5,
        title: 'Business, Markets & Technology - PM Kusum Solar Expansion',
        imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 6,
        title: 'Sports Arena - Border-Gavaskar Trophy Preparations at Green Park',
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'epaper-2026-09-27-ur-lucknow',
    date: '2026-09-27',
    editionCity: 'لکھنؤ',
    editionTitle: 'سورنم دستاویز - لکھنؤ و اودھ ایڈیشن (اردو)',
    language: 'ur',
    pagesCount: 6,
    isActive: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=600&auto=format&fit=crop&q=80',
    pages: [
      {
        pageNumber: 1,
        title: 'صفحہ اول - لکھنؤ-سلطان پور ایکسپریس وے، گگن یان مشن کی شاندار کامیابی',
        imageUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 2,
        title: 'قومی اور ریاستی خبریں - اتر پردیش ترقیاتی اقدامات',
        imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 3,
        title: 'شہر لکھنؤ اور خطہ اودھ کی سرگرمیاں',
        imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 4,
        title: 'اداریہ اور مضامین - سورنم بصیرت',
        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 5,
        title: 'تجارت اور کھیل کود کی تازہ ترین اطلاعات',
        imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80'
      },
      {
        pageNumber: 6,
        title: 'عوامی اشتہارات اور اعلانات',
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'epaper-2026-09-26-lucknow',
    date: '2026-09-26',
    editionCity: 'लखनऊ',
    editionTitle: 'स्वर्णिम दस्तावेज़ - लखनऊ दैनिक (26 सितम्बर)',
    language: 'hi',
    pagesCount: 6,
    isActive: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80',
    pages: [
      {
        pageNumber: 1,
        title: 'मुख्य पृष्ठ',
        imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'epaper-2026-09-26-en-lucknow',
    date: '2026-09-26',
    editionCity: 'Lucknow',
    editionTitle: 'Swarnim Dastavej - English Edition (26 September)',
    language: 'en',
    pagesCount: 6,
    isActive: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
    pages: [
      {
        pageNumber: 1,
        title: 'Main Edition - Lucknow Metro Phase-2 and Regional Updates',
        imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'
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
    title: 'सार्वजनिक सूचना: नगर पालिका परिषद सुल्तानपुर',
    content: 'सर्वसाधारण को सूचित किया जाता है कि वार्ड संख्या 14 एवं 15 में पाइपलाइन इंटरकनेक्शन कार्य हेतु 28 एवं 29 सितम्बर को प्रातः 10 से सायं 4 बजे तक जलापूर्ति बाधित रहेगी। नागरिक पर्याप्त जल भंडारण कर लें। - अधिशासी अधिकारी, नपाप सुल्तानपुर।',
    contact: '05862-242100',
    city: 'सुल्तानपुर',
    publishedDate: '2026-09-27'
  },
  {
    id: 'clf-2',
    type: 'tender',
    title: 'अल्पकालिक निविदा आमंत्रण सूचना (PCC रोड निर्माण)',
    content: 'ग्राम पंचायत रायपुर कलां अंतर्गत 400 मीटर सीसी रोड एवं नाली निर्माण कार्य हेतु पंजीकृत ठेकेदारों से मुहरबंद निविदाएं आमंत्रित की जाती हैं। अनुमानित लागत रु 8.50 लाख। निविदा प्रपत्र जमा करने की अंतिम तिथि 05 अक्टूबर 2026।',
    contact: 'ग्राम विकास अधिकारी, ब्लॉक लंभुआ (सुल्तानपुर)',
    city: 'सुल्तानपुर',
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
    title: 'व्यावसायिक भूमि विक्रय हेतु उपलब्ध: सुल्तानपुर बाईपास',
    content: 'सुल्तानपुर बाईपास लखनऊ-वाराणसी हाईवे पर 12,000 वर्ग फुट व्यावसायिक भूखंड गोदाम / मैरिज लॉन हेतु तत्काल बिक्री के लिए उपलब्ध। स्पष्ट दाखिल-खारिज और चौड़ा फ्रंट।',
    contact: '+91 98390 11223',
    city: 'सुल्तानपुर',
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
    complaintDetails: 'सुल्तानपुर व्यापार मंडल की बैठक से संबंधित पूर्व प्रकाशित एक समाचार में व्यक्त किए गए कथन पर आपत्ति है।',
    status: 'under_review',
    submittedAt: '2026-09-26T16:00:00Z'
  }
];

export const INITIAL_PRICING_PLANS: EPaperPricingPlan[] = [
  {
    id: 'plan_single',
    title: 'दैनिक एकल अंक (1 Day Pass)',
    titleEn: 'Single Edition (1 Day Pass)',
    price: 1,
    duration: 'single_edition',
    durationLabel: '1 दिन / आज का सम्पूर्ण ई-पेपर',
    durationLabelEn: '1 Day / Today\'s Edition',
    description: 'मात्र ₹1 में आज का पूरा ई-पेपर (सभी पृष्ठ 1 से 6) तुरंत अनलॉक करें।',
    descriptionEn: 'Unlock today\'s full newspaper (all pages 1-6) for just ₹1.',
    features: [
      'आज का संपूर्ण ई-पेपर अनलॉक',
      'पृष्ठ 2 से 6 तक तुरंत वाचन',
      'अल्ट्रा हाई रेजोल्यूशन ज़ूम',
      'बिना किसी विज्ञापन अवरोध के'
    ],
    isPopular: true,
    isActive: true,
    order: 1,
    createdAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'plan_monthly',
    title: 'मासिक सदस्यता (Monthly Unlimited)',
    titleEn: 'Monthly Unlimited Plan',
    price: 29,
    duration: 'monthly',
    durationLabel: '1 माह (30 दिन)',
    durationLabelEn: '1 Month (30 Days)',
    description: '30 दिनों तक लखनऊ, सुल्तानपुर एवं सभी क्षेत्रीय दैनिक ई-पेपर का असीमित वाचन।',
    descriptionEn: 'Unlimited daily reading for 30 days across Lucknow, Sultanpur & all editions.',
    features: [
      '30 दिन असीमित ई-पेपर एक्सेस',
      'सभी जिलों के संस्करण',
      'पुराने अंक (30 दिन आर्काइव)',
      'मोबाइल व कंप्यूटर दोनों पर'
    ],
    isPopular: false,
    isActive: true,
    order: 2,
    createdAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'plan_yearly',
    title: 'वार्षिक सुपर सेवर (Yearly Super Plan)',
    titleEn: 'Yearly Super Saver Plan',
    price: 340,
    duration: 'yearly',
    durationLabel: '1 वर्ष (365 दिन)',
    durationLabelEn: '1 Year (365 Days)',
    description: 'पूरे 365 दिन स्वर्णिम दस्तावेज़ का सम्पूर्ण ई-पेपर और डिजिटल विशेषांक। भारी बचत!',
    descriptionEn: 'Full 365 days unlimited e-paper, special editions & daily PDF downloads.',
    features: [
      '365 दिन असीमित ई-पेपर एक्सेस',
      'दैनिक PDF संस्करण डाउनलोड',
      'सभी विशेष और सप्लीमेंट अंक',
      'प्राथमिकता पाठक हेल्पलाइन',
      'बचत: ₹600+ की वार्षिक छूट'
    ],
    isPopular: false,
    isActive: true,
    order: 3,
    createdAt: '2026-09-01T00:00:00Z'
  }
];
