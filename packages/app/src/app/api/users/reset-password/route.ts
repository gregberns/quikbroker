import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth, hashPassword } from "../../../lib/auth";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION,
});

export async function POST(req: NextRequest) {
  return requireAuth(req, async (req, session) => {
    // Only admins can reset passwords
    if (session.role !== 'admin') {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    try {
      const { userId, newPassword } = await req.json();

      if (!userId || !newPassword) {
        return NextResponse.json(
          { message: "User ID and new password are required" },
          { status: 400 }
        );
      }

      // Validate password strength
      if (newPassword.length < 8) {
        return NextResponse.json(
          { message: "Password must be at least 8 characters long" },
          { status: 400 }
        );
      }

      const client = await pool.connect();

      try {
        // Get the user to make sure they exist
        const userResult = await client.query(
          "SELECT id, email, role FROM app.users WHERE id = $1",
          [userId]
        );

        if (userResult.rows.length === 0) {
          return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
          );
        }

        // Use the centralized password hashing function
        const passwordHash = await hashPassword(newPassword);

        // Update the user's password
        await client.query(
          "UPDATE app.users SET password_hash = $1 WHERE id = $2",
          [passwordHash, userId]
        );

        return NextResponse.json({
          message: "Password updated successfully",
          user: {
            id: userResult.rows[0].id,
            email: userResult.rows[0].email,
            role: userResult.rows[0].role
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      return NextResponse.json(
        { message: "An error occurred while resetting the password" },
        { status: 500 }
      );
    }
  }, { requiredRole: 'admin' });
}
