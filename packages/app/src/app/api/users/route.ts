import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../lib/auth";
import { listUsersWithBrokerNames } from "@/db/queries/users";

export async function GET(req: NextRequest) {
  return requireAuth(
    req,
    async (req, session) => {
      // Only admins can list all users
      if (session.role !== "admin") {
        return NextResponse.json(
          { message: "Admin access required" },
          { status: 403 }
        );
      }

      try {
        // Get users with their broker names
        const users = await listUsersWithBrokerNames();

        // Return the users as JSON
        return NextResponse.json({ users });
      } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
          { message: "An error occurred while fetching users" },
          { status: 500 }
        );
      }
    },
    { requiredRole: "admin" }
  );
}
