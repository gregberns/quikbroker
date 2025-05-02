import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../lib/auth";
import { logErrorToServer } from "../../../lib/errorHandling";
import { getBrokerById, updateBroker } from "@/db/queries/brokers";
import { updateUserEmail } from "@/db/queries/users";
import { getClient } from "@/db/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return requireAuth(req, async (req, session) => {
    try {
      const brokerId = parseInt(id);

      if (isNaN(brokerId)) {
        return NextResponse.json(
          { message: "Invalid broker ID" },
          { status: 400 }
        );
      }

      const broker = await getBrokerById(brokerId);

      if (!broker || broker.length === 0) {
        return NextResponse.json(
          { message: "Broker not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ broker: broker[0] });
    } catch (error) {
      console.error("Error fetching broker:", error);

      // Log the error to our error logging system
      logErrorToServer({
        type: "api-error",
        message:
          error instanceof Error
            ? error.message
            : "Unknown error fetching broker",
        stack: error instanceof Error ? error.stack : undefined,
        url: req.url,
        brokerId: id,
        userId: session?.id,
        userRole: session?.role,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { message: "An error occurred while fetching the broker" },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return requireAuth(
    req,
    async (req, session) => {
      // Only admins can update brokers
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

        // Parse the request body
        const { name, primary_email, brokerage_name } = await req.json();

        // Validate input
        if (!name || !primary_email) {
          return NextResponse.json(
            { message: "Broker name and email are required" },
            { status: 400 }
          );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(primary_email)) {
          return NextResponse.json(
            { message: "Invalid email format" },
            { status: 400 }
          );
        }

        const sql = getClient();
        try {
          // Start a transaction
          await sql.query("BEGIN");

          const existingBroker = await getBrokerById(brokerId);
          if (!existingBroker || existingBroker.length === 0) {
            return NextResponse.json(
              { message: "Broker not found" },
              { status: 404 }
            );
          }

          const updateData = { name, primary_email, brokerage_name };
          await updateBroker(brokerId, updateData);

          // Update the user email if there's an associated user
          if (existingBroker[0].owner_user_id) {
            await updateUserEmail(
              existingBroker[0].owner_user_id,
              primary_email
            );
          }

          // Commit the transaction
          await sql.query("COMMIT");

          const updatedBroker = await getBrokerById(brokerId);

          return NextResponse.json({
            message: "Broker updated successfully",
            broker: updatedBroker[0],
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
              : "Unknown error updating broker",
          stack: error instanceof Error ? error.stack : undefined,
          url: req.url,
          brokerId: id,
          userId: session?.id,
          userRole: session?.role,
          timestamp: new Date().toISOString(),
        });

        console.error("Error updating broker:", error);
        return NextResponse.json(
          { message: "An error occurred while updating the broker" },
          { status: 500 }
        );
      }
    },
    { requiredRole: "admin" }
  );
}
