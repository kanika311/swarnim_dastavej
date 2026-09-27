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
  UserRole
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

// Global singleton in-memory state for API routes and SSR
class PlatformStore {
  private articles: Article[] = [...INITIAL_ARTICLES];
  private submissions: CitizenSubmission[] = [...INITIAL_SUBMISSIONS];
  private users: User[] = [...INITIAL_USERS];
  private epaperEditions: EPaperEdition[] = [...INITIAL_EPAPER_EDITIONS];
  private poll: Poll = { ...INITIAL_POLL };
  private ads: AdBanner[] = [...INITIAL_ADS];
  private classifieds: ClassifiedItem[] = [...INITIAL_CLASSIFIEDS];
  private grievances: GrievanceComplaint[] = [...INITIAL_GRIEVANCES];

  // Articles
  getArticles(filter?: { category?: string; city?: string; search?: string; language?: string }) {
    let list = [...this.articles];
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
      author: data.author || {
        id: 'user_editor_1',
        name: 'संपादकीय डेस्क',
        role: 'editor'
      },
      isBreaking: data.isBreaking || false,
      isTrending: data.isTrending || false,
      isSponsored: data.isSponsored || false,
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

  // Users
  getUsers() {
    return this.users;
  }

  updateUserRole(userId: string, newRole: UserRole) {
    const u = this.users.find(x => x.id === userId);
    if (u) {
      u.role = newRole;
      if (newRole === 'citizen_journalist' || newRole === 'staff_reporter') {
        u.kycStatus = 'verified';
      }
      return u;
    }
    return null;
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
  getEPaperEditions() {
    return this.epaperEditions;
  }

  addEPaperEdition(edition: Partial<EPaperEdition>) {
    const newEd: EPaperEdition = {
      id: `epaper-${Date.now()}`,
      date: edition.date || new Date().toISOString().split('T')[0],
      editionCity: edition.editionCity || 'लखनऊ',
      editionTitle: edition.editionTitle || 'स्वर्णिम दस्तावेज़ दैनिक',
      pagesCount: edition.pages?.length || 1,
      pages: edition.pages || [],
      thumbnailUrl: edition.thumbnailUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80'
    };
    this.epaperEditions.unshift(newEd);
    return newEd;
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
}

// Global instance
declare global {
  var __platformStore: PlatformStore | undefined;
}

export const platformStore = global.__platformStore || new PlatformStore();
if (process.env.NODE_ENV !== 'production') {
  global.__platformStore = platformStore;
}
