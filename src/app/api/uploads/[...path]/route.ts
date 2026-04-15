import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET /api/uploads/[...path]
 *
 * Serve uploaded files from /public/uploads/ directory
 * This route handles images and other uploaded files
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Unwrap params (Next.js 15+ requires this)
    const resolvedParams = await params

    // Build the file path safely
    const filePath = path.join(process.cwd(), 'public', 'uploads', ...resolvedParams.path);

    // Security check: ensure the path doesn't escape the uploads directory
    const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
    const normalizedFilePath = path.normalize(filePath);
    const normalizedUploadsPath = path.normalize(uploadsPath);

    if (!normalizedFilePath.startsWith(normalizedUploadsPath)) {
      console.error('[UPLOADS] ❌ Path traversal attempt detected:', resolvedParams.path);
      return new NextResponse('Access denied', { status: 403 });
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('[UPLOADS] ❌ File not found:', normalizedFilePath);
      return new NextResponse('File not found', { status: 404 });
    }

    // Check if it's a file (not a directory)
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      console.error('[UPLOADS] ❌ Not a file:', normalizedFilePath);
      return new NextResponse('Not a file', { status: 400 });
    }

    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.json': 'application/json',
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';

    // Read and serve the file
    const file = fs.readFileSync(filePath);

    console.log('[UPLOADS] ✅ Serving file:', {
      path: normalizedFilePath,
      size: file.length,
      contentType
    });

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': file.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    });
  } catch (error: any) {
    console.error('[UPLOADS] ❌ Error serving file:', error);
    return new NextResponse(
      error.message || 'Internal server error',
      { status: 500 }
    );
  }
}
