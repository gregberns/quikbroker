import { NextRequest, NextResponse } from "next/server";
import { requireAuth, hashPassword } from "../../lib/auth";
import crypto from "crypto";
import { getClient } from "@/db/client";
import {
  listBrokers,
  createBroker,
  CreateBrokerInput,
} from "@/db/queries/brokers";
import { createUser } from "@/db/queries/users";
import { createUserInvite } from "@/db/queries/userInvites";
import { createJob } from "@/db/queries/jobs";

// Helper function to generate a secure random token
function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

export async function GET(req: NextRequest) {
  return requireAuth(
    req,
    async (req, session) => {
      // Only admins can list all brokers
      if (session.role !== "admin") {
        return NextResponse.json(
          { message: "Admin access required" },
          { status: 403 }
        );
      }

      try {
        const brokers = await listBrokers();
        return NextResponse.json({ brokers });
      } catch (error) {
        console.error("Error fetching brokers:", error);
        return NextResponse.json(
          { message: "An error occurred while fetching brokers" },
          { status: 500 }
        );
      }
    },
    { requiredRole: "admin" }
  );
}

export async function POST(req: NextRequest) {
  return requireAuth(
    req,
    async (req, session) => {
      // Only admins can create brokers
      if (session.role !== "admin") {
        return NextResponse.json(
          { message: "Admin access required" },
          { status: 403 }
        );
      }

      try {
        // Parse the request body
        const { name, email, contactName, brokerage_name } =
          (await req.json()) as CreateBrokerInput;

        // Validate input
        if (!name || !email || !contactName) {
          return NextResponse.json(
            {
              message:
                "Broker company name, email, and primary contact name are required",
            },
            { status: 400 }
          );
        }

        const sql = getClient();
        try {
          // Start a transaction
          await sql.query("BEGIN");

          // 1. Create a temporary random password for the broker user
          const tempPassword = generateSecureToken(12);
          // Use the centralized password hashing function
          const passwordHash = await hashPassword(tempPassword);

          // 2. Create a new user with the broker role
          const newUser = await createUser({
            email,
            password_hash: passwordHash,
            role: "broker",
          });

          // 3. Create the broker record and link it to the user
          const ownerUserId = newUser.id;
          await createBroker(
            { name, email, contactName, brokerage_name },
            ownerUserId
          );

          // 4. Generate an invitation token that expires in 7 days
          const token = generateSecureToken();
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

          // 5. Create an invitation record
          const invite = await createUserInvite({
            user_id: newUser.id,
            token,
            expires_at: expiresAt,
          });

          // 6. Create a job to send the broker invitation email
          const job = await createJob({
            task_identifier: "broker_email_invite",
            payload: { user_invite_id: invite.id },
          });
          
          // Process the job immediately in development mode
          if (process.env.NODE_ENV !== 'production') {
            // Dynamic import to avoid circular dependency
            const { processJob } = await import('../../lib/worker');
            await processJob(job.task_identifier, job.payload);
          }

          // Commit the transaction
          await sql.query("COMMIT");

          // Generate the invitation URL (in a real app, this would be your domain)
          const inviteUrl = `${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }/verify-email?token=${token}`;

          // Return the new broker and invitation URL
          return NextResponse.json({
            broker: {
              name,
              primary_email: email,
              owner_user_id: ownerUserId,
              brokerage_name,
            },
            user: {
              id: newUser.id,
              email: newUser.email,
              role: newUser.role,
            },
            inviteUrl,
          });
        } catch (error) {
          // Rollback the transaction on error
          await sql.query("ROLLBACK");
          throw error;
        }
      } catch (error) {
        // Check for unique constraint violations
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "23505"
        ) {
          if (
            "constraint" in error &&
            error.constraint === "brokers_primary_email_key"
          ) {
            return NextResponse.json(
              { message: "A broker with this email already exists" },
              { status: 409 }
            );
          }
        }

        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "23505"
        ) {
          if ("constraint" in error && error.constraint === "users_email_key") {
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
    },
    { requiredRole: "admin" }
  );
}
