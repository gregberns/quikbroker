# @quikbroker/ui-components

This package contains shared UI components, themes, and utilities for Quikbroker projects.

## Installation

The package is available as a workspace package in the monorepo:

```bash
# From your project directory
yarn add @quikbroker/ui-components
```

## Usage

### Components

```jsx
import { Button, Card, Container } from '@quikbroker/ui-components';

export default function MyComponent() {
  return (
    <Container>
      <Card>
        <Card.Header>
          <Card.Title>My Card</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>This is a card from the shared UI components.</p>
        </Card.Content>
        <Card.Footer>
          <Button>Click Me</Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}
```

### Theme Provider

Wrap your application with the ThemeProvider to enable theming support:

```jsx
import { ThemeProvider } from '@quikbroker/ui-components';

export default function App({ children }) {
  return (
    <ThemeProvider
      defaultTheme="light"
      themes={['light', 'dark', 'custom']}
    >
      {children}
    </ThemeProvider>
  );
}
```

### Creating Custom Themes

You can create custom themes using the provided utility:

```jsx
import { createTheme } from '@quikbroker/ui-components';

// Create a custom theme
const customTheme = createTheme('custom', {
  background: '#ffffff',
  foreground: '#000000',
  // Add other color values here
});

// Add the theme to your CSS
const styles = `
  ${customTheme}
`;
```

## Available Components

- UI Components
  - Button
  - Card
  - Container
  - Alert
  - Avatar
  - Dialog
  - DropdownMenu
  - FormField
  - Input
  - Label
  - Progress
  - Select
  - Separator
  - Tabs
  - Textarea
  - Tooltip
  - Icons

- Marketing Components
  - CtaSection
  - FeatureCard
  - Footer
  - Header
  - HeroSection
  - SignupForm
  - StatsSection
  - Testimonial
  - TrustSection

## Development

1. Make changes to the components
2. Build the package: `yarn ui:build`
3. Use in other workspace packages