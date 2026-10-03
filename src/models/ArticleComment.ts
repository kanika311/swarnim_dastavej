import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticleComment extends Document {
  id: string;
  articleId: string;
  submissionId?: string;
  user: {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
  };
  text: string;
  status: 'approved' | 'pending' | 'flagged' | 'deleted';
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleCommentSchema = new Schema<IArticleComment>(
  {
    id: { type: String, required: true, unique: true, index: true },
    articleId: { type: String, required: true, index: true },
    submissionId: { type: String, index: true },
    user: {
      id: { type: String, required: true, index: true },
      name: { type: String, required: true },
      email: { type: String },
      avatarUrl: { type: String },
      role: { type: String, default: 'reader' },
    },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ['approved', 'pending', 'flagged', 'deleted'],
      default: 'approved',
      index: true,
    },
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ArticleCommentModel: Model<IArticleComment> =
  mongoose.models.ArticleComment || mongoose.model<IArticleComment>('ArticleComment', ArticleCommentSchema);

export default ArticleCommentModel;
