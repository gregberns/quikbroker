import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { withTransaction } from "@/db/transaction";
import { hashPassword } from "@/app/lib/auth";
import { createUser } from "@/db/queries/users";
import { createUserInvite } from "@/db/queries/userInvites";
import { createJob } from "@/db/queries/jobs";
// Note: Removed logErrorToServer import as it's client-side only
// TODO: Replace with proper server-side logging solution

export interface EntityCreationInput {
  // Broker fields
  name?: string;
  email?: string;
  contactName?: string;
  brokerageName?: string;
  // Carrier fields  
  carrierName?: string;
  address?: string;
  // Legacy support for backwards compatibility
  brokerage_name?: string;
  carrier_name?: string;
  company?: string;
  phone?: string;
}

export interface EntityCreationConfig {
  entityType: 'broker' | 'carrier';
  createUser: boolean;
  taskIdentifier: string;
  requiredFields: string[];
  entitySpecificValidation?: (input: EntityCreationInput) => string | null;
}

export interface EntityCreationResult {
  success: boolean;
  message?: string;
  entity?: unknown;
  user?: {
    id: number;
    email: string;
    role: string;
  };
  inviteUrl?: string;
  statusCode: number;
  errorType?: 'validation' | 'duplicate' | 'server';
}

// Helper function to generate a secure random token
function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

// Helper function to normalize input from various formats to camelCase
function normalizeEntityInput(input: EntityCreationInput): EntityCreationInput {
  const normalized = { ...input };
  
  // Handle carrier fields - prefer camelCase, fallback to snake_case or legacy company
  if (!normalized.carrierName && (normalized.carrier_name || normalized.company)) {
    normalized.carrierName = normalized.carrier_name || normalized.company;
  }
  
  // Handle broker fields - prefer camelCase, fallback to snake_case
  if (!normalized.brokerageName && normalized.brokerage_name) {
    normalized.brokerageName = normalized.brokerage_name;
  }
  
  return normalized;
}

export async function createEntity(
  input: EntityCreationInput,
  config: EntityCreationConfig,
  createEntityFn: (data: EntityCreationInput, ownerUserId?: number) => Promise<unknown>,
  session: { id: string; role: string },
  req: NextRequest
): Promise<EntityCreationResult> {
  try {
    // Normalize input to handle camelCase and legacy formats
    const normalizedInput = normalizeEntityInput(input);
    
    // Validate required fields
    const missingFields = config.requiredFields.filter(field => !normalizedInput[field as keyof EntityCreationInput]);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} ${missingFields.length === 1 ? 'is' : 'are'} required`,
        statusCode: 400,
        errorType: 'validation',
      };
    }

    // Run entity-specific validation if provided
    if (config.entitySpecificValidation) {
      const validationError = config.entitySpecificValidation(normalizedInput);
      if (validationError) {
        return {
          success: false,
          message: validationError,
          statusCode: 400,
          errorType: 'validation',
        };
      }
    }

    if (config.createUser) {
      // Ensure email is provided for user creation
      if (!normalizedInput.email) {
        return {
          success: false,
          message: 'Email is required for user creation',
          statusCode: 400,
          errorType: 'validation',
        };
      }

      // Complex flow with user creation - use transaction
      const result = await withTransaction(async () => {
        // 1. Create a temporary random password for the user
        const tempPassword = generateSecureToken(12);
        const passwordHash = await hashPassword(tempPassword);

        // 2. Create a new user with the appropriate role
        const newUser = await createUser({
          email: normalizedInput.email!,
          password_hash: passwordHash,
          role: config.entityType === 'carrier' ? 'user' : config.entityType,
        });

        // 3. Create the entity record and link it to the user
        const entity = await createEntityFn(normalizedInput, newUser.id);

        // 4. Generate an invitation token that expires in 7 days
        const token = generateSecureToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // 5. Create an invitation record
        const invite = await createUserInvite({
          user_id: newUser.id,
          token,
          expires_at: expiresAt,
        });

        // 6. Create a job to send the invitation email
        const job = await createJob({
          task_identifier: config.taskIdentifier,
          payload: { user_invite_id: invite.id },
        });

        // Process the job immediately in development mode
        if (process.env.NODE_ENV !== "production") {
          const { processJob } = await import("@/app/lib/worker");
          // @ts-expect-error Dynamic import type issue
          await processJob(job.task_identifier, job.payload);
        }

        // Generate the invitation URL
        const inviteUrl = `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/verify-email?token=${token}`;

        return {
          success: true,
          entity,
          user: {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
          },
          inviteUrl,
          statusCode: 201,
        };
      });

      return result;
    } else {
      // Simple flow without user creation
      const entity = await createEntityFn(normalizedInput);

      return {
        success: true,
        entity,
        statusCode: 201,
      };
    }
  } catch (error) {
    // Handle specific database constraint violations
    if (error instanceof Error && 'code' in error && error.code === '23505') {
      if ('constraint' in error) {
        if (error.constraint === 'users_email_key') {
          return {
            success: false,
            message: 'A user with this email already exists',
            statusCode: 409,
            errorType: 'duplicate',
          };
        }
        if (error.constraint === 'brokers_primary_email_key') {
          return {
            success: false,
            message: 'A broker with this email already exists',
            statusCode: 409,
            errorType: 'duplicate',
          };
        }
        if (error.constraint === 'carriers_email_key') {
          return {
            success: false,
            message: 'A carrier with this email already exists',
            statusCode: 409,
            errorType: 'duplicate',
          };
        }
      }
    }

    // Log the error (TODO: Replace with proper server-side logging solution)
    console.error(`Error creating ${config.entityType}:`, {
      error: error instanceof Error ? error.message : "Unknown error creating entity",
      stack: error instanceof Error ? error.stack : undefined,
      url: req.url,
      entityType: config.entityType,
      entityData: JSON.stringify(input),
      userId: session.id,
      userRole: session.role,
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      message: `An error occurred while creating the ${config.entityType}`,
      statusCode: 500,
      errorType: 'server',
    };
  }
}

export function validateEntityCreationRequest(
  data: unknown
): { isValid: boolean; input?: EntityCreationInput; error?: { message: string; statusCode: number } } {
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      error: { message: 'Invalid request body', statusCode: 400 }
    };
  }

  return { isValid: true, input: data as EntityCreationInput };
}

export function createEntityResponse(result: EntityCreationResult, entityType: string): NextResponse {
  if (result.success) {
    const responseBody: Record<string, unknown> = {
      [entityType]: result.entity,
    };

    if (result.user) {
      responseBody.user = result.user;
    }

    if (result.inviteUrl) {
      responseBody.inviteUrl = result.inviteUrl;
    }

    return NextResponse.json(responseBody, { status: result.statusCode });
  } else {
    return NextResponse.json(
      { message: result.message },
      { status: result.statusCode }
    );
  }
}