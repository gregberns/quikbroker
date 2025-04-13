import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import { cookies } from "next/headers";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT id, email, password_hash, role FROM app.users WHERE email = $1",
        [email]
      );

      // User not found
      if (result.rows.length === 0) {
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }

      const user = result.rows[0];

      // Compare the provided password with the stored hash
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

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

      // Set the session cookie
      cookies().set({
        name: 'session',
        value: sessionValue,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        // In a real app, set proper expiry time
        maxAge: 60 * 60 * 24 // 1 day
      });

      return NextResponse.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
