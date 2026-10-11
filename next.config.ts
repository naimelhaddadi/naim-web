import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // English lives at the root: "/" and "/work/…" serve the /en pages without
  // changing the URL, and "/en…" redirects to them so each page has one address
  async rewrites() {
    return [
      { source: "/", destination: "/en" },
      { source: "/work/:slug", destination: "/en/work/:slug" },
    ];
  },
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      // only pages: /en/opengraph-image has to stay where it is
      { source: "/en/work/:slug", destination: "/work/:slug", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
