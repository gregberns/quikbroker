import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { z } from 'zod';

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- Schemas ---

// Schema for initial POST request (email + UTM)
const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
});

// Schema for PUT request (update with contact details)
// Basic North American phone number format check (adjust regex as needed)
const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
const updateSignupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address is required to update.' }),
  contact_name: z.string().optional(),
  brokerage_name: z.string().optional(),
  phone_number: z.string().optional().refine(
    (val) => !val || phoneRegex.test(val),
    { message: "Invalid phone number format." }
  ),
});

// --- Route Handlers ---

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input using signupSchema
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      console.error('[SIGNUP_POST_VALIDATION_ERROR]', validation.error.flatten());
      return NextResponse.json({ message: validation.error.errors[0].message || 'Invalid input.' }, { status: 400 });
    }

    const {
      email,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term
    } = validation.data;

    // Check if email already exists in app.signups
    const existingSignup = await pool.query(
      'SELECT email FROM app.signups WHERE email = $1',
      [email]
    );

    if (existingSignup.rows.length > 0) {
      // Email already exists. Optionally update UTM data or just log.
      console.log(`Signup attempt for existing email: ${email}. Optionally update UTM data.`);
      // Example: Update UTM data for existing entry
      /*
      await pool.query(
        `UPDATE app.signups 
         SET 
           updated_at = NOW(), 
           utm_source = COALESCE($2, utm_source), 
           utm_medium = COALESCE($3, utm_medium), 
           utm_campaign = COALESCE($4, utm_campaign), 
           utm_content = COALESCE($5, utm_content), 
           utm_term = COALESCE($6, utm_term)
         WHERE email = $1`,
        [email, utm_source, utm_medium, utm_campaign, utm_content, utm_term]
      );
      */
      return NextResponse.json({ message: 'Signup information updated or already exists.' }, { status: 200 });
    }

    // Insert email and UTM data into the app.signups table
    await pool.query(
      `INSERT INTO app.signups 
       (email, utm_source, utm_medium, utm_campaign, utm_content, utm_term, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [email, utm_source, utm_medium, utm_campaign, utm_content, utm_term]
    );

    console.log(`New signup recorded for email: ${email} with UTM data.`);
    return NextResponse.json({ message: 'Signup successful' }, { status: 201 });

  } catch (error) {
    console.error('[SIGNUP_POST_ERROR]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input using updateSignupSchema
    const validation = updateSignupSchema.safeParse(body);
    if (!validation.success) {
      console.error('[SIGNUP_PUT_VALIDATION_ERROR]', validation.error.flatten());
      return NextResponse.json({ message: validation.error.errors[0].message || 'Invalid input.' }, { status: 400 });
    }

    const {
      email,
      contact_name,
      brokerage_name,
      phone_number
    } = validation.data;

    // Ensure the signup record exists before updating
    const existingSignup = await pool.query(
      'SELECT id FROM app.signups WHERE email = $1',
      [email]
    );

    if (existingSignup.rows.length === 0) {
      console.warn(`Attempted to update non-existent signup for email: ${email}`);
      return NextResponse.json({ message: 'Signup record not found for this email.' }, { status: 404 });
    }

    // Update the signup record with the provided details
    // Use COALESCE to only update fields if they are provided in the request
    const updateQuery = `
      UPDATE app.signups
      SET
        contact_name = COALESCE($2, contact_name),
        brokerage_name = COALESCE($3, brokerage_name),
        phone_number = COALESCE($4, phone_number),
        updated_at = NOW()
      WHERE email = $1
      RETURNING id; -- Return ID to confirm update
    `;

    const result = await pool.query(updateQuery, [
      email,
      contact_name || null, // Pass null if undefined/empty
      brokerage_name || null,
      phone_number || null
    ]);

    if (result.rowCount === 0) {
      // This shouldn't happen if the existence check passed, but good practice
      console.error(`Failed to update signup record for email: ${email}`);
      return NextResponse.json({ message: 'Failed to update signup record.' }, { status: 500 });
    }

    console.log(`Updated contact info for signup email: ${email}`);
    return NextResponse.json({ message: 'Contact information submitted successfully.' }, { status: 200 });

  } catch (error) {
    console.error('[SIGNUP_PUT_ERROR]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 
