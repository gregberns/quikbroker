import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    // Get the session cookie
    const sessionCookie = cookies().get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse the session cookie
    try {
      const sessionData = JSON.parse(sessionCookie.value);

      // In a real application, you would validate the session token
      // against your database or verify a JWT

      return NextResponse.json({
        user: {
          id: sessionData.id,
          email: sessionData.email,
          role: sessionData.role,
        }
      });
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid session" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching user data" },
      { status: 500 }
    );
  }
}
