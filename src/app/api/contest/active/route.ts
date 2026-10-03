import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import WeeklyContestModel, { IWeeklyContest } from '@/models/WeeklyContest';
import { DEFAULT_SCORING_RULES } from '@/lib/engagement';

export async function GET() {
  try {
    await connectToDatabase();

    // Find currently active contest
    let activeContest = await WeeklyContestModel.findOne({ status: 'active' })
      .sort({ createdAt: -1 })
      .lean();

    // If no active contest exists, initialize one automatically so the platform always has a live challenge
    if (!activeContest) {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
      endOfWeek.setHours(23, 59, 59, 999);

      const seededContest = await WeeklyContestModel.create({
        id: `contest-${Date.now()}`,
        title: 'साप्ताहिक नागरिक पत्रकार चैलेंज (Weekly Citizen Journalist Challenge)',
        description: 'सटीक ज़मीनी रिपोर्ट प्रस्तुत करें और वास्तविक पाठक सहभागिता (व्यूज़, लाइक्स, टिप्पणियाँ, शेयर्स) से शानदार पुरस्कार जीतें।',
        startDate: startOfWeek.toISOString(),
        endDate: endOfWeek.toISOString(),
        status: 'active',
        prizes: [
          { rank: 1, title: '🥇 1st Prize - सर्वश्रेष्ठ ज़मीनी पत्रकार', amount: 5000, icon: '🥇' },
          { rank: 2, title: '🥈 2nd Prize - उत्कृष्ट रिपोर्टर', amount: 3000, icon: '🥈' },
          { rank: 3, title: '🥉 3rd Prize - विशेष प्रेरणा पुरस्कार', amount: 1500, icon: '🥉' },
        ],
        scoringRules: DEFAULT_SCORING_RULES,
        eligibilityRules: {
          minPublishedReports: 1,
          minViews: 0,
          eligibleRoles: ['citizen_journalist', 'staff_journalist'],
        },
        disqualifiedUserIds: [],
        createdBy: 'admin',
      });

      activeContest = seededContest.toObject();
    }

    return NextResponse.json({
      success: true,
      data: activeContest,
    });
  } catch (error: any) {
    console.error('Active contest GET error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
