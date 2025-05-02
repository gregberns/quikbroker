import jwt, { Secret } from "jsonwebtoken";

// This should be moved to environment variables in a real application
// but for the sake of this example, we'll hardcode it here
const JWT_SECRET = process.env.JWT_SECRET || "quikbroker-jwt-secret-key";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "1d"; // 1 day

export interface TokenPayload {
  sub: number; // user ID
  email: string;
  role: string;
  iat?: number | undefined; // issued at timestamp (added by jwt)
  exp?: number | undefined; // expiration timestamp (added by jwt)
}

/**
 * Generate a JWT token for a user
 * @param payload The data to include in the token
 * @returns The JWT token string
 */
export function generateToken(
  payload: Omit<TokenPayload, "iat" | "exp">
): string {
  // Cast the JWT_SECRET to Secret type to satisfy TypeScript
  const secret: Secret = JWT_SECRET;

  // Use a more compatible approach without explicit typing of options
  const expirySeconds =
    typeof JWT_EXPIRY === "string" && JWT_EXPIRY.endsWith("d")
      ? parseInt(JWT_EXPIRY.slice(0, -1)) * 86400 // Convert days to seconds
      : 86400; // Default 1 day in seconds

  return jwt.sign(payload, secret, { expiresIn: expirySeconds });
}

/**
 * Verify a JWT token and return the decoded payload
 * @param token The JWT token to verify
 * @returns The decoded token payload or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    // Cast the JWT_SECRET to Secret type to satisfy TypeScript
    const secret: Secret = JWT_SECRET;

    const decoded = jwt.verify(token, secret);

    // Ensure we have the required fields for TokenPayload
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "sub" in decoded &&
      "email" in decoded &&
      "role" in decoded
    ) {
      // Properly convert JwtPayload to TokenPayload by constructing a new object
      const payload: TokenPayload = {
        sub:
          typeof decoded.sub === "number"
            ? decoded.sub
            : parseInt(decoded.sub as string),
        email: decoded.email as string,
        role: decoded.role as string,
        // Include optional fields if present
        iat: decoded.iat,
        exp: decoded.exp,
      };

      return payload;
    }

    console.error("Invalid token payload format");
    return null;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
}
