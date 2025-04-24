import { Pool } from 'pg';
import * as db from 'zapatos/db';

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION,
});

export const getClient = () => pool;

// Export the pool for direct Zapatos usage
export const sql = pool;

// Re-export commonly used Zapatos functions
export { conditions, select, insert, update, deletes } from 'zapatos/db';
