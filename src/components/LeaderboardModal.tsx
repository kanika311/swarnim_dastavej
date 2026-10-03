'use client';

import React, { useState } from 'react';
import { X, Trophy, Award, Medal, Info, Users, Sparkles, CheckCircle2, ExternalLink } from 'lucide-react';
import { LeaderboardEntry, WeeklyContest } from '@/types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  contest: WeeklyContest | null;
  leaderboard: LeaderboardEntry[];
  currentUserId?: string;
}

export default function LeaderboardModal({
  isOpen,
  onClose,
  contest,
  leaderboard,
  currentUserId,
}: LeaderboardModalProps) {
  const [showRules, setShowRules] = useState(false);

  if (!isOpen) return null;

  const scoringRules = contest?.scoringRules || {
    pointsPer100Views: 1,
    pointsPerLike: 2,
    pointsPerComment: 3,
    pointsPerShare: 4,
    pointsPerPublishedReport: 10,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20">
              <Trophy className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-serif tracking-tight">
                🏆 साप्ताहिक नागरिक पत्रकार लीडरबोर्ड
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                {contest?.title || 'Weekly Citizen Journalist Challenge'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contest Info & Prizes Bar */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Prizes list */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-amber-900 dark:text-amber-300 mr-1 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-600" /> पुरस्कार एवं सम्मान:
            </span>
            {contest?.prizes?.map((p) => {
              const hasCash = typeof p.amount === 'number' && p.amount > 0;
              const hasRewardText = Boolean(p.rewardText);
              return (
                <span
                  key={p.rank}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 font-bold text-slate-800 dark:text-slate-100 shadow-2xs flex items-center gap-1"
                >
                  <span>{p.icon || (p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : '🥉')}</span>
                  <span>Rank #{p.rank}:</span>
                  {hasCash && <span className="font-black text-emerald-600">₹{Number(p.amount || 0).toLocaleString('en-IN')}</span>}
                  {hasCash && hasRewardText && <span>+</span>}
                  {hasRewardText && <span className="text-amber-700 dark:text-amber-300 font-semibold">{p.rewardText}</span>}
                  {!hasCash && !hasRewardText && <span>{p.title}</span>}
                </span>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowRules(!showRules)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-bold hover:bg-amber-100 transition cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showRules ? 'नियम छुपाएं' : 'अंक गणना नियम'}</span>
          </button>
        </div>

        {/* Collapsible Rules Explainer */}
        {showRules && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs space-y-2 animate-in slide-in-from-top-2 duration-150">
            <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              आधिकारिक स्कोर गणना सूत्र (Server Scoring Formula):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 font-semibold text-slate-700 dark:text-slate-300">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border">
                👁 Views: <span className="text-amber-600 font-bold">{scoringRules.pointsPer100Views} अंक</span> / 100 व्यूज़
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border">
                ❤️ Likes: <span className="text-red-600 font-bold">{scoringRules.pointsPerLike} अंक</span> / लाइक
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border">
                💬 Comments: <span className="text-blue-600 font-bold">{scoringRules.pointsPerComment} अंक</span> / टिप्पणी
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border">
                ↗ Shares: <span className="text-emerald-600 font-bold">{scoringRules.pointsPerShare} अंक</span> / शेयर
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border col-span-2 sm:col-span-1">
                📰 Report: <span className="text-purple-600 font-bold">{scoringRules.pointsPerPublishedReport} अंक</span> / स्वीकृत खबर
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table / Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Users className="w-12 h-12 mx-auto opacity-30 text-amber-600" />
              <p className="font-bold">इस प्रतियोगिता में अभी कोई प्रतिभागी नहीं है।</p>
              <p className="text-xs">अपनी पहली खबर प्रकाशित कराएं और लीडरबोर्ड पर पहले स्थान पर आएं!</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-3 sm:px-4 text-center">रैंक</th>
                    <th className="py-3 px-3 sm:px-4">पत्रकार (Journalist)</th>
                    <th className="py-3 px-3 sm:px-4 text-center">ज़िला</th>
                    <th className="py-3 px-2 sm:px-3 text-center">रिपोर्ट्स</th>
                    <th className="py-3 px-2 sm:px-3 text-center">व्यूज़</th>
                    <th className="py-3 px-2 sm:px-3 text-center">लाइक्स</th>
                    <th className="py-3 px-2 sm:px-3 text-center">कमेंट्स</th>
                    <th className="py-3 px-2 sm:px-3 text-center">शेयर्स</th>
                    <th className="py-3 px-3 sm:px-4 text-right">कुल अंक (Score)</th>
                    <th className="py-3 px-3 sm:px-4 text-center">पुरस्कार</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {leaderboard.map((entry) => {
                    const isCurrentUser = entry.userId === currentUserId;
                    const isTopThree = entry.rank <= 3;

                    return (
                      <tr
                        key={entry.userId}
                        className={`transition ${
                          isCurrentUser
                            ? 'bg-amber-100/70 dark:bg-amber-950/50 font-bold border-l-4 border-amber-600'
                            : isTopThree
                            ? 'bg-amber-50/30 dark:bg-slate-900/60'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3 px-3 sm:px-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-xs ${
                              entry.rank === 1
                                ? 'bg-amber-400 text-slate-950 shadow-sm'
                                : entry.rank === 2
                                ? 'bg-slate-300 text-slate-900'
                                : entry.rank === 3
                                ? 'bg-amber-700 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                          </span>
                        </td>

                        {/* Journalist Name & Avatar */}
                        <td className="py-3 px-3 sm:px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 border border-amber-300">
                              {entry.avatarUrl ? (
                                <img src={entry.avatarUrl} alt={entry.userName || entry.name} className="w-full h-full object-cover" />
                              ) : (
                                (entry.userName || entry.name || 'U').charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                                {entry.userName || entry.name}
                                {isCurrentUser && (
                                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-red-600 text-white uppercase font-black">
                                    YOU
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* District */}
                        <td className="py-3 px-3 sm:px-4 text-center text-slate-600 dark:text-slate-400 font-medium">
                          {entry.district || 'सीतापुर'}
                        </td>

                        {/* Stats */}
                        <td className="py-3 px-2 sm:px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                          {entry.publishedReportsCount ?? entry.publishedReports ?? 0}
                        </td>
                        <td className="py-3 px-2 sm:px-3 text-center text-slate-600 dark:text-slate-400">
                          {(entry.viewsCount ?? entry.views ?? 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-2 sm:px-3 text-center text-red-600 font-semibold">
                          {entry.likesCount ?? entry.likes ?? 0}
                        </td>
                        <td className="py-3 px-2 sm:px-3 text-center text-blue-600 font-semibold">
                          {entry.commentsCount ?? entry.comments ?? 0}
                        </td>
                        <td className="py-3 px-2 sm:px-3 text-center text-emerald-600 font-semibold">
                          {entry.sharesCount ?? entry.shares ?? 0}
                        </td>

                        {/* Score */}
                        <td className="py-3 px-3 sm:px-4 text-right">
                          <span className="font-black text-amber-700 dark:text-amber-400 text-sm">
                            {entry.score.toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Prize */}
                        <td className="py-3 px-3 sm:px-4 text-center">
                          {entry.prizeAmount && entry.prizeAmount > 0 ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
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
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 max-w-[160px] truncate" title={entry.rewardText || entry.prizeTitle || entry.prize}>
                                <Award className="w-3 h-3 text-amber-600 shrink-0" />
                                <span className="truncate">{entry.rewardText || entry.prizeTitle || entry.prize}</span>
                              </span>
                              {entry.certificateUrl && (
                                <a
                                  href={entry.certificateUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 mt-0.5 font-bold"
                                >
                                  <span>📜 प्रमाणपत्र देखें</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            कुल सक्रिय पत्रकार प्रतिभागी: <strong className="text-slate-900 dark:text-white">{leaderboard.length}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold transition cursor-pointer"
          >
            बंद करें (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
