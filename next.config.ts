import type { NextConfig } from "next";

const appEnvironment = process.env.APP_ENV ?? "local";
const isIndexable =
  appEnvironment === "production" && Boolean(process.env.SITE_URL);

const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=()"
  }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          ...(!isIndexable
            ? [
                {
                  key: "X-Robots-Tag",
                  value: "noindex, nofollow, noarchive"
                }
              ]
            : [])
        ]
      }
    ];
  }
};

export default nextConfig;
