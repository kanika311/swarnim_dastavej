'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CitizenSubmission } from '@/types';
import { Bell, X } from 'lucide-react';

function isMine(sub: CitizenSubmission, userId?: string, userName?: string) {
  if (sub.submittedBy?.id && userId && sub.submittedBy.id === userId) return true;
  if (userName && sub.submittedBy?.name?.includes(userName)) return true;
  return false;
}

export default function RevertNotice() {
  const { currentUser } = useApp();
  const [items, setItems] = useState<CitizenSubmission[]>([]);
  const [popup, setPopup] = useState<CitizenSubmission | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!currentUser) {
      setItems([]);
      return;
    }
    let cancelled = false;
    fetch('/api/submissions')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.success || !Array.isArray(data.data)) return;
        const mine = (data.data as CitizenSubmission[]).filter(
          (sub) => sub.status === 'sent_back' && isMine(sub, currentUser.id, currentUser.name)
        );
        setItems(mine);
        const seen = new Set<string>();
        try {
          const raw = sessionStorage.getItem('swarnim_revert_popup_seen');
          if (raw) JSON.parse(raw).forEach((id: string) => seen.add(id));
        } catch {
          // ignore
        }
        const fresh = mine.find((sub) => !seen.has(sub.id));
        if (fresh) setPopup(fresh);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const dismissPopup = () => {
    if (!popup) return;
    try {
      const raw = sessionStorage.getItem('swarnim_revert_popup_seen');
      const ids = raw ? JSON.parse(raw) : [];
      sessionStorage.setItem('swarnim_revert_popup_seen', JSON.stringify([...ids, popup.id]));
    } catch {
      // ignore
    }
    setPopup(null);
  };

  if (!currentUser || items.length === 0) return null;

  return (
    <>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="relative p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
          aria-label="वापस भेजी खबरें"
          title="संपादक ने खबर वापस भेजी है"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
            {items.length}
          </span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-2 py-1.5 text-[11px] font-bold text-slate-500">संपादक ने ये खबरें वापस भेजीं</div>
            {items.map((sub) => (
              <Link
                key={sub.id}
                href={`/submit-news?tab=mine&edit=${sub.id}`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2.5 py-2 hover:bg-amber-50 dark:hover:bg-slate-800"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{sub.headline}</div>
                <div className="text-[11px] text-amber-800 dark:text-amber-300 line-clamp-2">{sub.editorComments || 'संशोधन करके दोबारा भेजें'}</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {popup && (
        <div
          className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) dismissPopup();
          }}
        >
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-amber-200 p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">संपादक ने खबर वापस भेजी</h3>
              <button type="button" onClick={dismissPopup} className="text-slate-400 hover:text-slate-700" aria-label="बंद करें">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{popup.headline}</p>
            <p className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 rounded-lg p-3">
              {popup.editorComments || 'और विवरण जोड़कर खबर दोबारा भेजें।'}
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={dismissPopup} className="px-3 py-2 text-xs font-bold rounded-lg border">
                बाद में
              </button>
              <Link
                href={`/submit-news?tab=mine&edit=${popup.id}`}
                onClick={dismissPopup}
                className="px-3 py-2 text-xs font-bold rounded-lg bg-red-700 text-white"
              >
                खबर सुधारें
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
