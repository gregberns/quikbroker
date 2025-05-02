# Next.js Best Practices for QuikBroker

This document outlines the patterns and practices that should be followed when working with Next.js in the QuikBroker project to ensure type safety and prevent common errors.

## Routing and Link Components

### 1. Link Component Href Types

When using the Next.js `Link` component, always use object notation with `pathname` for the `href` prop:

✅ **DO:**
```tsx
<Link href={{ pathname: "/dashboard" }}>Dashboard</Link>
<Link href={{ pathname: "#features" }}>Features</Link>
```

❌ **DON'T:**
```tsx
<Link href="/dashboard">Dashboard</Link>
<Link href="#features">Features</Link>
```

### 2. Array Keys for Link Components

When mapping through an array to create Link components, use the `pathname` property for the key:

✅ **DO:**
```tsx
{menuItems.map((item) => (
  <li key={item.href.pathname}>
    <Link href={item.href}>
      {item.label}
    </Link>
  </li>
))}
```

❌ **DON'T:**
```tsx
{menuItems.map((item) => (
  <li key={item.href}>
    <Link href={item.href}>
      {item.label}
    </Link>
  </li>
))}
```

### 3. Link Data Structure

Define link data structures using the object notation:

✅ **DO:**
```tsx
const menuItems = [
  { label: 'Features', href: { pathname: '#features' } },
  { label: 'Pricing', href: { pathname: '/pricing' } },
];
```

❌ **DON'T:**
```tsx
const menuItems = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '/pricing' },
];
```

## Component Props and Types

### 1. Component Interface Structure

Make sure the component interface matches the expected types for Next.js components:

✅ **DO:**
```tsx
interface CtaSectionProps {
  title: string;
  description: string;
  primaryAction: {
    text: string;
    href: { pathname: string };
  };
  secondaryAction?: {
    text: string;
    href: { pathname: string };
  };
}
```

### 2. Optional Properties

When defining optional properties, use proper TypeScript syntax and be aware of `exactOptionalPropertyTypes`:

✅ **DO:**
```tsx
interface FormFieldProps {
  error?: string | undefined;
}
```

## React Entities

### 1. React Entities in JSX

Always use the appropriate HTML entity references in JSX:

✅ **DO:**
```tsx
<p>We&apos;re here to help you with any questions.</p>
```

❌ **DON'T:**
```tsx
<p>We're here to help you with any questions.</p>
```

## Function Scope and Definitions

### 1. Helper Functions

Define helper functions inside the component scope if they're only used within that component:

✅ **DO:**
```tsx
function DocumentCard({ document, onDelete }: DocumentCardProps) {
  // Format date helper function for use in the component
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    // Component JSX that uses formatDate
  );
}
```

### 2. Avoid Duplicate Functions

Don't declare the same function multiple times or in multiple modules unless necessary:

✅ **DO:**
```tsx
// In a shared utility file
export function logToServer(error: unknown) {
  // Implementation
}

// In components
import { logToServer } from '@/lib/utils';
```

## JWT and Authentication

### 1. Type Safety for JWT Operations

Use proper typing for JWT operations:

✅ **DO:**
```tsx
import { Secret } from 'jsonwebtoken';

export function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  const secret: Secret = JWT_SECRET;
  // ...
}
```

### 2. Type Narrowing for JWT Verification

When verifying JWT tokens, use proper type narrowing:

✅ **DO:**
```tsx
if (typeof decoded === 'object' && decoded !== null && 
    'sub' in decoded && 'email' in decoded && 'role' in decoded) {
  
  // Properly convert JwtPayload to TokenPayload
  const payload: TokenPayload = {
    sub: typeof decoded.sub === 'number' ? decoded.sub : parseInt(decoded.sub as string),
    email: decoded.email as string,
    role: decoded.role as string,
    iat: decoded.iat,
    exp: decoded.exp
  };
  
  return payload;
}
```

## Code Organization

### 1. Missing Routes

Create proper page components for all routes referenced in the application rather than using type assertions:

✅ **DO:**
```tsx
// Create a new file at src/app/support/page.tsx
export default function SupportPage() {
  // Implementation
}
```

❌ **DON'T:**
```tsx
// Type casting the route
<Link href={'/support' as any}>Support</Link>
```

## Testing and Verification

1. Run ESLint and TypeScript checks regularly to catch type safety issues early
2. Test navigation thoroughly after making changes to Link components or routes
3. Review component props and interfaces to ensure they match the expected types

---

Following these patterns will help maintain type safety and prevent common errors when working with Next.js in the QuikBroker project.