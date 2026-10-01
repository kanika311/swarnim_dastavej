'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, LanguageCode, EPaperEdition, EPaperPricingPlan } from '@/types';
import { INITIAL_USERS, INITIAL_EPAPER_EDITIONS, INITIAL_PRICING_PLANS } from '@/lib/initialData';
import { getTranslation, Language } from '@/lib/translations';

interface AppContextType {
  currentUser: User | null;
  sessionReady: boolean;
  setCurrentUser: (user: User | null) => void;
  usersList: User[];
  login: (identifier: string, password?: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (userData: Partial<User>) => User;
  updateCurrentUser: (updates: Partial<User>) => void;
  switchRole: (role: UserRole) => void;

  // Translation helper
  t: (key: string) => string;

  // Auth Modal State
  isAuthModalOpen: boolean;
  authModalInitialTab: 'login' | 'register';
  authModalDefaultRole: 'reader' | 'citizen_journalist';
  openAuthModal: (tab?: 'login' | 'register', defaultRole?: 'reader' | 'citizen_journalist') => void;
  closeAuthModal: () => void;

  // App Settings
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  fontSize: 'sm' | 'base' | 'lg';
  setFontSize: (size: 'sm' | 'base' | 'lg') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  savedArticleIds: string[];
  toggleSaveArticle: (id: string) => void;
  notifications: string[];
  addNotification: (msg: string) => void;
  
  // E-Paper state & functions
  epaperEditions: EPaperEdition[];
  addOrUpdateEdition: (edition: EPaperEdition) => void;
  deleteEdition: (id: string) => void;

  // E-Paper Pricing Plans & Unlocking
  pricingPlans: EPaperPricingPlan[];
  addOrUpdatePricingPlan: (plan: EPaperPricingPlan) => void;
  deletePricingPlan: (id: string) => void;
  unlockedEpaperKeys: string[];
  unlockEPaper: (key: string | string[], planTitle?: string) => void;
  isEPaperUnlocked: (editionId?: string, date?: string) => boolean;

  // View Mode: 'epaper' | 'news' (Default: 'news' for Live News First)
  homeViewMode: 'epaper' | 'news';
  setHomeViewMode: (mode: 'epaper' | 'news') => void;

  // Dynamic Site Last Updated Date & Time
  lastUpdatedTime: string;
  recordUpdate: (date?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Registered users state with localStorage support
  const [usersList, setUsersList] = useState<User[]>(INITIAL_USERS);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  // Auth modal control
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register'>('login');
  const [authModalDefaultRole, setAuthModalDefaultRole] = useState<'reader' | 'citizen_journalist'>('reader');

  // App settings
  const [language, setLanguage] = useState<LanguageCode>('hi');
  const [selectedCity, setSelectedCity] = useState<string>('सभी शहर');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [themeReady, setThemeReady] = useState(false);
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([
    'लखनऊ-सीतापुर एक्सप्रेसवे को कैबिनेट मंजूरी: बड़ी खबर',
    'स्वर्णिम दस्तावेज़ डिजिटल पोर्टल पर आपका स्वागत है।'
  ]);

  // E-Paper editions state (with localStorage caching)
  const [epaperEditions, setEpaperEditions] = useState<EPaperEdition[]>(INITIAL_EPAPER_EDITIONS);

  // Default view mode: 'news' (Live News First on Homepage as requested!)
  const [homeViewMode, setHomeViewMode] = useState<'epaper' | 'news'>('news');

  // E-Paper Pricing Plans state (with localStorage caching & API sync)
  const [pricingPlans, setPricingPlans] = useState<EPaperPricingPlan[]>(INITIAL_PRICING_PLANS);

  // Unlocked E-Paper keys: e.g. ['all'] for monthly/yearly or ['2026-09-30', 'epaper-123'] for single editions
  const [unlockedEpaperKeys, setUnlockedEpaperKeys] = useState<string[]>([]);

  // Dynamic Site Last Updated Date & Time
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('swarnim_last_update') || new Date().toISOString();
    }
    return new Date().toISOString();
  });

  const recordUpdate = (date?: string) => {
    const now = date || new Date().toISOString();
    setLastUpdatedTime(now);
    try {
      localStorage.setItem('swarnim_last_update', now);
      window.dispatchEvent(new CustomEvent('swarnim_site_updated', { detail: now }));
    } catch {}
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'swarnim_last_update' && e.newValue) {
        setLastUpdatedTime(e.newValue);
      }
    };
    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setLastUpdatedTime(customEvent.detail);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('swarnim_site_updated', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('swarnim_site_updated', handleCustom);
    };
  }, []);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      // Load saved users list
      const savedUsers = localStorage.getItem('swarnim_users_list');
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsersList(parsed);
        }
      }

      // Load active user
      const savedActiveUser = localStorage.getItem('swarnim_current_user');
      if (savedActiveUser) {
        const parsedUser = JSON.parse(savedActiveUser);
        if (parsedUser && parsedUser.id) {
          setCurrentUser(parsedUser);
        }
      }

      // Load epaper editions from local storage then sync with server
      const savedEditions = localStorage.getItem('swarnim_epaper_editions');
      if (savedEditions) {
        const parsed = JSON.parse(savedEditions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((e: EPaperEdition) => e.id));
          const missing = INITIAL_EPAPER_EDITIONS.filter(e => !existingIds.has(e.id));
          const updated = [...parsed, ...missing].sort((a, b) => b.date.localeCompare(a.date));
          setEpaperEditions(updated);
        }
      }

      // Sync latest E-Paper editions from MongoDB / API
      fetch('/api/epaper')
        .then(res => res.json())
        .then(d => {
          if (d.success && Array.isArray(d.data) && d.data.length > 0) {
            const serverList: EPaperEdition[] = d.data.map((ed: any) => ({
              id: ed.id,
              date: ed.date,
              editionCity: ed.editionCity,
              editionTitle: ed.editionTitle || ed.title || `${ed.editionCity} Daily Edition`,
              language: ed.language || 'hi',
              pagesCount: ed.totalPageCount || ed.pagesCount || ed.pages?.length || 6,
              thumbnailUrl: ed.thumbnailUrl,
              pdfUrl: ed.pdfUrl || ed.pages?.[0]?.pdfPageUrl || ed.pages?.[0]?.pdfUrl,
              isActive: ed.isActive !== false,
              pages: ed.pages?.map((p: any) => ({
                pageNumber: p.pageNumber,
                title: p.title,
                imageUrl: p.imageUrl,
                pdfUrl: p.pdfUrl || p.pdfPageUrl || ed.pdfUrl
              })) || []
            }));

            setEpaperEditions(prev => {
              const serverIds = new Set(serverList.map(e => e.id));
              const localOnly = prev.filter(e => !serverIds.has(e.id));
              const merged = [...serverList, ...localOnly].sort((a, b) => b.date.localeCompare(a.date));
              try {
                localStorage.setItem('swarnim_epaper_editions', JSON.stringify(merged));
              } catch (e) {}
              return merged;
            });
          }
        })
        .catch(() => {});

      // Load pricing plans from localStorage or API
      const savedPricing = localStorage.getItem('swarnim_pricing_plans');
      if (savedPricing) {
        const parsed = JSON.parse(savedPricing);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPricingPlans(parsed);
        }
      } else {
        fetch('/api/pricing?all=true')
          .then(res => res.json())
          .then(d => {
            if (d.success && Array.isArray(d.data) && d.data.length > 0) {
              setPricingPlans(d.data);
            }
          })
          .catch(() => {});
      }

      // Load unlocked epapers
      const savedUnlocked = localStorage.getItem('swarnim_unlocked_epapers');
      if (savedUnlocked) {
        const parsed = JSON.parse(savedUnlocked);
        if (Array.isArray(parsed)) {
          setUnlockedEpaperKeys(parsed);
        }
      }

      // Load saved language
      const savedLang = localStorage.getItem('swarnim_language');
      if (savedLang === 'hi' || savedLang === 'en' || savedLang === 'ur') {
        setLanguage(savedLang);
      }
    } catch (e) {}
    setSessionReady(true);
  }, []);

  const handleSetLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    try {
      localStorage.setItem('swarnim_language', lang);
    } catch (e) {}
  };

  const t = (key: string): string => {
    return getTranslation(language as Language, key);
  };

  const openAuthModal = (
    tab: 'login' | 'register' = 'login', 
    defaultRole: 'reader' | 'citizen_journalist' = 'reader'
  ) => {
    setAuthModalInitialTab(tab);
    setAuthModalDefaultRole(defaultRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (identifier: string, password?: string): Promise<boolean> => {
    const cleanId = identifier.trim().toLowerCase();
    const phoneDigits = cleanId.replace(/\D/g, '');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password: password || '' })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentUser(data.data);
        try {
          localStorage.setItem('swarnim_current_user', JSON.stringify(data.data));
        } catch (e) {}
        return true;
      }
      if (res.status === 401 || res.status === 403) {
        return false;
      }
    } catch (e) {}

    const found = usersList.find(u =>
      u.email.toLowerCase() === cleanId ||
      (u.phone && phoneDigits.length >= 10 && u.phone.replace(/\D/g, '') === phoneDigits)
    );

    if (found) {
      if (found.isBanned) return false;
      const staff = found.role === 'admin' || found.role === 'super_admin' || found.role === 'editor';
      if (staff) {
        if (!found.password || found.password !== (password || '')) return false;
      } else if (found.password && found.password !== (password || '')) {
        return false;
      }
      const { password: _password, ...session } = found;
      setCurrentUser(session);
      try {
        localStorage.setItem('swarnim_current_user', JSON.stringify(session));
      } catch (e) {}
      return true;
    }

    // Fallback: if user is not in list but identifier looks valid, create a session
    const fallbackUser: User = {
      id: `user-${Date.now()}`,
      name: identifier.includes('@') ? identifier.split('@')[0] : `उपयोगकर्ता ${identifier.slice(-4)}`,
      email: identifier.includes('@') ? identifier : `${identifier}@swarnim.local`,
      phone: identifier.includes('@') ? undefined : identifier,
      role: 'reader',
      city: 'सीतापुर',
      preferredLanguage: 'hi'
    };
    setCurrentUser(fallbackUser);
    try {
      localStorage.setItem('swarnim_current_user', JSON.stringify(fallbackUser));
    } catch (e) {}
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('swarnim_current_user');
    } catch (e) {}
    addNotification('आप सफलतापूर्वक लॉगआउट हो गए हैं।');
  };

  const registerUser = (userData: Partial<User>): User => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name || 'उपयोगकर्ता',
      email: userData.email || `user_${Date.now()}@swarnim.local`,
      phone: userData.phone,
      password: userData.password,
      role: userData.role || 'reader',
      city: userData.city || 'सीतापुर',
      preferredLanguage: userData.preferredLanguage || 'hi',
      kycStatus: userData.kycStatus || (userData.role === 'citizen_journalist' ? 'verified' : 'not_submitted'),
      kycDetails: userData.kycDetails
    };

    const updatedList = [newUser, ...usersList];
    setUsersList(updatedList);
    setCurrentUser(newUser);

    try {
      localStorage.setItem('swarnim_users_list', JSON.stringify(updatedList));
      localStorage.setItem('swarnim_current_user', JSON.stringify(newUser));
    } catch (e) {}

    return newUser;
  };

  const switchRole = (role: UserRole) => {
    const found = usersList.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      try {
        localStorage.setItem('swarnim_current_user', JSON.stringify(found));
      } catch (e) {}
    } else if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      try {
        localStorage.setItem('swarnim_current_user', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsersList(prev => prev.map(u => u.id === updated.id ? updated : u));
    try {
      localStorage.setItem('swarnim_current_user', JSON.stringify(updated));
      localStorage.setItem('swarnim_users_list', JSON.stringify(usersList.map(u => u.id === updated.id ? updated : u)));
    } catch (e) {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('swarnim_theme');
      if (saved === 'dark' || document.documentElement.classList.contains('dark')) {
        setIsDarkMode(true);
      }
    } catch (e) {}
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
    try {
      localStorage.setItem('swarnim_theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {}
  }, [isDarkMode, themeReady]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      document.documentElement.style.colorScheme = next ? 'dark' : 'light';
      try {
        localStorage.setItem('swarnim_theme', next ? 'dark' : 'light');
      } catch (e) {}
      return next;
    });
  };

  const toggleSaveArticle = (id: string) => {
    setSavedArticleIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev]);
  };

  const addOrUpdateEdition = (edition: EPaperEdition) => {
    setEpaperEditions(prev => {
      const existsIndex = prev.findIndex(
        e => e.id === edition.id || 
        (e.date === edition.date && e.editionCity === edition.editionCity && (e.language || 'hi') === (edition.language || 'hi'))
      );
      let updated: EPaperEdition[];
      if (existsIndex >= 0) {
        updated = [...prev];
        updated[existsIndex] = edition;
      } else {
        updated = [edition, ...prev];
      }
      updated.sort((a, b) => b.date.localeCompare(a.date));
      try {
        localStorage.setItem('swarnim_epaper_editions', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const deleteEdition = (id: string) => {
    setEpaperEditions(prev => {
      const updated = prev.filter(e => e.id !== id);
      try {
        localStorage.setItem('swarnim_epaper_editions', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const addOrUpdatePricingPlan = (plan: EPaperPricingPlan) => {
    setPricingPlans(prev => {
      const idx = prev.findIndex(p => p.id === plan.id);
      let updated: EPaperPricingPlan[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = plan;
      } else {
        updated = [...prev, plan];
      }
      try {
        localStorage.setItem('swarnim_pricing_plans', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      }).catch(() => {});
    } catch {}
  };

  const deletePricingPlan = (id: string) => {
    setPricingPlans(prev => {
      const updated = prev.filter(p => p.id !== id);
      try {
        localStorage.setItem('swarnim_pricing_plans', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      fetch(`/api/pricing?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
    } catch {}
  };

  const unlockEPaper = (key: string | string[], planTitle?: string) => {
    const keys = (Array.isArray(key) ? key : [key]).filter(Boolean);
    setUnlockedEpaperKeys(prev => {
      const next = [...prev];
      for (const item of keys) {
        if (!next.includes(item)) next.push(item);
      }
      try {
        localStorage.setItem('swarnim_unlocked_epapers', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    addNotification(
      language === 'en'
        ? `E-Paper successfully unlocked! (${planTitle || 'Payment Successful'})`
        : `ई-पेपर सफलतापूर्वक अनलॉक हुआ! (${planTitle || 'सफल भुगतान'})`
    );
  };

  const isEPaperUnlocked = (editionId?: string, date?: string): boolean => {
    // Staff/admin roles always have full free access
    if (
      currentUser?.role === 'admin' ||
      currentUser?.role === 'super_admin' ||
      currentUser?.role === 'editor' ||
      currentUser?.role === 'staff_reporter'
    ) {
      return true;
    }

    if (unlockedEpaperKeys.includes('all')) return true;
    if (editionId && unlockedEpaperKeys.includes(editionId)) return true;
    if (date && unlockedEpaperKeys.includes(date)) return true;

    return false;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        sessionReady,
        setCurrentUser,
        usersList,
        login,
        logout,
        registerUser,
        updateCurrentUser,
        switchRole,
        t,
        isAuthModalOpen,
        authModalInitialTab,
        authModalDefaultRole,
        openAuthModal,
        closeAuthModal,
        language,
        setLanguage: handleSetLanguage,
        selectedCity,
        setSelectedCity,
        fontSize,
        setFontSize,
        isDarkMode,
        toggleDarkMode,
        savedArticleIds,
        toggleSaveArticle,
        notifications,
        addNotification,
        epaperEditions,
        addOrUpdateEdition,
        deleteEdition,
        pricingPlans,
        addOrUpdatePricingPlan,
        deletePricingPlan,
        unlockedEpaperKeys,
        unlockEPaper,
        isEPaperUnlocked,
        homeViewMode,
        setHomeViewMode,
        lastUpdatedTime,
        recordUpdate
      }}
    >
      <div className={`${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} min-h-screen transition-colors duration-200`}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
