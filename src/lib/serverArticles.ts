import { connectToDatabase } from '@/lib/mongodb';
import ArticleModel from '@/models/Article';
import { platformStore } from '@/lib/store';
import { isSeedArticle, SEED_ARTICLE_IDS } from '@/lib/initialData';
import { Article } from '@/types';
import type { Metadata } from 'next';
import { cleanExcerpt } from '@/lib/textCleaners';

export function serializeArticle(doc: any): Article {
  return {
    id: String(doc.id || ''),
    slug: String(doc.slug || doc.id || ''),
    headline: String(doc.headline || ''),
    subHeadline: doc.subHeadline ? String(doc.subHeadline) : undefined,
    body: String(doc.body || ''),
    excerpt: cleanExcerpt(doc.excerpt || doc.body || '', 150),
    category: (doc.category || 'state') as Article['category'],
    city: String(doc.city || ''),
    language: (doc.language || 'hi') as Article['language'],
    coverImage: String(doc.coverImage || ''),
    mediaGallery: Array.isArray(doc.mediaGallery)
      ? doc.mediaGallery.map((m: any) => ({
          id: String(m.id || ''),
          type: m.type === 'video' ? ('video' as const) : ('image' as const),
          url: String(m.url || ''),
          caption: m.caption ? String(m.caption) : undefined,
        }))
      : undefined,
    author: {
      id: String(doc.author?.id || 'desk'),
      name: String(doc.author?.name || 'स्वर्णिम दस्तावेज़'),
      role: (doc.author?.role || 'staff_reporter') as Article['author']['role'],
      avatar: doc.author?.avatar || doc.author?.avatarUrl ? String(doc.author?.avatar || doc.author?.avatarUrl) : undefined,
    },
    isBreaking: Boolean(doc.isBreaking),
    isTrending: Boolean(doc.isTrending),
    isSponsored: Boolean(doc.isSponsored),
    showOnVideos: Boolean(doc.showOnVideos),
    sponsoredBy: doc.sponsoredBy ? String(doc.sponsoredBy) : undefined,
    publishedAt: doc.publishedAt
      ? typeof doc.publishedAt === 'string'
        ? doc.publishedAt
        : new Date(doc.publishedAt).toISOString()
      : new Date().toISOString(),
    viewsCount: Number(doc.viewsCount || 0),
    likesCount: Number(doc.likesCount || 0),
    commentsCount: Number(doc.commentsCount || 0),
    sharesCount: Number(doc.sharesCount || 0),
    tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
    readingTimeMinutes: Number(doc.readingTimeMinutes || 2),
    status: doc.status || 'published',
  };
}

export async function getArticleByIdOrSlug(idOrSlug: string): Promise<Article | null> {
  if (!idOrSlug) return null;
  let decoded = idOrSlug;
  try {
    decoded = decodeURIComponent(idOrSlug);
  } catch {
    decoded = idOrSlug;
  }

  if (SEED_ARTICLE_IDS.has(idOrSlug) || SEED_ARTICLE_IDS.has(decoded)) {
    return null;
  }

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const doc = await ArticleModel.findOne({
        $or: [
          { id: idOrSlug },
          { slug: idOrSlug },
          { id: decoded },
          { slug: decoded },
        ],
      })
        .lean()
        .exec();

      if (doc && !isSeedArticle(doc)) {
        return serializeArticle(doc);
      }
    }
  } catch (err) {
    console.warn('Error fetching article from database:', err);
  }

  const inMem = platformStore.getArticleById(idOrSlug) || platformStore.getArticleById(decoded);
  if (inMem && !isSeedArticle(inMem)) {
    return serializeArticle(inMem);
  }

  return null;
}

export function getArticleMetadata(article: Article | null, idOrSlug: string): Metadata {
  const siteUrl = 'https://swarnimdastavej.com';

  if (!article) {
    return {
      title: 'खबर - स्वर्णिम दस्तावेज़',
      description: 'स्वर्णिम दस्तावेज़ - उत्तर प्रदेश का अग्रणी हिंदी दैनिक समाचार पत्र एवं नागरिक पत्रकारिता नेटवर्क।',
    };
  }

  // 1. Pick the best image for OpenGraph / WhatsApp share (uploaded cover image)
  let rawImage = (article.coverImage || '').trim();
  if (!rawImage && article.mediaGallery && article.mediaGallery.length > 0) {
    const found = article.mediaGallery.find((m) => m.type === 'image' && m.url?.trim());
    if (found?.url) {
      rawImage = found.url.trim();
    }
  }

  let imageUrl: string;
  if (!rawImage) {
    imageUrl = `${siteUrl}/image.png?v=3`;
  } else if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
    imageUrl = rawImage;
  } else {
    const cleanPath = rawImage.startsWith('/') ? rawImage : `/${rawImage}`;
    imageUrl = `${siteUrl}${cleanPath}`;
  }

  // 2. Prepare clean description without line breaks or HTML tags
  const cleanDesc = cleanExcerpt(article.subHeadline || article.excerpt || article.body || '', 160);

  const headline = article.headline?.trim() || 'ताज़ा खबर';
  const fullTitle = `${headline} - स्वर्णिम दस्तावेज़`;
  const canonicalUrl = `${siteUrl}/article/${article.slug || article.id || idOrSlug}`;

  const lowerImg = imageUrl.toLowerCase();
  const imageType = lowerImg.endsWith('.png')
    ? 'image/png'
    : lowerImg.endsWith('.jpg') || lowerImg.endsWith('.jpeg')
    ? 'image/jpeg'
    : lowerImg.endsWith('.webp')
    ? 'image/webp'
    : undefined;

  return {
    title: fullTitle,
    description: cleanDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: headline,
      description: cleanDesc,
      url: canonicalUrl,
      siteName: 'स्वर्णिम दस्तावेज़',
      locale: 'hi_IN',
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author?.name || 'स्वर्णिम दस्तावेज़ ब्यूरो'],
      tags: article.tags || [],
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          width: 1200,
          height: 630,
          alt: headline,
          type: imageType,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: headline,
      description: cleanDesc,
      images: [imageUrl],
    },
  };
}
