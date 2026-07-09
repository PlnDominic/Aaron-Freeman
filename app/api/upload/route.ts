import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const file = body.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file size based on type
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    
    if (isImage && file.size > 10 * 1024 * 1024) { // 10MB for images
      return NextResponse.json({ error: 'Image files must be under 10MB' }, { status: 400 });
    }
    
    if (isPDF && file.size > 20 * 1024 * 1024) { // 20MB for PDFs
      return NextResponse.json({ error: 'PDF files must be under 20MB' }, { status: 400 });
    }

    // Generate unique filename with timestamp
    const filename = `${Date.now()}-${file.name}`;
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({ 
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      filename: filename,
      size: file.size,
      type: file.type
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
} 