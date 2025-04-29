import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/auth";
import { getCarrierById } from "@/db/queries/carriers";

import * as crypto from "crypto";
import { sql } from "@/db/client";
import * as db from "zapatos/db";

// Helper function to generate a secure random token
function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
        const carrierId = parseInt(params.id);

        if (isNaN(carrierId)) {
          return NextResponse.json(
            { message: "Invalid carrier ID" },
            { status: 400 }
          );
        }

        // Find the carrier
        const carriers = await getCarrierById(carrierId);

        if (!carriers || carriers.length === 0) {
          return NextResponse.json(
            { message: "Carrier not found" },
            { status: 404 }
          );
        }

        const carrier = carriers[0];

        // In a real app, we would send an email to the carrier here
        // For now, we'll simulate success and just log the action
        console.log(
          `Invitation sent to carrier: ${carrier.name} (${carrier.email})`
        );

        // Update the carrier record to indicate an invitation was sent
        const timestamp = new Date();
        await db
          .update(
            "carriers",
            { invitation_sent_at: timestamp },
            { id: carrierId }
          )
          .run(sql);

        return NextResponse.json({
          message: `Invitation sent to ${carrier.email}`,
          carrier: {
            ...carrier,
            invitation_sent_at: timestamp,
          },
        });
      } catch (error) {
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
