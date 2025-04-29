import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../lib/auth";
import {
  listCarriers,
  createCarrier,
  CreateCarrierInput,
} from "@/db/queries/carriers";

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

      try {
        // Parse the request body
        const carrierData: CreateCarrierInput = await req.json();

        // Validate input
        if (!carrierData.name || !carrierData.email || !carrierData.company) {
          return NextResponse.json(
            { message: "Name, email, and company are required" },
            { status: 400 }
          );
        }

        const newCarrier = await createCarrier(carrierData);
        // Return the new carrier as JSON
        return NextResponse.json({ carrier: newCarrier[0] });
      } catch (error) {
        console.error("Error creating carrier:", error);
        return NextResponse.json(
          { message: "An error occurred while creating the carrier" },
          { status: 500 }
        );
      }
    },
    { requiredRole: "admin" }
  );
}
