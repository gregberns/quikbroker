declare module "zapatos/schema" {
  // This is a placeholder module declaration to silence TypeScript errors
  // while importing from zapatos/schema

  // Add placeholders for common tables
  export const users: unknown;
  export const user_invites: unknown;
  export const brokers: unknown;
  export const carriers: unknown;
  export const signups: unknown;

  // Add a catch-all for any other tables
  const schema: { [key: string]: unknown };
  export default schema;
}
