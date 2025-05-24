# QuikBroker Best Practices

## Routing Best Practices

### Client-Side Navigation

When navigating between pages on the client side, always use the Next.js `useRouter` hook rather than direct DOM manipulation:

```tsx
// ✅ GOOD - Use the Next.js router
import { useRouter } from 'next/navigation';

const MyComponent = () => {
  const router = useRouter();
  
  const handleNavigation = () => {
    router.push('/dashboard');
  };
  
  return <button onClick={handleNavigation}>Go to Dashboard</button>;
};
```

```tsx
// ❌ BAD - Don't use direct window location manipulation
const handleNavigation = () => {
  window.location.href = '/dashboard';
};
```

### Link Component

For links in your UI, use the Next.js `Link` component instead of regular anchor tags:

```tsx
// ✅ GOOD - Use the Next.js Link component
import Link from 'next/link';

const Navigation = () => {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  );
};
```

### Route Constants

Define route paths as constants to maintain consistency and make updates easier:

```tsx
// routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ADMIN: {
    HOME: '/dashboard/admin',
    BROKERS: '/dashboard/admin/brokers',
    CARRIERS: '/dashboard/admin/carriers',
    BROKER_DETAIL: (id: string | number) => `/dashboard/admin/brokers/${id}`,
  },
  BROKER: {
    HOME: '/dashboard/brokers',
    DETAIL: (id: string | number) => `/dashboard/brokers/${id}`,
  },
};

// Usage
import { ROUTES } from '@/constants/routes';

router.push(ROUTES.ADMIN.BROKERS);
// or with a dynamic parameter
router.push(ROUTES.ADMIN.BROKER_DETAIL(brokerId));
```

### Type-Safe Routes

Use type safety with routes when possible:

```tsx
import type { Route } from 'next';

// Type-safe route usage
router.push('/dashboard/admin' as Route);
```

### Route Redirection for Authentication

When redirecting for authentication purposes:

1. Use the Next.js router `replace` method instead of `push` to prevent back-button navigation to protected pages
2. Add a `callbackUrl` parameter to return users to their intended destination

```tsx
// Redirect unauthenticated users
if (!isAuthenticated) {
  const callbackUrl = encodeURIComponent(window.location.pathname);
  router.replace(`/login?callbackUrl=${callbackUrl}`);
}

// After login, redirect to the callback URL if available
const handleSuccessfulLogin = () => {
  const params = new URLSearchParams(window.location.search);
  const callbackUrl = params.get('callbackUrl') || '/dashboard';
  router.replace(callbackUrl);
};
```

## Authentication Best Practices

### JWT Token Usage

- Use JWT tokens stored in HTTP-only cookies for authentication
- Set appropriate security flags on cookies:
  - `httpOnly: true` - Prevents JavaScript access to cookies
  - `secure: true` in production - Only transmits over HTTPS
  - `sameSite: 'strict'` - Prevents CSRF attacks

```tsx
// Setting secure cookies
cookieStore.set({
  name: "auth_token",
  value: token,
  httpOnly: true,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 60 * 60 * 24, // 1 day
});
```

### Authentication Checking

- Use a centralized authentication checking function
- Add a loading state while checking authentication

```tsx
// Example authentication check hook
const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
};
```

### Role-Based Access Control

- Check both authentication and authorization in protected routes
- Define clear role requirements for each route

```tsx
// Example role-based access control
const useRequireAuth = (requiredRole?: string) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!isLoading && requiredRole && user?.role !== requiredRole) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, requiredRole, router, user]);

  return { isAuthenticated, isLoading, user };
};

// Usage
const AdminPage = () => {
  const { isLoading } = useRequireAuth('admin');

  if (isLoading) return <div>Loading...</div>;

  return <div>Admin content</div>;
};
```

## Error Handling Best Practices

### Client-Side Error Logging

- Use the clientLogger for all client-side error logging
- Include contextual information to help with debugging

```tsx
import { clientLogger } from '@/lib/errorHandling';

try {
  // Some operation that might fail
} catch (error) {
  clientLogger.error('feature-action', 'Failed to perform action', {
    error: error instanceof Error ? error.message : String(error),
    context: { id, otherData },
  });
}
```

### Server-Side Error Logging

- Use the serverLogger for all server-side error logging
- Log API access, errors, and security events

