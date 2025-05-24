import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../lib/auth";
import { listBrokers, createBroker } from "@/db/queries/brokers";
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

const BROKER_CREATION_CONFIG: EntityCreationConfig = {
  entityType: 'broker',
  createUser: true,
  taskIdentifier: 'broker_email_invite',
  requiredFields: ['name', 'email', 'contactName'],
  entitySpecificValidation: (input) => {
    if (!input.name || !input.email || !input.contactName) {
      return 'Broker company name, email, and primary contact name are required';
    }
    return null;
  },
};

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

      // Validate request body
      const validation = validateEntityCreationRequest(await req.json());
      if (!validation.isValid) {
        return NextResponse.json(
          { message: validation.error!.message },
          { status: validation.error!.statusCode }
        );
      }

      // Create broker using domain logic
      const result = await createEntity(
        validation.input!,
        BROKER_CREATION_CONFIG,
        (data, ownerUserId) => createBroker(data, ownerUserId),
        session,
        req
      );

      return createEntityResponse(result, 'broker');
    },
    { requiredRole: "admin" }
  );
}
