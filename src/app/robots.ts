import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/blog/",
        "/blog/posts/",
        "/blog/categories/",
        "/blog/posts/*",
        "/tools/",
        "/tools/*",
      ],
      disallow: [
        "/private/",
        "/studio/",
        "/studio/admin/",
        "/about",
        "termsofuse",
      ],
    },
  };
}
