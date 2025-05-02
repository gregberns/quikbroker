import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { serverLogger } from '../../lib/serverLogger';

// Common logout function to reuse in both GET and POST handlers
async function performLogout() {
  try {
    const cookieStore = await cookies();
    
    // Clear the auth token cookie
    cookieStore.set({
      name: "auth_token",
      value: "",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
    });

    return true;
  } catch (error) {
    console.error("Error clearing cookies:", error);
    return false;
  }
}

// GET handler for direct browser access
export async function GET(req: NextRequest) {
  serverLogger.access(req, 200, { endpoint: 'logout', method: 'GET' });
  
  try {
    await performLogout();
    
    // Redirect to the logout page which will redirect to home
    return NextResponse.redirect(new URL('/logout', req.url));
  } catch (error) {
    serverLogger.apiError(req, error);
    console.error("Logout error:", error);
    
    // Even on error, redirect to logout page which will handle errors
    return NextResponse.redirect(new URL('/logout', req.url));
  }
}

// POST handler for API access from client-side code
export async function POST(req: NextRequest) {
  serverLogger.access(req, 200, { endpoint: 'logout', method: 'POST' });
  
  try {
    const success = await performLogout();
    
    if (success) {
      serverLogger.info('logout', 'User logged out successfully');
      return NextResponse.json({ message: "Logged out successfully" });
    } else {
      throw new Error('Failed to clear cookies');
    }
  } catch (error) {
    serverLogger.apiError(req, error);
    console.error("Logout error:", error);
    
    return NextResponse.json(
      { message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}