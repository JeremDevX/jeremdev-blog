import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock content module
vi.mock("../lib/content", () => ({
  getAllArticles: vi.fn().mockResolvedValue([
    {
      title: "Test Article",
      slug: "test-article",
      date: "2026-01-15",
      resume: "A test article",
      category: "programming/css",
      published: true,
    },
  ]),
}));

// Mock tools module
vi.mock("../lib/tools", () => ({
  getAllTools: vi.fn().mockReturnValue([
    {
      name: "Box Shadow Generator",
      slug: "/tools/css/box-shadow",
      description: "Generate CSS box-shadow values.",
      category: "CSS",
      icon: "Layers2",
    },
  ]),
}));

// Mock next/font/google for layout import
vi.mock("next/font/google", () => ({
  League_Spartan: () => ({ className: "mocked-font" }),
}));

// Mock taxonomy module
vi.mock("../lib/taxonomy", () => ({
  taxonomyTree: [
    {
      name: "Programming",
      slug: "programming",
      description: "Programming articles",
      color: "#3B82F6",
      children: [
        {
          name: "CSS",
          slug: "css",
          description: "CSS articles",
          children: [
            {
              name: "Visual Effects",
              slug: "visual-effects",
              description: "Visual effects",
            },
          ],
        },
      ],
    },
  ],
}));

// ─── Sitemap tests ───

describe("Sitemap generation", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("exports a default async function", async () => {
    const sitemapModule = await import("@/app/sitemap");
    expect(typeof sitemapModule.default).toBe("function");
  });

  it("returns an array of sitemap entries", async () => {
    const sitemapModule = await import("@/app/sitemap");
    const result = await sitemapModule.default();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("includes static pages with correct priorities", async () => {
    const sitemapModule = await import("@/app/sitemap");
    const result = await sitemapModule.default();

    const urls = result.map((entry) => entry.url);
    expect(urls).toContain("https://techhowlerx.com/");
    expect(urls).toContain("https://techhowlerx.com/topics");
    expect(urls).toContain("https://techhowlerx.com/tools");
    expect(urls).toContain("https://techhowlerx.com/about");
    expect(urls).toContain("https://techhowlerx.com/termsofuse");
    expect(urls).toContain("https://techhowlerx.com/blog");

    const homepage = result.find(
      (e) => e.url === "https://techhowlerx.com/"
    );
    expect(homepage?.priority).toBe(1.0);
  });

  it("includes article URLs with lastModified", async () => {
    const sitemapModule = await import("@/app/sitemap");
    const result = await sitemapModule.default();

    const articleEntry = result.find((e) =>
      e.url.includes("/blog/posts/test-article")
    );
    expect(articleEntry).toBeDefined();
    expect(articleEntry!.url).toBe(
      "https://techhowlerx.com/blog/posts/test-article"
    );
    expect(articleEntry!.lastModified).toBe("2026-01-15");
    expect(articleEntry!.priority).toBe(0.8);
  });

  it("includes tool URLs", async () => {
    const sitemapModule = await import("@/app/sitemap");
    const result = await sitemapModule.default();

    const toolEntry = result.find((e) =>
      e.url.includes("/tools/css/box-shadow")
    );
    expect(toolEntry).toBeDefined();
    expect(toolEntry!.priority).toBe(0.7);
  });

  it("includes taxonomy URLs recursively", async () => {
    const sitemapModule = await import("@/app/sitemap");
    const result = await sitemapModule.default();

    const urls = result.map((e) => e.url);
    expect(urls).toContain("https://techhowlerx.com/topics/programming");
    expect(urls).toContain("https://techhowlerx.com/topics/programming/css");
    expect(urls).toContain(
      "https://techhowlerx.com/topics/programming/css/visual-effects"
    );
  });

  it("all entries have lastModified set", async () => {
    const sitemapModule = await import("@/app/sitemap");
    const result = await sitemapModule.default();

    for (const entry of result) {
      expect(entry.lastModified).toBeDefined();
    }
  });
});

// ─── Robots tests ───

describe("Robots configuration", () => {
  it("exports a default function", async () => {
    const robotsModule = await import("@/app/robots");
    expect(typeof robotsModule.default).toBe("function");
  });

  it("returns rules allowing all paths", async () => {
    const robotsModule = await import("@/app/robots");
    const result = robotsModule.default();

    expect(result.rules).toBeDefined();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules.userAgent).toBe("*");
    expect(rules.allow).toBe("/");
  });

  it("does not disallow any paths", async () => {
    const robotsModule = await import("@/app/robots");
    const result = robotsModule.default();

    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules.disallow).toBeUndefined();
  });

  it("references sitemap with correct URL", async () => {
    const robotsModule = await import("@/app/robots");
    const result = robotsModule.default();

    expect(result.sitemap).toBe("https://techhowlerx.com/sitemap.xml");
  });
});

// ─── Next.config redirects & headers tests ───

describe("SEO metadata on pages", () => {
  it("root layout exports metadata with title template", async () => {
    const layoutModule = await import("@/app/layout");
    const metadata = (layoutModule as any).metadata;

    expect(metadata).toBeDefined();
    expect(metadata.title).toEqual({
      default: "TechHowlerX - Tech Blog & Dev Tools",
      template: "%s | TechHowlerX",
    });
    expect(metadata.metadataBase).toBeDefined();
    expect(metadata.openGraph?.siteName).toBe("TechHowlerX");
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it("tools index exports metadata with canonical", async () => {
    const toolsModule = await import("@/app/tools/page");
    const metadata = (toolsModule as any).metadata;

    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("Developer Tools");
    expect(metadata.alternates?.canonical).toBe("/tools");
  });

  it("topics page exports metadata with relative canonical", async () => {
    const topicsModule = await import("@/app/topics/page");
    const metadata = (topicsModule as any).metadata;

    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("Topics");
    expect(metadata.alternates?.canonical).toBe("/topics");
  });
});
