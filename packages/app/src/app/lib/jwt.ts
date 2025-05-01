import jwt from 'jsonwebtoken';

// This should be moved to environment variables in a real application
// but for the sake of this example, we'll hardcode it here
const JWT_SECRET = process.env.JWT_SECRET || 'quikbroker-jwt-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1d'; // 1 day

export interface TokenPayload {
  sub: number; // user ID
  email: string;
  role: string;
  iat?: number; // issued at timestamp (added by jwt)
  exp?: number; // expiration timestamp (added by jwt)
}

/**
 * Generate a JWT token for a user
 * @param payload The data to include in the token
 * @returns The JWT token string
 */
export function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Verify a JWT token and return the decoded payload
 * @param token The JWT token to verify
 * @returns The decoded token payload or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return null;
  }
}