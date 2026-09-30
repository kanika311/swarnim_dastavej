'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { ALL_INDIA_LOCATIONS } from '@/lib/locations';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  BookOpen, 
  PenTool, 
  CheckCircle, 
  LogIn, 
  UserPlus, 
  AlertCircle
} from 'lucide-react';

export default function AuthModal() {
  const router = useRouter();
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalInitialTab, 
    authModalDefaultRole, 
    login, 
    registerUser,
    addNotification,
    currentUser,
    switchRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalInitialTab || 'login');
  
  // Registration Role: 'reader' (पाठक) | 'citizen_journalist' (नागरिक पत्रकार)
  const [selectedRole, setSelectedRole] = useState<'reader' | 'citizen_journalist'>(
    authModalDefaultRole || 'reader'
  );

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCity, setRegCity] = useState('सीतापुर');
  const [regIdType, setRegIdType] = useState('Aadhaar Card');
  const [regIdNumber, setRegIdNumber] = useState('');
  const [regError, setRegError] = useState('');

  // Sync modal props when opened
  React.useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalInitialTab || 'login');
      if (authModalDefaultRole) {
        setSelectedRole(authModalDefaultRole);
      }
      setLoginError('');
      setRegError('');
    }
  }, [isAuthModalOpen, authModalInitialTab, authModalDefaultRole]);

  if (!isAuthModalOpen) return null;

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setLoginError('कृपया मोबाइल नंबर/ईमेल और पासवर्ड दर्ज करें।');
      return;
    }

    const success = await login(loginIdentifier.trim(), loginPassword.trim());
    if (success) {
      addNotification('सफलतापूर्वक लॉगिन हो गए!');
      closeAuthModal();
      router.push('/dashboard');
    } else {
      setLoginError('अमान्य विवरण। कृपया सही मोबाइल नंबर/ईमेल व पासवर्ड दर्ज करें।');
    }
  };

  // Handle Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regPhone.trim() || !regPassword.trim()) {
      setRegError('कृपया नाम, मोबाइल नंबर और पासवर्ड अवश्य भरें।');
      return;
    }

    if (regPhone.trim().length < 10) {
      setRegError('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (selectedRole === 'citizen_journalist' && !regIdNumber.trim()) {
      setRegError('नागरिक पत्रकार सत्यापन हेतु आधार या पहचान पत्र संख्या आवश्यक है।');
      return;
    }

    try {
      const newUser = registerUser({
        name: regName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim() || `${regPhone.trim()}@swarnim.local`,
        password: regPassword.trim(),
        role: selectedRole,
        city: regCity,
        kycStatus: selectedRole === 'citizen_journalist' ? 'verified' : 'not_submitted',
        kycDetails: selectedRole === 'citizen_journalist' ? {
          idProofType: regIdType,
          idNumber: regIdNumber.trim(),
          submittedAt: new Date().toISOString(),
          district: regCity
        } : undefined
      });

      addNotification(`बधाई हो ${newUser.name}! आपका ${selectedRole === 'citizen_journalist' ? 'नागरिक पत्रकार' : 'पाठक'} खाता सक्रिय हो गया है।`);
      closeAuthModal();
      router.push('/dashboard');
    } catch (err: any) {
      setRegError(err?.message || 'पंजीकरण में त्रुटि हुई।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-red-700 via-red-800 to-amber-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center border-2 border-amber-300 shrink-0 shadow-xs overflow-hidden">
              <Image
                src="/logo.png?v=4"
                alt="स्वर्णिम दस्तावेज़"
                width={40}
                height={40}
                className="w-full h-full object-contain rounded-full"
                unoptimized
              />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">स्वर्णिम दस्तावेज़</h3>
              <p className="text-[11px] text-amber-200">सत्य • साहस • जनसरोकार</p>
            </div>
          </div>
          <button 
            onClick={closeAuthModal}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
            aria-label="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 px-4 text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'login'
                ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>लॉगिन (Login)</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 px-4 text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'register'
                ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>नया पंजीकरण (Register)</span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5">
          {currentUser && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3.5 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <span className="text-slate-500 block text-[10px]">वर्तमान में सक्रिय आईडी (Already Logged In):</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{currentUser.name}</span>
                <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold block">
                  भूमिका: {currentUser.role === 'citizen_journalist' ? '✍️ नागरिक पत्रकार' : currentUser.role === 'admin' ? '🛡️ प्रधान संपादक / एडमिन' : '📖 सामान्य पाठक'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {currentUser.role === 'reader' && (
                  <button
                    type="button"
                    onClick={() => {
                      switchRole('citizen_journalist');
                      addNotification('आप नागरिक पत्रकार मोड में आ गए हैं!');
                      closeAuthModal();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-700 text-white font-bold text-xs shadow-xs hover:bg-red-800 transition cursor-pointer"
                  >
                    ✍️ पत्रकार मोड सक्रिय करें
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  जारी रखें
                </button>
              </div>
            </div>
          )}

          {activeTab === 'login' ? (
            /* ================= LOGIN TAB ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  मोबाइल नंबर या ईमेल आईडी
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="उदा: 9889012345 या user@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  पासवर्ड (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="अपना पासवर्ड डालें"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>लॉगिन करें</span>
              </button>
            </form>
          ) : (
            /* ================= REGISTER TAB ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* ROLE SELECTION CARDS (2 CLEAR ROLES: READER VS CITIZEN JOURNALIST) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  अपनी भूमिका चुनें (Select Account Type):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Option 1: General Reader (पाठक) */}
                  <div
                    onClick={() => setSelectedRole('reader')}
                    className={`cursor-pointer p-3 rounded-xl border-2 transition relative flex flex-col justify-between ${
                      selectedRole === 'reader'
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        {selectedRole === 'reader' && (
                          <CheckCircle className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        सामान्य पाठक (User)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                        ताज़ा समाचार, आज का ई-पेपर और वीडियो देखें।
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                      • निशुल्क पठन व वीडियो
                    </div>
                  </div>

                  {/* Option 2: Citizen Journalist (नागरिक पत्रकार) */}
                  <div
                    onClick={() => setSelectedRole('citizen_journalist')}
                    className={`cursor-pointer p-3 rounded-xl border-2 transition relative flex flex-col justify-between ${
                      selectedRole === 'citizen_journalist'
                        ? 'border-red-600 bg-red-50/50 dark:bg-red-950/20 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 flex items-center justify-center">
                          <PenTool className="w-4 h-4" />
                        </div>
                        {selectedRole === 'citizen_journalist' && (
                          <CheckCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        नागरिक पत्रकार (Journalist)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                        ज़मीनी स्तर की खबरें, फोटो व वीडियो रिपोर्ट दर्ज करें।
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] text-red-700 dark:text-red-400 font-semibold">
                      • खबर सबमिशन व सत्यापन
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    पूरा नाम (Full Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="उदा: रमेश चंद्र"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    मोबाइल नंबर (Mobile No) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10 अंकों का फोन नंबर"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ईमेल आईडी (वैकल्पिक)
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    पासवर्ड (Password) *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="गोपनीय पासवर्ड"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  शहर / जिला (City / District - All India) *
                </label>
                <select
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <optgroup label="प्रमुख शहर (Featured Cities)">
                    <option value="सीतापुर">सीतापुर (Sitapur)</option>
                    <option value="लखनऊ">लखनऊ (Lucknow)</option>
                    <option value="कानपुर">कानपुर (Kanpur)</option>
                    <option value="अयोध्या">अयोध्या (Ayodhya)</option>
                    <option value="वाराणसी">वाराणसी (Varanasi)</option>
                    <option value="प्रयागराज">प्रयागराज (Prayagraj)</option>
                    <option value="नई दिल्ली">नई दिल्ली (New Delhi)</option>
                    <option value="नोएडा">नोएडा (Noida / NCR)</option>
                    <option value="पटना">पटना (Patna)</option>
                    <option value="भोपाल">भोपाल (Bhopal)</option>
                    <option value="मुंबई">मुंबई (Mumbai)</option>
                  </optgroup>
                  {ALL_INDIA_LOCATIONS.map((state) => (
                    <optgroup key={state.name} label={`${state.name} (${state.nameHi})`}>
                      {state.cities.map((city) => (
                        <option key={city.name} value={city.nameHi}>
                          {city.nameHi} ({city.name})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="अन्य">✍️ अन्य (Other City / Town)</option>
                </select>
              </div>

              {/* CITIZEN JOURNALIST SPECIFIC VERIFICATION FIELDS */}
              {selectedRole === 'citizen_journalist' && (
                <div className="p-3.5 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 dark:text-red-300">
                    <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                    <span>नागरिक पत्रकार सत्यापन (KYC Verification Details)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    फेक न्यूज़ से बचाव हेतु नागरिक पत्रकार का पहचान सत्यापन आवश्यक है।
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        आईडी प्रमाण पत्र (ID Proof Type)
                      </label>
                      <select
                        value={regIdType}
                        onChange={(e) => setRegIdType(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="Aadhaar Card">आधार कार्ड (Aadhaar)</option>
                        <option value="Voter ID">मतदाता पहचान पत्र (Voter ID)</option>
                        <option value="Press ID">प्रेस / पत्रकार कार्ड</option>
                        <option value="Driving License">ड्राइविंग लाइसेंस</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        पहचान पत्र संख्या (ID Number) *
                      </label>
                      <input
                        type="text"
                        required
                        value={regIdNumber}
                        onChange={(e) => setRegIdNumber(e.target.value)}
                        placeholder="उदा: XXXX-XXXX-4589"
                        className="w-full px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {selectedRole === 'citizen_journalist' ? 'नागरिक पत्रकार के रूप में रजिस्टर करें' : 'पाठक खाता बनाएं'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
