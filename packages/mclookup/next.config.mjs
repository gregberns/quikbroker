/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Set to 'export' to generate static files
  // Only enable image optimization for production
  images: {
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  // Use the shared transpile modules approach to use the ui-components library
  transpilePackages: ['@quikbroker/ui-components'],
};

export default nextConfig;