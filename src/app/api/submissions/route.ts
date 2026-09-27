import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { connectToDatabase } from '@/lib/mongodb';
import CitizenSubmissionModel from '@/models/CitizenSubmission';
import ArticleModel from '@/models/Article';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const query: any = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      const submissions = await CitizenSubmissionModel.find(query).sort({ createdAt: -1 }).lean().exec();
      if (submissions && submissions.length > 0) {
        return NextResponse.json({ success: true, count: submissions.length, source: 'mongodb', data: submissions });
      }
    }
  } catch (e: any) {
    console.warn('MongoDB submissions GET error:', e?.message);
  }

  const submissions = platformStore.getSubmissions({ status });
  return NextResponse.json({ success: true, count: submissions.length, source: 'store', data: submissions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.headline || !body.body) {
      return NextResponse.json({ success: false, message: 'शीर्षक और विवरण अनिवार्य हैं।' }, { status: 400 });
    }

    const newSubmission = platformStore.createSubmission(body);

    // Save into MongoDB
    try {
      const conn = await connectToDatabase();
      if (conn) {
        const subDoc = new CitizenSubmissionModel(newSubmission);
        await subDoc.save();
        console.log(`✅ Citizen submission saved to MongoDB: ${newSubmission.id}`);
      }
    } catch (dbErr: any) {
      console.warn('MongoDB submission save error:', dbErr?.message);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'आपकी खबर संपादकीय समीक्षा हेतु सफलतापूर्वक भेज दी गई है। एडमिन द्वारा अनुमोदन के बाद ही मुख्य पृष्ठ पर दिखेगी।', 
      data: newSubmission 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, action, comments, reviewerName = 'प्रधान संपादक' } = await request.json();
    if (!id || !action) {
      return NextResponse.json({ success: false, message: 'ID and action are required' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    let updated = platformStore.reviewSubmission(id, action, comments, reviewerName);

    // Update in MongoDB
    try {
      const conn = await connectToDatabase();
      if (conn) {
        const subDoc = await CitizenSubmissionModel.findOne({ id }).exec();
        if (subDoc) {
          subDoc.status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'sent_back';
          subDoc.editorComments = comments;
          subDoc.reviewedBy = reviewerName;
          subDoc.reviewedAt = timestamp;
          subDoc.updatedAt = timestamp;
          await subDoc.save();
          updated = subDoc.toObject() as any;

          // If approved, create published article in MongoDB
          if (action === 'approve') {
            const articleDoc = new ArticleModel({
              id: `art-${Date.now()}`,
              slug: subDoc.headline.slice(0, 40).replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-').toLowerCase(),
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
              tags: ['नागरिक पत्रकारिता', subDoc.city || 'सीतापुर'],
              readingTimeMinutes: Math.max(1, Math.ceil(subDoc.body.length / 400)),
              status: 'published'
            });
            await articleDoc.save();
          }
        }
      }
    } catch (dbErr: any) {
      console.warn('MongoDB review error:', dbErr?.message);
    }

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: action === 'approve' ? 'खबर स्वीकृत कर प्रकाशित की गई।' : `खबर स्थिति को '${action}' में अद्यतित किया गया।`, 
      data: updated 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}
