# QuikBroker

QuikBroker is a platform that helps freight brokers connect with carriers more efficiently.

## Project Structure

This is a monorepo that contains multiple packages:

- `packages/app`: The main Next.js application
- `packages/ui-components`: Shared UI components library used across projects
- `packages/mclookup`: MC Lookup landing page for carrier lookup
- `packages/migrations`: Database migration scripts
- `packages/job-system`: Background job processing

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Build the shared UI components:
   ```bash
   yarn ui:build
   ```

3. Start the development server for the main app:
   ```bash
   yarn app:dev
   ```

4. Start the development server for the MC Lookup landing page:
   ```bash
   yarn mclookup:dev
   ```

## Available Scripts

### Main Application
- `yarn app:dev`: Run Next.js development server for the main app
- `yarn app:build`: Build the Next.js main application
- `yarn app:start`: Start production server for the main app
- `yarn app:lint`: Run ESLint + TypeScript checks for the main app
- `yarn app:format`: Auto-format code for the main app

### Shared UI Components
- `yarn ui:dev`: Run development build in watch mode for UI components
- `yarn ui:build`: Build the shared UI components package
- `yarn ui:lint`: Run ESLint checks for UI components
- `yarn ui:clean`: Clean build artifacts for UI components

### MC Lookup
- `yarn mclookup:dev`: Run Next.js development server for MC Lookup
- `yarn mclookup:build`: Build the MC Lookup static site
- `yarn mclookup:start`: Start a local server for the MC Lookup static site
- `yarn mclookup:lint`: Run ESLint + TypeScript checks for MC Lookup

### Database
- `yarn schema:new`: Create a new migration
- `yarn schema:migrate`: Run migrations
- `yarn schema:rollback`: Rollback migrations

## Development Guidelines

See [CLAUDE.md](./CLAUDE.md) for code style guidelines and additional development instructions.

## Data Sources

The application integrates with various data sources including:

- FMCSA SAFER
- Census data
- Authority information
- Insurance and Safety details

For carrier information lookup: https://carrierdetails.com/