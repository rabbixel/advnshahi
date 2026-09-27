import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [96, 128, 176, 256, 384],
    // Add the WordPress media host here when CONTENT_SOURCE=wordpress, e.g.
    // remotePatterns: [{ protocol: "https", hostname: "cms.nanakshahi.in" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  /**
   * Short, memorable URLs for the most-searched subjects. These are permanent
   * redirects to the single canonical page for each topic (never duplicate pages).
   */
  async redirects() {
    return [
      { source: "/punjabi-calendar", destination: "/articles/punjabi-calendar-nanakshahi-bikrami-gregorian", permanent: true },
      { source: "/guru-nanak-jayanti", destination: "/articles/guru-nanak-jayanti", permanent: true },
      { source: "/bandi-chhor-divas", destination: "/articles/bandi-chhor-divas-history-meaning", permanent: true },
      { source: "/golden-temple", destination: "/harmandir-sahib", permanent: true },
      { source: "/darbar-sahib", destination: "/harmandir-sahib", permanent: true },
      { source: "/mukhwak", destination: "/articles/mukhwak-and-hukamnama", permanent: true },
      { source: "/sikh-heritage", destination: "/sikh-history", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-and-conditions", permanent: true },
    ];
  },
};

export default nextConfig;
