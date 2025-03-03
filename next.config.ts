import type { NextConfig } from "next";

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
        hostname: 'asset.captureapp.xyz',
      },
      {
        protocol: 'https',
        hostname: 'dia-cdn.numbersprotocol.io',
      },
    ],
  },
};

export default nextConfig;
