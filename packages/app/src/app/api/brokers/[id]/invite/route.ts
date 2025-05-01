import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/auth";
import crypto from "crypto";
import { logErrorToServer } from "../../../../lib/errorHandling";
import { getClient } from "@/db/client";
import { getBrokerById, updateBroker } from "@/db/queries/brokers";
import { createUserInvite } from "@/db/queries/userInvites";
import { createJob } from "@/db/queries/jobs";

// Helper function to generate a secure random token
function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params Promise before destructuring
  const { id } = await params;

  return requireAuth(
    req,
    async (req, session) => {
      // Only admins can send invitations
      if (session.role !== "admin") {
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

        const sql = getClient();
        try {
          // Start a transaction
          await sql.query("BEGIN");

          // Find the broker
          const brokers = await getBrokerById(brokerId);

          if (brokers.length === 0) {
            return NextResponse.json(
              { message: "Broker not found" },
              { status: 404 }
            );
          }

          const broker = brokers[0];

          // Check if owner_user_id exists
          if (!broker.owner_user_id) {
            return NextResponse.json(
              {
                message:
                  "Broker has no associated user. Please assign a user first.",
              },
              { status: 400 }
            );
          }

          // Generate a new invitation token
          const token = generateSecureToken();
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

          // Create an invitation record
          const invite = await createUserInvite({
            user_id: broker.owner_user_id,
            token,
            expires_at: expiresAt,
          });

          // Create a job to send the broker invitation email
          const job = await createJob({
            task_identifier: "broker_email_invite",
            payload: { user_invite_id: invite.id },
          });
          
          // Process the job immediately in development mode
          if (process.env.NODE_ENV !== 'production') {
            // Dynamic import to avoid circular dependency
            const { processJob } = await import('../../../../lib/worker');
            await processJob(job.task_identifier, job.payload);
          }

          // Update the broker record to indicate an invitation was sent
          const timestamp = new Date();
          await updateBroker(brokerId, {
            invitation_sent_at: timestamp,
          });

          // Commit the transaction
          await sql.query("COMMIT");

          // Generate the invitation URL
          const inviteUrl = `${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }/verify-email?token=${token}`;

          return NextResponse.json({
            message: `Invitation sent to ${broker.primary_email}`,
            broker: {
              ...broker,
              invitation_sent_at: timestamp,
            },
            inviteUrl,
          });
        } catch (error) {
          // Rollback the transaction on error
          await sql.query("ROLLBACK");
          throw error;
        }
      } catch (error) {
        // Log the error to our error logging system
        logErrorToServer({
          type: "api-error",
          message:
            error instanceof Error
              ? error.message
              : "Unknown error sending invitation",
          stack: error instanceof Error ? error.stack : undefined,
          url: req.url,
          brokerId: id,
          userId: session?.id,
          userRole: session?.role,
          timestamp: new Date().toISOString(),
        });

        console.error("Error sending invitation:", error);
        return NextResponse.json(
          { message: "An error occurred while sending the invitation" },
          { status: 500 }
        );
      }
    },
    { requiredRole: "admin" }
  );
}
