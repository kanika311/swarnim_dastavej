import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const city = searchParams.get('city') || undefined;
  const search = searchParams.get('q') || undefined;
  const language = searchParams.get('lang') || undefined;

  const articles = platformStore.getArticles({ category, city, search, language });
  return NextResponse.json({ success: true, count: articles.length, data: articles });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newArticle = platformStore.createArticle(body);
    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}
