import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth } from "../../../../lib/auth";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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
        // Find the broker with updated column names
        const result = await client.query(
          "SELECT id, name, primary_email FROM app.brokers WHERE id = $1",
          [brokerId]
        );

        if (result.rows.length === 0) {
          return NextResponse.json(
            { message: "Broker not found" },
            { status: 404 }
          );
        }

        const broker = result.rows[0];

        // In a real app, we would send an email to the broker here
        // For now, we'll simulate success and just log the action
        console.log(`Invitation sent to broker: ${broker.name} (${broker.primary_email})`);

        // Update the broker record to indicate an invitation was sent
        const timestamp = new Date();
        await client.query(
          "UPDATE app.brokers SET invitation_sent_at = $1 WHERE id = $2",
          [timestamp, brokerId]
        );

        return NextResponse.json({
          message: `Invitation sent to ${broker.primary_email}`,
          broker: {
            ...broker,
            invitation_sent_at: timestamp
          }
        });
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
