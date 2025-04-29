import { NextRequest, NextResponse } from "next/server";
import { requireAuth, hashPassword } from "../../../lib/auth";
import { getUserById, updateUserPassword } from "@/db/queries/users";

export async function POST(req: NextRequest) {
  return requireAuth(
    req,
    async (req, session) => {
      // Only admins can reset passwords
      if (session.role !== "admin") {
        return NextResponse.json(
          { message: "Admin access required" },
          { status: 403 }
        );
      }

      try {
        const { userId, newPassword } = await req.json();

        if (!userId || !newPassword) {
          return NextResponse.json(
            { message: "User ID and new password are required" },
            { status: 400 }
          );
        }

        // Validate password strength
        if (newPassword.length < 8) {
          return NextResponse.json(
            { message: "Password must be at least 8 characters long" },
            { status: 400 }
          );
        }

        // Get the user to make sure they exist
        const user = await getUserById(parseInt(userId));

        if (!user) {
          return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
          );
        }

        // Use the centralized password hashing function
        const passwordHash = await hashPassword(newPassword);

        // Update the user's password
        await updateUserPassword(parseInt(userId), passwordHash);

        return NextResponse.json({
          message: "Password updated successfully",
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        });
      } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json(
          { message: "An error occurred while resetting the password" },
          { status: 500 }
        );
      }
    },
    { requiredRole: "admin" }
  );
}
