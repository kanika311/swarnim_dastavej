import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import WeeklyContestModel from '@/models/WeeklyContest';
import CitizenSubmissionModel from '@/models/CitizenSubmission';
import ArticleModel from '@/models/Article';
import { calculateContestScore, DEFAULT_SCORING_RULES } from '@/lib/engagement';

export async function GET() {
  try {
    await connectToDatabase();
    const contests = await WeeklyContestModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: contests });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      startDate,
      endDate,
      prizes,
      scoringRules,
      eligibilityRules,
      status = 'draft',
      createdBy = 'admin',
    } = body;

    if (!title || !startDate || !endDate) {
      return NextResponse.json({ success: false, message: 'प्रतियोगिता का नाम, आरंभ और समाप्ति तिथि अनिवार्य हैं।' }, { status: 400 });
    }

    await connectToDatabase();

    // If new contest is created as active, deactivate previous active contests
    if (status === 'active') {
      await WeeklyContestModel.updateMany({ status: 'active' }, { status: 'completed' });
    }

    const contestId = `contest-${Date.now()}`;
    const newContest = await WeeklyContestModel.create({
      id: contestId,
      title: title.trim(),
      description: description?.trim() || '',
      startDate,
      endDate,
      status,
      prizes: prizes && prizes.length > 0 ? prizes : [
        { rank: 1, title: '🥇 1st Prize - सर्वश्रेष्ठ ज़मीनी पत्रकार', amount: 5000, icon: '🥇' },
        { rank: 2, title: '🥈 2nd Prize - उत्कृष्ट रिपोर्टर', amount: 3000, icon: '🥈' },
        { rank: 3, title: '🥉 3rd Prize - विशेष प्रेरणा पुरस्कार', amount: 1500, icon: '🥉' },
      ],
      scoringRules: scoringRules || DEFAULT_SCORING_RULES,
      eligibilityRules: eligibilityRules || {
        minPublishedReports: 1,
        minViews: 0,
        eligibleRoles: ['citizen_journalist', 'staff_journalist'],
      },
      disqualifiedUserIds: [],
      createdBy,
    });

    return NextResponse.json({
      success: true,
      message: 'साप्ताहिक पत्रकार प्रतियोगिता सफलतापूर्वक बनाई गई।',
      data: newContest,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Admin contest create error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, action, disqualifiedUserId, adminName = 'Admin', ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Contest ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const contest = await WeeklyContestModel.findOne({ id });
    if (!contest) {
      return NextResponse.json({ success: false, message: 'Contest not found' }, { status: 404 });
    }

    // 1. ACTIVATE CONTEST
    if (action === 'activate') {
      await WeeklyContestModel.updateMany({ status: 'active', id: { $ne: id } }, { status: 'completed' });
      contest.status = 'active';
      await contest.save();
      return NextResponse.json({ success: true, message: 'प्रतियोगिता सक्रिय कर दी गई है।', data: contest });
    }

    // 2. COMPLETE CONTEST
    if (action === 'complete') {
      contest.status = 'completed';
      await contest.save();
      return NextResponse.json({ success: true, message: 'प्रतियोगिता समाप्त कर दी गई है।', data: contest });
    }

    // 3. DISQUALIFY PARTICIPANT
    if (action === 'disqualify') {
      if (!disqualifiedUserId) {
        return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
      }
      if (!contest.disqualifiedUserIds) contest.disqualifiedUserIds = [];
      if (!contest.disqualifiedUserIds.includes(disqualifiedUserId)) {
        contest.disqualifiedUserIds.push(disqualifiedUserId);
      }
      await contest.save();
      return NextResponse.json({ success: true, message: 'प्रतिभागी को प्रतियोगिता से अयोग्य घोषित किया गया।', data: contest });
    }

    // 4. FINALIZE WINNERS
    if (action === 'finalize_winners') {
      // Calculate top ranks server-side
      const disqualified = new Set(contest.disqualifiedUserIds || []);
      const [submissions, articles] = await Promise.all([
        CitizenSubmissionModel.find({ status: 'approved' }).lean(),
        ArticleModel.find({ status: 'published' }).lean(),
      ]);

      const authorMap = new Map<string, any>();
      submissions.forEach((sub) => {
        const uId = sub.submittedBy?.id;
        if (!uId || disqualified.has(uId)) return;
        const ex = authorMap.get(uId) || {
          userId: uId,
          userName: sub.submittedBy.name,
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

      articles.forEach((art) => {
        const uId = art.author?.id;
        if (!uId || disqualified.has(uId)) return;
        const ex = authorMap.get(uId);
        if (ex) {
          ex.views = Math.max(ex.views, art.viewsCount || 0);
          ex.likes = Math.max(ex.likes, art.likesCount || 0);
          ex.comments = Math.max(ex.comments, art.commentsCount || 0);
          ex.shares = Math.max(ex.shares, art.sharesCount || 0);
        } else {
          authorMap.set(uId, {
            userId: uId,
            userName: art.author.name,
            district: art.city || 'सुल्तानपुर',
            publishedReports: 1,
            views: art.viewsCount || 0,
            likes: art.likesCount || 0,
            comments: art.commentsCount || 0,
            shares: art.sharesCount || 0,
          });
        }
      });

      const entries = Array.from(authorMap.values()).map((author) => ({
        ...author,
        score: calculateContestScore(author, contest.scoringRules),
      }));

      entries.sort((a, b) => b.score - a.score || b.views - a.views);

      const confirmedWinners = (contest.prizes || []).map((prize) => {
        const winnerEntry = entries[prize.rank - 1];
        return {
          rank: prize.rank,
          userId: winnerEntry?.userId || 'unknown',
          userName: winnerEntry?.userName || 'अघोषित',
          district: winnerEntry?.district || 'सुल्तानपुर',
          score: winnerEntry?.score || 0,
          prizeTitle: prize.title,
          prizeAmount: prize.amount || 0,
          prizeType: (prize as any).type || (prize.amount && prize.amount > 0 ? 'cash' : 'certificate'),
          rewardText: (prize as any).rewardText || '',
          certificateUrl: (prize as any).certificateUrl || '',
          confirmedAt: new Date().toISOString(),
        };
      });

      contest.winners = confirmedWinners;
      contest.status = 'completed';
      contest.finalizedBy = adminName;
      contest.finalizedAt = new Date().toISOString();
      await contest.save();

      return NextResponse.json({
        success: true,
        message: 'विजेताओं की आधिकारिक पुष्टि कर दी गई है और परिणाम प्रकाशित हो गए हैं!',
        data: contest,
      });
    }

    // 5. GENERAL UPDATE
    if (updates.title) contest.title = updates.title;
    if (updates.description !== undefined) contest.description = updates.description;
    if (updates.startDate) contest.startDate = updates.startDate;
    if (updates.endDate) contest.endDate = updates.endDate;
    if (updates.prizes) contest.prizes = updates.prizes;
    if (updates.scoringRules) contest.scoringRules = updates.scoringRules;
    if (updates.eligibilityRules) contest.eligibilityRules = updates.eligibilityRules;
    if (updates.status) contest.status = updates.status;

    await contest.save();

    return NextResponse.json({
      success: true,
      message: 'प्रतियोगिता विवरण सफलतापूर्वक अपडेट किया गया।',
      data: contest,
    });
  } catch (error: any) {
    console.error('Admin contest update error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    await WeeklyContestModel.deleteOne({ id });

    return NextResponse.json({ success: true, message: 'प्रतियोगिता सफलतापूर्वक हटा दी गई।' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
