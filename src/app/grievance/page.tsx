'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import { 
  ShieldCheck, 
  Scale, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  FileText, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export default function GrievancePage() {
  // Form State
  const [complainantName, setComplainantName] = useState('');
  const [complainantEmail, setComplainantEmail] = useState('');
  const [complainantPhone, setComplainantPhone] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [category, setCategory] = useState<any>('other');
  const [complaintDetails, setComplaintDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenReceived, setTokenReceived] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complainantName.trim() || !complaintDetails.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complainantName,
          complainantEmail,
          complainantPhone,
          articleUrl,
          category,
          complaintDetails
        })
      });
      const data = await res.json();
      if (data.success && data.tokenNumber) {
        setTokenReceived(data.tokenNumber);
        setComplainantName('');
        setComplainantEmail('');
        setComplainantPhone('');
        setArticleUrl('');
        setComplaintDetails('');
      }
    } catch (e) {
      alert('शिकायत दर्ज करने में समस्या आई।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <BreakingTicker />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-900 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8">
          <span className="bg-amber-400 text-slate-950 text-xs font-black uppercase px-2.5 py-0.5 rounded shadow">
            सूचना प्रौद्योगिकी नियमावली, 2021
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif mt-2">
            शिकायत निवारण तंत्र एवं वैधानिक प्रकटीकरण
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            स्वर्णिम दस्तावेज़ निष्पक्ष, उत्तरदायी और मर्यादित पत्रकारिता के लिए प्रतिबद्ध है। किसी भी समाचार से संबंधित आपत्ति अथवा शिकायत हेतु अधिकृत मंच।
          </p>
        </div>

        {/* 1. STATUTORY IMPRINT (The Press and Registration of Books Act, 1867) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm mb-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">
              प्रेस एवं पुस्तक पंजीकरण अधिनियम, 1867 के अंतर्गत घोषणा (Statutory Imprint)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 font-medium block">समाचार पत्र का नाम:</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm">स्वर्णिम दस्तावेज़ (Swarnim Dastavej)</strong>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 font-medium block">RNI पंजीयन संख्या:</span>
              <strong className="text-amber-700 dark:text-amber-400 font-mono text-sm">UPHIN/26/A7984</strong>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 font-medium block">प्रधान संपादक (Editor-in-Chief):</span>
              <strong className="text-slate-900 dark:text-slate-100">रामेश्वर दयाल (Rameshwar Dayal)</strong>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 font-medium block">मुद्रक एवं प्रकाशक (Publisher & Printer):</span>
              <strong className="text-slate-900 dark:text-slate-100">स्वर्णिम दस्तावेज़ प्रकाशन</strong>
            </div>

            <div className="sm:col-span-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 font-medium block">पंजीकृत प्रेस एवं संपादकीय कार्यालय:</span>
              <strong className="text-slate-900 dark:text-slate-100">
                स्वर्णिम दस्तावेज़ भवन, हजरतगंज, लखनऊ, उत्तर प्रदेश - 226001 (क्षेत्राधिकार: न्यायालय लखनऊ)
              </strong>
            </div>
          </div>
        </div>

        {/* 2. GRIEVANCE REDRESSAL OFFICER DETAILS (IT Rules 2021) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm mb-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Scale className="w-5 h-5 text-red-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">
              नामित शिकायत निवारण अधिकारी (Grievance Officer - Level 1)
            </h2>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            सूचना प्रौद्योगिकी (मध्यवर्ती संदर्शिका एवं डिजिटल मीडिया आचार संहिता) नियमावली, 2021 के नियम 11 के तहत पाठकों की शिकायतों की सुनवाई हेतु नियुक्त अधिकारी का विवरण निम्नवत है:
          </p>

          <div className="p-4 rounded-xl border border-red-200 dark:border-red-950/60 bg-red-50/50 dark:bg-red-950/20 text-xs space-y-2">
            <div>
              <strong className="text-slate-900 dark:text-slate-100 text-sm">श्रीमती अनुराधा अवस्थी (वरिष्ठ संपादक)</strong>
              <div className="text-slate-500">नामित शिकायत अधिकारी (Grievance Officer)</div>
            </div>
            <div className="flex flex-wrap gap-4 pt-1">
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-red-600" />
                <span>grievance@swarnimdastavej.com</span>
              </span>
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>+91 98390 67890 (कार्यालय समय: प्रातः 10 से सायं 5 बजे)</span>
              </span>
            </div>
            <div className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold pt-1">
              ⏱️ वैधानिक समयसीमा: शिकायत प्राप्ति की पावती 24 घंटे में तथा निस्तारण अधिकतम 15 कार्यदिवसों में सुनिश्चित किया जाएगा।
            </div>
          </div>
        </div>

        {/* 3. ONLINE COMPLAINT FORM */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-serif mb-4 pb-2 border-b">
            ऑनलाइन शिकायत पंजीकरण फॉर्म (Lodge a Grievance)
          </h2>

          {tokenReceived ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-6 rounded-xl text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है!
              </h3>
              <div className="inline-block bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border font-mono text-sm font-bold text-amber-600">
                टोकन संदर्भ संख्या: {tokenReceived}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                नियमानुसार शिकायत निवारण अधिकारी द्वारा 24 घंटे के भीतर पावती एवं 15 दिनों में यथोचित निर्णय लिया जाएगा। भविष्य के पत्राचार हेतु इस टोकन को सुरक्षित रखें।
              </p>
              <button
                onClick={() => setTokenReceived(null)}
                className="bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg"
              >
                अन्य शिकायत दर्ज करें
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">शिकायतकर्ता का पूरा नाम *</label>
                  <input
                    type="text"
                    value={complainantName}
                    onChange={(e) => setComplainantName(e.target.value)}
                    placeholder="आपका नाम"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">ईमेल आईडी *</label>
                  <input
                    type="email"
                    value={complainantEmail}
                    onChange={(e) => setComplainantEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">मोबाइल नंबर *</label>
                  <input
                    type="tel"
                    value={complainantPhone}
                    onChange={(e) => setComplainantPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">शिकायत की श्रेणी</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  >
                    <option value="defamation">मानहानि / अपूर्ण तथ्य</option>
                    <option value="fake_news">भ्रामक अथवा असत्य खबर</option>
                    <option value="obscenity">अश्लीलता या अभद्र सामग्री</option>
                    <option value="copyright">प्रतिलिप्याधिकार (कॉपीराइट) उल्लंघन</option>
                    <option value="other">अन्य संपादकीय आपत्ति</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">संबंधित खबर का वेब लिंक (Article URL)</label>
                <input
                  type="url"
                  value={articleUrl}
                  onChange={(e) => setArticleUrl(e.target.value)}
                  placeholder="https://swarnimdastavej.com/article/..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">शिकायत का पूर्ण विवरण (Statement of Grievance) *</label>
                <textarea
                  rows={4}
                  value={complaintDetails}
                  onChange={(e) => setComplaintDetails(e.target.value)}
                  placeholder="कृपया अपनी आपत्ति, संबंधित तथ्यात्मक साक्ष्य और वांछित संशोधन/कार्रवाई का बिंदुवार विवरण दें..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow transition"
                >
                  {isSubmitting ? 'प्रक्रियाधीन...' : 'शिकायत दर्ज करें (Submit Grievance)'}
                </button>
              </div>
            </form>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
