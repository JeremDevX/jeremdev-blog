import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Next.js modules
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => ({ type: "a", props: { href, children } }),
}));
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => ({
    type: "img",
    props,
  }),
}));

// Mock SCSS modules
vi.mock("../app/HomePage.module.scss", () => ({
  default: {
    page: "page",
    section: "section",
    sectionHeading: "sectionHeading",
    articlesGrid: "articlesGrid",
    toolsGrid: "toolsGrid",
    emptyState: "emptyState",
    contact: "contact",
    contactTitle: "contactTitle",
    contactSocials: "contactSocials",
    contactIcon: "contactIcon",
  },
}));
vi.mock(
  "../components/custom/ContentCard/ContentCard.module.scss",
  () => ({
    default: {
      card: "card",
      link: "link",
      imageWrapper: "imageWrapper",
      image: "image",
      content: "content",
      meta: "meta",
      badge: "badge",
      badgeArticle: "badgeArticle",
      badgeTool: "badgeTool",
      category: "category",
      title: "title",
      description: "description",
      date: "date",
    },
  })
);
vi.mock(
  "../components/custom/HeroSection/HeroSection.module.scss",
  () => ({
    default: {
      hero: "hero",
      container: "container",
      heading: "heading",
      subtitle: "subtitle",
      cta: "cta",
      ctaPrimary: "ctaPrimary",
      ctaSecondary: "ctaSecondary",
    },
  })
);

const mockArticles = [
  {
    title: "Test Article One",
    slug: "test-article-one",
    date: "2026-01-15",
    resume: "First test article description",
    category: "programming/javascript",
    coverImage: "/images/test-one.png",
    published: true,
  },
  {
    title: "Test Article Two",
    slug: "test-article-two",
    date: "2026-01-10",
    resume: "Second test article description",
    category: "programming/css",
    published: true,
  },
];

vi.mock("../lib/content", () => ({
  getLatestArticles: vi.fn().mockResolvedValue(mockArticles),
}));

// ─── Metadata tests ───

describe("Homepage metadata", () => {
  it("exports metadata with required Open Graph fields", async () => {
    const { metadata } = await import("@/app/page");

    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("TechHowlerX - Tech Blog & Dev Tools");
    expect(metadata.description).toContain("TechHowlerX");
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph!.title).toBe(
      "TechHowlerX - Tech Blog & Dev Tools"
    );
    expect(metadata.openGraph!.type).toBe("website");
    expect(metadata.openGraph!.siteName).toBe("TechHowlerX");
  });

  it("metadata description is non-empty and meaningful", async () => {
    const { metadata } = await import("@/app/page");
    expect(typeof metadata.description).toBe("string");
    expect(metadata.description!.length).toBeGreaterThan(20);
  });
});

// ─── Page component tests ───

describe("Homepage page component", () => {
  it("exports an async default function", async () => {
    const pageModule = await import("@/app/page");
    expect(typeof pageModule.default).toBe("function");
  });

  it("calls getLatestArticles with count of 6", async () => {
    const { getLatestArticles } = await import("@/lib/content");
    const pageModule = await import("@/app/page");
    await pageModule.default();
    expect(getLatestArticles).toHaveBeenCalledWith(6);
  });

  it("renders without throwing", async () => {
    const pageModule = await import("@/app/page");
    const result = await pageModule.default();
    expect(result).toBeDefined();
  });
});

// ─── HeroSection tests ───

describe("HeroSection component", () => {
  it("exports a default function from index", async () => {
    const module = await import("@/components/custom/HeroSection");
    expect(typeof module.default).toBe("function");
  });

  it("renders a section with the correct heading text", async () => {
    const { default: HeroSection } = await import(
      "@/components/custom/HeroSection/HeroSection"
    );
    const result = HeroSection();

    // Traverse the JSX tree to find the heading
    const heading = findInTree(result, (node: any) =>
      node?.props?.className === "heading"
    );
    expect(heading).toBeDefined();
    expect(heading.props.children).toBe("Tech for the Curious Mind");
  });

  it("renders subtitle with expected text", async () => {
    const { default: HeroSection } = await import(
      "@/components/custom/HeroSection/HeroSection"
    );
    const result = HeroSection();

    const subtitle = findInTree(result, (node: any) =>
      node?.props?.className === "subtitle"
    );
    expect(subtitle).toBeDefined();
    expect(subtitle.props.children).toContain("Explore tech articles");
  });

  it("renders CTA links to /blog and /tools", async () => {
    const { default: HeroSection } = await import(
      "@/components/custom/HeroSection/HeroSection"
    );
    const result = HeroSection();

    // Mocked Link components appear as elements with href in props
    const links = findAllInTree(result, (node: any) =>
      node?.props?.href && typeof node?.props?.href === "string"
    );
    const hrefs = links.map((l: any) => l.props.href);
    expect(hrefs).toContain("/blog");
    expect(hrefs).toContain("/tools");
  });
});

// ─── ContentCard tests ───

