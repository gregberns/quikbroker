import { NextResponse } from 'next/server';
import { getAuthSession } from '../../lib/auth';

export async function GET() {
  try {
    // Get the session using our utility function
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Return the user data from the session
    return NextResponse.json({ user: session });
  } catch (error) {
    console.error('Error in /api/me:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
