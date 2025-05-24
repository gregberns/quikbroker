// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { z } from "zod";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";
import { sql } from "../client";

// Zod schema for carrier input (API uses camelCase)
export const createCarrierSchema = z.object({
  carrierName: z.string().min(1),
  address: z.string().optional(),
});

export type CreateCarrierInput = z.infer<typeof createCarrierSchema>;

// Helper function to convert database result to API format (snake_case -> camelCase)
function convertCarrierToApiFormat(carrier: db.app.carriers.JSONSelectable) {
  return {
    id: carrier.id,
    createdAt: carrier.created_at,
    updatedAt: carrier.updated_at,
    carrierName: carrier.carrier_name,
    address: carrier.address,
    ownerUserId: carrier.owner_user_id,
  };
}

// Query functions
export async function listCarriers() {
  const carriers = await db
    .select("app.carriers", db.all, {
      order: [{ by: "carrier_name", direction: "ASC" }],
    })
    .run(sql);
  
  // Convert to API format (camelCase)
  return carriers.map(convertCarrierToApiFormat);
}

export async function createCarrier(input: CreateCarrierInput, ownerUserId?: number) {
  return await db
    .insert("app.carriers", {
      carrier_name: input.carrierName, // Convert camelCase to snake_case for DB
      address: input.address || null,
      owner_user_id: ownerUserId || null,
    })
    .run(sql);
}

export async function getCarrierById(id: number) {
  return await db.select("app.carriers", { id }).run(sql);
}

export async function updateCarrier(
  id: number,
  data: Partial<s.carriers.Updatable>
) {
  return await db.update("app.carriers", data, { id }).run(sql);
}

// Note: invitation_sent_at functionality moved to user_invites table
// since carriers now have associated users

export async function deleteCarrier(id: number) {
  return await db.deletes("app.carriers", { id }).run(sql);
}
