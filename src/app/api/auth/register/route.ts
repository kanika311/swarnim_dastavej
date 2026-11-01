import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import UserModel from '@/models/User';
import { platformStore } from '@/lib/store';
import { UserRole } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const password = String(body.password || '').trim();
    const role: UserRole = (body.role as UserRole) || 'reader';
    const city = String(body.city || 'लखनऊ').trim();
    const preferredLanguage = body.preferredLanguage || 'hi';
    const kycStatus = body.kycStatus || (role === 'citizen_journalist' ? 'verified' : 'not_submitted');
    const kycDetails = body.kycDetails;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, message: 'नाम और ईमेल/मोबाइल नंबर आवश्यक है।' },
        { status: 400 }
      );
    }

    const userId = body.id || `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // 1. Try to check and save to MongoDB
    try {
      await connectToDatabase();
      const existingUser = await UserModel.findOne({
        $or: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : [])
        ]
      }).lean();

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'यह ईमेल या मोबाइल नंबर पहले से पंजीकृत है।' },
          { status: 409 }
        );
      }

      const created = await UserModel.create({
        id: userId,
        name,
        email: email || `${phone}@swarnim.local`,
        phone,
        password,
        role,
        city,
        preferredLanguage,
        kycStatus,
        kycDetails
      });

      const safe = {
        id: created.id,
        name: created.name,
        email: created.email,
        phone: created.phone,
        role: created.role as UserRole,
        city: created.city,
        preferredLanguage: created.preferredLanguage as 'hi' | 'en' | 'ur',
        kycStatus: created.kycStatus,
        kycDetails: created.kycDetails
      };

      try {
        platformStore.addUser({ ...safe, password });
      } catch {}

      return NextResponse.json({
        success: true,
        message: 'पंजीकरण सफल रहा।',
        data: safe
      }, { status: 201 });
    } catch (dbErr: any) {
      console.warn('MongoDB registration bypassed or unavailable, using platformStore:', dbErr?.message);
    }

    // 2. In-memory platformStore fallback
    const fallbackUser = {
      id: userId,
      name,
      email: email || `${phone}@swarnim.local`,
      phone,
      password,
      role,
      city,
      preferredLanguage: preferredLanguage as 'hi' | 'en' | 'ur',
      kycStatus,
      kycDetails
    };

    platformStore.addUser(fallbackUser);
    const { password: _p, ...safe } = fallbackUser;

    return NextResponse.json({
      success: true,
      message: 'पंजीकरण सफल रहा।',
      data: safe
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'पंजीकरण विफल रहा।' },
      { status: 500 }
    );
  }
}
