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

## Structure

- `/src/app` - Next.js app pages and layouts
- `/src/components` - Local components specific to MC Lookup
- `/src/lib` - Utility functions and helpers
- `/src/styles` - Additional styles

## Theming

This application uses the shared UI components and theming system from `@quikbroker/ui-components`. 
The custom theme for MC Lookup is defined in `src/app/globals.css`.