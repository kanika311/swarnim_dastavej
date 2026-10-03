import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  registrationNo: string;
  editorInChief: string;
  publisher: string;
  privacyPolicy: string;
  termsOfService: string;
  editorialPolicy: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: 'स्वर्णिम दस्तावेज़ (Swarnim Dastavej)' },
    tagline: { type: String, default: 'उत्तर प्रदेश का अग्रणी, निष्पक्ष एवं निर्भीक हिंदी दैनिक समाचार पत्र व डिजिटल मीडिया नेटवर्क' },
    email: { type: String, default: 'swarnimdastavej@gmail.com' },
    phone: { type: String, default: '+91 95196 231111' },
    address: { type: String, default: 'Argada hussainganj, behind jwala hotel. Lucknow -226001' },
    registrationNo: { type: String, default: 'UPHIN/26/A7984' },
    editorInChief: { type: String, default: 'रामेश्वर दयाल (Rameshwar Dayal)' },
    publisher: { type: String, default: 'स्वर्णिम दस्तावेज़ प्रकाशन, लखनऊ' },
    privacyPolicy: { type: String, default: '' },
    termsOfService: { type: String, default: '' },
    editorialPolicy: { type: String, default: '' },
    facebookUrl: { type: String, default: 'https://facebook.com' },
    twitterUrl: { type: String, default: 'https://twitter.com' },
    instagramUrl: { type: String, default: 'https://instagram.com' },
    youtubeUrl: { type: String, default: 'https://youtube.com' }
  },
  { timestamps: true }
);

export const SiteSettingsModel: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettingsModel;
