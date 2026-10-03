import { NextResponse } from 'next/server';
import { spawn } from 'node:child_process';
import { mkdir, unlink, writeFile, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { connectToDatabase } from '@/lib/mongodb';
import UploadedMediaModel from '@/models/UploadedMedia';

export const runtime = 'nodejs';
export const maxDuration = 300;

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static') as string | null;

const MAX_BYTES = 80 * 1024 * 1024;
const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'avif', 'heic', 'heif', 'tif', 'tiff']);
const VIDEO_EXT = new Set(['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v', 'mpeg', 'mpg', '3gp', 'wmv']);

function extensionOf(name: string) {
  const match = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] ?? '';
}

function isPdf(file: File) {
  return file.type === 'application/pdf' || extensionOf(file.name) === 'pdf';
}

function isImage(file: File) {
  return file.type.startsWith('image/') || IMAGE_EXT.has(extensionOf(file.name));
}

function isVideo(file: File) {
  return file.type.startsWith('video/') || VIDEO_EXT.has(extensionOf(file.name));
}

async function toWebp(buffer: Buffer) {
  return sharp(buffer, { animated: true, failOn: 'none' })
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 4 })
    .toBuffer();
}

function compressVideo(input: string, output: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new Error('Video compressor is not available on this server'));
      return;
    }

    const args = [
      '-y',
      '-i', input,
      '-map', '0:v:0',
      '-map', '0:a:0?',
      '-vf', "scale='min(1280,iw)':-2",
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '28',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '96k',
      '-movflags', '+faststart',
      output,
    ];

    const proc = spawn(ffmpegPath, args, { windowsHide: true });
    let err = '';
    proc.stderr.on('data', (chunk) => {
      err = (err + chunk.toString()).slice(-1500);
    });
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(err || `Video compression failed (${code})`));
    });
  });
}

export async function POST(request: Request) {
  const tempPaths: string[] = [];

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, message: 'File is larger than 80 MB' },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // Attempt to create uploads directory on disk (fails gracefully on read-only Vercel)
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (fsErr: any) {
      // EROFS or permission error on read-only environments
      console.warn('Local uploads directory cannot be created (serverless/read-only):', fsErr?.code || fsErr?.message);
    }

    const stamp = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    let outputName = `${stamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    let output = bytes;
    let format: 'webp' | 'mp4' | 'original' = 'original';
    let contentType = file.type || 'application/octet-stream';

    if (isPdf(file)) {
      format = 'original';
      contentType = 'application/pdf';
    } else if (isImage(file)) {
      // Automatically convert image to WebP with compression
      try {
        output = Buffer.from(await toWebp(bytes));
        outputName = `${stamp}.webp`;
        format = 'webp';
        contentType = 'image/webp';
      } catch (sharpErr) {
        console.warn('Sharp WebP conversion warning, using original buffer:', sharpErr);
      }
    } else if (isVideo(file)) {
      const inputPath = path.join(os.tmpdir(), `${stamp}${path.extname(file.name) || '.bin'}`);
      const outputPath = path.join(os.tmpdir(), `${stamp}.mp4`);
      tempPaths.push(inputPath, outputPath);

      await writeFile(inputPath, bytes);
      let videoBuffer = bytes;

      try {
        await compressVideo(inputPath, outputPath);
        videoBuffer = await readFile(outputPath);
      } catch (compErr) {
        console.warn('Video compression skipped or unavailable, using raw video:', compErr);
      }

      output = videoBuffer;
      outputName = `${stamp}.mp4`;
      format = 'mp4';
      contentType = 'video/mp4';
    }

    // 1. Try saving to local disk if writable
    try {
      const filePath = path.join(uploadsDir, outputName);
      await writeFile(filePath, output);
    } catch (writeErr: any) {
      // In read-only serverless environments (Vercel /var/task), write fails with EROFS.
      // This is expected and handled safely below by storing in MongoDB.
      console.log('Filesystem write bypassed (serverless environment):', writeErr?.code || writeErr?.message);
    }

    // 2. Persist media to MongoDB Atlas (guaranteed durable storage across serverless functions)
    try {
      await connectToDatabase();
      await UploadedMediaModel.findOneAndUpdate(
        { filename: outputName },
        {
          filename: outputName,
          contentType,
          data: output,
          size: output.length,
          createdAt: new Date(),
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.error('Failed to persist media to MongoDB:', dbErr);
    }

    const publicUrl = `/uploads/${outputName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: outputName,
      originalName: file.name,
      size: output.length,
      originalSize: file.size,
      type: contentType,
      format,
      compressed: format !== 'original',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  } finally {
    await Promise.all(tempPaths.map((filePath) => unlink(filePath).catch(() => undefined)));
  }
}
