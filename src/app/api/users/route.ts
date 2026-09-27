import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET() {
  const users = platformStore.getUsers().map(({ password: _password, ...safe }) => safe);
  return NextResponse.json({ success: true, count: users.length, data: users });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }
    const emailTaken = platformStore.getUsers().some(
      (u) => u.email.toLowerCase() === String(body.email).trim().toLowerCase()
    );
    if (emailTaken) {
      return NextResponse.json(
        { success: false, message: 'This email is already registered' },
        { status: 409 }
      );
    }
    const allowed = ['citizen_journalist', 'staff_reporter', 'editor', 'reader'];
    const role = allowed.includes(body.role) ? body.role : 'citizen_journalist';
    const created = platformStore.createAdminUser({
      name: body.name,
      email: String(body.email).trim(),
      phone: body.phone,
      password: body.password || 'journalist123',
      role,
      city: body.city || 'लखनऊ'
    });
    const { password: _password, ...safe } = created;
    return NextResponse.json({
      success: true,
      data: safe,
      message: 'Journalist account created'
    }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: 'Could not create journalist' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, action, role, ...updateFields } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

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

    if (typeof updateFields.password === 'string' && !updateFields.password.trim()) {
      delete updateFields.password;
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

    const exists = platformStore.getUsers().some((u) => u.id === userId);
    const deleted = platformStore.deleteUser(userId);
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: exists
            ? 'The last administrator account cannot be removed'
            : 'User not found'
        },
        { status: exists ? 400 : 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User account removed successfully'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error removing user' }, { status: 500 });
  }
}
