import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { getArticleBySlug, clearArticleCache } from "@/lib/content";
import { compileMDX } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { generateMetadata } from "@/app/blog/posts/[slug]/page";

const TEST_ARTICLE_PATH = path.join(
  process.cwd(),
  "content/articles/test-article-rendering.mdx"
);

async function readTestArticleRaw() {
  const raw = await fs.readFile(TEST_ARTICLE_PATH, "utf-8");
  return matter(raw);
}

describe("article page integration", () => {
  beforeEach(() => {
    clearArticleCache();
  });

  describe("article loading and MDX compilation", () => {
    it("test article file exists with correct frontmatter", async () => {
      const { data } = await readTestArticleRaw();
      expect(data.title).toBe("Test Article Rendering");
      expect(data.slug).toBe("test-article-rendering");
      expect(data.category).toBe("programming/css/visual-effects");
      expect(data.coverImage).toBe("/images/test-cover.jpg");
      expect(data.resume).toBeTruthy();
      expect(data.date).toBe("2026-02-12");
    });

    it("compiles article MDX content to a React component", async () => {
      const { content } = await readTestArticleRaw();
      const MDXContent = await compileMDX(content);
      expect(MDXContent).toBeDefined();
      expect(typeof MDXContent).toBe("function");
    });

    it("formats the article date correctly", async () => {
      const { data } = await readTestArticleRaw();
      const formatted = formatDate(data.date);
      expect(formatted).toBe("February 12, 2026");
    });

    it("resolves related tool metadata for bridgecallout fake demo article", async () => {
      const article = await getArticleBySlug("bridgecallout-fake-demo");
      expect(article).toBeDefined();
      expect(article?.resolvedRelatedTools).toBeDefined();
      expect(article?.resolvedRelatedTools).toHaveLength(1);
      expect(article?.resolvedRelatedTools?.[0].slug).toBe("/tools/css/border-radius");
    });
  });

  describe("missing article handling", () => {
    it("returns undefined for a non-existent slug", async () => {
      const article = await getArticleBySlug("this-slug-does-not-exist");
      expect(article).toBeUndefined();
    });

    it("returns undefined for unpublished articles", async () => {
      const article = await getArticleBySlug("test-mdx-pipeline");
      expect(article).toBeUndefined();
    });
  });

  describe("generateMetadata contract", () => {
    it("returns SEO metadata for a published article", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: "vpn-anonymity-explained" }),
      });

      expect(metadata.title).toBe("Why a VPN doesn't really make you Anonymous");
      expect(metadata.description).toContain(
        "A VPN encrypts your data and hides your IP"
      );
      expect(metadata.alternates?.canonical).toBe(
        "/blog/posts/vpn-anonymity-explained"
      );
      expect(metadata.openGraph?.type).toBe("article");
      expect(metadata.openGraph?.publishedTime).toBe("2024-10-15");
      expect(metadata.openGraph?.images).toEqual([
        "/images/articles/vpn-anonymity-cover.webp",
      ]);
    });

    it("returns fallback metadata when the slug is missing", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: "nonexistent" }),
      });
      expect(metadata.title).toBe("Article Not Found");
    });
  });
});
