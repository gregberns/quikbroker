import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Get the current session using the helper function from lib/auth
    const session = await getAuthSession();

    if (session) {
      // User is authenticated, return session data
      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.id,
          email: session.email,
          role: session.role
        }
      });
    } else {
      // No valid session found
      return NextResponse.json({
        authenticated: false
      });
    }
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { message: "An error occurred while checking authentication" },
      { status: 500 }
    );
  }
}
