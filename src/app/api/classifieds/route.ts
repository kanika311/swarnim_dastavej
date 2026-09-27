import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET() {
  const classifieds = platformStore.getClassifieds();
  return NextResponse.json({ success: true, count: classifieds.length, data: classifieds });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newClassified = platformStore.addClassified(body);
    return NextResponse.json({ success: true, data: newClassified }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}
