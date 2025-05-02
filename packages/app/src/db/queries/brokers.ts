// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { z } from "zod";
import * as db from "zapatos/db";
// import type * as s from "zapatos/schema";
import { sql } from "../client";

// Zod schema for broker input
export const createBrokerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  contactName: z.string().min(1),
  brokerage_name: z.string().optional(),
});

export type CreateBrokerInput = z.infer<typeof createBrokerSchema>;

// Query functions
export async function listBrokers() {
  // Use type assertion to work around Zapatos schema issues
  return await db
    .select("app.brokers" as unknown, db.all, {
      order: [{ by: "name", direction: "ASC" }],
    })
    .run(sql);
}

export async function createBroker(
  input: CreateBrokerInput,
  ownerUserId: number
) {
  // Use type assertion to work around Zapatos schema issues
  return await db
    .insert(
      "app.brokers" as unknown,
      {
        name: input.name,
        primary_email: input.email,
        owner_user_id: ownerUserId,
        brokerage_name: input.brokerage_name,
      } as unknown
    )
    .run(sql);
}

export async function getBrokerById(id: number) {
  // Use type assertion to work around Zapatos schema issues
  return await db.select("app.brokers" as unknown, { id } as unknown).run(sql);
}

export async function updateBroker(
  id: number,
  // Use type assertion instead of schema reference
  data: Partial<unknown>
) {
  // Use type assertion to work around Zapatos schema issues
  return await db
    .update("app.brokers" as unknown, data, { id } as unknown)
    .run(sql);
}

export async function deleteBroker(id: number) {
  // Use type assertion to work around Zapatos schema issues
  return await db.deletes("app.brokers" as unknown, { id } as unknown).run(sql);
}
