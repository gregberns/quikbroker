// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { z } from "zod";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";
import { sql } from "../client";

// Zod schema for creating a user
export const createUserSchema = z.object({
  email: z.string().email(),
  password_hash: z.string(),
  role: z.enum(["admin", "broker", "user"]),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// Type for user with broker name
export type UserWithBrokerName = s.users.Selectable & {
  broker_name: string | null;
};

export async function getUserByEmail(
  email: string
): Promise<s.users.Selectable | null> {
  const user = await db.selectOne("app.users", { email }).run(sql);

  return user || null;
}

export async function getUserById(
  id: number
): Promise<s.users.Selectable | null> {
  const user = await db.selectOne("app.users", { id }).run(sql);

  return user || null;
}

export async function createUser(
  input: CreateUserInput
): Promise<s.users.Selectable> {
  return await db
    .insert("app.users", {
      email: input.email,
      password_hash: input.password_hash,
      role: input.role,
    })
    .run(sql);
}

export async function updateUserEmail(
  userId: number,
  email: string
): Promise<s.users.Selectable | null> {
  return await db.update("app.users", { email }, { id: userId }).run(sql);
}

export async function updateUserPassword(
  userId: number,
  passwordHash: string
): Promise<s.users.Selectable | null> {
  return await db
    .update("app.users", { password_hash: passwordHash }, { id: userId })
    .run(sql);
}

export async function listUsersWithBrokerNames(): Promise<
  UserWithBrokerName[]
> {
  // This query needs to join users and brokers tables, which is more complex
  // than standard Zapatos operations, so we'll use raw SQL
  const result = await sql.query(
    `SELECT
      u.id, u.email, u.role, u.created_at, 
      CASE 
        WHEN u.role = 'broker' THEN b.brokerage_name 
        ELSE NULL 
      END as broker_name
    FROM app.users u
    LEFT JOIN app.brokers b ON u.id = b.owner_user_id
    ORDER BY u.id`
  );

  return result.rows;
}
