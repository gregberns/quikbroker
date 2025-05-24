import { getClient } from "./client";

/**
 * Execute a function within a database transaction.
 * Automatically handles BEGIN, COMMIT, and ROLLBACK.
 * 
 * @param fn - Function to execute within the transaction
 * @returns The result of the function
 * @throws Re-throws any error after rolling back the transaction
 */
export async function withTransaction<T>(fn: () => Promise<T>): Promise<T> {
  const sql = getClient();
  
  try {
    await sql.query("BEGIN");
    const result = await fn();
    await sql.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await sql.query("ROLLBACK");
    } catch (rollbackError) {
      // Log rollback error but throw original error
      console.error("Failed to rollback transaction:", rollbackError);
    }
    throw error;
  }
}

/**
 * Type for functions that can be executed within a transaction
 */
export type TransactionFn<T> = () => Promise<T>;