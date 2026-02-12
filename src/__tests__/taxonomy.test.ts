import { describe, it, expect } from "vitest";
import {
  taxonomyTree,
  findTaxonomyNode,
  getTaxonomyBreadcrumb,
} from "@/lib/taxonomy";
import type { TaxonomyNode } from "@/types/taxonomy";

describe("taxonomyTree", () => {
  it("is an array of BigTopic nodes", () => {
    expect(Array.isArray(taxonomyTree)).toBe(true);
    expect(taxonomyTree.length).toBeGreaterThan(0);
  });

  it("each BigTopic has name, slug, description, color, and children", () => {
    for (const bigTopic of taxonomyTree) {
      expect(bigTopic.name).toBeTruthy();
      expect(bigTopic.slug).toBeTruthy();
      expect(bigTopic.description).toBeTruthy();
      expect(bigTopic.color).toBeTruthy();
      expect(Array.isArray(bigTopic.children)).toBe(true);
    }
  });

  it("each Topic has name, slug, description, and children", () => {
    for (const bigTopic of taxonomyTree) {
      for (const topic of bigTopic.children!) {
        expect(topic.name).toBeTruthy();
        expect(topic.slug).toBeTruthy();
        expect(topic.description).toBeTruthy();
        expect(Array.isArray(topic.children)).toBe(true);
      }
    }
  });

  it("each Subtopic has name, slug, and description", () => {
    for (const bigTopic of taxonomyTree) {
      for (const topic of bigTopic.children!) {
        for (const subtopic of topic.children!) {
          expect(subtopic.name).toBeTruthy();
          expect(subtopic.slug).toBeTruthy();
          expect(subtopic.description).toBeTruthy();
        }
      }
    }
  });

  it("includes existing tool route categories", () => {
    // The taxonomy should cover accessibility, css, code, text tool categories
    const allSlugs: string[] = [];
    function collectSlugs(nodes: TaxonomyNode[]) {
      for (const n of nodes) {
        allSlugs.push(n.slug);
        if (n.children) collectSlugs(n.children);
      }
    }
    collectSlugs(taxonomyTree);

    expect(allSlugs).toContain("css");
    expect(allSlugs).toContain("accessibility");
  });
});

describe("findTaxonomyNode", () => {
  it("finds a BigTopic by single slug", () => {
    const node = findTaxonomyNode("programming");
    expect(node).toBeDefined();
    expect(node!.name).toBe("Programming");
  });

  it("finds a Topic by two-part path", () => {
    const node = findTaxonomyNode("programming/css");
    expect(node).toBeDefined();
    expect(node!.slug).toBe("css");
  });

  it("finds a Subtopic by three-part path", () => {
    const node = findTaxonomyNode("programming/css/visual-effects");
    expect(node).toBeDefined();
    expect(node!.slug).toBe("visual-effects");
  });

  it("returns undefined for non-existent path", () => {
    expect(findTaxonomyNode("nonexistent/path")).toBeUndefined();
  });

  it("returns undefined for empty path", () => {
    expect(findTaxonomyNode("")).toBeUndefined();
  });
});

describe("getTaxonomyBreadcrumb", () => {
  it("returns breadcrumb array for a BigTopic", () => {
    const crumbs = getTaxonomyBreadcrumb("programming");
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0].name).toBe("Programming");
  });

  it("returns breadcrumb array for a Topic", () => {
    const crumbs = getTaxonomyBreadcrumb("programming/css");
    expect(crumbs).toHaveLength(2);
    expect(crumbs[0].name).toBe("Programming");
    expect(crumbs[1].slug).toBe("css");
  });

  it("returns breadcrumb array for a Subtopic", () => {
    const crumbs = getTaxonomyBreadcrumb("programming/css/visual-effects");
    expect(crumbs).toHaveLength(3);
    expect(crumbs[0].slug).toBe("programming");
    expect(crumbs[1].slug).toBe("css");
    expect(crumbs[2].slug).toBe("visual-effects");
  });

  it("returns empty array for non-existent path", () => {
    expect(getTaxonomyBreadcrumb("nonexistent")).toEqual([]);
  });
});
