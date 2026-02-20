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

  describe("image files exist on disk and are valid PNG", () => {
    // PNG files start with this fixed 8-byte signature.
    const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

    it("vpn-anonymity-cover.png exists, is non-empty, and is valid PNG", async () => {
      const filePath = path.join(IMAGES_DIR, "vpn-anonymity-cover.png");
      const stat = await fs.stat(filePath);
      expect(stat.isFile()).toBe(true);
      expect(stat.size).toBeGreaterThan(0);
      const header = Buffer.alloc(8);
      const fh = await fs.open(filePath, "r");
      await fh.read(header, 0, 8, 0);
      await fh.close();
      expect(header.equals(PNG_MAGIC)).toBe(true);
    });

    it("html-semantics-cover.png exists, is non-empty, and is valid PNG", async () => {
      const filePath = path.join(IMAGES_DIR, "html-semantics-cover.png");
      const stat = await fs.stat(filePath);
      expect(stat.isFile()).toBe(true);
      expect(stat.size).toBeGreaterThan(0);
      const header = Buffer.alloc(8);
      const fh = await fs.open(filePath, "r");
      await fh.read(header, 0, 8, 0);
      await fh.close();
      expect(header.equals(PNG_MAGIC)).toBe(true);
    });
  });

  describe("article frontmatter references local cover images", () => {
    it("vpn-anonymity-explained has local coverImage path", async () => {
      const article = await getArticleBySlug("vpn-anonymity-explained");
      expect(article).toBeDefined();
      expect(article!.coverImage).toBe(
        "/images/articles/vpn-anonymity-cover.png"
      );
    });

    it("importance-of-semantics-in-html has local coverImage path", async () => {
      const article = await getArticleBySlug("importance-of-semantics-in-html");
      expect(article).toBeDefined();
      expect(article!.coverImage).toBe(
        "/images/articles/html-semantics-cover.png"
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
