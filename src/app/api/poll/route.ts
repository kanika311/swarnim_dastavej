import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET() {
  const poll = platformStore.getPoll();
  return NextResponse.json({ success: true, data: poll });
}

export async function POST(request: Request) {
  try {
    const { optionId } = await request.json();
    if (!optionId) {
      return NextResponse.json({ success: false, message: 'Option ID required' }, { status: 400 });
    }
    const updated = platformStore.votePoll(optionId);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error voting' }, { status: 500 });
  }
}
