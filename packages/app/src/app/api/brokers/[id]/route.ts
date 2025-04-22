import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth } from "../../../lib/auth";
import { logErrorToServer } from "../../../lib/errorHandling";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Await the params Promise before destructuring
  const { id } = await params;

  return requireAuth(req, async (req, session) => {
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
        // Query the broker
        const result = await client.query(
          "SELECT id, name, primary_email, owner_user_id, created_at, updated_at, invitation_sent_at FROM app.brokers WHERE id = $1",
          [brokerId]
        );

        if (result.rows.length === 0) {
          return NextResponse.json(
            { message: "Broker not found" },
            { status: 404 }
          );
        }

        // Return the broker as JSON
        return NextResponse.json({ broker: result.rows[0] });
      } finally {
        // Release the client back to the pool
        client.release();
      }
    } catch (error) {
      console.error("Error fetching broker:", error);

      // Log the error to our error logging system
      logErrorToServer({
        type: 'api-error',
        message: error instanceof Error ? error.message : 'Unknown error fetching broker',
        stack: error instanceof Error ? error.stack : undefined,
        url: req.url,
        brokerId: id,
        userId: session?.id,
        userRole: session?.role,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json(
        { message: "An error occurred while fetching the broker" },
        { status: 500 }
      );
    }
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Await the params Promise before destructuring
  const { id } = await params;

  return requireAuth(req, async (req, session) => {
    // Only admins can update brokers
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

      // Parse the request body
      const { name, primary_email } = await req.json();

      // Validate input
      if (!name || !primary_email) {
        return NextResponse.json(
          { message: "Broker name and email are required" },
          { status: 400 }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(primary_email)) {
        return NextResponse.json(
          { message: "Invalid email format" },
          { status: 400 }
        );
      }

      // Get a client from the pool
      const client = await pool.connect();

      try {
        // Start a transaction
        await client.query('BEGIN');

        // Check if the broker exists
        const checkResult = await client.query(
          "SELECT id, owner_user_id FROM app.brokers WHERE id = $1",
          [brokerId]
        );

        if (checkResult.rows.length === 0) {
          return NextResponse.json(
            { message: "Broker not found" },
            { status: 404 }
          );
        }

        const broker = checkResult.rows[0];
        const timestamp = new Date();

        // Update the broker record
        const updateResult = await client.query(
          "UPDATE app.brokers SET name = $1, primary_email = $2, updated_at = $3 WHERE id = $4 RETURNING *",
          [name, primary_email, timestamp, brokerId]
        );

        // Update the user email if there's an associated user
        if (broker.owner_user_id) {
          await client.query(
            "UPDATE app.users SET email = $1 WHERE id = $2",
            [primary_email, broker.owner_user_id]
          );
        }

        // Commit the transaction
        await client.query('COMMIT');

        return NextResponse.json({
          message: "Broker updated successfully",
          broker: updateResult.rows[0]
        });
      } catch (error) {
        // Rollback the transaction on error
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      // Log the error to our error logging system
      logErrorToServer({
        type: 'api-error',
        message: error instanceof Error ? error.message : 'Unknown error updating broker',
        stack: error instanceof Error ? error.stack : undefined,
        url: req.url,
        brokerId: id,
        userId: session?.id,
        userRole: session?.role,
        timestamp: new Date().toISOString()
      });

      console.error("Error updating broker:", error);
      return NextResponse.json(
        { message: "An error occurred while updating the broker" },
        { status: 500 }
      );
    }
  }, { requiredRole: 'admin' });
} 
