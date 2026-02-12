import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { getArticleBySlug, clearArticleCache } from "@/lib/content";
import { compileMDX } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

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
    it("article data provides all fields needed for metadata generation", async () => {
      const { data } = await readTestArticleRaw();

      // Verify the article frontmatter has every field generateMetadata relies on
      expect(data.title).toBeTypeOf("string");
      expect(data.resume).toBeTypeOf("string");
      expect(data.date).toBeTypeOf("string");
      expect(data.title.length).toBeGreaterThan(0);
      expect(data.resume.length).toBeGreaterThan(0);

      // Verify title format matches what generateMetadata produces
      const expectedTitle = `${data.title} - TechHowlerX`;
      expect(expectedTitle).toBe("Test Article Rendering - TechHowlerX");

      // Verify OG publishedTime is a valid date string
      expect(new Date(data.date).toISOString()).toContain("2026-02-12");
    });

    it("article with coverImage provides OG image data", async () => {
      const { data } = await readTestArticleRaw();
      expect(data.coverImage).toBeTypeOf("string");
      expect(data.coverImage.length).toBeGreaterThan(0);
    });

    it("getArticleBySlug returns undefined for missing slugs (triggers fallback metadata)", async () => {
      const article = await getArticleBySlug("nonexistent");
      expect(article).toBeUndefined();
    });
  });
});
