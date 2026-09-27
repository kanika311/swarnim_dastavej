import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET() {
  try {
    const settings = platformStore.getSettings();
    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = platformStore.updateSettings(body);
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
