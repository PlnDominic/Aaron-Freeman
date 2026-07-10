import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, STORAGE_BUCKET } from '@/lib/supabase';

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

    const supabase = getSupabaseClient();

    // Generate unique filename with timestamp
    const filename = `${Date.now()}-${file.name}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename);

    return NextResponse.json({
      url: data.publicUrl,
      downloadUrl: data.publicUrl,
      filename: filename,
      size: file.size,
      type: file.type
    });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
