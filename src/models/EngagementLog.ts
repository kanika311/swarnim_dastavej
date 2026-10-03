import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEngagementLog extends Document {
  targetId: string; // articleId or submissionId
  targetType: 'article' | 'submission';
  eventType: 'view' | 'like' | 'share';
  userId?: string;
  ipHash: string;
  sessionId?: string;
  platform?: string;
  createdAt: Date;
}

const EngagementLogSchema = new Schema<IEngagementLog>(
  {
    targetId: { type: String, required: true, index: true },
    targetType: { type: String, enum: ['article', 'submission'], default: 'article', index: true },
    eventType: { type: String, enum: ['view', 'like', 'share'], required: true, index: true },
    userId: { type: String, index: true },
    ipHash: { type: String, required: true, index: true },
    sessionId: { type: String, index: true },
    platform: { type: String },
  },
  { timestamps: true }
);

// Optimize indexes for deduplication queries
EngagementLogSchema.index({ targetId: 1, eventType: 1, userId: 1 });
EngagementLogSchema.index({ targetId: 1, eventType: 1, ipHash: 1, createdAt: -1 });

export const EngagementLogModel: Model<IEngagementLog> =
  mongoose.models.EngagementLog || mongoose.model<IEngagementLog>('EngagementLog', EngagementLogSchema);

export default EngagementLogModel;
