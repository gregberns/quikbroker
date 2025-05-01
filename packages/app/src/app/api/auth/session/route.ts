import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAuthSession } from '../../../lib/auth';

export async function GET() {
  try {
    const session = await getAuthSession();
    
    return NextResponse.json({ 
      authenticated: !!session,
      user: session ? {
        id: session.id,
        email: session.email,
        role: session.role
      } : null
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ 
      authenticated: false,
      error: 'Failed to validate session'
    }, { status: 500 });
  }
}
