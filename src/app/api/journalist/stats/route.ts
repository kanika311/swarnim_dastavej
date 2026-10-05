import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CitizenSubmissionModel from '@/models/CitizenSubmission';
import WeeklyContestModel from '@/models/WeeklyContest';
import ArticleModel from '@/models/Article';
import { calculateContestScore, DEFAULT_SCORING_RULES } from '@/lib/engagement';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Fetch user's submissions
    const userSubs = await CitizenSubmissionModel.find({
      $or: [{ 'submittedBy.id': userId }, { 'submittedBy.name': userId }],
    }).lean();

    const totalReports = userSubs.length;
    const approvedSubs = userSubs.filter((s) => s.status === 'approved');
    const publishedReports = approvedSubs.length;

    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;

    approvedSubs.forEach((sub) => {
      totalViews += (sub.viewsCount || 0);
      totalLikes += (sub.likesCount || 0);
      totalComments += (sub.commentsCount || 0);
      totalShares += (sub.sharesCount || 0);
    });

    // Also check any articles authored by this user
    const authoredArticles = await ArticleModel.find({ 'author.id': userId }).lean();
    if (authoredArticles.length > 0 && publishedReports === 0) {
      authoredArticles.forEach((art) => {
        totalViews += (art.viewsCount || 0);
        totalLikes += (art.likesCount || 0);
        totalComments += (art.commentsCount || 0);
        totalShares += (art.sharesCount || 0);
      });
    }

    // 2. Fetch Active Contest & Leaderboard
    const activeContest = await WeeklyContestModel.findOne({ status: 'active' }).sort({ createdAt: -1 }).lean()
      || await WeeklyContestModel.findOne().sort({ createdAt: -1 }).lean();

    const scoringRules = activeContest?.scoringRules || DEFAULT_SCORING_RULES;

    // Leaderboard calculation across all approved submissions
    const allApproved = await CitizenSubmissionModel.find({ status: 'approved' }).lean();
    const authorMap = new Map<string, {
      userId: string;
      userName: string;
      district: string;
      publishedReports: number;
      views: number;
      likes: number;
      comments: number;
      shares: number;
    }>();

    allApproved.forEach((sub) => {
      const uId = sub.submittedBy?.id;
      if (!uId) return;
      const ex = authorMap.get(uId) || {
        userId: uId,
        userName: sub.submittedBy.name || 'नागरिक पत्रकार',
        district: sub.submittedBy.district || sub.city || 'सुल्तानपुर',
        publishedReports: 0,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      };
      ex.publishedReports += 1;
      ex.views += (sub.viewsCount || 0);
      ex.likes += (sub.likesCount || 0);
      ex.comments += (sub.commentsCount || 0);
      ex.shares += (sub.sharesCount || 0);
      authorMap.set(uId, ex);
    });

    const leaderboard = Array.from(authorMap.values()).map((author) => {
      const score = calculateContestScore(author, scoringRules);
      return { ...author, score };
    });

    leaderboard.sort((a, b) => b.score - a.score || b.views - a.views);

    const userIndex = leaderboard.findIndex((item) => item.userId === userId);
    let weeklyRank = userIndex !== -1 ? userIndex + 1 : (publishedReports > 0 ? leaderboard.length + 1 : 0);
    
    // User score calculated server-side
    const weeklyScore = calculateContestScore(
      {
        views: totalViews,
        likes: totalLikes,
        comments: totalComments,
        shares: totalShares,
        publishedReports,
      },
      scoringRules
    );

    let pointsToNextRank = 0;
    let motivationMessage = 'अपनी खबरें शेयर करें और अधिक पाठकों तक पहुंचाकर अंक अर्जित करें!';

    if (userIndex > 0) {
      const ahead = leaderboard[userIndex - 1];
      pointsToNextRank = Math.max(1, (ahead.score - weeklyScore) + 1);
      motivationMessage = `आप वर्तमान में #${weeklyRank} पर हैं। #${ahead.userName ? ahead.userName : '#' + (weeklyRank - 1)} से आगे निकलने के लिए केवल ${pointsToNextRank} अंक दूर हैं!`;
    } else if (userIndex === 0) {
      motivationMessage = 'शानदार! आप वर्तमान में लीडरबोर्ड पर प्रथम स्थान (#1) पर हैं! 🏆';
    }

    return NextResponse.json({
      success: true,
      data: {
        totalReports,
        publishedReports,
        totalViews,
        totalLikes,
        totalComments,
        totalShares,
        weeklyRank,
        weeklyScore,
        viewsThisWeek: totalViews,
        pointsToNextRank,
        motivationMessage,
        activeContest,
      },
    });
  } catch (error: any) {
    console.error('Journalist stats error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
