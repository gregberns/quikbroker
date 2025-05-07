/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for static site generation
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Enable direct importing of the UI components source
  transpilePackages: ['@quikbroker/ui-components'],
  
  // Preserve the data-theme attribute for CSS styling
  reactStrictMode: true,
  
  // Required for static export to Railway
  distDir: 'out',
};

export default nextConfig;