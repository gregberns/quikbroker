import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { withTransaction } from "@/db/transaction";
import { createUserInvite } from "@/db/queries/userInvites";
import { createJob } from "@/db/queries/jobs";
import { logErrorToServer } from "@/app/lib/errorHandling";

export interface InvitationEntity {
  id: number;
  name: string;
  email: string;
  owner_user_id?: number | null;
  [key: string]: unknown;
}

export interface InvitationResult {
  success: boolean;
  message: string;
  entity?: InvitationEntity & { invitation_sent_at: Date };
  inviteUrl?: string;
  statusCode: number;
}

export interface InvitationConfig {
  entityType: 'broker' | 'carrier';
  requiresUserAssociation: boolean;
  taskIdentifier: string;
  emailField: string;
}

// Helper function to generate a secure random token
function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

export async function sendInvitation(
  entity: InvitationEntity,
  config: InvitationConfig,
  updateEntityFn: (id: number, data: { invitation_sent_at: Date }) => Promise<unknown>,
  session: { id: string; role: string },
  req: NextRequest
): Promise<InvitationResult> {
  // Validate entity requirements
  if (config.requiresUserAssociation && !entity.owner_user_id) {
    return {
      success: false,
      message: `${config.entityType} has no associated user. Please assign a user first.`,
      statusCode: 400,
    };
  }

  const timestamp = new Date();

  try {
    if (config.requiresUserAssociation) {
      // Complex flow with user association - use transaction
      const result = await withTransaction(async () => {
        // Generate invitation token and create invite record
        const token = generateSecureToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        const invite = await createUserInvite({
          user_id: entity.owner_user_id!,
          token,
          expires_at: expiresAt,
        });

        // Create job to send email
        const job = await createJob({
          task_identifier: config.taskIdentifier,
          payload: { user_invite_id: invite.id },
        });

        // Process job immediately in development
        if (process.env.NODE_ENV !== "production") {
          const { processJob } = await import("@/app/lib/worker");
          // @ts-expect-error Dynamic import type issue
          await processJob(job.task_identifier, job.payload);
        }

        // Update entity record
        await updateEntityFn(entity.id, { invitation_sent_at: timestamp });

        // Generate invitation URL
        const inviteUrl = `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/verify-email?token=${token}`;

        return {
          success: true,
          message: `Invitation sent to ${entity[config.emailField] as string}`,
          entity: { ...entity, invitation_sent_at: timestamp },
          inviteUrl,
          statusCode: 200,
        };
      });

      return result;
    } else {
      // Simple flow without user association - just update timestamp
      console.log(
        `Invitation sent to ${config.entityType}: ${entity.name} (${entity.email})`
      );

      await updateEntityFn(entity.id, { invitation_sent_at: timestamp });

      return {
        success: true,
        message: `Invitation sent to ${entity.email}`,
        entity: { ...entity, invitation_sent_at: timestamp },
        statusCode: 200,
      };
    }
  } catch (error) {
    // Log error
    logErrorToServer({
      type: "api-error",
      message:
        error instanceof Error
          ? error.message
          : "Unknown error sending invitation",
      stack: error instanceof Error ? error.stack : undefined,
      url: req.url,
      [config.entityType + 'Id']: entity.id.toString(),
      userId: session.id,
      userRole: session.role,
      timestamp: new Date().toISOString(),
    });

    console.error("Error sending invitation:", error);
    
    return {
      success: false,
      message: "An error occurred while sending the invitation",
      statusCode: 500,
    };
  }
}

export function validateInvitationRequest(id: string): { 
  isValid: boolean; 
  entityId?: number; 
  error?: { message: string; statusCode: number } 
} {
  const entityId = parseInt(id);
  
  if (isNaN(entityId)) {
    return {
      isValid: false,
      error: { message: "Invalid ID", statusCode: 400 }
    };
  }
  
  return { isValid: true, entityId };
}

export function createInvitationResponse(result: InvitationResult): NextResponse {
  if (result.success) {
    const entityKey = result.entity?.name ? 'broker' : 'carrier';
    return NextResponse.json({
      message: result.message,
      [entityKey]: result.entity,
      ...(result.inviteUrl && { inviteUrl: result.inviteUrl }),
    });
  } else {
    return NextResponse.json(
      { message: result.message },
      { status: result.statusCode }
    );
  }
}