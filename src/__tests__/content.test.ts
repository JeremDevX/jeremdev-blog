import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs/promises";
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

    it("loads vpn-anonymity-explained with correct frontmatter", async () => {
      const article = await getArticleBySlug("vpn-anonymity-explained");
      expect(article).toBeDefined();
      expect(article!.title).toBe("Why a VPN doesn't really make you Anonymous");
      expect(article!.category).toBe("networking-security/privacy/vpn-anonymity");
      expect(article!.date).toBe("2024-10-15");
      expect(article!.published).toBe(true);
      expect(article!.content).toContain("What is a VPN?");
    });

    it("loads importance-of-semantics-in-html with correct frontmatter", async () => {
      const article = await getArticleBySlug("importance-of-semantics-in-html");
      expect(article).toBeDefined();
      expect(article!.title).toBe("The Importance of Semantics in HTML");
      expect(article!.category).toBe("programming/html/semantics");
      expect(article!.date).toBe("2024-10-15");
      expect(article!.published).toBe(true);
      expect(article!.content).toContain("What is a Tag in HTML?");
    });
  });

  describe("getArticlesByCategory", () => {
    it("returns an array", async () => {
      const articles = await getArticlesByCategory("programming");
      expect(Array.isArray(articles)).toBe(true);
    });

    it("only returns published articles matching category", async () => {
      // test-mdx-pipeline has this category but published: false
      const articles = await getArticlesByCategory(
        "programming/javascript-typescript/fundamentals"
      );
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

  describe("frontmatter validation", () => {
    it("throws when date is not a valid ISO string", async () => {
      vi.spyOn(fs, "readdir").mockResolvedValue(["invalid-date.mdx"] as any);
      vi.spyOn(fs, "readFile").mockResolvedValue(`---
title: "Invalid Date"
slug: "invalid-date"
date: "15/10/2024"
resume: "Invalid date format"
category: "programming/css/layout"
published: true
---
Content`);

      await expect(getAllArticles()).rejects.toThrow(
        /Field "date" must be a valid ISO date string/
      );
    });

    it("throws when category does not exist in taxonomy", async () => {
      vi.spyOn(fs, "readdir").mockResolvedValue(["invalid-category.mdx"] as any);
      vi.spyOn(fs, "readFile").mockResolvedValue(`---
title: "Invalid Category"
slug: "invalid-category"
date: "2024-10-15"
resume: "Invalid category path"
category: "programming/not-real/path"
published: true
---
Content`);

      await expect(getAllArticles()).rejects.toThrow(
        /Field "category" must reference an existing taxonomy path/
      );
    });
  });

  describe("cross-reference validation", () => {
    it("warns for invalid relatedTools slugs and accepts known aliases", async () => {
      vi.spyOn(fs, "readdir").mockResolvedValue(["related-tools.mdx"] as any);
      vi.spyOn(fs, "readFile").mockResolvedValue(`---
title: "Related Tools"
slug: "related-tools"
date: "2024-10-15"
resume: "Tool cross-link validation"
category: "programming/css/layout"
relatedTools:
  - "contrast-checker"
  - "/tools/css/border-radius"
  - "unknown-tool"
published: true
---
Content`);

      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const articles = await getAllArticles();

      expect(articles).toHaveLength(1);
      expect(warnSpy).toHaveBeenCalledWith(
        '[content] Invalid relatedTools slug "unknown-tool" in article "related-tools"'
      );
    });
  });
});
