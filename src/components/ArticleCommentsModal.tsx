'use client';

import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, Trash2, ShieldCheck, User } from 'lucide-react';

interface CommentItem {
  id: string;
  articleId?: string;
  submissionId?: string;
  user: {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
  };
  text: string;
  status: string;
  createdAt: string;
}

interface ArticleCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string; // articleId or submissionId
  targetTitle: string;
  currentUser: {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
  } | null;
  onCommentCountChange?: (newCount: number) => void;
  onRequireAuth?: () => void;
}

export default function ArticleCommentsModal({
  isOpen,
  onClose,
  targetId,
  targetTitle,
  currentUser,
  onCommentCountChange,
  onRequireAuth,
}: ArticleCommentsModalProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newText, setNewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch comments when opened
  useEffect(() => {
    if (!isOpen || !targetId) return;

    setIsLoading(true);
    fetch(`/api/articles/${targetId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setComments(data.data);
          onCommentCountChange?.(data.data.length);
        }
      })
      .catch((err) => console.error('Fetch comments error:', err))
      .finally(() => setIsLoading(false));
  }, [isOpen, targetId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser) {
      onRequireAuth?.();
      return;
    }

    const trimmed = newText.trim();
    if (!trimmed || trimmed.length < 2) {
      setErrorMsg('टिप्पणी कम से कम 2 अक्षरों की होनी चाहिए।');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${targetId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: trimmed,
          user: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            avatarUrl: currentUser.avatarUrl,
            role: currentUser.role,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setComments((prev) => [data.data, ...prev]);
        setNewText('');
        onCommentCountChange?.(comments.length + 1);
      } else {
        setErrorMsg(data.message || 'टिप्पणी दर्ज करने में समस्या हुई।');
      }
    } catch {
      setErrorMsg('सर्वर से संपर्क नहीं हो सका।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/comments/${commentId}?userId=${currentUser.id}&userRole=${currentUser.role || 'reader'}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => {
          const updated = prev.filter((c) => c.id !== commentId);
          onCommentCountChange?.(updated.length);
          return updated;
        });
      }
    } catch (err) {
      console.error('Delete comment error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>पाठक टिप्पणियाँ</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  {comments.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1 max-w-xs sm:max-w-sm">
                {targetTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              टिप्पणियाँ लोड हो रही हैं...
            </div>
          ) : comments.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-1">
              <MessageSquare className="w-10 h-10 mx-auto opacity-30 text-blue-500" />
              <p className="text-xs font-semibold">इस खबर पर अभी कोई टिप्पणी नहीं है।</p>
              <p className="text-[11px] text-slate-500">पहले व्यक्ति बनें और अपनी राय साझा करें!</p>
            </div>
          ) : (
            comments.map((comment) => {
              const isOwner = currentUser?.id === comment.user.id;
              const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin' || currentUser?.role === 'editor';

              return (
                <div
                  key={comment.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                        {comment.user.avatarUrl ? (
                          <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-full h-full object-cover" />
                        ) : (
                          comment.user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {comment.user.name}
                          </span>
                          {comment.user.role === 'citizen_journalist' && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              पत्रकार
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(comment.createdAt).toLocaleDateString('hi-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {(isOwner || isAdmin) && (
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                        title="टिप्पणी हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed pl-9">
                    {comment.text}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {errorMsg && (
            <p className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
              {errorMsg}
            </p>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder={currentUser ? 'अपनी टिप्पणी या विचार लिखें...' : 'टिप्पणी करने के लिए पहले लॉगिन करें...'}
              disabled={isSubmitting}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newText.trim()}
              className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? '...' : 'भेजें'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
