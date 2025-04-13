import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function getAuthSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return null;
    }

    return JSON.parse(sessionCookie.value);
  } catch (error) {
    console.error("Error parsing session:", error);
    return null;
  }
}

export async function requireAuth(
  req: NextRequest,
  handler: (req: NextRequest, session: any) => Promise<NextResponse>,
  options: { requiredRole?: string } = {}
) {
  // Get the session
  const session = await getAuthSession();

  // Check if the user is authenticated
  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  // Check if the user has the required role
  if (options.requiredRole && session.role !== options.requiredRole) {
    return NextResponse.json(
      { message: "Insufficient permissions" },
      { status: 403 }
    );
  }

  // Call the handler with the session
  return handler(req, session);
}
