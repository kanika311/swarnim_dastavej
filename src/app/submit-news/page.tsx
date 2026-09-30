'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import { useApp } from '@/context/AppContext';
import { TOPICS } from '@/components/TopicsSidebar';
import { CitizenSubmission, ArticleCategory, MediaItem } from '@/types';
import { INITIAL_SUBMISSIONS } from '@/lib/initialData';
import { ALL_INDIA_LOCATIONS } from '@/lib/locations';
import { 
  PenSquare, 
  Video, 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  StopCircle, 
  Play, 
  X,
  History,
  Send
} from 'lucide-react';

export default function SubmitNewsPage() {
  const { currentUser, openAuthModal, switchRole } = useApp();
  const [activeTab, setActiveTab] = useState<'submit' | 'my_submissions'>('submit');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // Form State
  const [headline, setHeadline] = useState('');
  const [subHeadline, setSubHeadline] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('state-city');
  const [selectedState, setSelectedState] = useState<string>('Uttar Pradesh');
  const [city, setCity] = useState(currentUser?.city || 'सीतापुर');
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCity, setCustomCity] = useState('');
  const [locationName, setLocationName] = useState('कलेक्ट्रेट परिसर');
  const [bodyText, setBodyText] = useState('');
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [photoCaption, setPhotoCaption] = useState('');
  const [uploadingKind, setUploadingKind] = useState<'image' | 'video' | null>(null);
  const [uploadError, setUploadError] = useState('');
  
  // MediaRecorder / Video recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  // Submissions list
  const [submissions, setSubmissions] = useState<CitizenSubmission[]>(INITIAL_SUBMISSIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState<string | null>(null);

  // Fetch live submissions
  const startEdit = (sub: CitizenSubmission) => {
    setEditingId(sub.id);
    setHeadline(sub.headline || '');
    setSubHeadline(sub.subHeadline || '');
    setBodyText(sub.body || '');
    setCategory(sub.category || 'state-city');
    setCity(sub.city || 'सीतापुर');
    setLocationName(sub.geoTag?.locationName || '');
    setPhotos(sub.media || []);
    setActiveTab('submit');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'mine') setActiveTab('my_submissions');
    const editId = params.get('edit');
    if (editId) setHighlightId(editId);
  }, []);

  useEffect(() => {
    fetch('/api/submissions')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSubmissions(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Video recording simulation / capture
  const startRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).catch(() => null);
        if (videoPreviewRef.current && stream) {
          videoPreviewRef.current.srcObject = stream;
          videoPreviewRef.current.play();
        }
      }
    } catch (e) {}

    setIsRecording(true);
    setRecordSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    // Stop tracks if camera was opened
    if (videoPreviewRef.current && videoPreviewRef.current.srcObject) {
      const stream = videoPreviewRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoPreviewRef.current.srcObject = null;
    }
    // Set a captured video dummy URL or recorded blob
    setRecordedVideoUrl('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
  };

  const handleMediaUpload = async (file: File | undefined, kind: 'image' | 'video') => {
    if (!file) return;
    if (kind === 'image' && !file.type.startsWith('image/')) {
      setUploadError('कृपया फोटो फ़ाइल चुनें।');
      return;
    }
    if (kind === 'video' && !file.type.startsWith('video/')) {
      setUploadError('कृपया वीडियो फ़ाइल चुनें।');
      return;
    }
    try {
      setUploadingKind(kind);
      setUploadError('');
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!data.success || !data.url) {
        setUploadError(data.message || 'अपलोड नहीं हो सका।');
        return;
      }
      setPhotos(prev => [
        ...prev,
        {
          id: `${kind}-${Date.now()}`,
          type: kind,
          url: data.url,
          caption: photoCaption.trim() || (kind === 'video' ? 'संलग्न वीडियो' : 'संलग्न फोटोग्राफ')
        }
      ]);
      setPhotoCaption('');
    } catch {
      setUploadError('अपलोड नहीं हो सका। फिर कोशिश करें।');
    } finally {
      setUploadingKind(null);
    }
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (!headline.trim() || !bodyText.trim()) {
      alert('कृपया शीर्षक और खबर का विवरण भरें।');
      return;
    }

    setIsSubmitting(true);
    const finalCity = (isCustomCity && customCity.trim()) ? customCity.trim() : city;
    const payload = {
      headline: headline.trim(),
      subHeadline: subHeadline.trim(),
      body: bodyText.trim(),
      category,
      city: finalCity,
      language: 'hi',
      submittedBy: {
        id: currentUser?.id || 'citizen_guest',
        name: currentUser?.name || 'नागरिक पत्रकार',
        role: 'citizen_journalist',
        district: city
      },
      media: [
        ...photos,
        ...(recordedVideoUrl ? [{ id: `vid-live-${Date.now()}`, type: 'video' as const, url: recordedVideoUrl, caption: 'रिकॉर्डेड वीडियो' }] : [])
      ],
      hasRecordedVideo: photos.some((item) => item.type === 'video') || !!recordedVideoUrl,
      geoTag: {
        locationName: locationName.trim(),
        coordinates: '27.5684, 80.6829'
      },
      status: isDraft ? 'draft' : 'pending_review'
    };

    try {
      const revising = Boolean(editingId) && !isDraft;
      const res = await fetch('/api/submissions', {
        method: revising ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(revising ? { ...payload, id: editingId, action: 'revise' } : payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSubmissions(prev => revising
          ? prev.map((item) => item.id === data.data.id ? data.data : item)
          : [data.data, ...prev]);
        if (currentUser?.role === 'reader') {
          switchRole('citizen_journalist');
        }
        setSubmissionSuccessMsg(
          isDraft
            ? 'खबर ड्राफ्ट के रूप में सहेज ली गई है।'
            : revising
              ? 'संशोधित खबर दोबारा समीक्षा हेतु भेज दी गई है।'
              : 'आपकी खबर संपादकीय समीक्षा कक्ष में सफलतापूर्वक दर्ज हो गई है (स्थिति: समीक्षाधीन)। एडमिन द्वारा अनुमोदन (Approval) के बाद ही यह मुख्य पृष्ठ पर लाइव दिखेगी।'
        );
        setHeadline('');
        setSubHeadline('');
        setBodyText('');
        setPhotos([]);
        setRecordedVideoUrl(null);
        setEditingId(null);
        setActiveTab('my_submissions');
      }
    } catch (err) {
      alert('खबर सबमिट करने में समस्या आई।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return { label: 'समीक्षाधीन (Pending Review)', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'approved':
        return { label: 'स्वीकृत एवं प्रकाशित (Approved & Published)', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'sent_back':
        return { label: 'संशोधन अपेक्षित (Sent Back)', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'rejected':
        return { label: 'अस्वीकृत (Rejected)', bg: 'bg-red-100 text-red-900 border-red-300' };
      case 'draft':
        return { label: 'प्रारूप (Draft)', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const ownSubmissions = currentUser
    ? submissions.filter((sub) =>
        sub.submittedBy?.id === currentUser.id ||
        Boolean(currentUser.name && sub.submittedBy?.name?.includes(currentUser.name))
      )
    : submissions;
  const visibleSubmissions = ownSubmissions.length > 0 ? ownSubmissions : submissions;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <BreakingTicker />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-red-700 via-red-800 to-amber-700 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="bg-amber-400 text-slate-950 text-xs font-black uppercase px-2.5 py-0.5 rounded shadow">
                स्वर्णिम दूत पत्रकारिता नेटवर्क
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif mt-2">
                नागरिक पत्रकारिता एवं संवाददाता पोर्टल
              </h1>
              <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-2xl leading-relaxed">
                अपने शहर, गांव या कस्बे की समस्याएं, जनहित की खबरें और ग्राउंड रिपोर्ट सीधे स्वर्णिम दस्तावेज़ संपादकीय मंडल को भेजें।
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs shrink-0">
              <div className="font-bold text-amber-300">वर्तमान प्रयोक्ता:</div>
              <div className="font-semibold text-white">{currentUser ? currentUser.name : 'अतिथि (लॉगिन नहीं)'}</div>
              <div className="text-[11px] text-amber-200">
                भूमिका: {currentUser ? (currentUser.role === 'citizen_journalist' ? 'नागरिक पत्रकार' : currentUser.role === 'admin' ? 'एडमिन' : 'पाठक') : 'अतिथि'}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('submit')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'submit'
                ? 'border-red-700 text-red-700 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <PenSquare className="w-4 h-4" />
            <span>नई खबर भेजें (Submit News)</span>
          </button>

          <button
            onClick={() => setActiveTab('my_submissions')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'my_submissions'
                ? 'border-red-700 text-red-700 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>मेरी भेजी गई खबरें एवं स्थिति ({visibleSubmissions.length})</span>
          </button>
        </div>

        {/* TAB 1: SUBMISSION FORM */}
        {activeTab === 'submit' && editingId && (
          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            संपादक की टिप्पणी के अनुसार खबर सुधार रहे हैं। भेजने पर यह फिर समीक्षा में चली जाएगी।
          </div>
        )}

        {activeTab === 'submit' && (
          !currentUser ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm text-center max-w-2xl mx-auto space-y-4 my-6">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 flex items-center justify-center mx-auto">
                <PenSquare className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                नागरिक पत्रकारिता एवं संवाददाता पोर्टल
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                स्वर्णिम दस्तावेज़ पर अपने शहर, ब्लॉक या गांव की जनसमस्याएं और ग्राउंड रिपोर्ट भेजने के लिए कृपया लॉगिन करें या तुरंत नागरिक पत्रकार के रूप में जुड़ें।
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => switchRole('citizen_journalist')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
                >
                  ⚡ 1-क्लिक नागरिक पत्रकार लॉगिन (विकास शुक्ला)
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  लॉगिन करें
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register', 'citizen_journalist')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  नया पंजीकरण
                </button>
              </div>
            </div>
          ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            
            {currentUser && (
              <div className="mb-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 p-3.5 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    आप <strong>{currentUser.name}</strong> के रूप में लॉगिन हैं। आपकी रिपोर्ट सीधे संपादकीय डेस्क को जाएगी।
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 shadow-xs transition text-center"
                >
                  पत्रकार डैशबोर्ड खोलें →
                </Link>
              </div>
            )}

            {submissionSuccessMsg && (
              <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">सफलतापूर्वक प्रेषित!</h4>
                  <p>{submissionSuccessMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
              
              {/* Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  खबर का मुख्य शीर्षक (Headline) *
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="उदा: सीतापुर-लहरपुर मार्ग पर पुलिया धंसने से 20 गांवों का संपर्क टूटा"
                  className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none font-medium"
                  required
                />
              </div>

              {/* Sub-headline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  उप-शीर्षक (Sub-headline / Standfirst)
                </label>
                <input
                  type="text"
                  value={subHeadline}
                  onChange={(e) => setSubHeadline(e.target.value)}
                  placeholder="उदा: स्कूल जाने वाली छात्राओं को भारी परेशानी, ग्रामीणों ने खुद बनाया अस्थायी रास्ता"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              {/* Category, State, District & Landmark Pickers (All India) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    श्रेणी (Category) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                  >
                    {TOPICS.filter((topic) => topic.id !== 'all').map((topic) => (
                      <option key={topic.id} value={topic.id}>{topic.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    राज्य / प्रदेश (State) *
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      const newState = e.target.value;
                      setSelectedState(newState);
                      const foundState = ALL_INDIA_LOCATIONS.find(s => s.name === newState);
                      if (foundState && foundState.cities.length > 0) {
                        setCity(foundState.cities[0].nameHi);
                        setIsCustomCity(false);
                      }
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-medium focus:ring-1 focus:ring-red-600 focus:outline-none"
                  >
                    {ALL_INDIA_LOCATIONS.map((st) => (
                      <option key={st.name} value={st.name}>
                        {st.name} ({st.nameHi})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    ज़िला / शहर (District/City) *
                  </label>
                  <select
                    value={isCustomCity ? 'OTHER' : city}
                    onChange={(e) => {
                      if (e.target.value === 'OTHER') {
                        setIsCustomCity(true);
                      } else {
                        setIsCustomCity(false);
                        setCity(e.target.value);
                      }
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-medium focus:ring-1 focus:ring-red-600 focus:outline-none"
                  >
                    {(() => {
                      const curStateObj = ALL_INDIA_LOCATIONS.find(s => s.name === selectedState) || ALL_INDIA_LOCATIONS[0];
                      return (
                        <>
                          {curStateObj.cities.map((c) => (
                            <option key={c.name} value={c.nameHi}>
                              {c.nameHi} ({c.name})
                            </option>
                          ))}
                          <option value="OTHER">✍️ अन्य शहर / कस्बा (Type Custom City)</option>
                        </>
                      );
                    })()}
                  </select>
                  {isCustomCity && (
                    <input
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="अपने शहर/कस्बे का नाम लिखें"
                      className="mt-1.5 w-full p-2 rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-red-600"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    स्थान / चौराहा (Geo-tag Landmark)
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="उदा: महोली रोड, मानपुर चौराहा"
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Rich Body Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  खबर का संपूर्ण विवरण (Detailed Body Text) *
                </label>
                <textarea
                  rows={7}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="घटना कब और कहाँ घटी? कौन-कौन शामिल हैं? स्थानीय लोगों का क्या कहना है? संबंधित अधिकारियों का क्या वक्तव्य है? विस्तार से लिखें..."
                  className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-red-600 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              {/* MEDIA ATTACHMENTS (FR-SUB-02 & FR-SUB-03) */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/40">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-500" />
                  <span>तस्वीरें एवं वीडियो प्रमाण संलग्न करें (Media Attachments)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={photoCaption}
                      onChange={(e) => setPhotoCaption(e.target.value)}
                      placeholder="कैप्शन (वैकल्पिक)"
                      className="w-full p-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <label className="sm:col-span-4 bg-slate-800 text-white font-bold text-xs py-2 rounded hover:bg-slate-700 transition text-center cursor-pointer">
                    {uploadingKind === 'image' ? 'फोटो WebP बन रही है...' : 'फोटो चुनें'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingKind !== null}
                      onChange={(e) => {
                        handleMediaUpload(e.target.files?.[0], 'image');
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <label className="sm:col-span-4 bg-red-700 text-white font-bold text-xs py-2 rounded hover:bg-red-800 transition text-center cursor-pointer">
                    {uploadingKind === 'video' ? 'वीडियो कंप्रेस हो रहा है...' : 'वीडियो चुनें'}
                    <input
                      type="file"
                      accept="video/*,.mp4,.mov,.webm"
                      className="hidden"
                      disabled={uploadingKind !== null}
                      onChange={(e) => {
                        handleMediaUpload(e.target.files?.[0], 'video');
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
                {uploadError && (
                  <p className="mb-3 text-xs font-semibold text-red-600">{uploadError}</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {photos.map((p) => (
                    <div key={p.id} className="relative aspect-video rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 group bg-black">
                      {p.type === 'video' ? (
                        <video src={p.url} className="w-full h-full object-cover" controls playsInline />
                      ) : (
                        <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[10px] text-white p-1 truncate pointer-events-none">
                        {p.type === 'video' ? 'वीडियो' : 'फोटो'}{p.caption ? ` · ${p.caption}` : ''}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(p.id)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* IN-BROWSER VIDEO RECORDER (FR-SUB-03) */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-red-600" />
                      <span>कैमरा वीडियो रिकॉर्डर (Live MediaRecorder Capture)</span>
                    </span>
                    {isRecording && (
                      <span className="text-xs font-mono font-bold text-red-600 animate-pulse flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                        REC: 00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1.5 shadow transition"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>कैमरा शुरू कर वीडियो रिकॉर्ड करें</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1.5 shadow transition"
                      >
                        <StopCircle className="w-3.5 h-3.5 text-red-400" />
                        <span>रिकॉर्डिंग रोकें व संलग्न करें</span>
                      </button>
                    )}

                    {recordedVideoUrl && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        वीडियो रिकॉर्डिंग तैयार है (00:{recordSeconds || 12} सेकंड)
                      </span>
                    )}
                  </div>

                  {/* Hidden video element for live camera stream */}
                  <video ref={videoPreviewRef} className={`mt-2 w-48 aspect-video rounded bg-black ${isRecording ? 'block' : 'hidden'}`} muted />
                </div>

              </div>

              {/* Submit / Draft Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isSubmitting}
                  className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs px-4 py-2.5 rounded-lg transition"
                >
                  ड्राफ्ट सहेजें (Save as Draft)
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-md flex items-center gap-2 transition active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'प्रेषित हो रहा है...' : editingId ? 'संशोधन भेजें' : 'संपादकीय समीक्षा हेतु भेजें (Submit News)'}</span>
                </button>
              </div>

            </form>
          </div>
          )
        )}

        {/* TAB 2: MY SUBMISSIONS STATUS TRACKER */}
        {activeTab === 'my_submissions' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  आपकी खबरों की वर्तमान स्थिति (Editorial Review Status)
                </h3>
                <p className="text-xs text-slate-500">
                  हर खबर संपादकीय समीक्षा से गुजरती है। स्थिति में बदलाव होने पर यहाँ विवरण दिखेगा।
                </p>
              </div>
              <button
                onClick={() => setActiveTab('submit')}
                className="bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-800"
              >
                + नई खबर लिखें
              </button>
            </div>

            {visibleSubmissions.map((sub) => {
              const badge = getStatusBadge(sub.status);
              return (
                <div
                  key={sub.id}
                  className={`bg-white dark:bg-slate-800 rounded-xl p-5 border shadow-sm space-y-3 ${
                    highlightId === sub.id
                      ? 'border-amber-500 ring-2 ring-amber-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      प्रेषित: {new Date(sub.submittedAt).toLocaleString('hi-IN')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {sub.headline}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                    {sub.body}
                  </p>

                  {/* Editor Feedback / Rejection Notes (FR-APR-03) */}
                  {sub.editorComments && (
                    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg p-3 text-xs text-amber-900 dark:text-amber-200">
                      <div className="font-bold flex items-center gap-1.5 mb-1">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>संपादक की टिप्पणी (Editor Feedback):</span>
                      </div>
                      <p>{sub.editorComments}</p>
                      {sub.reviewedBy && (
                        <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-1">
                          समीक्षक: {sub.reviewedBy}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submission Audit Trail */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>श्रेणी: {TOPICS.find((topic) => topic.id === sub.category)?.label || sub.category}</span>
                      <span>•</span>
                      <span>ज़िला: {sub.city}</span>
                      {sub.hasRecordedVideo && (
                        <>
                          <span>•</span>
                          <span className="text-red-600 font-bold">वीडियो संलग्न</span>
                        </>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">ID: {sub.id}</span>
                  </div>
                  {sub.status === 'sent_back' && (
                    <button
                      type="button"
                      onClick={() => startEdit(sub)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                    >
                      खबर सुधारें (Edit)
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
