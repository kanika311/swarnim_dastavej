'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { TOPICS } from '@/components/TopicsSidebar';
import { 
  Article, 
  CitizenSubmission, 
  User, 
  UserRole,
  AdBanner, 
  GrievanceComplaint, 
  ArticleCategory,
  EPaperEdition,
  SiteSettings,
  LanguageCode,
  EPaperPricingPlan,
  SubmissionStatus
} from '@/types';
import { 
  INITIAL_ARTICLES, 
  INITIAL_SUBMISSIONS, 
  INITIAL_USERS, 
  INITIAL_ADS, 
  INITIAL_GRIEVANCES 
} from '@/lib/initialData';
import { ALL_INDIA_LOCATIONS } from '@/lib/locations';
import { 
  LayoutDashboard, 
  Newspaper, 
  FileCheck, 
  FileText, 
  Users, 
  Megaphone, 
  Scale, 
  Search, 
  Plus, 
  ExternalLink, 
  Check, 
  X, 
  RotateCcw, 
  Eye, 
  LogOut, 
  Globe, 
  ChevronDown, 
  Clock, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  Download,
  Trash2,
  UploadCloud,
  FileUp,
  Loader2,
  Camera,
  Video,
  Film,
  Edit2,
  Ban,
  UserCheck,
  UserX,
  Settings,
  KeyRound,
  Save,
  CreditCard,
  Sparkles,
  Lock,
  Power,
  CheckCircle,
  XCircle,
  EyeOff,
  Menu,
  Trophy
} from 'lucide-react';
import JournalistContestAdmin from '@/components/admin/JournalistContestAdmin';
import { convertImageToWebP } from '@/lib/imageOptimization';

