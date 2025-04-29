import { z } from "zod";
import { sql } from "../client";

// Zod schema for creating a job
export const createJobSchema = z.object({
  task_identifier: z.string(),
  payload: z.record(z.unknown()),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;

export async function createJob(
  input: CreateJobInput
): Promise<{ id: number }> {
  const result = await sql.query(
    `INSERT INTO app_private.jobs (
      task_identifier, 
      payload
    ) VALUES ($1, $2)
    RETURNING id`,
    [input.task_identifier, JSON.stringify(input.payload)]
  );

  return result.rows[0];
}
