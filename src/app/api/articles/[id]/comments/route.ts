import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ArticleCommentModel from '@/models/ArticleComment';
import ArticleModel from '@/models/Article';
import CitizenSubmissionModel from '@/models/CitizenSubmission';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const comments = await ArticleCommentModel.find({
      $or: [{ articleId: id }, { submissionId: id }],
      status: { $ne: 'deleted' },
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text, user } = body;

    if (!text || typeof text !== 'string' || text.trim().length < 2) {
      return NextResponse.json({ success: false, message: 'टिप्पणी कम से कम 2 अक्षरों की होनी चाहिए।' }, { status: 400 });
    }

    if (text.length > 1000) {
      return NextResponse.json({ success: false, message: 'टिप्पणी 1000 अक्षरों से अधिक नहीं हो सकती।' }, { status: 400 });
    }

    if (!user || !user.id || !user.name) {
      return NextResponse.json({ success: false, message: 'टिप्पणी करने के लिए नाम अनिवार्य है।' }, { status: 400 });
    }

    await connectToDatabase();

    // Check Article or Submission
    const article = await ArticleModel.findOne({ $or: [{ id }, { slug: id }] });
    const submission = await CitizenSubmissionModel.findOne({ $or: [{ id }, { publishedArticleId: id }] });

    const articleId = article ? article.id : (submission?.publishedArticleId || id);
    const submissionId = submission ? submission.id : undefined;

    const commentId = `cmnt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newComment = await ArticleCommentModel.create({
      id: commentId,
      articleId,
      submissionId,
      user: {
        id: user.id,
        name: user.name.trim(),
        email: user.email || '',
        avatarUrl: user.avatarUrl || '',
        role: user.role || 'reader',
      },
      text: text.trim(),
      status: 'approved',
      likesCount: 0,
    });

    // Update counts on models
    if (article) {
      article.commentsCount = (article.commentsCount || 0) + 1;
      await article.save();
    }
    if (submission) {
      submission.commentsCount = (submission.commentsCount || 0) + 1;
      await submission.save();
    }

    return NextResponse.json({
      success: true,
      message: 'आपकी टिप्पणी सफलतापूर्वक दर्ज हो गई।',
      data: newComment,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Comment POST error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
