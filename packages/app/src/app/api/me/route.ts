import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from '../../lib/auth';
import { serverLogger } from '../../lib/serverLogger';

export async function GET(req: NextRequest) {
  // Log API access
  serverLogger.access(req, 200, { endpoint: 'me' });
  
  try {
    // Get the session using our utility function
    const session = await getAuthSession();

    if (!session) {
      serverLogger.debug('auth', 'User not authenticated in /api/me');
      return NextResponse.json(
        { 
          authenticated: false,
          error: 'Not authenticated'
        }, 
        { status: 401 }
      );
    }

    // Return the user data from the session
    serverLogger.debug('auth', `User session found for ${session.email}`, {
      userId: session.id,
      role: session.role
    });
    
    return NextResponse.json({ 
      authenticated: true,
      user: session 
    });
  } catch (error) {
    serverLogger.apiError(req, error);
    console.error('Error in /api/me:', error);
    
    return NextResponse.json({ 
      authenticated: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
