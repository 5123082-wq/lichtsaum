import type { NextConfig } from "next";

const appEnvironment = process.env.APP_ENV ?? "local";
const isIndexable =
  appEnvironment === "production" && Boolean(process.env.SITE_URL);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    if (isIndexable) {
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
