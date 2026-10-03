import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import WeeklyContestModel from '@/models/WeeklyContest';
import CitizenSubmissionModel from '@/models/CitizenSubmission';
import ArticleModel from '@/models/Article';
import { calculateContestScore, DEFAULT_SCORING_RULES } from '@/lib/engagement';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const contestId = searchParams.get('contestId');

    await connectToDatabase();

    // 1. Get Contest
    let contest = contestId 
      ? await WeeklyContestModel.findOne({ id: contestId }).lean()
      : await WeeklyContestModel.findOne({ status: 'active' }).sort({ createdAt: -1 }).lean();

    if (!contest) {
      contest = await WeeklyContestModel.findOne().sort({ createdAt: -1 }).lean();
    }

    const scoringRules = contest?.scoringRules || DEFAULT_SCORING_RULES;
    const disqualified = new Set(contest?.disqualifiedUserIds || []);

    // 2. Fetch approved submissions and articles
    const [submissions, articles] = await Promise.all([
      CitizenSubmissionModel.find({ status: 'approved' }).lean(),
      ArticleModel.find({ status: 'published' }).lean(),
    ]);

    // 3. Aggregate metrics by Author/User
    // Key: userId
    const authorMap = new Map<string, {
      userId: string;
      userName: string;
      district: string;
      avatarUrl?: string;
      publishedReports: number;
      views: number;
      likes: number;
      comments: number;
      shares: number;
    }>();

    // Aggregate from submissions
    submissions.forEach((sub) => {
      const uId = sub.submittedBy?.id;
      if (!uId || disqualified.has(uId)) return;

      const existing = authorMap.get(uId) || {
        userId: uId,
        userName: sub.submittedBy.name || 'नागरिक पत्रकार',
        district: sub.submittedBy.district || sub.city || 'सीतापुर',
        publishedReports: 0,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      };

      existing.publishedReports += 1;
      existing.views += (sub.viewsCount || 0);
      existing.likes += (sub.likesCount || 0);
      existing.comments += (sub.commentsCount || 0);
      existing.shares += (sub.sharesCount || 0);

      authorMap.set(uId, existing);
    });

    // Also check articles published under authors (deduplicating if linked)
    articles.forEach((art) => {
      const uId = art.author?.id;
      if (!uId || disqualified.has(uId)) return;

      const existing = authorMap.get(uId);
      if (existing) {
        // If article has higher views/likes than submission recorded, take max to avoid duplicate summation
        existing.views = Math.max(existing.views, art.viewsCount || 0);
        existing.likes = Math.max(existing.likes, art.likesCount || 0);
        existing.comments = Math.max(existing.comments, art.commentsCount || 0);
        existing.shares = Math.max(existing.shares, art.sharesCount || 0);
      } else {
        authorMap.set(uId, {
          userId: uId,
          userName: art.author.name || 'पत्रकार',
          district: art.city || 'सीतापुर',
          avatarUrl: art.author.avatarUrl,
          publishedReports: 1,
          views: art.viewsCount || 0,
          likes: art.likesCount || 0,
          comments: art.commentsCount || 0,
          shares: art.sharesCount || 0,
        });
      }
    });

    // 4. Calculate Scores and Sort
    const entries = Array.from(authorMap.values()).map((author) => {
      const score = calculateContestScore(
        {
          views: author.views,
          likes: author.likes,
          comments: author.comments,
          shares: author.shares,
          publishedReports: author.publishedReports,
        },
        scoringRules
      );

      return {
        ...author,
        score,
      };
    });

    // Sort descending by score, then views, then reports
    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.views !== a.views) return b.views - a.views;
      return b.publishedReports - a.publishedReports;
    });

    // 5. Assign Ranks and Prizes
    const prizes = contest?.prizes || [];
    const leaderboard = entries.map((entry, index) => {
      const rank = index + 1;
      const prize = prizes.find((p) => p.rank === rank);
      return {
        rank,
        userId: entry.userId,
        userName: entry.userName,
        district: entry.district,
        avatarUrl: entry.avatarUrl,
        publishedReports: entry.publishedReports,
        views: entry.views,
        likes: entry.likes,
        comments: entry.comments,
        shares: entry.shares,
        score: entry.score,
        prizeTitle: prize ? prize.title : undefined,
        prizeAmount: prize ? prize.amount : undefined,
        prizeType: prize ? (prize as any).type : undefined,
        rewardText: prize ? (prize as any).rewardText : undefined,
        certificateUrl: prize ? (prize as any).certificateUrl : undefined,
      };
    });

    // 6. Find current user rank and nearby competitors
    let userRank = 0;
    let userScore = 0;
    let userEntry = null;
    let pointsToNextRank = 0;
    let nearbyRankings: typeof leaderboard = [];
    let motivationMessage = '';

    if (userId) {
      const userIndex = leaderboard.findIndex((item) => item.userId === userId);
      if (userIndex !== -1) {
        userEntry = leaderboard[userIndex];
        userRank = userEntry.rank;
        userScore = userEntry.score;

        if (userIndex > 0) {
          const aheadEntry = leaderboard[userIndex - 1];
          pointsToNextRank = Math.max(1, (aheadEntry.score - userScore) + 1);
          motivationMessage = `आप वर्तमान में #${userRank} स्थान पर हैं। #${aheadEntry.rank} से आगे निकलने के लिए केवल ${pointsToNextRank} अंकों की आवश्यकता है!`;
        } else {
          motivationMessage = `शानदार! आप वर्तमान में लीडरबोर्ड पर शीर्ष रैंक #1 पर हैं! 🏆`;
        }

        // Nearby slice: 2 above, current, 2 below
        const start = Math.max(0, userIndex - 2);
        const end = Math.min(leaderboard.length, userIndex + 3);
        nearbyRankings = leaderboard.slice(start, end);
      } else {
        motivationMessage = 'अपनी पहली खबर प्रकाशित कराएं और साप्ताहिक प्रतियोगिता में शामिल हों!';
        nearbyRankings = leaderboard.slice(0, 5);
      }
    } else {
      nearbyRankings = leaderboard.slice(0, 5);
    }

    return NextResponse.json({
      success: true,
      data: {
        contest,
        totalParticipants: leaderboard.length,
        leaderboard,
        userRank,
        userScore,
        userEntry,
        pointsToNextRank,
        nearbyRankings,
        motivationMessage,
      },
    });
  } catch (error: any) {
    console.error('Contest leaderboard error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
