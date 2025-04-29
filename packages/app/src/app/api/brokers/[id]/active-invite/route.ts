import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/auth";
import { logErrorToServer } from "../../../../lib/errorHandling";
import { getBrokerById } from "@/db/queries/brokers";
import { getActiveInviteForUser } from "@/db/queries/userInvites";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params Promise before destructuring
  const { id } = await params;

  return requireAuth(
    req,
    async (req, session) => {
      // Only admins can access invite links
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

        // Find the broker to get the owner_user_id
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
            { message: "Broker has no associated user." },
            { status: 400 }
          );
        }

        // Get the most recent active invite for this user
        const invite = await getActiveInviteForUser(broker.owner_user_id);

        if (!invite) {
          return NextResponse.json(
            { message: "No active invite found for this broker" },
            { status: 404 }
          );
        }

        // Generate the invitation URL
        const inviteUrl = `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/verify-email?token=${invite.token}`;

        return NextResponse.json({
          inviteUrl,
          expiresAt: invite.expires_at,
        });
      } catch (error) {
        // Log the error to our error logging system
        logErrorToServer({
          type: "api-error",
          message:
            error instanceof Error
              ? error.message
              : "Unknown error fetching active invite",
          stack: error instanceof Error ? error.stack : undefined,
          url: req.url,
          brokerId: id,
          userId: session?.id,
          userRole: session?.role,
          timestamp: new Date().toISOString(),
        });

        console.error("Error fetching active invite:", error);
        return NextResponse.json(
          { message: "An error occurred while fetching the active invite" },
          { status: 500 }
        );
      }
    },
    { requiredRole: "admin" }
  );
}
