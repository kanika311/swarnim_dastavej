'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import { useApp } from '@/context/AppContext';
import { 
  Article, 
  CitizenSubmission, 
  User, 
  AdBanner, 
  GrievanceComplaint, 
  UserRole,
  ArticleCategory 
} from '@/types';
import { 
  INITIAL_ARTICLES, 
  INITIAL_SUBMISSIONS, 
  INITIAL_USERS, 
  INITIAL_ADS, 
  INITIAL_GRIEVANCES 
} from '@/lib/initialData';
import { 
  ShieldCheck, 
  FileCheck2, 
  Users, 
  BarChart3, 
  FilePlus, 
  Megaphone, 
  Check, 
  X, 
  RotateCcw, 
  Eye, 
  Flame, 
  MapPin, 
  Calendar,
  AlertTriangle,
  Scale,
  Newspaper,
  Plus
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    currentUser, 
    switchRole, 
    epaperEditions, 
    addOrUpdateEdition, 
    deleteEdition 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'review' | 'articles' | 'users' | 'ads' | 'epaper' | 'grievance' | 'analytics'>('review');
  const [submissions, setSubmissions] = useState<CitizenSubmission[]>(INITIAL_SUBMISSIONS);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [ads, setAds] = useState<AdBanner[]>(INITIAL_ADS);
  const [grievances, setGrievances] = useState<GrievanceComplaint[]>(INITIAL_GRIEVANCES);

  // E-Paper Management Form State
  const [showAddEPaper, setShowAddEPaper] = useState(false);
  const [epDate, setEpDate] = useState('2026-09-27');
  const [epCity, setEpCity] = useState('लखनऊ');
  const [epTitle, setEpTitle] = useState('स्वर्णिम दस्तावेज़ - लखनऊ दैनिक मुख्य संस्करण');
  const [epPagesCount, setEpPagesCount] = useState(6);
  const [epPdfUrl, setEpPdfUrl] = useState('');

  // Check URL query param for default tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'epaper') setActiveTab('epaper');
    }
  }, []);

  // Modal / Action state
  const [reviewNote, setReviewNote] = useState('');
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'send_back' | 'reject' | null>(null);

  // New Article Form state
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ArticleCategory>('state');
  const [newCity, setNewCity] = useState('लखनऊ');
  const [newBody, setNewBody] = useState('');
  const [newIsBreaking, setNewIsBreaking] = useState(false);

  // Refresh live data
  useEffect(() => {
    fetch('/api/submissions').then(r => r.json()).then(d => d.success && setSubmissions(d.data)).catch(() => {});
    fetch('/api/articles').then(r => r.json()).then(d => d.success && setArticles(d.data)).catch(() => {});
    fetch('/api/users').then(r => r.json()).then(d => d.success && setUsers(d.data)).catch(() => {});
    fetch('/api/grievance').then(r => r.json()).then(d => d.success && setGrievances(d.data)).catch(() => {});
  }, []);

  // Quick RBAC access check
  const hasAccess = currentUser.role === 'admin' || currentUser.role === 'editor' || currentUser.role === 'super_admin' || currentUser.role === 'staff_reporter';

  // Handle Review Actions (FR-APR-03)
  const handleReviewAction = async (subId: string, action: 'approve' | 'reject' | 'send_back', note?: string) => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: subId,
          action,
          comments: note,
          reviewerName: currentUser.name
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSubmissions(prev => prev.map(s => s.id === subId ? data.data : s));
        if (action === 'approve') {
          // Refresh articles list to show newly published story
          fetch('/api/articles').then(r => r.json()).then(d => d.success && setArticles(d.data));
          alert('खबर स्वीकृत कर ली गई है और पोर्टल पर प्रकाशित हो चुकी है!');
        } else if (action === 'send_back') {
          alert('खबर संशोधन हेतु संवाददाता को वापस भेजी गई।');
        } else {
          alert('खबर अस्वीकृत कर दी गई।');
        }
      }
    } catch (e) {
      alert('कार्रवाई पूरी करने में त्रुटि हुई।');
    } finally {
      setSelectedSubId(null);
      setActionType(null);
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
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.role
          }
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setArticles(prev => [data.data, ...prev]);
        setShowAddArticle(false);
        setNewTitle('');
        setNewBody('');
        alert('नई खबर सफलतापूर्वक प्रकाशित कर दी गई!');
      }
    } catch (e) {
      alert('खबर बनाने में त्रुटि हुई।');
    }
  };

  // Change user role / approve citizen journalist KYC
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUsers(prev => prev.map(u => u.id === userId ? data.data : u));
        alert(`उपयोगकर्ता को '${newRole}' की भूमिका प्रदान की गई!`);
      }
    } catch (e) {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
      <Header />
      <BreakingTicker />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        
        {/* ACCESS WARNING IF USER IS READER */}
        {!hasAccess && (
          <div className="mb-6 bg-amber-500/10 border-2 border-amber-500 text-amber-900 dark:text-amber-200 p-4 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>सूचना: आप वर्तमान में &apos;{currentUser.role}&apos; के रूप में देख रहे हैं।</span>
              </h4>
              <p className="text-xs mt-1">
                सभी संपादकीय एवं व्यवस्थापकीय नियंत्रणों के परीक्षण हेतु ऊपर दाईं ओर &apos;भूमिका: व्यवस्थापक (Admin)&apos; का चयन करें।
              </p>
            </div>
            <button
              onClick={() => switchRole('admin')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow shrink-0"
            >
              व्यवस्थापक (Admin) बनें
            </button>
          </div>
        )}

        {/* ADMIN HEADER */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-0.5 rounded shadow">
                नियंत्रण कक्ष
              </span>
              <span className="text-xs text-amber-400 font-mono">
                Swarnim Dastavej CMS v1.0
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif mt-1">
              केंद्रीय संपादकीय एवं व्यवस्थापक डैशबोर्ड
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              नागरिक पत्रकारिता समीक्षा, सामग्री प्रकाशन, ई-पेपर, विज्ञापन एवं आचार संहिता अनुपालन
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddArticle(true)}
              className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>सीधी खबर प्रकाशित करें</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">समीक्षाधीन खबरें (Review Queue)</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {submissions.filter(s => s.status === 'pending_review').length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">नागरिक व संवाददाता रिपोर्ट</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">कुल प्रकाशित खबरें (Articles)</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {articles.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">पोर्टल पर लाइव</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">पंजीकृत पत्रकार (Journalists)</div>
            <div className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">
              {users.filter(u => u.role === 'citizen_journalist' || u.role === 'staff_reporter').length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">सीतापुर एवं लखनऊ</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">शिकायत निवारण (IT Rules)</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {grievances.filter(g => g.status === 'under_review' || g.status === 'received').length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">लंबित शिकायतें</div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 text-xs sm:text-sm font-bold">
          {[
            { id: 'review', label: 'संपादकीय समीक्षा कक्ष (Review Queue)', icon: FileCheck2 },
            { id: 'epaper', label: 'ई-पेपर प्रबंधन (E-Paper Manager)', icon: Newspaper },
            { id: 'articles', label: 'सभी प्रकाशित खबरें', icon: FilePlus },
            { id: 'users', label: 'नागरिक पत्रकार एवं KYC', icon: Users },
            { id: 'ads', label: 'प्रायोजित व विज्ञापन', icon: Megaphone },
            { id: 'grievance', label: 'शिकायत निवारण (IT Rules)', icon: Scale },
            { id: 'analytics', label: 'एनालिटिक्स एवं पाठक डेटा', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-red-700 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: EDITORIAL REVIEW QUEUE (FR-APR-01 to FR-APR-06) */}
        {activeTab === 'review' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  संपादकीय अनुमोदन कतार (Editorial Review Queue)
                </h3>
                <p className="text-xs text-slate-500">
                  नागरिक पत्रकारों द्वारा भेजी गई प्रत्येक खबर का सत्यापन एवं प्रकाशन नियंत्रण।
                </p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded">
                कुल {submissions.length} प्रस्तुतियां
              </span>
            </div>

            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      sub.status === 'pending_review' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                      sub.status === 'approved' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                      sub.status === 'sent_back' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                      'bg-red-100 text-red-900 border-red-300'
                    }`}>
                      {sub.status === 'pending_review' ? 'समीक्षाधीन (Pending Review)' : sub.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      श्रेणी: {sub.category} | शहर: {sub.city}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    प्रेषक: {sub.submittedBy.name} ({sub.submittedBy.role})
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {sub.headline}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  {sub.body}
                </p>

                {/* Media attachments */}
                {sub.media && sub.media.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">संलग्न मीडिया:</span>
                    {sub.media.map((m, idx) => (
                      <a key={idx} href={m.url} target="_blank" rel="noreferrer" className="text-xs text-red-600 underline">
                        तस्वीर {idx + 1}
                      </a>
                    ))}
                    {sub.hasRecordedVideo && (
                      <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
                        🎥 वीडियो संलग्न
                      </span>
                    )}
                  </div>
                )}

                {/* Editorial Actions (FR-APR-03) */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Approve & Publish Immediately */}
                    <button
                      onClick={() => handleReviewAction(sub.id, 'approve')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>स्वीकृत व प्रकाशित करें</span>
                    </button>

                    {/* Send back for changes */}
                    <button
                      onClick={() => {
                        setSelectedSubId(sub.id);
                        setActionType('send_back');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>सुधार हेतु वापस भेजें</span>
                    </button>

                    {/* Reject */}
                    <button
                      onClick={() => {
                        setSelectedSubId(sub.id);
                        setActionType('reject');
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>अस्वीकृत करें</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-400">
                    सबमिट समय: {new Date(sub.submittedAt).toLocaleString('hi-IN')}
                  </span>
                </div>

                {/* Rejection / Send back modal prompt */}
                {selectedSubId === sub.id && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg space-y-2">
                    <label className="block text-xs font-bold text-amber-900 dark:text-amber-200">
                      {actionType === 'send_back' ? 'संवाददाता के लिए सुधार निर्देश (Revision Note):' : 'अस्वीकृति का स्पष्ट कारण (Rejection Reason):'}
                    </label>
                    <textarea
                      rows={2}
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="उदा: कृपया संबंधित विभाग का आधिकारिक पक्ष जोड़ें तथा मौके की साफ तस्वीर संलग्न करें..."
                      className="w-full text-xs p-2 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReviewAction(sub.id, actionType!, reviewNote)}
                        className="bg-slate-900 text-white font-bold text-xs px-3 py-1 rounded"
                      >
                        पुष्टि करें
                      </button>
                      <button
                        onClick={() => setSelectedSubId(null)}
                        className="text-xs text-slate-500 hover:underline"
                      >
                        रद्द करें
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: ARTICLES MANAGEMENT */}
        {activeTab === 'articles' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                साइट पर प्रकाशित समस्त खबरें ({articles.length})
              </h3>
              <button
                onClick={() => setShowAddArticle(true)}
                className="bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-red-800"
              >
                + नई खबर जोड़ें
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {articles.map((art) => (
                <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                      <span className="font-bold text-red-600">{art.category}</span>
                      <span>•</span>
                      <span>{art.city}</span>
                      <span>•</span>
                      <span>{art.author.name}</span>
                      {art.isBreaking && (
                        <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                          ब्रेकिंग
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {art.headline}
                    </h4>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3 shrink-0">
                    <span>{art.viewsCount} पाठक</span>
                    <a
                      href={`/article/${art.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-700 font-bold hover:underline"
                    >
                      देखें
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: USERS & KYC VERIFICATION (FR-AUTH-03 & FR-CMS-03) */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
              प्रयोक्ता प्रबंधन एवं नागरिक पत्रकार KYC सत्यापन
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.map((u) => (
                <div key={u.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>{u.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        {u.role}
                      </span>
                      {u.kycStatus === 'verified' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          KYC सत्यापित
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      ईमेल: {u.email} | फ़ोन: {u.phone || 'N/A'} | शहर: {u.city}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">भूमिका बदलें:</span>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="text-xs p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    >
                      <option value="reader">पाठक (Reader)</option>
                      <option value="citizen_journalist">नागरिक पत्रकार (Citizen Journalist)</option>
                      <option value="staff_reporter">विशेष संवाददाता (Staff Reporter)</option>
                      <option value="editor">संपादक (Editor)</option>
                      <option value="admin">व्यवस्थापक (Admin)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ADS & SPONSORED CONTENT (FR-ADS-01 to FR-ADS-03) */}
        {activeTab === 'ads' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-700">
              प्रायोजित आलेख एवं विज्ञापन अभियान
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ads.map((ad) => (
                <div key={ad.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-amber-700 dark:text-amber-400 uppercase">
                      {ad.placement}
                    </span>
                    <span className="text-emerald-600 font-bold">सक्रिय</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {ad.title}
                  </h4>
                  <div className="text-xs text-slate-500 mb-3">
                    विज्ञापनदाता: {ad.advertiser}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                    <span>दृश्य (Impressions): {ad.impressions.toLocaleString()}</span>
                    <span>क्लिक (Clicks): {ad.clicks.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GRIEVANCE REDRESSAL LOG (FR-LEG-02 & IT RULES 2021) */}
        {activeTab === 'grievance' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-700">
              शिकायत निवारण अधिकारी रजिस्टर (IT Rules 2021 Compliance Audit)
            </h3>

            <div className="space-y-3">
              {grievances.map((g) => (
                <div key={g.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-600">
                      टोकन: {g.tokenNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      g.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {g.status === 'resolved' ? 'निस्तारित (Resolved)' : 'विचाराधीन (Under Review)'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    शिकायतकर्ता: {g.complainantName} ({g.complainantPhone})
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {g.complaintDetails}
                  </p>
                  {g.resolutionNotes && (
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded border border-emerald-200">
                      <strong>निस्तारण विवरण:</strong> {g.resolutionNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-700">
              ट्रैफिक एवं पठन विश्लेषिकी (Platform Readership Insights)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-500">सर्वाधिक पढ़ा गया शहर</h4>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">1. लखनऊ (48%)</div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">2. सीतापुर (36%)</div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">3. कानपुर (16%)</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-500">नागरिक पत्रकार अनुमोदन दर</h4>
                <div className="text-2xl font-black text-emerald-600 mt-1">87.4%</div>
                <p className="text-[11px] text-slate-400 mt-1">समीक्षा के उपरांत स्वीकृत कहानियां</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-500">औसत पठन समय</h4>
                <div className="text-2xl font-black text-amber-600 mt-1">3 मिनट 24 सेकंड</div>
                <p className="text-[11px] text-slate-400 mt-1">प्रति पाठक दैनिक सहभागिता</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: E-PAPER MANAGEMENT (BY DATE) */}
        {activeTab === 'epaper' && (
          <div className="space-y-6">
            
            {/* Header bar */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-red-600" />
                  <span>दैनिक ई-पेपर संस्करण प्रबंधन (E-Paper Editions by Date)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  दिनांक एवं शहर के अनुसार अखबार अपलोड करें, पन्नों की संख्या प्रबंधित करें व पीडीएफ लिंक अपडेट करें।
                </p>
              </div>

              <button
                onClick={() => setShowAddEPaper(true)}
                className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow flex items-center gap-1.5 transition self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ नया संस्करण जोड़ें</span>
              </button>
            </div>

            {/* Form to Add / Edit Edition */}
            {showAddEPaper && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border-2 border-red-500 shadow-lg space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <span>ई-पेपर संस्करण विवरण (Edition Details)</span>
                  </h4>
                  <button
                    onClick={() => setShowAddEPaper(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newEdition = {
                      id: `epaper-${epDate}-${epCity.toLowerCase()}`,
                      date: epDate,
                      editionCity: epCity,
                      editionTitle: epTitle,
                      pagesCount: epPagesCount,
                      thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
                      pages: Array.from({ length: epPagesCount }, (_, i) => ({
                        pageNumber: i + 1,
                        title: i === 0 
                          ? 'मुख्य पृष्ठ (Front Page)' 
                          : i === 1 
                          ? 'प्रादेशिक हलचल (State News)' 
                          : `पृष्ठ ${i + 1} - अवध एवं स्थानीय हलचल`,
                        imageUrl: i === 0 
                          ? 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'
                          : i === 1 
                          ? 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80'
                          : 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=1200&auto=format&fit=crop&q=80',
                        pdfUrl: epPdfUrl || undefined
                      }))
                    };
                    addOrUpdateEdition(newEdition);
                    setShowAddEPaper(false);
                    alert(`दिनांक ${epDate} (${epCity}) के लिए ई-पेपर संस्करण सफलतापूर्वक सहेज लिया गया है!`);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        दिनांक (Edition Date) *
                      </label>
                      <input
                        type="date"
                        required
                        value={epDate}
                        onChange={(e) => setEpDate(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        शहर / संस्करण (City) *
                      </label>
                      <select
                        value={epCity}
                        onChange={(e) => setEpCity(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      >
                        <option value="लखनऊ">लखनऊ (मुख्य संस्करण)</option>
                        <option value="सीतापुर">सीतापुर (जिला संस्करण)</option>
                        <option value="दिल्ली">दिल्ली-एनसीआर</option>
                        <option value="कानपुर">कानपुर</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        कुल पन्ने (Page Count) *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={16}
                        required
                        value={epPagesCount}
                        onChange={(e) => setEpPagesCount(Number(e.target.value))}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      संस्करण का शीर्षक (Edition Title) *
                    </label>
                    <input
                      type="text"
                      required
                      value={epTitle}
                      onChange={(e) => setEpTitle(e.target.value)}
                      placeholder="उदा: स्वर्णिम दस्तावेज़ - लखनऊ दैनिक मुख्य संस्करण"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      पूर्ण अखबार पीडीएफ यूआरएल (Full Edition PDF Link - Optional)
                    </label>
                    <input
                      type="url"
                      value={epPdfUrl}
                      onChange={(e) => setEpPdfUrl(e.target.value)}
                      placeholder="https://.../swarnim-edition.pdf"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setShowAddEPaper(false)}
                      className="text-xs px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow"
                    >
                      ई-पेपर संस्करण सहेजें (Save & Publish)
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List of Existing Editions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {epaperEditions.map((ed) => (
                <div
                  key={ed.id}
                  className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-4 items-center"
                >
                  <div className="w-20 aspect-[3/4] bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0 border border-slate-300 dark:border-slate-600 relative">
                    <img
                      src={ed.thumbnailUrl || ed.pages[0]?.imageUrl}
                      alt={ed.editionTitle}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                      {ed.pagesCount} पृ.
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {ed.editionCity}
                      </span>
                      <span className="text-xs text-slate-500 font-mono font-bold">
                        {ed.date}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
                      {ed.editionTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      कुल पृष्ठ: {ed.pages.length} • लाइव उपलब्ध
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <a
                        href={`/epaper?date=${ed.date}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>रीडर में देखें</span>
                      </a>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={() => {
                          setEpDate(ed.date);
                          setEpCity(ed.editionCity);
                          setEpTitle(ed.editionTitle);
                          setEpPagesCount(ed.pagesCount);
                          setShowAddEPaper(true);
                        }}
                        className="text-xs font-bold text-amber-600 hover:underline"
                      >
                        संपादित करें
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={() => {
                          if (confirm(`क्या आप ${ed.editionTitle} (${ed.date}) को हटाना चाहते हैं?`)) {
                            deleteEdition(ed.id);
                          }
                        }}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        हटाएं
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* MODAL: ADD NEW ARTICLE */}
        {showAddArticle && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  सीधी खबर प्रकाशित करें (Editor Quick Publish)
                </h3>
                <button onClick={() => setShowAddArticle(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateArticle} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    शीर्षक (Headline) *
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="खबर का मुख्य शीर्षक..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      श्रेणी (Category)
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ArticleCategory)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    >
                      <option value="state">उत्तर प्रदेश</option>
                      <option value="sitapur">सीतापुर</option>
                      <option value="lucknow">लखनऊ</option>
                      <option value="national">राष्ट्रीय</option>
                      <option value="politics">राजनीति</option>
                      <option value="sports">खेल</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      शहर (City)
                    </label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    खबर का पूर्ण विवरण (Body) *
                  </label>
                  <textarea
                    rows={5}
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="breakingCheck"
                    checked={newIsBreaking}
                    onChange={(e) => setNewIsBreaking(e.target.checked)}
                    className="rounded text-red-600"
                  />
                  <label htmlFor="breakingCheck" className="text-xs font-bold text-red-600">
                    ब्रेकिंग न्यूज़ टिकर में भी शामिल करें
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddArticle(false)}
                    className="text-xs px-3 py-1.5 rounded hover:bg-slate-100"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow"
                  >
                    अभी प्रकाशित करें
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
