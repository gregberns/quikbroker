# QuikBroker Marketing Components

This directory contains all the UI components used for the QuikBroker marketing website. These components have been built to be easily customizable and updated by the marketing team without requiring extensive technical knowledge.

## Landing Page Structure

The main landing page (`/src/app/page.tsx`) uses these components in the following order:

1. Header (navigation)
2. Hero Section
3. Stats Section
4. Features Section
5. Trust Section
6. Testimonials
7. Call-to-Action Section
8. Signup Form
9. Footer

## How to Update Content

### Updating Text and Data

Most of the content is defined directly in the `page.tsx` file as JavaScript objects. You can edit:

- **Features** - Modify the `features` array to change icons, titles, and descriptions
- **Stats** - Update the `stats` array to change metrics
- **Testimonials** - Edit the `testimonials` array to update quotes and attribution

### Customizing Components

Each component accepts props that control its appearance:

- **HeroSection** - Customize title, subtitle, action buttons, and bullet points
- **StatsSection** - Change title, description, and statistics
- **TrustSection** - Update security features and compliance badges
- **CtaSection** - Modify call-to-action messaging and buttons

## Component Reference

### Header.tsx
The site navigation. Edit `menuItems` array to update navigation links.

### Footer.tsx
The site footer. Edit `footerLinks` object to update footer links and sections.

### HeroSection.tsx
The main banner at the top of the page. Customize props to change headline, subheading, and bullet points.

### FeatureCard.tsx
Cards displaying product features. Used by the `FeatureList` component to display multiple features.

### StatsSection.tsx
Displays key metrics and statistics. Customize through the `stats` array.

### Testimonial.tsx
Customer testimonials. Used by the `TestimonialSection` to display multiple testimonials.

### TrustSection.tsx
Security and compliance information. Edit `trustItems` array to update security features.

### CtaSection.tsx
Call-to-action banner. Customize title, description, and button text/links.

### SignupForm.tsx
Email signup form. Customize title and description through props.

## Adding Images

To add or update images:

1. Place new images in the `/public` folder
2. Reference them in components using the path (e.g., `/your-image.png`)
3. For component props that accept image URLs (like `HeroSection`), update the URL

## Example: Updating Feature Icons

The feature icons use Lucide React. To change an icon:

1. Find a new icon at [lucide.dev](https://lucide.dev/)
2. Import it at the top of `page.tsx`: `import { NewIcon } from 'lucide-react';`
3. Update the feature object:

```jsx
{
  icon: <NewIcon className="h-8 w-8" />,
  title: "Your Feature Title",
  description: "Your feature description"
}
```

## Best Practices

- Keep text concise and focused on benefits
- Use consistent language and terminology
- Maintain the same tone across all sections
- Test any significant changes on multiple screen sizes
- Avoid making structural changes to the components without developer support