import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { connectToDatabase } from '@/lib/mongodb';
import UserModel from '@/models/User';

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

    let result = platformStore.authenticate(identifier, password);
    let user = result.user;

    // Check MongoDB if not found in platformStore
    if (!user) {
      try {
        await connectToDatabase();
        const clean = identifier.trim().toLowerCase();
        const digits = clean.replace(/\D/g, '');
        const dbUser = await UserModel.findOne({
          $or: [
            { email: clean },
            ...(digits.length >= 10 ? [{ phone: digits }] : [{ phone: clean }])
          ]
        }).lean();

        if (dbUser) {
          if ((dbUser as any).isBanned) {
            return NextResponse.json(
              { success: false, message: 'This account is blocked' },
              { status: 403 }
            );
          }
          if (dbUser.password && dbUser.password !== password) {
            return NextResponse.json(
              { success: false, message: 'Incorrect password' },
              { status: 401 }
            );
          }
          const { password: _p, ...safeUser } = dbUser;
          user = safeUser as any;
          try {
            platformStore.addUser({ ...safeUser, password } as any);
          } catch {}
        }
      } catch (dbErr: any) {
        console.warn('MongoDB login check error:', dbErr?.message);
      }
    }

    if (user) {
      const isStaffUser = user.role === 'admin' || user.role === 'super_admin' || user.role === 'editor';
      if (isStaffUser && !isStaffGate) {
        return NextResponse.json(
          { success: false, message: 'एडमिन लॉगिन मुख्य वेबसाइट पर उपलब्ध नहीं है।' },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: true, data: user });
    }

    if (result.status === 'banned') {
      return NextResponse.json(
        { success: false, message: 'This account is blocked' },
        { status: 403 }
      );
    }
    if (result.status === 'invalid') {
      return NextResponse.json(
        { success: false, message: 'Incorrect password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Account not found' },
      { status: 404 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 400 }
    );
  }
}
