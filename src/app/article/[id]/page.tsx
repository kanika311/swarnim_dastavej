'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import { Article } from '@/types';
import Link from 'next/link';
import { 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark, 
  Volume2, 
  MessageSquare, 
  MapPin, 
  Send,
  ArrowLeft,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ShareModal from '@/components/ShareModal';

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params?.id as string;
  const { fontSize, savedArticleIds, toggleSaveArticle, currentUser, openAuthModal } = useApp();

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [articleMissing, setArticleMissing] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [comments, setComments] = useState<Array<{ id: string; name: string; text: string; time: string }>>([]);
  const [newComment, setNewComment] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Load article & log view with deduplication
  useEffect(() => {
    const fetchArticleData = async () => {
      let currentArt: Article | null = null;
      try {
        const res = await fetch(`/api/articles/${articleId}`);
        const data = await res.json();
        if (data.success && data.data) {
          currentArt = data.data;
          setArticle(data.data);
          setLikes(data.data.likesCount);
          setArticleMissing(false);
        } else {
          setArticle(null);
          setArticleMissing(true);
        }
      } catch {
        setArticle(null);
        setArticleMissing(true);
      }

      const targetId = currentArt?.id || articleId;

      // 1. Register View with server-side deduplication
      fetch(`/api/articles/${targetId}/engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'view', userId: currentUser?.id }),
      }).catch(() => {});

      // 2. Fetch live engagement & user like status
      fetch(`/api/articles/${targetId}/engagement?userId=${currentUser?.id || ''}`)
        .then(r => r.json())
        .then(d => {
          if (d.success && d.data) {
            setLikes(d.data.likesCount);
            setHasLiked(d.data.userHasLiked);
          }
        })
        .catch(() => {});

      // 3. Fetch real comments
      fetch(`/api/articles/${targetId}/comments`)
        .then(r => r.json())
        .then(d => {
          if (d.success && Array.isArray(d.data)) {
            setComments(d.data.map((c: any) => ({
              id: c.id,
              name: c.user?.name || 'पाठक',
              text: c.text,
              time: new Date(c.createdAt).toLocaleDateString('hi-IN', {
                month: 'short',
                day: 'numeric'
              })
            })));
          }
        })
        .catch(() => {});
    };

    fetchArticleData();
  }, [articleId, currentUser?.id]);

  const handleLike = async () => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    const targetId = article?.id || articleId;
    const prevLiked = hasLiked;
    const prevLikes = likes;

    setHasLiked(!prevLiked);
    setLikes(prevLiked ? Math.max(0, prevLikes - 1) : prevLikes + 1);

    try {
      const res = await fetch(`/api/articles/${targetId}/engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', userId: currentUser.id }),
      });
      const data = await res.json();
      if (data.success) {
        setHasLiked(data.liked);
        setLikes(data.likesCount);
      }
    } catch {
      setHasLiked(prevLiked);
      setLikes(prevLikes);
    }
  };

  const handleShare = (platform?: string) => {
    if (!platform) {
      setIsShareModalOpen(true);
      return;
    }
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = encodeURIComponent(`${article?.headline || ''} - स्वर्णिम दस्तावेज़`);
    const encUrl = encodeURIComponent(currentUrl);

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${shareText}%20${encUrl}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${encUrl}`, '_blank');
    } else {
      setIsShareModalOpen(true);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    const targetId = article?.id || articleId;
    try {
      const res = await fetch(`/api/articles/${targetId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newComment.trim(),
          user: {
            id: currentUser.id,
            name: currentUser.name || commenterName || 'पाठक',
            email: currentUser.email,
            avatarUrl: currentUser.avatarUrl,
            role: currentUser.role,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setComments(prev => [
          {
            id: data.data.id,
            name: data.data.user.name,
            text: data.data.text,
            time: 'अभी-अभी'
          },
          ...prev
        ]);
        setNewComment('');
      }
    } catch {}
  };

  const handleAudioListen = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && article) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const textToSpeak = `${article.headline}. ${article.subHeadline || ''}. ${article.body}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'hi-IN';
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  useEffect(() => {
    if (!article) return;
    fetch(`/api/articles?lang=${article.language || 'hi'}`)
      .then((res) => res.json())
      .then((data) => {
        const list: Article[] = data.success && Array.isArray(data.data) ? data.data : [];
        setRelatedArticles(list.filter((item) => item.id !== article.id).slice(0, 3));
      })
      .catch(() => setRelatedArticles([]));
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-slate-500">{articleMissing ? 'यह खबर उपलब्ध नहीं है।' : 'खबर लोड हो रही है...'}</p>
        </main>
        <Footer />
      </div>
    );
  }
  const fontClass = fontSize === 'lg' ? 'text-lg leading-relaxed' : fontSize === 'sm' ? 'text-sm leading-normal' : 'text-base leading-relaxed';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BreakingTicker />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-red-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>मुख्य पृष्ठ</span>
          </Link>
          <span>/</span>
          <Link href={`/category/${article.category}`} className="hover:text-red-700 capitalize">
            {article.category === 'sitapur' ? 'सीतापुर' : article.category === 'lucknow' ? 'लखनऊ' : article.category === 'state' ? 'उत्तर प्रदेश' : article.category}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">
            {article.headline}
          </span>
        </div>

        {/* Article Container */}
        <article className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm mb-10">
          
          {/* Category & Location Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-red-700 text-white font-bold text-xs px-2.5 py-1 rounded shadow">
              {article.category === 'sitapur' ? 'सीतापुर विशेष' : article.category === 'lucknow' ? 'लखनऊ हलचल' : article.category === 'state' ? 'उत्तर प्रदेश' : article.category}
            </span>
            <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-2.5 py-1 rounded flex items-center gap-1 border border-slate-200 dark:border-slate-600">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>{article.city}</span>
            </span>
            {article.isSponsored && (
              <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-xs font-extrabold px-2.5 py-1 rounded">
                प्रायोजित आलेख (SPONSORED)
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-serif leading-tight mb-3">
            {article.headline}
          </h1>

          {/* Sub-headline */}
          {article.subHeadline && (
            <h2 className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-snug mb-5 border-l-4 border-amber-500 pl-3">
              {article.subHeadline}
            </h2>
          )}

          {/* Reporter Byline & Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-100 dark:border-slate-700 mb-6 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-red-700 text-white font-bold flex items-center justify-center text-sm shadow">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm flex items-center gap-1.5">
                  <span>{article.author.name}</span>
                  {article.author.role === 'citizen_journalist' && (
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-amber-300">
                      सत्यापित नागरिक पत्रकार
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  प्रकाशित: {new Date(article.publishedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })} | {article.readingTimeMinutes} मिनट पठन
                </div>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAudioListen}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-100'
                }`}
                title="पूरी खबर सुनें (Audio Playback)"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingAudio ? 'रुकें' : 'खबर सुनें'}</span>
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                title="व्हाट्सएप पर शेयर करें"
              >
                💬
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 transition"
                title="X / ट्विटर पर शेयर करें"
              >
                🐦
              </button>
              <button
                onClick={() => handleShare()}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
                title="लिंक कॉपी करें"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {(() => {
            const videoUrl = article.mediaGallery?.find((item) => item.type === 'video')?.url;
            if (videoUrl) {
              return (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-6 bg-black shadow">
                  <video
                    src={videoUrl}
                    poster={article.coverImage}
                    controls
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                </div>
              );
            }
            return (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-6 bg-slate-900 shadow">
                <img
                  src={article.coverImage}
                  alt={article.headline}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-[11px]">
                  तस्वीर: {article.headline} - स्वर्णिम दस्तावेज़ डेस्क
                </div>
              </div>
            );
          })()}

          {/* Article Body Content */}
          <div className={`prose dark:prose-invert max-w-none ${fontClass} text-slate-800 dark:text-slate-200 space-y-4 mb-8 whitespace-pre-line`}>
            {article.body}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-700 mb-6">
            <span className="text-xs font-bold text-slate-500 mr-1">टैग्स:</span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Bar (Like, Bookmark, Views) */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  hasLiked 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : 'text-red-600'}`} />
                <span>{likes} पसंद</span>
              </button>

              <button
                onClick={() => toggleSaveArticle(article.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition ${
                  savedArticleIds.includes(article.id) ? 'text-red-600 font-extrabold' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${savedArticleIds.includes(article.id) ? 'fill-red-600' : ''}`} />
                <span>सहेजें (Save)</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
              <Eye className="w-4 h-4" />
              <span>कुल पाठक: {article.viewsCount.toLocaleString('hi-IN')}</span>
            </div>
          </div>

        </article>

        {/* COMMENTS SECTION */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm mb-10">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-700 pb-3">
            <MessageSquare className="w-5 h-5 text-red-600" />
            <span>पाठकों की प्रतिक्रियाएं ({comments.length})</span>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8 space-y-3 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={commenterName}
                onChange={(e) => setCommenterName(e.target.value)}
                placeholder="आपका नाम (Your Name)"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                required
              />
            </div>
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="इस खबर पर अपनी मर्यादित टिप्पणी लिखें..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-600"
              required
            />
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>टिप्पणी पोस्ट करें</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/30"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center text-[10px] font-bold">
                      {c.name.charAt(0)}
                    </span>
                    {c.name}
                  </span>
                  <span className="text-[10px] text-slate-400">{c.time}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-7">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* RELATED ARTICLES */}
        <section>
          <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-100 mb-4 border-b-2 border-red-700 pb-1 inline-block">
            अन्य संबंधित खबरें
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/article/${rel.id}`}
                className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-red-500 transition group"
              >
                <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-2 bg-slate-900">
                  <img
                    src={rel.coverImage}
                    alt={rel.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {rel.city}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-700 line-clamp-2">
                  {rel.headline}
                </h4>
              </Link>
            ))}
          </div>
        </section>

      </main>

      {isShareModalOpen && article && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title={article.headline}
          url={typeof window !== 'undefined' ? window.location.href : ''}
          articleId={article.id}
          userId={currentUser?.id}
          onShareLogged={(newShares) => {
            if (typeof newShares === 'number') {
              setArticle(prev => prev ? { ...prev, sharesCount: newShares } : null);
            }
          }}
        />
      )}

      <Footer />
    </div>
  );
}
