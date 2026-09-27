import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET() {
  const ads = platformStore.getAds();
  return NextResponse.json({ success: true, count: ads.length, data: ads });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.event === 'click') {
      platformStore.recordAdClick(body.adId);
      return NextResponse.json({ success: true });
    }
    if (body.event === 'impression') {
      platformStore.recordAdImpression(body.adId);
      return NextResponse.json({ success: true });
    }
    if (!body.title || !body.advertiser) {
      return NextResponse.json(
        { success: false, message: 'Title and advertiser are required' },
        { status: 400 }
      );
    }
    const ad = platformStore.createAd(body);
    return NextResponse.json({ success: true, data: ad }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: 'Ad id is required' }, { status: 400 });
    }
    const updated = platformStore.updateAd(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Ad not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, message: 'Ad id is required' }, { status: 400 });
  }
  const ok = platformStore.deleteAd(id);
  if (!ok) {
    return NextResponse.json({ success: false, message: 'Ad not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
