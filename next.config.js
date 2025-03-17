/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  // Enable static exports if needed
  output: 'standalone',
  // Ensure proper handling of images and other assets
  images: {
    domains: [],
  },
};

module.exports = nextConfig; 