import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "./jwt";

// Centralized password handling functions
const SALT_ROUNDS = 10; // Keep this consistent for all password hashing
const SESSION_COOKIE_NAME = "auth_token";

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

/**
 * Get the user session from the JWT token in the cookies
 * @returns The user session or null if not authenticated
 */
export async function getAuthSession(): Promise<{ id: number; email: string; role: string } | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!tokenCookie?.value) {
      return null;
    }

    const payload = verifyToken(tokenCookie.value);
    
    if (!payload) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
  } catch (error: unknown) {
    console.error('Error in getAuthSession:', error);
    return null;
  }
}

/**
 * Create a session for a user by setting a JWT token cookie
 * @param user The user to create a session for
 * @param cookieStore The cookie store to use
 */
export async function createSession(
  user: { id: number; email: string; role: string },
  cookieStore: ReturnType<typeof cookies>
) {
  // Generate JWT token
  const token = generateToken({
    sub: user.id,
    email: user.email,
    role: user.role
  });

  // Set the token as a cookie
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    // The JWT token has its own expiry, but we'll set the cookie to expire as well
    maxAge: 60 * 60 * 24, // 1 day
  });

  return token;
}

/**
 * Middleware to require authentication for API routes
 */
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
