# MC Lookup

This package contains the MC Lookup landing page and application for QuikBroker.

## Development

```bash
# From the root directory
yarn mclookup:dev
```

## Building for Production

```bash
# From the root directory
yarn mclookup:build
```

This will create a static export that can be deployed to any static hosting provider.

## Deployment

The MC Lookup app is deployed as a static site to Railway using the following workflow:

1. Static files are built using Next.js static export (`output: 'export'`)
2. Files are containerized with nginx for serving
3. Deployed to Railway using GitHub Actions

### Deployment Files

- `Dockerfile` - Contains the build and runtime environment configuration
- `nginx.conf` - Nginx configuration for serving static files
- `railway.toml` - Railway deployment configuration
- `.github/workflows/ci-cd.yml` - GitHub Actions workflow for automated deployment

## Structure

- `/src/app` - Next.js app pages and layouts
- `/src/components` - Local components specific to MC Lookup
- `/src/lib` - Utility functions and helpers
- `/src/styles` - Additional styles

## Theming

This application uses the shared UI components and theming system from `@quikbroker/ui-components`. 
The custom theme for MC Lookup is defined in `src/app/globals.css`.