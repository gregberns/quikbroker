import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth } from "../../lib/auth";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  return requireAuth(req, async (req, session) => {
    // Only admins can list all brokers
    if (session.role !== 'admin') {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    try {
      // Get a client from the pool
      const client = await pool.connect();

      try {
        // Query the brokers table
        const result = await client.query(
          "SELECT id, name, email, company, created_at, updated_at, invitation_sent_at FROM app.brokers ORDER BY name"
        );

        // Return the brokers as JSON
        return NextResponse.json({ brokers: result.rows });
      } finally {
        // Release the client back to the pool
        client.release();
      }
    } catch (error) {
      console.error("Error fetching brokers:", error);
      return NextResponse.json(
        { message: "An error occurred while fetching brokers" },
        { status: 500 }
      );
    }
  }, { requiredRole: 'admin' });
}

export async function POST(req: NextRequest) {
  return requireAuth(req, async (req, session) => {
    // Only admins can create brokers
    if (session.role !== 'admin') {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    try {
      // Parse the request body
      const { name, email, company } = await req.json();

      // Validate input
      if (!name || !email || !company) {
        return NextResponse.json(
          { message: "Name, email, and company are required" },
          { status: 400 }
        );
      }

      // Get a client from the pool
      const client = await pool.connect();

      try {
        // Insert the new broker
        const result = await client.query(
          "INSERT INTO app.brokers (name, email, company) VALUES ($1, $2, $3) RETURNING *",
          [name, email, company]
        );

        // Return the new broker as JSON
        return NextResponse.json({ broker: result.rows[0] });
      } finally {
        // Release the client back to the pool
        client.release();
      }
    } catch (error) {
      console.error("Error creating broker:", error);

      // Check for unique constraint violation (duplicate email)
      if (error.code === '23505' && error.constraint === 'brokers_email_key') {
        return NextResponse.json(
          { message: "A broker with this email already exists" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "An error occurred while creating the broker" },
        { status: 500 }
      );
    }
  }, { requiredRole: 'admin' });
}
