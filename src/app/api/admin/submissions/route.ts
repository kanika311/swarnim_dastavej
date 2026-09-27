import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CitizenSubmissionModel from '@/models/CitizenSubmission';
import ArticleModel from '@/models/Article';
import { platformStore } from '@/lib/store';
import { INITIAL_SUBMISSIONS } from '@/lib/initialData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const query: any = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      const submissions = await CitizenSubmissionModel.find(query).sort({ createdAt: -1 }).lean().exec();
      if (submissions && submissions.length > 0) {
        return NextResponse.json({ success: true, source: 'mongodb', data: submissions });
      }
    }
  } catch (err: any) {
    console.warn('MongoDB submissions query error:', err?.message);
  }

  // Store fallback
  const data = platformStore.getSubmissions({ status: status || undefined });
  return NextResponse.json({ success: true, source: 'store', data });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, comments, reviewerName = 'प्रधान संपादक' } = body;

    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: 'Submisison ID और Action अनिवार्य हैं।' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    let updatedSub = null;

    // Try MongoDB first
    try {
      const conn = await connectToDatabase();
      if (conn) {
        let subDoc = await CitizenSubmissionModel.findOne({ id }).exec();
        
        // If not in MongoDB, create it from memory store first
        if (!subDoc) {
          const memSub = platformStore.getSubmissionById(id);
          if (memSub) {
            subDoc = new CitizenSubmissionModel(memSub);
            await subDoc.save();
          }
        }

        if (subDoc) {
          subDoc.status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'sent_back';
          subDoc.editorComments = comments;
          subDoc.reviewedBy = reviewerName;
          subDoc.reviewedAt = timestamp;
          subDoc.updatedAt = timestamp;
          await subDoc.save();
          updatedSub = subDoc.toObject();

          // If approved, automatically publish to Article collection in MongoDB!
          if (action === 'approve') {
            const articleId = `art-${Date.now()}`;
            const slug = subDoc.headline
              .slice(0, 40)
              .replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-')
              .toLowerCase();

            const newArticle = new ArticleModel({
              id: articleId,
              slug,
              headline: subDoc.headline,
              subHeadline: subDoc.subHeadline || '',
              body: subDoc.body,
              excerpt: subDoc.body.slice(0, 150) + '...',
              category: subDoc.category || 'sitapur',
              city: subDoc.city || 'सीतापुर',
              language: subDoc.language || 'hi',
              coverImage: subDoc.media?.[0]?.url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80',
              mediaGallery: subDoc.media,
              author: {
                id: subDoc.submittedBy?.id || 'citizen_user',
                name: `${subDoc.submittedBy?.name || 'नागरिक पत्रकार'} (सत्यापित ग्राउंड रिपोर्ट)`,
                role: 'citizen_journalist'
              },
              isBreaking: false,
              isTrending: true,
              isSponsored: false,
              publishedAt: timestamp,
              viewsCount: 1,
              likesCount: 0,
              commentsCount: 0,
              sharesCount: 0,
              tags: ['नागरिक पत्रकारिता', subDoc.city || 'सीतापुर', 'ग्राउंड रिपोर्ट'],
              readingTimeMinutes: Math.max(1, Math.ceil(subDoc.body.length / 400)),
              status: 'published'
            });

            await newArticle.save();
          }
        }
      }
    } catch (dbErr: any) {
      console.warn('MongoDB review error, applying memory store:', dbErr?.message);
    }

    // Also update in-memory store for instant UI sync
    const storeSub = platformStore.reviewSubmission(id, action, comments, reviewerName);

    return NextResponse.json({
      success: true,
      data: updatedSub || storeSub,
      message: action === 'approve' 
        ? 'खबर स्वीकृत कर ली गई है और मुख्य पृष्ठ पर प्रकाशित हो चुकी है!'
        : action === 'send_back'
        ? 'खबर संशोधन हेतु वापस भेज दी गई है।'
        : 'खबर अस्वीकृत कर दी गई है।'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'समीक्षा कार्रवाई में त्रुटि हुई।' },
      { status: 500 }
    );
  }
}
