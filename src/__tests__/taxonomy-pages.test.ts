import { describe, it, expect, vi } from "vitest";
import { taxonomyTree, findTaxonomyNode, getTaxonomyBreadcrumb } from "@/lib/taxonomy";
import type { TaxonomyNode } from "@/types/taxonomy";

// Mock Next.js modules so we can import the actual page exports
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));
vi.mock("next/link", () => ({
  default: vi.fn(),
}));

// Mock SCSS module
vi.mock("../app/topics/[...path]/TaxonomyPage.module.scss", () => ({
  default: {},
}));

// Import the actual page exports after mocks are set up
const {
  generateStaticParams,
  generateMetadata,
} = await import("@/app/topics/[...path]/page");

describe("Taxonomy pages - generateStaticParams (actual export)", () => {
  it("generates params for all Big Topics", () => {
    const params = generateStaticParams();
    for (const bigTopic of taxonomyTree) {
      expect(params).toContainEqual({ path: [bigTopic.slug] });
    }
  });

  it("generates params for all Topics (2 segments)", () => {
    const params = generateStaticParams();
    for (const bigTopic of taxonomyTree) {
      for (const topic of bigTopic.children ?? []) {
        expect(params).toContainEqual({ path: [bigTopic.slug, topic.slug] });
      }
    }
  });

  it("generates params for all Subtopics (3 segments)", () => {
    const params = generateStaticParams();
    for (const bigTopic of taxonomyTree) {
      for (const topic of bigTopic.children ?? []) {
        for (const subtopic of topic.children ?? []) {
          expect(params).toContainEqual({
            path: [bigTopic.slug, topic.slug, subtopic.slug],
          });
        }
      }
    }
  });

  it("total path count matches all nodes in the tree", () => {
    const params = generateStaticParams();
    let totalNodes = 0;
    function count(nodes: TaxonomyNode[]) {
      for (const n of nodes) {
        totalNodes++;
        if (n.children) count(n.children);
      }
    }
    count(taxonomyTree);
    expect(params.length).toBe(totalNodes);
  });
});

describe("Taxonomy pages - generateMetadata (actual export)", () => {
  it("returns proper metadata for a valid Big Topic path", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ path: ["programming"] }),
    });
    expect(metadata.title).toBe("Programming - TechHowlerX");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toContain("/topics/programming");
    expect(metadata.openGraph).toBeDefined();
  });

  it("returns proper metadata for a valid Topic path", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ path: ["programming", "css"] }),
    });
    expect(metadata.title).toBe("CSS - TechHowlerX");
    expect(metadata.alternates?.canonical).toContain("/topics/programming/css");
  });

  it("returns 'Not Found' title for invalid path", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ path: ["nonexistent"] }),
    });
    expect(metadata.title).toBe("Not Found");
  });
});

describe("Taxonomy pages - path resolution", () => {
  it("resolves Big Topic from single segment", () => {
    const node = findTaxonomyNode("programming");
    expect(node).toBeDefined();
    expect(node!.name).toBe("Programming");
    expect(node!.color).toBe("#3B82F6");
  });

  it("resolves Topic from two segments", () => {
    const node = findTaxonomyNode("programming/css");
    expect(node).toBeDefined();
    expect(node!.name).toBe("CSS");
    expect(node!.children).toBeDefined();
  });

  it("resolves Subtopic from three segments", () => {
    const node = findTaxonomyNode("programming/css/visual-effects");
    expect(node).toBeDefined();
    expect(node!.name).toBe("Visual Effects");
  });

  it("returns undefined for invalid paths", () => {
    expect(findTaxonomyNode("nonexistent")).toBeUndefined();
    expect(findTaxonomyNode("programming/nonexistent")).toBeUndefined();
    expect(findTaxonomyNode("programming/css/nonexistent")).toBeUndefined();
  });
});

describe("Taxonomy pages - breadcrumb generation", () => {
  it("generates breadcrumb for Big Topic", () => {
    const crumbs = getTaxonomyBreadcrumb("programming");
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0].name).toBe("Programming");
  });

  it("generates breadcrumb for Topic with parent chain", () => {
    const crumbs = getTaxonomyBreadcrumb("programming/css");
    expect(crumbs).toHaveLength(2);
    expect(crumbs[0].slug).toBe("programming");
    expect(crumbs[1].slug).toBe("css");
  });

  it("generates breadcrumb for Subtopic with full chain", () => {
    const crumbs = getTaxonomyBreadcrumb("accessibility/standards/color-contrast");
    expect(crumbs).toHaveLength(3);
    expect(crumbs[0].slug).toBe("accessibility");
    expect(crumbs[1].slug).toBe("standards");
    expect(crumbs[2].slug).toBe("color-contrast");
  });

  it("returns empty for invalid path", () => {
    expect(getTaxonomyBreadcrumb("nonexistent/path")).toEqual([]);
  });
});

describe("Taxonomy pages - Big Topics overview data", () => {
  it("all Big Topics have required display properties", () => {
    for (const bigTopic of taxonomyTree) {
      expect(bigTopic.name).toBeTruthy();
      expect(bigTopic.slug).toBeTruthy();
      expect(bigTopic.description).toBeTruthy();
      expect(bigTopic.color).toBeTruthy();
      expect(bigTopic.children).toBeDefined();
      expect(bigTopic.children!.length).toBeGreaterThan(0);
    }
  });

  it("Big Topic slugs are URL-safe", () => {
    for (const bigTopic of taxonomyTree) {
      expect(bigTopic.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("all slugs at every level are URL-safe", () => {
    function checkSlugs(nodes: TaxonomyNode[]) {
      for (const n of nodes) {
        expect(n.slug).toMatch(/^[a-z0-9-]+$/);
        if (n.children) checkSlugs(n.children);
      }
    }
    checkSlugs(taxonomyTree);
  });
});
