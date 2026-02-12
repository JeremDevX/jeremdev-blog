import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getFeaturedArticles,
  getLatestArticles,
  clearArticleCache,
} from "@/lib/content";

describe("content loading utilities", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearArticleCache();
  });

  describe("getAllArticles", () => {
    it("returns an array", async () => {
      const articles = await getAllArticles();
      expect(Array.isArray(articles)).toBe(true);
    });

    it("filters out unpublished articles", async () => {
      // test-mdx-pipeline.mdx has published: false
      const articles = await getAllArticles();
      const testArticle = articles.find((a) => a.slug === "test-mdx-pipeline");
      expect(testArticle).toBeUndefined();
    });

    it("returns ArticleMeta objects sorted by date descending", async () => {
      const articles = await getAllArticles();
      for (let i = 1; i < articles.length; i++) {
        expect(new Date(articles[i - 1].date).getTime()).toBeGreaterThanOrEqual(
          new Date(articles[i].date).getTime()
        );
      }
    });
  });

  describe("getArticleBySlug", () => {
    it("returns undefined for unpublished articles", async () => {
      // test-mdx-pipeline.mdx has published: false
      const article = await getArticleBySlug("test-mdx-pipeline");
      expect(article).toBeUndefined();
    });

    it("returns undefined for a non-existent slug", async () => {
      const article = await getArticleBySlug("nonexistent-slug");
      expect(article).toBeUndefined();
    });
  });

  describe("getArticlesByCategory", () => {
    it("returns an array", async () => {
      const articles = await getArticlesByCategory("test");
      expect(Array.isArray(articles)).toBe(true);
    });

    it("only returns published articles matching category", async () => {
      // test-mdx-pipeline has category "test" but published: false
      const articles = await getArticlesByCategory("test");
      expect(articles).toHaveLength(0);
    });
  });

  describe("getFeaturedArticles", () => {
    it("returns an array", async () => {
      const articles = await getFeaturedArticles();
      expect(Array.isArray(articles)).toBe(true);
    });

    it("only returns published articles with featured: true", async () => {
      const articles = await getFeaturedArticles();
      for (const a of articles) {
        expect(a.featured).toBe(true);
        expect(a.published).toBe(true);
      }
    });
  });

  describe("getLatestArticles", () => {
    it("returns an array", async () => {
      const articles = await getLatestArticles();
      expect(Array.isArray(articles)).toBe(true);
    });

    it("defaults to max 6 articles", async () => {
      const articles = await getLatestArticles();
      expect(articles.length).toBeLessThanOrEqual(6);
    });

    it("respects custom count parameter", async () => {
      const articles = await getLatestArticles(3);
      expect(articles.length).toBeLessThanOrEqual(3);
    });

    it("returns only published articles sorted by date descending", async () => {
      const articles = await getLatestArticles();
      for (const a of articles) {
        expect(a.published).toBe(true);
      }
      for (let i = 1; i < articles.length; i++) {
        expect(new Date(articles[i - 1].date).getTime()).toBeGreaterThanOrEqual(
          new Date(articles[i].date).getTime()
        );
      }
    });
  });
});
