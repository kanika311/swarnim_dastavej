'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { CitizenSubmission, ArticleCategory, MediaItem } from '@/types';
import { ALL_INDIA_LOCATIONS } from '@/lib/locations';
import { CommunityPost } from '@/app/api/community-posts/route';
import { 
  PenSquare, 
  Send, 
  Image as ImageIcon, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MapPin, 
  ShieldCheck, 
  User, 
  FileText, 
  LogOut, 
  ChevronRight, 
  Upload, 
  X,
  Newspaper,
  BookOpen,
  Check,
  ExternalLink,
  MessageCircle,
  Sparkles,
  PhoneCall,
  Video,
  Camera,
  Link2,
  Trophy,
  Eye,
  Heart,
  Award,
  TrendingUp,
  Flame
} from 'lucide-react';
import { WeeklyContest, LeaderboardEntry } from '@/types';
import ShareModal from '@/components/ShareModal';
import LeaderboardModal from '@/components/LeaderboardModal';
import ArticleCommentsModal from '@/components/ArticleCommentsModal';
import { convertImageToWebP } from '@/lib/imageOptimization';

function JournalistDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'feed';

  const { currentUser, logout, openAuthModal, addNotification, language, updateCurrentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'feed' | 'submit' | 'my_reports' | 'profile'>(
    initialTab === 'submit' ? 'submit' : initialTab === 'my_reports' ? 'my_reports' : initialTab === 'profile' ? 'profile' : 'feed'
  );

  // Strictly disallow admin/staff roles on public Citizen Journalist Dashboard
  useEffect(() => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.role === 'editor')) {
      logout();
      router.replace('/');
    }
  }, [currentUser, logout, router]);

  // Social Community Posts State
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null);
  const [postVideo, setPostVideo] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isUploadingPostImg, setIsUploadingPostImg] = useState(false);
  const [isUploadingPostVideo, setIsUploadingPostVideo] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const postFileInputRef = useRef<HTMLInputElement>(null);
  const postVideoInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  // News Submission Form State
  const [headline, setHeadline] = useState('');
  const [subHeadline, setSubHeadline] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('state-city');
  const [selectedState, setSelectedState] = useState<string>('Uttar Pradesh');
  const [city, setCity] = useState(currentUser?.city || 'सीतापुर');
  const [locationName, setLocationName] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [isSubmittingNews, setIsSubmittingNews] = useState(false);
  const [uploadingNewsImg, setUploadingNewsImg] = useState(false);
  const [uploadingNewsVideo, setUploadingNewsVideo] = useState(false);
  const [showNewsVideoUrlInput, setShowNewsVideoUrlInput] = useState(false);
  const [newsVideoUrlInput, setNewsVideoUrlInput] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [editingSubmissionId, setEditingSubmissionId] = useState<string | null>(null);
  const newsFileInputRef = useRef<HTMLInputElement>(null);
  const newsVideoInputRef = useRef<HTMLInputElement>(null);

  // User Reports State
  const [mySubmissions, setMySubmissions] = useState<CitizenSubmission[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_review' | 'approved' | 'sent_back'>('all');
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // Real Engagement & Weekly Contest States
  const [statsData, setStatsData] = useState<{
    totalReports: number;
    publishedReports: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    weeklyRank: number;
    weeklyScore: number;
    viewsThisWeek: number;
    pointsToNextRank: number;
    motivationMessage: string;
    activeContest: WeeklyContest | null;
  } | null>(null);

  const [leaderboardData, setLeaderboardData] = useState<{
    contest: WeeklyContest | null;
    leaderboard: LeaderboardEntry[];
    userRank: number;
    userScore: number;
    pointsToNextRank: number;
    nearbyRankings: LeaderboardEntry[];
    motivationMessage: string;
  } | null>(null);

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [shareModalData, setShareModalData] = useState<{ isOpen: boolean; title: string; url: string; targetId: string } | null>(null);
  const [commentsModalData, setCommentsModalData] = useState<{ isOpen: boolean; targetId: string; title: string } | null>(null);
  const [userLikesMap, setUserLikesMap] = useState<Record<string, boolean>>({});

  const fetchJournalistStats = () => {
    if (!currentUser) return;
    fetch(`/api/journalist/stats?userId=${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setStatsData(data.data);
        }
      })
      .catch(() => {});

    fetch(`/api/contest/leaderboard?userId=${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setLeaderboardData(data.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchJournalistStats();
  }, [currentUser]);

  const handleLikeReport = async (sub: CitizenSubmission) => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    const targetId = sub.publishedArticleId || sub.id;
    const isCurrentlyLiked = !!userLikesMap[targetId];
    const prevCount = sub.likesCount || 0;
    const nextCount = isCurrentlyLiked ? Math.max(0, prevCount - 1) : prevCount + 1;

    setUserLikesMap((prev) => ({ ...prev, [targetId]: !isCurrentlyLiked }));
    setMySubmissions((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, likesCount: nextCount } : s))
    );

    try {
      const res = await fetch(`/api/articles/${targetId}/engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', userId: currentUser.id }),
      });
      const data = await res.json();
      if (data.success) {
        setUserLikesMap((prev) => ({ ...prev, [targetId]: data.liked }));
        setMySubmissions((prev) =>
          prev.map((s) => (s.id === sub.id ? { ...s, likesCount: data.likesCount } : s))
        );
        fetchJournalistStats();
      }
    } catch {
      setUserLikesMap((prev) => ({ ...prev, [targetId]: isCurrentlyLiked }));
      setMySubmissions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, likesCount: prevCount } : s))
      );
    }
  };

  // Sync tab with URL if needed
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'submit') setActiveTab('submit');
    else if (tabParam === 'my_reports') setActiveTab('my_reports');
    else if (tabParam === 'profile') setActiveTab('profile');
  }, [searchParams]);

  // Load Community Posts
  useEffect(() => {
    fetch('/api/community-posts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPosts(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Load User Reports
  useEffect(() => {
    if (!currentUser) return;
    setIsLoadingReports(true);
    fetch('/api/submissions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const userSubs = (data.data as CitizenSubmission[]).filter(
            (sub) =>
              (sub.submittedBy?.id && sub.submittedBy.id === currentUser.id) ||
              (currentUser.name && sub.submittedBy?.name?.includes(currentUser.name))
          );
          setMySubmissions(userSubs);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingReports(false));
  }, [currentUser]);

  // Handle Post Creation
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    setIsPosting(true);
    try {
      const res = await fetch('/api/community-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          content: postContent,
          imageUrl: postImage || undefined,
          videoUrl: postVideo || undefined,
          author: {
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.role === 'citizen_journalist' ? 'नागरिक पत्रकार' : 'पत्रकार',
            city: currentUser.city || 'सीतापुर',
            avatarUrl: currentUser.avatarUrl
          }
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPosts((prev) => [data.data, ...prev]);
        setPostContent('');
        setPostImage(null);
        setPostVideo(null);
        addNotification('आपकी कम्युनिटी पोस्ट सफलतापूर्वक प्रकाशित हो गई!');
      }
    } catch {
      addNotification('पोस्ट करने में त्रुटि हुई।');
    } finally {
      setIsPosting(false);
    }
  };

  // Handle Like Toggle
  const handleToggleLike = async (postId: string) => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    const currentPost = posts.find((p) => p.id === postId);
    if (!currentPost) return;

    const alreadyLiked = currentPost.likes.includes(currentUser.id);
    const updatedLikes = alreadyLiked
      ? currentPost.likes.filter((id) => id !== currentUser.id)
      : [...currentPost.likes, currentUser.id];

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: updatedLikes } : p))
    );

    try {
      await fetch('/api/community-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', postId, userId: currentUser.id })
      });
    } catch {
      // Revert if error
    }
  };

  // Handle Add Comment
  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    try {
      const res = await fetch('/api/community-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          postId,
          authorName: currentUser.name,
          authorRole: currentUser.role === 'citizen_journalist' ? 'नागरिक पत्रकार' : 'पाठक',
          text
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? data.data : p)));
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      }
    } catch {
      addNotification('टिप्पणी दर्ज करने में त्रुटि हुई।');
    }
  };

  // Handle Share Post
  const handleSharePost = (post: CommunityPost) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `स्वर्णिम दस्तावेज़ पर ${post.author.name} की पोस्ट`,
        text: post.content,
        url: window.location.href
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${post.author.name}: ${post.content}\n${window.location.href}`);
      addNotification('पोस्ट लिंक कॉपी कर लिया गया!');
    }
  };

  // Handle Upload Image for Post
  const handlePostImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPostImg(true);
    try {
      const fileToUpload = await convertImageToWebP(file);
      const fd = new FormData();
      fd.append('file', fileToUpload);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.url) {
        setPostImage(data.url);
      } else {
        addNotification('फोटो अपलोड विफल रही।');
      }
    } catch {
      addNotification('फोटो अपलोड त्रुटि।');
    } finally {
      setIsUploadingPostImg(false);
      if (postFileInputRef.current) postFileInputRef.current.value = '';
    }
  };

  // Handle Upload Video for Post
  const handlePostVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: e.g. 50MB
    if (file.size > 50 * 1024 * 1024) {
      addNotification('वीडियो का साइज़ 50MB से कम होना चाहिए।');
      return;
    }

    setIsUploadingPostVideo(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.url) {
        setPostVideo(data.url);
        addNotification('वीडियो सफलतापूर्वक जोड़ा गया!');
      } else {
        addNotification('वीडियो अपलोड विफल रही।');
      }
    } catch {
      addNotification('वीडियो अपलोड त्रुटि।');
    } finally {
      setIsUploadingPostVideo(false);
      if (postVideoInputRef.current) postVideoInputRef.current.value = '';
    }
  };

  // Handle Upload Profile Photo
  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProfile(true);
    try {
      const fileToUpload = await convertImageToWebP(file);
      const fd = new FormData();
      fd.append('file', fileToUpload);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.url) {
        updateCurrentUser({ avatarUrl: data.url });
        addNotification('प्रोफ़ाइल फोटो सफलतापूर्वक अपडेट हो गई!');
      } else {
        addNotification('फोटो अपलोड नहीं हो सकी।');
      }
    } catch {
      addNotification('फोटो अपलोड में त्रुटि हुई।');
    } finally {
      setIsUploadingProfile(false);
      if (profileFileInputRef.current) profileFileInputRef.current.value = '';
    }
  };

  // Handle Upload Image for News Submission
  const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingNewsImg(true);
    try {
      const fileToUpload = await convertImageToWebP(file);
      const fd = new FormData();
      fd.append('file', fileToUpload);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.url) {
        const item: MediaItem = {
          id: `media-${Date.now()}`,
          type: 'image',
          url: data.url,
          caption: ''
        };
        setPhotos((prev) => [...prev, item]);
      } else {
        addNotification('तस्वीर अपलोड नहीं हो सकी।');
      }
    } catch {
      addNotification('अपलोड में त्रुटि हुई।');
    } finally {
      setUploadingNewsImg(false);
      if (newsFileInputRef.current) newsFileInputRef.current.value = '';
    }
  };

  // Handle Upload Video for News Submission
  const handleNewsVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingNewsVideo(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.url) {
        const item: MediaItem = {
          id: `media-vid-${Date.now()}`,
          type: 'video',
          url: data.url,
          caption: 'Ground Video Report'
        };
        setPhotos((prev) => [...prev, item]);
        addNotification('वीडियो सफलतापूर्वक जोड़ा गया!');
      } else {
        addNotification(data.message || 'वीडियो अपलोड नहीं हो सका।');
      }
    } catch {
      addNotification('वीडियो अपलोड में त्रुटि हुई।');
    } finally {
      setUploadingNewsVideo(false);
      if (newsVideoInputRef.current) newsVideoInputRef.current.value = '';
    }
  };

  // Handle Add Video via URL / Link
  const handleAddVideoUrl = () => {
    if (!newsVideoUrlInput.trim()) return;
    const item: MediaItem = {
      id: `media-vid-${Date.now()}`,
      type: 'video',
      url: newsVideoUrlInput.trim(),
      caption: 'Ground Video Report'
    };
    setPhotos((prev) => [...prev, item]);
    setNewsVideoUrlInput('');
    setShowNewsVideoUrlInput(false);
    addNotification('वीडियो लिंक सफलतापूर्वक जोड़ा गया!');
  };

  // Handle News Submission Form Submit
  const handleNewsFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !bodyText.trim()) {
      addNotification('कृपया शीर्षक और खबर का विवरण अवश्य भरें।');
      return;
    }

    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    setIsSubmittingNews(true);
    setSubmitSuccess(null);

    const submissionPayload: Partial<CitizenSubmission> = {
      headline: headline.trim(),
      subHeadline: subHeadline.trim() || undefined,
      category,
      city: city.trim() || 'सीतापुर',
      language: 'hi',
      body: bodyText.trim(),
      media: photos,
      hasRecordedVideo: photos.some(p => p.type === 'video'),
      geoTag: {
        locationName: locationName.trim() || city
      },
      submittedBy: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        district: city,
        phone: currentUser.phone
      }
    };

    try {
      let res;
      if (editingSubmissionId) {
        res = await fetch('/api/submissions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingSubmissionId, ...submissionPayload, status: 'pending_review' })
        });
      } else {
        res = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionPayload)
        });
      }

      const data = await res.json();
      if (data.success && data.data) {
        setSubmitSuccess(data.message || 'खबर संपादकीय समीक्षा हेतु भेज दी गई है!');
        addNotification('आपकी रिपोर्ट संपादकीय समीक्षा हेतु दर्ज कर ली गई है!');
        // Update user reports list
        setMySubmissions((prev) => [data.data, ...prev.filter((item) => item.id !== data.data.id)]);
        // Reset form
        setHeadline('');
        setSubHeadline('');
        setBodyText('');
        setLocationName('');
        setPhotos([]);
        setEditingSubmissionId(null);
      } else {
        addNotification(data.message || 'खबर भेजने में समस्या हुई।');
      }
    } catch {
      addNotification('सर्वर से संपर्क नहीं हो सका।');
    } finally {
      setIsSubmittingNews(false);
    }
  };

  // Start editing a sent-back report
  const startEditingReport = (sub: CitizenSubmission) => {
    setEditingSubmissionId(sub.id);
    setHeadline(sub.headline);
    setSubHeadline(sub.subHeadline || '');
    setCategory(sub.category as ArticleCategory);
    setCity(sub.city);
    setLocationName(sub.geoTag?.locationName || '');
    setBodyText(sub.body);
    setPhotos(sub.media || []);
    setActiveTab('submit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredReports = mySubmissions.filter((sub) => {
    if (statusFilter === 'all') return true;
    return sub.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Header />

      {/* DASHBOARD TOP BANNER */}
      <div className="bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 text-white py-4 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-serif tracking-tight flex items-center gap-2">
              <PenSquare className="w-5 h-5 text-amber-200" />
              <span>
                {language === 'en' ? 'Citizen Journalist Dashboard' : language === 'ur' ? 'شہری صحافی ڈیش بورڈ' : 'नागरिक पत्रकार डैशबोर्ड'}
              </span>
            </h1>
            <p className="text-xs text-amber-100 mt-0.5">
              {language === 'en' 
                ? 'Submit ground reports, share updates in community & track publishing status.'
                : language === 'ur'
                ? 'اپنی گراؤنڈ رپورٹس درج کریں، کمیونٹی میں اپ ڈیٹس شیئر کریں اور اشاعت کی صورتحال دیکھیں۔'
                : 'अपनी ज़मीनी रिपोर्ट दर्ज करें, कम्युनिटी में ताज़ा विचार साझा करें एवं प्रकाशन स्थिति देखें।'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs font-bold border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {language === 'en' ? 'Live Journalist Portal' : language === 'ur' ? 'لائیو صحافی پورٹل' : 'लाइव पत्रकार पोर्टल'}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER (3-PANEL LAYOUT: STICKY LEFT, SCROLLABLE CENTER, STICKY RIGHT) */}
      <div className="max-w-[1540px] mx-auto px-3 sm:px-4 py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ================= 1. LEFT PANEL (STICKY USER & NAVIGATION) ================= */}
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-20 self-start max-h-[calc(100vh-5.5rem)] overflow-y-auto scrollbar-none">
            
            {/* User Profile Card (Reference: Yogsathi Style) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative group/avatar shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-md border-2 border-amber-300">
                    {currentUser?.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      currentUser ? currentUser.name.charAt(0).toUpperCase() : 'J'
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={isUploadingProfile}
                    onClick={() => profileFileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-full shadow border-2 border-white dark:border-slate-900 transition cursor-pointer"
                    title={language === 'en' ? 'Change Photo' : 'फ़ोटो बदलें'}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                    {currentUser ? currentUser.name : (language === 'en' ? 'Citizen Journalist' : language === 'ur' ? 'شہری صحافی' : 'नागरिक पत्रकार')}
                  </h2>
                  <p className="text-xs text-slate-500 truncate">
                    {currentUser?.email || currentUser?.phone || (language === 'en' ? 'Journalist Account' : 'पत्रकार खाता')}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    <ShieldCheck className="w-3 h-3 text-red-600" />
                    <span>{language === 'en' ? 'Verified Journalist' : language === 'ur' ? 'تصدیق شدہ صحافی' : 'सत्यापित पत्रकार'}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {language === 'en' ? 'District' : language === 'ur' ? 'ضلع' : 'ज़िला'}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 truncate block">
                    {currentUser?.city || 'सीतापुर'}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {language === 'en' ? 'Total Reports' : language === 'ur' ? 'کل رپورٹس' : 'कुल रिपोर्ट्स'}
                  </span>
                  <span className="font-bold text-red-700 dark:text-red-400 block">
                    {mySubmissions.length} {language === 'en' ? 'Reports' : 'खबरें'}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {language === 'en' ? 'Published' : language === 'ur' ? 'شائع شدہ' : 'स्वीकृत/प्रकाशित'}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                    {mySubmissions.filter((s) => s.status === 'approved').length}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {language === 'en' ? 'Score' : language === 'ur' ? 'اسکور' : 'क्रेडिट स्कोर'}
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 block">
                    {(statsData?.weeklyScore ?? 0).toLocaleString('en-IN')} {language === 'en' ? 'pts' : 'अंक'}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Panel (Like Yogsathi Reference) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-2.5 space-y-1">
              <span className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {language === 'en' ? 'Journalist Menu' : language === 'ur' ? 'صحافی مینو' : 'पत्रकार पैनल'}
              </span>

              <button
                type="button"
                onClick={() => setActiveTab('feed')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                  activeTab === 'feed'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="whitespace-nowrap truncate">
                    {language === 'en' ? 'Community Feed' : language === 'ur' ? 'کمیونٹی فیڈ' : 'कम्युनिटी फ़ीड'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70 shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('submit')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                  activeTab === 'submit'
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <PenSquare className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="whitespace-nowrap truncate">
                    {language === 'en' ? 'Submit Report' : language === 'ur' ? 'رپورٹ درج کریں' : 'रिपोर्ट दर्ज करें'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70 shrink-0 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('my_reports')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                  activeTab === 'my_reports'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="whitespace-nowrap truncate">
                    {language === 'en' ? 'My Reports' : language === 'ur' ? 'میری رپورٹس' : 'मेरी खबरें व स्थिति'}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold shrink-0 ml-1">
                  {mySubmissions.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <User className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="whitespace-nowrap truncate">
                    {language === 'en' ? 'My Profile' : language === 'ur' ? 'میری پروفائل' : 'मेरी प्रोफ़ाइल'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70 shrink-0 ml-1" />
              </button>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <Link
                  href="/epaper"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Newspaper className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="whitespace-nowrap truncate">
                      {language === 'en' ? 'Daily E-Paper' : language === 'ur' ? 'روزنامہ ای پیپر' : 'दैनिक ई-पेपर'}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0 ml-1" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap truncate">
                      {language === 'en' ? 'Logout' : language === 'ur' ? 'لاگ آؤٹ' : 'लॉगआउट'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* ================= 2. CENTER PANEL (SCROLLABLE FEED & FORM) ================= */}
          <div className="lg:col-span-6 space-y-6 min-w-0">

            {/* TAB 1: SOCIAL COMMUNITY FEED (Post, Like, Comment, Share) */}
            {activeTab === 'feed' && (
              <div className="space-y-5">
                
                {/* CREATE POST BOX (Like Yogsathi Reference) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shrink-0 border border-amber-300">
                      {currentUser?.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        currentUser ? currentUser.name.charAt(0).toUpperCase() : 'J'
                      )}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder={
                          language === 'en'
                            ? `What's on your mind or news update, ${currentUser?.name || 'Partner'}?`
                            : language === 'ur'
                            ? `آپ کے ذہن میں کیا خیالات یا تازہ اپ ڈیٹ ہیں، ${currentUser?.name || 'ساتھی'}؟`
                            : `आपके मन में क्या विचार या ताज़ा अपडेट है, ${currentUser?.name || 'साथी'}?`
                        }
                        rows={3}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Photo Preview if uploaded */}
                  {postImage && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-64">
                      <img src={postImage} alt="Post Attachment" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPostImage(null)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Video Preview if uploaded */}
                  {postVideo && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black max-h-64">
                      <video src={postVideo} controls className="w-full max-h-64 object-contain" />
                      <button
                        type="button"
                        onClick={() => setPostVideo(null)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      {/* Photo Upload */}
                      <input
                        type="file"
                        ref={postFileInputRef}
                        accept="image/*"
                        onChange={handlePostImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isUploadingPostImg}
                        onClick={() => postFileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                        <span>{isUploadingPostImg ? (language === 'en' ? 'Uploading...' : 'अपलोड...') : (language === 'en' ? 'Add Photo' : language === 'ur' ? 'تصویر شامل کریں' : 'फोटो जोड़ें')}</span>
                      </button>

                      {/* Video Upload */}
                      <input
                        type="file"
                        ref={postVideoInputRef}
                        accept="video/*"
                        onChange={handlePostVideoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isUploadingPostVideo}
                        onClick={() => postVideoInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Video className="w-4 h-4 text-red-600" />
                        <span>{isUploadingPostVideo ? (language === 'en' ? 'Uploading...' : 'अपलोड...') : (language === 'en' ? 'Add Video' : language === 'ur' ? 'ویڈیو شامل کریں' : 'वीडियो जोड़ें')}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isPosting || (!postContent.trim() && !postImage && !postVideo)}
                      onClick={handleCreatePost}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isPosting ? (language === 'en' ? 'Posting...' : 'पोस्ट हो रहा है...') : (language === 'en' ? 'Post' : language === 'ur' ? 'پوسٹ کریں' : 'पोस्ट करें')}</span>
                    </button>
                  </div>
                </div>

                {/* POSTS FEED STREAM */}
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border text-center text-slate-400 text-sm">
                      {language === 'en' ? 'No community posts yet. Be the first to share an update!' : language === 'ur' ? 'ابھی تک کوئی کمیونٹی پوسٹ نہیں ہے۔' : 'अभी तक कोई कम्युनिटी पोस्ट नहीं है। सबसे पहले आप विचार साझा करें!'}
                    </div>
                  ) : (
                    posts.map((post) => {
                      const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
                      const isCommentsOpen = openCommentsPostId === post.id;

                      return (
                        <div
                          key={post.id}
                          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3"
                        >
                          {/* Post Header */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-sm shrink-0">
                              {post.author.avatarUrl ? (
                                <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                              ) : (
                                post.author.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                  {post.author.name}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                                  {post.author.role}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span>{post.author.city}</span>
                                <span>•</span>
                                <span>{post.createdAt}</span>
                              </div>
                            </div>
                          </div>

                          {/* Post Content */}
                          <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                            {post.content}
                          </p>

                          {/* Post Image */}
                          {post.imageUrl && (
                            <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 max-h-96">
                              <img
                                src={post.imageUrl}
                                alt="Post media"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Post Video */}
                          {post.videoUrl && (
                            <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-black max-h-96">
                              <video
                                src={post.videoUrl}
                                controls
                                playsInline
                                className="w-full max-h-96 object-contain"
                              />
                            </div>
                          )}

                          {/* Action Buttons: Like, Comment, Share */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            <button
                              type="button"
                              onClick={() => handleToggleLike(post.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
                                isLiked ? 'text-red-600 dark:text-red-400 font-bold' : ''
                              }`}
                            >
                              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                              <span>{post.likes.length} {language === 'en' ? 'Like' : language === 'ur' ? 'پسند' : 'पसंद'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setOpenCommentsPostId(isCommentsOpen ? null : post.id)
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                              <MessageSquare className="w-4 h-4 text-amber-600" />
                              <span>{post.comments.length} {language === 'en' ? 'Comment' : language === 'ur' ? 'تبصرے' : 'टिप्पणी'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSharePost(post)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                              <Share2 className="w-4 h-4 text-blue-600" />
                              <span>{language === 'en' ? 'Share' : language === 'ur' ? 'شیئر' : 'साझा करें'}</span>
                            </button>
                          </div>

                          {/* Comments Box */}
                          {isCommentsOpen && (
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                              {post.comments.length > 0 && (
                                <div className="space-y-2">
                                  {post.comments.map((c) => (
                                    <div
                                      key={c.id}
                                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                          {c.authorName}
                                        </span>
                                        <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                                      </div>
                                      <p className="mt-1 text-slate-700 dark:text-slate-300">{c.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Comment Input */}
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={commentInputs[post.id] || ''}
                                  onChange={(e) =>
                                    setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddComment(post.id);
                                  }}
                                  placeholder={language === 'en' ? 'Write a comment...' : language === 'ur' ? 'اپنی رائے لکھیں...' : 'अपनी टिप्पणी लिखें...'}
                                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddComment(post.id)}
                                  className="px-3 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs"
                                >
                                  {language === 'en' ? 'Send' : language === 'ur' ? 'بھیجیں' : 'भेजें'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: REPORT DARJ KARO (Create & Publish News Article) */}
            {activeTab === 'submit' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <PenSquare className="w-5 h-5 text-red-600" />
                      <span>
                        {editingSubmissionId 
                          ? (language === 'en' ? 'Edit News Report' : language === 'ur' ? 'خبر میں ترمیم کریں' : 'खबर में संशोधन करें') 
                          : (language === 'en' ? 'Submit Ground Report / News' : language === 'ur' ? 'نئی خبر درج کریں' : 'नई खबर / रिपोर्ट दर्ज करें')}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === 'en' 
                        ? 'Your report will be reviewed by editorial desk before publishing on portal and e-paper.' 
                        : language === 'ur'
                        ? 'آپ کی رپورٹ ایڈیٹوریل جائزے کے بعد پورٹل اور ای پیپر پر شائع ہوگی۔'
                        : 'आपकी खबर संपादकीय समीक्षा के पश्चात मुख्य वेब संस्करण और ई-पेपर में प्रकाशित की जाएगी।'}
                    </p>
                  </div>
                  {editingSubmissionId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSubmissionId(null);
                        setHeadline('');
                        setBodyText('');
                      }}
                      className="text-xs text-slate-500 hover:underline"
                    >
                      {language === 'en' ? 'Cancel' : 'रद्द करें'}
                    </button>
                  )}
                </div>

                {submitSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{submitSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleNewsFormSubmit} className="space-y-4">
                  {/* Headline */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'en' ? 'Main Headline' : language === 'ur' ? 'اہم سرخی' : 'खबर का मुख्य शीर्षक'} <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder={language === 'en' ? 'E.g.: New medical center inaugurated in district with 50 beds...' : 'उदा: सीतापुर में नए अस्पताल का लोकार्पण, 50 बेड की सुविधा शुरू...'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Subheadline */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'en' ? 'Sub-headline / Summary (Optional)' : language === 'ur' ? 'ذیلی سرخی (اختیاری)' : 'उप-शीर्षक (वैकल्पिक)'}
                    </label>
                    <input
                      type="text"
                      value={subHeadline}
                      onChange={(e) => setSubHeadline(e.target.value)}
                      placeholder={language === 'en' ? 'Brief summary or key takeaway...' : 'संक्षिप्त विवरण या मुख्य बिंदु...'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Category & City Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'en' ? 'Category' : language === 'ur' ? 'زمرہ' : 'खबर की श्रेणी'}
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="state-city">{language === 'en' ? 'State / City' : 'राज्य / शहर विशेष'}</option>
                        <option value="sitapur">{language === 'en' ? 'Sitapur News' : 'सीतापुर हलचल'}</option>
                        <option value="lucknow">{language === 'en' ? 'Lucknow News' : 'लखनऊ राजधानी'}</option>
                        <option value="politics">{language === 'en' ? 'Politics' : 'राजनीति'}</option>
                        <option value="national">{language === 'en' ? 'National' : 'राष्ट्रीय'}</option>
                        <option value="business">{language === 'en' ? 'Business' : 'कारोबार'}</option>
                        <option value="sports">{language === 'en' ? 'Sports' : 'खेल जगत'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'en' ? 'City / Location' : language === 'ur' ? 'شہر / مقام' : 'स्थान / शहर'}
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="उदा: सीतापुर, लखनऊ, दिल्ली..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Exact Location Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'en' ? 'Incident Spot / Landmark' : language === 'ur' ? 'مقام / لینڈ مارک' : 'घटना स्थल का नाम (Spot / Landmark)'}
                    </label>
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder={language === 'en' ? 'E.g.: Collectorate Square, Main Market, Naimisharanya...' : 'उदा: कलेक्ट्रेट चौराहा, मुख्य बाजार, नैमिषारण्य...'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Body Text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'en' ? 'Full Story Details' : language === 'ur' ? 'خبر کی مکمل تفصیل' : 'खबर का संपूर्ण विवरण (Full Story Body)'} <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={bodyText}
                      onChange={(e) => setBodyText(e.target.value)}
                      placeholder={language === 'en' ? 'Write full details: incident, time, exact location, eyewitness statements...' : 'घटना, समय, स्थान, प्रत्यक्षदर्शियों के बयान एवं सम्पूर्ण जानकारी विस्तार से लिखें...'}
                      className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
                    />
                  </div>

                  {/* Photos & Videos Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {language === 'en' ? 'Add Photos & Videos (News Media)' : language === 'ur' ? 'تصاویر اور ویڈیوز شامل کریں' : 'तस्वीरें व वीडियो जोड़ें (News Photos & Video)'}
                    </label>
                    
                    {/* Hidden File Inputs */}
                    <input
                      type="file"
                      ref={newsFileInputRef}
                      accept="image/*"
                      onChange={handleNewsImageUpload}
                      className="hidden"
                    />
                    <input
                      type="file"
                      ref={newsVideoInputRef}
                      accept="video/*"
                      onChange={handleNewsVideoUpload}
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Upload Photo Button */}
                      <button
                        type="button"
                        disabled={uploadingNewsImg}
                        onClick={() => newsFileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4 text-amber-600" />
                        <span>
                          {uploadingNewsImg 
                            ? (language === 'en' ? 'Uploading Photo...' : 'फोटो अपलोड हो रहा है...') 
                            : (language === 'en' ? 'Upload Photo (+Photo)' : 'तस्वीर जोड़ें (+Photo)')}
                        </span>
                      </button>

                      {/* Upload Video Button */}
                      <button
                        type="button"
                        disabled={uploadingNewsVideo}
                        onClick={() => newsVideoInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl border-2 border-dashed border-red-400 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20 text-xs font-bold text-red-800 dark:text-red-300 hover:bg-red-100 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                      >
                        <Video className="w-4 h-4 text-red-600" />
                        <span>
                          {uploadingNewsVideo 
                            ? (language === 'en' ? 'Uploading Video...' : 'वीडियो अपलोड हो रहा है...') 
                            : (language === 'en' ? 'Upload Video (+Video)' : 'वीडियो जोड़ें (+Video)')}
                        </span>
                      </button>

                      {/* Video Link Button */}
                      <button
                        type="button"
                        onClick={() => setShowNewsVideoUrlInput(!showNewsVideoUrlInput)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Link2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>{language === 'en' ? 'Video Link (+URL)' : 'वीडियो लिंक (+Link)'}</span>
                      </button>
                    </div>

                    {/* Expandable Video URL Input */}
                    {showNewsVideoUrlInput && (
                      <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="url"
                          value={newsVideoUrlInput}
                          onChange={(e) => setNewsVideoUrlInput(e.target.value)}
                          placeholder={language === 'en' ? 'Paste YouTube / MP4 video link here...' : 'यहाँ YouTube या वीडियो URL लिंक पेस्ट करें...'}
                          className="flex-1 w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={handleAddVideoUrl}
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition cursor-pointer"
                          >
                            {language === 'en' ? 'Add' : 'जोड़ें'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewsVideoUrlInput(false);
                              setNewsVideoUrlInput('');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300 transition cursor-pointer"
                          >
                            {language === 'en' ? 'Cancel' : 'रद्द'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Media Items Preview (Images & Videos) */}
                    {photos.length > 0 && (
                      <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        {photos.map((item, idx) => (
                          <div key={item.id} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-2xs group">
                            {item.type === 'video' ? (
                              <div className="w-full h-full relative">
                                <video src={item.url} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                                  <Video className="w-5 h-5 text-white" />
                                </div>
                                <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[8px] font-black px-1 py-0.2 rounded uppercase">
                                  Video
                                </span>
                              </div>
                            ) : (
                              <img src={item.url} alt="Uploaded" className="w-full h-full object-cover" />
                            )}
                            <button
                              type="button"
                              onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 p-0.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xs cursor-pointer transition"
                              title="हटाएं (Remove)"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingNews}
                      className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmittingNews ? (language === 'en' ? 'Submitting...' : 'भेजा जा रहा है...') : (language === 'en' ? 'Submit for Editorial Review & Publishing' : language === 'ur' ? 'ادارتی جائزے اور اشاعت के लिए भीजें' : 'संपादकीय समीक्षा एवं प्रकाशन हेतु भेजें')}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
                                      {/* TAB 3: MY REPORTS & SUBMISSIONS STATUS */}
            {activeTab === 'my_reports' && (
              <div className="space-y-4">
                
                {/* 1. ENGAGEMENT SUMMARY CARDS (6 METRICS) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-medium">कुल रिपोर्ट्स</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white block mt-0.5">
                      {statsData?.totalReports ?? mySubmissions.length}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-medium">स्वीकृत / प्रकाशित</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      {statsData?.publishedReports ?? mySubmissions.filter(s => s.status === 'approved').length}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-medium flex items-center gap-1">
                      <Eye className="w-3 h-3 text-amber-500" /> कुल व्यूज़
                    </span>
                    <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 block mt-0.5">
                      {(statsData?.totalViews ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-medium flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" /> कुल लाइक्स
                    </span>
                    <span className="text-base font-extrabold text-red-600 dark:text-red-400 block mt-0.5">
                      {(statsData?.totalLikes ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-medium flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-blue-500" /> कुल कमेंट्स
                    </span>
                    <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 block mt-0.5">
                      {(statsData?.totalComments ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-medium flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-emerald-500" /> कुल शेयर्स
                    </span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      {(statsData?.totalShares ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* 2. WEEKLY CONTEST PERFORMANCE CARDS (4 HIGHLIGHTS) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-800 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase">साप्ताहिक रैंक</span>
                      <Trophy className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <span className="text-xl font-black text-amber-700 dark:text-amber-400 block mt-1">
                      {statsData?.weeklyRank ? `#${statsData.weeklyRank}` : '-'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-800 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase">साप्ताहिक स्कोर</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-white block mt-1">
                      {(statsData?.weeklyScore ?? 0).toLocaleString('en-IN')} pts
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-200 dark:border-blue-900/60 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-blue-800 dark:text-blue-300 font-bold uppercase">इस सप्ताह व्यूज़</span>
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-xl font-black text-blue-700 dark:text-blue-400 block mt-1">
                      {(statsData?.viewsThisWeek ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200 dark:border-emerald-900/60 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase">अगली रैंक दूरी</span>
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 block mt-1">
                      {statsData?.pointsToNextRank ? `${statsData.pointsToNextRank} pts दूर` : 'शीर्ष पर!'}
                    </span>
                  </div>
                </div>

                {/* 3. WEEKLY CONTEST MOTIVATION & PRIZES BANNER */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                        🏆 साप्ताहिक पत्रकार चैलेंज
                      </span>
                      <span className="text-xs text-amber-200 font-semibold">
                        {statsData?.activeContest?.title || 'Weekly Citizen Journalist Challenge'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{statsData?.motivationMessage || 'अपनी खबरें शेयर करें और अधिक पाठकों तक पहुंचाकर अंक अर्जित करें!'}</span>
                    </p>
                    {/* Prize badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {(statsData?.activeContest?.prizes || [
                        { rank: 1, amount: 5000, rewardText: '' },
                        { rank: 2, amount: 3000, rewardText: '' },
                        { rank: 3, amount: 1500, rewardText: '' },
                      ]).map((p) => {
                        const hasCash = typeof p.amount === 'number' && p.amount > 0;
                        const label = hasCash 
                          ? `₹${Number(p.amount).toLocaleString('en-IN')}` 
                          : (p.rewardText || '📜 ई-प्रमाणपत्र');
                        return (
                          <span key={p.rank} className="px-2 py-0.5 rounded-lg bg-black/25 text-[10px] font-bold text-amber-200 border border-white/10 flex items-center gap-1">
                            <span>{p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : '🥉'} #{p.rank}:</span>
                            <span>{label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLeaderboardOpen(true)}
                    className="px-4 py-2 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-amber-100 transition cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span>लीडरबोर्ड देखें (Leaderboard)</span>
                  </button>
                </div>
                
                {/* Filter Chips */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-3 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
                  <span className="font-bold text-slate-500 mr-1 shrink-0">
                    {language === 'en' ? 'Status Filter:' : language === 'ur' ? 'حیثیت فلٹر:' : 'स्थिति फ़िल्टर:'}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
                      statusFilter === 'all'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {language === 'en' ? 'All' : language === 'ur' ? 'تمام' : 'सभी'} ({mySubmissions.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter('approved')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
                      statusFilter === 'approved'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {language === 'en' ? 'Approved / Published' : language === 'ur' ? 'منظور شدہ' : 'स्वीकृत / प्रकाशित'} ({mySubmissions.filter((s) => s.status === 'approved').length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter('pending_review')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
                      statusFilter === 'pending_review'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {language === 'en' ? 'Under Review' : language === 'ur' ? 'زیر جائزہ' : 'समीक्षाधीन'} ({mySubmissions.filter((s) => s.status === 'pending_review').length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter('sent_back')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
                      statusFilter === 'sent_back'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {language === 'en' ? 'Revision Needed' : language === 'ur' ? 'ترمیم درکار' : 'संशोधन अपेक्षित'} ({mySubmissions.filter((s) => s.status === 'sent_back').length})
                  </button>
                </div>

                {/* Submissions List */}
                <div className="space-y-3">
                  {isLoadingReports ? (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border text-center text-slate-400 text-sm">
                      {language === 'en' ? 'Loading your reports...' : language === 'ur' ? 'آپ کی رپورٹیں لوڈ ہو रही हैं...' : 'आपकी खबरें लोड हो रही हैं...'}
                    </div>
                  ) : filteredReports.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border text-center text-slate-400 text-sm space-y-3">
                      <p>{language === 'en' ? 'No reports found under this filter.' : 'इस फ़िल्टर में कोई खबर नहीं है।'}</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('submit')}
                        className="px-4 py-2 rounded-xl bg-red-700 text-white font-bold text-xs"
                      >
                        {language === 'en' ? 'Submit New Report' : 'नई खबर दर्ज करें'}
                      </button>
                    </div>
                  ) : (
                    filteredReports.map((sub) => {
                      const isSentBack = sub.status === 'sent_back';
                      const isApproved = sub.status === 'approved';

                      return (
                        <div
                          key={sub.id}
                          className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border p-4 sm:p-5 space-y-3 transition ${
                            isSentBack
                              ? 'border-red-300 dark:border-red-900/80 bg-red-50/20'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  isApproved
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : isSentBack
                                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }`}
                              >
                                {isApproved
                                  ? (language === 'en' ? '✓ Approved / Published' : '✓ स्वीकृत / प्रकाशित')
                                  : isSentBack
                                  ? (language === 'en' ? '⚠ Revision Needed (Sent Back)' : '⚠ संशोधन अपेक्षित (Sent Back)')
                                  : (language === 'en' ? '⏳ Under Editorial Review' : '⏳ संपादकीय समीक्षाधीन')}
                              </span>
                              <span className="text-[11px] text-slate-400">{sub.city}</span>
                            </div>

                            <span className="text-[11px] text-slate-400">
                              {language === 'en' ? 'Submitted: ' : 'प्रस्तुत: '}
                              {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN') : (language === 'en' ? 'Recently' : 'हाल ही में')}
                            </span>
                          </div>

                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            {sub.headline}
                          </h3>

                          {sub.subHeadline && (
                            <p className="text-xs text-slate-500">{sub.subHeadline}</p>
                          )}

                          <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                            {sub.body}
                          </p>

                          {/* Media thumbnails preview if available */}
                          {sub.media && sub.media.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {sub.media.map((m, idx) => (
                                <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shrink-0">
                                  {m.type === 'video' ? (
                                    <div className="w-full h-full relative">
                                      <video src={m.url} className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <Video className="w-4 h-4 text-white" />
                                      </div>
                                      <span className="absolute bottom-0.5 left-0.5 bg-red-600 text-[7px] text-white font-black px-1 rounded">
                                        VIDEO
                                      </span>
                                    </div>
                                  ) : (
                                    <img src={m.url} alt="Attached Media" className="w-full h-full object-cover" />
                                  )}
                                </div>
                              ))}
                              {sub.hasRecordedVideo && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                                  <Video className="w-3 h-3 text-red-600" />
                                  <span>{language === 'en' ? 'Ground Video Included' : 'वीडियो रिपोर्ट संलग्न'}</span>
                                </span>
                              )}
                            </div>
                          )}

                          {/* ENGAGEMENT STATS BAR (FOR APPROVED / PUBLISHED REPORTS) */}
                          {isApproved ? (
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                  📊 सहभागिता आंकड़े (Engagement Stats)
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                    🏆 स्कोर: {((sub.viewsCount || 0) > 0 ? Math.floor((sub.viewsCount || 0) / 100) : 0) + (sub.likesCount || 0) * 2 + (sub.commentsCount || 0) * 3 + (sub.sharesCount || 0) * 4 + 10} pts
                                  </span>
                                  {statsData?.weeklyRank && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                      📈 रैंक: #{statsData.weeklyRank}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* 4-Stat Grid (2x2 on Mobile, 4-col on Desktop) */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                                  <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                                    <Eye className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block font-medium">व्यूज़ (Views)</span>
                                    <span className="font-extrabold text-slate-900 dark:text-white">
                                      {(sub.viewsCount || 0).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                </div>

                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                                  <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300">
                                    <Heart className="w-3.5 h-3.5 fill-red-500" />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block font-medium">लाइक्स (Likes)</span>
                                    <span className="font-extrabold text-slate-900 dark:text-white">
                                      {(sub.likesCount || 0).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                </div>

                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block font-medium">कमेंट्स</span>
                                    <span className="font-extrabold text-slate-900 dark:text-white">
                                      {(sub.commentsCount || 0).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                </div>

                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                                    <Share2 className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block font-medium">शेयर्स (Shares)</span>
                                    <span className="font-extrabold text-slate-900 dark:text-white">
                                      {(sub.sharesCount || 0).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons: [ View News ] [ Like ] [ Share ] [ Comments ] */}
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <Link
                                  href={`/article/${sub.publishedArticleId || sub.id}`}
                                  target="_blank"
                                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>खबर देखें (View News)</span>
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => handleLikeReport(sub)}
                                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                                    userLikesMap[sub.publishedArticleId || sub.id]
                                      ? 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-600'
                                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-red-50/50'
                                  }`}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${userLikesMap[sub.publishedArticleId || sub.id] ? 'fill-red-600 text-red-600' : 'text-slate-500'}`} />
                                  <span>{userLikesMap[sub.publishedArticleId || sub.id] ? 'Liked ❤️' : 'Like'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const targetId = sub.publishedArticleId || sub.id;
                                    const newsUrl = typeof window !== 'undefined'
                                      ? `${window.location.origin}/article/${targetId}`
                                      : `/article/${targetId}`;
                                    setShareModalData({
                                      isOpen: true,
                                      title: sub.headline,
                                      url: newsUrl,
                                      targetId,
                                    });
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                  <span>शेयर करें (Share)</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const targetId = sub.publishedArticleId || sub.id;
                                    setCommentsModalData({
                                      isOpen: true,
                                      targetId,
                                      title: sub.headline,
                                    });
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>कमेंट्स ({sub.commentsCount || 0})</span>
                                </button>
                              </div>
                            </div>
                          ) : null}

                          {/* Editor feedback callout if sent back */}
                          {isSentBack && (
                            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <span className="font-bold block">
                                  {language === 'en' ? 'Editor Feedback:' : 'संपादक की टिप्पणी (Editor Feedback):'}
                                </span>
                                <span>{sub.editorComments || (language === 'en' ? 'Please add more details and resubmit.' : 'कृपया अधिक विवरण जोड़कर दोबारा भेजें।')}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => startEditingReport(sub)}
                                className="px-3 py-1.5 rounded-lg bg-red-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs hover:bg-red-800"
                              >
                                {language === 'en' ? 'Edit & Resubmit' : 'सुधारें (Edit)'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* NEARBY COMPETITOR COMPARISON WIDGET */}
                {leaderboardData && leaderboardData.nearbyRankings?.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          आपके निकटवर्ती प्रतिस्पर्धी (Nearby Journalists Around You)
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsLeaderboardOpen(true)}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
                      >
                        पूरा लीडरबोर्ड देखें →
                      </button>
                    </div>

                    <div className="space-y-2">
                      {leaderboardData.nearbyRankings.map((nearby) => {
                        const isMe = nearby.userId === currentUser?.id;
                        return (
                          <div
                            key={nearby.userId}
                            className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                              isMe
                                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 font-bold'
                                : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-700/60'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                nearby.rank === 1 ? 'bg-amber-400 text-slate-950' : nearby.rank === 2 ? 'bg-slate-300 text-slate-900' : nearby.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}>
                                #{nearby.rank}
                              </span>
                              <div>
                                <span className="text-xs text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                                  {nearby.userName || nearby.name}
                                  {isMe && (
                                    <span className="px-1.5 py-0.2 rounded text-[8px] bg-red-600 text-white uppercase font-black">
                                      YOU
                                    </span>
                                  )}
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  {nearby.district} • {(nearby.viewsCount ?? nearby.views ?? 0).toLocaleString('en-IN')} व्यूज़
                                </span>
                              </div>
                            </div>

                            <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                              {nearby.score.toLocaleString('en-IN')} pts
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 4: MY PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-600" />
                    <span>{language === 'en' ? 'Journalist Profile & Identity' : 'पत्रकार प्रोफ़ाइल एवं परिचय'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en' ? 'Your citizen journalist identity on Swarnim Dastavej network.' : 'स्वर्णिम दस्तावेज़ डिजिटल नेटवर्क पर आपकी नागरिक पत्रकार पहचान।'}
                  </p>
                </div>

                {/* Profile Photo Uploader Section */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-amber-500 text-slate-950 font-black text-3xl flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800">
                        {currentUser?.avatarUrl ? (
                          <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                        ) : (
                          currentUser ? currentUser.name.charAt(0).toUpperCase() : 'J'
                        )}
                      </div>
                      {isUploadingProfile && (
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                          अपलोडिंग...
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {currentUser?.name || 'नागरिक पत्रकार'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {language === 'en' ? 'Upload or update your profile picture from media' : 'मीडिया या गैलरी से अपनी प्रोफ़ाइल तस्वीर अपलोड करें'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={profileFileInputRef}
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploadingProfile}
                      onClick={() => profileFileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{isUploadingProfile ? 'अपलोड हो रहा है...' : (language === 'en' ? 'Change Photo from Media' : 'मीडिया से फ़ोटो बदलें')}</span>
                    </button>
                    {currentUser?.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          updateCurrentUser({ avatarUrl: undefined });
                          addNotification('प्रोफ़ाइल फोटो हटा दी गई');
                        }}
                        className="px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/60 transition cursor-pointer"
                      >
                        {language === 'en' ? 'Remove' : 'हटाएं'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {language === 'en' ? 'Journalist Name:' : language === 'ur' ? 'صحافی کا نام:' : 'पत्रकार का नाम:'}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block mt-0.5">
                      {currentUser?.name}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {language === 'en' ? 'Email Address:' : language === 'ur' ? 'ای میل ایڈریس:' : 'ईमेल आईडी:'}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block mt-0.5">
                      {currentUser?.email || (language === 'en' ? 'Not registered' : 'दर्ज नहीं')}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {language === 'en' ? 'Mobile Number:' : language === 'ur' ? 'موبائل نمبر:' : 'मोबाइल नंबर:'}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block mt-0.5">
                      {currentUser?.phone || '+91 95196 231111'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {language === 'en' ? 'Assigned District:' : language === 'ur' ? 'ضلع / علاقہ:' : 'अधिकार क्षेत्र / ज़िला:'}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block mt-0.5">
                      {currentUser?.city || (language === 'en' ? 'Sitapur (UP)' : 'सीतापुर (उत्तर प्रदेश)')}
                    </span>
                  </div>
                </div>

                {/* Identity Verification Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-300 dark:border-amber-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {language === 'en' 
                          ? 'Citizen Journalist Digital ID Card (Verified)' 
                          : language === 'ur' 
                          ? 'شہری صحافی ڈیجیٹل شناختی کارڈ (تصدیق شدہ)' 
                          : 'नागरिक पत्रकार डिजिटल पहचान पत्र (Verified ID)'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {language === 'en'
                          ? 'Accredited by Swarnim Dastavej Editorial Board.'
                          : language === 'ur'
                          ? 'سورنم دستاویز ایڈیٹوریل بورڈ سے تسلیم شدہ۔'
                          : 'स्वर्णिम दस्तावेज़ संपादकीय मंडल द्वारा मान्यता प्राप्त।'}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shrink-0">
                    {language === 'en' ? 'Active' : language === 'ur' ? 'فعال' : 'सक्रिय'}
                  </span>
                </div>

                {/* Performance & Engagement Metrics Overview */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>पत्रकार सहभागिता व प्रदर्शन (Performance & Engagement)</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block font-medium">प्रकाशित खबरें</span>
                      <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        {statsData?.publishedReports ?? mySubmissions.filter(s => s.status === 'approved').length}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block font-medium">कुल पाठक व्यूज़</span>
                      <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 block mt-0.5">
                        {(statsData?.totalViews ?? 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block font-medium">लाइक्स एवं प्रतिक्रियाएं</span>
                      <span className="text-base font-extrabold text-red-600 dark:text-red-400 block mt-0.5">
                        {(statsData?.totalLikes ?? 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block font-medium">कमेंट्स एवं शेयर्स</span>
                      <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 block mt-0.5">
                        {((statsData?.totalComments ?? 0) + (statsData?.totalShares ?? 0)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Weekly Ranking & Nearby Journalists Comparison */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                        साप्ताहिक पत्रकार रैंकिंग (Weekly Ranking)
                      </span>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white mt-0.5">
                        {statsData?.weeklyRank 
                          ? `#${statsData.weeklyRank} (कुल ${leaderboardData?.leaderboard?.length || 1} पत्रकारों में)` 
                          : 'प्रतियोगिता रैंकिंग'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLeaderboardOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>लीडरबोर्ड देखें</span>
                    </button>
                  </div>

                  {leaderboardData && leaderboardData.nearbyRankings?.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-amber-200/60 dark:border-amber-900/60">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">
                        निकटवर्ती रैंकिंग (Nearby Rankings):
                      </span>
                      {leaderboardData.nearbyRankings.map((nearby) => {
                        const isMe = nearby.userId === currentUser?.id;
                        return (
                          <div
                            key={nearby.userId}
                            className={`p-2 rounded-xl flex items-center justify-between text-xs ${
                              isMe
                                ? 'bg-amber-200/60 dark:bg-amber-900/50 font-bold border border-amber-400/80'
                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-700 dark:text-slate-300">
                                #{nearby.rank}
                              </span>
                              <span className="text-slate-900 dark:text-white flex items-center gap-1">
                                {nearby.userName || nearby.name}
                                {isMe && (
                                  <span className="px-1.5 py-0.2 rounded text-[8px] bg-red-600 text-white font-black">
                                    YOU
                                  </span>
                                )}
                              </span>
                            </div>
                            <span className="font-extrabold text-amber-700 dark:text-amber-400">
                              {nearby.score.toLocaleString('en-IN')} pts
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ================= 3. RIGHT PANEL (STICKY SPONSORED & HELPDESK) ================= */}
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-20 self-start max-h-[calc(100vh-5.5rem)] overflow-y-auto scrollbar-none">

            {/* Main Sponsored Ad Card (Reference: Yogsathi Travel/Bhutan Ad) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden group">
              <div className="relative h-44 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80"
                  alt="Travel Bhutan & Himalayan Experience"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                  {language === 'en' ? 'Sponsored' : language === 'ur' ? 'سپانسر شدہ' : 'प्रायोजित (Sponsored)'}
                </span>
                <span className="absolute bottom-2.5 right-2.5 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                  Book Now • 25% Off
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                    Experience The Magic Of Bhutan
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    From serene monasteries to sacred peaks. Luxury stays, flights, guided tours & visa assistance included.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <a
                    href="https://wa.me/919519623111?text=Hi%2C%20I%20want%20to%20enquire%20about%20the%20travel%20packages"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl text-center shadow-xs transition cursor-pointer"
                  >
                    Enquire Now
                  </a>
                  <a
                    href="https://wa.me/919519623111"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-xs transition shrink-0"
                    title="WhatsApp Enquiry"
                    aria-label="WhatsApp Enquiry"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* Trending Local Ground Topics */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'en' ? 'Trending Ground Topics' : language === 'ur' ? 'ٹرینڈنگ موضوعات' : 'ट्रेंडिंग ग्राउंड मुद्दे'}</span>
                </span>
                <span className="text-[10px] text-amber-600 font-bold bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                  LIVE
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {['#सीतापुर_जलभराव', '#लखनऊ_एक्सप्रेसवे', '#किसान_एमएसपी', '#स्वास्थ्य_मिशन', '#स्मार्ट_सिटी'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:text-amber-600 cursor-pointer transition"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Editorial Desk Guidelines */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 space-y-2.5">
              <div className="text-xs font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{language === 'en' ? 'Editorial Code of Conduct' : language === 'ur' ? 'ایڈیٹوریل ضابطہ اخلاق' : 'संपादकीय आचार संहिता'}</span>
              </div>
              <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    {language === 'en' 
                      ? 'Always mention authentic evidence and exact ground location.' 
                      : language === 'ur' 
                      ? 'ہر رپورٹ میں ثبوت اور صحیح مقام کا ذکر کریں۔' 
                      : 'प्रत्येक रिपोर्ट में प्रत्यक्ष साक्ष्य और सटीक स्थान का उल्लेख करें।'}
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    {language === 'en' 
                      ? 'Reports go live on portal upon editorial approval.' 
                      : language === 'ur' 
                      ? 'ادارتی ٹیم کی منظوری کے بعد خبر فوری لائیو ہوگی۔' 
                      : 'संपादकीय टीम द्वारा स्वीकृत होते ही खबर पोर्टल पर लाइव होगी।'}
                  </span>
                </li>
              </ul>
            </div>

            {/* 24x7 Journalist Desk */}
            <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-2xl p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  {language === 'en' ? '24x7 Desk' : language === 'ur' ? '24x7 ڈیسک' : '24x7 डेस्क'}
                </span>
                <PhoneCall className="w-4 h-4 text-amber-200" />
              </div>
              <div className="font-extrabold text-sm">
                {language === 'en' ? 'Editorial Helpline Support' : language === 'ur' ? 'ایڈیٹر ہیلپ لائن سپورٹ' : 'संपादक हेल्पलाइन सहायता'}
              </div>
              <p className="text-[11px] text-amber-100 leading-snug">
                {language === 'en'
                  ? 'For urgent reports or technical support, call:'
                  : language === 'ur'
                  ? 'ہنگامی رپورٹ یا تکنیکی مدد کے لیے رابطہ کریں:'
                  : 'आपातकालीन ग्राउंड रिपोर्ट या तकनीकी समस्या हेतु कॉल करें:'}
              </p>
              <a
                href="tel:9519623111"
                className="inline-block font-mono font-bold text-xs bg-white text-slate-900 px-3 py-1.5 rounded-lg shadow-xs mt-1 hover:bg-amber-50 transition"
              >
                +91 95196 23111
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* Share Modal */}
      {shareModalData && (
        <ShareModal
          isOpen={shareModalData.isOpen}
          onClose={() => setShareModalData(null)}
          title={shareModalData.title}
          url={shareModalData.url}
          articleId={shareModalData.targetId}
          userId={currentUser?.id}
          onShareLogged={(newShares) => {
            if (typeof newShares === 'number') {
              setMySubmissions((prev) =>
                prev.map((s) => (s.id === shareModalData.targetId || s.publishedArticleId === shareModalData.targetId ? { ...s, sharesCount: newShares } : s))
              );
              fetchJournalistStats();
            }
          }}
        />
      )}

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        contest={leaderboardData?.contest || statsData?.activeContest || null}
        leaderboard={leaderboardData?.leaderboard || []}
        currentUserId={currentUser?.id}
      />

      {/* Comments Drawer/Modal */}
      {commentsModalData && (
        <ArticleCommentsModal
          isOpen={commentsModalData.isOpen}
          onClose={() => setCommentsModalData(null)}
          targetId={commentsModalData.targetId}
          targetTitle={commentsModalData.title}
          currentUser={currentUser}
          onCommentCountChange={(count) => {
            setMySubmissions((prev) =>
              prev.map((s) => (s.id === commentsModalData.targetId || s.publishedArticleId === commentsModalData.targetId ? { ...s, commentsCount: count } : s))
            );
            fetchJournalistStats();
          }}
          onRequireAuth={() => openAuthModal('login')}
        />
      )}

      <Footer />
    </div>
  );
}

export default function JournalistDashboard() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500 font-bold">
        लोड हो रहा है...
      </div>
    }>
      <JournalistDashboardContent />
    </React.Suspense>
  );
}
