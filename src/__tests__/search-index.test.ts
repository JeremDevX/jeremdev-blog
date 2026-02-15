import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import {
  getArticlesForIndex,
  generateSearchIndex,
  TOOLS_FOR_INDEX,
  type SearchIndexEntry,
} from "../../scripts/generate-search-index";

// Mock fs/promises to avoid reading the real filesystem
vi.mock("fs/promises");

// Mock gray-matter to return controlled frontmatter
vi.mock("gray-matter", () => ({
  default: (content: string) => {
    // Parse simple "key: value" lines from mock content
    const lines = content.split("\n");
    const data: Record<string, unknown> = {};
    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const value = match[2].trim();
        if (value === "true") data[match[1]] = true;
        else if (value === "false") data[match[1]] = false;
        else data[match[1]] = value;
      }
    }
    return { data, content };
  },
}));

describe("Search Index Generation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("TOOLS_FOR_INDEX", () => {
    it("contains exactly 5 tools", () => {
      expect(TOOLS_FOR_INDEX).toHaveLength(5);
    });

    it("every tool has all required SearchIndexEntry fields", () => {
      for (const tool of TOOLS_FOR_INDEX) {
        expect(tool).toHaveProperty("title");
        expect(tool).toHaveProperty("slug");
        expect(tool).toHaveProperty("resume");
        expect(tool).toHaveProperty("category");
        expect(tool.type).toBe("tool");
      }
    });

    it("all tool slugs start with /tools/", () => {
      for (const tool of TOOLS_FOR_INDEX) {
        expect(tool.slug).toMatch(/^\/tools\//);
      }
    });

    it("no tool has an empty title or resume", () => {
      for (const tool of TOOLS_FOR_INDEX) {
        expect(tool.title.length).toBeGreaterThan(0);
        expect(tool.resume.length).toBeGreaterThan(0);
      }
    });
  });

  describe("getArticlesForIndex", () => {
    it("returns published articles with correct slug prefix", async () => {
      vi.mocked(fs.readdir).mockResolvedValue([
        "my-article.mdx",
      ] as unknown as Awaited<ReturnType<typeof fs.readdir>>);

      vi.mocked(fs.readFile).mockResolvedValue(
        `title: My Article\nslug: my-article\nresume: A great article\ncategory: programming/css\npublished: true`,
      );

      const articles = await getArticlesForIndex();
      expect(articles).toHaveLength(1);
      expect(articles[0].title).toBe("My Article");
      expect(articles[0].slug).toBe("/blog/posts/my-article");
      expect(articles[0].resume).toBe("A great article");
      expect(articles[0].category).toBe("programming/css");
      expect(articles[0].type).toBe("article");
    });

    it("excludes unpublished articles", async () => {
      vi.mocked(fs.readdir).mockResolvedValue([
        "draft.mdx",
        "published.mdx",
      ] as unknown as Awaited<ReturnType<typeof fs.readdir>>);

      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(
          `title: Draft\nslug: draft\nresume: Draft article\ncategory: testing\npublished: false`,
        )
        .mockResolvedValueOnce(
          `title: Published\nslug: published\nresume: Published article\ncategory: testing\npublished: true`,
        );

      const articles = await getArticlesForIndex();
      expect(articles).toHaveLength(1);
      expect(articles[0].title).toBe("Published");
    });

    it("skips non-mdx files", async () => {
      vi.mocked(fs.readdir).mockResolvedValue([
        "readme.txt",
        "article.mdx",
      ] as unknown as Awaited<ReturnType<typeof fs.readdir>>);

      vi.mocked(fs.readFile).mockResolvedValue(
        `title: Article\nslug: article\nresume: Desc\ncategory: test\npublished: true`,
      );

      const articles = await getArticlesForIndex();
      expect(articles).toHaveLength(1);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

    it("returns empty array when articles directory does not exist", async () => {
      vi.mocked(fs.readdir).mockRejectedValue(new Error("ENOENT"));

      const articles = await getArticlesForIndex();
      expect(articles).toEqual([]);
    });

    it("defaults resume and category to empty string when missing", async () => {
      vi.mocked(fs.readdir).mockResolvedValue([
        "sparse.mdx",
      ] as unknown as Awaited<ReturnType<typeof fs.readdir>>);

      vi.mocked(fs.readFile).mockResolvedValue(
        `title: Sparse\nslug: sparse\npublished: true`,
      );

      const articles = await getArticlesForIndex();
      expect(articles[0].resume).toBe("");
      expect(articles[0].category).toBe("");
    });
  });

  describe("generateSearchIndex", () => {
    it("combines articles and tools into a single index", async () => {
      vi.mocked(fs.readdir).mockResolvedValue([
        "test.mdx",
      ] as unknown as Awaited<ReturnType<typeof fs.readdir>>);

      vi.mocked(fs.readFile).mockResolvedValue(
        `title: Test\nslug: test\nresume: Desc\ncategory: cat\npublished: true`,
      );

      const index = await generateSearchIndex();
      const articles = index.filter((e) => e.type === "article");
      const tools = index.filter((e) => e.type === "tool");

      expect(articles).toHaveLength(1);
      expect(tools).toHaveLength(5);
      expect(index).toHaveLength(6);
    });

    it("returns only tools when no articles exist", async () => {
      vi.mocked(fs.readdir).mockRejectedValue(new Error("ENOENT"));

      const index = await generateSearchIndex();
      expect(index).toHaveLength(5);
      expect(index.every((e) => e.type === "tool")).toBe(true);
    });
  });

  describe("SearchIndexEntry schema compliance", () => {
    it("every entry type is either article or tool", async () => {
      vi.mocked(fs.readdir).mockResolvedValue([
        "a.mdx",
      ] as unknown as Awaited<ReturnType<typeof fs.readdir>>);
      vi.mocked(fs.readFile).mockResolvedValue(
        `title: A\nslug: a\nresume: R\ncategory: C\npublished: true`,
      );

      const index = await generateSearchIndex();
      for (const entry of index) {
        expect(["article", "tool"]).toContain(entry.type);
      }
    });
  });
});
