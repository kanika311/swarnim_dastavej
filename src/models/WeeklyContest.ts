import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContestPrize {
  rank: number;
  title: string;
  amount?: number;
  type?: string;
  rewardText?: string;
  certificateUrl?: string;
  icon?: string;
}

export interface IContestScoringRules {
  pointsPer100Views: number;
  pointsPerLike: number;
  pointsPerComment: number;
  pointsPerShare: number;
  pointsPerPublishedReport: number;
}

export interface IContestWinner {
  rank: number;
  userId: string;
  userName: string;
  district?: string;
  avatarUrl?: string;
  score: number;
  prizeTitle: string;
  prizeAmount?: number;
  prizeType?: string;
  rewardText?: string;
  certificateUrl?: string;
  confirmedAt?: string;
}

export interface IWeeklyContest extends Document {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  prizes: IContestPrize[];
  scoringRules: IContestScoringRules;
  eligibilityRules?: {
    minPublishedReports?: number;
    minViews?: number;
    eligibleRoles?: string[];
  };
  winners?: IContestWinner[];
  disqualifiedUserIds?: string[];
  createdBy?: string;
  finalizedBy?: string;
  finalizedAt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WeeklyContestSchema = new Schema<IWeeklyContest>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: String, required: true, index: true },
    endDate: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'cancelled'],
      default: 'draft',
      index: true,
    },
    prizes: [
      {
        rank: { type: Number, required: true },
        title: { type: String, required: true },
        amount: { type: Number, default: 0 },
        type: { type: String, default: 'certificate' },
        rewardText: { type: String, default: '' },
        certificateUrl: { type: String, default: '' },
        icon: { type: String },
      }
    ],
    scoringRules: {
      pointsPer100Views: { type: Number, default: 1 },
      pointsPerLike: { type: Number, default: 2 },
      pointsPerComment: { type: Number, default: 3 },
      pointsPerShare: { type: Number, default: 4 },
      pointsPerPublishedReport: { type: Number, default: 10 },
    },
    eligibilityRules: {
      minPublishedReports: { type: Number, default: 1 },
      minViews: { type: Number, default: 0 },
      eligibleRoles: [{ type: String, default: 'citizen_journalist' }],
    },
    winners: [
      {
        rank: Number,
        userId: String,
        userName: String,
        district: String,
        avatarUrl: String,
        score: Number,
        prizeTitle: String,
        prizeAmount: { type: Number, default: 0 },
        prizeType: { type: String, default: 'certificate' },
        rewardText: { type: String, default: '' },
        certificateUrl: { type: String, default: '' },
        confirmedAt: String,
      }
    ],
    disqualifiedUserIds: [{ type: String }],
    createdBy: { type: String, default: 'admin' },
    finalizedBy: { type: String },
    finalizedAt: { type: String },
  },
  { timestamps: true }
);

export const WeeklyContestModel: Model<IWeeklyContest> =
  mongoose.models.WeeklyContest || mongoose.model<IWeeklyContest>('WeeklyContest', WeeklyContestSchema);

export default WeeklyContestModel;
