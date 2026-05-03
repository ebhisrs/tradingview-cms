import { NextResponse } from 'next/server';
import { getAllPages, getPage, savePage, deletePage } from '../../../lib/storage';
import { verifyToken } from '../../../lib/auth';

function checkAuth(request) {
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return false;
  return verifyToken(auth.slice(7));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (slug) {
    const page = getPage(slug);
    return page
      ? NextResponse.json(page)
      : NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(getAllPages());
}

export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await request.json();
  if (!data.slug || !data.title) {
    return NextResponse.json({ error: 'slug and title required' }, { status: 400 });
  }
  const saved = savePage(data);
  return NextResponse.json(saved);
}

export async function DELETE(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });
  deletePage(slug);
  return NextResponse.json({ ok: true });
}
