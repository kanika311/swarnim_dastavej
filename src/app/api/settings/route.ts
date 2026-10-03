import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { connectToDatabase } from '@/lib/mongodb';
import SiteSettingsModel from '@/models/SiteSettings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      let dbSettings = await SiteSettingsModel.findOne().lean().exec();
      if (dbSettings) {
        platformStore.updateSettings(dbSettings as any);
        return NextResponse.json(
          { success: true, source: 'mongodb', data: dbSettings },
          { headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }
  } catch (error: any) {
    console.warn('MongoDB settings GET error:', error?.message);
  }

  const settings = platformStore.getSettings();
  return NextResponse.json(
    { success: true, source: 'store', data: settings },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = platformStore.updateSettings(body);

    try {
      const conn = await connectToDatabase();
      if (conn) {
        await SiteSettingsModel.findOneAndUpdate(
          {},
          { $set: body },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
    } catch (dbErr: any) {
      console.warn('MongoDB settings save error:', dbErr?.message);
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Site settings and CMS updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