export default function AdminDashboardPage() {
  const { 
    currentUser, 
    sessionReady,
    login,
    switchRole, 
    logout,
    epaperEditions, 
    addOrUpdateEdition, 
    deleteEdition,
    pricingPlans,
    addOrUpdatePricingPlan,
    deletePricingPlan,
    language,
    setLanguage,
    recordUpdate,
    lastUpdatedTime
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submissions' | 'contests' | 'epaper' | 'pricing' | 'articles' | 'videos' | 'users' | 'journalists' | 'ads' | 'grievances' | 'settings' | 'admins'>('dashboard');
  const [tabSearchQuery, setTabSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gateEmail, setGateEmail] = useState('');
  const [gatePassword, setGatePassword] = useState('');
  const [showGatePassword, setShowGatePassword] = useState(false);
  const [gateError, setGateError] = useState('');
  const [gateBusy, setGateBusy] = useState(false);
  const [adminSessionUser, setAdminSessionUser] = useState<User | null>(null);
  const [gateReady, setGateReady] = useState(false);

  useEffect(() => {
    try {
      const activeAdmin = sessionStorage.getItem('swarnim_admin_active_session');
      if (activeAdmin) {
        const parsed = JSON.parse(activeAdmin);
        if (parsed && (parsed.role === 'admin' || parsed.role === 'super_admin' || parsed.role === 'editor')) {
          setAdminSessionUser(parsed);
        }
      }
    } catch {}
    setGateReady(true);
  }, []);

  // User Management Tab States (Readers)
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserCity, setNewUserCity] = useState('लखनऊ');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);

  // Journalist Tab States
  const [journoFilter, setJournoFilter] = useState<'all' | 'citizen' | 'staff' | 'active' | 'inactive' | 'pending_kyc'>('all');
  const [journoSearchQuery, setJournoSearchQuery] = useState('');
  
  // Data states
  const [submissions, setSubmissions] = useState<CitizenSubmission[]>(INITIAL_SUBMISSIONS);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [ads, setAds] = useState<AdBanner[]>(INITIAL_ADS);
  const [showAdForm, setShowAdForm] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [adTitle, setAdTitle] = useState('');
  const [adAdvertiser, setAdAdvertiser] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adTargetUrl, setAdTargetUrl] = useState('');
  const [adPlacement, setAdPlacement] = useState<AdBanner['placement']>('sidebar');
  const [adActive, setAdActive] = useState(true);
  const [adUploading, setAdUploading] = useState(false);
  const [grievances, setGrievances] = useState<GrievanceComplaint[]>(INITIAL_GRIEVANCES);

  // Review & action state
  const [reviewNote, setReviewNote] = useState('');
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  // News Submissions Filter & Edit States
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'approved' | 'pending_review' | 'inactive' | 'sent_back' | 'rejected'>('all');
  const [editingSubmission, setEditingSubmission] = useState<CitizenSubmission | null>(null);
  const [editSubHeadline, setEditSubHeadline] = useState('');
  const [editSubSubHeadline, setEditSubSubHeadline] = useState('');
  const [editSubBody, setEditSubBody] = useState('');
  const [editSubCategory, setEditSubCategory] = useState<ArticleCategory>('sitapur');
  const [editSubCity, setEditSubCity] = useState('सीतापुर');
  const [editSubStatus, setEditSubStatus] = useState<SubmissionStatus>('pending_review');
  const [editSubComments, setEditSubComments] = useState('');
  const [isSavingSub, setIsSavingSub] = useState(false);

  // New Article Form state
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ArticleCategory>('state-city');
  const [newCity, setNewCity] = useState('Lucknow');
  const [newLanguage, setNewLanguage] = useState<LanguageCode>('hi');
  const [artFilterLanguage, setArtFilterLanguage] = useState<string>('all');
  const [newBody, setNewBody] = useState('');
  const [newIsBreaking, setNewIsBreaking] = useState(false);
  const [newCoverImage, setNewCoverImage] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [photoFileName, setPhotoFileName] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const [shelfTitle, setShelfTitle] = useState('');
  const [shelfCity, setShelfCity] = useState('लखनऊ');
  const [shelfVideoUrl, setShelfVideoUrl] = useState('');
  const [shelfFileName, setShelfFileName] = useState('');
  const [shelfUploading, setShelfUploading] = useState(false);
  const [shelfSaving, setShelfSaving] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      setPhotoFileName(file.name);
      const fileToUpload = await convertImageToWebP(file);
      const formData = new FormData();
      formData.append('file', fileToUpload);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        setNewCoverImage(data.url);
        const kb = data.size ? `${Math.max(1, Math.round(data.size / 1024))} KB` : '';
        setPhotoFileName(kb ? `WebP · ${kb}` : 'WebP');
      } else {
        alert(data.message || 'Photo upload failed');
      }
    } catch (err) {
      alert('Photo upload failed. You can paste an image URL instead.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingVideo(true);
      setVideoFileName(file.name);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        setNewVideoUrl(data.url);
        const mb = data.size ? `${(data.size / (1024 * 1024)).toFixed(1)} MB` : '';
        setVideoFileName(mb ? `compressed MP4 · ${mb}` : 'compressed MP4');
      } else {
        alert(data.message || 'Video upload failed');
      }
    } catch (err) {
      alert('Video upload failed. You can paste a video URL instead.');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // E-Paper Form state
  const [showAddEPaper, setShowAddEPaper] = useState(false);
  const [editingEditionId, setEditingEditionId] = useState<string | null>(null);
  const [epDate, setEpDate] = useState('2026-09-27');
  const [epCity, setEpCity] = useState('Lucknow');
  const [epTitle, setEpTitle] = useState('Swarnim Dastavej - Lucknow Main Edition');
  const [epLanguage, setEpLanguage] = useState<LanguageCode>('hi');
  const [epFilterLanguage, setEpFilterLanguage] = useState<string>('all');
  const [epPagesCount, setEpPagesCount] = useState(6);
  const [epPdfUrl, setEpPdfUrl] = useState('');
  const [epActive, setEpActive] = useState(true);
  const [uploadTab, setUploadTab] = useState<'device' | 'url'>('device');
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadError('Please select a valid PDF document (.pdf)');
      return;
    }

    try {
      setIsUploadingPdf(true);
      setUploadError('');
      setUploadedFileName(file.name);
      setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success && data.url) {
        setEpPdfUrl(data.url);
        if (!epTitle || epTitle === 'Swarnim Dastavej - Lucknow Main Edition') {
          const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setEpTitle(`Swarnim Dastavej - ${rawName}`);
        }
      } else {
        setUploadError(data.message || 'File upload failed');
      }
    } catch (err: any) {
      setUploadError('Failed to upload file from device. Please retry or enter URL.');
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Check URL query param for default tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'epaper') setActiveTab('epaper');
      else if (tabParam === 'submissions') setActiveTab('submissions');
      else if (tabParam === 'articles') setActiveTab('articles');
      else if (tabParam === 'videos') setActiveTab('videos');
      else if (tabParam === 'users' || tabParam === 'journalists') setActiveTab('journalists');
      else if (tabParam === 'settings' || tabParam === 'policies') setActiveTab('settings');
      else if (tabParam === 'admins') setActiveTab('admins');
      else if (tabParam === 'ads') setActiveTab('ads');
    }
  }, []);

  // Refresh live data from backend APIs
  useEffect(() => {
    fetch('/api/submissions').then(r => r.json()).then(d => d.success && setSubmissions(d.data)).catch(() => {});
    fetch('/api/articles').then(r => r.json()).then(d => d.success && setArticles(d.data)).catch(() => {});
    fetch('/api/users').then(r => r.json()).then(d => d.success && setUsers(d.data)).catch(() => {});
    fetch('/api/grievance').then(r => r.json()).then(d => d.success && setGrievances(d.data)).catch(() => {});
    fetch('/api/ads', { cache: 'no-store' }).then(r => r.json()).then(d => d.success && setAds(d.data)).catch(() => {});
  }, []);

  // Review Actions: Approve / Reject / Send Back
  const handleReviewAction = async (subId: string, action: 'approve' | 'reject' | 'send_back', note?: string) => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: subId,
          action,
          comments: note,
          reviewerName: currentUser?.name || 'Chief Editor'
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSubmissions(prev => prev.map(s => s.id === subId ? data.data : s));
        if (action === 'approve') {
          fetch('/api/articles').then(r => r.json()).then(d => d.success && setArticles(d.data));
          alert('Article approved and published to live portal successfully!');
        } else if (action === 'send_back') {
          alert('Article sent back to journalist for revisions.');
        } else {
          alert('Article rejected.');
        }
        recordUpdate();
      }
    } catch (e) {
      alert('Action completed successfully.');
    } finally {
      setSelectedSubId(null);
      setReviewNote('');
    }
  };

  // News Submission Handlers: Edit, Delete, Toggle Active
  const handleStartEditSubmission = (sub: CitizenSubmission) => {
    setEditingSubmission(sub);
    setEditSubHeadline(sub.headline || '');
    setEditSubSubHeadline(sub.subHeadline || '');
    setEditSubBody(sub.body || '');
    setEditSubCategory(sub.category || 'sitapur');
    setEditSubCity(sub.city || 'सीतापुर');
    setEditSubStatus(sub.status || 'pending_review');
    setEditSubComments(sub.editorComments || '');
  };

  const handleSaveEditSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubmission) return;
    if (!editSubHeadline.trim() || !editSubBody.trim()) {
      alert('शीर्षक (Headline) और विवरण (Body) अनिवार्य हैं।');
      return;
    }

    try {
      setIsSavingSub(true);
      const res = await fetch('/api/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingSubmission.id,
          action: 'edit',
          headline: editSubHeadline.trim(),
          subHeadline: editSubSubHeadline.trim(),
          body: editSubBody.trim(),
          category: editSubCategory,
          city: editSubCity.trim(),
          status: editSubStatus,
          editorComments: editSubComments.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSubmissions(prev => prev.map(s => s.id === editingSubmission.id ? data.data : s));
        if (editSubStatus === 'approved') {
          fetch('/api/articles?status=all').then(r => r.json()).then(d => d.success && setArticles(d.data));
        }
        recordUpdate();
        alert('खबर विवरण सफलतापूर्वक अपडेट किया गया!');
        setEditingSubmission(null);
      } else {
        alert(data.message || 'अपडेट करने में समस्या आई।');
      }
    } catch {
      alert('अपडेट करने में समस्या आई।');
    } finally {
      setIsSavingSub(false);
    }
  };

  const handleDeleteSubmission = async (subId: string, headline?: string) => {
    if (!confirm(`क्या आप इस खबर को हटाना (Delete) चाहते हैं?\n\n"${headline || subId}"`)) {
      return;
    }
    try {
      const res = await fetch(`/api/submissions?id=${encodeURIComponent(subId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions(prev => prev.filter(s => s.id !== subId));
        recordUpdate();
        alert('खबर सफलतापूर्वक डिलीट कर दी गई।');
      } else {
        alert(data.message || 'डिलीट करने में समस्या आई।');
      }
    } catch {
      alert('डिलीट करने में समस्या आई।');
    }
  };

  const handleToggleSubmissionActive = async (sub: CitizenSubmission) => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sub.id,
          action: 'toggle_active',
          comments: sub.status === 'approved' ? 'व्यवस्थापक द्वारा निष्क्रिय' : 'व्यवस्थापक द्वारा सक्रिय'
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSubmissions(prev => prev.map(s => s.id === sub.id ? data.data : s));
        fetch('/api/articles?status=all').then(r => r.json()).then(d => d.success && setArticles(d.data));
        recordUpdate();
        alert(data.message || 'स्थिति अपडेट की गई।');
      } else {
        alert(data.message || 'स्थिति बदलने में समस्या आई।');
      }
    } catch {
      alert('स्थिति बदलने में समस्या आई।');
    }
  };

  // Article Active / Inactive Toggle Handler
  const handleToggleArticleActive = async (art: Article) => {
    const newStatus = art.status === 'published' ? 'inactive' : 'published';
    try {
      const res = await fetch(`/api/articles/${art.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setArticles(prev => prev.map(a => a.id === art.id ? { ...a, status: newStatus as any } : a));
        recordUpdate();
        alert(newStatus === 'published' ? 'खबर अब पोर्टल पर सक्रिय (Active / Live) है।' : 'खबर निष्क्रिय (Inactive) कर दी गई है।');
      } else {
        alert(data.message || 'Could not update status');
      }
    } catch {
      alert('Could not update status');
    }
  };

  // Create article handler
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) {
      alert('Headline and story content are required.');
      return;
    }

    try {
      const payload = {
        headline: newTitle.trim(),
        body: newBody.trim(),
        category: newCategory,
        city: newCity,
        language: newLanguage,
        isBreaking: newIsBreaking,
        coverImage: newCoverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80',
        mediaGallery: [
          ...(newCoverImage ? [{ id: `img-${Date.now()}`, type: 'image' as const, url: newCoverImage, caption: newTitle }] : []),
          ...(newVideoUrl ? [{ id: `vid-${Date.now()}`, type: 'video' as const, url: newVideoUrl, caption: 'News Video' }] : [])
        ],
        author: {
          id: currentUser?.id || 'admin_1',
          name: currentUser?.name || 'Editorial Desk',
          role: 'admin' as const
        }
      };
      const res = await fetch(editingArticleId ? `/api/articles/${editingArticleId}` : '/api/articles', {
        method: editingArticleId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (editingArticleId) {
          setArticles(prev => prev.map(a => a.id === editingArticleId ? data.data : a));
          recordUpdate();
          alert('Article updated.');
        } else {
          setArticles(prev => [data.data, ...prev]);
          recordUpdate();
          alert('Article published live to portal!');
        }
      } else {
        alert(data.message || 'Could not save article.');
      }
    } catch (e) {
      alert('Could not save article.');
    } finally {
      resetArticleForm();
    }
  };

  const handleShelfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShelfUploading(true);
    setShelfFileName(file.name);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.success && data.url) {
        setShelfVideoUrl(data.url);
        const mb = data.size ? `${Math.max(1, Math.round(data.size / 1024 / 1024))} MB` : '';
        setShelfFileName(mb ? `compressed MP4 · ${mb}` : 'compressed MP4');
      } else {
        alert(data.message || 'Video upload failed');
      }
    } catch {
      alert('Video upload failed');
    } finally {
      setShelfUploading(false);
    }
  };

  const handlePublishShelfVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shelfTitle.trim() || !shelfVideoUrl) {
      alert('शीर्षक और वीडियो दोनों चाहिए।');
      return;
    }
    setShelfSaving(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: shelfTitle.trim(),
          body: shelfTitle.trim(),
          category: 'videos',
          city: shelfCity.trim() || 'लखनऊ',
          language: 'hi',
          showOnVideos: true,
          coverImage: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1000&auto=format&fit=crop&q=80',
          mediaGallery: [{ id: `vid-${Date.now()}`, type: 'video', url: shelfVideoUrl, caption: shelfTitle.trim() }],
          author: {
            id: currentUser?.id || 'admin_1',
            name: currentUser?.name || 'Editorial Desk',
            role: 'admin'
          }
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setArticles(prev => [data.data, ...prev]);
        setShelfTitle('');
        setShelfVideoUrl('');
        setShelfFileName('');
        alert('वीडियो पेज पर लगा दिया गया।');
      } else {
        alert(data.message || 'Video could not be saved');
      }
    } catch {
      alert('Video could not be saved');
    } finally {
      setShelfSaving(false);
    }
  };

  const handleToggleVideoPage = async (article: Article) => {
    const next = !article.showOnVideos;
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showOnVideos: next })
      });
      const data = await res.json();
      if (data.success) {
        setArticles(prev => prev.map(item => item.id === article.id ? { ...item, showOnVideos: next } : item));
      } else {
        alert(data.message || 'Could not update video page');
      }
    } catch {
      alert('Could not update video page');
    }
  };

  const resetEpaperForm = () => {
    setShowAddEPaper(false);
    setEditingEditionId(null);
    setEpDate('2026-09-27');
    setEpCity('Lucknow');
    setEpTitle('Swarnim Dastavej - Lucknow Main Edition');
    setEpLanguage('hi');
    setEpPagesCount(6);
    setEpPdfUrl('');
    setEpActive(true);
    setUploadedFileName('');
    setUploadedFileSize('');
    setUploadError('');
    setUploadTab('device');
  };

  const handleStartEditEdition = (edition: EPaperEdition) => {
    setEditingEditionId(edition.id);
    setEpDate(edition.date);
    setEpCity(edition.editionCity);
    setEpTitle(edition.editionTitle);
    setEpLanguage(edition.language || 'hi');
    setEpPagesCount(edition.pagesCount || edition.pages.length || 1);
    setEpPdfUrl(edition.pages.find((page) => page.pdfUrl)?.pdfUrl || '');
    setEpActive(edition.isActive !== false);
    setUploadedFileName('');
    setUploadedFileSize('');
    setUploadError('');
    setShowAddEPaper(true);
  };

  const handleToggleEdition = (edition: EPaperEdition) => {
    addOrUpdateEdition({ ...edition, isActive: edition.isActive === false });
  };

  // Add or update E-Paper Edition
  const handleAddEPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    const existing = editingEditionId
      ? epaperEditions.find((edition) => edition.id === editingEditionId)
      : undefined;
    const pdfUrl = epPdfUrl || existing?.pages.find((page) => page.pdfUrl)?.pdfUrl || '';
    const pageCount = Math.max(1, epPagesCount || 1);
    const pages = Array.from({ length: pageCount }, (_, i) => ({
      pageNumber: i + 1,
      title: existing?.pages[i]?.title || `Page ${i + 1}`,
      imageUrl: existing?.pages[i]?.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
      pdfUrl: pdfUrl || existing?.pages[i]?.pdfUrl
    }));

    const edition: EPaperEdition = {
      id: editingEditionId || `epaper-${Date.now()}`,
      date: epDate,
      editionCity: epCity,
      editionTitle: epTitle,
      language: epLanguage,
      pagesCount: pageCount,
      pdfUrl: pdfUrl,
      thumbnailUrl: existing?.thumbnailUrl || pages[0]?.imageUrl || '',
      pages,
      isActive: epActive
    };

    const wasEditing = Boolean(editingEditionId);
    addOrUpdateEdition(edition);

    // Also persist to API
    try {
      await fetch('/api/epaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edition)
      });
    } catch (err) {}

    resetEpaperForm();
    alert(wasEditing ? 'E-Paper edition updated.' : 'New E-Paper edition published.');
  };

  // KYC Approval handler
  const handleApproveKYC = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, kycStatus: 'verified' as const };
      }
      return u;
    }));
    alert('Journalist KYC verified successfully!');
  };

  // User Management state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('reader');
  const [editKyc, setEditKyc] = useState<'not_submitted' | 'pending' | 'verified' | 'rejected'>('verified');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  const [settingsForm, setSettingsForm] = useState<SiteSettings>({
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
    privacyPolicy: '',
    termsOfService: '',
    editorialPolicy: '',
    updatedAt: ''
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) setSettingsForm(d.data);
      })
      .catch(() => {});
  }, []);

  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('+91 95196 231111');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminRole, setAdminRole] = useState<UserRole>('admin');
  const [adminCity, setAdminCity] = useState('लखनऊ');
  const [showAddJournalist, setShowAddJournalist] = useState(false);
  const [journoName, setJournoName] = useState('');
  const [journoEmail, setJournoEmail] = useState('');
  const [journoPhone, setJournoPhone] = useState('');
  const [journoPassword, setJournoPassword] = useState('');
  const [showJournoPassword, setShowJournoPassword] = useState(false);
  const [journoRole, setJournoRole] = useState<UserRole>('citizen_journalist');
  const [journoCity, setJournoCity] = useState('लखनऊ');

  const handleCreateJournalist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journoName.trim() || !journoEmail.trim() || !journoPassword.trim()) {
      alert('Name, email, and password are required.');
      return;
    }
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: journoName.trim(),
          email: journoEmail.trim(),
          phone: journoPhone.trim(),
          password: journoPassword.trim(),
          role: journoRole,
          city: journoCity.trim() || 'लखनऊ'
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUsers(prev => [data.data, ...prev.filter(u => u.id !== data.data.id)]);
        setShowAddJournalist(false);
        setJournoName('');
        setJournoEmail('');
        setJournoPhone('');
        setJournoPassword('');
        setJournoRole('citizen_journalist');
        alert('Journalist account created. They can log in with this email and password.');
      } else {
        alert(data.message || 'Could not add journalist.');
      }
    } catch {
      alert('Could not add journalist.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert('कृपया पाठक का नाम और ईमेल दर्ज करें।');
      return;
    }

    const newUser: User = {
      id: `user_reader_${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim(),
      password: newUserPassword.trim() || 'reader123',
      role: 'reader',
      city: newUserCity.trim() || 'लखनऊ',
      preferredLanguage: 'hi',
      kycStatus: 'not_submitted',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUsers(prev => [data.data, ...prev]);
      } else {
        setUsers(prev => [newUser, ...prev]);
      }
    } catch {
      setUsers(prev => [newUser, ...prev]);
    }
    setShowAddUser(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserPassword('');
    alert('नया पाठक सफलतापूर्वक पंजीकृत हुआ!');
  };

  const handleStartEditUser = (u: User) => {
    setEditingUser(u);
    setEditName(u.name || '');
    setEditEmail(u.email || '');
    setEditPhone(u.phone || '');
    setEditCity(u.city || '');
    setEditRole(u.role || 'reader');
    setEditKyc(u.kycStatus || 'pending');
    setEditPassword('');
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          city: editCity.trim(),
          role: editRole,
          kycStatus: editKyc,
          ...(editPassword.trim() ? { password: editPassword.trim() } : {})
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? data.data : u));
        alert('User profile updated successfully!');
      } else {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? {
          ...u,
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          city: editCity.trim(),
          role: editRole,
          kycStatus: editKyc
        } : u));
        alert('Profile saved!');
      }
    } catch (e) {
      alert('Updated profile successfully.');
    } finally {
      setEditingUser(null);
    }
  };

  const handleToggleBan = async (u: User) => {
    const isCurrentlyActive = !u.isBanned && u.isActive !== false;
    const actionText = isCurrentlyActive ? 'निष्क्रिय (Deactivate / Block)' : 'सक्रिय (Activate)';
    if (!confirm(`क्या आप ${u.name} को ${actionText} करना चाहते हैं?`)) return;

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: u.id,
          action: 'toggle_ban'
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUsers(prev => prev.map(x => x.id === u.id ? data.data : x));
      } else {
        setUsers(prev => prev.map(x => x.id === u.id ? { 
          ...x, 
          isBanned: isCurrentlyActive,
          isActive: !isCurrentlyActive
        } : x));
      }
      alert(`उपयोगकर्ता स्थिति सफलतापूर्वक अपडेट की गई: ${actionText}`);
    } catch {
      setUsers(prev => prev.map(x => x.id === u.id ? { 
        ...x, 
        isBanned: isCurrentlyActive,
        isActive: !isCurrentlyActive
      } : x));
      alert(`उपयोगकर्ता स्थिति अपडेट की गई: ${actionText}`);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`क्या आप "${userName}" को स्थायी रूप से हटाना (Delete) चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।`)) return;

    try {
      const res = await fetch(`/api/admins?userId=${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        alert('खाता सफलतापूर्वक हटा दिया गया।');
      } else {
        alert(data.message || 'खाता हटाने में त्रुटि हुई।');
      }
    } catch {
      alert('खाता हटाने में त्रुटि हुई।');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsMessage('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSettingsForm(data.data);
        setSettingsMessage('Contact details, registration number, and policies saved. Footer, privacy policy, and terms now use these values.');
      } else {
        setSettingsMessage(data.message || 'Could not save settings.');
      }
    } catch {
      setSettingsMessage('Could not save settings.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      alert('Name, email, and password are required.');
      return;
    }
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: adminName.trim(),
          email: adminEmail.trim(),
          phone: adminPhone.trim(),
          password: adminPassword.trim(),
          role: adminRole,
          city: adminCity.trim() || 'लखनऊ'
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUsers(prev => [data.data, ...prev.filter(u => u.id !== data.data.id)]);
        setShowAddAdmin(false);
        setAdminName('');
        setAdminEmail('');
        setAdminPassword('');
        alert('Administrator account created. They can log in with this email and password.');
      } else {
        alert(data.message || 'Could not create admin.');
      }
    } catch {
      alert('Could not create admin.');
    }
  };

  const handleStartEditArticle = (art: Article) => {
    setEditingArticleId(art.id);
    setNewTitle(art.headline);
    setNewCategory(art.category);
    setNewCity(art.city);
    setNewLanguage(art.language || 'hi');
    setNewBody(art.body);
    setNewIsBreaking(!!art.isBreaking);
    setNewCoverImage(art.coverImage || '');
    const video = art.mediaGallery?.find(item => item.type === 'video');
    setNewVideoUrl(video?.url || '');
    setShowAddArticle(true);
  };

  const resetArticleForm = () => {
    setShowAddArticle(false);
    setEditingArticleId(null);
    setNewTitle('');
    setNewLanguage('hi');
    setNewBody('');
    setNewCoverImage('');
    setNewVideoUrl('');
    setPhotoFileName('');
    setVideoFileName('');
    setNewIsBreaking(false);
  };

  const handleDeleteArticle = async (articleId: string, headline: string) => {
    if (!confirm(`Delete this article?\n\n${headline}`)) return;
    try {
      const res = await fetch(`/api/articles/${articleId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setArticles(prev => prev.filter(a => a.id !== articleId));
        recordUpdate();
      } else {
        alert(data.message || 'Could not delete article.');
      }
    } catch {
      alert('Could not delete article.');
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: string) => {
    setSettingsForm(prev => ({ ...prev, [key]: value }));
  };

  const resetAdForm = () => {
    setShowAdForm(false);
    setEditingAdId(null);
    setAdTitle('');
    setAdAdvertiser('');
    setAdImageUrl('');
    setAdTargetUrl('');
    setAdPlacement('sidebar');
    setAdActive(true);
  };

  const handleStartEditAd = (ad: AdBanner) => {
    setEditingAdId(ad.id);
    setAdTitle(ad.title);
    setAdAdvertiser(ad.advertiser);
    setAdImageUrl(ad.imageUrl);
    setAdTargetUrl(ad.targetUrl);
    setAdPlacement(ad.placement);
    setAdActive(ad.isActive);
    setShowAdForm(true);
  };

  const handleAdImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setAdUploading(true);
      const fileToUpload = await convertImageToWebP(file);
      const formData = new FormData();
      formData.append('file', fileToUpload);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) setAdImageUrl(data.url);
      else alert(data.message || 'Image upload failed');
    } catch {
      alert('Image upload failed');
    } finally {
      setAdUploading(false);
    }
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adAdvertiser.trim()) return;
    let formattedTargetUrl = adTargetUrl.trim() || '#';
    if (formattedTargetUrl !== '#' && !formattedTargetUrl.startsWith('http://') && !formattedTargetUrl.startsWith('https://') && !formattedTargetUrl.startsWith('/')) {
      formattedTargetUrl = `https://${formattedTargetUrl}`;
    }
    const payload = {
      id: editingAdId,
      title: adTitle.trim(),
      advertiser: adAdvertiser.trim(),
      imageUrl: adImageUrl.trim(),
      targetUrl: formattedTargetUrl,
      placement: adPlacement,
      isActive: adActive
    };
    try {
      const res = await fetch('/api/ads', {
        method: editingAdId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAds(prev => editingAdId
          ? prev.map(a => a.id === editingAdId ? data.data : a)
          : [data.data, ...prev]
        );
        resetAdForm();
      } else {
        alert(data.message || 'Could not save advertisement');
      }
    } catch {
      alert('Could not save advertisement');
    }
  };

  const handleToggleAd = async (ad: AdBanner) => {
    try {
      const res = await fetch('/api/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ad.id, isActive: !ad.isActive })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAds(prev => prev.map(a => a.id === ad.id ? data.data : a));
      }
    } catch {
      alert('Could not update advertisement status');
    }
  };

  const handleDeleteAd = async (ad: AdBanner) => {
    if (!confirm(`Delete this advertisement?\n\n${ad.title}`)) return;
    try {
      const res = await fetch(`/api/ads?id=${encodeURIComponent(ad.id)}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ad.id })
      });
      const data = await res.json().catch(() => ({ success: res.ok }));
      if (res.ok || data.success) {
        setAds(prev => prev.filter(a => a.id !== ad.id));
      } else {
        alert(data.message || 'Could not delete advertisement');
      }
    } catch {
      // If network succeeded or local deletion needed
      setAds(prev => prev.filter(a => a.id !== ad.id));
    }
  };

  // Pricing tab state & handlers
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planTitle, setPlanTitle] = useState('');
  const [planTitleEn, setPlanTitleEn] = useState('');
  const [planPrice, setPlanPrice] = useState<number>(1);
  const [planDuration, setPlanDuration] = useState<'single_edition' | 'monthly' | 'yearly'>('single_edition');
  const [planDurationLabel, setPlanDurationLabel] = useState('1 दिन / आज का सम्पूर्ण ई-पेपर');
  const [planDescription, setPlanDescription] = useState('मात्र ₹1 में आज का पूरा ई-पेपर (सभी पृष्ठ) तुरंत अनलॉक करें।');
  const [planFeatures, setPlanFeatures] = useState('आज का संपूर्ण ई-पेपर अनलॉक\nपृष्ठ 2 से 6 तक तुरंत वाचन\nअल्ट्रा हाई रेजोल्यूशन ज़ूम');
  const [planIsPopular, setPlanIsPopular] = useState(false);
  const [planIsActive, setPlanIsActive] = useState(true);

  const resetPricingPlanForm = () => {
    setShowAddPlanModal(false);
    setEditingPlanId(null);
    setPlanTitle('');
    setPlanTitleEn('');
    setPlanPrice(1);
    setPlanDuration('single_edition');
    setPlanDurationLabel('1 दिन / आज का सम्पूर्ण ई-पेपर');
    setPlanDescription('मात्र ₹1 में आज का पूरा ई-पेपर अनलॉक करें।');
    setPlanFeatures('आज का संपूर्ण ई-पेपर अनलॉक\nपृष्ठ 2 से 6 तक तुरंत वाचन\nअल्ट्रा हाई रेजोल्यूशन ज़ूम');
    setPlanIsPopular(false);
    setPlanIsActive(true);
  };

  const handleStartAddPlan = () => {
    resetPricingPlanForm();
    setShowAddPlanModal(true);
  };

  const handleStartEditPlan = (plan: EPaperPricingPlan) => {
    setEditingPlanId(plan.id);
    setPlanTitle(plan.title);
    setPlanTitleEn(plan.titleEn || '');
    setPlanPrice(plan.price);
    setPlanDuration(plan.duration);
    setPlanDurationLabel(plan.durationLabel);
    setPlanDescription(plan.description);
    setPlanFeatures(plan.features.join('\n'));
    setPlanIsPopular(Boolean(plan.isPopular));
    setPlanIsActive(plan.isActive !== false);
    setShowAddPlanModal(true);
  };

  const handleSavePricingPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim() || planPrice < 0) {
      alert('कृपया वैध शीर्षक और मूल्य दर्ज करें।');
      return;
    }

    const featureList = planFeatures
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const newPlan: EPaperPricingPlan = {
      id: editingPlanId || `plan_${Date.now()}`,
      title: planTitle.trim(),
      titleEn: planTitleEn.trim() || undefined,
      price: Number(planPrice),
      duration: planDuration,
      durationLabel: planDurationLabel.trim(),
      description: planDescription.trim(),
      features: featureList.length > 0 ? featureList : ['सभी पृष्ठ अनलॉक', 'एचडी ज़ूम'],
      isPopular: planIsPopular,
      isActive: planIsActive,
      updatedAt: new Date().toISOString()
    };

    addOrUpdatePricingPlan(newPlan);
    resetPricingPlanForm();
    alert(editingPlanId ? 'प्लान सफलतापूर्वक अपडेट हुआ!' : 'नया मूल्य प्लान सक्रिय हुआ!');
  };

  const handleTogglePlanActive = (plan: EPaperPricingPlan) => {
    addOrUpdatePricingPlan({
      ...plan,
      isActive: !plan.isActive
    });
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('क्या आप इस मूल्य प्लान को हटाना चाहते हैं?')) {
      deletePricingPlan(id);
    }
  };

  // Navigation Tabs configuration
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'submissions', label: 'News Submissions', icon: FileCheck, badge: submissions.filter(s => s.status === 'pending_review').length },
    { id: 'contests', label: 'पत्रकार प्रतियोगिता', icon: Trophy },
    { id: 'epaper', label: 'E-Paper Manager', icon: Newspaper, count: epaperEditions.length },
    { id: 'pricing', label: 'E-Paper Price Plans', icon: CreditCard, count: pricingPlans.length },
    { id: 'articles', label: 'Articles / News', icon: FileText, count: articles.length },
    { id: 'videos', label: 'Videos', icon: Video, count: articles.filter(a => a.showOnVideos).length },
    { id: 'users', label: 'Registered Users (पाठक)', icon: UserCheck, count: users.filter(u => u.role === 'reader').length },
    { id: 'journalists', label: 'Journalists (पत्रकार)', icon: Users, count: users.filter(u => u.role === 'citizen_journalist' || u.role === 'staff_reporter').length },
    { id: 'ads', label: 'Advertisements', icon: Megaphone, count: ads.length },
    { id: 'grievances', label: 'Grievances', icon: Scale, count: grievances.length },
    { id: 'settings', label: 'Contact & Policies', icon: Settings },
    { id: 'admins', label: 'Admin Accounts', icon: ShieldCheck, count: users.filter(u => u.role === 'admin' || u.role === 'editor' || u.role === 'super_admin').length }
  ];

  const filteredNavTabs = navTabs.filter(tab => 
    tab.label.toLowerCase().includes(tabSearchQuery.toLowerCase())
  );

  const pendingSubmissions = submissions.filter(s => s.status === 'pending_review');
  const isStaff = Boolean(adminSessionUser && (adminSessionUser.role === 'admin' || adminSessionUser.role === 'super_admin' || adminSessionUser.role === 'editor'));

  const handleAdminGateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateError('');
    if (!gateEmail.trim() || !gatePassword.trim()) {
      setGateError('ईमेल और पासवर्ड दोनों भरें।');
      return;
    }
    setGateBusy(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: gateEmail.trim(),
          password: gatePassword,
          isStaffGate: true
        })
      });
      const data = await res.json();
      if (!data.success || !data.data) {
        setGateError(data.message || 'ईमेल या पासवर्ड गलत है।');
        return;
      }
      const user: User = data.data;
      if (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'editor') {
        setGateError('इस खाते को एडमिन पैनल की अनुमति नहीं है।');
        return;
      }
      try {
        sessionStorage.setItem('swarnim_admin_active_session', JSON.stringify(user));
      } catch {}
      setAdminSessionUser(user);
    } catch {
      setGateError('लॉगिन करने में त्रुटि हुई।');
    } finally {
      setGateBusy(false);
    }
  };

  if (!gateReady) {
    return (
      <div className="min-h-screen bg-[#0B192C] flex items-center justify-center text-amber-200 text-sm font-semibold">
        जाँच हो रही है...
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-[#0B192C] flex items-center justify-center p-4">
        <form onSubmit={handleAdminGateLogin} className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border-2 border-[#D97706] shrink-0">
              <Image src="/logo.png?v=4" alt="Logo" width={48} height={48} className="w-full h-full object-contain" unoptimized />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900">एडमिन लॉगिन</h1>
              <p className="text-xs text-slate-500">पैनल खोलने के लिए ईमेल और पासवर्ड डालें।</p>
            </div>
          </div>
          <label className="block space-y-1">
            <span className="text-xs font-bold text-slate-600">ईमेल या फोन</span>
            <input
              type="text"
              value={gateEmail}
              onChange={(e) => setGateEmail(e.target.value)}
              autoComplete="username"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold text-slate-600">पासवर्ड</span>
            <div className="relative">
              <input
                type={showGatePassword ? "text" : "password"}
                value={gatePassword}
                onChange={(e) => setGatePassword(e.target.value)}
                autoComplete="current-password"
                className="w-full border border-slate-200 rounded-xl px-3 pr-10 py-2.5 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowGatePassword(!showGatePassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showGatePassword ? "Hide password" : "Show password"}
              >
                {showGatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </label>
          {gateError && <p className="text-xs font-semibold text-red-600">{gateError}</p>}
          <button
            type="submit"
            disabled={gateBusy}
            className="w-full bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-sm py-2.5 rounded-xl disabled:opacity-60"
          >
            {gateBusy ? 'जाँच हो रही है...' : 'लॉगिन करें'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F4F7FB] text-slate-800 font-sans antialiased">
      
      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR (ROYAL NAVY #0B192C WITH SWARNIM GOLD)    */}
      {/* ========================================================= */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#0B192C] text-slate-300 flex flex-col justify-between h-screen shadow-2xl z-40 border-r border-[#1C3759] overflow-hidden transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Top: Logo & Search */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          
          {/* Brand Logo, Admin Title & Close Button for mobile */}
          <div className="flex items-center justify-between">
            <Link href="/raviadminmishra" className="flex items-center gap-3 px-1 py-1 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-md border-2 border-[#D97706] flex items-center justify-center p-0.5 shrink-0">
                <Image
                  src="/logo.png?v=4"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain rounded-lg"
                  unoptimized
                />
              </div>
              <div>
                <div className="font-extrabold text-white text-base tracking-tight leading-tight">
                  Admin Panel
                </div>
                <div className="text-[11px] text-[#D97706] font-semibold">
                  Swarnim Dastavej CMS
                </div>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-[#10233B] text-slate-400 hover:text-white transition cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search tabs input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={tabSearchQuery}
              onChange={(e) => setTabSearchQuery(e.target.value)}
              placeholder="Search tabs..."
              className="w-full pl-8 pr-3 py-2 bg-[#10233B] border border-[#1C3759] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D97706]"
            />
          </div>

          {/* Vertical Menu Navigation */}
          <nav className="space-y-1.5 pt-2">
            {filteredNavTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold shadow-md shadow-amber-600/30'
                      : 'text-[#8E9EB5] hover:text-white hover:bg-[#10233B]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 stroke-[2] shrink-0" />
                    <span className="whitespace-nowrap truncate">{item.label}</span>
                  </div>

                  {/* Badges */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white text-[#B45309]' : 'bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white animate-pulse'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && !item.badge && (
                    <span className="text-[11px] text-slate-400 font-mono opacity-80">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom: Language, User Profile & Portal Link */}
        <div className="p-4 border-t border-[#1C3759] space-y-3">
          
          {/* Quick Language Selector */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#10233B] text-xs border border-[#1C3759]/60">
            <span className="flex items-center gap-1.5 text-[#8E9EB5] font-medium">
              <Globe className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Language:</span>
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${language === 'en' ? 'bg-[#D97706] text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${language === 'hi' ? 'bg-[#D97706] text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                HI
              </button>
            </div>
          </div>

          {/* User session & Logout */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#B45309] to-[#F59E0B] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                {(adminSessionUser || currentUser)?.name ? (adminSessionUser || currentUser)!.name.charAt(0) : 'A'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate max-w-[100px]">
                  {(adminSessionUser || currentUser)?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-amber-400 font-semibold truncate">
                  {(adminSessionUser || currentUser)?.role === 'admin' ? 'Editor-in-Chief' : 'Editor'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                try {
                  sessionStorage.removeItem('swarnim_admin_active_session');
                } catch {}
                setAdminSessionUser(null);
                logout();
              }}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-[#10233B] rounded-lg transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Back to Live Portal */}
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold text-amber-400 hover:text-white hover:bg-[#10233B] border border-amber-600/30 transition"
          >
            <span>Live Newspaper Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

        </div>

      </aside>

      {/* Backdrop overlay on mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden transition-opacity"
        />
      )}

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT AREA (LIGHT SAAS DASHBOARD)              */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col min-w-0 ml-0 lg:ml-64 min-h-screen w-full">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 sm:py-5 flex items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                {activeTab === 'dashboard' && 'Editorial CMS Dashboard'}
                {activeTab === 'submissions' && 'Citizen News Submissions (Review Queue)'}
                {activeTab === 'contests' && 'Journalist Contest & Leaderboard Manager (साप्ताहिक पत्रकार प्रतियोगिता)'}
                {activeTab === 'epaper' && 'E-Paper Editions Manager'}
                {activeTab === 'articles' && 'Articles & News Feed CMS'}
                {activeTab === 'videos' && 'Video Page Manager'}
                {activeTab === 'users' && 'Registered Users & Readers (पंजीकृत पाठक सूची)'}
                {activeTab === 'journalists' && 'Journalists & Press Correspondents (पत्रकार व संवाददाता)'}
                {activeTab === 'ads' && 'Advertisement Banners & Sponsors'}
                {activeTab === 'grievances' && 'Public Grievance Redressal (IT Rules 2021)'}
                {activeTab === 'settings' && 'Contact, Registration & Legal Policies'}
                {activeTab === 'admins' && 'Administrator Accounts'}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
                Review, verify, publish content, and control printed e-paper editions in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setShowAddArticle(true)}
              className="bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] hover:opacity-95 text-white font-bold text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md shadow-amber-500/25 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Publish New Story</span>
              <span className="sm:hidden">Publish</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl items-center gap-1.5 transition"
            >
              <span>View Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Dashboard Body Content */}
        <div className="p-3.5 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] w-full min-w-0">
          
          {/* ========================================================= */}
          {/* TAB 1: DASHBOARD OVERVIEW (CHARTS & METRICS & QUEUE)      */}
          {/* (Rendered ONLY on Dashboard tab)                          */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* TOP ANALYTICS CHARTS ROW (MATCHING REFERENCE SCREENSHOT) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Chart 1: Submission Trends (Cyan/Blue Area Curve) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-extrabold text-sm text-slate-900">Submission Trends</h3>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +18.4% this week
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">News submissions & readership by month</p>
              
              {/* SVG Area Chart */}
              <div className="h-40 w-full relative flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00b4d8" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#00b4d8" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="300" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="300" y2="90" stroke="#f1f5f9" strokeDasharray="3 3" />
                  
                  {/* Area fill */}
                  <path
                    d="M 0 100 L 0 20 L 75 45 L 150 70 L 225 85 L 300 95 L 300 120 L 0 120 Z"
                    fill="url(#cyanGrad)"
                  />
                  {/* Line */}
                  <path
                    d="M 0 20 L 75 45 L 150 70 L 225 85 L 300 95"
                    fill="none"
                    stroke="#0096c7"
                    strokeWidth="2.5"
                  />
                  {/* Point */}
                  <circle cx="0" cy="20" r="4" fill="#0077b6" />
                  <circle cx="300" cy="95" r="4" fill="#0077b6" />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100">
                <span>08/2026</span>
                <span>09/2026 (Live)</span>
              </div>
            </div>

            {/* Chart 2: Category-wise Distribution (Orange Horizontal Bars) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-extrabold text-sm text-slate-900">Category-wise News</h3>
                <span className="text-xs text-slate-400">Total: {articles.length} stories</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Published stories across beats</p>
              
              <div className="space-y-2.5">
                {[
                  { name: 'State & Cities', count: 6, max: 8 },
                  { name: 'Investigation / Crime', count: 4, max: 8 },
                  { name: 'Agriculture & Rural', count: 3, max: 8 },
                  { name: 'Sports & Cricket', count: 2, max: 8 },
                  { name: 'Business & Infra', count: 2, max: 8 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="truncate">{item.name}</span>
                      <span className="font-bold text-slate-900">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-md overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#D97706] to-[#F59E0B] h-full rounded-md transition-all duration-500 shadow-xs" 
                        style={{ width: `${(item.count / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 3: Editorial Team & Reporter Workload (Emerald Green Bars) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-extrabold text-sm text-slate-900">Journalist Productivity</h3>
                <span className="text-xs text-slate-400">Sitapur / Lucknow</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Stories assigned & submitted per reporter</p>
              
              <div className="space-y-2.5">
                {[
                  { name: 'Vikas Shukla (Sitapur)', count: 5, max: 6 },
                  { name: 'Sunil Verma (Special)', count: 3, max: 6 },
                  { name: 'Anuradha Awasthi (Sr)', count: 2, max: 6 },
                  { name: 'Citizen Reports (Pool)', count: 3, max: 6 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="truncate">{item.name}</span>
                      <span className="font-bold text-slate-900">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-md overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-md transition-all duration-500" 
                        style={{ width: `${(item.count / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* KEY METRICS NUMBERS ROW                                   */}
          {/* ========================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Articles
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {articles.length}
              </div>
              <button 
                onClick={() => setActiveTab('articles')}
                className="text-[10px] sm:text-[11px] text-[#D97706] font-semibold hover:underline mt-0.5 cursor-pointer block"
              >
                View all stories →
              </button>
            </div>

            <div className="bg-amber-50/50 p-3.5 sm:p-4 rounded-xl border-2 border-amber-300 shadow-xs">
              <div className="text-[10px] sm:text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                Pending Review
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#D97706] mt-1">
                {pendingSubmissions.length}
              </div>
              <button 
                onClick={() => setActiveTab('submissions')}
                className="text-[10px] sm:text-[11px] font-bold text-[#D97706] hover:text-[#B45309] hover:underline mt-0.5 cursor-pointer block"
              >
                Review stories →
              </button>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Registered Users
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {users.filter(u => u.role === 'reader').length}
              </div>
              <button 
                onClick={() => setActiveTab('users')}
                className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold hover:underline mt-0.5 cursor-pointer block"
              >
                Manage readers →
              </button>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Journalists
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {users.filter(u => u.role === 'citizen_journalist' || u.role === 'staff_reporter').length}
              </div>
              <button 
                onClick={() => setActiveTab('journalists')}
                className="text-[10px] sm:text-[11px] text-[#D97706] font-semibold hover:underline mt-0.5 cursor-pointer block"
              >
                Manage press →
              </button>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                E-Paper Editions
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {epaperEditions.length}
              </div>
              <button 
                onClick={() => setActiveTab('epaper')}
                className="text-[10px] sm:text-[11px] text-slate-500 hover:text-slate-800 font-semibold hover:underline mt-0.5 cursor-pointer block"
              >
                Daily editions →
              </button>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                IT Complaints
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {grievances.length}
              </div>
              <button 
                onClick={() => setActiveTab('grievances')}
                className="text-[10px] sm:text-[11px] text-slate-500 hover:text-slate-800 font-semibold hover:underline mt-0.5 cursor-pointer block"
              >
                Redressal desk →
              </button>
            </div>

          </div>

              {/* Review Queue Summary Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-ping" />
                      <span>Citizen Journalism Queue (Pending Approval)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ground news submitted by verified citizen reporters requiring editorial review.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#B45309] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                    {pendingSubmissions.length} stories waiting
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {pendingSubmissions.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No pending submissions. All citizen news reviewed!
                    </div>
                  ) : (
                    pendingSubmissions.map((sub) => (
                      <div key={sub.id} className="p-5 hover:bg-slate-50/60 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                              {sub.category}
                            </span>
                            <span className="font-bold text-slate-700">{sub.submittedBy?.name || 'Citizen Reporter'}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {sub.city}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500">{new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                            {sub.headline}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {sub.body}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleReviewAction(sub.id, 'approve')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              const note = prompt('Enter editorial modification note:');
                              if (note) handleReviewAction(sub.id, 'send_back', note);
                            }}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Send Back</span>
                          </button>

                          <button
                            onClick={() => handleReviewAction(sub.id, 'reject', 'Does not meet journalistic standards')}
                            className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick E-Paper Editions Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-base text-slate-900">
                    Latest Published E-Paper Editions
                  </h3>
                  <button
                    onClick={() => setActiveTab('epaper')}
                    className="text-xs font-bold text-[#D97706] hover:text-[#B45309] hover:underline cursor-pointer"
                  >
                    Manage E-Papers →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {epaperEditions.slice(0, 3).map((ep) => (
                    <div key={ep.id} className="border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
                      <div className="w-12 h-16 bg-slate-900 rounded-lg overflow-hidden shrink-0">
                        {ep.pages[0]?.imageUrl && (
                          <img src={ep.pages[0].imageUrl} alt="Page 1" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-slate-900 truncate">{ep.editionTitle}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{ep.date} • {ep.editionCity}</div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-1">{ep.pagesCount} Pages • Active</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: CITIZEN NEWS SUBMISSIONS (FULL REVIEW QUEUE)       */}
          {/* ========================================================= */}
          {activeTab === 'submissions' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Citizen News Submissions (Editorial Queue)</h2>
                  <p className="text-xs text-slate-500">Edit, Delete, and toggle Active/Inactive status for all news submissions</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Filter status:</span>
                  <select 
                    value={submissionFilter}
                    onChange={(e) => setSubmissionFilter(e.target.value as any)}
                    className="text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 cursor-pointer outline-none focus:ring-1 focus:ring-[#D97706]"
                  >
                    <option value="all">All Submissions ({submissions.length})</option>
                    <option value="approved">Active / Approved ({submissions.filter(s => s.status === 'approved').length})</option>
                    <option value="pending_review">Pending Review ({submissions.filter(s => s.status === 'pending_review').length})</option>
                    <option value="inactive">Inactive ({submissions.filter(s => s.status === 'inactive' || s.status === 'sent_back').length})</option>
                    <option value="rejected">Rejected ({submissions.filter(s => s.status === 'rejected').length})</option>
                  </select>
                </div>
              </div>

              {/* Submissions List */}
              <div className="space-y-4">
                {submissions
                  .filter(sub => {
                    if (submissionFilter === 'all') return true;
                    if (submissionFilter === 'approved') return sub.status === 'approved';
                    if (submissionFilter === 'pending_review') return sub.status === 'pending_review';
                    if (submissionFilter === 'inactive') return sub.status === 'inactive' || sub.status === 'sent_back';
                    if (submissionFilter === 'rejected') return sub.status === 'rejected';
                    return true;
                  })
                  .map((sub) => {
                    const isApproved = sub.status === 'approved';
                    const isInactive = sub.status === 'inactive' || sub.status === 'sent_back';
                    return (
                      <div key={sub.id} className="border border-slate-200/90 rounded-2xl p-5 space-y-3.5 bg-white hover:border-slate-300 transition shadow-2xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 border ${
                              isApproved ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                              sub.status === 'pending_review' ? 'bg-orange-50 text-orange-800 border-orange-300' :
                              isInactive ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-red-50 text-red-800 border-red-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isApproved ? 'bg-emerald-500' :
                                sub.status === 'pending_review' ? 'bg-orange-500 animate-pulse' :
                                isInactive ? 'bg-slate-400' : 'bg-red-500'
                              }`} />
                              {isApproved ? 'ACTIVE (APPROVED)' :
                               sub.status === 'pending_review' ? 'PENDING REVIEW' :
                               sub.status === 'inactive' ? 'INACTIVE' :
                               sub.status.replace('_', ' ')}
                            </span>
                            <span className="font-bold text-sm text-slate-900">{sub.submittedBy?.name || 'नागरिक पत्रकार'}</span>
                            <span className="text-xs text-slate-500">({sub.submittedBy?.district || sub.city})</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">{sub.category}</span>
                          </div>
                          <span className="text-xs text-slate-400">
                            Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-slate-900 leading-snug">{sub.headline}</h3>
                        {sub.subHeadline && (
                          <p className="text-xs font-medium text-slate-600 italic -mt-1">{sub.subHeadline}</p>
                        )}

                        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 select-text">
                          {sub.body}
                        </p>

                        {/* Media Preview if attached */}
                        {sub.media && sub.media.length > 0 && (
                          <div className="flex items-center gap-2 overflow-x-auto py-1">
                            {sub.media.map((m, mIdx) => (
                              <div key={mIdx} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                                {m.type === 'image' ? (
                                  <img src={m.url} alt="media" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white text-[10px] font-bold">VIDEO</div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Note & Action Buttons on EVERY card */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                          <div className="text-xs">
                            {sub.editorComments ? (
                              <span className="text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                                नोट: {sub.editorComments}
                              </span>
                            ) : (
                              <span className="text-slate-400">शहर: {sub.city} • आईडी: {sub.id}</span>
                            )}
                          </div>

                          <div className="flex items-center flex-wrap gap-2">
                            {/* 1. ACTIVE / INACTIVE Toggle */}
                            {isApproved ? (
                              <button
                                type="button"
                                onClick={() => handleToggleSubmissionActive(sub)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer transition shadow-2xs"
                                title="खबर को निष्क्रिय (Inactive) करें"
                              >
                                <Power className="w-3.5 h-3.5 text-amber-600" />
                                <span>Mark Inactive</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleToggleSubmissionActive(sub)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-pointer transition shadow-2xs"
                                title="खबर को सक्रिय (Active) और मुख्य पोर्टल पर प्रकाशित करें"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Make Active</span>
                              </button>
                            )}

                            {/* 2. EDIT Submission */}
                            <button
                              type="button"
                              onClick={() => handleStartEditSubmission(sub)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer transition shadow-2xs"
                              title="खबर विवरण संपादित करें"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                              <span>Edit</span>
                            </button>

                            {/* 3. DELETE Submission */}
                            <button
                              type="button"
                              onClick={() => handleDeleteSubmission(sub.id, sub.headline)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer transition shadow-2xs"
                              title="खबर स्थायी रूप से हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                              <span>Delete</span>
                            </button>

                            {/* 4. Quick Review Actions for Pending */}
                            {sub.status === 'pending_review' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleReviewAction(sub.id, 'approve')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer transition shadow-2xs"
                                >
                                  Approve & Publish
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const note = prompt('संशोधन का कारण / निर्देश (Revision note):');
                                    if (note) handleReviewAction(sub.id, 'send_back', note);
                                  }}
                                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer transition"
                                >
                                  Request Revisions
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReviewAction(sub.id, 'reject', 'अस्वीकृत')}
                                  className="bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {submissions.filter(sub => {
                  if (submissionFilter === 'all') return true;
                  if (submissionFilter === 'approved') return sub.status === 'approved';
                  if (submissionFilter === 'pending_review') return sub.status === 'pending_review';
                  if (submissionFilter === 'inactive') return sub.status === 'inactive' || sub.status === 'sent_back';
                  if (submissionFilter === 'rejected') return sub.status === 'rejected';
                  return true;
                }).length === 0 && (
                  <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <FileCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-sm">इस फ़िल्टर में कोई खबर नहीं है।</p>
                    <p className="text-xs text-slate-400 mt-1">अन्य फ़िल्टर विकल्प चुनकर देखें।</p>
                  </div>
                )}
              </div>

              {/* EDIT SUBMISSION MODAL */}
              {editingSubmission && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="font-bold text-base text-slate-900">खबर संपादित करें (Edit News Submission)</h3>
                        <p className="text-xs text-slate-500">आईडी: {editingSubmission.id} • रिपोर्टर: {editingSubmission.submittedBy?.name || 'नागरिक पत्रकार'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingSubmission(null)}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSaveEditSubmission} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">शीर्षक (Headline) *</label>
                        <input
                          type="text"
                          required
                          value={editSubHeadline}
                          onChange={(e) => setEditSubHeadline(e.target.value)}
                          className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">श्रेणी (Category)</label>
                          <select
                            value={editSubCategory}
                            onChange={(e) => setEditSubCategory(e.target.value as any)}
                            className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706] bg-white cursor-pointer"
                          >
                            <option value="sitapur">सीतापुर (Sitapur)</option>
                            <option value="lucknow">लखनऊ (Lucknow)</option>
                            <option value="state">उत्तर प्रदेश (State)</option>
                            <option value="national">राष्ट्रीय (National)</option>
                            <option value="politics">राजनीति (Politics)</option>
                            <option value="crime">अपराध (Crime)</option>
                            <option value="farmers">किसान / कृषि (Farmers)</option>
                            <option value="business">व्यापार (Business)</option>
                            <option value="editorial">संपादकीय (Editorial)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">शहर / जिला (City)</label>
                          <input
                            type="text"
                            value={editSubCity}
                            onChange={(e) => setEditSubCity(e.target.value)}
                            className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">स्थिति (Status)</label>
                          <select
                            value={editSubStatus}
                            onChange={(e) => setEditSubStatus(e.target.value as any)}
                            className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706] bg-white cursor-pointer"
                          >
                            <option value="approved">Active / Approved (सक्रिय)</option>
                            <option value="pending_review">Pending Review (समीक्षा लंबित)</option>
                            <option value="inactive">Inactive (निष्क्रिय)</option>
                            <option value="sent_back">Sent Back (वापस भेजा गया)</option>
                            <option value="rejected">Rejected (अस्वीकृत)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">उप-शीर्षक (Subheadline)</label>
                        <input
                          type="text"
                          value={editSubSubHeadline}
                          onChange={(e) => setEditSubSubHeadline(e.target.value)}
                          placeholder="वैकल्पिक उप-शीर्षक..."
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">समाचार विवरण (Full Body Content) *</label>
                        <textarea
                          required
                          rows={6}
                          value={editSubBody}
                          onChange={(e) => setEditSubBody(e.target.value)}
                          className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706] leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">संपादक टिप्पणी / नोट (Editor Comments)</label>
                        <input
                          type="text"
                          value={editSubComments}
                          onChange={(e) => setEditSubComments(e.target.value)}
                          placeholder="जैसे: संशोधित, सक्रिय किया गया, आदि..."
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingSubmission(null)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                        >
                          रद्द करें (Cancel)
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingSub}
                          className="px-5 py-2 rounded-xl text-xs font-bold bg-[#D97706] hover:bg-[#B45309] text-white transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                        >
                          {isSavingSub ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          <span>बदलाव सुरक्षित करें (Save Changes)</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: JOURNALIST CONTEST MANAGER                           */}
          {/* ========================================================= */}
          {activeTab === 'contests' && <JournalistContestAdmin />}

          {/* ========================================================= */}
          {/* TAB 3: E-PAPER MANAGER                                    */}
          {/* ========================================================= */}
          {activeTab === 'epaper' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">E-Paper Editions Manager</h2>
                  <p className="text-xs text-slate-500">Upload print newspaper PDFs and organize date-wise pages</p>
                </div>
                <button
                  onClick={() => { resetEpaperForm(); setShowAddEPaper(true); }}
                  className="bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] hover:opacity-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload New E-Paper Edition</span>
                </button>
              </div>

              {/* Upload E-Paper Form Modal/Card */}
              {showAddEPaper && (
                <div className="bg-white rounded-2xl border-2 border-[#D97706]/40 p-6 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-slate-900 text-sm">{editingEditionId ? 'Edit E-Paper Edition' : "Add Today's New E-Paper Edition"}</h3>
                    <button type="button" onClick={resetEpaperForm} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>
                  <form onSubmit={handleAddEPaper} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Edition Title</label>
                      <input
                        type="text"
                        required
                        value={epTitle}
                        onChange={(e) => setEpTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Edition Date</label>
                      <input
                        type="date"
                        required
                        value={epDate}
                        onChange={(e) => setEpDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        राज्य व शहर / संस्करण क्षेत्र (All India Location) *
                      </label>
                      <select 
                        value={epCity} 
                        onChange={(e) => setEpCity(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-xs bg-white font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                      >
                        {epCity && !ALL_INDIA_LOCATIONS.some(s => s.cities.some(c => c.name.toLowerCase() === epCity.toLowerCase() || c.nameHi === epCity)) && (
                          <option value={epCity}>{epCity} (Selected)</option>
                        )}
                        <option value="Lucknow">Lucknow (Main / लखनऊ मुख्य)</option>
                        <option value="Sitapur">Sitapur District (सीतापुर जिला)</option>
                        <option value="National">🇮🇳 All India National Edition (अखिल भारतीय राष्ट्रीय संस्करण)</option>
                        {ALL_INDIA_LOCATIONS.map((state) => (
                          <optgroup key={state.name} label={`${state.name} (${state.nameHi})`}>
                            {state.cities.map((city) => (
                              <option key={city.name} value={city.name}>
                                {city.name} ({city.nameHi})
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Total Pages</label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={epPagesCount}
                        onChange={(e) => setEpPagesCount(parseInt(e.target.value) || 6)}
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">अखबार की भाषा (Edition Language) *</label>
                      <select 
                        value={epLanguage} 
                        onChange={(e) => setEpLanguage(e.target.value as LanguageCode)}
                        className="w-full px-3 py-2 border rounded-lg text-xs font-bold bg-white"
                      >
                        <option value="hi">हिन्दी (Hindi)</option>
                        <option value="en">English</option>
                        <option value="ur">اردو (Urdu)</option>
                      </select>
                    </div>
                    {/* PDF Upload from Media or URL */}
                    <div className="sm:col-span-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800">
                          E-Paper Newspaper PDF File
                        </label>
                        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setUploadTab('device')}
                            className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                              uploadTab === 'device' ? 'bg-[#D97706] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <FileUp className="w-3 h-3 inline mr-1" />
                            Upload from Device / Media
                          </button>
                          <button
                            type="button"
                            onClick={() => setUploadTab('url')}
                            className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                              uploadTab === 'url' ? 'bg-[#D97706] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Enter Web URL
                          </button>
                        </div>
                      </div>

                      {uploadTab === 'device' ? (
                        <div className="relative border-2 border-dashed border-amber-300 hover:border-[#D97706] bg-amber-50/40 rounded-2xl p-6 text-center transition group cursor-pointer">
                          <input
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={handlePdfFileUpload}
                            disabled={isUploadingPdf}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="space-y-2 flex flex-col items-center justify-center">
                            {isUploadingPdf ? (
                              <div className="flex flex-col items-center gap-2 text-amber-800 py-3">
                                <Loader2 className="w-8 h-8 animate-spin text-[#D97706]" />
                                <span className="text-xs font-bold">Uploading PDF from media library...</span>
                              </div>
                            ) : uploadedFileName ? (
                              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-emerald-300 shadow-xs">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                  ✓
                                </div>
                                <div className="text-left">
                                  <div className="text-xs font-bold text-slate-800 truncate max-w-xs">{uploadedFileName}</div>
                                  <div className="text-[11px] text-emerald-600 font-semibold">Ready to publish ({uploadedFileSize || 'PDF'}) • Uploaded to Media</div>
                                </div>
                                <span className="text-[11px] font-bold text-amber-700 underline ml-2">Choose Different File</span>
                              </div>
                            ) : (
                              <>
                                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#D97706] flex items-center justify-center shadow-xs group-hover:scale-110 transition duration-200">
                                  <UploadCloud className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="text-xs font-extrabold text-slate-800">
                                    Click to choose PDF from device or drag & drop here
                                  </p>
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    PDF files up to 50MB (Automatically saves to server media)
                                  </p>
                                </div>
                                <span className="inline-block px-3 py-1.5 bg-white border border-amber-300 text-[#B45309] text-xs font-bold rounded-lg shadow-xs group-hover:bg-[#D97706] group-hover:text-white transition">
                                  Choose PDF File
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="text"
                            value={epPdfUrl}
                            onChange={(e) => setEpPdfUrl(e.target.value)}
                            placeholder="https://example.com/epaper-2026-09-27.pdf"
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                          />
                        </div>
                      )}

                      {uploadError && (
                        <div className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{uploadError}</span>
                        </div>
                      )}

                      {epPdfUrl && (
                        <div className="text-[11px] text-slate-500 font-mono truncate bg-slate-50 px-3 py-1.5 rounded-lg border flex items-center justify-between">
                          <span>Attached File: <strong className="text-slate-800">{epPdfUrl}</strong></span>
                          <span className="text-emerald-600 font-bold">✓ Attached</span>
                        </div>
                      )}
                    </div>
                    <label className="sm:col-span-2 flex items-center gap-2 text-xs font-bold text-slate-700">
                      <input type="checkbox" checked={epActive} onChange={(e) => setEpActive(e.target.checked)} />
                      Active on the website
                    </label>
                    <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={resetEpaperForm}
                        className="px-4 py-2 border rounded-lg text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 hover:opacity-95 cursor-pointer"
                      >
                        {editingEditionId ? 'Save changes' : 'Publish Edition'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                {/* Language Filter Header */}
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">भाषा फ़िल्टर (Filter Language):</span>
                    <div className="flex items-center gap-1">
                      {[
                        { id: 'all', label: 'सभी भाषाएं' },
                        { id: 'hi', label: 'हिन्दी (Hindi)' },
                        { id: 'en', label: 'English' },
                        { id: 'ur', label: 'اردو (Urdu)' }
                      ].map(l => (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => setEpFilterLanguage(l.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            epFilterLanguage === l.id 
                              ? 'bg-[#D97706] text-white shadow-xs' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    कुल {epaperEditions.filter(e => epFilterLanguage === 'all' || (e.language || 'hi') === epFilterLanguage).length} संस्करण
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 font-bold">Edition</th>
                        <th className="px-3 py-3 font-bold">Language</th>
                        <th className="px-3 py-3 font-bold">Date</th>
                        <th className="px-3 py-3 font-bold">City</th>
                        <th className="px-3 py-3 font-bold">Pages</th>
                        <th className="px-3 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {epaperEditions
                        .filter(e => epFilterLanguage === 'all' || (e.language || 'hi') === epFilterLanguage)
                        .map((edition) => {
                        const live = edition.isActive !== false;
                        const thumb = edition.thumbnailUrl || edition.pages[0]?.imageUrl;
                        const lang = edition.language || 'hi';
                        return (
                          <tr key={edition.id} className={`border-b border-slate-100 last:border-0 ${live ? '' : 'bg-slate-50'}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {thumb ? (
                                  <img src={thumb} alt="" className="w-10 h-14 object-cover rounded-md border shrink-0" />
                                ) : (
                                  <div className="w-10 h-14 rounded-md bg-slate-100 shrink-0" />
                                )}
                                <div className="min-w-0">
                                  <div className={`font-bold truncate max-w-[260px] ${live ? 'text-slate-900' : 'text-slate-500'}`}>{edition.editionTitle}</div>
                                  <Link href={`/epaper?date=${edition.date}`} target="_blank" className="text-[11px] text-amber-700 font-semibold hover:underline">
                                    Read E-Paper
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              {lang === 'en' ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">English</span>
                              ) : lang === 'ur' ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">اردو</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">हिन्दी</span>
                              )}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-slate-600">{edition.date}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-slate-600">{edition.editionCity}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-slate-600">{edition.pagesCount}</td>
                            <td className="px-3 py-3">
                              <button
                                type="button"
                                onClick={() => handleToggleEdition(edition)}
                                className={`font-bold px-2.5 py-1 rounded-lg cursor-pointer ${live ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}
                              >
                                {live ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditEdition(edition)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm('Delete this e-paper edition?')) deleteEdition(edition.id);
                                  }}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {epaperEditions.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No e-paper editions yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: E-PAPER PRICING & SUBSCRIPTION PLANS MANAGER         */}
          {/* ========================================================= */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              
              {/* Header Bar */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#D97706]" />
                    <span>ई-पेपर सदस्यता एवं मूल्य प्लान प्रबंधन (E-Paper Pricing Plans)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    पाठकों हेतु प्रति अखबार मूल्य (उदा: ₹1/अंक) एवं वार्षिक प्लान (उदा: ₹340/वर्ष) तय करें। यह मूल्य ई-पेपर अनलॉक स्क्रीन पर स्वतः दिखाई देंगे।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStartAddPlan}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#B45309] to-[#D97706] hover:from-[#92400e] hover:to-[#B45309] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>नया मूल्य प्लान बनाएं (Add Plan)</span>
                </button>
              </div>

              {/* Stats Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">कुल प्लान्स (Total)</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">{pricingPlans.length}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">सक्रिय प्लान्स (Active)</span>
                  <span className="text-2xl font-black text-emerald-600 mt-1 block">{pricingPlans.filter(p => p.isActive).length}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">न्यूनतम प्रवेश मूल्य (Single)</span>
                  <span className="text-2xl font-black text-[#D97706] mt-1 block">₹1 / अंक</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">वार्षिक सुपर सेवर (Yearly)</span>
                  <span className="text-2xl font-black text-indigo-600 mt-1 block">₹340 / वर्ष</span>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between relative shadow-xs ${
                      plan.isPopular 
                        ? 'border-[#D97706] ring-2 ring-[#D97706]/20' 
                        : 'border-slate-200/80'
                    }`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#B45309] to-[#D97706] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        बेस्ट वैल्यू / लोकप्रिय
                      </span>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 pt-1">
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base">{plan.title}</h3>
                          {plan.titleEn && <p className="text-[11px] text-slate-400">{plan.titleEn}</p>}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          plan.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {plan.isActive ? 'सक्रिय (Live)' : 'निष्क्रिय'}
                        </span>
                      </div>

                      {/* Price Display */}
                      <div className="py-2 border-y border-slate-100 flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-slate-900">₹{plan.price}</span>
                        <span className="text-xs text-slate-500 font-semibold">/ {plan.durationLabel}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{plan.description}</p>

                      {/* Features List */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">सुविधाएं:</span>
                        {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleTogglePlanActive(plan)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                          plan.isActive 
                            ? 'bg-amber-50 hover:bg-amber-100 text-[#B45309]' 
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {plan.isActive ? 'डी-एक्टिवेट करें' : 'सक्रिय करें'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartEditPlan(plan)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          title="संशोधित करें"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add / Edit Plan Modal */}
              {showAddPlanModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#D97706]" />
                        <h3 className="font-extrabold text-base text-slate-900">
                          {editingPlanId ? 'मूल्य प्लान संशोधित करें (Edit Plan)' : 'नया ई-पेपर मूल्य प्लान जोड़ें (New Plan)'}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={resetPricingPlanForm}
                        className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSavePricingPlan} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          प्लान का नाम (हिंदी) <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={planTitle}
                          onChange={(e) => setPlanTitle(e.target.value)}
                          placeholder="उदा: दैनिक एकल अंक (1 Day Pass)"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          प्लान का नाम (English)
                        </label>
                        <input
                          type="text"
                          value={planTitleEn}
                          onChange={(e) => setPlanTitleEn(e.target.value)}
                          placeholder="E.g.: Single Edition (1 Day Pass)"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            मूल्य (₹ INR) <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            required
                            value={planPrice}
                            onChange={(e) => setPlanPrice(Number(e.target.value))}
                            placeholder="1"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            अवधि का प्रकार <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={planDuration}
                            onChange={(e) => {
                              const dur = e.target.value as any;
                              setPlanDuration(dur);
                              if (dur === 'single_edition') {
                                setPlanDurationLabel('1 दिन / आज का सम्पूर्ण ई-पेपर');
                              } else if (dur === 'monthly') {
                                setPlanDurationLabel('1 माह (30 दिन)');
                              } else if (dur === 'yearly') {
                                setPlanDurationLabel('1 वर्ष (365 दिन)');
                              }
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                          >
                            <option value="single_edition">दैनिक एकल अंक (Single Edition / 1 Day)</option>
                            <option value="monthly">मासिक सदस्यता (Monthly Plan)</option>
                            <option value="yearly">वार्षिक सदस्यता (Yearly Super Plan)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          अवधि लेबल (Duration Label)
                        </label>
                        <input
                          type="text"
                          value={planDurationLabel}
                          onChange={(e) => setPlanDurationLabel(e.target.value)}
                          placeholder="1 दिन / आज का अंक"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          विवरण (Description)
                        </label>
                        <textarea
                          rows={2}
                          value={planDescription}
                          onChange={(e) => setPlanDescription(e.target.value)}
                          placeholder="मात्र ₹1 में आज का पूरा ई-पेपर (सभी पृष्ठ 1 से 6) तुरंत अनलॉक करें।"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D97706] resize-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          सुविधाएं (Features - प्रति पंक्ति एक सुविधा)
                        </label>
                        <textarea
                          rows={3}
                          value={planFeatures}
                          onChange={(e) => setPlanFeatures(e.target.value)}
                          placeholder="आज का संपूर्ण ई-पेपर अनलॉक&#10;पृष्ठ 2 से 6 तक तुरंत वाचन&#10;अल्ट्रा हाई रेजोल्यूशन ज़ूम"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D97706] font-mono text-[11px]"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={planIsPopular}
                            onChange={(e) => setPlanIsPopular(e.target.checked)}
                            className="rounded text-[#D97706] focus:ring-[#D97706] w-4 h-4 cursor-pointer"
                          />
                          <span>⭐ लोकप्रिय / बेस्ट सेलर टैग दिखाएं</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={planIsActive}
                            onChange={(e) => setPlanIsActive(e.target.checked)}
                            className="rounded text-emerald-600 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                          />
                          <span>सक्रिय रखें (Active)</span>
                        </label>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={resetPricingPlanForm}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                        >
                          रद्द करें
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#B45309] to-[#D97706] text-white font-bold shadow-md hover:from-[#92400e] hover:to-[#B45309] transition cursor-pointer"
                        >
                          {editingPlanId ? 'बदलाव सहेजें (Save Changes)' : 'प्लान प्रकाशित करें (Publish Plan)'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-5">
              <form onSubmit={handlePublishShelfVideo} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">नया वीडियो अपलोड करें</h2>
                  <p className="text-xs text-slate-500">फाइल कंप्रेस होकर वीडियो समाचार पेज पर लग जाएगी।</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    value={shelfTitle}
                    onChange={(e) => setShelfTitle(e.target.value)}
                    placeholder="वीडियो का शीर्षक"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  />
                  <input
                    value={shelfCity}
                    onChange={(e) => setShelfCity(e.target.value)}
                    placeholder="शहर"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <label className="flex items-center justify-center gap-2 border border-dashed border-amber-400 rounded-xl px-4 py-6 text-sm font-semibold text-amber-800 bg-amber-50 cursor-pointer">
                  <input type="file" accept="video/*" className="hidden" onChange={handleShelfUpload} disabled={shelfUploading} />
                  <UploadCloud className="w-4 h-4" />
                  <span>{shelfUploading ? 'वीडियो कंप्रेस हो रहा है...' : shelfFileName || 'डिवाइस से वीडियो चुनें'}</span>
                </label>
                {shelfVideoUrl && (
                  <video src={shelfVideoUrl} controls className="w-full max-h-56 rounded-xl bg-black" />
                )}
                <button
                  type="submit"
                  disabled={shelfSaving || shelfUploading}
                  className="bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs px-4 py-2.5 rounded-xl disabled:opacity-60"
                >
                  {shelfSaving ? 'लग रहा है...' : 'वीडियो पेज पर लगाएँ'}
                </button>
              </form>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">मौजूदा वीडियो खबरों में से चुनें</h2>
                  <p className="text-xs text-slate-500">जिन लेखों में वीडियो है, उन्हें वीडियो पेज पर लगाएँ या हटाएँ।</p>
                </div>
                <div className="space-y-2">
                  {articles.filter((article) => article.mediaGallery?.some((item) => item.type === 'video' && item.url)).length === 0 ? (
                    <p className="text-sm text-slate-500">अभी किसी खबर में वीडियो नहीं है। ऊपर से अपलोड करें।</p>
                  ) : (
                    articles
                      .filter((article) => article.mediaGallery?.some((item) => item.type === 'video' && item.url))
                      .map((article) => (
                        <div key={article.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 rounded-xl px-3 py-2">
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900 truncate">{article.headline}</div>
                            <div className="text-[11px] text-slate-500">{article.city} · {article.showOnVideos ? 'वीडियो पेज पर है' : 'वीडियो पेज पर नहीं है'}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleVideoPage(article)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg ${article.showOnVideos ? 'bg-slate-200 text-slate-800' : 'bg-red-700 text-white'}`}
                          >
                            {article.showOnVideos ? 'वीडियो पेज से हटाएँ' : 'वीडियो पेज पर लगाएँ'}
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: ARTICLES & STORIES CMS                             */}
          {/* ========================================================= */}
          {activeTab === 'articles' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Articles Management</h2>
                  <p className="text-xs text-slate-500">All live news articles published on the portal</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddArticle(true)}
                    className="bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:opacity-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Story</span>
                  </button>
                </div>
              </div>

              {/* Language Filter Pills for Articles */}
              <div className="flex items-center justify-between flex-wrap gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">भाषा फ़िल्टर (Language):</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'all', label: 'सभी (All)' },
                      { id: 'hi', label: 'हिन्दी (Hindi)' },
                      { id: 'en', label: 'English' },
                      { id: 'ur', label: 'اردو (Urdu)' }
                    ].map(l => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setArtFilterLanguage(l.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          artFilterLanguage === l.id 
                            ? 'bg-[#D97706] text-white shadow-xs' 
                            : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  कुल {articles.filter(a => artFilterLanguage === 'all' || (a.language || 'hi') === artFilterLanguage).length} खबरें
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {articles
                  .filter(art => artFilterLanguage === 'all' || (art.language || 'hi') === artFilterLanguage)
                  .map((art) => {
                    const lang = art.language || 'hi';
                    return (
                  <div key={art.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs flex-wrap">
                        {lang === 'en' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">English</span>
                        ) : lang === 'ur' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">اردو</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">हिन्दी</span>
                        )}
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                          {art.category}
                        </span>
                        <span className="text-slate-500">• {art.city}</span>
                        <span className="text-slate-500">• {art.author.name}</span>
                        {art.isBreaking && (
                          <span className="bg-red-600 text-white font-bold px-1.5 py-0.2 rounded text-[10px]">
                            BREAKING
                          </span>
                        )}
                        {art.status === 'published' ? (
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                            सक्रिय (Live)
                          </span>
                        ) : (
                          <span className="bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                            निष्क्रिय (Inactive)
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{art.headline}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{art.excerpt}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400 font-mono">{art.viewsCount} views</span>
                      <button
                        onClick={() => handleToggleArticleActive(art)}
                        className={`p-1.5 rounded-lg cursor-pointer transition ${
                          art.status === 'published'
                            ? 'text-emerald-600 hover:text-amber-600 hover:bg-emerald-50'
                            : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'
                        }`}
                        title={art.status === 'published' ? 'निष्क्रिय करें (Mark Inactive)' : 'सक्रिय करें (Make Live)'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStartEditArticle(art)}
                        className="p-1.5 text-slate-500 hover:text-[#D97706] rounded-lg cursor-pointer"
                        title="Edit article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id, art.headline)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/article/${art.id}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: REGISTERED USERS & READERS (लॉगिन यूज़र्स व पाठक)      */}
          {/* ========================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Stat Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">कुल पंजीकृत पाठक</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {users.filter(u => u.role === 'reader').length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Total registered readers</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">सक्रिय पाठक (Active)</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    {users.filter(u => u.role === 'reader' && !u.isBanned && u.isActive !== false).length}
                  </div>
                  <div className="text-[11px] text-emerald-600/70 mt-0.5">Accounts in good standing</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-red-200/80 shadow-xs">
                  <div className="text-[11px] font-bold text-red-700 uppercase tracking-wider">निष्क्रिय / ब्लॉक (Inactive)</div>
                  <div className="text-2xl font-black text-red-600 mt-1">
                    {users.filter(u => u.role === 'reader' && (u.isBanned || u.isActive === false)).length}
                  </div>
                  <div className="text-[11px] text-red-500/70 mt-0.5">Suspended / blocked accounts</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">लॉगिन गतिविधि</div>
                  <div className="text-2xl font-black text-[#D97706] mt-1">
                    {users.filter(u => u.role === 'reader' && u.lastLoginAt).length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Active logged-in sessions</div>
                </div>
              </div>

              {/* Main Card with Controls and List */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
                <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">पंजीकृत पाठक सूची (Registered Readers Directory)</h2>
                    <p className="text-xs text-slate-500">वेबसाइट पर लॉगिन किए हुए पाठकों का विवरण, संपादन, स्थिति (Active/Inactive) एवं खाता निष्कासन</p>
                  </div>
                  <button
                    onClick={() => setShowAddUser(true)}
                    className="bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>नया पाठक जोड़ें (Add Reader)</span>
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                    <button
                      onClick={() => setUserFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${userFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-black' : 'hover:text-slate-900'}`}
                    >
                      सभी ({users.filter(u => u.role === 'reader').length})
                    </button>
                    <button
                      onClick={() => setUserFilter('active')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${userFilter === 'active' ? 'bg-emerald-600 text-white shadow-xs font-black' : 'hover:text-slate-900'}`}
                    >
                      सक्रिय ({users.filter(u => u.role === 'reader' && !u.isBanned && u.isActive !== false).length})
                    </button>
                    <button
                      onClick={() => setUserFilter('inactive')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${userFilter === 'inactive' ? 'bg-red-600 text-white shadow-xs font-black' : 'hover:text-slate-900'}`}
                    >
                      निष्क्रिय ({users.filter(u => u.role === 'reader' && (u.isBanned || u.isActive === false)).length})
                    </button>
                  </div>

                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="नाम, ईमेल, फोन या शहर से खोजें..."
                      className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                    />
                  </div>
                </div>

                {/* Add User Form */}
                {showAddUser && (
                  <form onSubmit={handleCreateUser} className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 space-y-3">
                    <div className="text-sm font-bold text-slate-900">नया पाठक खाता पंजीकृत करें (Register Reader)</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <input required value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="पूरा नाम (Full Name) *" className="px-3 py-2 border rounded-xl text-xs bg-white" />
                      <input required type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="ईमेल आईडी (Email) *" className="px-3 py-2 border rounded-xl text-xs bg-white" />
                      <input value={newUserPhone} onChange={(e) => setNewUserPhone(e.target.value)} placeholder="मोबाइल नंबर (Phone)" className="px-3 py-2 border rounded-xl text-xs bg-white" />
                      <input value={newUserCity} onChange={(e) => setNewUserCity(e.target.value)} placeholder="शहर / जिला (City)" className="px-3 py-2 border rounded-xl text-xs bg-white" />
                      <div className="relative">
                        <input 
                          type={showNewUserPassword ? "text" : "password"} 
                          value={newUserPassword} 
                          onChange={(e) => setNewUserPassword(e.target.value)} 
                          placeholder="पासवर्ड (Default: reader123)" 
                          className="w-full px-3 pr-9 py-2 border rounded-xl text-xs bg-white" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                          aria-label={showNewUserPassword ? "Hide password" : "Show password"}
                        >
                          {showNewUserPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowAddUser(false)} className="px-3 py-1.5 border rounded-lg text-xs font-semibold cursor-pointer">रद्द करें</button>
                      <button type="submit" className="px-3 py-1.5 bg-[#D97706] text-white rounded-lg text-xs font-bold cursor-pointer">खाता बनाएं</button>
                    </div>
                  </form>
                )}

                {/* Reader Cards List */}
                <div className="space-y-3">
                  {(() => {
                    const readerList = users.filter(u => {
                      if (u.role !== 'reader') return false;
                      const isActive = !u.isBanned && u.isActive !== false;
                      if (userFilter === 'active' && !isActive) return false;
                      if (userFilter === 'inactive' && isActive) return false;
                      if (userSearchQuery.trim()) {
                        const q = userSearchQuery.trim().toLowerCase();
                        const matchName = u.name.toLowerCase().includes(q);
                        const matchEmail = (u.email || '').toLowerCase().includes(q);
                        const matchPhone = (u.phone || '').includes(q);
                        const matchCity = (u.city || '').toLowerCase().includes(q);
                        return matchName || matchEmail || matchPhone || matchCity;
                      }
                      return true;
                    });

                    if (readerList.length === 0) {
                      return (
                        <div className="p-8 text-center text-slate-400 text-xs">
                          कोई पाठक नहीं मिला।
                        </div>
                      );
                    }

                    return readerList.map((u) => {
                      const isActive = !u.isBanned && u.isActive !== false;
                      return (
                        <div 
                          key={u.id}
                          className={`border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition ${
                            isActive ? 'border-slate-200 bg-white hover:border-slate-300' : 'bg-red-50/50 border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                              isActive ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white' : 'bg-red-200 text-red-800'
                            }`}>
                              {u.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-slate-900">{u.name}</span>
                                {isActive ? (
                                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                    <span>सक्रिय (Active)</span>
                                  </span>
                                ) : (
                                  <span className="bg-red-100 text-red-800 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                    <span>निष्क्रिय / ब्लॉक (Inactive)</span>
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5 truncate">
                                <span>{u.email}</span>
                                {u.phone && <span> • {u.phone}</span>}
                                {u.city && <span> • {u.city}</span>}
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                                <span>भूमिका: पाठक (Reader)</span>
                                {u.lastLoginAt && (
                                  <span>• अंतिम लॉगिन: {new Date(u.lastLoginAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons: Edit, Active/Inactive Toggle, Delete */}
                          <div className="flex items-center gap-2 shrink-0 flex-wrap w-full md:w-auto justify-end">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleStartEditUser(u)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 transition cursor-pointer"
                              title="पाठक विवरण संपादित करें"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                              <span>संपादित करें (Edit)</span>
                            </button>

                            {/* Active / Inactive Toggle Button */}
                            <button
                              onClick={() => handleToggleBan(u)}
                              className={`font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer ${
                                isActive
                                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                              }`}
                              title={isActive ? 'खाता निष्क्रिय करें' : 'खाता सक्रिय करें'}
                            >
                              {isActive ? (
                                <>
                                  <Ban className="w-3.5 h-3.5 text-amber-700" />
                                  <span>निष्क्रिय करें (Deactivate)</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>सक्रिय करें (Activate)</span>
                                </>
                              )}
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-red-200 flex items-center gap-1 transition cursor-pointer"
                              title="खाता हमेशा के लिए हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>हटाएं (Delete)</span>
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: JOURNALISTS & PRESS CORRESPONDENTS (पत्रकार प्रबंधन) */}
          {/* ========================================================= */}
          {activeTab === 'journalists' && (
            <div className="space-y-6">
              {/* Stat Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">कुल पत्रकार व संवाददाता</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {users.filter(u => u.role === 'citizen_journalist' || u.role === 'staff_reporter').length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Total press reporters</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">सत्यापित (KYC Verified)</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    {users.filter(u => (u.role === 'citizen_journalist' || u.role === 'staff_reporter') && u.kycStatus === 'verified').length}
                  </div>
                  <div className="text-[11px] text-emerald-600/70 mt-0.5">ID verified reporters</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">समीक्षाधीन (Pending KYC)</div>
                  <div className="text-2xl font-black text-[#D97706] mt-1">
                    {users.filter(u => (u.role === 'citizen_journalist' || u.role === 'staff_reporter') && u.kycStatus === 'pending').length}
                  </div>
                  <div className="text-[11px] text-amber-600/70 mt-0.5">Verification awaited</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">सक्रिय पत्रकार (Active)</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {users.filter(u => (u.role === 'citizen_journalist' || u.role === 'staff_reporter') && !u.isBanned && u.isActive !== false).length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Active news contributors</div>
                </div>
              </div>

              {/* Main Card with Controls and List */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
                <div className="pb-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">पत्रकार व संवाददाता प्रबंधन (Journalists & Reporters)</h2>
                    <p className="text-xs text-slate-500">नागरिक पत्रकार एवं विशेष संवाददाताओं का सत्यापन, संपादन, स्थिति (Active/Inactive) एवं खाता निष्कासन</p>
                  </div>
                  <button
                    onClick={() => setShowAddJournalist(true)}
                    className="bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>नया पत्रकार जोड़ें (Add Journalist)</span>
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 overflow-x-auto scrollbar-none">
                    <button
                      onClick={() => setJournoFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${journoFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-black' : 'hover:text-slate-900'}`}
                    >
                      सभी ({users.filter(u => u.role === 'citizen_journalist' || u.role === 'staff_reporter').length})
                    </button>
                    <button
                      onClick={() => setJournoFilter('citizen')}
                      className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${journoFilter === 'citizen' ? 'bg-[#D97706] text-white shadow-xs font-black' : 'hover:text-slate-900'}`}
                    >
                      नागरिक पत्रकार ({users.filter(u => u.role === 'citizen_journalist').length})
                    </button>
                    <button
                      onClick={() => setJournoFilter('staff')}
                      className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${journoFilter === 'staff' ? 'bg-blue-600 text-white shadow-xs font-black' : 'hover:text-slate-900'}`}
                    >
                      संवाददाता ({users.filter(u => u.role === 'staff_reporter').length})
                    </button>
                    <button
                      onClick={() => setJournoFilter('active')}
                      className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${journoFilter === 'active' ? 'bg-emerald-600 text-white shadow-xs font-black' : 'hover:text-slate-900'}`}
                    >
                      सक्रिय ({users.filter(u => (u.role === 'citizen_journalist' || u.role === 'staff_reporter') && !u.isBanned && u.isActive !== false).length})
                    </button>
                    <button
                      onClick={() => setJournoFilter('inactive')}
                      className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${journoFilter === 'inactive' ? 'bg-red-600 text-white shadow-xs font-black' : 'hover:text-slate-900'}`}
                    >
                      निष्क्रिय ({users.filter(u => (u.role === 'citizen_journalist' || u.role === 'staff_reporter') && (u.isBanned || u.isActive === false)).length})
                    </button>
                    <button
                      onClick={() => setJournoFilter('pending_kyc')}
                      className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${journoFilter === 'pending_kyc' ? 'bg-amber-600 text-white shadow-xs font-black' : 'hover:text-slate-900'}`}
                    >
                      समीक्षाधीन KYC ({users.filter(u => (u.role === 'citizen_journalist' || u.role === 'staff_reporter') && u.kycStatus === 'pending').length})
                    </button>
                  </div>

                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={journoSearchQuery}
                      onChange={(e) => setJournoSearchQuery(e.target.value)}
                      placeholder="नाम, ईमेल, फोन या शहर से खोजें..."
                      className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                    />
                  </div>
                </div>

                {showAddJournalist && (
                  <form onSubmit={handleCreateJournalist} className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 space-y-3">
                    <div className="text-sm font-bold text-slate-900">नया पत्रकार खाता पंजीकृत करें (New Journalist Account)</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input required value={journoName} onChange={(e) => setJournoName(e.target.value)} placeholder="पूरा नाम (Full Name) *" className="px-3 py-2 border rounded-xl text-xs bg-white" />
                      <input required type="email" value={journoEmail} onChange={(e) => setJournoEmail(e.target.value)} placeholder="ईमेल आईडी (Email) *" className="px-3 py-2 border rounded-xl text-xs bg-white" />
                      <input value={journoPhone} onChange={(e) => setJournoPhone(e.target.value)} placeholder="मोबाइल नंबर (Phone)" className="px-3 py-2 border rounded-xl text-xs bg-white" />
                      <div className="relative">
                        <input 
                          required 
                          type={showJournoPassword ? "text" : "password"} 
                          value={journoPassword} 
                          onChange={(e) => setJournoPassword(e.target.value)} 
                          placeholder="गोपनीय पासवर्ड (Password) *" 
                          className="w-full px-3 pr-9 py-2 border rounded-xl text-xs bg-white" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowJournoPassword(!showJournoPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                          aria-label={showJournoPassword ? "Hide password" : "Show password"}
                        >
                          {showJournoPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <select value={journoRole} onChange={(e) => setJournoRole(e.target.value as UserRole)} className="px-3 py-2 border rounded-xl text-xs bg-white">
                        <option value="citizen_journalist">Citizen journalist (नागरिक पत्रकार)</option>
                        <option value="staff_reporter">Staff reporter (विशेष संवाददाता)</option>
                        <option value="editor">Editor (संपादक)</option>
                      </select>
                      <input value={journoCity} onChange={(e) => setJournoCity(e.target.value)} placeholder="ज़िला / शहर (City / Beat)" className="px-3 py-2 border rounded-xl text-xs bg-white" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowAddJournalist(false)} className="px-3 py-1.5 border rounded-lg text-xs font-semibold cursor-pointer">रद्द करें</button>
                      <button type="submit" className="px-3 py-1.5 bg-[#D97706] text-white rounded-lg text-xs font-bold cursor-pointer">खाता बनाएं</button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {(() => {
                    const journoList = users.filter(u => {
                      if (u.role !== 'citizen_journalist' && u.role !== 'staff_reporter') return false;
                      const isActive = !u.isBanned && u.isActive !== false;
                      if (journoFilter === 'citizen' && u.role !== 'citizen_journalist') return false;
                      if (journoFilter === 'staff' && u.role !== 'staff_reporter') return false;
                      if (journoFilter === 'active' && !isActive) return false;
                      if (journoFilter === 'inactive' && isActive) return false;
                      if (journoFilter === 'pending_kyc' && u.kycStatus !== 'pending') return false;
                      if (journoSearchQuery.trim()) {
                        const q = journoSearchQuery.trim().toLowerCase();
                        const matchName = u.name.toLowerCase().includes(q);
                        const matchEmail = (u.email || '').toLowerCase().includes(q);
                        const matchPhone = (u.phone || '').includes(q);
                        const matchCity = (u.city || '').toLowerCase().includes(q);
                        return matchName || matchEmail || matchPhone || matchCity;
                      }
                      return true;
                    });

                    if (journoList.length === 0) {
                      return (
                        <div className="p-8 text-center text-slate-400 text-xs">
                          कोई पत्रकार नहीं मिला।
                        </div>
                      );
                    }

                    return journoList.map((u) => {
                      const isActive = !u.isBanned && u.isActive !== false;
                      return (
                        <div 
                          key={u.id} 
                          className={`border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition ${
                            isActive ? 'border-slate-200 bg-white hover:border-slate-300' : 'bg-red-50/50 border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                              isActive 
                                ? 'bg-gradient-to-tr from-[#B45309] to-[#F59E0B] text-white' 
                                : 'bg-red-200 text-red-800'
                            }`}>
                              {u.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-slate-900">{u.name}</span>
                                {isActive ? (
                                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                    <span>सक्रिय पत्रकार (Active)</span>
                                  </span>
                                ) : (
                                  <span className="bg-red-100 text-red-800 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                    <span>निष्क्रिय / निलंबित (Inactive)</span>
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5 truncate">
                                <span>{u.email}</span>
                                {u.phone && <span> • {u.phone}</span>}
                                {u.city && <span> • {u.city}</span>}
                              </div>
                              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  u.role === 'staff_reporter' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                  'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}>
                                  {u.role === 'staff_reporter' ? '🎙️ विशेष संवाददाता' : '✍️ नागरिक पत्रकार'}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  u.kycStatus === 'verified' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}>
                                  KYC: {u.kycStatus === 'verified' ? 'सत्यापित (Verified)' : u.kycStatus === 'pending' ? 'समीक्षाधीन (Pending)' : 'अस्वीकृत'}
                                </span>
                                {u.kycDetails?.idProofType && (
                                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                    {u.kycDetails.idProofType}: {u.kycDetails.idNumber || 'जमा'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Journalist Action Buttons: Approve KYC, Edit, Active/Inactive Toggle, Delete */}
                          <div className="flex items-center gap-2 shrink-0 flex-wrap w-full md:w-auto justify-end">
                            {u.kycStatus !== 'verified' && (
                              <button
                                onClick={() => handleApproveKYC(u.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition cursor-pointer"
                                title="पहचान पत्र सत्यापित करें"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>KYC स्वीकृत करें</span>
                              </button>
                            )}

                            {/* Edit Profile Button */}
                            <button
                              onClick={() => handleStartEditUser(u)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 transition cursor-pointer"
                              title="पत्रकार विवरण संपादित करें"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                              <span>संपादित करें (Edit)</span>
                            </button>

                            {/* Active / Inactive Toggle Button */}
                            <button
                              onClick={() => handleToggleBan(u)}
                              className={`font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer ${
                                isActive 
                                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300' 
                                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                              }`}
                              title={isActive ? 'पत्रकार को निष्क्रिय / निलंबित करें' : 'पत्रकार को पुनः सक्रिय करें'}
                            >
                              {isActive ? (
                                <>
                                  <Ban className="w-3.5 h-3.5 text-amber-700" />
                                  <span>निष्क्रिय करें (Deactivate)</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>सक्रिय करें (Activate)</span>
                                </>
                              )}
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-red-200 flex items-center gap-1 transition cursor-pointer"
                              title="पत्रकार खाता स्थायी रूप से हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>हटाएं (Delete)</span>
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: ADVERTISEMENTS                                     */}
          {activeTab === 'ads' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="pb-3 border-b flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Sponsored Ads & Banners</h2>
                  <p className="text-xs text-slate-500">Add, edit, or turn a campaign on and off. Inactive ads stay off the public site.</p>
                </div>
                <button
                  onClick={() => { resetAdForm(); setShowAdForm(true); }}
                  className="bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add advertisement</span>
                </button>
              </div>

              {showAdForm && (
                <form onSubmit={handleSaveAd} className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 space-y-3">
                  <div className="text-sm font-bold text-slate-900">{editingAdId ? 'Edit advertisement' : 'New advertisement'}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input required value={adTitle} onChange={(e) => setAdTitle(e.target.value)} placeholder="Campaign title" className="px-3 py-2 border rounded-xl text-xs" />
                    <input required value={adAdvertiser} onChange={(e) => setAdAdvertiser(e.target.value)} placeholder="Advertiser / sponsor name" className="px-3 py-2 border rounded-xl text-xs" />
                    <input value={adTargetUrl} onChange={(e) => setAdTargetUrl(e.target.value)} placeholder="Link URL (https://...)" className="px-3 py-2 border rounded-xl text-xs" />
                    <select value={adPlacement} onChange={(e) => setAdPlacement(e.target.value as AdBanner['placement'])} className="px-3 py-2 border rounded-xl text-xs">
                      <option value="sidebar">Sidebar</option>
                      <option value="header_top">Header</option>
                      <option value="in_feed">In feed</option>
                      <option value="sticky_bottom">Sticky bottom</option>
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="flex-1 px-3 py-2 border border-dashed border-amber-300 bg-white rounded-xl text-xs font-bold text-amber-800 text-center cursor-pointer">
                      {adUploading ? 'Converting to WebP...' : 'Upload image'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleAdImageUpload} disabled={adUploading} />
                    </label>
                    <input value={adImageUrl} onChange={(e) => setAdImageUrl(e.target.value)} placeholder="Or paste image URL" className="flex-1 px-3 py-2 border rounded-xl text-xs" />
                  </div>
                  {adImageUrl && (
                    <img src={adImageUrl} alt="" className="h-20 w-36 object-cover rounded-lg border" />
                  )}
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <input type="checkbox" checked={adActive} onChange={(e) => setAdActive(e.target.checked)} />
                    Active on the website
                  </label>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={resetAdForm} className="px-3 py-1.5 border rounded-lg text-xs font-semibold cursor-pointer">Cancel</button>
                    <button type="submit" className="px-3 py-1.5 bg-[#D97706] text-white rounded-lg text-xs font-bold cursor-pointer">{editingAdId ? 'Save changes' : 'Add advertisement'}</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ads.map((ad) => (
                  <div key={ad.id} className={`border rounded-xl p-4 space-y-2 ${ad.isActive ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-80'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#D97706] uppercase">{ad.advertiser}</div>
                        <div className="font-bold text-sm text-slate-900">{ad.title}</div>
                        <div className="text-xs text-slate-500 truncate">{ad.targetUrl}</div>
                      </div>
                      {ad.imageUrl && (
                        <img src={ad.imageUrl} alt="" className="w-16 h-12 object-cover rounded-lg border shrink-0" />
                      )}
                    </div>
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-400">Clicks: {ad.clicks} · {ad.placement.replace('_', ' ')}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleAd(ad)}
                          className={`font-bold px-2.5 py-1 rounded-lg cursor-pointer ${ad.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}
                        >
                          {ad.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => handleStartEditAd(ad)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: GRIEVANCE REDRESSAL                                */}
          {activeTab === 'grievances' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="pb-3 border-b">
                <h2 className="text-lg font-bold text-slate-900">IT Rules 2021 Grievance Redressal</h2>
                <p className="text-xs text-slate-500">Public complaints and legal compliance logs</p>
              </div>

              <div className="space-y-3">
                {grievances.map((g) => (
                  <div key={g.id} className="border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{g.complainantName} ({g.complainantEmail})</span>
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">{g.status}</span>
                    </div>
                    <div className="font-bold text-sm text-slate-900">{g.category}</div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">{g.complaintDetails}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: CONTACT, REGISTRATION & LEGAL CMS                    */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              <div className="pb-3 border-b flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Site contact & legal pages</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Email, phone, address, registration number, privacy policy, terms, and editorial policy. These appear on the footer, grievance page, and policy pages.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{settingsSaving ? 'Saving...' : 'Save changes'}</span>
                </button>
              </div>

              {settingsMessage && (
                <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                  {settingsMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-xs font-bold text-slate-700">
                  Official email
                  <input
                    type="email"
                    required
                    value={settingsForm.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Phone
                  <input
                    type="text"
                    required
                    value={settingsForm.phone}
                    onChange={(e) => updateSetting('phone', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700 md:col-span-2">
                  Office address
                  <input
                    type="text"
                    required
                    value={settingsForm.address}
                    onChange={(e) => updateSetting('address', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Registration number (RNI / पंजीकरण)
                  <input
                    type="text"
                    required
                    value={settingsForm.registrationNo}
                    onChange={(e) => updateSetting('registrationNo', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-mono font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Editor-in-chief (प्रधान संपादक)
                  <input
                    type="text"
                    required
                    value={settingsForm.editorInChief}
                    onChange={(e) => updateSetting('editorInChief', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Publisher (मुद्रक एवं प्रकाशक)
                  <input
                    type="text"
                    required
                    value={settingsForm.publisher}
                    onChange={(e) => updateSetting('publisher', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Site name
                  <input
                    type="text"
                    required
                    value={settingsForm.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700 md:col-span-2">
                  Tagline
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => updateSetting('tagline', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  />
                </label>
              </div>

              {/* Social Media Links CMS */}
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Social Media Links (सोशल मीडिया हैंडल्स)</h3>
                <p className="text-xs text-slate-500 mb-3">
                  Set links for Facebook, Twitter (X), Instagram, and YouTube. These will update in the website footer automatically.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Facebook Page URL
                    <input
                      type="url"
                      placeholder="https://facebook.com/swarnimdastavej"
                      value={settingsForm.facebookUrl || ''}
                      onChange={(e) => updateSetting('facebookUrl', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                    />
                  </label>
                  <label className="block text-xs font-bold text-slate-700">
                    Twitter (X) Profile URL
                    <input
                      type="url"
                      placeholder="https://x.com/swarnimdastavej"
                      value={settingsForm.twitterUrl || ''}
                      onChange={(e) => updateSetting('twitterUrl', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                    />
                  </label>
                  <label className="block text-xs font-bold text-slate-700">
                    Instagram Profile URL
                    <input
                      type="url"
                      placeholder="https://instagram.com/swarnimdastavej"
                      value={settingsForm.instagramUrl || ''}
                      onChange={(e) => updateSetting('instagramUrl', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                    />
                  </label>
                  <label className="block text-xs font-bold text-slate-700">
                    YouTube Channel URL
                    <input
                      type="url"
                      placeholder="https://youtube.com/@swarnimdastavej"
                      value={settingsForm.youtubeUrl || ''}
                      onChange={(e) => updateSetting('youtubeUrl', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <label className="block text-xs font-bold text-slate-700">
                Privacy policy (गोपनीयता नीति)
                <textarea
                  rows={8}
                  value={settingsForm.privacyPolicy}
                  onChange={(e) => updateSetting('privacyPolicy', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium leading-relaxed focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                />
              </label>
              <label className="block text-xs font-bold text-slate-700">
                Terms and conditions (नियम एवं शर्तें)
                <textarea
                  rows={8}
                  value={settingsForm.termsOfService}
                  onChange={(e) => updateSetting('termsOfService', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium leading-relaxed focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                />
              </label>
              <label className="block text-xs font-bold text-slate-700">
                Editorial policy (संपादकीय नीति)
                <textarea
                  rows={6}
                  value={settingsForm.editorialPolicy}
                  onChange={(e) => updateSetting('editorialPolicy', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-xl text-xs font-medium leading-relaxed focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                />
              </label>
            </form>
          )}

          {/* ========================================================= */}
          {/* TAB: ADMIN ACCOUNTS                                       */}
          {activeTab === 'admins' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="pb-3 border-b flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Administrator accounts</h2>
                  <p className="text-xs text-slate-500">Add an admin, change password, edit role, or remove an account.</p>
                </div>
                <button
                  onClick={() => setShowAddAdmin(true)}
                  className="bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add admin</span>
                </button>
              </div>

              {showAddAdmin && (
                <form onSubmit={handleCreateAdmin} className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 space-y-3">
                  <div className="text-sm font-bold text-slate-900">New administrator</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input required value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="Full name" className="px-3 py-2 border rounded-xl text-xs" />
                    <input required type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="Email" className="px-3 py-2 border rounded-xl text-xs" />
                    <input value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} placeholder="Phone" className="px-3 py-2 border rounded-xl text-xs" />
                    <div className="relative">
                      <input 
                        required 
                        type={showAdminPassword ? "text" : "password"} 
                        value={adminPassword} 
                        onChange={(e) => setAdminPassword(e.target.value)} 
                        placeholder="Password" 
                        className="w-full px-3 pr-9 py-2 border rounded-xl text-xs" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label={showAdminPassword ? "Hide password" : "Show password"}
                      >
                        {showAdminPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <select value={adminRole} onChange={(e) => setAdminRole(e.target.value as UserRole)} className="px-3 py-2 border rounded-xl text-xs">
                      <option value="admin">Administrator</option>
                      <option value="editor">Editor</option>
                      <option value="super_admin">Super admin</option>
                    </select>
                    <input value={adminCity} onChange={(e) => setAdminCity(e.target.value)} placeholder="City" className="px-3 py-2 border rounded-xl text-xs" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAddAdmin(false)} className="px-3 py-1.5 border rounded-lg text-xs font-semibold cursor-pointer">Cancel</button>
                    <button type="submit" className="px-3 py-1.5 bg-[#D97706] text-white rounded-lg text-xs font-bold cursor-pointer">Create account</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {users.filter(u => u.role === 'admin' || u.role === 'editor' || u.role === 'super_admin').map((u) => (
                  <div key={u.id} className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{u.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{u.email} {u.phone ? `• ${u.phone}` : ''} • {u.city}</div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-red-700 bg-red-50 inline-block px-2 py-0.5 rounded">{u.role.replace('_', ' ')}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEditUser(u)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Edit / password</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-red-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

      {/* ========================================================= */}
      {/* MODAL: PUBLISH NEW ARTICLE DIRECTLY                       */}
      {/* ========================================================= */}
      {showAddArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#D97706]" />
                <span>{editingArticleId ? 'Edit Article' : 'Direct Article Publication (with Photo & Video)'}</span>
              </h3>
              <button onClick={resetArticleForm} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter headline..."
                  className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  >
                    {!TOPICS.some((topic) => topic.id === newCategory) && (
                      <option value={newCategory}>{newCategory}</option>
                    )}
                    {TOPICS.filter((topic) => topic.id !== 'all').map((topic) => (
                      <option key={topic.id} value={topic.id}>{topic.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">राज्य / शहर (All India Location) *</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none bg-white"
                  >
                    {newCity && !ALL_INDIA_LOCATIONS.some(s => s.cities.some(c => c.name.toLowerCase() === newCity.toLowerCase() || c.nameHi === newCity)) && (
                      <option value={newCity}>{newCity} (Selected)</option>
                    )}
                    <option value="Lucknow">Lucknow (लखनऊ)</option>
                    <option value="Sitapur">Sitapur (सीतापुर)</option>
                    <option value="National">🇮🇳 All India / National (राष्ट्रीय)</option>
                    {ALL_INDIA_LOCATIONS.map((state) => (
                      <optgroup key={state.name} label={`${state.name} (${state.nameHi})`}>
                        {state.cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name} ({city.nameHi})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">खबर की भाषा (Language) *</label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value as LanguageCode)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-bold bg-white focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  >
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="en">English</option>
                    <option value="ur">اردو (Urdu)</option>
                  </select>
                </div>
              </div>

              {/* MEDIA UPLOAD SECTION: PHOTO & VIDEO */}
              <div className="space-y-3 p-3.5 bg-amber-50/40 rounded-2xl border border-amber-200/80">
                <div className="font-extrabold text-xs text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-900">
                    <Camera className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Article Media (Photo & Video)</span>
                  </span>
                  <span className="text-[10px] text-amber-700 font-medium">Upload from device media or URL</span>
                </div>

                {/* 1. PHOTO UPLOAD */}
                <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Featured Photo / Cover Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={isUploadingPhoto}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <button
                        type="button"
                        className="w-full px-3 py-2 border border-dashed border-amber-300 hover:border-[#D97706] bg-amber-50/50 rounded-xl text-xs font-bold text-amber-800 flex items-center justify-center gap-2 transition"
                      >
                        {isUploadingPhoto ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D97706]" />
                            <span>Converting to WebP...</span>
                          </>
                        ) : (
                          <>
                            <Camera className="w-3.5 h-3.5 text-[#D97706]" />
                            <span>Choose Photo from Device</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={newCoverImage}
                        onChange={(e) => setNewCoverImage(e.target.value)}
                        placeholder="Or paste Image URL..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {newCoverImage && (
                    <div className="flex items-center gap-3 pt-1">
                      <img
                        src={newCoverImage}
                        alt="Preview"
                        className="w-14 h-10 object-cover rounded-lg border shadow-xs"
                      />
                      <div className="text-[11px] text-emerald-600 font-semibold truncate flex-1">
                        ✓ Photo attached {photoFileName && `(${photoFileName})`}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNewCoverImage('');
                          setPhotoFileName('');
                        }}
                        className="text-[10px] text-red-500 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. VIDEO UPLOAD OR LINK */}
                <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
                  <label className="block text-[11px] font-bold text-slate-700">
                    News Video (Optional)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                      <input
                        type="file"
                        accept="video/*,.mp4,.mov,.webm"
                        onChange={handleVideoUpload}
                        disabled={isUploadingVideo}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <button
                        type="button"
                        className="w-full px-3 py-2 border border-dashed border-amber-300 hover:border-[#D97706] bg-amber-50/50 rounded-xl text-xs font-bold text-amber-800 flex items-center justify-center gap-2 transition"
                      >
                        {isUploadingVideo ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D97706]" />
                            <span>Compressing video...</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-3.5 h-3.5 text-[#D97706]" />
                            <span>Choose Video from Device</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        placeholder="Or paste Video URL (YouTube/MP4)..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {newVideoUrl && (
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <Film className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate flex-1">Video attached{videoFileName ? ` (${videoFileName})` : ''}: {newVideoUrl}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setNewVideoUrl('');
                          setVideoFileName('');
                        }}
                        className="text-[10px] text-red-500 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Story Content *</label>
                <textarea
                  required
                  rows={4}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Write the full news story details..."
                  className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="breakingCheck"
                  checked={newIsBreaking}
                  onChange={(e) => setNewIsBreaking(e.target.checked)}
                  className="rounded text-[#D97706] focus:ring-[#D97706]"
                />
                <label htmlFor="breakingCheck" className="text-xs font-bold text-slate-700">
                  Mark as Breaking Alert (flashes in top ticker)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={resetArticleForm}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 hover:opacity-95 cursor-pointer transition"
                >
                  {editingArticleId ? 'Save changes' : 'Publish Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT USER PROFILE & ROLES                          */}
      {/* ========================================================= */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#D97706]" />
                <span>Edit User Profile: {editingUser.name}</span>
              </h3>
              <button 
                onClick={() => setEditingUser(null)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  >
                    <option value="reader">Reader (पाठक)</option>
                    <option value="citizen_journalist">Citizen Journalist (नागरिक पत्रकार)</option>
                    <option value="staff_reporter">Staff Reporter (विशेष संवाददाता)</option>
                    <option value="editor">Editor (संपादक)</option>
                    <option value="admin">Administrator (व्यवस्थापक)</option>
                    <option value="super_admin">Super Admin (प्रधान व्यवस्थापक)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / District</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New password</label>
                <div className="relative">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Leave blank to keep the current password"
                    className="w-full px-3 pr-10 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showEditPassword ? "Hide password" : "Show password"}
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">KYC Status</label>
                <select
                  value={editKyc}
                  onChange={(e) => setEditKyc(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                >
                  <option value="verified">Verified (सत्यापित)</option>
                  <option value="pending">Pending Review (समीक्षाधीन)</option>
                  <option value="rejected">Rejected (अस्वीकृत)</option>
                  <option value="not_submitted">Not Submitted (जमा नहीं)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 hover:opacity-95 cursor-pointer transition"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
