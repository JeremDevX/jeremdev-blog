import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetAllArticles = vi.fn();

vi.mock("../../src/lib/content", () => ({
  getAllArticles: mockGetAllArticles,
}));

const {
  getArticlesForIndex,
  getToolsForIndex,
  generateSearchIndex,
} = await import("../../scripts/generate-search-index");

describe("Search Index Generation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getToolsForIndex", () => {
    it("contains exactly 9 tools", () => {
      const tools = getToolsForIndex();
      expect(tools).toHaveLength(9);
    });

    it("every tool has all required SearchIndexEntry fields", () => {
      for (const tool of getToolsForIndex()) {
        expect(tool).toHaveProperty("title");
        expect(tool).toHaveProperty("slug");
        expect(tool).toHaveProperty("resume");
        expect(tool).toHaveProperty("category");
        expect(tool.type).toBe("tool");
      }
    });

    it("all tool slugs start with /tools/", () => {
      for (const tool of getToolsForIndex()) {
        expect(tool.slug).toMatch(/^\/tools\//);
      }
    });
  });

  describe("getArticlesForIndex", () => {
    it("maps published articles from getAllArticles() to index entries", async () => {
      mockGetAllArticles.mockResolvedValue([
        {
          title: "My Article",
          slug: "my-article",
          resume: "A great article",
          category: "programming/css",
          date: "2026-01-01",
          published: true,
        },
      ]);

      const articles = await getArticlesForIndex();
      expect(mockGetAllArticles).toHaveBeenCalledTimes(1);
      expect(articles).toEqual([
        {
          title: "My Article",
          slug: "/blog/posts/my-article",
          resume: "A great article",
          category: "programming/css",
          type: "article",
        },
      ]);
    });

    it("returns empty array when there are no articles", async () => {
      mockGetAllArticles.mockResolvedValue([]);

      const articles = await getArticlesForIndex();
      expect(articles).toEqual([]);
    });
  });

  describe("generateSearchIndex", () => {
    it("combines articles and tools into a single index", async () => {
      mockGetAllArticles.mockResolvedValue([
        {
          title: "Test",
          slug: "test",
          resume: "Desc",
          category: "cat",
          date: "2026-01-01",
          published: true,
        },
      ]);

      const index = await generateSearchIndex();
      const articles = index.filter((e) => e.type === "article");
      const tools = index.filter((e) => e.type === "tool");

      expect(articles).toHaveLength(1);
      expect(tools).toHaveLength(9);
      expect(index).toHaveLength(10);
    });
  });
});
