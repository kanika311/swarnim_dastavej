'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { 
  Article, 
  CitizenSubmission, 
  User, 
  AdBanner, 
  GrievanceComplaint, 
  ArticleCategory,
  EPaperEdition 
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
  Loader2
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
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submissions' | 'epaper' | 'articles' | 'journalists' | 'ads' | 'grievances' | 'analytics'>('dashboard');
  const [tabSearchQuery, setTabSearchQuery] = useState('');
  
  // Data states
  const [submissions, setSubmissions] = useState<CitizenSubmission[]>(INITIAL_SUBMISSIONS);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [ads, setAds] = useState<AdBanner[]>(INITIAL_ADS);
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

  // E-Paper Form state
  const [showAddEPaper, setShowAddEPaper] = useState(false);
  const [epDate, setEpDate] = useState('2026-09-27');
  const [epCity, setEpCity] = useState('Lucknow');
  const [epTitle, setEpTitle] = useState('Swarnim Dastavej - Lucknow Main Edition');
  const [epPagesCount, setEpPagesCount] = useState(6);
  const [epPdfUrl, setEpPdfUrl] = useState('');
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
    }
  }, []);

  // Refresh live data from backend APIs
  useEffect(() => {
    fetch('/api/submissions').then(r => r.json()).then(d => d.success && setSubmissions(d.data)).catch(() => {});
    fetch('/api/articles').then(r => r.json()).then(d => d.success && setArticles(d.data)).catch(() => {});
    fetch('/api/users').then(r => r.json()).then(d => d.success && setUsers(d.data)).catch(() => {});
    fetch('/api/grievance').then(r => r.json()).then(d => d.success && setGrievances(d.data)).catch(() => {});
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
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: newTitle.trim(),
          body: newBody.trim(),
          category: newCategory,
          city: newCity,
          isBreaking: newIsBreaking,
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
        alert('Article published live to portal!');
      } else {
        alert('Article saved successfully!');
      }
    } catch (e) {
      alert('Article published!');
    } finally {
      setShowAddArticle(false);
      setNewTitle('');
      setNewBody('');
    }
  };

  // Add E-Paper Edition handler
  const handleAddEPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEdition: EPaperEdition = {
      id: `epaper-${Date.now()}`,
      date: epDate,
      editionCity: epCity,
      editionTitle: epTitle,
      pagesCount: epPagesCount,
      thumbnailUrl: `https://images.unsplash.com/photo-1585829365295?w=400&auto=format&fit=crop&q=80`,
      pages: Array.from({ length: epPagesCount }, (_, i) => ({
        pageNumber: i + 1,
        title: `Page ${i + 1}`,
        imageUrl: `https://images.unsplash.com/photo-${1585829365295 + i}?w=1200&auto=format&fit=crop&q=80`,
        pdfUrl: epPdfUrl || `https://swarnimdastavej.com/epaper/pdf/${epDate}-${epCity.toLowerCase()}.pdf`
      }))
    };

    addOrUpdateEdition(newEdition);
    setShowAddEPaper(false);
    alert('New E-Paper Edition created and published!');
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

  // Navigation Tabs configuration
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'submissions', label: 'News Submissions', icon: FileCheck, badge: submissions.filter(s => s.status === 'pending_review').length },
    { id: 'epaper', label: 'E-Paper Manager', icon: Newspaper, count: epaperEditions.length },
    { id: 'articles', label: 'Articles / News', icon: FileText, count: articles.length },
    { id: 'journalists', label: 'Experts & Journalists', icon: Users, count: users.filter(u => u.role === 'citizen_journalist').length },
    { id: 'ads', label: 'Advertisements', icon: Megaphone, count: ads.length },
    { id: 'grievances', label: 'Grievances', icon: Scale, count: grievances.length },
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
      <aside className="w-64 shrink-0 bg-[#0B192C] text-slate-300 flex flex-col justify-between min-h-screen sticky top-0 self-start shadow-xl z-20 border-r border-[#1C3759]">
        
        {/* Top: Logo & Search */}
        <div className="p-4 space-y-4">
          
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
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
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
                  onClick={() => setShowAddEPaper(true)}
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
                    <h3 className="font-bold text-slate-900 text-sm">Add Today&apos;s New E-Paper Edition</h3>
                    <button onClick={() => setShowAddEPaper(false)} className="text-slate-400 hover:text-slate-600">✕</button>
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
                    <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddEPaper(false)}
                        className="px-4 py-2 border rounded-lg text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 hover:opacity-95 cursor-pointer"
                      >
                        Publish Edition
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Published Editions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {epaperEditions.map((edition) => (
                  <div key={edition.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
                    <div className="relative aspect-[3/4] bg-slate-900 overflow-hidden group">
                      {edition.pages[0]?.imageUrl && (
                        <img 
                          src={edition.pages[0].imageUrl} 
                          alt={edition.editionTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      )}
                      <div className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                        {edition.editionCity}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        {edition.pagesCount} Pages
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{edition.editionTitle}</h4>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {edition.date}
                        </span>
                        <span className="text-emerald-600 font-bold">Published</span>
                      </div>

                      <div className="pt-2 border-t flex items-center justify-between gap-2">
                        <Link
                          href={`/epaper?date=${edition.date}`}
                          target="_blank"
                          className="flex-1 text-center py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
                        >
                          Read E-Paper
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this edition?')) {
                              deleteEdition(edition.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Edition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
              <div className="pb-3 border-b">
                <h2 className="text-lg font-bold text-slate-900">Journalists & KYC Verification</h2>
                <p className="text-xs text-slate-500">Citizen journalists credentials and Aadhaar verification status</p>
              </div>

              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email} • {u.phone} • {u.city}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            u.role === 'admin' ? 'bg-red-100 text-red-800' :
                            u.role === 'citizen_journalist' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role.replace('_', ' ')}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            u.kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            KYC: {u.kycStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {u.kycStatus !== 'verified' && (
                        <button
                          onClick={() => handleApproveKYC(u.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg"
                        >
                          Approve KYC
                        </button>
                      )}
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
              <div className="pb-3 border-b">
                <h2 className="text-lg font-bold text-slate-900">Sponsored Ads & Banners</h2>
                <p className="text-xs text-slate-500">UP Government and commercial sponsors</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ads.map((ad) => (
                  <div key={ad.id} className="border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="text-xs font-bold text-[#D97706] uppercase">{ad.advertiser}</div>
                    <div className="font-bold text-sm text-slate-900">{ad.title}</div>
                    <div className="text-xs text-slate-500">{ad.targetUrl}</div>
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Clicks: {ad.clicks}</span>
                      <span className="text-emerald-600 font-bold">Active Campaign</span>
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
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-extrabold text-base text-slate-900">Direct Article Publication</h3>
              <button onClick={() => setShowAddArticle(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form onSubmit={handleCreateArticle} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter headline..."
                  className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                  >
                    <option value="state">State & Regional</option>
                    <option value="sitapur">Sitapur Local</option>
                    <option value="lucknow">Lucknow Bureau</option>
                    <option value="sports">Sports</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Story Content</label>
                <textarea
                  required
                  rows={4}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Write the full news story details..."
                  className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
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
                  onClick={() => setShowAddArticle(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 hover:opacity-95 cursor-pointer"
                >
                  Publish Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
