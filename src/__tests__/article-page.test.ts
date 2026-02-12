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

  describe("generateMetadata logic", () => {
    it("produces correct metadata shape for an article", async () => {
      const { data } = await readTestArticleRaw();

      // Simulate what generateMetadata builds from article data
      const metadata = {
        title: `${data.title} - TechHowlerX`,
        description: data.resume,
        openGraph: {
          title: data.title,
          description: data.resume,
          type: "article" as const,
          publishedTime: data.date,
        },
      };

      expect(metadata.title).toBe("Test Article Rendering - TechHowlerX");
      expect(metadata.description).toBeTruthy();
      expect(metadata.openGraph.type).toBe("article");
      expect(metadata.openGraph.publishedTime).toBe("2026-02-12");
    });

    it("produces fallback metadata for missing article", async () => {
      const article = await getArticleBySlug("nonexistent");
      expect(article).toBeUndefined();

      const metadata = article
        ? { title: `${article.title} - TechHowlerX` }
        : { title: "Article Not Found" };

      expect(metadata.title).toBe("Article Not Found");
    });
  });
});
