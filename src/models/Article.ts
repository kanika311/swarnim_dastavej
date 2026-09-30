import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticle extends Document {
  id: string;
  slug: string;
  headline: string;
  subHeadline?: string;
  body: string;
  excerpt: string;
  category: string;
  city: string;
  language: string;
  coverImage: string;
  mediaGallery?: Array<{
    id: string;
    type: 'image' | 'video';
    url: string;
    caption?: string;
  }>;
  author: {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
  };
  isBreaking: boolean;
  isTrending: boolean;
  isSponsored: boolean;
  showOnVideos?: boolean;
  sponsoredBy?: string;
  publishedAt: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  tags: string[];
  readingTimeMinutes: number;
  status: 'draft' | 'pending_review' | 'published' | 'archived' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    headline: { type: String, required: true },
    subHeadline: { type: String },
    body: { type: String, required: true },
    excerpt: { type: String },
    category: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    language: { type: String, default: 'hi' },
    coverImage: { type: String, required: true },
    mediaGallery: [
      {
        id: String,
        type: { type: String, enum: ['image', 'video'] },
        url: String,
        caption: String,
      }
    ],
    author: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, required: true },
      avatarUrl: String,
    },
    isBreaking: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isSponsored: { type: Boolean, default: false },
    showOnVideos: { type: Boolean, default: false },
    sponsoredBy: { type: String },
    publishedAt: { type: String, required: true },
    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    readingTimeMinutes: { type: Number, default: 2 },
    status: {
      type: String,
      enum: ['draft', 'pending_review', 'published', 'archived', 'inactive'],
      default: 'published',
      index: true
    }
  },
  { timestamps: true }
);

export const ArticleModel: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
export default ArticleModel;
