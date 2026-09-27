import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = platformStore.getArticleById(id);
  if (!article) {
    return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
  }
  platformStore.incrementArticleViews(article.id);
  return NextResponse.json({ success: true, data: article });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { action } = await request.json().catch(() => ({ action: 'like' }));
  if (action === 'like') {
    const likes = platformStore.toggleArticleLike(id);
    return NextResponse.json({ success: true, likes });
  }
  return NextResponse.json({ success: true });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = platformStore.updateArticle(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, message: 'Article updated' });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = platformStore.deleteArticle(id);
  if (!ok) {
    return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Article deleted' });
}
