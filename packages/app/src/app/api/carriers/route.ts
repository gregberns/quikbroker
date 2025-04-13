import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth } from "../../lib/auth";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  return requireAuth(req, async (req, session) => {
    // Only admins can list all carriers
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
        // Query the carriers table
        const result = await client.query(
          "SELECT id, name, email, company, phone, address, created_at, updated_at, invitation_sent_at FROM app.carriers ORDER BY name"
        );

        // Return the carriers as JSON
        return NextResponse.json({ carriers: result.rows });
      } finally {
        // Release the client back to the pool
        client.release();
      }
    } catch (error) {
      console.error("Error fetching carriers:", error);
      return NextResponse.json(
        { message: "An error occurred while fetching carriers" },
        { status: 500 }
      );
    }
  }, { requiredRole: 'admin' });
}

export async function POST(req: NextRequest) {
  return requireAuth(req, async (req, session) => {
    // Only admins can create carriers
    if (session.role !== 'admin') {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    try {
      // Parse the request body
      const { name, email, company, phone, address } = await req.json();

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
        // Insert the new carrier
        const result = await client.query(
          "INSERT INTO app.carriers (name, email, company, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [name, email, company, phone || null, address || null]
        );

        // Return the new carrier as JSON
        return NextResponse.json({ carrier: result.rows[0] });
      } finally {
        // Release the client back to the pool
        client.release();
      }
    } catch (error) {
      console.error("Error creating carrier:", error);

      // Check for unique constraint violation (duplicate email)
      if (error.code === '23505' && error.constraint === 'carriers_email_key') {
        return NextResponse.json(
          { message: "A carrier with this email already exists" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "An error occurred while creating the carrier" },
        { status: 500 }
      );
    }
  }, { requiredRole: 'admin' });
}
