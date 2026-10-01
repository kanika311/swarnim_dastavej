import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEPaperEdition extends Document {
  id: string;
  date: string; // YYYY-MM-DD
  editionCity: string;
  language?: string;
  totalPageCount: number;
  pdfUrl?: string;
  thumbnailUrl: string;
  isDeleted?: boolean;
  pages: Array<{
    pageNumber: number;
    title: string;
    imageUrl: string;
    pdfPageUrl?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const EPaperEditionSchema = new Schema<IEPaperEdition>(
  {
    id: { type: String, required: true, unique: true, index: true },
    date: { type: String, required: true, index: true },
    editionCity: { type: String, required: true, index: true },
    language: { type: String, default: 'hi', index: true },
    totalPageCount: { type: Number, default: 6 },
    pdfUrl: String,
    thumbnailUrl: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, index: true },
    pages: [
      {
        pageNumber: Number,
        title: String,
        imageUrl: String,
        pdfPageUrl: String,
      }
    ]
  },
  { timestamps: true }
);

export const EPaperEditionModel: Model<IEPaperEdition> =
  mongoose.models.EPaperEdition || mongoose.model<IEPaperEdition>('EPaperEdition', EPaperEditionSchema);

export default EPaperEditionModel;
