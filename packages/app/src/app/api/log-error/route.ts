import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    // Parse the error data from the request
    const errorData = await req.json();
    
    // Add server timestamp
    const serverTimestamp = new Date().toISOString();
    
    // Get a client from the pool
    const client = await pool.connect();
    
    try {
      // We'll store the error in the app_private.error_logs table
      // If the table doesn't exist yet, we'll create it first
      await client.query(`
        CREATE TABLE IF NOT EXISTS app_private.error_logs (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          error_type VARCHAR(50) NOT NULL,
          message TEXT,
          stack TEXT,
          component_stack TEXT,
          url TEXT,
          user_agent TEXT,
          client_timestamp TIMESTAMP,
          metadata JSONB
        )
      `);
      
      // Insert the error log
      await client.query(
        `INSERT INTO app_private.error_logs 
         (error_type, message, stack, component_stack, url, user_agent, client_timestamp, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          errorData.type || 'unknown',
          errorData.message || 'No message provided',
          errorData.stack || null,
          errorData.componentStack || null,
          errorData.url || null,
          req.headers.get('user-agent') || null,
          errorData.timestamp ? new Date(errorData.timestamp) : null,
          JSON.stringify({
            ...errorData,
            // Remove fields we're already storing in dedicated columns
            type: undefined,
            message: undefined,
            stack: undefined,
            componentStack: undefined,
            url: undefined,
            timestamp: undefined
          })
        ]
      );
      
      console.error(`Error logged [${errorData.type}]: ${errorData.message}`);
      
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error while logging client error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to log error' },
      { status: 500 }
    );
  }
}