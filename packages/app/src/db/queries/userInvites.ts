// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { z } from "zod";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";
import { sql } from "../client";

// Zod schema for creating a user invite
export const createUserInviteSchema = z.object({
  user_id: z.number(),
  token: z.string(),
  expires_at: z.date(),
});

export type CreateUserInviteInput = z.infer<typeof createUserInviteSchema>;

// Type for user invite with user information
export type UserInviteWithUser = s.user_invites.Selectable & {
  user_id: number;
  email: string;
};

export async function createUserInvite(
  input: CreateUserInviteInput
): Promise<s.user_invites.Selectable> {
  return await db
    .insert("app.user_invites", {
      user_id: input.user_id,
      token: input.token,
      expires_at: input.expires_at,
    })
    .run(sql);
}

export async function getUserInviteByToken(
  token: string
): Promise<s.user_invites.Selectable | null> {
  const invite = await db
    .selectOne(
      "app.user_invites",
      { token, expires_at: db.conditions.gt(new Date()) },
      {
        order: [{ by: "created_at", direction: "DESC" }],
      }
    )
    .run(sql);

  return invite || null;
}

export async function getUserInviteWithUserByToken(
  token: string
): Promise<UserInviteWithUser | null> {
  // This query joins user_invites and users tables, which is more complex
  // than standard Zapatos operations, so we'll use raw SQL
  const result = await sql.query(
    `SELECT i.*, u.id as user_id, u.email 
     FROM app.user_invites i
     JOIN app.users u ON i.user_id = u.id
     WHERE i.token = $1 AND i.expires_at > NOW()`,
    [token]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

export async function getActiveInviteForUser(
  userId: number
): Promise<s.user_invites.Selectable | null> {
  const invite = await db
    .selectOne(
      "app.user_invites",
      { user_id: userId, expires_at: db.conditions.gt(new Date()) },
      {
        order: [{ by: "created_at", direction: "DESC" }],
      }
    )
    .run(sql);

  return invite || null;
}

export async function getUserInviteById(
  id: number
): Promise<s.user_invites.Selectable | null> {
  const invite = await db.selectOne("app.user_invites", { id }).run(sql);

  return invite || null;
}

export async function markUserInviteAsSent(
  id: number
): Promise<s.user_invites.Selectable | null> {
  return await db
    .update("app.user_invites", { sent_at: new Date() }, { id })
    .run(sql);
}

export async function markUserInviteAsUsed(
  id: number
): Promise<s.user_invites.Selectable | null> {
  return await db
    .update("app.user_invites", { used_at: new Date() }, { id })
    .run(sql);
}

export async function updateBrokerInvitationSent(
  userId: number
): Promise<void> {
  // This is a conditional update that's easier with raw SQL
  await sql.query(
    `UPDATE app.brokers 
     SET invitation_sent_at = COALESCE(invitation_sent_at, NOW()) 
     WHERE owner_user_id = $1`,
    [userId]
  );
}
