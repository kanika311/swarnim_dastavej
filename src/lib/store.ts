import { 
  Article, 
  CitizenSubmission, 
  User, 
  EPaperEdition, 
  Poll, 
  AdBanner, 
  ClassifiedItem, 
  GrievanceComplaint,
  SubmissionStatus,
  UserRole,
  SiteSettings
} from '@/types';
import { 
  INITIAL_ARTICLES, 
  INITIAL_SUBMISSIONS, 
  INITIAL_USERS, 
  INITIAL_EPAPER_EDITIONS, 
  INITIAL_POLL, 
  INITIAL_ADS, 
  INITIAL_CLASSIFIEDS, 
  INITIAL_GRIEVANCES 
} from './initialData';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'स्वर्णिम दस्तावेज़ (Swarnim Dastavej)',
  tagline: 'उत्तर प्रदेश का अग्रणी, निष्पक्ष एवं निर्भीक हिंदी दैनिक समाचार पत्र व डिजिटल मीडिया नेटवर्क',
  email: 'swarnimdastavej@gmail.com',
  phone: '+91 95196 231111',
  address: 'Argada hussainganj, behind jwala hotel. Lucknow -226001',
  registrationNo: 'UPHIN/26/A7984',
  editorInChief: 'रामेश्वर दयाल (Rameshwar Dayal)',
  publisher: 'स्वर्णिम दस्तावेज़ प्रकाशन, लखनऊ',
  facebookUrl: 'https://facebook.com',
  twitterUrl: 'https://twitter.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  privacyPolicy: `## गोपनीयता नीति (Privacy Policy) - स्वर्णिम दस्तावेज़

अंतिम अद्यतन: 2026 | पंजीयन संख्या: UPHIN/26/A7984

'स्वर्णिम दस्तावेज़' (Swarnim Dastavej) अपने पाठकों, आगंतुकों, और नागरिक संवाददाताओं की व्यक्तिगत गोपनीयता की पूर्ण रक्षा हेतु कटिबद्ध है। यह नीति स्पष्ट करती है कि हमारी वेबसाइट और डिजिटल सेवाओं के उपयोग के दौरान आपकी कौन-सी जानकारी एकत्रित की जाती है और उसे किस प्रकार सुरक्षित रखा जाता है।

### 1. व्यक्तिगत जानकारी का संग्रह
- **नागरिक पत्रकारिता (Citizen Journalism)**: जब आप हमारे पोर्टल पर समाचार, फोटो, अथवा वीडियो रिपोर्ट अपलोड करते हैं, तो आपकी पहचान, मोबाइल नंबर और जिला प्रमाणिक सत्यापन हेतु संगृहीत किया जाता है।
- **शिकायत पंजीकरण (IT Rules 2021)**: सूचना प्रौद्योगिकी (मध्यवर्ती संदर्शिका एवं डिजिटल मीडिया आचार संहिता) नियमावली 2021 के अनुपालनार्थ दर्ज की गई विधिक शिकायतों में शिकायतकर्ता का नाम और संपर्क विवरण नियमानुसार दर्ज किया जाता है।
- **डिजिटल ई-पेपर एवं सदस्यता**: ई-पेपर डाउनलोड एवं वैयक्तिकृत समाचार प्राथमिकताओं के लिए आवश्यक तकनीकी लॉग।

### 2. एकत्रित जानकारी का उपयोग
- समाचार सामग्री की सत्यता, स्रोत और प्रामाणिकता की पुष्टि के लिए।
- ई-पेपर तथा महत्वपूर्ण ब्रेकिंग न्यूज़ अलर्ट्स प्रेषित करने हेतु।
- विधिक व विनियामक अनुपालन तथा शिकायत निवारण के लिए।
- हम आपकी व्यक्तिगत जानकारी को किसी भी तीसरे पक्ष, विज्ञापनदाता अथवा विपणन कंपनी को नहीं बेचते हैं।

