import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      // Start a transaction
      await client.query('BEGIN');

      // Find the invitation by token
      const inviteResult = await client.query(
        `SELECT i.*, u.email 
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

      // We don't mark the invitation as used here - we'll do that when they set their password
      // This allows the token to be valid for the password setting step

      // Update the broker invitation sent timestamp if not already set
      await client.query(
        `UPDATE app.brokers 
         SET invitation_sent_at = COALESCE(invitation_sent_at, NOW()) 
         WHERE owner_user_id = $1`,
        [invite.user_id]
      );

      // Commit the transaction
      await client.query('COMMIT');

      // Return success with user information
      return NextResponse.json({
        message: "Email verified successfully",
        user: {
          id: invite.user_id,
          email: invite.email
        }
      });
    } catch (error) {
      // Rollback the transaction on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { message: "An error occurred while verifying your email" },
      { status: 500 }
    );
  }
}
