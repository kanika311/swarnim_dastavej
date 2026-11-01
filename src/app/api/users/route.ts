import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';
import { connectToDatabase } from '@/lib/mongodb';
import UserModel from '@/models/User';

export async function GET() {
  let allUsers: any[] = [];
  try {
    await connectToDatabase();
    const dbUsers = await UserModel.find().sort({ createdAt: -1 }).lean().exec();
    const dbEmails = new Set(dbUsers.map(u => u.email?.toLowerCase()).filter(Boolean));
    const dbIds = new Set(dbUsers.map(u => u.id));

    const storeUsers = platformStore.getUsers().filter(
      u => !dbIds.has(u.id) && !dbEmails.has(u.email?.toLowerCase())
    );

    allUsers = [...dbUsers, ...storeUsers].map(({ password: _password, ...safe }: any) => safe);
  } catch (err) {
    allUsers = platformStore.getUsers().map(({ password: _password, ...safe }) => safe);
  }

  return NextResponse.json({ success: true, count: allUsers.length, data: allUsers });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || (!body.email && !body.phone)) {
      return NextResponse.json(
        { success: false, message: 'नाम और ईमेल/फ़ोन आवश्यक है।' },
        { status: 400 }
      );
    }

    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const allowed = ['citizen_journalist', 'staff_reporter', 'editor', 'reader', 'admin', 'super_admin'];
    const role = allowed.includes(body.role) ? body.role : 'reader';
    const userId = body.id || `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // Try DB first
    try {
      await connectToDatabase();
      const existing = await UserModel.findOne({
        $or: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : [])
        ]
      }).lean();

      if (existing) {
        return NextResponse.json(
          { success: false, message: 'यह ईमेल या मोबाइल नंबर पहले से पंजीकृत है।' },
          { status: 409 }
        );
      }

      const created = await UserModel.create({
        id: userId,
        name: body.name,
        email: email || `${phone}@swarnim.local`,
        phone: phone || undefined,
        password: body.password || 'reader123',
        role,
        city: body.city || 'लखनऊ',
        preferredLanguage: body.preferredLanguage || 'hi',
        kycStatus: role === 'citizen_journalist' ? 'verified' : (body.kycStatus || 'not_submitted'),
        kycDetails: body.kycDetails
      });

      const safe = {
        id: created.id,
        name: created.name,
        email: created.email,
        phone: created.phone,
        role: created.role,
        city: created.city,
        preferredLanguage: created.preferredLanguage,
        kycStatus: created.kycStatus,
        kycDetails: created.kycDetails
      };

      try {
        platformStore.addUser({ ...safe, password: body.password || 'reader123' });
      } catch {}

      return NextResponse.json({
        success: true,
        data: safe,
        message: 'उपयोगकर्ता खाता सफलतापूर्वक बनाया गया।'
      }, { status: 201 });
    } catch (dbErr: any) {
      console.warn('MongoDB user create fallback:', dbErr?.message);
    }

    // In-memory fallback
    const fallbackUser = {
      id: userId,
      name: body.name,
      email: email || `${phone}@swarnim.local`,
      phone: phone || undefined,
      password: body.password || 'reader123',
      role,
      city: body.city || 'लखनऊ',
      preferredLanguage: body.preferredLanguage || 'hi',
      kycStatus: role === 'citizen_journalist' ? 'verified' : (body.kycStatus || 'not_submitted'),
      kycDetails: body.kycDetails
    };

    platformStore.addUser(fallbackUser);
    const { password: _p, ...safe } = fallbackUser;

    return NextResponse.json({
      success: true,
      data: safe,
      message: 'उपयोगकर्ता खाता सफलतापूर्वक बनाया गया।'
    }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: 'खाता बनाने में त्रुटि हुई।' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, action, role, ...updateFields } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    if (typeof updateFields.password === 'string' && !updateFields.password.trim()) {
      delete updateFields.password;
    }

    // 1. Update in MongoDB
    try {
      await connectToDatabase();
      if (action === 'toggle_ban') {
        const existing = await UserModel.findOne({ id: userId });
        if (existing) {
          const isBanned = !(existing as any).isBanned;
          await UserModel.updateOne({ id: userId }, { $set: { isBanned } });
          const userStore = platformStore.toggleBanUser(userId);
          return NextResponse.json({
            success: true,
            message: isBanned ? 'खाता निष्क्रिय (banned) कर दिया गया।' : 'खाता पुनः सक्रिय (unbanned) किया गया।'
          });
        }
      }

      const dbUpdates: any = { ...updateFields };
      if (role) dbUpdates.role = role;
      const updated = await UserModel.findOneAndUpdate(
        { id: userId },
        { $set: dbUpdates },
        { returnDocument: 'after' }
      ).lean();

      if (updated) {
        platformStore.updateUser(userId, { ...updateFields, ...(role ? { role } : {}) });
        const { password: _password, ...safeUser } = updated;
        return NextResponse.json({
          success: true,
          message: 'User profile updated successfully',
          data: safeUser
        });
      }
    } catch (dbErr: any) {
      console.warn('MongoDB update user fallback:', dbErr?.message);
    }

    // 2. In-memory fallback
    if (action === 'toggle_ban') {
      const user = platformStore.toggleBanUser(userId);
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }
      const { password: _password, ...safeUser } = user;
      return NextResponse.json({
        success: true,
        message: user.isBanned ? 'User banned successfully' : 'User unbanned successfully',
        data: safeUser
      });
    }

    if (role) {
      platformStore.updateUserRole(userId, role);
    }

    const updatedUser = platformStore.updateUser(userId, { ...updateFields, ...(role ? { role } : {}) });
    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const { password: _password, ...safeUser } = updatedUser;
    return NextResponse.json({
      success: true,
      message: 'User profile updated successfully',
      data: safeUser
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      await UserModel.deleteOne({ id: userId });
    } catch (dbErr: any) {
      console.warn('MongoDB delete user error:', dbErr?.message);
    }

    platformStore.deleteUser(userId);

    return NextResponse.json({
      success: true,
      message: 'खाता सफलतापूर्वक हटा दिया गया।'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error removing user' }, { status: 500 });
  }
}
