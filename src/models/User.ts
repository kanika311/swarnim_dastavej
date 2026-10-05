import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'reader' | 'citizen_journalist' | 'staff_reporter' | 'editor' | 'admin' | 'super_admin';
  city: string;
  avatarUrl?: string;
  preferredLanguage: 'hi' | 'en' | 'ur';
  kycStatus?: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  kycDetails?: {
    idProofType: string;
    idNumber: string;
    submittedAt: string;
    district: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, sparse: true, index: true },
    password: { type: String },
    role: { 
      type: String, 
      enum: ['reader', 'citizen_journalist', 'staff_reporter', 'editor', 'admin', 'super_admin'],
      default: 'reader',
      index: true
    },
    city: { type: String, default: 'सुल्तानपुर' },
    avatarUrl: { type: String },
    preferredLanguage: { type: String, default: 'hi' },
    kycStatus: { 
      type: String, 
      enum: ['not_submitted', 'pending', 'verified', 'rejected'],
      default: 'not_submitted' 
    },
    kycDetails: {
      idProofType: { type: String },
      idNumber: { type: String },
      submittedAt: { type: String },
      district: { type: String }
    }
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default UserModel;
