import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET() {
  const grievances = platformStore.getGrievances();
  return NextResponse.json({ success: true, count: grievances.length, data: grievances });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.complainantName || !body.complaintDetails) {
      return NextResponse.json({ success: false, message: 'नाम और शिकायत विवरण अनिवार्य हैं।' }, { status: 400 });
    }
    const newGrv = platformStore.createGrievance(body);
    return NextResponse.json({ 
      success: true, 
      message: 'आपकी शिकायत दर्ज कर ली गई है। 15 कार्यदिवसों के भीतर नियमानुसार निस्तारण किया जाएगा।',
      tokenNumber: newGrv.tokenNumber,
      data: newGrv 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status, resolutionNotes } = await request.json();
    const updated = platformStore.resolveGrievance(id, status, resolutionNotes);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Complaint not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'शिकायत का निस्तारण अद्यतित किया गया।', data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}
