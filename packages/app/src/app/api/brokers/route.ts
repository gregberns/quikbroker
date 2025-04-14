import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth, hashPassword } from "../../lib/auth";
import crypto from "crypto";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper function to generate a secure random token
function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

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
        // Query the brokers table with updated field names
        const result = await client.query(
          "SELECT id, name, primary_email, owner_user_id, created_at, updated_at, invitation_sent_at FROM app.brokers ORDER BY name"
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
      const { name, email, contactName } = await req.json();

      // Validate input
      if (!name || !email || !contactName) {
        return NextResponse.json(
          { message: "Broker company name, email, and primary contact name are required" },
          { status: 400 }
        );
      }

      // Get a client from the pool
      const client = await pool.connect();

      try {
        // Start a transaction
        await client.query('BEGIN');

        // 1. Create a temporary random password for the broker user
        const tempPassword = generateSecureToken(12);
        // Use the centralized password hashing function
        const passwordHash = await hashPassword(tempPassword);

        // 2. Create a new user with the broker role
        const userResult = await client.query(
          "INSERT INTO app.users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role",
          [email, passwordHash, 'broker']
        );

        const newUser = userResult.rows[0];

        // 3. Create the broker record and link it to the user
        const brokerResult = await client.query(
          "INSERT INTO app.brokers (name, primary_email, owner_user_id) VALUES ($1, $2, $3) RETURNING *",
          [name, email, newUser.id]
        );

        const newBroker = brokerResult.rows[0];

        // 4. Generate an invitation token that expires in 7 days
        const token = generateSecureToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        // 5. Create an invitation record
        const inviteResult = await client.query(
          "INSERT INTO app.user_invites (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING id",
          [newUser.id, token, expiresAt]
        );

        const inviteId = inviteResult.rows[0].id;

        // 6. Create a job to send the broker invitation email
        await client.query(
          `INSERT INTO app_private.jobs (
            task_identifier, 
            payload
          ) VALUES ($1, $2)`,
          ['broker_email_invite', JSON.stringify({ user_invite_id: inviteId })]
        );

        // Commit the transaction
        await client.query('COMMIT');

        // Generate the invitation URL (in a real app, this would be your domain)
        const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

        // Return the new broker and invitation URL
        return NextResponse.json({
          broker: newBroker,
          user: {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role
          },
          inviteUrl
        });
      } catch (error) {
        // Rollback the transaction on error
        await client.query('ROLLBACK');
        throw error;
      } finally {
        // Release the client back to the pool
        client.release();
      }
    } catch (error) {
      // Check for unique constraint violations
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        if ('constraint' in error && error.constraint === 'brokers_primary_email_key') {
          return NextResponse.json(
            { message: "A broker with this email already exists" },
            { status: 409 }
          );
        }
      }

      if (error instanceof Error && 'code' in error && error.code === '23505') {
        if ('constraint' in error && error.constraint === 'users_email_key') {
          return NextResponse.json(
            { message: "A user with this email already exists" },
            { status: 409 }
          );
        }
      }

      console.error("Error creating broker:", error);
      return NextResponse.json(
        { message: "An error occurred while creating the broker" },
        { status: 500 }
      );
    }
  }, { requiredRole: 'admin' });
}
