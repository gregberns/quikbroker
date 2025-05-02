import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAuthSession } from '../../../lib/auth';
import { serverLogger } from '../../../lib/serverLogger';

export async function GET(req: Request) {
  try {
    // Log session check for monitoring
    serverLogger.access(req as unknown as { ip?: string; headers: Headers }, 200, { endpoint: 'session-check' });
    
    const session = await getAuthSession();
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('auth_token');
    
    // For debugging, include cookie status
    const cookieInfo = {
      hasCookie: !!tokenCookie,
      expiry: tokenCookie?.expires,
    };
    
    if (session) {
      // Log successful session validation
      serverLogger.debug('session', 'Session validated successfully', {
        userId: session.id,
        role: session.role
      });
    }
    
    return NextResponse.json({ 
      authenticated: !!session,
      user: session ? {
        id: session.id,
        email: session.email,
        role: session.role
      } : null,
      cookieInfo // Include cookie info for debugging
    });
  } catch (error) {
    console.error('Session error:', error);
    serverLogger.error('session', 'Failed to validate session', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    
    return NextResponse.json({ 
      authenticated: false,
      error: 'Failed to validate session'
    }, { status: 500 });
  }
}
