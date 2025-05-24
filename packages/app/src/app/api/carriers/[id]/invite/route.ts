import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/auth";
import { getCarrierById } from "@/db/queries/carriers";
import { updateCarrier } from "@/db/queries/carriers";
import { getUserById } from "@/db/queries/users";
import {
  sendInvitation,
  validateInvitationRequest,
  createInvitationResponse,
  type InvitationConfig,
} from "../../../../../lib/domain/invitations";

const CARRIER_INVITATION_CONFIG: InvitationConfig = {
  entityType: "carrier",
  requiresUserAssociation: true, // Now carriers require user association like brokers
  taskIdentifier: "carrier_email_invite",
  emailField: "email",
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

      // Validate request
      const validation = validateInvitationRequest(id);
      if (!validation.isValid) {
        return NextResponse.json(
          { message: validation.error!.message },
          { status: validation.error!.statusCode }
        );
      }

      // Find the carrier
      const carriers = await getCarrierById(validation.entityId!);

      if (!carriers || carriers.length === 0) {
        return NextResponse.json(
          { message: "Carrier not found" },
          { status: 404 }
        );
      }

      const carrier = carriers[0];

      // Get user email since carriers table no longer has email
      let userEmail = '';
      if (carrier.owner_user_id) {
        const user = await getUserById(carrier.owner_user_id);
        if (user) {
          userEmail = user.email;
        }
      }

      // Send invitation using domain logic
      const result = await sendInvitation(
        {
          id: carrier.id,
          name: carrier.carrier_name,
          email: userEmail,
          owner_user_id: carrier.owner_user_id,
        },
        CARRIER_INVITATION_CONFIG,
        (id, data) => updateCarrier(id, data),
        session,
        req
      );

      return createInvitationResponse(result);
    },
    { requiredRole: "admin" }
  );
}
