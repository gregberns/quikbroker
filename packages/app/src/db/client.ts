import { Pool } from "pg";
// Using zapatos DB utilities
import "zapatos/db";

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION,
});

export const getClient = () => pool;

// Export the pool for direct Zapatos usage
export const sql = pool;

// Re-export commonly used Zapatos functions
export { conditions, select, insert, update, deletes } from "zapatos/db";
