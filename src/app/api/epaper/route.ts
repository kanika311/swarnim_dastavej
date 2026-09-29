import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { connectToDatabase } from '@/lib/mongodb';
import EPaperEditionModel from '@/models/EPaperEdition';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('lang') || undefined;
  const city = searchParams.get('city') || undefined;
  const date = searchParams.get('date') || undefined;

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const query: any = {};
      if (language && language !== 'all') query.language = language;
      if (city && city !== 'सभी') query.editionCity = { $regex: city, $options: 'i' };
      if (date) query.date = date;

      const dbEditions = await EPaperEditionModel.find(query).sort({ date: -1 }).lean().exec();
      if (dbEditions && dbEditions.length > 0) {
        return NextResponse.json({ success: true, count: dbEditions.length, source: 'mongodb', data: dbEditions });
      }
    }
  } catch (e: any) {
    console.warn('MongoDB epaper GET error:', e?.message);
  }

  const editions = platformStore.getEPaperEditions({ language, city, date });
  return NextResponse.json({ success: true, count: editions.length, source: 'store', data: editions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEd = platformStore.addEPaperEdition(body);

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const doc = new EPaperEditionModel({
          id: newEd.id,
          date: newEd.date,
          editionCity: newEd.editionCity,
          language: newEd.language || 'hi',
          totalPageCount: newEd.pagesCount,
          thumbnailUrl: newEd.thumbnailUrl,
          pages: newEd.pages.map(p => ({
            pageNumber: p.pageNumber,
            title: p.title,
            imageUrl: p.imageUrl,
            pdfPageUrl: p.pdfUrl
          }))
        });
        await doc.save();
      }
    } catch (dbErr: any) {
      console.warn('MongoDB epaper save error:', dbErr?.message);
    }

    return NextResponse.json({ success: true, data: newEd }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}

