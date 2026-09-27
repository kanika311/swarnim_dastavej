import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const submissions = platformStore.getSubmissions({ status });
  return NextResponse.json({ success: true, count: submissions.length, data: submissions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.headline || !body.body) {
      return NextResponse.json({ success: false, message: 'शीर्षक और विवरण अनिवार्य हैं।' }, { status: 400 });
    }
    const newSubmission = platformStore.createSubmission(body);
    return NextResponse.json({ 
      success: true, 
      message: 'आपकी खबर संपादकीय समीक्षा हेतु सफलतापूर्वक भेज दी गई है।', 
      data: newSubmission 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, action, comments, reviewerName } = await request.json();
    if (!id || !action) {
      return NextResponse.json({ success: false, message: 'ID and action are required' }, { status: 400 });
    }
    const updated = platformStore.reviewSubmission(id, action, comments, reviewerName);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
    }
    return NextResponse.json({ 
      success: true, 
      message: `खबर स्थिति को '${action}' में अद्यतित किया गया।`, 
      data: updated 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}
