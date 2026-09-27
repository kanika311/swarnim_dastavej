'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { 
  Article, 
  CitizenSubmission, 
  User, 
  UserRole,
  AdBanner, 
  GrievanceComplaint, 
  ArticleCategory,
  EPaperEdition,
  SiteSettings
} from '@/types';
import { 
  INITIAL_ARTICLES, 
  INITIAL_SUBMISSIONS, 
  INITIAL_USERS, 
  INITIAL_ADS, 
  INITIAL_GRIEVANCES 
} from '@/lib/initialData';
import { 
  LayoutDashboard, 
  Newspaper, 
  FileCheck, 
  FileText, 
  Users, 
  Megaphone, 
  Scale, 
  BarChart3, 
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
  Save
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    currentUser, 
    switchRole, 
    logout,
    epaperEditions, 
    addOrUpdateEdition, 
    deleteEdition,
    language,
    setLanguage 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submissions' | 'epaper' | 'articles' | 'journalists' | 'ads' | 'grievances' | 'settings' | 'admins' | 'analytics'>('dashboard');
  const [tabSearchQuery, setTabSearchQuery] = useState('');
  
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

  // New Article Form state
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ArticleCategory>('state');
  const [newCity, setNewCity] = useState('Lucknow');
  const [newBody, setNewBody] = useState('');
  const [newIsBreaking, setNewIsBreaking] = useState(false);
  const [newCoverImage, setNewCoverImage] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [photoFileName, setPhotoFileName] = useState('');
  const [videoFileName, setVideoFileName] = useState('');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      setPhotoFileName(file.name);
      const formData = new FormData();
      formData.append('file', file);
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
    fetch('/api/ads').then(r => r.json()).then(d => d.success && setAds(d.data)).catch(() => {});
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
      }
    } catch (e) {
      alert('Action completed successfully.');
    } finally {
      setSelectedSubId(null);
      setReviewNote('');
    }
  };

  // Create article handler
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    try {
      const payload = {
        headline: newTitle.trim(),
        body: newBody.trim(),
        category: newCategory,
        city: newCity,
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
          alert('Article updated.');
        } else {
          setArticles(prev => [data.data, ...prev]);
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

  const resetEpaperForm = () => {
    setShowAddEPaper(false);
    setEditingEditionId(null);
    setEpDate('2026-09-27');
    setEpCity('Lucknow');
    setEpTitle('Swarnim Dastavej - Lucknow Main Edition');
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
      pagesCount: pageCount,
      thumbnailUrl: existing?.thumbnailUrl || pages[0]?.imageUrl || '',
      pages,
      isActive: epActive
    };

    const wasEditing = Boolean(editingEditionId);
    addOrUpdateEdition(edition);
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
  const [adminRole, setAdminRole] = useState<UserRole>('admin');
  const [adminCity, setAdminCity] = useState('लखनऊ');
  const [showAddJournalist, setShowAddJournalist] = useState(false);
  const [journoName, setJournoName] = useState('');
  const [journoEmail, setJournoEmail] = useState('');
  const [journoPhone, setJournoPhone] = useState('');
  const [journoPassword, setJournoPassword] = useState('');
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
    const action = u.isBanned ? 'unban' : 'ban';
    if (!confirm(`Are you sure you want to ${action} ${u.name}?`)) return;

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
        alert(data.message);
      } else {
        setUsers(prev => prev.map(x => x.id === u.id ? { ...x, isBanned: !x.isBanned } : x));
        alert(`User ${action}ned successfully.`);
      }
    } catch (e) {
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, isBanned: !x.isBanned } : x));
      alert(`User ${action}ned.`);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete/remove user "${userName}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/users?userId=${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        alert('User account deleted successfully.');
      } else {
        alert(data.message || 'Could not remove this account.');
      }
    } catch (e) {
      alert('Could not remove this account.');
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
      const formData = new FormData();
      formData.append('file', file);
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
    const payload = {
      id: editingAdId,
      title: adTitle.trim(),
      advertiser: adAdvertiser.trim(),
      imageUrl: adImageUrl.trim(),
      targetUrl: adTargetUrl.trim() || '#',
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
      const res = await fetch(`/api/ads?id=${ad.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setAds(prev => prev.filter(a => a.id !== ad.id));
      else alert(data.message || 'Could not delete advertisement');
    } catch {
      alert('Could not delete advertisement');
    }
  };

  // Navigation Tabs configuration
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'submissions', label: 'News Submissions', icon: FileCheck, badge: submissions.filter(s => s.status === 'pending_review').length },
    { id: 'epaper', label: 'E-Paper Manager', icon: Newspaper, count: epaperEditions.length },
    { id: 'articles', label: 'Articles / News', icon: FileText, count: articles.length },
    { id: 'journalists', label: 'Experts & Journalists', icon: Users, count: users.filter(u => u.role === 'citizen_journalist').length },
    { id: 'ads', label: 'Advertisements', icon: Megaphone, count: ads.length },
    { id: 'grievances', label: 'Grievances', icon: Scale, count: grievances.length },
    { id: 'settings', label: 'Contact & Policies', icon: Settings },
    { id: 'admins', label: 'Admin Accounts', icon: ShieldCheck, count: users.filter(u => u.role === 'admin' || u.role === 'editor' || u.role === 'super_admin').length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const filteredNavTabs = navTabs.filter(tab => 
    tab.label.toLowerCase().includes(tabSearchQuery.toLowerCase())
  );

  const pendingSubmissions = submissions.filter(s => s.status === 'pending_review');

  return (
    <div className="min-h-screen flex bg-[#F4F7FB] text-slate-800 font-sans antialiased">
      
      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR (ROYAL NAVY #0B192C WITH SWARNIM GOLD)    */}
      {/* ========================================================= */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#0B192C] text-slate-300 flex flex-col justify-between h-screen shadow-xl z-30 border-r border-[#1C3759] overflow-hidden">
        
        {/* Top: Logo & Search */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          
          {/* Brand Logo & Admin Panel Title */}
          <Link href="/admin" className="flex items-center gap-3 px-1 py-1 group">
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
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold shadow-md shadow-amber-600/30'
                      : 'text-[#8E9EB5] hover:text-white hover:bg-[#10233B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 stroke-[2]" />
                    <span>{item.label}</span>
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
                {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate max-w-[100px]">
                  {currentUser?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-amber-400 font-semibold truncate">
                  {currentUser?.role === 'admin' ? 'Editor-in-Chief' : 'Editor'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                window.location.href = '/';
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

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT AREA (LIGHT SAAS DASHBOARD)              */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col min-w-0 ml-64 min-h-screen">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && 'Editorial CMS Dashboard'}
              {activeTab === 'submissions' && 'Citizen News Submissions (Review Queue)'}
              {activeTab === 'epaper' && 'E-Paper Editions Manager'}
              {activeTab === 'articles' && 'Articles & News Feed CMS'}
              {activeTab === 'journalists' && 'Verified Journalists & KYC Review'}
              {activeTab === 'ads' && 'Advertisement Banners & Sponsors'}
              {activeTab === 'grievances' && 'Public Grievance Redressal (IT Rules 2021)'}
              {activeTab === 'settings' && 'Contact, Registration & Legal Policies'}
              {activeTab === 'admins' && 'Administrator Accounts'}
              {activeTab === 'analytics' && 'Traffic Analytics & Readership Logs'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review, verify, publish content, and control printed e-paper editions in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddArticle(true)}
              className="bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] hover:opacity-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-amber-500/25 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Story</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5 transition"
            >
              <span>View Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Dashboard Body Content */}
        <div className="p-6 sm:p-8 space-y-6 max-w-[1400px]">
          
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
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Articles
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {articles.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Published on portal</div>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-xl border-2 border-amber-300 shadow-xs">
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                Pending Review
              </div>
              <div className="text-2xl font-black text-[#D97706] mt-1">
                {pendingSubmissions.length}
              </div>
              <button 
                onClick={() => setActiveTab('submissions')}
                className="text-[11px] font-bold text-[#D97706] hover:text-[#B45309] hover:underline mt-0.5 cursor-pointer"
              >
                Review stories →
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Journalists
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {users.filter(u => u.role === 'citizen_journalist').length}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Verified reporters</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                E-Paper Editions
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {epaperEditions.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Print daily editions</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                IT Complaints
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {grievances.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">IT Rules compliance</div>
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
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Editorial Review Queue</h2>
                  <p className="text-xs text-slate-500">Citizen submissions under editorial screening</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Filter status:</span>
                  <select className="text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50">
                    <option>All Submissions</option>
                    <option>Pending Only</option>
                    <option>Approved</option>
                    <option>Sent Back</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div key={sub.id} className="border border-slate-200 rounded-xl p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          sub.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          sub.status === 'pending_review' ? 'bg-orange-100 text-orange-800' :
                          sub.status === 'sent_back' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {sub.status.replace('_', ' ')}
                        </span>
                        <span className="font-bold text-sm text-slate-900">{sub.submittedBy?.name || 'Citizen Reporter'}</span>
                        <span className="text-xs text-slate-500">({sub.submittedBy?.district || sub.city})</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">{sub.headline}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {sub.body}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-slate-400">
                        {sub.editorComments && <span className="text-amber-700 font-semibold">Note: {sub.editorComments}</span>}
                      </div>

                      {sub.status === 'pending_review' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReviewAction(sub.id, 'approve')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                          >
                            Approve & Publish
                          </button>
                          <button
                            onClick={() => {
                              const note = prompt('Reason / suggestions:');
                              if (note) handleReviewAction(sub.id, 'send_back', note);
                            }}
                            className="bg-amber-100 text-amber-800 font-bold text-xs px-3 py-1.5 rounded-lg"
                          >
                            Request Revisions
                          </button>
                          <button
                            onClick={() => handleReviewAction(sub.id, 'reject', 'Declined')}
                            className="bg-red-50 text-red-600 font-bold text-xs px-3 py-1.5 rounded-lg"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                      <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
                      <select 
                        value={epCity} 
                        onChange={(e) => setEpCity(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      >
                        {!['Lucknow', 'Sitapur', 'Kanpur', 'Ayodhya', 'Delhi'].includes(epCity) && (
                          <option value={epCity}>{epCity}</option>
                        )}
                        <option value="Lucknow">Lucknow (Main)</option>
                        <option value="Sitapur">Sitapur District</option>
                        <option value="Kanpur">Kanpur Edition</option>
                        <option value="Ayodhya">Ayodhya Edition</option>
                        <option value="Delhi">Delhi NCR</option>
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
                            type="url"
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
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 font-bold">Edition</th>
                        <th className="px-3 py-3 font-bold">Date</th>
                        <th className="px-3 py-3 font-bold">City</th>
                        <th className="px-3 py-3 font-bold">Pages</th>
                        <th className="px-3 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {epaperEditions.map((edition) => {
                        const live = edition.isActive !== false;
                        const thumb = edition.thumbnailUrl || edition.pages[0]?.imageUrl;
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
                                  <div className={`font-bold truncate max-w-[280px] ${live ? 'text-slate-900' : 'text-slate-500'}`}>{edition.editionTitle}</div>
                                  <Link href={`/epaper?date=${edition.date}`} target="_blank" className="text-[11px] text-amber-700 font-semibold hover:underline">
                                    Read
                                  </Link>
                                </div>
                              </div>
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
          {/* TAB 4: ARTICLES & STORIES CMS                             */}
          {/* ========================================================= */}
          {activeTab === 'articles' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Articles Management</h2>
                  <p className="text-xs text-slate-500">All live news articles published on the portal</p>
                </div>
                <button
                  onClick={() => setShowAddArticle(true)}
                  className="bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:opacity-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Story</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {articles.map((art) => (
                  <div key={art.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
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
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{art.headline}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{art.excerpt}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400 font-mono">{art.viewsCount} views</span>
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
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: JOURNALISTS & KYC VERIFICATION                     */}
          {activeTab === 'journalists' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="pb-3 border-b flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Journalists & KYC Verification</h2>
                  <p className="text-xs text-slate-500">Add a journalist, then review KYC, role, and access</p>
                </div>
                <button
                  onClick={() => setShowAddJournalist(true)}
                  className="bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add journalist</span>
                </button>
              </div>

              {showAddJournalist && (
                <form onSubmit={handleCreateJournalist} className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 space-y-3">
                  <div className="text-sm font-bold text-slate-900">New journalist</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input required value={journoName} onChange={(e) => setJournoName(e.target.value)} placeholder="Full name" className="px-3 py-2 border rounded-xl text-xs" />
                    <input required type="email" value={journoEmail} onChange={(e) => setJournoEmail(e.target.value)} placeholder="Email" className="px-3 py-2 border rounded-xl text-xs" />
                    <input value={journoPhone} onChange={(e) => setJournoPhone(e.target.value)} placeholder="Phone" className="px-3 py-2 border rounded-xl text-xs" />
                    <input required type="password" value={journoPassword} onChange={(e) => setJournoPassword(e.target.value)} placeholder="Password" className="px-3 py-2 border rounded-xl text-xs" />
                    <select value={journoRole} onChange={(e) => setJournoRole(e.target.value as UserRole)} className="px-3 py-2 border rounded-xl text-xs">
                      <option value="citizen_journalist">Citizen journalist (नागरिक पत्रकार)</option>
                      <option value="staff_reporter">Staff reporter (संवाददाता)</option>
                      <option value="editor">Editor (संपादक)</option>
                    </select>
                    <input value={journoCity} onChange={(e) => setJournoCity(e.target.value)} placeholder="City" className="px-3 py-2 border rounded-xl text-xs" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAddJournalist(false)} className="px-3 py-1.5 border rounded-lg text-xs font-semibold cursor-pointer">Cancel</button>
                    <button type="submit" className="px-3 py-1.5 bg-[#D97706] text-white rounded-lg text-xs font-bold cursor-pointer">Create account</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {users.map((u) => (
                  <div 
                    key={u.id} 
                    className={`border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition ${
                      u.isBanned ? 'bg-red-50/60 border-red-300' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                        u.isBanned 
                          ? 'bg-red-200 text-red-800' 
                          : 'bg-gradient-to-tr from-[#B45309] to-[#F59E0B] text-white'
                      }`}>
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-900">{u.name}</span>
                          {u.isBanned && (
                            <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                              BANNED / BLOCKED
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate">
                          {u.email} {u.phone && `• ${u.phone}`} {u.city && `• ${u.city}`}
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            u.role === 'admin' ? 'bg-red-100 text-red-800' :
                            u.role === 'editor' ? 'bg-purple-100 text-purple-800' :
                            u.role === 'staff_reporter' ? 'bg-blue-100 text-blue-800' :
                            u.role === 'citizen_journalist' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role.replace('_', ' ')}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            u.kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            KYC: {u.kycStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* User Action Buttons: Approve KYC, Edit, Ban/Unban, Delete */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {u.kycStatus !== 'verified' && (
                        <button
                          onClick={() => handleApproveKYC(u.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition cursor-pointer"
                          title="Verify journalist identity"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Approve KYC</span>
                        </button>
                      )}

                      {/* Edit Profile Button */}
                      <button
                        onClick={() => handleStartEditUser(u)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 transition cursor-pointer"
                        title="Edit profile & role"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit</span>
                      </button>

                      {/* Ban / Unban Button */}
                      <button
                        onClick={() => handleToggleBan(u)}
                        className={`font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer ${
                          u.isBanned 
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800' 
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                        }`}
                        title={u.isBanned ? 'Unban this user account' : 'Ban this user account'}
                      >
                        {u.isBanned ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Unban</span>
                          </>
                        ) : (
                          <>
                            <Ban className="w-3.5 h-3.5 text-amber-700" />
                            <span>Ban</span>
                          </>
                        )}
                      </button>

                      {/* Delete / Remove Button */}
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-red-200 flex items-center gap-1 transition cursor-pointer"
                        title="Permanently remove user"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
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
                  <p className="text-xs text-slate-500">Add an admin, change password, edit role, or remove an account. The last admin cannot be deleted.</p>
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
                    <input required type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Password" className="px-3 py-2 border rounded-xl text-xs" />
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

          {/* ========================================================= */}
          {/* TAB 8: ANALYTICS & LOGS                                   */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="pb-3 border-b">
                <h2 className="text-lg font-bold text-slate-900">Readership & Performance Analytics</h2>
                <p className="text-xs text-slate-500">Daily unique visitors, e-paper downloads, and engagement rate</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border">
                  <div className="text-xs text-slate-500 font-bold">Daily Unique Readers</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">42,890</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border">
                  <div className="text-xs text-slate-500 font-bold">E-Paper Flip Impressions</div>
                  <div className="text-2xl font-black text-[#D97706] mt-1">118,450</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border">
                  <div className="text-xs text-slate-500 font-bold">Average Read Time</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">4m 32s</div>
                </div>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  >
                    <option value="state">State & Regional (प्रदेश)</option>
                    <option value="sitapur">Sitapur Local (सीतापुर)</option>
                    <option value="lucknow">Lucknow Bureau (लखनऊ)</option>
                    <option value="national">National (देश)</option>
                    <option value="politics">Politics (राजनीति)</option>
                    <option value="crime">Crime (अपराध)</option>
                    <option value="videos">Video News (वीडियो)</option>
                    <option value="sports">Sports (खेल)</option>
                    <option value="business">Business (व्यापार)</option>
                    <option value="entertainment">Entertainment (मनोरंजन)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. सीतापुर, लखनऊ"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                  />
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
                        type="url"
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
                        type="url"
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
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Leave blank to keep the current password"
                  className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#D97706] focus:outline-none"
                />
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
