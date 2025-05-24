import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../lib/auth";
import { listCarriers, createCarrier } from "@/db/queries/carriers";
import {
  createEntity,
  validateEntityCreationRequest,
  createEntityResponse,
  type EntityCreationConfig,
} from "../../../lib/domain/entityCreation";

export async function GET(req: NextRequest) {
  return requireAuth(
    req,
    async (req, session) => {
      // Only admins can list all carriers
      if (session.role !== "admin") {
        return NextResponse.json(
          { message: "Admin access required" },
          { status: 403 }
        );
      }

      try {
        const carriers = await listCarriers();
        return NextResponse.json({ carriers });
      } catch (error) {
        console.error("Error fetching carriers:", error);
        return NextResponse.json(
          { message: "An error occurred while fetching carriers" },
          { status: 500 }
        );
      }
    },
    { requiredRole: "admin" }
  );
}

const CARRIER_CREATION_CONFIG: EntityCreationConfig = {
  entityType: 'carrier',
  createUser: true, // Now carriers will also create users like brokers
  taskIdentifier: 'carrier_email_invite',
  requiredFields: ['carrierName', 'email'], // email is needed for user creation
  entitySpecificValidation: (input) => {
    if (!input.carrierName || !input.email) {
      return 'Carrier name and email are required';
    }
    return null;
  },
};

export async function POST(req: NextRequest) {
  return requireAuth(
    req,
    async (req, session) => {
      // Only admins can create carriers
      if (session.role !== "admin") {
        return NextResponse.json(
          { message: "Admin access required" },
          { status: 403 }
        );
      }

      // Validate request body
      const validation = validateEntityCreationRequest(await req.json());
      if (!validation.isValid) {
        return NextResponse.json(
          { message: validation.error!.message },
          { status: validation.error!.statusCode }
        );
      }

      // Create carrier using domain logic
      const result = await createEntity(
        validation.input!,
        CARRIER_CREATION_CONFIG,
        (data, ownerUserId) => createCarrier(data, ownerUserId),
        session,
        req
      );

      return createEntityResponse(result, 'carrier');
    },
    { requiredRole: "admin" }
  );
}
