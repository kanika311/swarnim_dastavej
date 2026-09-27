import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { connectToDatabase } from '@/lib/mongodb';
import ArticleModel from '@/models/Article';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const city = searchParams.get('city') || undefined;
  const search = searchParams.get('q') || undefined;
  const language = searchParams.get('lang') || undefined;

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const query: any = { status: 'published' };
      if (category && category !== 'all') query.category = category;
      if (city && city !== 'सभी शहर' && city !== 'सभी') query.city = city;
      if (language) query.language = language;
      if (search) {
        query.$or = [
          { headline: { $regex: search, $options: 'i' } },
          { body: { $regex: search, $options: 'i' } }
        ];
      }

      const dbArticles = await ArticleModel.find(query).sort({ publishedAt: -1 }).lean().exec();
      if (dbArticles && dbArticles.length > 0) {
        return NextResponse.json({
          success: true,
          count: dbArticles.length,
          source: 'mongodb',
          data: dbArticles
        });
      }
    }
  } catch (e: any) {
    console.warn('MongoDB articles GET error:', e?.message);
  }

  const articles = platformStore.getArticles({ category, city, search, language });
  return NextResponse.json({ success: true, count: articles.length, source: 'store', data: articles });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newArticle = platformStore.createArticle(body);

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const articleDoc = new ArticleModel(newArticle);
        await articleDoc.save();
        console.log(`✅ Article saved to MongoDB: ${newArticle.id}`);
      }
    } catch (dbErr: any) {
      console.warn('MongoDB article save error:', dbErr?.message);
    }

    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}
