import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ArticleModel from '@/models/Article';
import CitizenSubmissionModel from '@/models/CitizenSubmission';
import EngagementLogModel from '@/models/EngagementLog';
import ArticleCommentModel from '@/models/ArticleComment';
import { getClientIp, hashIp } from '@/lib/engagement';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    await connectToDatabase();

    // Check Article or CitizenSubmission
    let article = await ArticleModel.findOne({ $or: [{ id }, { slug: id }] }).lean();
    let submission = await CitizenSubmissionModel.findOne({ $or: [{ id }, { publishedArticleId: id }] }).lean();

    if (!article && !submission) {
      return NextResponse.json({ success: false, message: 'Content not found' }, { status: 404 });
    }

    const targetId = article ? article.id : submission!.id;

    // Check if user has liked
    let userHasLiked = false;
    if (userId) {
      const existingLike = await EngagementLogModel.findOne({
        targetId,
        eventType: 'like',
        userId,
      });
      userHasLiked = !!existingLike;
    }

    const viewsCount = article?.viewsCount ?? submission?.viewsCount ?? 0;
    const uniqueViews = submission?.uniqueViews ?? Math.max(1, Math.round(viewsCount * 0.75));
    const likesCount = article?.likesCount ?? submission?.likesCount ?? 0;
    const sharesCount = article?.sharesCount ?? submission?.sharesCount ?? 0;

    // Count comments from ArticleCommentModel
    const commentsCount = await ArticleCommentModel.countDocuments({
      $or: [{ articleId: targetId }, { submissionId: targetId }],
      status: { $ne: 'deleted' },
    });

    return NextResponse.json({
      success: true,
      data: {
        targetId,
        viewsCount,
        uniqueViews,
        likesCount,
        commentsCount,
        sharesCount,
        userHasLiked,
      },
    });
  } catch (error: any) {
    console.error('Engagement GET error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { action, userId, sessionId, platform } = body;

    const clientIp = getClientIp(request);
    const ipHash = hashIp(clientIp);

    await connectToDatabase();

    // Locate article or submission
    let article = await ArticleModel.findOne({ $or: [{ id }, { slug: id }] });
    let submission = await CitizenSubmissionModel.findOne({ $or: [{ id }, { publishedArticleId: id }] });

    if (!article && !submission) {
      return NextResponse.json({ success: false, message: 'Content not found' }, { status: 404 });
    }

    const targetId = article ? article.id : submission!.id;
    const targetType = article ? 'article' : 'submission';

    // 1. VIEW TRACKING WITH DEDUPLICATION (6 hours cooldown per IP or User)
    if (action === 'view') {
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      const query: any = {
        targetId,
        eventType: 'view',
        createdAt: { $gte: sixHoursAgo },
      };

      if (userId) {
        query.$or = [{ userId }, { ipHash }];
      } else {
        query.ipHash = ipHash;
      }

      const recentView = await EngagementLogModel.findOne(query);

      if (!recentView) {
        // Log view
        await EngagementLogModel.create({
          targetId,
          targetType,
          eventType: 'view',
          userId: userId || undefined,
          ipHash,
          sessionId: sessionId || undefined,
        });

        // Check if user/IP has EVER viewed this article before for uniqueViews
        const everViewed = await EngagementLogModel.countDocuments({
          targetId,
          eventType: 'view',
          ...(userId ? { $or: [{ userId }, { ipHash }] } : { ipHash }),
        });

        const isUnique = everViewed <= 1;

        if (article) {
          article.viewsCount = (article.viewsCount || 0) + 1;
          await article.save();
        }
        if (submission) {
          submission.viewsCount = (submission.viewsCount || 0) + 1;
          if (isUnique) {
            submission.uniqueViews = (submission.uniqueViews || 0) + 1;
          }
          await submission.save();
        }

        return NextResponse.json({
          success: true,
          action: 'view_recorded',
          isUnique,
          viewsCount: (article?.viewsCount ?? submission?.viewsCount ?? 1),
        });
      }

      return NextResponse.json({
        success: true,
        action: 'view_deduplicated',
        viewsCount: (article?.viewsCount ?? submission?.viewsCount ?? 1),
      });
    }

    // 2. LIKE / UNLIKE TOGGLE
    if (action === 'like') {
      if (!userId) {
        return NextResponse.json({ success: false, message: 'User must be authenticated to like' }, { status: 401 });
      }

      const existingLike = await EngagementLogModel.findOne({
        targetId,
        eventType: 'like',
        userId,
      });

      let liked = false;
      let newLikesCount = (article?.likesCount ?? submission?.likesCount ?? 0);

      if (existingLike) {
        // Remove like
        await EngagementLogModel.deleteOne({ _id: existingLike._id });
        newLikesCount = Math.max(0, newLikesCount - 1);
        liked = false;
      } else {
        // Add like
        await EngagementLogModel.create({
          targetId,
          targetType,
          eventType: 'like',
          userId,
          ipHash,
          sessionId: sessionId || undefined,
        });
        newLikesCount += 1;
        liked = true;
      }

      if (article) {
        article.likesCount = newLikesCount;
        await article.save();
      }
      if (submission) {
        submission.likesCount = newLikesCount;
        await submission.save();
      }

      return NextResponse.json({
        success: true,
        liked,
        likesCount: newLikesCount,
      });
    }

    // 3. SHARE TRACKING WITH ABUSE THROTTLE (5 min cooldown per session/IP)
    if (action === 'share') {
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentShare = await EngagementLogModel.findOne({
        targetId,
        eventType: 'share',
        ipHash,
        createdAt: { $gte: fiveMinsAgo },
      });

      let newSharesCount = article?.sharesCount ?? submission?.sharesCount ?? 0;

      if (!recentShare) {
        await EngagementLogModel.create({
          targetId,
          targetType,
          eventType: 'share',
          userId: userId || undefined,
          ipHash,
          sessionId: sessionId || undefined,
          platform: platform || 'other',
        });

        newSharesCount += 1;

        if (article) {
          article.sharesCount = newSharesCount;
          await article.save();
        }
        if (submission) {
          submission.sharesCount = newSharesCount;
          await submission.save();
        }
      }

      return NextResponse.json({
        success: true,
        sharesCount: newSharesCount,
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Engagement POST error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
