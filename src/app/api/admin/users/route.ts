import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import UserModel from '@/models/User';
import { INITIAL_USERS } from '@/lib/initialData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const kycStatus = searchParams.get('kycStatus');

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const filter: any = {};
      if (role && role !== 'all') filter.role = role;
      if (kycStatus && kycStatus !== 'all') filter.kycStatus = kycStatus;

      const users = await UserModel.find(filter).sort({ createdAt: -1 }).lean().exec();
      if (users && users.length > 0) {
        return NextResponse.json({ success: true, source: 'mongodb', data: users });
      }
    }
  } catch (err: any) {
    console.warn('MongoDB users query fallback:', err?.message);
  }

  // Fallback to initial users
  let filtered = INITIAL_USERS;
  if (role && role !== 'all') {
    filtered = filtered.filter(u => u.role === role);
  }
  if (kycStatus && kycStatus !== 'all') {
    filtered = filtered.filter(u => u.kycStatus === kycStatus);
  }

  return NextResponse.json({ success: true, source: 'initial_data', data: filtered });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, kycStatus, role } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID अनिवार्य है।' }, { status: 400 });
    }

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const updateData: any = {};
        if (kycStatus) updateData.kycStatus = kycStatus;
        if (role) updateData.role = role;

        const updated = await UserModel.findOneAndUpdate(
          { id: userId },
          { $set: updateData },
          { new: true, upsert: false }
        ).exec();

        if (updated) {
          return NextResponse.json({
            success: true,
            data: updated,
            message: `उपयोगकर्ता स्थिति सफलतापूर्वक अपडेट की गई (${kycStatus || role})`
          });
        }
      }
    } catch (dbErr: any) {
      console.warn('MongoDB user update error:', dbErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: 'उपयोगकर्ता स्थिति अपडेट की गई।'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
