import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth } from "../../../../lib/auth";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Await the params Promise before destructuring
  const { id } = await params;

  return requireAuth(req, async (req, session) => {
    // Only admins can send invitations
    if (session.role !== 'admin') {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    try {
      const carrierId = parseInt(id);

      if (isNaN(carrierId)) {
        return NextResponse.json(
          { message: "Invalid carrier ID" },
          { status: 400 }
        );
      }

      // Get a client from the pool
      const client = await pool.connect();

      try {
        // Find the carrier
        const result = await client.query(
          "SELECT id, name, email, company, phone, address FROM app.carriers WHERE id = $1",
          [carrierId]
        );

        if (result.rows.length === 0) {
          return NextResponse.json(
            { message: "Carrier not found" },
            { status: 404 }
          );
        }

        const carrier = result.rows[0];

        // In a real app, we would send an email to the carrier here
        // For now, we'll simulate success and just log the action
        console.log(`Invitation sent to carrier: ${carrier.name} (${carrier.email})`);

        // Update the carrier record to indicate an invitation was sent
        const timestamp = new Date();
        await client.query(
          "UPDATE app.carriers SET invitation_sent_at = $1 WHERE id = $2",
          [timestamp, carrierId]
        );

        return NextResponse.json({
          message: `Invitation sent to ${carrier.email}`,
          carrier: {
            ...carrier,
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
