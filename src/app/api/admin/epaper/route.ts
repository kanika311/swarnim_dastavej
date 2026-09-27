import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import EPaperEditionModel from '@/models/EPaperEdition';
import { INITIAL_EPAPER_EDITIONS } from '@/lib/initialData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const city = searchParams.get('city');

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const filter: any = {};
      if (date) filter.date = date;
      if (city && city !== 'सभी') filter.editionCity = city;

      const editions = await EPaperEditionModel.find(filter).sort({ date: -1 }).lean().exec();
      if (editions && editions.length > 0) {
        return NextResponse.json({ success: true, source: 'mongodb', data: editions });
      }
    }
  } catch (err: any) {
    console.warn('MongoDB epaper query fallback:', err?.message);
  }

  return NextResponse.json({ success: true, source: 'initial_data', data: INITIAL_EPAPER_EDITIONS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, editionCity, pages, pdfUrl, thumbnailUrl } = body;

    if (!date || !editionCity) {
      return NextResponse.json(
        { success: false, error: 'दिनांक और संस्करण शहर अनिवार्य हैं।' },
        { status: 400 }
      );
    }

    const editionId = `ep-${date}-${editionCity.replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-').toLowerCase()}`;

    const newEditionData = {
      id: editionId,
      date,
      editionCity,
      totalPageCount: pages?.length || 6,
      pdfUrl,
      thumbnailUrl: thumbnailUrl || pages?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
      pages: pages || [
        {
          pageNumber: 1,
          title: `मुख्य पृष्ठ - ${editionCity}`,
          imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'
        }
      ]
    };

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const saved = await EPaperEditionModel.findOneAndUpdate(
          { id: editionId },
          { $set: newEditionData },
          { upsert: true, new: true }
        ).exec();

        return NextResponse.json({
          success: true,
          source: 'mongodb',
          data: saved,
          message: `${date} का ${editionCity} संस्करण सफलतापूर्वक सहेज लिया गया!`
        });
      }
    } catch (dbErr: any) {
      console.warn('MongoDB epaper save error:', dbErr?.message);
    }

    return NextResponse.json({
      success: true,
      source: 'memory',
      data: newEditionData,
      message: `${date} का ${editionCity} संस्करण जोड़ा गया!`
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Edition ID अनिवार्य है।' }, { status: 400 });
    }

    try {
      const conn = await connectToDatabase();
      if (conn) {
        await EPaperEditionModel.deleteOne({ id }).exec();
      }
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'ई-पेपर संस्करण हटा दिया गया।' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
