'use client';

import React, { useState } from 'react';
import { Poll } from '@/types';
import { CheckCircle2, Vote } from 'lucide-react';

interface PollWidgetProps {
  initialPoll: Poll;
}

export default function PollWidget({ initialPoll }: PollWidgetProps) {
  const [poll, setPoll] = useState<Poll>(initialPoll);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async () => {
    if (!selectedOption || hasVoted) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId: selectedOption })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPoll(data.data);
        setHasVoted(true);
      }
    } catch (err) {
      // Fallback local vote calculation
      setPoll((prev) => {
        const updatedOptions = prev.options.map((opt) => 
          opt.id === selectedOption ? { ...opt, votes: opt.votes + 1 } : opt
        );
        return {
          ...prev,
          totalVotes: prev.totalVotes + 1,
          options: updatedOptions
        };
      });
      setHasVoted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      <div className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-400 mb-2 uppercase tracking-wider">
        <Vote className="w-4 h-4" />
        <span>आज का सवाल (स्वर्णिम जनमत पोल)</span>
      </div>

      <h4 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 mb-4 leading-snug">
        {poll.questionHi}
      </h4>

      <div className="space-y-2.5 mb-4">
        {poll.options.map((opt) => {
          const percent = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
          return (
            <div
              key={opt.id}
              onClick={() => !hasVoted && setSelectedOption(opt.id)}
              className={`p-3 rounded-lg border text-xs md:text-sm font-medium transition cursor-pointer relative overflow-hidden ${
                selectedOption === opt.id
                  ? 'border-red-600 bg-red-50/50 dark:bg-red-950/20'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              {/* Progress bar fill if voted */}
              {hasVoted && (
                <div
                  className="absolute inset-y-0 left-0 bg-red-600/15 dark:bg-red-500/20 transition-all duration-700"
                  style={{ width: `${percent}%` }}
                ></div>
              )}

              <div className="relative flex items-center justify-between z-10">
                <span className="text-slate-800 dark:text-slate-200">{opt.textHi}</span>
                {hasVoted && (
                  <span className="font-extrabold text-red-700 dark:text-red-400 ml-2">
                    {percent}% ({opt.votes})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!hasVoted ? (
        <button
          onClick={handleVote}
          disabled={!selectedOption || isSubmitting}
          className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-lg shadow transition"
        >
          {isSubmitting ? 'वोट दर्ज हो रहा है...' : 'अपनी राय दर्ज करें (Vote Now)'}
        </button>
      ) : (
        <div className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1.5 py-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>धन्यवाद! आपकी राय शामिल कर ली गई है (कुल वोट: {poll.totalVotes})</span>
        </div>
      )}
    </div>
  );
}
