import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Get the session using our utility function
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Return the user data from the session
    return NextResponse.json({
      user: {
        id: session.id,
        email: session.email,
        role: session.role,
      }
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching user data" },
      { status: 500 }
    );
  }
}
