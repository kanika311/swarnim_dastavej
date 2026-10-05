import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICitizenSubmission extends Document {
  id: string;
  headline: string;
  subHeadline?: string;
  body: string;
  category: string;
  city: string;
  language: string;
  submittedBy: {
    id: string;
    name: string;
    role: string;
    district: string;
    phone?: string;
  };
  media: Array<{
    id: string;
    type: 'image' | 'video';
    url: string;
    caption?: string;
  }>;
  hasRecordedVideo: boolean;
  geoTag?: {
    locationName: string;
    coordinates?: string;
  };
  status: 'draft' | 'pending_review' | 'sent_back' | 'approved' | 'rejected' | 'inactive';
  editorComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedAt: string;
  updatedAt: string;
  publishedArticleId?: string;
  viewsCount?: number;
  uniqueViews?: number;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  createdAt: Date;
}

const CitizenSubmissionSchema = new Schema<ICitizenSubmission>(
  {
    id: { type: String, required: true, unique: true, index: true },
    headline: { type: String, required: true },
    subHeadline: { type: String },
    body: { type: String, required: true },
    category: { type: String, default: 'sultanpur', index: true },
    city: { type: String, default: 'सुल्तानपुर', index: true },
    language: { type: String, default: 'hi' },
    submittedBy: {
      id: { type: String, required: true, index: true },
      name: { type: String, required: true },
      role: { type: String, default: 'citizen_journalist' },
      district: { type: String, default: 'सुल्तानपुर' },
      phone: String,
    },
    media: [
      {
        id: String,
        type: { type: String, enum: ['image', 'video'] },
        url: String,
        caption: String,
      }
    ],
    hasRecordedVideo: { type: Boolean, default: false },
    geoTag: {
      locationName: String,
      coordinates: String,
    },
    status: {
      type: String,
      enum: ['draft', 'pending_review', 'sent_back', 'approved', 'rejected', 'inactive'],
      default: 'pending_review',
      index: true
    },
    editorComments: { type: String },
    reviewedBy: { type: String },
    reviewedAt: { type: String },
    publishedArticleId: { type: String, index: true },
    viewsCount: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    submittedAt: { type: String, required: true },
    updatedAt: { type: String }
  },
  { timestamps: true }
);

export const CitizenSubmissionModel: Model<ICitizenSubmission> = 
  mongoose.models.CitizenSubmission || mongoose.model<ICitizenSubmission>('CitizenSubmission', CitizenSubmissionSchema);

export default CitizenSubmissionModel;
