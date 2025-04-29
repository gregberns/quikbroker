import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/db/client";
import {
  getUserInviteWithUserByToken,
  updateBrokerInvitationSent,
} from "@/db/queries/userInvites";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
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

      // We don't mark the invitation as used here - we'll do that when they set their password
      // This allows the token to be valid for the password setting step

      // Update the broker invitation sent timestamp if not already set
      await updateBrokerInvitationSent(invite.user_id);

      // Commit the transaction
      await sql.query("COMMIT");

      // Return success with user information
      return NextResponse.json({
        message: "Email verified successfully",
        user: {
          id: invite.user_id,
          email: invite.email,
        },
      });
    } catch (error) {
      // Rollback the transaction on error
      await sql.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { message: "An error occurred while verifying your email" },
      { status: 500 }
    );
  }
}
