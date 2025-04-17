# QuikBroker Cursor Guide

This document provides essential information about the project structure to help with Cursor IDE usage.

## Project Structure

This is a monorepo organized with the following packages:

- `/packages/app`: Next.js application (frontend and API)
- `/packages/schema`: Database schema definitions and migrations
- `/packages/tests`: Testing infrastructure for unit, integration, and e2e tests

## Key Files

- `package.json`: Root package with monorepo workspace configuration
- `/packages/app/package.json`: App dependencies and scripts
- `/packages/schema/package.json`: Schema dependencies and scripts
- `/packages/tests/package.json`: Testing dependencies and scripts

## Available Scripts

From the root directory:

- `yarn app:dev`: Run the Next.js development server
- `yarn app:build`: Build the Next.js application
- `yarn app:start`: Start the production server
- `yarn schema:migrate`: Run database migrations
- `yarn test:unit`: Run unit tests
- `yarn test:integration`: Run integration tests
- `yarn test:e2e`: Run end-to-end tests

## Database

The database schema is managed in `/packages/schema` with migrations in the `/packages/schema/migrations` directory.

## Testing

- Unit tests: Simple tests for individual components/functions
- Integration tests: Tests for API routes and database interactions
- E2E tests: End-to-end tests using a browser environment

## Cursor Configuration

The project includes:
- `.cursor.json`: Configuration for Cursor IDE
- `.cursorignore`: Files to be ignored by Cursor 
- `.cursor/rules/`: Directory containing project coding rules:
  - `lint.json`: Linting rules
  - `style.json`: Code style formatting rules
  - `imports.json`: Import/export organization rules
  - `naming.json`: Naming convention rules

## Code Conventions

The project follows these key conventions:
- Components use PascalCase naming (both for files and functions)
- Hooks use camelCase and start with 'use'
- API endpoints use kebab-case file naming
- Imports are ordered: React, Next.js, internal modules, relative imports
- Maximum line width is 100 characters
- Use 2 spaces for indentation 
