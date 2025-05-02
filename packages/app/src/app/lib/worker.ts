import { getUserById } from '@/db/queries/users';
import { getUserInviteById, markUserInviteAsSent } from '@/db/queries/userInvites';
import { getBrokerById } from '@/db/queries/brokers';
import { sendEmail, getBrokerInviteEmail } from './email';
import { logErrorToServer } from './errorHandling';
import { getClient } from '@/db/client';

/**
 * Process a broker email invite job
 * @param payload Job payload containing user_invite_id
 */
export async function processBrokerEmailInvite(payload: { user_invite_id: number }) {
  try {
    const sql = getClient();
    
    try {
      // Start a transaction
      await sql.query("BEGIN");
      
      // Get the invitation
      const invite = await getUserInviteById(payload.user_invite_id);
      
      if (!invite) {
        throw new Error(`Invitation not found: ${payload.user_invite_id}`);
      }
      
      // Get the user
      const user = await getUserById(invite.user_id);
      
      if (!user) {
        throw new Error(`User not found for invitation: ${invite.user_id}`);
      }
      
      // Get the broker (user should be a broker)
      const brokers = await getBrokerById(user.id);
      
      if (!brokers || brokers.length === 0) {
        throw new Error(`Broker not found for user: ${user.id}`);
      }
      
      const broker = brokers[0];
      
      // Generate the invitation URL
      const inviteUrl = `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/verify-email?token=${invite.token}`;
      
      // Generate and send email
      const emailOptions = getBrokerInviteEmail(
        user.email,
        inviteUrl,
        broker.name,
        broker.brokerage_name
      );
      
      const emailSent = await sendEmail(emailOptions);
      
      if (!emailSent) {
        throw new Error(`Failed to send invitation email to: ${user.email}`);
      }
      
      // Mark the invitation as sent
      await markUserInviteAsSent(invite.id);
      
      // Commit the transaction
      await sql.query("COMMIT");
      
    } catch (error) {
      // Rollback the transaction on error
      await sql.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    // Log the error
    logErrorToServer({
      type: "worker-error",
      task: "broker_email_invite",
      message: error instanceof Error ? error.message : "Unknown error in broker_email_invite worker",
      stack: error instanceof Error ? error.stack : undefined,
      payload,
      timestamp: new Date().toISOString(),
    });
  }
}

// Function to process job based on task type
export async function processJob(taskIdentifier: string, payload: Record<string, unknown>) {
  try {
    switch (taskIdentifier) {
      case 'broker_email_invite':
        await processBrokerEmailInvite(payload as { user_invite_id: number });
        break;
      // Add more job types here
      default:
        console.warn(`Unknown job type: ${taskIdentifier}`);
    }
  } catch (error) {
    logErrorToServer({
      type: "worker-error",
      task: taskIdentifier,
      message: error instanceof Error ? error.message : `Unknown error in ${taskIdentifier} worker`,
      stack: error instanceof Error ? error.stack : undefined,
      payload,
      timestamp: new Date().toISOString(),
    });
  }
}