```tsx
import { serverLogger } from '@/lib/serverLogger';

export async function POST(req: NextRequest) {
  try {
    // Log API access
    serverLogger.access(req, 200, { endpoint: 'login' });
    
    // Operation that might fail
    
    // Log success
    serverLogger.info('login', 'User logged in successfully', { userId });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // Log error
    serverLogger.apiError(req, error);
    
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    );
  }
}
```

## Component Best Practices

### SVG Usage

Use React components for SVGs rather than inline SVG markup:

1. For simple SVGs, use Lucide React or other icon libraries
2. For custom SVGs, create reusable components

```tsx
// ✅ GOOD - Use Lucide React components
import { Loader2 } from 'lucide-react';

<Loader2 className="h-4 w-4 animate-spin" />
```

```tsx
// ✅ GOOD - Create custom SVG components for complex icons
// components/icons/SpinnerIcon.tsx
export const SpinnerIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Usage
import { SpinnerIcon } from '@/components/icons/SpinnerIcon';

<SpinnerIcon className="h-4 w-4 animate-spin text-white" />
```

### Form Handling

- Use form state to track form loading and error states
- Disable form elements during submission
- Clear errors when starting a new submission

```tsx
const [formState, setFormState] = useState({
  isSubmitting: false,
  error: null,
  success: false,
});

const handleSubmit = async (event) => {
  event.preventDefault();
  setFormState({ isSubmitting: true, error: null, success: false });
  
  try {
    // Form submission
    setFormState({ isSubmitting: false, error: null, success: true });
  } catch (error) {
    setFormState({ 
      isSubmitting: false, 
      error: error instanceof Error ? error.message : 'Submission failed', 
      success: false 
    });
  }
};
```

## Testing Best Practices

### Unit Testing Requirements

**All domain logic in `packages/app/src/lib/domain` MUST have comprehensive unit tests.**

Domain logic is the core business logic of the application and should be thoroughly tested to ensure reliability and prevent regressions.

### Testing Framework Setup

Use Jest with Testing Library for testing:

```bash
# Install testing dependencies
yarn add -D jest @types/jest @testing-library/jest-dom @testing-library/react testing-library/user-event jest-environment-jsdom
```

