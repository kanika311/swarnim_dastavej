import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET() {
  const editions = platformStore.getEPaperEditions();
  return NextResponse.json({ success: true, count: editions.length, data: editions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEd = platformStore.addEPaperEdition(body);
    return NextResponse.json({ success: true, data: newEd }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}
