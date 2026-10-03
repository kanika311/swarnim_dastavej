import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { connectToDatabase } from '@/lib/mongodb';
import ArticleModel from '@/models/Article';
import { isSeedArticle, SEED_ARTICLE_IDS } from '@/lib/initialData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (SEED_ARTICLE_IDS.has(id)) {
    return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
  }
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const doc = await ArticleModel.findOne({ $or: [{ id }, { slug: id }] }).lean().exec();
      if (doc) {
        if (isSeedArticle(doc)) {
          return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: doc });
      }
    }
  } catch {
    // Fall through to the in-memory article.
  }
  const article = platformStore.getArticleById(id);
  if (!article || isSeedArticle(article)) {
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
      if (conn) {
        const doc = await ArticleModel.findOneAndUpdate(
          { id },
          { $set: body },
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
  const removedFromStore = platformStore.deleteArticle(id);
  let removed = removedFromStore || SEED_ARTICLE_IDS.has(id);
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const result = await ArticleModel.deleteOne({ $or: [{ id }, { slug: id }] }).exec();
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
