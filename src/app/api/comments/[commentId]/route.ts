import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ArticleCommentModel from '@/models/ArticleComment';
import ArticleModel from '@/models/Article';
import CitizenSubmissionModel from '@/models/CitizenSubmission';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const comment = await ArticleCommentModel.findOne({ id: commentId });
    if (!comment) {
      return NextResponse.json({ success: false, message: 'Comment not found' }, { status: 404 });
    }

    const isAdminOrEditor = userRole === 'admin' || userRole === 'super_admin' || userRole === 'editor';
    const isOwner = comment.user.id === userId;

    if (!isAdminOrEditor && !isOwner) {
      return NextResponse.json({ success: false, message: 'You can only delete your own comments' }, { status: 403 });
    }

    // Mark as deleted
    comment.status = 'deleted';
    await comment.save();

    // Decrement count on article and submission
    if (comment.articleId) {
      await ArticleModel.updateOne(
        { id: comment.articleId, commentsCount: { $gt: 0 } },
        { $inc: { commentsCount: -1 } }
      );
    }
    if (comment.submissionId) {
      await CitizenSubmissionModel.updateOne(
        { id: comment.submissionId, commentsCount: { $gt: 0 } },
        { $inc: { commentsCount: -1 } }
      );
    }

    return NextResponse.json({ success: true, message: 'टिप्पणी हटा दी गई।' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
