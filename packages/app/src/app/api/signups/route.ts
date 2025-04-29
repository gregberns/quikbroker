import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { signupExists, updateSignup, insertSignup } from "@/db/queries/signups";
// Phone number pattern (allow digits, spaces, dashes, parentheses, plus)
const phonePattern = /^[+]?[-\\d()\\s]{7,20}$/;

// Input validation schema - include optional contact and UTM params
const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  contact_name: z.string().optional(),
  brokerage_name: z.string().optional(),
  phone_number: z
    .string()
    .optional()
    .refine((val) => !val || phonePattern.test(val), {
      message: "Invalid phone number",
    }),
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
      console.error("[SIGNUP_VALIDATION_ERROR]", validation.error.flatten());
      // Return a user-friendly error message
      return NextResponse.json(
        { message: validation.error.errors[0].message || "Invalid input." },
        { status: 400 }
      );
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
      utm_term,
    } = validation.data;

    // Check if email already exists
    if (await signupExists(email)) {
      // Update existing record with any provided fields
      await updateSignup(email, {
        contact_name,
        brokerage_name,
        phone_number,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        updated_at: new Date(),
      });
      console.log(`Signup record updated for email: ${email}`);
      return NextResponse.json(
        { message: "Signup updated successfully" },
        { status: 200 }
      );
    }

    // Insert new record
    await insertSignup({
      email,
      contact_name,
      brokerage_name,
      phone_number,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      created_at: new Date(),
      updated_at: new Date(),
    });
    console.log(`New signup recorded for email: ${email}`);
    return NextResponse.json(
      { message: "Signup created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SIGNUP_POST_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
