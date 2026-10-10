/** @type {import('next').NextConfig} */
const config = {
  distDir: process.env.KRISM_BUILD_DIR || ".next",
  output: "standalone",

  async headers() {
    const headers = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ];

    return [
      { source: "/:locale/admin/:path*", headers },
      { source: "/api/admin/:path*", headers },
    ];
  },
};

export default config;