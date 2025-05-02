import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword, createSession } from "../../lib/auth";
import { getUserByEmail } from "@/db/queries/users";
import { serverLogger } from "../../lib/serverLogger";

export async function POST(req: NextRequest) {
  // Log all login attempts for access tracking
  serverLogger.access(req, 0, { endpoint: "login" });

  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Query the database for the user
    const user = await getUserByEmail(email);

    // User not found - return the same error message to prevent user enumeration
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Use the centralized password verification function
    const passwordMatch = await verifyPassword(password, user.password_hash);

    if (!passwordMatch) {
      // Log failed login attempts (for security monitoring)
      serverLogger.security(
        "failed-login",
        `Failed login attempt for ${email}`,
        {
          email,
          ip: req.headers.get("x-forwarded-for") || "unknown",
        }
      );

      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Authentication successful - create JWT session
    const cookieStore = cookies();
    const token = await createSession(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      cookieStore
    );

    // Log successful login
    serverLogger.info("login", `Successful login for ${email}`, {
      userId: user.id,
      role: user.role,
      ip: req.headers.get("x-forwarded-for") || "unknown",
    });

    // Return success response with user info and token (for debugging and client-side storage if needed)
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token, // Include token in response for client visibility
      authMethod: "jwt-cookie", // Indicate the authentication method
    });
  } catch (error) {
    console.error("Login error:", error);

    // Log error using server logger
    serverLogger.apiError(req, error);

    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
