// This module handles email sending for the application
// For a real application, you would use a proper email service like SendGrid, Mailgun, etc.
// For this example, we'll use a mock implementation

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
}

/**
 * Send an email
 * @param options Email options including recipient, subject, and content
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // In development, log the email to the console
  if (process.env.NODE_ENV !== 'production') {
    console.log('=== EMAIL SENT ===');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Text: ${options.text || 'N/A'}`);
    console.log(`HTML: ${options.html || 'N/A'}`);
    console.log('===================');
    return true;
  }
  
  // In production, use configured email provider (example with SMTP)
  try {
    // Example of how you might send via SMTP in production:
    /*
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: options.from || process.env.SMTP_FROM || 'noreply@quikbroker.com',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
    });
    */
    
    // For now, log that we would send an email
    console.log(`[PRODUCTION] Would send email to ${options.to} with subject "${options.subject}"`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Generate an email for broker invitation
 * @param email Recipient email address
 * @param inviteUrl Invitation URL with token
 * @param brokerName Broker's name or company
 * @param brokerage_name Optional brokerage name
 * @returns Email options object
 */
export function getBrokerInviteEmail(
  email: string,
  inviteUrl: string,
  brokerName: string,
  brokerage_name?: string
): EmailOptions {
  const companyName = brokerage_name || brokerName;
  
  return {
    to: email,
    subject: `Invitation to join QuikBroker - ${companyName}`,
    text: `
Hello,

You have been invited to join QuikBroker as a broker for ${companyName}.

Please click the following link to verify your email and set up your account:
${inviteUrl}

This link will expire in 7 days.

If you did not request this invitation, you can safely ignore this email.

Best regards,
The QuikBroker Team
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuikBroker Invitation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 5px 5px; }
    .button { display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>QuikBroker Invitation</h1>
  </div>
  <div class="content">
    <p>Hello,</p>
    <p>You have been invited to join QuikBroker as a broker for <strong>${companyName}</strong>.</p>
    <p>Please click the button below to verify your email and set up your account:</p>
    <a href="${inviteUrl}" class="button">Accept Invitation</a>
    <p>This link will expire in 7 days.</p>
    <p>If you cannot click the button, copy and paste this URL into your browser:</p>
    <p style="word-break: break-all;"><small>${inviteUrl}</small></p>
    <p>If you did not request this invitation, you can safely ignore this email.</p>
    <p>Best regards,<br>The QuikBroker Team</p>
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} QuikBroker. All rights reserved.</p>
  </div>
</body>
</html>
    `,
  };
}

/**
 * Generate an email for carrier invitation
 * @param email Recipient email address
 * @param inviteUrl Invitation URL with token
 * @param brokerName Broker's name or company inviting the carrier
 * @param carrierName Carrier's name or company
 * @param message Optional personalized message
 * @returns Email options object
 */
export function getCarrierInviteEmail(
  email: string,
  inviteUrl: string,
  brokerName: string,
  carrierName: string,
  message?: string
): EmailOptions {
  return {
    to: email,
    subject: `${brokerName} invites you to join QuikBroker`,
    text: `
Hello ${carrierName},

${brokerName} has invited you to join QuikBroker as a carrier partner.

${message ? `Message from ${brokerName}:\n"${message}"\n\n` : ''}

Please click the following link to verify your email and set up your account:
${inviteUrl}

This link will expire in 7 days.

If you did not expect this invitation, you can safely ignore this email.

Best regards,
The QuikBroker Team
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuikBroker Carrier Invitation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 5px 5px; }
    .button { display: inline-block; background-color: #059669; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0; }
    .message { background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0; font-style: italic; }
    .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Carrier Invitation</h1>
  </div>
  <div class="content">
    <p>Hello ${carrierName},</p>
    <p><strong>${brokerName}</strong> has invited you to join QuikBroker as a carrier partner.</p>
    
    ${message ? `
    <div class="message">
      <p><strong>Message from ${brokerName}:</strong></p>
      <p>"${message}"</p>
    </div>
    ` : ''}
    
    <p>Please click the button below to verify your email and set up your account:</p>
    <a href="${inviteUrl}" class="button">Accept Invitation</a>
    <p>This link will expire in 7 days.</p>
    <p>If you cannot click the button, copy and paste this URL into your browser:</p>
    <p style="word-break: break-all;"><small>${inviteUrl}</small></p>
    <p>If you did not expect this invitation, you can safely ignore this email.</p>
    <p>Best regards,<br>The QuikBroker Team</p>
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} QuikBroker. All rights reserved.</p>
  </div>
</body>
</html>
    `,
  };
}