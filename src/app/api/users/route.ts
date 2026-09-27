import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET() {
  const users = platformStore.getUsers();
  return NextResponse.json({ success: true, count: users.length, data: users });
}

export async function PUT(request: Request) {
  try {
    const { userId, role } = await request.json();
    const user = platformStore.updateUserRole(userId, role);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: `उपयोगकर्ता भूमिका '${role}' में परिवर्तित की गई।`, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}
