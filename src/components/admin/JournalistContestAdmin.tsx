'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Plus, 
  Calendar, 
  Award, 
  Settings2, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  CheckCheck, 
  Trash2, 
  Edit3, 
  Info, 
  Flame, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  X,
  RefreshCw,
  Ban,
  UploadCloud,
  FileCheck,
  FileText,
  ExternalLink,
  Sparkles,
  Medal,
} from 'lucide-react';
import { WeeklyContest, LeaderboardEntry, ContestPrize, ContestScoringRules } from '@/types';
import { convertImageToWebP } from '@/lib/imageOptimization';

export interface PrizeConfigItem {
  rank: number;
  title: string;
  type: 'certificate' | 'cash' | 'both' | 'trophy' | 'custom';
  amount: number;
  rewardText: string;
  certificateUrl: string;
}

const DEFAULT_PRIZE_TEMPLATES: Record<string, PrizeConfigItem[]> = {
  certificate_only: [
    {
      rank: 1,
      title: '🥇 1st Prize - सर्वश्रेष्ठ ज़मीनी पत्रकार',
      type: 'certificate',
      amount: 0,
      rewardText: 'सर्वश्रेष्ठ नागरिक पत्रकार ई-प्रमाणपत्र (Best Citizen Journalist Certificate)',
      certificateUrl: '',
    },
    {
      rank: 2,
      title: '🥈 2nd Prize - उत्कृष्ट रिपोर्टर',
      type: 'certificate',
      amount: 0,
      rewardText: 'उत्कृष्ट नागरिक पत्रकार ई-प्रमाणपत्र (Excellence Certificate)',
      certificateUrl: '',
    },
    {
      rank: 3,
      title: '🥉 3rd Prize - विशेष प्रेरणा पुरस्कार',
      type: 'certificate',
      amount: 0,
      rewardText: 'विशेष प्रेरणा ई-प्रमाणपत्र (Certificate of Appreciation)',
      certificateUrl: '',
    },
  ],
  cash_certificate: [
    {
      rank: 1,
      title: '🥇 1st Prize - सर्वश्रेष्ठ ज़मीनी पत्रकार',
      type: 'both',
      amount: 5000,
      rewardText: '₹5,000 + सर्वश्रेष्ठ नागरिक पत्रकार ई-प्रमाणपत्र',
      certificateUrl: '',
    },
    {
      rank: 2,
      title: '🥈 2nd Prize - उत्कृष्ट रिपोर्टर',
      type: 'both',
      amount: 3000,
      rewardText: '₹3,000 + उत्कृष्ट नागरिक पत्रकार ई-प्रमाणपत्र',
      certificateUrl: '',
    },
    {
      rank: 3,
      title: '🥉 3rd Prize - विशेष प्रेरणा पुरस्कार',
      type: 'both',
      amount: 1500,
      rewardText: '₹1,500 + विशेष प्रेरणा ई-प्रमाणपत्र',
      certificateUrl: '',
    },
  ],
  cash_only: [
    {
      rank: 1,
      title: '🥇 1st Prize - सर्वश्रेष्ठ ज़मीनी पत्रकार',
      type: 'cash',
      amount: 5000,
      rewardText: '₹5,000 नकद पुरस्कार',
      certificateUrl: '',
    },
    {
      rank: 2,
      title: '🥈 2nd Prize - उत्कृष्ट रिपोर्टर',
      type: 'cash',
      amount: 3000,
      rewardText: '₹3,000 नकद पुरस्कार',
      certificateUrl: '',
    },
    {
      rank: 3,
      title: '🥉 3rd Prize - विशेष प्रेरणा पुरस्कार',
      type: 'cash',
      amount: 1500,
      rewardText: '₹1,500 नकद पुरस्कार',
      certificateUrl: '',
    },
  ],
  trophy_certificate: [
    {
      rank: 1,
      title: '🥇 1st Prize - सर्वश्रेष्ठ ज़मीनी पत्रकार',
      type: 'trophy',
      amount: 0,
      rewardText: 'स्वर्णिम दस्तावेज़ स्मृति चिन्ह व ई-प्रमाणपत्र (Trophy & Certificate)',
      certificateUrl: '',
    },
    {
      rank: 2,
      title: '🥈 2nd Prize - उत्कृष्ट रिपोर्टर',
      type: 'trophy',
      amount: 0,
      rewardText: 'रजत मेडल व ई-प्रमाणपत्र (Silver Medal & Certificate)',
      certificateUrl: '',
    },
    {
      rank: 3,
      title: '🥉 3rd Prize - विशेष प्रेरणा पुरस्कार',
      type: 'trophy',
      amount: 0,
      rewardText: 'कांस्य मेडल व सम्मान पत्र (Bronze Medal & Certificate)',
      certificateUrl: '',
    },
  ],
};

