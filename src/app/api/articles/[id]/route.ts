import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { connectToDatabase } from '@/lib/mongodb';
import ArticleModel from '@/models/Article';

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
    let updated = platformStore.updateArticle(id, body);
    try {
      const conn = await connectToDatabase();
      if (conn && typeof body.showOnVideos === 'boolean') {
        const doc = await ArticleModel.findOneAndUpdate(
          { id },
          { $set: { showOnVideos: body.showOnVideos } },
          { new: true }
        ).lean().exec();
        if (doc) updated = doc as NonNullable<typeof updated>;
      }
    } catch (dbErr: unknown) {
      const message = dbErr instanceof Error ? dbErr.message : 'MongoDB article update error';
      console.warn(message);
    }
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
  let removed = platformStore.deleteArticle(id);
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const result = await ArticleModel.deleteOne({ id }).exec();
      if (result.deletedCount) removed = true;
    }
  } catch {
    // The in-memory copy is already removed.
  }
  if (!removed) {
    return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Article deleted' });
}
