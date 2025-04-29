import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword } from "../../lib/auth";
import { getUserByEmail } from "@/db/queries/users";

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
    // User not found
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Use the centralized password verification function
    const passwordMatch = await verifyPassword(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Authentication successful - create session cookie
    // In a real application, you would use a proper session/JWT implementation
    // For simplicity, we'll just create a basic session cookie
    const sessionValue = JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      // In a real app, add token expiry and signature
    });

    // Set the session cookie - await cookies() to fix the error
    const cookieStore = await cookies();
    cookieStore.set({
      name: "session",
      value: sessionValue,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      // In a real app, set proper expiry time
      maxAge: 60 * 60 * 24, // 1 day
    });

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
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
