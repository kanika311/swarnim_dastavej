import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = String(body.identifier || '').trim();
    const password = String(body.password || '');

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Email/phone and password are required' },
        { status: 400 }
      );
    }

    const result = platformStore.authenticate(identifier, password);
    if (result.status === 'ok' && result.user) {
      return NextResponse.json({ success: true, data: result.user });
    }
    if (result.status === 'not_found') {
      return NextResponse.json(
        { success: false, message: 'Account not found' },
        { status: 404 }
      );
    }
    if (result.status === 'banned') {
      return NextResponse.json(
        { success: false, message: 'This account is blocked' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Incorrect password' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 400 }
    );
  }
}
