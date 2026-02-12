/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    implementation: "sass-embedded",
    silenceDeprecations: ["legacy-js-api"],
  },
  async redirects() {
    // Sanity-era URL redirects (permanent 308).
    // Current articles kept the same /blog/posts/[slug] format, so no
    // redirects are needed yet. Add entries here if future migrations
    // change URL structures.
    return [];
  },
};

export default nextConfig;