### 3. डेटा सुरक्षा और सुरक्षा मानक
हम आपके डेटा की सुरक्षा के लिए अत्याधुनिक एन्क्रिप्शन और सुरक्षा प्रोटोकॉल का उपयोग करते हैं।

### 4. संपर्क सूत्र एवं नोडल अधिकारी
गोपनीयता नीति अथवा डेटा सुरक्षा से संबंधित किसी भी प्रश्न के लिए संपर्क करें:
- **ईमेल**: swarnimdastavej@gmail.com
- **हेल्पलाइन / फोन**: +91 95196 231111
- **संपादकीय कार्यालय**: Argada hussainganj, behind jwala hotel. Lucknow -226001
- **पंजीकरण संख्या**: RNI No. UPHIN/26/A7984`,
  termsOfService: `## नियम एवं शर्तें (Terms & Conditions) - स्वर्णिम दस्तावेज़

अंतिम अद्यतन: 2026

स्वर्णिम दस्तावेज़ (Swarnim Dastavej) की वेबसाइट, मोबाइल इंटरफेस अथवा ई-पेपर का उपयोग करने पर आप निम्न शर्तों से आबद्ध होने की पूर्ण सहमति प्रदान करते हैं:

### 1. बौद्धिक संपदा अधिकार एवं कॉपीराइट
स्वर्णिम दस्तावेज़ पर प्रकाशित सभी लेख, आलेख, संपादकीय, छायाचित्र, वीडियो और ई-पेपर 'स्वर्णिम दस्तावेज़ प्रकाशन' की संरक्षित बौद्धिक संपदा हैं। किसी भी सामग्री का अनधिकृत व्यावसायिक उपयोग, कापी अथवा पुनःप्रकाशन दण्डनीय अपराध है।

### 2. नागरिक पत्रकारिता आचार संहिता
- कोई भी नागरिक पत्रकार अथवा पाठक ऐसी सामग्री प्रेषित नहीं करेगा जो मानहानिकारक, भ्रामक, साम्प्रदायिक सद्भाव बिगाड़ने वाली अथवा भारतीय विधि के प्रतिकूल हो।
- पत्रकारिता के स्थापित मानकों और प्रेस परिषद (PCI) के दिशानिर्देशों का उल्लंघन पाए जाने पर सदस्य का खाता तत्काल निरस्त किया जा सकता है।

### 3. विधिक क्षेत्राधिकार
किसी भी विवाद अथवा कानूनी वाद की स्थिति में न्यायिक क्षेत्राधिकार केवल माननीय न्यायालय लखनऊ, उत्तर प्रदेश होगा।

### 4. संपर्क एवं आधिकारिक संवाद
- **ईमेल**: swarnimdastavej@gmail.com
- **दूरभाष**: +91 95196 231111
- **कार्यालय**: Argada hussainganj, behind jwala hotel. Lucknow -226001`,
  editorialPolicy: `## संपादकीय नीति एवं आचार संहिता (Editorial Policy)

