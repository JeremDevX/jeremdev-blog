/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    implementation: "sass-embedded",
    silenceDeprecations: ["legacy-js-api"],
  },
  async redirects() {
    // Sanity-era URL redirects (permanent 308).
    // Article slugs kept the same /blog/posts/[slug] format and tool routes are
    // unchanged, so no article or tool redirects are needed.
    return [
      {
        source: "/studio",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/categories/:path*",
        destination: "/topics/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data:",
              "font-src 'self'",
              "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
