import { z } from 'zod';
import * as db from 'zapatos/db';
import type * as s from 'zapatos/schema';
import { sql } from '../client';

// Zod schema for broker input
export const createBrokerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  contactName: z.string().min(1),
});

export type CreateBrokerInput = z.infer<typeof createBrokerSchema>;

// Query functions
export async function listBrokers() {
  return await db.select('brokers', db.all, {
    order: [{ by: 'name', direction: 'ASC' }]
  }).run(sql);
}

export async function createBroker(
  input: CreateBrokerInput,
  ownerUserId: number
) {
  return await db.insert('brokers', {
    name: input.name,
    primary_email: input.email,
    owner_user_id: ownerUserId,
  }).run(sql);
}

export async function getBrokerById(id: number) {
  return await db.select('brokers', { id }).run(sql);
}

export async function updateBroker(
  id: number,
  data: Partial<s.brokers.Updatable>
) {
  return await db.update('brokers', data, { id }).run(sql);
}

export async function deleteBroker(id: number) {
  return await db.deletes('brokers', { id }).run(sql);
}
