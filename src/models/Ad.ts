import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAd extends Document {
  id: string;
  title: string;
  advertiser: string;
  imageUrl: string;
  targetUrl: string;
  placement: 'header_top' | 'sidebar' | 'in_feed' | 'sticky_bottom';
  impressions: number;
  clicks: number;
  isActive: boolean;
  isSponsoredPost?: boolean;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdSchema = new Schema<IAd>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    advertiser: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    targetUrl: { type: String, default: '#' },
    placement: {
      type: String,
      enum: ['header_top', 'sidebar', 'in_feed', 'sticky_bottom'],
      default: 'sidebar',
      index: true
    },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    isSponsoredPost: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export const AdModel: Model<IAd> =
  mongoose.models.Ad || mongoose.model<IAd>('Ad', AdSchema);

export default AdModel;
