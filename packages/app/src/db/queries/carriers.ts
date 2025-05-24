// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { z } from "zod";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";
import { sql } from "../client";

// Zod schema for carrier input
export const createCarrierSchema = z.object({
  carrier_name: z.string().min(1),
  address: z.string().optional(),
});

export type CreateCarrierInput = z.infer<typeof createCarrierSchema>;

// Query functions
export async function listCarriers() {
  return await db
    .select("app.carriers", db.all, {
      order: [{ by: "carrier_name", direction: "ASC" }],
    })
    .run(sql);
}

export async function createCarrier(input: CreateCarrierInput, ownerUserId?: number) {
  return await db
    .insert("app.carriers", {
      carrier_name: input.carrier_name,
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
