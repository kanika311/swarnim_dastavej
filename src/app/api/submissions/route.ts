import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { connectToDatabase } from '@/lib/mongodb';
import CitizenSubmissionModel from '@/models/CitizenSubmission';
import ArticleModel from '@/models/Article';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;

  const storeSubmissions = platformStore.getSubmissions({ status });
  let dbSubmissions: typeof storeSubmissions = [];

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const query: Record<string, unknown> = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      dbSubmissions = await CitizenSubmissionModel.find(query).sort({ createdAt: -1 }).lean().exec() as typeof storeSubmissions;

      // Sync engagement metrics from ArticleModel if available
      const publishedArticles = await ArticleModel.find({ status: 'published' }).lean();
      const articleMap = new Map(publishedArticles.map(a => [a.id, a]));
      const articleHeadlineMap = new Map(publishedArticles.map(a => [a.headline.trim().toLowerCase(), a]));

      dbSubmissions = dbSubmissions.map((sub: any) => {
        let matchingArt = sub.publishedArticleId ? articleMap.get(sub.publishedArticleId) : undefined;
        if (!matchingArt && sub.headline) {
          matchingArt = articleHeadlineMap.get(sub.headline.trim().toLowerCase());
        }
        if (matchingArt) {
          return {
            ...sub,
            publishedArticleId: matchingArt.id,
            viewsCount: Math.max(sub.viewsCount || 0, matchingArt.viewsCount || 0),
            likesCount: Math.max(sub.likesCount || 0, matchingArt.likesCount || 0),
            commentsCount: Math.max(sub.commentsCount || 0, matchingArt.commentsCount || 0),
            sharesCount: Math.max(sub.sharesCount || 0, matchingArt.sharesCount || 0),
          };
        }
        return sub;
      });
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'MongoDB submissions GET error';
    console.warn(message);
  }

  const seen = new Set(dbSubmissions.map((item) => item.id));
  const submissions = [
    ...dbSubmissions,
    ...storeSubmissions.filter((item) => !seen.has(item.id)),
  ];
  return NextResponse.json({ success: true, count: submissions.length, source: dbSubmissions.length ? 'merged' : 'store', data: submissions });
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
    const body = await request.json();
    const { id, action, comments, reviewerName = 'प्रधान संपादक' } = body;
    if (!id || !action) {
      return NextResponse.json({ success: false, message: 'ID and action are required' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // 1. Direct Edit by Admin/Editor
    if (action === 'edit' || action === 'update') {
      const updates = {
        headline: body.headline,
        subHeadline: body.subHeadline,
        body: body.body,
        category: body.category,
        city: body.city,
        language: body.language,
        editorComments: body.editorComments !== undefined ? body.editorComments : body.comments,
        status: body.status,
        updatedAt: timestamp
      };

      let updated = platformStore.updateSubmission(id, updates);

      try {
        const conn = await connectToDatabase();
        if (conn) {
          const subDoc = await CitizenSubmissionModel.findOne({ id }).exec();
          if (subDoc) {
            if (updates.headline) subDoc.headline = updates.headline;
            if (updates.subHeadline !== undefined) subDoc.subHeadline = updates.subHeadline;
            if (updates.body) subDoc.body = updates.body;
            if (updates.category) subDoc.category = updates.category;
            if (updates.city) subDoc.city = updates.city;
            if (updates.language) subDoc.language = updates.language;
            if (updates.editorComments !== undefined) subDoc.editorComments = updates.editorComments;
            if (updates.status) subDoc.status = updates.status;
            subDoc.updatedAt = timestamp;
            await subDoc.save();
            updated = subDoc.toObject() as any;
          }
        }
      } catch (dbErr: any) {
        console.warn('MongoDB edit submission error:', dbErr?.message);
      }

      if (!updated) {
        return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'खबर सफलतापूर्वक संपादित की गई।', data: updated });
    }

    // 2. Toggle Active / Inactive
    if (action === 'toggle_active') {
      const current = platformStore.getSubmissionById(id);
      const newStatus = (current?.status === 'approved') ? 'inactive' : 'approved';
      let updated = platformStore.updateSubmission(id, { 
        status: newStatus,
        editorComments: newStatus === 'inactive' ? 'व्यवस्थापक द्वारा निष्क्रिय (Inactive) किया गया' : (body.comments || 'सक्रिय (Active) व स्वीकृत')
      });

      try {
        const conn = await connectToDatabase();
        if (conn) {
          const subDoc = await CitizenSubmissionModel.findOne({ id }).exec();
          if (subDoc) {
            subDoc.status = newStatus;
            subDoc.updatedAt = timestamp;
            if (newStatus === 'inactive') {
              subDoc.editorComments = 'व्यवस्थापक द्वारा निष्क्रिय (Inactive) किया गया';
            }
            await subDoc.save();
            updated = subDoc.toObject() as any;

            if (newStatus === 'approved') {
              const articleDoc = new ArticleModel({
                id: `art-${Date.now()}`,
                slug: subDoc.headline.slice(0, 40).replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-').toLowerCase(),
                headline: subDoc.headline,
                subHeadline: subDoc.subHeadline || '',
                body: subDoc.body,
                excerpt: subDoc.body.slice(0, 150) + '...',
                category: subDoc.category || 'sultanpur',
                city: subDoc.city || 'सुल्तानपुर',
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
                tags: ['नागरिक पत्रकारिता', subDoc.city || 'सुल्तानपुर'],
                readingTimeMinutes: Math.max(1, Math.ceil(subDoc.body.length / 400)),
                status: 'published'
              });
              await articleDoc.save();
            }
          }
        }
      } catch (dbErr: any) {
        console.warn('MongoDB toggle_active error:', dbErr?.message);
      }

      if (!updated) {
        return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
      }

      return NextResponse.json({ 
        success: true, 
        message: newStatus === 'approved' ? 'खबर अब सक्रिय (Active) है।' : 'खबर निष्क्रिय (Inactive) कर दी गई है।', 
        data: updated 
      });
    }

    // 3. User Revise
    if (action === 'revise') {
      const revised = platformStore.reviseSubmission(id, body);
      let saved = revised;
      try {
        const conn = await connectToDatabase();
        if (conn) {
          const subDoc = await CitizenSubmissionModel.findOne({ id }).exec();
          if (subDoc) {
            subDoc.headline = body.headline || subDoc.headline;
            subDoc.subHeadline = body.subHeadline ?? subDoc.subHeadline;
            subDoc.body = body.body || subDoc.body;
            subDoc.category = body.category || subDoc.category;
            subDoc.city = body.city || subDoc.city;
            subDoc.media = body.media || subDoc.media;
            subDoc.geoTag = body.geoTag || subDoc.geoTag;
            subDoc.hasRecordedVideo = Boolean(body.hasRecordedVideo);
            subDoc.status = 'pending_review';
            subDoc.editorComments = '';
            subDoc.updatedAt = new Date().toISOString();
            await subDoc.save();
            saved = subDoc.toObject() as typeof revised;
          }
        }
      } catch (dbErr: unknown) {
        const message = dbErr instanceof Error ? dbErr.message : 'MongoDB revise error';
        console.warn(message);
      }
      if (!saved) {
        return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: saved, message: 'संशोधित खबर दोबारा समीक्षा हेतु भेज दी गई।' });
    }

    // 4. Review Actions (approve / reject / send_back)
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
              category: subDoc.category || 'sultanpur',
              city: subDoc.city || 'सुल्तानपुर',
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
              tags: ['नागरिक पत्रकारिता', subDoc.city || 'सुल्तानपुर'],
              readingTimeMinutes: Math.max(1, Math.ceil(subDoc.body.length / 400)),
              status: 'published'
            });
            await articleDoc.save();
            subDoc.publishedArticleId = articleDoc.id;
            await subDoc.save();
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('id');
    let id = queryId;

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {
        // body not present
      }
    }

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const removedStore = platformStore.deleteSubmission(id);
    let removedDb = false;

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const res = await CitizenSubmissionModel.deleteOne({ id }).exec();
        if (res.deletedCount) removedDb = true;
      }
    } catch (e: any) {
      console.warn('MongoDB submission delete error:', e?.message);
    }

    if (!removedStore && !removedDb) {
      return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'खबर सफलतापूर्वक हटा दी गई (Deleted).' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}
