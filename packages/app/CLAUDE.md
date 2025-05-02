# Claude Coding Guidelines for QuikBroker

This document provides essential information about the QuikBroker project and commands for linting/validating code.

## Type-checking and Linting Commands

Run these commands to validate your code changes:

```bash
# Run ESLint on all files
npx next lint

# Run ESLint on a specific file
npx eslint [file-path]

# Run TypeScript type-checking
npm run typecheck
```

## Common Issues and Patterns to Follow

1. **Link Components**: Always use object notation for href props
   ```tsx
   <Link href={{ pathname: "/route" }}>Link text</Link>
   ```

2. **HTML Entities**: Use proper HTML entities in JSX
   ```tsx
   <p>We&apos;re here to help you</p>
   ```

3. **React Patterns**: 
   - Define helper functions within component scope when appropriate
   - Use proper TypeScript interfaces and types
   - Follow the patterns documented in NEXT_JS_BEST_PRACTICES.md

## Project Structure

The project is a Next.js application using the App Router architecture.

Key directories:
- `/src/app`: Routes and API handlers
- `/src/components`: Reusable UI components
- `/src/lib`: Utility functions and shared code

## Documentation

For more detailed guides, refer to:
- [NEXT_JS_BEST_PRACTICES.md](/Users/gb/github/quikbroker/packages/app/NEXT_JS_BEST_PRACTICES.md)