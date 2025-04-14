import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { hashPassword } from "../../../lib/auth";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      // Start a transaction
      await client.query('BEGIN');

      // Find the invitation by token
      const inviteResult = await client.query(
        `SELECT i.*, u.id as user_id, u.email 
         FROM app.user_invites i
         JOIN app.users u ON i.user_id = u.id
         WHERE i.token = $1 AND i.expires_at > NOW()`,
        [token]
      );

      // Check if invitation exists and is valid
      if (inviteResult.rows.length === 0) {
        return NextResponse.json(
          { message: "Invalid or expired verification token" },
          { status: 400 }
        );
      }

      const invite = inviteResult.rows[0];

      // Check if the token has already been used
      if (invite.used_at) {
        return NextResponse.json(
          { message: "This verification link has already been used. Please request a new one." },
          { status: 400 }
        );
      }

      // Use the centralized password hashing function
      const passwordHash = await hashPassword(password);

      // Update the user's password
      await client.query(
        "UPDATE app.users SET password_hash = $1 WHERE id = $2",
        [passwordHash, invite.user_id]
      );

      // Mark the invitation as used
      await client.query(
        "UPDATE app.user_invites SET used_at = NOW() WHERE id = $1",
        [invite.id]
      );

      // Commit the transaction
      await client.query('COMMIT');

      // Return success
      return NextResponse.json({
        message: "Password set successfully",
        email: invite.email
      });
    } catch (error) {
      // Rollback the transaction on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error setting password:", error);
    return NextResponse.json(
      { message: "An error occurred while setting your password" },
      { status: 500 }
    );
  }
}
