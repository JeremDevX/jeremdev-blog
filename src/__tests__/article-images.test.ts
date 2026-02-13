import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import { getArticleBySlug, clearArticleCache } from "@/lib/content";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images/articles");

describe("article cover images", () => {
  beforeEach(() => {
    clearArticleCache();
  });

  describe("image files exist on disk", () => {
    it("vpn-anonymity-cover.webp exists and is non-empty", async () => {
      const filePath = path.join(IMAGES_DIR, "vpn-anonymity-cover.webp");
      const stat = await fs.stat(filePath);
      expect(stat.isFile()).toBe(true);
      expect(stat.size).toBeGreaterThan(0);
    });

    it("html-semantics-cover.webp exists and is non-empty", async () => {
      const filePath = path.join(IMAGES_DIR, "html-semantics-cover.webp");
      const stat = await fs.stat(filePath);
      expect(stat.isFile()).toBe(true);
      expect(stat.size).toBeGreaterThan(0);
    });
  });

  describe("article frontmatter references local cover images", () => {
    it("vpn-anonymity-explained has local coverImage path", async () => {
      const article = await getArticleBySlug("vpn-anonymity-explained");
      expect(article).toBeDefined();
      expect(article!.coverImage).toBe(
        "/images/articles/vpn-anonymity-cover.webp"
      );
    });

    it("importance-of-semantics-in-html has local coverImage path", async () => {
      const article = await getArticleBySlug("importance-of-semantics-in-html");
      expect(article).toBeDefined();
      expect(article!.coverImage).toBe(
        "/images/articles/html-semantics-cover.webp"
      );
    });

    it("coverImage paths reference files that exist in public/", async () => {
      const slugs = ["vpn-anonymity-explained", "importance-of-semantics-in-html"];
      for (const slug of slugs) {
        const article = await getArticleBySlug(slug);
        expect(article).toBeDefined();
        expect(article!.coverImage).toBeDefined();
        const filePath = path.join(PUBLIC_DIR, article!.coverImage!);
        const stat = await fs.stat(filePath);
        expect(stat.isFile()).toBe(true);
      }
    });
  });

  describe("no Sanity CDN references remain", () => {
    it("next.config.mjs has no cdn.sanity.io references", async () => {
      const configPath = path.join(process.cwd(), "next.config.mjs");
      const content = await fs.readFile(configPath, "utf-8");
      expect(content).not.toContain("cdn.sanity.io");
      expect(content).not.toContain("remotePatterns");
    });

    it("article frontmatter does not reference external CDN URLs", async () => {
      const slugs = ["vpn-anonymity-explained", "importance-of-semantics-in-html"];
      for (const slug of slugs) {
        const article = await getArticleBySlug(slug);
        expect(article).toBeDefined();
        if (article!.coverImage) {
          expect(article!.coverImage).not.toContain("http");
          expect(article!.coverImage).not.toContain("cdn.sanity.io");
          expect(article!.coverImage).toMatch(/^\/images\//);
        }
      }
    });
  });
});
