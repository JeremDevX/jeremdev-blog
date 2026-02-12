/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    implementation: "sass-embedded",
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default nextConfig;
