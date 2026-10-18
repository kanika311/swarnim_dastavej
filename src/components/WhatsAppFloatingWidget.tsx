'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  RiWhatsappFill, 
  RiCloseLine, 
  RiMessage3Fill, 
  RiUserFollowFill, 
  RiExternalLinkLine 
} from 'react-icons/ri';
import { SiteSettings } from '@/types';

export default function WhatsAppFloatingWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    whatsappNumber: '+91 95196 231111',
    whatsappUrl: 'https://whatsapp.com/channel/0029Vb9Vh4s3rZZlaVJwQq15'
  });

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setSettings((prev) => ({ ...prev, ...d.data }));
        }
      })
      .catch(() => {});
  }, []);

  // Do not show widget on admin dashboard
  if (pathname && pathname.startsWith('/raviadminmishra')) {
    return null;
  }

  // Clean phone number for wa.me link: remove non-digits
  const rawNumber = settings.whatsappNumber || '+91 95196 231111';
  let cleanNumber = rawNumber.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    cleanNumber = `91${cleanNumber}`;
  }

  const directMessageUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'नमस्ते स्वर्णिम दस्तावेज़, मुझे समाचार प्रकाशन / विज्ञापन / ई-पेपर के संबंध में जानकारी चाहिए।'
  )}`;

  const communityUrl = settings.whatsappUrl || 'https://whatsapp.com/channel/0029Vb9Vh4s3rZZlaVJwQq15';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end select-none font-sans">
      {/* Expanded Popup Window */}
      {isOpen && (
        <div 
          className="mb-3 w-[330px] sm:w-[360px] bg-white dark:bg-[#0E2038] rounded-2xl shadow-2xl border border-emerald-500/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 transition-all"
          role="dialog"
          aria-label="WhatsApp Support and Community"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#25D366] text-white p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center shrink-0 border border-white/40">
                  <Image
                    src="/logo.png?v=4"
                    alt="स्वर्णिम दस्तावेज़"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain rounded-full"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                    <span>स्वर्णिम दस्तावेज़</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  </h4>
                  <p className="text-[11px] text-emerald-100 font-medium">
                    व्हाट्सएप सहायता एवं कम्युनिटी
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="बंद करें (Close)"
              >
                <RiCloseLine className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2.5 text-[11px] bg-black/15 text-emerald-50 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              ⚡ सामान्यतः कुछ ही मिनटों में प्रत्युत्तर (Instant Reply)
            </div>
          </div>

          {/* Body Options */}
          <div className="p-3.5 space-y-3 bg-[#F0F2F5]/60 dark:bg-[#0A192F]">
            {/* Option 1: Direct Message on WhatsApp */}
            <a
              href={directMessageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-xl bg-white dark:bg-[#132A4A] border border-emerald-500/30 hover:border-[#25D366] hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-all shadow-xs">
                  <RiMessage3Fill className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      सीधे व्हाट्सएप संदेश भेजें
                    </span>
                    <RiExternalLinkLine className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5 leading-snug">
                    समाचार, विज्ञापन या पूछताछ हेतु सीधे चैट करें
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    <span>{rawNumber}</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Option 2: Join WhatsApp Community / Channel */}
            <a
              href={communityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 border border-[#25D366]/40 hover:border-[#25D366] hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#128C7E] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <RiUserFollowFill className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      व्हाट्सएप कम्युनिटी फॉलो करें
                    </span>
                    <span className="text-[9px] uppercase font-extrabold bg-[#25D366] text-white px-1.5 py-0.5 rounded">
                      Official
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5 leading-snug">
                    ताज़ा ब्रेकिंग न्यूज़ और ई-पेपर अपडेट्स तुरंत व्हाट्सएप पर प्राप्त करें
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#128C7E] dark:text-emerald-400">
                    <span>चैनल से जुड़ें</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* Footer note */}
          <div className="px-3.5 py-2 bg-white dark:bg-[#0E2038] border-t border-slate-100 dark:border-slate-800 text-[10px] text-center text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
            <span>🔒 100% सुरक्षित संवाद • स्वर्णिम दस्तावेज़</span>
          </div>
        </div>
      )}

      {/* Floating Toggle Button (Circular without written text) */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setHasInteracted(true);
        }}
        aria-label="WhatsApp Support and Community"
        title="WhatsApp पर संदेश भेजें या कम्युनिटी से जुड़ें"
        className="relative w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[#20bd5a] to-[#25D366] hover:from-[#1daa51] hover:to-[#20bd5a] text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-white dark:border-slate-800 group"
      >
        {isOpen ? (
          <RiCloseLine className="w-7 h-7 text-white transition-transform duration-200" />
        ) : (
          <RiWhatsappFill className="w-8 h-8 text-white drop-shadow-sm group-hover:rotate-6 transition-transform duration-200" />
        )}

        {/* Pulsating Ping Dot */}
        {!hasInteracted && !isOpen && (
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white" />
          </span>
        )}
      </button>
    </div>
  );
}