'स्वर्णिम दस्तावेज़' निर्भीक, निष्पक्ष एवं जनसरोकारी पत्रकारिता के सिद्धांतों पर अडिग है। हम भारतीय प्रेस परिषद (PCI) और डिजिटल मीडिया आचार संहिता (IT Rules 2021) का पूर्णतः अनुपालन करते हैं।`,
  updatedAt: new Date().toISOString()
};

// Global singleton in-memory state for API routes and SSR
class PlatformStore {
  private articles: Article[] = [...INITIAL_ARTICLES];
  private submissions: CitizenSubmission[] = [...INITIAL_SUBMISSIONS];
  private users: User[] = [...INITIAL_USERS];
  private epaperEditions: EPaperEdition[] = [...INITIAL_EPAPER_EDITIONS];
  private deletedEpaperIds = new Set<string>();
  private deletedUserIds = new Set<string>();
  private poll: Poll = { ...INITIAL_POLL };
  private ads: AdBanner[] = [...INITIAL_ADS];
  private deletedAdIds = new Set<string>();
  private classifieds: ClassifiedItem[] = [...INITIAL_CLASSIFIEDS];
  private grievances: GrievanceComplaint[] = [...INITIAL_GRIEVANCES];
  private siteSettings: SiteSettings = { ...DEFAULT_SETTINGS };


  // Articles
  getArticles(filter?: { category?: string; city?: string; search?: string; language?: string }) {
    let list = [...this.articles];
    if (filter?.language && filter.language !== 'all') {
      list = list.filter(a => (a.language || 'hi') === filter.language);
    }
    if (filter?.category && filter.category !== 'all') {
      list = list.filter(a => a.category.toLowerCase() === filter.category?.toLowerCase());
    }
    if (filter?.city && filter.city !== 'all') {
      list = list.filter(a => a.city.toLowerCase() === filter.city?.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(a => 
        a.headline.toLowerCase().includes(q) || 
        a.body.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getArticleById(id: string) {
    return this.articles.find(a => a.id === id || a.slug === id);
  }

  createArticle(data: Partial<Article>): Article {
    const newArticle: Article = {
      id: `art-${Date.now()}`,
      slug: data.headline ? data.headline.slice(0, 40).replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-').toLowerCase() : `art-${Date.now()}`,
      headline: data.headline || 'शीर्षक उपलब्ध नहीं',
      subHeadline: data.subHeadline || '',
      body: data.body || '',
      excerpt: data.excerpt || (data.body ? data.body.slice(0, 150) + '...' : ''),
      category: data.category || 'national',
      city: data.city || 'लखनऊ',
      language: data.language || 'hi',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80',
      mediaGallery: data.mediaGallery || [],
      author: data.author || {
        id: 'user_editor_1',
        name: 'संपादकीय डेस्क',
        role: 'editor'
      },
      isBreaking: data.isBreaking || false,
      isTrending: data.isTrending || false,
      isSponsored: data.isSponsored || false,
      showOnVideos: data.showOnVideos ?? data.category === 'videos',
      sponsoredBy: data.sponsoredBy,
      publishedAt: new Date().toISOString(),
      viewsCount: 1,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      tags: data.tags || ['ताज़ा खबर', 'स्वर्णिम दस्तावेज़'],
      readingTimeMinutes: Math.max(1, Math.ceil((data.body?.length || 500) / 400)),
      status: 'published'
    };
    this.articles.unshift(newArticle);
    return newArticle;
  }

  incrementArticleViews(id: string) {
    const art = this.getArticleById(id);
    if (art) {
      art.viewsCount += 1;
      return art.viewsCount;
    }
    return 0;
  }

  toggleArticleLike(id: string) {
    const art = this.getArticleById(id);
    if (art) {
      art.likesCount += 1;
      return art.likesCount;
    }
    return 0;
  }

  updateArticle(id: string, data: Partial<Article>): Article | null {
    const art = this.articles.find(a => a.id === id);
    if (!art) return null;
    const { id: _id, ...rest } = data;
    Object.assign(art, rest);
    if (data.body) {
      art.excerpt = data.excerpt || `${data.body.slice(0, 150)}...`;
      art.readingTimeMinutes = Math.max(1, Math.ceil(data.body.length / 400));
    }
    return art;
  }

  deleteArticle(id: string): boolean {
    const index = this.articles.findIndex(a => a.id === id);
    if (index === -1) return false;
    this.articles.splice(index, 1);
    return true;
  }

  // Citizen Submissions
  getSubmissions(filter?: { status?: string }) {
    if (!filter?.status || filter.status === 'all') {
      return this.submissions;
    }
    return this.submissions.filter(s => s.status === filter.status);
  }

  getSubmissionById(id: string) {
    return this.submissions.find(s => s.id === id);
  }

  reviseSubmission(id: string, data: Partial<CitizenSubmission>): CitizenSubmission | null {
    const sub = this.submissions.find(s => s.id === id);
    if (!sub) return null;
    sub.headline = data.headline || sub.headline;
    sub.subHeadline = data.subHeadline ?? sub.subHeadline;
    sub.body = data.body || sub.body;
    sub.category = data.category || sub.category;
    sub.city = data.city || sub.city;
    sub.language = data.language || sub.language;
    if (data.media) sub.media = data.media;
    if (data.geoTag) sub.geoTag = data.geoTag;
    sub.hasRecordedVideo = data.hasRecordedVideo ?? sub.hasRecordedVideo;
    sub.status = 'pending_review';
    sub.editorComments = '';
    sub.updatedAt = new Date().toISOString();
    sub.revisionHistory = sub.revisionHistory || [];
    sub.revisionHistory.push({
      timestamp: sub.updatedAt,
      action: 'RESUBMITTED',
      performedBy: sub.submittedBy?.name || 'नागरिक पत्रकार',
      note: 'संशोधन के बाद खबर दोबारा समीक्षा हेतु भेजी गई।'
    });
    return sub;
  }

  createSubmission(data: Partial<CitizenSubmission>): CitizenSubmission {
    const newSub: CitizenSubmission = {
      id: `sub-${Date.now()}`,
      headline: data.headline || '',
      subHeadline: data.subHeadline || '',
      body: data.body || '',
      category: data.category || 'sitapur',
      city: data.city || 'सीतापुर',
      language: data.language || 'hi',
      submittedBy: data.submittedBy || {
        id: 'user_citizen_1',
        name: 'विकास शुक्ला (नागरिक पत्रकार)',
        role: 'citizen_journalist',
        district: 'सीतापुर'
      },
      media: data.media || [],
      hasRecordedVideo: data.hasRecordedVideo || false,
      geoTag: data.geoTag,
      status: 'pending_review',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      revisionHistory: [
        {
          timestamp: new Date().toISOString(),
          action: 'SUBMITTED',
          performedBy: data.submittedBy?.name || 'नागरिक पत्रकार',
          note: 'नई खबर समीक्षा हेतु भेजी गई।'
        }
      ]
    };
    this.submissions.unshift(newSub);
    return newSub;
  }

  reviewSubmission(id: string, action: 'approve' | 'reject' | 'send_back', comments?: string, reviewerName = 'प्रधान संपादक') {
    const sub = this.getSubmissionById(id);
    if (!sub) return null;

    const timestamp = new Date().toISOString();
    sub.updatedAt = timestamp;
    sub.reviewedBy = reviewerName;
    sub.reviewedAt = timestamp;
    sub.editorComments = comments;

    if (action === 'approve') {
      sub.status = 'approved';
      sub.revisionHistory?.push({
        timestamp,
        action: 'APPROVED_AND_PUBLISHED',
        performedBy: reviewerName,
        note: comments || 'खबर स्वीकृत एवं प्रकाशित।'
      });

      // Automatically publish into published articles
      this.createArticle({
        headline: sub.headline,
        subHeadline: sub.subHeadline,
        body: sub.body,
        category: sub.category,
        city: sub.city,
        language: sub.language,
        coverImage: sub.media?.[0]?.url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80',
        author: {
          id: sub.submittedBy.id,
          name: `${sub.submittedBy.name} (नागरिक पत्रकार)`,
          role: 'citizen_journalist'
        },
        tags: [sub.city, 'स्वर्णिम दूत', 'ग्राउंड रिपोर्ट']
      });
    } else if (action === 'send_back') {
      sub.status = 'sent_back';
      sub.revisionHistory?.push({
        timestamp,
        action: 'SENT_BACK_FOR_REVISION',
        performedBy: reviewerName,
        note: comments || 'संशोधन एवं अतिरिक्त साक्ष्य अपेक्षित।'
      });
    } else if (action === 'reject') {
      sub.status = 'rejected';
      sub.revisionHistory?.push({
        timestamp,
        action: 'REJECTED',
        performedBy: reviewerName,
        note: comments || 'संपादकीय मानकों के अनुरूप न होने के कारण अस्वीकृत।'
      });
    }
    return sub;
  }

  updateSubmission(id: string, updates: Partial<CitizenSubmission>): CitizenSubmission | null {
    const sub = this.getSubmissionById(id);
    if (!sub) return null;
    const { id: _id, ...rest } = updates;
    Object.assign(sub, rest);
    sub.updatedAt = new Date().toISOString();
    return sub;
  }

  deleteSubmission(id: string): boolean {
    const idx = this.submissions.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.submissions.splice(idx, 1);
    return true;
  }

  toggleSubmissionActive(id: string): CitizenSubmission | null {
    const sub = this.getSubmissionById(id);
    if (!sub) return null;
    const timestamp = new Date().toISOString();
    sub.updatedAt = timestamp;
    if (sub.status === 'approved') {
      sub.status = 'inactive';
      sub.editorComments = sub.editorComments || 'संपादक द्वारा निष्क्रिय (Inactive) किया गया';
    } else {
      sub.status = 'approved';
    }
    return sub;
  }

  // Users
  getUsers() {
    return this.users.filter(u => !this.deletedUserIds.has(u.id));
  }

  updateUserRole(userId: string, newRole: UserRole) {
    const u = this.users.find(x => x.id === userId && !this.deletedUserIds.has(x.id));
    if (u) {
      u.role = newRole;
      if (newRole === 'citizen_journalist' || newRole === 'staff_reporter') {
        u.kycStatus = 'verified';
      }
      return u;
    }
    return null;
  }

  updateUser(userId: string, data: Partial<User>) {
    const u = this.users.find(x => x.id === userId && !this.deletedUserIds.has(x.id));
    if (u) {
      Object.assign(u, data);
      return u;
    }
    return null;
  }

  toggleBanUser(userId: string) {
    const u = this.users.find(x => x.id === userId && !this.deletedUserIds.has(x.id));
    if (u) {
      u.isBanned = !u.isBanned;
      return u;
    }
    return null;
  }

  deleteUser(userId: string) {
    const user = this.users.find(x => x.id === userId);
    if (!user) return false;
    this.deletedUserIds.add(userId);
    const index = this.users.findIndex(x => x.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
    return true;
  }

  authenticate(identifier: string, password: string): { status: 'ok' | 'invalid' | 'not_found' | 'banned'; user?: User } {
    const clean = identifier.trim().toLowerCase();
    const digits = clean.replace(/\D/g, '');
    const user = this.users.find(u =>
      !this.deletedUserIds.has(u.id) && (
        u.email.toLowerCase() === clean ||
        (u.phone && digits.length >= 10 && u.phone.replace(/\D/g, '') === digits)
      )
    );
    if (!user) return { status: 'not_found' };
    if (user.isBanned) return { status: 'banned' };
    const staff = user.role === 'admin' || user.role === 'super_admin' || user.role === 'editor';
    if (staff) {
      if (!user.password || user.password !== password) return { status: 'invalid' };
    } else if (user.password && user.password !== password) {
      return { status: 'invalid' };
    }
    const { password: _password, ...safe } = user;
    return { status: 'ok', user: safe };
  }

  // Poll
  getPoll() {
    return this.poll;
  }

  votePoll(optionId: string) {
    const opt = this.poll.options.find(o => o.id === optionId);
    if (opt) {
      opt.votes += 1;
      this.poll.totalVotes += 1;
    }
    return this.poll;
  }

  // E-Paper
  getEPaperEditions(filter?: { date?: string; city?: string; language?: string }) {
    let list = this.epaperEditions.filter(e => !this.deletedEpaperIds.has(e.id));
    if (filter?.date) {
      list = list.filter(e => e.date === filter.date);
    }
    if (filter?.city && filter.city !== 'सभी') {
      list = list.filter(e => e.editionCity.includes(filter.city!));
    }
    if (filter?.language && filter.language !== 'all') {
      list = list.filter(e => (e.language || 'hi') === filter.language);
    }
    return list;
  }

  addEPaperEdition(edition: Partial<EPaperEdition>) {
    const newEd: EPaperEdition = {
      id: edition.id || `epaper-${Date.now()}`,
      date: edition.date || new Date().toISOString().split('T')[0],
      editionCity: edition.editionCity || 'लखनऊ',
      editionTitle: edition.editionTitle || 'स्वर्णिम दस्तावेज़ दैनिक',
      language: edition.language || 'hi',
      pagesCount: edition.pages?.length || edition.pagesCount || 1,
      pages: edition.pages || [],
      thumbnailUrl: edition.thumbnailUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
      isActive: edition.isActive !== false,
    };
    this.epaperEditions.unshift(newEd);
    return newEd;
  }

  deleteEPaperEdition(id: string) {
    this.deletedEpaperIds.add(id);
    this.epaperEditions = this.epaperEditions.filter(e => e.id !== id);
  }

  // Ads
  getAds() {
    return this.ads;
  }

  recordAdClick(adId: string) {
    const ad = this.ads.find(a => a.id === adId);
    if (ad) ad.clicks += 1;
  }

  recordAdImpression(adId: string) {
    const ad = this.ads.find(a => a.id === adId);
    if (ad) ad.impressions += 1;
  }

  createAd(data: Partial<AdBanner>): AdBanner {
    const ad: AdBanner = {
      id: `ad-${Date.now()}`,
      title: data.title || 'Sponsored',
      advertiser: data.advertiser || '',
      imageUrl: data.imageUrl || '',
      targetUrl: data.targetUrl || '#',
      placement: data.placement || 'sidebar',
      impressions: 0,
      clicks: 0,
      isActive: data.isActive !== false,
      isSponsoredPost: data.isSponsoredPost
    };
    this.ads.unshift(ad);
    return ad;
  }

  updateAd(id: string, data: Partial<AdBanner>): AdBanner | null {
    const ad = this.ads.find(a => a.id === id);
    if (!ad) return null;
    const { id: _id, ...rest } = data;
    Object.assign(ad, rest);
    return ad;
  }

  deleteAd(id: string): boolean {
    this.deletedAdIds.add(id);
    this.ads = this.ads.filter(a => a.id !== id);
    return true;
  }

  syncAds(ads: AdBanner[]) {
    if (Array.isArray(ads) && ads.length > 0) {
      this.ads = ads.filter(a => !this.deletedAdIds.has(a.id));
    }
  }

  // Classifieds
  getClassifieds() {
    return this.classifieds;
  }

  addClassified(item: Partial<ClassifiedItem>) {
    const newClassified: ClassifiedItem = {
      id: `clf-${Date.now()}`,
      type: item.type || 'public_notice',
      title: item.title || '',
      content: item.content || '',
      contact: item.contact || '',
      city: item.city || 'लखनऊ',
      publishedDate: new Date().toISOString().split('T')[0]
    };
    this.classifieds.unshift(newClassified);
    return newClassified;
  }

  // Grievance Redressal (IT Rules 2021)
  getGrievances() {
    return this.grievances;
  }

  createGrievance(data: Partial<GrievanceComplaint>) {
    const token = `SD-GRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrv: GrievanceComplaint = {
      id: `grv-${Date.now()}`,
      tokenNumber: token,
      complainantName: data.complainantName || '',
      complainantEmail: data.complainantEmail || '',
      complainantPhone: data.complainantPhone || '',
      articleUrl: data.articleUrl,
      category: data.category || 'other',
      complaintDetails: data.complaintDetails || '',
      status: 'received',
      submittedAt: new Date().toISOString()
    };
    this.grievances.unshift(newGrv);
    return newGrv;
  }

  resolveGrievance(id: string, status: 'resolved' | 'dismissed', notes: string) {
    const grv = this.grievances.find(g => g.id === id);
    if (grv) {
      grv.status = status;
      grv.resolutionNotes = notes;
      grv.resolvedAt = new Date().toISOString();
      return grv;
    }
    return null;
  }

  // Site Settings & Legal Policies CMS
  getSettings(): SiteSettings {
    return { ...DEFAULT_SETTINGS, ...this.siteSettings };
  }

  updateSettings(data: Partial<SiteSettings>): SiteSettings {
    this.siteSettings = {
      ...this.siteSettings,
      ...data,
      updatedAt: new Date().toISOString()
    };
    return { ...this.siteSettings };
  }

  // Admin Account & Credential Management
  getAdmins(): User[] {
    return this.users.filter(u => !this.deletedUserIds.has(u.id) && (u.role === 'admin' || u.role === 'super_admin' || u.role === 'editor'));
  }

  createAdminUser(data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role?: UserRole;
    city?: string;
  }): User {
    const newAdmin: User = {
      id: `admin_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '+91 95196 231111',
      password: data.password || 'admin123@swarnim',
      role: data.role || 'admin',
      city: data.city || 'लखनऊ',
      preferredLanguage: 'hi',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      kycStatus: 'verified'
    };
    this.users.unshift(newAdmin);
    return newAdmin;
  }

  changeUserPassword(userId: string, newPassword: string): boolean {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.password = newPassword;
      return true;
    }
    return false;
  }
}

// Global instance. Dev hot reload keeps the old object, so rebind new methods
// and fill in fields added after the process started.
declare global {
  var __platformStore: PlatformStore | undefined;
}

function getPlatformStore(): PlatformStore {
  const existing = global.__platformStore;
  if (existing) {
    Object.setPrototypeOf(existing, PlatformStore.prototype);
    const record = existing as unknown as { 
      siteSettings?: SiteSettings; 
      articles?: Article[]; 
      epaperEditions?: EPaperEdition[]; 
      deletedEpaperIds?: Set<string>; 
      users?: User[]; 
      deletedUserIds?: Set<string>;
      ads?: AdBanner[];
      deletedAdIds?: Set<string>;
    };
    if (!record.deletedEpaperIds) record.deletedEpaperIds = new Set<string>();
    if (!record.deletedUserIds) record.deletedUserIds = new Set<string>();
    if (!record.deletedAdIds) record.deletedAdIds = new Set<string>();
    if (record.ads) {
      record.ads = record.ads.filter((a: AdBanner) => !record.deletedAdIds?.has(a.id));
    }
    if (record.users) {
      record.users = record.users.filter((u: User) => !record.deletedUserIds?.has(u.id));
    }
    if (record.siteSettings) {
      record.siteSettings = { ...DEFAULT_SETTINGS, ...record.siteSettings };
    } else {
      record.siteSettings = { ...DEFAULT_SETTINGS };
    }
    if (record.articles) {
      for (const art of INITIAL_ARTICLES) {
        if (!record.articles.some((a: Article) => a.id === art.id)) {
          record.articles.push(art);
        }
      }
    }
    if (record.epaperEditions) {
      record.epaperEditions = record.epaperEditions.filter((e: EPaperEdition) => !record.deletedEpaperIds?.has(e.id));
      const currentIds = new Set(record.epaperEditions.map((e: EPaperEdition) => e.id));
      for (const ep of INITIAL_EPAPER_EDITIONS) {
        if (!currentIds.has(ep.id) && !record.deletedEpaperIds?.has(ep.id)) {
          record.epaperEditions.push(ep);
        }
      }
    }
    return existing;
  }
  const created = new PlatformStore();
  global.__platformStore = created;
  return created;
}

export const platformStore = getPlatformStore();
global.__platformStore = platformStore;