describe("ContentCard component", () => {
  it("exports default function and ContentCardProps type", async () => {
    const module = await import("@/components/custom/ContentCard");
    expect(typeof module.default).toBe("function");
  });

  it("renders article variant with date and category", async () => {
    const { default: ContentCard } = await import(
      "@/components/custom/ContentCard/ContentCard"
    );
    const result = ContentCard({
      type: "article",
      title: "My Article",
      description: "A description",
      href: "/blog/posts/my-article",
      date: "2026-01-15",
      category: "programming/css",
    });

    // Should have article badge
    const badge = findInTree(result, (node: any) =>
      node?.props?.className?.includes("badgeArticle")
    );
    expect(badge).toBeDefined();
    expect(badge.props.children).toBe("Article");

    // Should render category
    const category = findInTree(result, (node: any) =>
      node?.props?.className === "category"
    );
    expect(category).toBeDefined();
    expect(category.props.children).toBe("programming/css");

    // Should render date as <time>
    const time = findInTree(result, (node: any) => node?.type === "time");
    expect(time).toBeDefined();
    expect(time.props.dateTime).toBe("2026-01-15");
  });

  it("renders tool variant without date", async () => {
    const { default: ContentCard } = await import(
      "@/components/custom/ContentCard/ContentCard"
    );
    const result = ContentCard({
      type: "tool",
      title: "My Tool",
      description: "A tool description",
      href: "/tools/my-tool",
    });

    // Should have tool badge
    const badge = findInTree(result, (node: any) =>
      node?.props?.className?.includes("badgeTool")
    );
    expect(badge).toBeDefined();
    expect(badge.props.children).toBe("Tool");

    // Should NOT render date
    const time = findInTree(result, (node: any) => node?.type === "time");
    expect(time).toBeUndefined();
  });

  it("renders cover image when provided", async () => {
    const { default: ContentCard } = await import(
      "@/components/custom/ContentCard/ContentCard"
    );
    const result = ContentCard({
      type: "article",
      title: "With Image",
      description: "Has a cover",
      href: "/blog/posts/with-image",
      coverImage: "/images/cover.png",
    });

    // Mocked Image component appears as element with src in props
    const img = findInTree(result, (node: any) =>
      node?.props?.src === "/images/cover.png"
    );
    expect(img).toBeDefined();
    expect(img.props.width).toBeDefined();
    expect(img.props.height).toBeDefined();
  });

  it("does not render cover image when not provided", async () => {
    const { default: ContentCard } = await import(
      "@/components/custom/ContentCard/ContentCard"
    );
    const result = ContentCard({
      type: "article",
      title: "No Image",
      description: "No cover",
      href: "/blog/posts/no-image",
    });

    // No element with an image src should exist
    const img = findInTree(result, (node: any) =>
      node?.props?.src && node?.props?.alt
    );
    expect(img).toBeUndefined();
  });

  it("wraps card content in a link to the provided href", async () => {
    const { default: ContentCard } = await import(
      "@/components/custom/ContentCard/ContentCard"
    );
    const result = ContentCard({
      type: "tool",
      title: "Linked Tool",
      description: "Click me",
      href: "/tools/linked",
    });

    // Mocked Link component appears as element with href in props
    const link = findInTree(result, (node: any) =>
      node?.props?.href === "/tools/linked"
    );
    expect(link).toBeDefined();
  });

  it("uses semantic <article> element as root", async () => {
    const { default: ContentCard } = await import(
      "@/components/custom/ContentCard/ContentCard"
    );
    const result = ContentCard({
      type: "article",
      title: "Semantic",
      description: "HTML",
      href: "/test",
    });

    expect(result.type).toBe("article");
  });
});

// ─── Tools data tests ───

describe("Homepage tools data", () => {
  it("page defines exactly 5 hardcoded tools", async () => {
    // The TOOLS constant is not exported, but we can verify via rendering
    const pageModule = await import("@/app/page");
    const result = await pageModule.default();

    // Find the tools grid and count ContentCard instances
    const toolsSection = findInTree(result, (node: any) =>
      node?.props?.["aria-labelledby"] === "developer-tools"
    );
    expect(toolsSection).toBeDefined();

    const toolCards = findAllInTree(toolsSection, (node: any) =>
      node?.type?.name === "ContentCard" || (node?.props?.type === "tool")
    );
    expect(toolCards.length).toBe(5);
  });
});

// ─── Empty state tests ───

describe("Homepage empty state", () => {
  it("shows empty state message when no articles exist", async () => {
    const { getLatestArticles } = await import("@/lib/content");
    vi.mocked(getLatestArticles).mockResolvedValueOnce([]);

    // Re-import to get fresh render
    const pageModule = await import("@/app/page");
    const result = await pageModule.default();

    const emptyState = findInTree(result, (node: any) =>
      node?.props?.className === "emptyState"
    );
    expect(emptyState).toBeDefined();
    expect(emptyState.props.children).toContain("No articles yet");
  });
});

// ─── Helper utilities for traversing JSX trees ───

function findInTree(node: any, predicate: (node: any) => boolean): any {
  if (!node || typeof node !== "object") return undefined;
  if (predicate(node)) return node;

  const children = node.props?.children;
  if (Array.isArray(children)) {
    for (const child of children) {
      const found = findInTree(child, predicate);
      if (found) return found;
    }
  } else if (children && typeof children === "object") {
    return findInTree(children, predicate);
  }
  return undefined;
}

function findAllInTree(node: any, predicate: (node: any) => boolean): any[] {
  const results: any[] = [];
  if (!node || typeof node !== "object") return results;
  if (predicate(node)) results.push(node);

  const children = node.props?.children;
  if (Array.isArray(children)) {
    for (const child of children) {
      results.push(...findAllInTree(child, predicate));
    }
  } else if (children && typeof children === "object") {
    results.push(...findAllInTree(children, predicate));
  }
  return results;
}
