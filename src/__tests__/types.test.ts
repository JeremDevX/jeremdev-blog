import { describe, it, expect } from "vitest";
import type { Frontmatter, ArticleMeta, Article } from "@/types/content";
import type { TaxonomyNode, TaxonomyTree, BigTopic } from "@/types/taxonomy";

describe("Content types", () => {
  it("Frontmatter has all required fields", () => {
    const fm: Frontmatter = {
      title: "Test",
      slug: "test",
      date: "2026-01-01",
      resume: "A test article",
      category: "programming/css",
      published: true,
    };
    expect(fm.title).toBe("Test");
    expect(fm.published).toBe(true);
  });

  it("Frontmatter supports optional fields", () => {
    const fm: Frontmatter = {
      title: "Test",
      slug: "test",
      date: "2026-01-01",
      resume: "A test article",
      category: "programming/css",
      published: true,
      coverImage: "/images/cover.jpg",
      relatedTools: ["contrast-checker"],
      relatedArticles: ["other-article"],
      featured: true,
    };
    expect(fm.coverImage).toBe("/images/cover.jpg");
    expect(fm.relatedTools).toEqual(["contrast-checker"]);
    expect(fm.featured).toBe(true);
  });

  it("ArticleMeta extends Frontmatter", () => {
    const meta: ArticleMeta = {
      title: "Test",
      slug: "test",
      date: "2026-01-01",
      resume: "A test",
      category: "programming",
      published: true,
    };
    expect(meta.slug).toBe("test");
  });

  it("Article extends ArticleMeta with content", () => {
    const article: Article = {
      title: "Test",
      slug: "test",
      date: "2026-01-01",
      resume: "A test",
      category: "programming",
      published: true,
      content: "# Hello\n\nSome MDX content",
    };
    expect(article.content).toContain("# Hello");
  });
});

describe("Taxonomy types", () => {
  it("TaxonomyNode has required fields", () => {
    const node: TaxonomyNode = {
      name: "CSS",
      slug: "css",
      description: "CSS topics",
    };
    expect(node.name).toBe("CSS");
  });

  it("TaxonomyNode supports optional color and children", () => {
    const node: TaxonomyNode = {
      name: "Programming",
      slug: "programming",
      description: "Programming topics",
      color: "#3B82F6",
      children: [
        { name: "CSS", slug: "css", description: "CSS topics" },
      ],
    };
    expect(node.color).toBe("#3B82F6");
    expect(node.children).toHaveLength(1);
  });

  it("TaxonomyTree is an array of TaxonomyNode", () => {
    const tree: TaxonomyTree = [
      { name: "Programming", slug: "programming", description: "Dev topics" },
    ];
    expect(tree).toHaveLength(1);
  });

  it("BigTopic requires color and children", () => {
    const bigTopic: BigTopic = {
      name: "Programming",
      slug: "programming",
      description: "Programming topics",
      color: "#3B82F6",
      children: [
        { name: "CSS", slug: "css", description: "CSS topics" },
      ],
    };
    expect(bigTopic.color).toBe("#3B82F6");
    expect(bigTopic.children).toHaveLength(1);
  });
});
