/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow cross-origin requests in development
  allowedDevOrigins: ['192.168.1.172'],
}

export default nextConfig
