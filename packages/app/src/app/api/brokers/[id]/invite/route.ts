import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth } from "../../../../lib/auth";
import crypto from "crypto";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper function to generate a secure random token
function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return requireAuth(req, async (req, session) => {
    // Only admins can send invitations
    if (session.role !== 'admin') {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    try {
      const brokerId = parseInt(params.id);

      if (isNaN(brokerId)) {
        return NextResponse.json(
          { message: "Invalid broker ID" },
          { status: 400 }
        );
      }

      // Get a client from the pool
      const client = await pool.connect();

      try {
        // Start a transaction
        await client.query('BEGIN');

        // Find the broker with updated column names
        const brokerResult = await client.query(
          "SELECT id, name, primary_email, owner_user_id FROM app.brokers WHERE id = $1",
          [brokerId]
        );

        if (brokerResult.rows.length === 0) {
          return NextResponse.json(
            { message: "Broker not found" },
            { status: 404 }
          );
        }

        const broker = brokerResult.rows[0];

        // Generate a new invitation token
        const token = generateSecureToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        // Create an invitation record
        const inviteResult = await client.query(
          "INSERT INTO app.user_invites (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING id",
          [broker.owner_user_id, token, expiresAt]
        );

        const inviteId = inviteResult.rows[0].id;

        // Create a job to send the broker invitation email
        await client.query(
          `INSERT INTO app_private.jobs (
            task_identifier, 
            payload
          ) VALUES ($1, $2)`,
          ['broker_email_invite', JSON.stringify({ user_invite_id: inviteId })]
        );

        // Update the broker record to indicate an invitation was sent
        const timestamp = new Date();
        await client.query(
          "UPDATE app.brokers SET invitation_sent_at = $1 WHERE id = $2",
          [timestamp, brokerId]
        );

        // Commit the transaction
        await client.query('COMMIT');

        // Generate the invitation URL
        const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

        return NextResponse.json({
          message: `Invitation sent to ${broker.primary_email}`,
          broker: {
            ...broker,
            invitation_sent_at: timestamp
          },
          inviteUrl
        });
      } catch (error) {
        // Rollback the transaction on error
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      return NextResponse.json(
        { message: "An error occurred while sending the invitation" },
        { status: 500 }
      );
    }
  }, { requiredRole: 'admin' });
}
