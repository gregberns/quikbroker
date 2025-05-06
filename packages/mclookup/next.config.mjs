/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable image optimization for production
  images: {
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  
  // Enable direct importing of the UI components source
  transpilePackages: ['@quikbroker/ui-components'],
  
  // Preserve the data-theme attribute for CSS styling
  reactStrictMode: true,
};

export default nextConfig;