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

      const dbEditions = await EPaperEditionModel.find({ ...query, isDeleted: { $ne: true } }).sort({ date: -1 }).lean().exec();
      if (dbEditions && dbEditions.length > 0) {
        const normalized = dbEditions.map((ed: any) => ({
          ...ed,
          pdfUrl: ed.pdfUrl || ed.pages?.[0]?.pdfPageUrl || ed.pages?.[0]?.pdfUrl,
          pages: ed.pages?.map((p: any) => ({
            ...p,
            pdfUrl: p.pdfUrl || p.pdfPageUrl || ed.pdfUrl
          }))
        }));
        return NextResponse.json({ success: true, count: normalized.length, source: 'mongodb', data: normalized });
      }
    }
  } catch (e: any) {
    console.warn('MongoDB epaper GET error:', e?.message);
  }

  let deletedIds = new Set<string>();
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const deletedDocs = await EPaperEditionModel.find({ isDeleted: true }).select('id').lean().exec();
      deletedIds = new Set(deletedDocs.map((doc) => String(doc.id)));
    }
  } catch {
    // Store list is used when the database is unavailable.
  }
  const editions = platformStore.getEPaperEditions({ language, city, date }).filter((edition) => !deletedIds.has(edition.id));
  return NextResponse.json({ success: true, count: editions.length, source: 'store', data: editions });
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, message: 'Edition ID is required' }, { status: 400 });
  }
  platformStore.deleteEPaperEdition(id);
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await EPaperEditionModel.findOneAndUpdate(
        { id },
        {
          $set: { isDeleted: true },
          $setOnInsert: {
            id,
            date: '1970-01-01',
            editionCity: 'deleted',
            thumbnailUrl: '-',
            totalPageCount: 0,
            pages: []
          }
        },
        { upsert: true }
      ).exec();
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Could not delete edition';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: 'ई-पेपर संस्करण हटा दिया गया।' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEd = platformStore.addEPaperEdition(body);
    const pdfUrl = body.pdfUrl || newEd.pdfUrl || newEd.pages?.[0]?.pdfUrl;

    try {
      const conn = await connectToDatabase();
      if (conn) {
        await EPaperEditionModel.findOneAndUpdate(
          { id: newEd.id },
          {
            $set: {
              id: newEd.id,
              date: newEd.date,
              editionCity: newEd.editionCity,
              language: newEd.language || 'hi',
              totalPageCount: newEd.pagesCount,
              pdfUrl: pdfUrl,
              thumbnailUrl: newEd.thumbnailUrl,
              pages: newEd.pages.map(p => ({
                pageNumber: p.pageNumber,
                title: p.title,
                imageUrl: p.imageUrl,
                pdfPageUrl: p.pdfUrl || pdfUrl
              }))
            }
          },
          { upsert: true, new: true }
        ).exec();
      }
    } catch (dbErr: any) {
      console.warn('MongoDB epaper save error:', dbErr?.message);
    }

    return NextResponse.json({ success: true, data: { ...newEd, pdfUrl } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}

