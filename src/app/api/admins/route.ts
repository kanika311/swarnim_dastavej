import { NextResponse } from 'next/server';
import { platformStore } from '@/lib/store';

export async function GET() {
  try {
    const admins = platformStore.getAdmins().map(({ password: _password, ...safe }) => safe);
    return NextResponse.json({
      success: true,
      data: admins
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch admin accounts' },
      { status: 500 }
    );
  }
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
    const newAdmin = platformStore.createAdminUser({
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: body.password || 'admin123@swarnim',
      role: body.role || 'admin',
      city: body.city || 'लखनऊ'
    });
    const { password: _password, ...safeAdmin } = newAdmin;
    return NextResponse.json({
      success: true,
      data: safeAdmin,
      message: 'New administrator created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create admin' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, newPassword, role, name, phone, city } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId is required' },
        { status: 400 }
      );
    }

    if (newPassword) {
      const ok = platformStore.changeUserPassword(userId, newPassword);
      if (!ok) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
    }

    if (role || name || phone || city) {
      platformStore.updateUser(userId, {
        ...(role ? { role } : {}),
        ...(name ? { name } : {}),
        ...(phone ? { phone } : {}),
        ...(city ? { city } : {})
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update admin account' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    const ok = platformStore.deleteUser(userId);
    if (!ok) {
      return NextResponse.json(
        {
          success: false,
          message: 'Admin account not found or could not be removed'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account removed successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete admin' },
      { status: 500 }
    );
  }
}
