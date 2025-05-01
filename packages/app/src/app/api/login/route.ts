import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword, createSession } from "../../lib/auth";
import { getUserByEmail } from "@/db/queries/users";
import { logErrorToServer } from "../../lib/errorHandling";

export async function POST(req: NextRequest) {
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
      logErrorToServer({
        type: "security-warning",
        message: "Failed login attempt",
        email: email,
        timestamp: new Date().toISOString(),
      });
      
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Authentication successful - create JWT session
    const cookieStore = await cookies();
    await createSession(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      cookieStore
    );

    // Return success response with user info
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    
    // Log error
    logErrorToServer({
      type: "api-error",
      message: error instanceof Error ? error.message : "Unknown login error",
      stack: error instanceof Error ? error.stack : undefined,
      url: req.url,
      timestamp: new Date().toISOString(),
    });
    
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
