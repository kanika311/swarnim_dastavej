import { NextRequest, NextResponse } from 'next/server';
import { EPaperPricingPlan } from '@/types';
import { INITIAL_PRICING_PLANS } from '@/lib/initialData';
import connectDB from '@/lib/mongodb';
import mongoose, { Schema } from 'mongoose';

// Optional Mongoose Schema for persistence
const PricingPlanSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    titleEn: String,
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    durationLabel: { type: String, required: true },
    durationLabelEn: String,
    description: { type: String, required: true },
    descriptionEn: String,
    features: [String],
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const PricingPlanModel =
  mongoose.models.PricingPlan || mongoose.model('PricingPlan', PricingPlanSchema);

// In-memory fallback
let inMemoryPlans: EPaperPricingPlan[] = [...INITIAL_PRICING_PLANS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    try {
      await connectDB();
      const dbPlans = await PricingPlanModel.find(all ? {} : { isActive: true }).sort({ order: 1, price: 1 }).lean();
      if (dbPlans && dbPlans.length > 0) {
        return NextResponse.json({ success: true, data: dbPlans });
      }
    } catch {
      // fallback to in-memory
    }

    const filtered = all ? inMemoryPlans : inMemoryPlans.filter(p => p.isActive !== false);
    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: EPaperPricingPlan = await req.json();
    if (!body.title || body.price === undefined || !body.duration) {
      return NextResponse.json(
        { success: false, message: 'Title, price, and duration are required.' },
        { status: 400 }
      );
    }

    const planToSave: EPaperPricingPlan = {
      ...body,
      id: body.id || `plan_${Date.now()}`,
      isActive: body.isActive !== undefined ? body.isActive : true,
      updatedAt: new Date().toISOString(),
      createdAt: body.createdAt || new Date().toISOString()
    };

    // Update in-memory
    const existingIdx = inMemoryPlans.findIndex(p => p.id === planToSave.id);
    if (existingIdx >= 0) {
      inMemoryPlans[existingIdx] = planToSave;
    } else {
      inMemoryPlans.push(planToSave);
    }

    // Persist to Mongo if available
    try {
      await connectDB();
      await PricingPlanModel.findOneAndUpdate(
        { id: planToSave.id },
        planToSave,
        { upsert: true, new: true }
      );
    } catch {
      // in-memory updated
    }

    return NextResponse.json({ success: true, data: planToSave });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Plan ID is required.' }, { status: 400 });
    }

    inMemoryPlans = inMemoryPlans.filter(p => p.id !== id);

    try {
      await connectDB();
      await PricingPlanModel.deleteOne({ id });
    } catch {}

    return NextResponse.json({ success: true, message: 'Plan deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
