/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is now stable and enabled by default in Next.js 14
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: []
  }
}

module.exports = nextConfig 