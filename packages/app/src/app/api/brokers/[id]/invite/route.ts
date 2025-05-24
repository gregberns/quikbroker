import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/auth";
import { getBrokerById, updateBroker } from "@/db/queries/brokers";
import { 
  sendInvitation, 
  validateInvitationRequest, 
  createInvitationResponse,
  type InvitationConfig 
} from "../../../../lib/domain/invitations";

const BROKER_INVITATION_CONFIG: InvitationConfig = {
  entityType: 'broker',
  requiresUserAssociation: true,
  taskIdentifier: 'broker_email_invite',
  emailField: 'primary_email',
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

      // Find the broker
      const brokers = await getBrokerById(validation.entityId!);

      if (brokers.length === 0) {
        return NextResponse.json(
          { message: "Broker not found" },
          { status: 404 }
        );
      }

      const broker = brokers[0];

      // Send invitation using domain logic
      const result = await sendInvitation(
        {
          id: broker.id,
          name: broker.name,
          email: broker.primary_email,
          owner_user_id: broker.owner_user_id,
        },
        BROKER_INVITATION_CONFIG,
        (id, data) => updateBroker(id, data),
        session,
        req
      );

      return createInvitationResponse(result);
    },
    { requiredRole: "admin" }
  );
}
