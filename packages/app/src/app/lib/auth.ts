import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

// Centralized password handling functions
const SALT_ROUNDS = 10; // Keep this consistent for all password hashing

/**
 * Hash a password using bcrypt with consistent salt rounds
 * @param password The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 * @param password The plain text password to verify
 * @param hash The hash to compare against
 * @returns True if the password matches the hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getAuthSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return null;
    }

    return JSON.parse(sessionCookie.value);
  } catch (error: unknown) {
    console.error('Error in getAuthSession:', error);
    return null;
  }
}

export async function requireAuth(
  req: NextRequest,
  handler: (req: NextRequest, session: { id: number; email: string; role: string }) => Promise<NextResponse>,
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
