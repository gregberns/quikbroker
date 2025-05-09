// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as db from "zapatos/db";
import { signups } from "zapatos/schema";
import { sql } from "../client";

export async function signupExists(email: string): Promise<boolean> {
  const signup = await db.selectOne("app.signups", { email }).run(sql);
  return !!signup;
}

export async function updateSignup(
  email: string,
  data: Partial<signups.Updatable>
): Promise<void> {
  await db.update("app.signups", data, { email }).run(sql);
}

export async function insertSignup(data: signups.Insertable): Promise<void> {
  await db.insert("app.signups", data).run(sql);
}
