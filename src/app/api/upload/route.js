import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

function checkAuth(request) {
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return false;
  return verifyToken(auth.slice(7));
}

export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || '.webp';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
