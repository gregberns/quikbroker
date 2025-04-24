import { z } from 'zod';
import * as db from 'zapatos/db';
import type * as s from 'zapatos/schema';
import { sql } from '../client';

// Zod schema for carrier input
export const createCarrierSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type CreateCarrierInput = z.infer<typeof createCarrierSchema>;

// Query functions
export async function listCarriers() {
  return await db.select('carriers', db.all, {
    order: [{ by: 'name', direction: 'ASC' }]
  }).run(sql);
}

export async function createCarrier(input: CreateCarrierInput) {
  return await db.insert('carriers', {
    name: input.name,
    email: input.email,
    company: input.company,
    phone: input.phone || null,
    address: input.address || null,
  }).run(sql);
}

export async function getCarrierById(id: number) {
  return await db.select('carriers', { id }).run(sql);
}

export async function updateCarrier(
  id: number,
  data: Partial<s.carriers.Updatable>
) {
  return await db.update('carriers', data, { id }).run(sql);
}

export async function deleteCarrier(id: number) {
  return await db.deletes('carriers', { id }).run(sql);
}
