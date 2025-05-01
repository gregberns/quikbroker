# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `yarn app:dev`: Run Next.js development server
- `yarn app:build`: Build the Next.js application
- `yarn app:start`: Start production server
- `yarn test:unit`: Run unit tests
- `yarn test:integration`: Run integration tests
- `yarn test:e2e`: Run end-to-end tests

## Lint/Format Commands
- `yarn app:lint`: Run ESLint + TypeScript checks
- `yarn app:format`: Auto-format code

## Code Style Guidelines
- **Components**: PascalCase for both file names and functions
- **Functions/Variables**: camelCase
- **Hooks**: camelCase with 'use' prefix
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase
- **Files**:
  - Component files: PascalCase with .tsx extension
  - API endpoint files: kebab-case with .ts extension
  - Utility files: camelCase with .ts extension
- **Database**: snake_case for tables and columns

## Import Organization
1. React
2. Next.js
3. @quikbroker internal packages
4. Relative imports
- Prefer absolute imports over relative parent imports (../../)

## Formatting
- 2 spaces for indentation
- Single quotes, except double quotes in JSX
- Line width: 100 characters max
- Semicolons required

## Component Structure
- Prefer functional components over class components
- Structure files: exported component, subcomponents, helpers, static content
- Use early returns for error conditions

## Tech Stack
- Next.js App Router with server and client components
- Tailwind CSS for styling (no @apply directive)
- Zod for validation
- React Hook Form for form handling
- TanStack Query for data fetching
- Shadcn UI for components

## REST API
- Use express-zod-api framework
- Use openapi-zod-client for consuming OpenAPI specs

Always run linting before committing changes.