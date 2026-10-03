export type UserRole = 'reader' | 'citizen_journalist' | 'staff_reporter' | 'editor' | 'admin' | 'super_admin';

export type LanguageCode = 'hi' | 'en' | 'ur';

export type SubmissionStatus = 'draft' | 'pending_review' | 'sent_back' | 'approved' | 'rejected' | 'inactive';

export type ArticleCategory = 
  | 'national' 
  | 'state' 
  | 'state-city'
  | 'lucknow' 
  | 'sitapur' 
  | 'politics' 
  | 'business' 
  | 'sports' 
  | 'entertainment' 
  | 'crime' 
  | 'editorial' 
  | 'lifestyle'
  | 'videos'
  | 'tejaswini'
  | 'investigation'
  | 'cricket'
  | 'special'
  | 'original'
  | 'jobs'
  | 'farmers'
  | 'citizen'
  | 'grievance';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  city: string;
  avatarUrl?: string;
  preferredLanguage: LanguageCode;
  kycStatus?: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  kycDetails?: {
    idProofType: string;
    idNumber: string;
    submittedAt: string;
    district: string;
  };
  isBanned?: boolean;
  isActive?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  duration?: number; // in seconds for video
  thumbnailUrl?: string;
}

export interface Article {
  id: string;
  slug: string;
  headline: string;
  subHeadline?: string;
  body: string;
  excerpt: string;
  category: ArticleCategory;
  city: string;
  language: LanguageCode;
  coverImage: string;
  mediaGallery?: MediaItem[];
  author: {
    id: string;
    name: string;
    role: UserRole;
    avatar?: string;
  };
  isBreaking?: boolean;
  isTrending?: boolean;
  isSponsored?: boolean;
  showOnVideos?: boolean;
  sponsoredBy?: string;
  publishedAt: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  tags: string[];
  readingTimeMinutes: number;
  status: 'published' | 'draft' | 'archived' | 'inactive';
}

export interface CitizenSubmission {
  id: string;
  headline: string;
  subHeadline?: string;
  body: string;
  category: ArticleCategory;
  city: string;
  language: LanguageCode;
  submittedBy: {
    id: string;
    name: string;
    role: UserRole;
    phone?: string;
    district: string;
  };
  media: MediaItem[];
  hasRecordedVideo?: boolean;
  geoTag?: {
    locationName: string;
    coordinates?: string;
  };
  status: SubmissionStatus;
  editorComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedAt: string;
  updatedAt: string;
  revisionHistory?: {
    timestamp: string;
    action: string;
    performedBy: string;
    note?: string;
  }[];
  viewsCount?: number;
  uniqueViews?: number;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  publishedArticleId?: string;
  contestScore?: number;
  contestRank?: number;
}

export interface ContestPrize {
  rank: number;
  title: string;
  amount?: number;
  type?: 'cash' | 'certificate' | 'trophy' | 'both' | 'custom';
  rewardText?: string;
  certificateUrl?: string;
  icon?: string;
}

export interface ContestScoringRules {
  pointsPer100Views: number;
  pointsPerLike: number;
  pointsPerComment: number;
  pointsPerShare: number;
  pointsPerPublishedReport: number;
}

export interface ContestWinner {
  rank: number;
  userId: string;
  name: string;
  userName?: string;
  district: string;
  score: number;
  prizeAmount?: number;
  prizeTitle?: string;
  prizeType?: string;
  rewardText?: string;
  certificateUrl?: string;
  reportsCount: number;
}

export interface WeeklyContest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed';
  prizes: ContestPrize[];
  scoringRules: ContestScoringRules;
  minEligibleReports?: number;
  minEligibleViews?: number;
  eligibilityRules?: {
    minReports?: number;
    minPublishedReports?: number;
    minViews?: number;
    roles?: string[];
  };
  disqualifiedUserIds?: string[];
  winners?: ContestWinner[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  userName?: string;
  avatarUrl?: string;
  district: string;
  publishedReportsCount: number;
  publishedReports?: number;
  viewsCount: number;
  views?: number;
  likesCount: number;
  likes?: number;
  commentsCount: number;
  comments?: number;
  sharesCount: number;
  shares?: number;
  score: number;
  prize?: string;
  prizeTitle?: string;
  prizeAmount?: number;
  prizeType?: string;
  rewardText?: string;
  certificateUrl?: string;
  isCurrentUser?: boolean;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  status: 'pending' | 'approved' | 'flagged' | 'hidden';
  createdAt: string;
  likes: number;
}

export interface AdBanner {
  id: string;
  title: string;
  advertiser: string;
  imageUrl: string;
  targetUrl: string;
  placement: 'header_top' | 'sidebar' | 'in_feed' | 'sticky_bottom';
  impressions: number;
  clicks: number;
  isActive: boolean;
  isSponsoredPost?: boolean;
}

export interface EPaperPage {
  pageNumber: number;
  title: string;
  imageUrl: string;
  pdfUrl?: string;
}

export interface EPaperEdition {
  id: string;
  date: string;
  editionCity: string;
  editionTitle: string;
  language?: LanguageCode;
  pagesCount: number;
  pages: EPaperPage[];
  thumbnailUrl: string;
  pdfUrl?: string;
  isActive?: boolean;
}

export interface Poll {
  id: string;
  question: string;
  questionHi: string;
  options: {
    id: string;
    textHi: string;
    textEn: string;
    votes: number;
  }[];
  totalVotes: number;
  isActive: boolean;
}

export interface ClassifiedItem {
  id: string;
  type: 'obituary' | 'tender' | 'matrimonial' | 'property' | 'public_notice';
  title: string;
  content: string;
  contact: string;
  city: string;
  publishedDate: string;
  photoUrl?: string;
}

export interface GrievanceComplaint {
  id: string;
  tokenNumber: string;
  complainantName: string;
  complainantEmail: string;
  complainantPhone: string;
  articleUrl?: string;
  category: 'defamation' | 'fake_news' | 'obscenity' | 'copyright' | 'other';
  complaintDetails: string;
  supportingDocuments?: string;
  status: 'received' | 'under_review' | 'resolved' | 'dismissed';
  submittedAt: string;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  registrationNo: string;
  editorInChief: string;
  publisher: string;
  privacyPolicy: string;
  termsOfService: string;
  editorialPolicy: string;
  updatedAt: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export interface EPaperPricingPlan {
  id: string;
  title: string;
  titleEn?: string;
  price: number; // e.g. 1, 29, 340
  duration: 'single_edition' | 'monthly' | 'yearly';
  durationLabel: string; // e.g. '1 दिन (आज का पूरा अखबार)', '30 दिन', '1 वर्ष (365 दिन)'
  durationLabelEn?: string;
  description: string;
  descriptionEn?: string;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}
