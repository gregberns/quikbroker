import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  return NextResponse.json({ session: session?.value });
}
