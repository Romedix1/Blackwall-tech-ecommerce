import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    qualities: [70, 75, 80],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gmmbnmzwqztxxktqpqqy.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
