import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET() {
  const ads = platformStore.getAds();
  return NextResponse.json({ success: true, count: ads.length, data: ads });
}

export async function POST(request: Request) {
  try {
    const { adId, event } = await request.json();
    if (event === 'click') {
      platformStore.recordAdClick(adId);
    } else if (event === 'impression') {
      platformStore.recordAdImpression(adId);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
