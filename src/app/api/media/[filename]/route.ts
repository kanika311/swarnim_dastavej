import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import UploadedMediaModel from '@/models/UploadedMedia';
import path from 'path';
import { readFile, stat } from 'fs/promises';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;

  if (!filename || filename.includes('..') || filename.includes('/')) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  // 1. Try serving from local public/uploads directory if file exists on disk
  try {
    const localFilePath = path.join(process.cwd(), 'public', 'uploads', filename);
    await stat(localFilePath);
    const fileBuffer = await readFile(localFilePath);

    const ext = path.extname(filename).toLowerCase();
    const contentType =
      ext === '.webp'
        ? 'image/webp'
        : ext === '.png'
        ? 'image/png'
        : ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : ext === '.mp4'
        ? 'video/mp4'
        : ext === '.pdf'
        ? 'application/pdf'
        : 'application/octet-stream';

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    // File not on disk (e.g. running in serverless / Vercel with read-only FS)
  }

  // 2. Fetch from MongoDB Atlas UploadedMedia collection
  try {
    await connectToDatabase();
    const media = await UploadedMediaModel.findOne({ filename });

    if (!media || !media.data) {
      return new NextResponse('Media not found', { status: 404 });
    }

    return new NextResponse(new Uint8Array(media.data), {
      headers: {
        'Content-Type': media.contentType || 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving media from database:', error);
    return new NextResponse('Error retrieving media', { status: 500 });
  }
}
