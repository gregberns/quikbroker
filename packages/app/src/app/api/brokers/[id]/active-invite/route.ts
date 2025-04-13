import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth } from "../../../../lib/auth";
import { logErrorToServer } from "../../../../lib/errorHandling";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  return requireAuth(req, async (req, session) => {
    // Only admins can access invite links
    if (session.role !== 'admin') {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    try {
      const brokerId = parseInt(id);

      if (isNaN(brokerId)) {
        return NextResponse.json(
          { message: "Invalid broker ID" },
          { status: 400 }
        );
      }

      // Get a client from the pool
      const client = await pool.connect();

      try {
        // Find the broker to get the owner_user_id
        const brokerResult = await client.query(
          "SELECT id, owner_user_id FROM app.brokers WHERE id = $1",
          [brokerId]
        );

        if (brokerResult.rows.length === 0) {
          return NextResponse.json(
            { message: "Broker not found" },
            { status: 404 }
          );
        }

        const broker = brokerResult.rows[0];

        // Check if owner_user_id exists
        if (!broker.owner_user_id) {
          return NextResponse.json(
            { message: "Broker has no associated user." },
            { status: 400 }
          );
        }

        // Get the most recent active invite for this user
        const now = new Date();
        const inviteResult = await client.query(
          `SELECT token, expires_at 
           FROM app.user_invites 
           WHERE user_id = $1 AND expires_at > $2
           ORDER BY created_at DESC
           LIMIT 1`,
          [broker.owner_user_id, now]
        );

        if (inviteResult.rows.length === 0) {
          return NextResponse.json(
            { message: "No active invite found for this broker" },
            { status: 404 }
          );
        }

        const invite = inviteResult.rows[0];
        
        // Generate the invitation URL
        const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${invite.token}`;

        return NextResponse.json({
          inviteUrl,
          expiresAt: invite.expires_at
        });
      } finally {
        client.release();
      }
    } catch (error) {
      // Log the error to our error logging system
      logErrorToServer({
        type: 'api-error',
        message: error instanceof Error ? error.message : 'Unknown error fetching active invite',
        stack: error instanceof Error ? error.stack : undefined,
        url: req.url,
        brokerId: id,
        userId: session?.user?.id,
        userRole: session?.role,
        timestamp: new Date().toISOString()
      });

      console.error("Error fetching active invite:", error);
      return NextResponse.json(
        { message: "An error occurred while fetching the active invite" },
        { status: 500 }
      );
    }
  }, { requiredRole: 'admin' });
}