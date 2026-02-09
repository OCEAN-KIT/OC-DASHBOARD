import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pre-piuda.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