**jest.config.js:**
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ],
  collectCoverageFrom: [
    'src/lib/domain/**/*.(ts|tsx)',
    'src/lib/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/lib/domain/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

### Domain Logic Testing Patterns

#### 1. Pure Function Testing

For pure functions (no side effects), test all input/output combinations:

```typescript
// src/lib/domain/__tests__/invitations.test.ts
import { validateInvitationRequest } from '../invitations';

describe('validateInvitationRequest', () => {
  it('should return valid result for numeric string', () => {
    const result = validateInvitationRequest('123');
    
    expect(result.isValid).toBe(true);
    expect(result.entityId).toBe(123);
    expect(result.error).toBeUndefined();
  });

  it('should return invalid result for non-numeric string', () => {
    const result = validateInvitationRequest('abc');
    
    expect(result.isValid).toBe(false);
    expect(result.entityId).toBeUndefined();
    expect(result.error).toEqual({
      message: 'Invalid ID',
      statusCode: 400
    });
  });

  it('should return invalid result for empty string', () => {
    const result = validateInvitationRequest('');
    
    expect(result.isValid).toBe(false);
    expect(result.error?.message).toBe('Invalid ID');
  });
});
```

#### 2. Complex Function Testing with Mocks

For functions with dependencies, use mocks to isolate the logic:

```typescript
// src/lib/domain/__tests__/invitations.test.ts
import { sendInvitation } from '../invitations';
import { createUserInvite } from '@/db/queries/userInvites';
import { createJob } from '@/db/queries/jobs';

// Mock external dependencies
jest.mock('@/db/queries/userInvites');
jest.mock('@/db/queries/jobs');
jest.mock('@/db/client');

const mockCreateUserInvite = createUserInvite as jest.MockedFunction<typeof createUserInvite>;
const mockCreateJob = createJob as jest.MockedFunction<typeof createJob>;

describe('sendInvitation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully send invitation for broker with user association', async () => {
    // Arrange
    const entity = {
      id: 1,
      name: 'Test Broker',
      email: 'broker@example.com',
      owner_user_id: 123
    };
    
    const config = {
      entityType: 'broker' as const,
      requiresUserAssociation: true,
      taskIdentifier: 'broker_email_invite',
      emailField: 'email'
    };

    const mockUpdateFn = jest.fn().mockResolvedValue({});
    const mockSession = { id: 'user1', role: 'admin' };
    const mockReq = { url: '/api/test' } as any;

    mockCreateUserInvite.mockResolvedValue({ id: 1, token: 'test-token' } as any);
    mockCreateJob.mockResolvedValue({ id: 1 } as any);

    // Act
    const result = await sendInvitation(entity, config, mockUpdateFn, mockSession, mockReq);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toBe('Invitation sent to broker@example.com');
    expect(mockCreateUserInvite).toHaveBeenCalledWith({
      user_id: 123,
      token: expect.any(String),
      expires_at: expect.any(Date)
    });
    expect(mockUpdateFn).toHaveBeenCalledWith(1, {
      invitation_sent_at: expect.any(Date)
    });
  });

  it('should return error when broker has no associated user', async () => {
    // Arrange
    const entity = {
      id: 1,
      name: 'Test Broker',
      email: 'broker@example.com',
      owner_user_id: null
    };
    
    const config = {
      entityType: 'broker' as const,
      requiresUserAssociation: true,
      taskIdentifier: 'broker_email_invite',
      emailField: 'email'
    };

    const mockUpdateFn = jest.fn();
    const mockSession = { id: 'user1', role: 'admin' };
    const mockReq = { url: '/api/test' } as any;

    // Act
    const result = await sendInvitation(entity, config, mockUpdateFn, mockSession, mockReq);

    // Assert
    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(400);
    expect(result.message).toBe('broker has no associated user. Please assign a user first.');
    expect(mockUpdateFn).not.toHaveBeenCalled();
  });
});
```

#### 3. Test File Organization

```
src/lib/domain/
├── invitations.ts
├── __tests__/
│   ├── invitations.test.ts
│   └── helpers.ts (shared test utilities)
└── types.ts
```

#### 4. Test Coverage Requirements

- **Domain Logic**: 90%+ coverage required
- **All Public Functions**: Must have tests
- **Edge Cases**: Test error conditions, boundary values, null/undefined inputs
- **Business Logic**: Test all decision paths and business rules

### Test Naming Conventions

```typescript
describe('FunctionName', () => {
  describe('when condition', () => {
    it('should expected behavior', () => {
      // Test implementation
    });
  });
  
  it('should handle edge case description', () => {
    // Edge case test
  });
});
```

### Test Data Management

Create test fixtures for consistent test data:

```typescript
// src/lib/domain/__tests__/fixtures.ts
export const mockBrokerEntity = {
  id: 1,
  name: 'Test Broker',
  email: 'broker@example.com',
  owner_user_id: 123
};

export const mockCarrierEntity = {
  id: 2,
  name: 'Test Carrier',
  email: 'carrier@example.com',
  owner_user_id: null
};

export const brokerInvitationConfig = {
  entityType: 'broker' as const,
  requiresUserAssociation: true,
  taskIdentifier: 'broker_email_invite',
  emailField: 'email'
};
```

### Continuous Integration

Tests must pass before code can be merged:

```bash
# Add to package.json scripts
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:domain": "jest src/lib/domain"
  }
}
```

### Mock Guidelines

1. **Mock External Dependencies**: Database calls, API calls, file system operations
2. **Don't Mock Domain Logic**: Test the actual business logic, not mocks
3. **Use Type-Safe Mocks**: Leverage TypeScript for mock type safety
4. **Reset Mocks**: Clear mocks between tests to avoid test interference

### Testing Anti-Patterns to Avoid

❌ **Don't test implementation details**
```typescript
// BAD - testing internal variable names
expect(result.internalVariable).toBeDefined();
```

❌ **Don't write tests that are too broad**
```typescript
// BAD - testing too many things at once
it('should handle everything', () => {
  // 50 lines of test code testing multiple functions
});
```

❌ **Don't rely on test order**
```typescript
// BAD - tests depending on each other
it('should create user', () => { /* creates user */ });
it('should update that user', () => { /* depends on previous test */ });
```

✅ **Do write focused, isolated tests**
```typescript
// GOOD - focused test with clear purpose
it('should return error when email is invalid', () => {
  const result = validateEmail('invalid-email');
  expect(result.isValid).toBe(false);
  expect(result.error).toBe('Invalid email format');
});
```

These best practices are evolving guidelines. Feel free to suggest improvements or additions as the project grows.