export default function JournalistContestAdmin() {
  const [contests, setContests] = useState<WeeklyContest[]>([]);
  const [activeContest, setActiveContest] = useState<WeeklyContest | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);

  // Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContestId, setEditingContestId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prizesList, setPrizesList] = useState<PrizeConfigItem[]>(DEFAULT_PRIZE_TEMPLATES.certificate_only);
  const [uploadingCertRank, setUploadingCertRank] = useState<number | null>(null);

  const handleCertificateUpload = async (rank: number, file: File) => {
    if (!file) return;
    try {
      setUploadingCertRank(rank);
      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        fileToUpload = await convertImageToWebP(file);
      }
      const formData = new FormData();
      formData.append('file', fileToUpload);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        setPrizesList((prev) =>
          prev.map((p) => (p.rank === rank ? { ...p, certificateUrl: data.url } : p))
        );
      } else {
        alert(data.message || 'मीडिया अपलोड विफल हुआ');
      }
    } catch {
      alert('अपलोड में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setUploadingCertRank(null);
    }
  };

  // Configurable Scoring System
  const [pointsPer100Views, setPointsPer100Views] = useState(1);
  const [pointsPerLike, setPointsPerLike] = useState(2);
  const [pointsPerComment, setPointsPerComment] = useState(3);
  const [pointsPerShare, setPointsPerShare] = useState(4);
  const [pointsPerPublishedReport, setPointsPerPublishedReport] = useState(10);

  const [minReports, setMinReports] = useState(1);
  const [contestStatus, setContestStatus] = useState<'draft' | 'active'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Contests & Leaderboard
  const fetchContests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/contests');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setContests(data.data);
        const active = data.data.find((c: WeeklyContest) => c.status === 'active') || data.data[0] || null;
        setActiveContest(active);
        if (active) {
          fetchLeaderboard(active.id);
        }
      }
    } catch (e) {
      console.error('Error fetching contests:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaderboard = async (contestId?: string) => {
    try {
      const url = contestId ? `/api/contest/leaderboard?contestId=${contestId}` : '/api/contest/leaderboard';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data?.leaderboard) {
        setLeaderboard(data.data.leaderboard);
      }
    } catch (e) {
      console.error('Error fetching leaderboard:', e);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    const now = new Date();
    const end = new Date();
    end.setDate(now.getDate() + 7);
    setStartDate(now.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setPrizesList(DEFAULT_PRIZE_TEMPLATES.certificate_only);
    setPointsPer100Views(1);
    setPointsPerLike(2);
    setPointsPerComment(3);
    setPointsPerShare(4);
    setPointsPerPublishedReport(10);
    setMinReports(1);
    setContestStatus('active');
    setEditingContestId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleStartEdit = (contest: WeeklyContest) => {
    setEditingContestId(contest.id);
    setTitle(contest.title);
    setDescription(contest.description);
    setStartDate(contest.startDate.split('T')[0]);
    setEndDate(contest.endDate.split('T')[0]);
    if (contest.prizes && contest.prizes.length > 0) {
      setPrizesList(
        contest.prizes.map((p, idx) => ({
          rank: p.rank || idx + 1,
          title: p.title || `Rank #${p.rank}`,
          type: (p.type as any) || (p.amount && p.amount > 0 ? (p.rewardText ? 'both' : 'cash') : 'certificate'),
          amount: p.amount || 0,
          rewardText: p.rewardText || (p.amount && p.amount > 0 ? `₹${p.amount.toLocaleString('en-IN')} नकद राशि` : 'सर्वश्रेष्ठ नागरिक पत्रकार ई-प्रमाणपत्र'),
          certificateUrl: p.certificateUrl || '',
        }))
      );
    } else {
      setPrizesList(DEFAULT_PRIZE_TEMPLATES.certificate_only);
    }
    setPointsPer100Views(contest.scoringRules?.pointsPer100Views ?? 1);
    setPointsPerLike(contest.scoringRules?.pointsPerLike ?? 2);
    setPointsPerComment(contest.scoringRules?.pointsPerComment ?? 3);
    setPointsPerShare(contest.scoringRules?.pointsPerShare ?? 4);
    setPointsPerPublishedReport(contest.scoringRules?.pointsPerPublishedReport ?? 10);
    setMinReports(contest.eligibilityRules?.minPublishedReports ?? 1);
    setContestStatus(contest.status === 'active' ? 'active' : 'draft');
    setShowCreateModal(true);
  };

  const handleSaveContest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate || !endDate) {
      alert('कृपया प्रतियोगिता का नाम, आरंभ और समाप्ति तिथि भरें।');
      return;
    }

    setIsSubmitting(true);
    const prizes: ContestPrize[] = prizesList.map((p) => ({
      rank: p.rank,
      title: p.title || `Rank #${p.rank}`,
      type: p.type,
      amount: p.type === 'certificate' || p.type === 'trophy' ? 0 : Number(p.amount) || 0,
      rewardText: p.rewardText || '',
      certificateUrl: p.certificateUrl || '',
      icon: p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : '🎖️',
    }));

    const scoringRules: ContestScoringRules = {
      pointsPer100Views: Number(pointsPer100Views),
      pointsPerLike: Number(pointsPerLike),
      pointsPerComment: Number(pointsPerComment),
      pointsPerShare: Number(pointsPerShare),
      pointsPerPublishedReport: Number(pointsPerPublishedReport),
    };

    const payload = {
      title: title.trim(),
      description: description.trim(),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      prizes,
      scoringRules,
      eligibilityRules: {
        minPublishedReports: Number(minReports),
        minViews: 0,
        eligibleRoles: ['citizen_journalist', 'staff_journalist'],
      },
      status: contestStatus,
    };

    try {
      let res;
      if (editingContestId) {
        res = await fetch('/api/admin/contests', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingContestId, ...payload }),
        });
      } else {
        res = await fetch('/api/admin/contests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        alert(data.message || 'प्रतियोगिता सफलतापूर्वक सहेजी गई!');
        setShowCreateModal(false);
        fetchContests();
      } else {
        alert(data.message || 'त्रुटि हुई।');
      }
    } catch {
      alert('सर्वर से संपर्क नहीं हो सका।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivateContest = async (id: string) => {
    if (!confirm('क्या आप इस प्रतियोगिता को सक्रिय (ACTIVE) करना चाहते हैं? पिछली सक्रिय प्रतियोगिता समाप्त हो जाएगी।')) return;
    try {
      const res = await fetch('/api/admin/contests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'activate' }),
      });
      const data = await res.json();
      if (data.success) {
        fetchContests();
      }
    } catch {
      alert('त्रुटि हुई');
    }
  };

  const handleFinalizeWinners = async (id: string) => {
    if (!confirm('क्या आप इस प्रतियोगिता के विजेताओं की आधिकारिक पुष्टि करना चाहते हैं?\n\nविजेताओं को रैंक के अनुसार पुरस्कार तय कर दिए जाएंगे और प्रतियोगिता "COMPLETED" मार्क हो जाएगी।')) return;
    try {
      const res = await fetch('/api/admin/contests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'finalize_winners' }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'विजेता घोषित हो गए!');
        fetchContests();
      }
    } catch {
      alert('त्रुटि हुई');
    }
  };

  const handleDisqualifyParticipant = async (userId: string, userName: string) => {
    if (!activeContest) return;
    if (!confirm(`क्या आप ${userName} को इस प्रतियोगिता से अयोग्य (Disqualify) करना चाहते हैं? उनके अंक लीडरबोर्ड से हटा दिए जाएंगे।`)) return;

    try {
      const res = await fetch('/api/admin/contests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeContest.id, action: 'disqualify', disqualifiedUserId: userId }),
      });
      const data = await res.json();
      if (data.success) {
        alert('प्रतिभागी को अयोग्य घोषित किया गया।');
        fetchLeaderboard(activeContest.id);
      }
    } catch {
      alert('त्रुटि हुई');
    }
  };

  const totalPrizePool = (activeContest?.prizes || []).reduce((sum, p) => sum + (p.amount || 0), 0);
  const hasCertificates = (activeContest?.prizes || []).some(
    (p) => p.type === 'certificate' || p.type === 'both' || p.type === 'trophy' || Boolean(p.rewardText)
  );

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Title and Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>साप्ताहिक पत्रकार प्रतियोगिता (Weekly Journalist Contest)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            प्रतियोगिताएं बनाएं, पुरस्कार और स्कोरिंग नियम तय करें, लीडरबोर्ड की समीक्षा करें और विजेताओं की पुष्टि करें।
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ नई प्रतियोगिता बनाएं (Create Contest)</span>
        </button>
      </div>

      {/* Active Contest Highlight Card */}
      {activeContest ? (
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-2xl border-2 border-amber-300 dark:border-amber-800 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 dark:border-amber-900/60 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  activeContest.status === 'active'
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : 'bg-slate-400 text-white'
                }`}>
                  {activeContest.status === 'active' ? '● ACTIVE CONTEST' : activeContest.status.toUpperCase()}
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: {activeContest.id}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {activeContest.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
                {activeContest.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleStartEdit(activeContest)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                <span>नियम संपादित करें</span>
              </button>
              {activeContest.status === 'active' && (
                <button
                  type="button"
                  onClick={() => handleFinalizeWinners(activeContest.id)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>विजेता अंतिम करें (Finalize Winners)</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200/80 dark:border-amber-900/60 shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-medium">अवधि (Contest Period)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                {new Date(activeContest.startDate).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })} - {new Date(activeContest.endDate).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200/80 dark:border-amber-900/60 shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-medium">पुरस्कार स्वरूप (Contest Awards)</span>
              <span className="font-black text-amber-600 dark:text-amber-400 text-xs sm:text-sm block mt-0.5 truncate">
                {totalPrizePool > 0 && hasCertificates
                  ? `₹${totalPrizePool.toLocaleString('en-IN')} + ई-प्रमाणपत्र`
                  : totalPrizePool > 0
                  ? `₹${totalPrizePool.toLocaleString('en-IN')}`
                  : `📜 ई-प्रमाणपत्र व सम्मान पत्र`}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200/80 dark:border-amber-900/60 shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-medium">सक्रिय प्रतिभागी (Participants)</span>
              <span className="font-extrabold text-slate-900 dark:text-white block mt-0.5">
                {leaderboard.length} पत्रकार
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200/80 dark:border-amber-900/60 shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-medium">शीर्ष रैंक #1 स्कोर</span>
              <span className="font-extrabold text-emerald-600 block mt-0.5">
                {leaderboard[0] ? `${leaderboard[0].userName || leaderboard[0].name} (${leaderboard[0].score} pts)` : 'कोई नहीं'}
              </span>
            </div>
          </div>

          {/* Configured Scoring Rules preview */}
          <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-wrap items-center justify-between gap-3">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-amber-600" />
              सक्रिय स्कोरिंग फॉर्मूला:
            </span>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
              <span>👁 <strong>{activeContest.scoringRules?.pointsPer100Views ?? 1} pt</strong>/100 Views</span>
              <span>❤️ <strong>{activeContest.scoringRules?.pointsPerLike ?? 2} pts</strong>/Like</span>
              <span>💬 <strong>{activeContest.scoringRules?.pointsPerComment ?? 3} pts</strong>/Comment</span>
              <span>↗ <strong>{activeContest.scoringRules?.pointsPerShare ?? 4} pts</strong>/Share</span>
              <span>📰 <strong>{activeContest.scoringRules?.pointsPerPublishedReport ?? 10} pts</strong>/Report</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border text-center text-slate-400">
          कोई सक्रिय प्रतियोगिता नहीं है। ऊपर दिए गए बटन से नई प्रतियोगिता बनाएं।
        </div>
      )}

      {/* Leaderboard Review & Disqualification Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              प्रतियोगिता लीडरबोर्ड एवं प्रतिभागी समीक्षा (Live Contest Standings)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => fetchLeaderboard(activeContest?.id)}
            className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="रिफ्रेश करें"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-semibold">
            इस प्रतियोगिता में कोई योग्य भागीदारी दर्ज नहीं हुई है।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 text-center">रैंक</th>
                  <th className="py-2.5 px-3">पत्रकार (Journalist)</th>
                  <th className="py-2.5 px-3 text-center">ज़िला</th>
                  <th className="py-2.5 px-2 text-center">स्वीकृत खबरें</th>
                  <th className="py-2.5 px-2 text-center">व्यूज़</th>
                  <th className="py-2.5 px-2 text-center">लाइक्स</th>
                  <th className="py-2.5 px-2 text-center">कमेंट्स</th>
                  <th className="py-2.5 px-2 text-center">शेयर्स</th>
                  <th className="py-2.5 px-3 text-right">कुल अंक</th>
                  <th className="py-2.5 px-3 text-center">संभावित पुरस्कार</th>
                  <th className="py-2.5 px-3 text-center">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leaderboard.map((entry) => (
                  <tr key={entry.userId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 text-center font-black text-xs">
                      {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {entry.userName || entry.name}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-500 font-medium">
                      {entry.district}
                    </td>
                    <td className="py-3 px-2 text-center font-semibold">
                      {entry.publishedReportsCount ?? entry.publishedReports ?? 0}
                    </td>
                    <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-400">
                      {(entry.viewsCount ?? entry.views ?? 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-2 text-center text-red-600 font-semibold">
                      {entry.likesCount ?? entry.likes ?? 0}
                    </td>
                    <td className="py-3 px-2 text-center text-blue-600 font-semibold">
                      {entry.commentsCount ?? entry.comments ?? 0}
                    </td>
                    <td className="py-3 px-2 text-center text-emerald-600 font-semibold">
                      {entry.sharesCount ?? entry.shares ?? 0}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-amber-600 dark:text-amber-400 text-sm">
                      {entry.score.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {entry.prizeAmount && entry.prizeAmount > 0 ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-bold text-emerald-600 text-xs">
                            ₹{entry.prizeAmount.toLocaleString('en-IN')}
                          </span>
                          {entry.rewardText && (
                            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium max-w-[130px] truncate" title={entry.rewardText}>
                              + {entry.rewardText}
                            </span>
                          )}
                        </div>
                      ) : entry.rewardText || entry.prizeTitle || entry.prize ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 max-w-[150px] truncate" title={entry.rewardText || entry.prizeTitle || entry.prize}>
                            <Award className="w-3 h-3 text-amber-600 shrink-0" />
                            <span className="truncate">{entry.rewardText || entry.prizeTitle || entry.prize}</span>
                          </span>
                          {entry.certificateUrl && (
                            <a
                              href={entry.certificateUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[9px] text-blue-600 hover:underline flex items-center gap-0.5 mt-0.5"
                            >
                              <span>प्रमाणपत्र देखें</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDisqualifyParticipant(entry.userId, entry.userName || entry.name)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 transition cursor-pointer flex items-center gap-1 mx-auto"
                        title="संदिग्ध गतिविधि के कारण अयोग्य करें"
                      >
                        <Ban className="w-3 h-3" />
                        <span>अयोग्य करें</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Previous / All Contests History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>प्रतियोगिता इतिहास (Contest History & Archives)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold uppercase">
              <tr>
                <th className="py-2.5 px-3">प्रतियोगिता का नाम</th>
                <th className="py-2.5 px-3">अवधि</th>
                <th className="py-2.5 px-3 text-center">स्थिति</th>
                <th className="py-2.5 px-3">विजेता (1st Winner)</th>
                <th className="py-2.5 px-3 text-center">विजेता स्कोर</th>
                <th className="py-2.5 px-3 text-center">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {contests.map((c) => {
                const winner1 = c.winners?.find(w => w.rank === 1);
                return (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {c.title}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(c.startDate).toLocaleDateString('hi-IN')} - {new Date(c.endDate).toLocaleDateString('hi-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        c.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : c.status === 'completed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {winner1 ? `🥇 ${winner1.userName || winner1.name}` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-amber-600">
                      {winner1 ? `${winner1.score} pts` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {c.status !== 'active' && (
                          <button
                            type="button"
                            onClick={() => handleActivateContest(c.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] transition cursor-pointer"
                          >
                            सक्रिय करें
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleStartEdit(c)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT CONTEST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-600 to-amber-700 text-white">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-200" />
                <span>{editingContestId ? 'प्रतियोगिता संपादित करें' : 'नई साप्ताहिक पत्रकार प्रतियोगिता बनाएं'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveContest} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    प्रतियोगिता का नाम (Contest Name) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="उदा: Weekly Citizen Journalist Challenge"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    प्रतियोगिता विवरण (Contest Description)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="उदा: सबसे प्रभावी ज़मीनी रिपोर्ट दर्ज करें और पाठक सहभागिता से शानदार पुरस्कार जीतें।"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    आरंभ तिथि (Start Date) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    समाप्ति तिथि (End Date) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Prize Configuration */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 dark:border-amber-900/60 pb-3">
                  <div>
                    <span className="font-extrabold text-amber-900 dark:text-amber-300 block flex items-center gap-1.5 text-xs sm:text-sm">
                      <Award className="w-4 h-4 text-amber-600" />
                      पुरस्कार एवं सम्मान विन्यास (Prize & Recognition Configuration):
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      नकद राशि अनिवार्य नहीं है। आप ई-प्रमाणपत्र (Certificate), मेडल या कस्टम सम्मान तय कर सकते हैं।
                    </p>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    त्वरित पुरस्कार प्रारूप चुनें (Quick Award Preset):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setPrizesList(DEFAULT_PRIZE_TEMPLATES.certificate_only)}
                      className="px-2.5 py-2 rounded-xl text-left border text-[11px] font-bold transition flex flex-col gap-0.5 bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700 hover:bg-amber-100/50 cursor-pointer"
                    >
                      <span className="flex items-center gap-1 text-amber-900 dark:text-amber-300 font-extrabold">
                        📜 केवल ई-प्रमाणपत्र
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        मुफ्त / बिना नकद (Zero Cash)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrizesList(DEFAULT_PRIZE_TEMPLATES.cash_certificate)}
                      className="px-2.5 py-2 rounded-xl text-left border text-[11px] font-bold transition flex flex-col gap-0.5 bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                    >
                      <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300 font-extrabold">
                        🏆 नकद + प्रमाणपत्र
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        ₹ राशि + ई-सर्टिफिकेट
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrizesList(DEFAULT_PRIZE_TEMPLATES.cash_only)}
                      className="px-2.5 py-2 rounded-xl text-left border text-[11px] font-bold transition flex flex-col gap-0.5 bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                    >
                      <span className="flex items-center gap-1 text-blue-800 dark:text-blue-300 font-extrabold">
                        💰 केवल नकद राशि
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        ₹5000, ₹3000, ₹1500
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrizesList(DEFAULT_PRIZE_TEMPLATES.trophy_certificate)}
                      className="px-2.5 py-2 rounded-xl text-left border text-[11px] font-bold transition flex flex-col gap-0.5 bg-white dark:bg-slate-900 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 cursor-pointer"
                    >
                      <span className="flex items-center gap-1 text-purple-800 dark:text-purple-300 font-extrabold">
                        🎖️ मेडल व सम्मान पत्र
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        स्मृति चिन्ह व मेडल
                      </span>
                    </button>
                  </div>
                </div>

                {/* Per-Rank Prize Cards */}
                <div className="space-y-3 pt-1">
                  {prizesList.map((prize, idx) => (
                    <div
                      key={prize.rank}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{prize.rank === 1 ? '🥇' : prize.rank === 2 ? '🥈' : prize.rank === 3 ? '🥉' : '🎖️'}</span>
                          <span>रैंक #{prize.rank} पुरस्कार</span>
                        </span>

                        {/* Award Type Selector */}
                        <div className="flex items-center gap-1">
                          <label className="text-[10px] font-bold text-slate-400 mr-1">प्रकार:</label>
                          <select
                            value={prize.type}
                            onChange={(e) => {
                              const newType = e.target.value as any;
                              setPrizesList((prev) =>
                                prev.map((p, i) =>
                                  i === idx
                                    ? {
                                        ...p,
                                        type: newType,
                                        amount: newType === 'certificate' || newType === 'trophy' ? 0 : p.amount || (idx === 0 ? 5000 : idx === 1 ? 3000 : 1500),
                                        rewardText:
                                          newType === 'certificate'
                                            ? (idx === 0 ? 'सर्वश्रेष्ठ नागरिक पत्रकार ई-प्रमाणपत्र (Best Citizen Journalist Certificate)' : idx === 1 ? 'उत्कृष्ट नागरिक पत्रकार ई-प्रमाणपत्र' : 'विशेष प्रेरणा ई-प्रमाणपत्र')
                                            : newType === 'trophy'
                                            ? 'स्वर्णिम दस्तावेज़ स्मृति चिन्ह व सम्मान पत्र (Trophy & Certificate)'
                                            : p.rewardText,
                                      }
                                    : p
                                )
                              );
                            }}
                            className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                          >
                            <option value="certificate">📜 केवल ई-प्रमाणपत्र (Certificate Only)</option>
                            <option value="both">🏆 नकद + ई-प्रमाणपत्र (Cash + Certificate)</option>
                            <option value="cash">💰 केवल नकद (Cash Only)</option>
                            <option value="trophy">🎖️ ट्रॉफी/मेडल + सम्मान पत्र</option>
                            <option value="custom">🎁 विशेष सम्मान (Custom)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                        {/* Title & Reward Description */}
                        <div className={prize.type === 'certificate' || prize.type === 'trophy' ? 'sm:col-span-7 space-y-1' : 'sm:col-span-5 space-y-1'}>
                          <label className="block text-[10px] font-bold text-slate-500">
                            पुरस्कार / सम्मान नाम (Award Title / Description)
                          </label>
                          <input
                            type="text"
                            value={prize.rewardText}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPrizesList((prev) =>
                                prev.map((p, i) => (i === idx ? { ...p, rewardText: val } : p))
                              );
                            }}
                            placeholder="उदा: सर्वश्रेष्ठ नागरिक पत्रकार ई-प्रमाणपत्र"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                          />
                        </div>

                        {/* Cash Amount (if cash or both or custom) */}
                        {prize.type !== 'certificate' && prize.type !== 'trophy' ? (
                          <div className="sm:col-span-3 space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500">
                              नकद राशि (₹ Cash)
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={prize.amount}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setPrizesList((prev) =>
                                  prev.map((p, i) => (i === idx ? { ...p, amount: val } : p))
                                );
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                            />
                          </div>
                        ) : null}

                        {/* Certificate / Media Upload */}
                        <div className={prize.type === 'certificate' || prize.type === 'trophy' ? 'sm:col-span-5 space-y-1' : 'sm:col-span-4 space-y-1'}>
                          <label className="block text-[10px] font-bold text-slate-500">
                            प्रमाणपत्र / मेडल मीडिया (Media/PDF/WebP)
                          </label>
                          <div className="flex items-center gap-1.5">
                            <label
                              htmlFor={`cert-file-${prize.rank}`}
                              className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-dashed border-amber-400 bg-amber-50/60 dark:bg-amber-950/30 text-[10px] font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition cursor-pointer"
                            >
                              <UploadCloud className="w-3 h-3 text-amber-600" />
                              <span>{uploadingCertRank === prize.rank ? 'अपलोड हो रहा...' : prize.certificateUrl ? 'बदलें' : 'अपलोड करें'}</span>
                            </label>
                            <input
                              type="file"
                              id={`cert-file-${prize.rank}`}
                              accept="image/*,application/pdf"
                              className="hidden"
                              disabled={uploadingCertRank === prize.rank}
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleCertificateUpload(prize.rank, f);
                              }}
                            />
                            {prize.certificateUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPrizesList((prev) =>
                                    prev.map((p, i) => (i === idx ? { ...p, certificateUrl: '' } : p))
                                  );
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                title="हटाएं"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          {prize.certificateUrl && (
                            <a
                              href={prize.certificateUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[9px] text-emerald-600 hover:underline flex items-center gap-1 font-bold mt-0.5 truncate"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                              <span className="truncate">प्रमाणपत्र संलग्न (देखें)</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scoring System Configuration */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-extrabold text-slate-900 dark:text-white block flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4 text-blue-600" />
                  स्कोरिंग सिस्टम विन्यास (Configurable Scoring Multipliers):
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      प्रति 100 व्यूज़ अंक
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={pointsPer100Views}
                      onChange={(e) => setPointsPer100Views(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-center font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      प्रति लाइक अंक
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={pointsPerLike}
                      onChange={(e) => setPointsPerLike(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-center font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      प्रति कमेंट अंक
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={pointsPerComment}
                      onChange={(e) => setPointsPerComment(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-center font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      प्रति शेयर अंक
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={pointsPerShare}
                      onChange={(e) => setPointsPerShare(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-center font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      प्रति खबर अंक
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={pointsPerPublishedReport}
                      onChange={(e) => setPointsPerPublishedReport(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Status Choice */}
              <div className="flex items-center gap-4 pt-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  प्रारंभिक स्थिति:
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={contestStatus === 'active'}
                      onChange={() => setContestStatus('active')}
                    />
                    <span className="font-semibold text-emerald-600">सक्रिय (Active Live)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={contestStatus === 'draft'}
                      onChange={() => setContestStatus('draft')}
                    />
                    <span className="font-semibold text-slate-600">ड्राफ्ट (Draft)</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] text-white font-bold transition shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'सहेज रहे हैं...' : editingContestId ? 'अपडेट करें' : 'प्रतियोगिता प्रकाशित करें'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
