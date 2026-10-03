import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUploadedMedia extends Document {
  filename: string;
  contentType: string;
  data: Buffer;
  size: number;
  createdAt: Date;
}

const UploadedMediaSchema = new Schema<IUploadedMedia>(
  {
    filename: { type: String, required: true, unique: true, index: true },
    contentType: { type: String, required: true, default: 'image/webp' },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const UploadedMediaModel: Model<IUploadedMedia> =
  mongoose.models.UploadedMedia ||
  mongoose.model<IUploadedMedia>('UploadedMedia', UploadedMediaSchema);

export default UploadedMediaModel;
