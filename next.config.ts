import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'staging.akashic.xyz',
      },
      {
        protocol: 'https',
        hostname: 'asset.captureapp.xyz',
      },
      {
        protocol: 'https',
        hostname: 'dia-cdn.numbersprotocol.io',
      },
    ],
  },
  webpack: (config) => {
    config.externals['@solana/web3.js'] = 'commonjs @solana/web3.js';
    config.externals['@solana/spl-token'] = 'commonjs @solana/spl-token';
    return config;
  },
};

export default nextConfig;
