import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/db/client";
import { hashPassword } from "../../../lib/auth";
import {
  getUserInviteWithUserByToken,
  markUserInviteAsUsed,
} from "@/db/queries/userInvites";
import { updateUserPassword } from "@/db/queries/users";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const sql = getClient();
    try {
      // Start a transaction
      await sql.query("BEGIN");

      // Find the invitation by token with user information
      const invite = await getUserInviteWithUserByToken(token);

      // Check if invitation exists and is valid
      if (!invite) {
        return NextResponse.json(
          { message: "Invalid or expired verification token" },
          { status: 400 }
        );
      }

      // Check if the token has already been used
      if (invite.used_at) {
        return NextResponse.json(
          {
            message:
              "This verification link has already been used. Please request a new one.",
          },
          { status: 400 }
        );
      }

      // Use the centralized password hashing function
      const passwordHash = await hashPassword(password);

      // Update the user's password
      await updateUserPassword(invite.user_id, passwordHash);

      // Mark the invitation as used
      await markUserInviteAsUsed(invite.id);

      // Commit the transaction
      await sql.query("COMMIT");

      // Return success
      return NextResponse.json({
        message: "Password set successfully",
        email: invite.email,
      });
    } catch (error) {
      // Rollback the transaction on error
      await sql.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error setting password:", error);
    return NextResponse.json(
      { message: "An error occurred while setting your password" },
      { status: 500 }
    );
  }
}
