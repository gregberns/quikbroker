import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { z } from 'zod';

// Phone number pattern (allow digits, spaces, dashes, parentheses, plus)
const phonePattern = /^[+]?[-\d()\s]{7,20}$/;

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Input validation schema - include optional contact and UTM params
const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  contact_name: z.string().optional(),
  brokerage_name: z.string().optional(),
  phone_number: z.string().optional().refine(
    val => !val || phonePattern.test(val),
    { message: 'Invalid phone number' }
  ),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      // Log the detailed validation error for debugging on the server
      console.error('[SIGNUP_VALIDATION_ERROR]', validation.error.flatten());
      // Return a user-friendly error message
      return NextResponse.json({ message: validation.error.errors[0].message || 'Invalid input.' }, { status: 400 });
    }

    const {
      email,
      contact_name,
      brokerage_name,
      phone_number,
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
      // Update existing record with any provided fields
      await pool.query(
        `UPDATE app.signups SET
           contact_name = COALESCE($2, contact_name),
           brokerage_name = COALESCE($3, brokerage_name),
           phone_number = COALESCE($4, phone_number),
           utm_source = COALESCE($5, utm_source),
           utm_medium = COALESCE($6, utm_medium),
           utm_campaign = COALESCE($7, utm_campaign),
           utm_content = COALESCE($8, utm_content),
           utm_term = COALESCE($9, utm_term),
           updated_at = NOW()
         WHERE email = $1`,
        [
          email,
          contact_name,
          brokerage_name,
          phone_number,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          utm_term
        ]
      );
      console.log(`Signup record updated for email: ${email}`);
      return NextResponse.json({ message: 'Signup updated successfully' }, { status: 200 });
    }

    // Insert new record
    await pool.query(
      `INSERT INTO app.signups
         (email, contact_name, brokerage_name, phone_number,
          utm_source, utm_medium, utm_campaign, utm_content, utm_term,
          created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [
        email,
        contact_name,
        brokerage_name,
        phone_number,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term
      ]
    );

    console.log(`New signup recorded for email: ${email}`);
    return NextResponse.json({ message: 'Signup created successfully' }, { status: 201 });

  } catch (error) {
    console.error('[SIGNUP_POST_ERROR]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 
