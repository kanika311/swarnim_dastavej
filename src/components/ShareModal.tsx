'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { FaWhatsapp, FaFacebookF, FaXTwitter } from 'react-icons/fa6';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  articleId: string;
  userId?: string;
  onShareLogged?: (newSharesCount?: number) => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  url,
  articleId,
  userId,
  onShareLogged,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const trackShare = async (platform: string) => {
    try {
      const res = await fetch(`/api/articles/${articleId}/engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'share',
          platform,
          userId,
          sessionId: typeof window !== 'undefined' ? sessionStorage.getItem('swarnim_session_id') || undefined : undefined,
        }),
      });
      const data = await res.json();
      if (data.success && typeof data.sharesCount === 'number') {
        onShareLogged?.(data.sharesCount);
      }
    } catch (e) {
      console.warn('Share track error:', e);
    }
  };

  const handleShareClick = async (platform: 'whatsapp' | 'facebook' | 'twitter' | 'native' | 'copy') => {
    await trackShare(platform);
    const textToShare = `${title} - स्वर्णिम दस्तावेज़`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare + '\n' + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'native') {
      if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({ title, text: textToShare, url }).catch(() => {});
      }
    } else if (platform === 'copy') {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                खबर शेयर करें (Share News)
              </h3>
              <p className="text-xs text-slate-500">
                पाठकों तक पहुंचाएं और प्रतियोगिता अंक अर्जित करें
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

        {/* Article Headline Preview */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
            {title}
          </p>
        </div>

        {/* Share Channels */}
        <div className="grid grid-cols-3 gap-3">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={() => handleShareClick('whatsapp')}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <FaWhatsapp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              WhatsApp
            </span>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={() => handleShareClick('facebook')}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <FaFacebookF className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
              Facebook
            </span>
          </button>

          {/* Twitter / X */}
          <button
            type="button"
            onClick={() => handleShareClick('twitter')}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <FaXTwitter className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              X / Twitter
            </span>
          </button>
        </div>

        {/* Native Share button if supported */}
        {hasNativeShare && (
          <button
            type="button"
            onClick={() => handleShareClick('native')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-amber-600" />
            <span>मोबाइल सिस्टम शेयर (Native Share)</span>
          </button>
        )}

        {/* Copy Link Input Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-[11px] font-bold text-slate-500 mb-1">
            सीधा लिंक कॉपी करें (Copy Link)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono truncate focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleShareClick('copy')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>कॉपी हो गया!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>कॉपी</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
