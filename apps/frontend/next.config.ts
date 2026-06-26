import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * Proxy /api/* to the backend dev server.
   * Using afterFiles so Next.js API routes (app/api/auth/*) take
   * priority over the proxy — only unmatched paths fall through.
   */
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/api/:path*",
          destination: "http://localhost:4000/api/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
