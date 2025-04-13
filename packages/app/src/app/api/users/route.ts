import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth } from "../../lib/auth";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  return requireAuth(req, async (req, session) => {
    // Only admins can list all users
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
        // Query the users table
        const result = await client.query(
          `SELECT
            u.id, u.email, u.role, u.created_at, 
            CASE 
              WHEN u.role = 'broker' THEN b.name 
              ELSE NULL 
            END as broker_name
          FROM app.users u
          LEFT JOIN app.brokers b ON u.id = b.owner_user_id
          ORDER BY u.id`
        );

        // Return the users as JSON
        return NextResponse.json({ users: result.rows });
      } finally {
        // Release the client back to the pool
        client.release();
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json(
        { message: "An error occurred while fetching users" },
        { status: 500 }
      );
    }
  }, { requiredRole: 'admin' });
}
