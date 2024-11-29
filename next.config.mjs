/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    implementation: "sass-embedded",
    silenceDeprecations: ["legacy-js-api"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
