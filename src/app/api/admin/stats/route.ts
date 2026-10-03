import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ArticleModel from '@/models/Article';
import CitizenSubmissionModel from '@/models/CitizenSubmission';
import UserModel from '@/models/User';
import EPaperEditionModel from '@/models/EPaperEdition';
import { INITIAL_SUBMISSIONS, INITIAL_USERS, INITIAL_EPAPER_EDITIONS } from '@/lib/initialData';

export async function GET() {
  try {
    const conn = await connectToDatabase();

    if (conn) {
      const [
        totalArticles,
        pendingSubmissions,
        approvedSubmissions,
        totalReaders,
        totalJournalists,
        totalEPaperEditions,
        recentSubmissions
      ] = await Promise.all([
        ArticleModel.countDocuments({ status: 'published' }).exec(),
        CitizenSubmissionModel.countDocuments({ status: 'pending_review' }).exec(),
        CitizenSubmissionModel.countDocuments({ status: 'approved' }).exec(),
        UserModel.countDocuments({ role: 'reader' }).exec(),
        UserModel.countDocuments({ role: 'citizen_journalist' }).exec(),
        EPaperEditionModel.countDocuments().exec(),
        CitizenSubmissionModel.find().sort({ createdAt: -1 }).limit(5).lean().exec()
      ]);

      return NextResponse.json({
        success: true,
        source: 'mongodb',
        data: {
          articlesCount: totalArticles,
          pendingSubmissionsCount: pendingSubmissions,
          approvedSubmissionsCount: approvedSubmissions,
          readersCount: totalReaders || 1,
          journalistsCount: totalJournalists || 1,
          epaperEditionsCount: totalEPaperEditions || INITIAL_EPAPER_EDITIONS.length,
          recentSubmissions
        }
      });
    }
  } catch (err: any) {
    console.warn('MongoDB stats query fallback to memory:', err?.message);
  }

  // Graceful fallback to initial data
  return NextResponse.json({
    success: true,
    source: 'memory_fallback',
    data: {
      articlesCount: 0,
      pendingSubmissionsCount: INITIAL_SUBMISSIONS.filter(s => s.status === 'pending_review').length,
      approvedSubmissionsCount: INITIAL_SUBMISSIONS.filter(s => s.status === 'approved').length,
      readersCount: INITIAL_USERS.filter(u => u.role === 'reader').length,
      journalistsCount: INITIAL_USERS.filter(u => u.role === 'citizen_journalist').length,
      epaperEditionsCount: INITIAL_EPAPER_EDITIONS.length,
      recentSubmissions: INITIAL_SUBMISSIONS.slice(0, 5)
    }
  });
}
