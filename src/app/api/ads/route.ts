import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { connectToDatabase } from '@/lib/mongodb';
import AdModel from '@/models/Ad';
import { INITIAL_ADS } from '@/lib/initialData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placement = searchParams.get('placement') || undefined;

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const query: Record<string, unknown> = { isDeleted: { $ne: true } };
      if (placement && placement !== 'all') {
        query.placement = placement;
      }

      let dbAds = await AdModel.find(query).sort({ createdAt: -1 }).lean().exec();

      if (dbAds && dbAds.length > 0) {
        const normalized = dbAds.map((ad: any) => ({
          id: ad.id,
          title: ad.title,
          advertiser: ad.advertiser,
          imageUrl: ad.imageUrl || '',
          targetUrl: ad.targetUrl || '#',
          placement: ad.placement || 'sidebar',
          impressions: ad.impressions || 0,
          clicks: ad.clicks || 0,
          isActive: ad.isActive !== false,
          isSponsoredPost: ad.isSponsoredPost || false
        }));

        platformStore.syncAds(normalized);

        return NextResponse.json(
          { success: true, count: normalized.length, source: 'mongodb', data: normalized },
          { headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }

      // If connected to MongoDB and 0 ads exist (e.g. user deleted all ads), return empty array
      platformStore.syncAds([]);
      return NextResponse.json(
        { success: true, count: 0, source: 'mongodb', data: [] },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }
  } catch (error: any) {
    console.warn('MongoDB ads GET error:', error?.message);
  }

  // Store fallback (only if MongoDB connection is unavailable)
  let ads = platformStore.getAds();
  if (placement && placement !== 'all') {
    ads = ads.filter((ad) => ad.placement === placement);
  }

  return NextResponse.json(
    { success: true, count: ads.length, source: 'store', data: ads },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Support deletion via POST fallback for environments/browsers/ad-blockers that block DELETE
    if (body.action === 'delete' || body.event === 'delete') {
      const id = body.id || body.adId;
      if (!id) {
        return NextResponse.json({ success: false, message: 'Ad id is required' }, { status: 400 });
      }

      platformStore.deleteAd(id);

      try {
        const conn = await connectToDatabase();
        if (conn) {
          const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
          const filter = isObjectId ? { $or: [{ id }, { _id: id }] } : { id };
          await AdModel.deleteMany(filter);
        }
      } catch (err: any) {
        console.warn('MongoDB ad delete error:', err?.message);
        return NextResponse.json({ success: false, message: err?.message || 'Database delete failed' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Ad deleted successfully' });
    }

    if (body.event === 'click') {
      platformStore.recordAdClick(body.adId);
      try {
        const conn = await connectToDatabase();
        if (conn) {
          await AdModel.findOneAndUpdate({ id: body.adId }, { $inc: { clicks: 1 } });
        }
      } catch (err) {
        console.warn('Ad click track error:', err);
      }
      return NextResponse.json({ success: true });
    }

    if (body.event === 'impression') {
      platformStore.recordAdImpression(body.adId);
      try {
        const conn = await connectToDatabase();
        if (conn) {
          await AdModel.findOneAndUpdate({ id: body.adId }, { $inc: { impressions: 1 } });
        }
      } catch (err) {
        console.warn('Ad impression track error:', err);
      }
      return NextResponse.json({ success: true });
    }

    if (!body.title || !body.advertiser) {
      return NextResponse.json(
        { success: false, message: 'Title and advertiser are required' },
        { status: 400 }
      );
    }

    const ad = platformStore.createAd(body);

    try {
      const conn = await connectToDatabase();
      if (conn) {
        await AdModel.findOneAndUpdate(
          { id: ad.id },
          {
            id: ad.id,
            title: ad.title,
            advertiser: ad.advertiser,
            imageUrl: ad.imageUrl || '',
            targetUrl: ad.targetUrl || '#',
            placement: ad.placement || 'sidebar',
            impressions: ad.impressions || 0,
            clicks: ad.clicks || 0,
            isActive: ad.isActive !== false,
            isSponsoredPost: Boolean(ad.isSponsoredPost),
            isDeleted: false
          },
          { upsert: true, new: true }
        );
      }
    } catch (err: any) {
      console.warn('MongoDB ad save error:', err?.message);
    }

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

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(body.id);
        const filter = isObjectId ? { $or: [{ id: body.id }, { _id: body.id }] } : { id: body.id };
        await AdModel.findOneAndUpdate(filter, { $set: body }, { new: true });
      }
    } catch (err: any) {
      console.warn('MongoDB ad update error:', err?.message);
    }

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Ad not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  let id = new URL(request.url).searchParams.get('id');
  if (!id) {
    try {
      const body = await request.json();
      id = body?.id;
    } catch {
      // no JSON body
    }
  }

  if (!id) {
    return NextResponse.json({ success: false, message: 'Ad id is required' }, { status: 400 });
  }

  platformStore.deleteAd(id);

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      const filter = isObjectId ? { $or: [{ id }, { _id: id }] } : { id };
      await AdModel.deleteMany(filter);
    }
  } catch (err: any) {
    console.warn('MongoDB ad delete error:', err?.message);
    return NextResponse.json({ success: false, message: err?.message || 'Database delete failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Ad deleted successfully' });
}
