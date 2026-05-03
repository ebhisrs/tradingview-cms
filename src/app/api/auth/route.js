import { NextResponse } from 'next/server';
import { verifyCredentials, createToken } from '../../../lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (!verifyCredentials(username, password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const token = createToken(username);
    return NextResponse.json({ token, username });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
