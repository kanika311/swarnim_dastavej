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

    const isStaffGate = Boolean(body.isStaffGate);

    const result = platformStore.authenticate(identifier, password);
    if (result.status === 'ok' && result.user) {
      const isStaffUser = result.user.role === 'admin' || result.user.role === 'super_admin' || result.user.role === 'editor';
      if (isStaffUser && !isStaffGate) {
        return NextResponse.json(
          { success: false, message: 'एडमिन लॉगिन मुख्य वेबसाइट पर उपलब्ध नहीं है।' },
          { status: 403 }
        );
      }
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
