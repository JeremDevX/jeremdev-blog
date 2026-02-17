import type { TaxonomyNode } from "@/types/taxonomy";
import type { ArticleMeta } from "@/types/content";
import type { ToolMeta } from "@/types/tools";

// Maps tool URL slugs to taxonomy paths
export const TOOL_TAXONOMY_MAP: Record<string, string> = {
  "/tools/accessibility/contrast-checker": "accessibility/standards/color-contrast",
  "/tools/css/border-radius": "tools/css-tools/border-radius",
  "/tools/css/box-shadow": "tools/css-tools/box-shadow",
  "/tools/code/slug-generator": "tools/code-tools/slug-generator",
  "/tools/text/word-counter": "tools/text-tools/word-counter",
};

export interface SidebarItem {
  type: "article" | "tool";
  name: string;
  href: string;
}

export interface SidebarBranch {
  node: TaxonomyNode;
  items: SidebarItem[];
  children: SidebarBranch[];
}

export function buildTaxonomyPath(ancestors: string[], slug: string): string {
  return [...ancestors, slug].join("/");
}

export function buildSidebarTree(
  nodes: TaxonomyNode[],
  articles: ArticleMeta[],
  tools: ToolMeta[],
  parentPath: string[] = []
): SidebarBranch[] {
  return nodes.map((node) => {
    const currentPath = buildTaxonomyPath(parentPath, node.slug);
    const children = node.children
      ? buildSidebarTree(node.children, articles, tools, [...parentPath, node.slug])
      : [];

    // Find articles matching this taxonomy node
    const matchingArticles: SidebarItem[] = articles
      .filter((a) => a.category === currentPath)
      .map((a) => ({
        type: "article" as const,
        name: a.title,
        href: `/blog/posts/${a.slug}`,
      }));

    // Find tools matching this taxonomy node
    const matchingTools: SidebarItem[] = tools
      .filter((t) => TOOL_TAXONOMY_MAP[t.slug] === currentPath)
      .map((t) => ({
        type: "tool" as const,
        name: t.name,
        href: t.slug,
      }));

    // Sort items alphabetically
    const items = [...matchingArticles, ...matchingTools].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return { node, items, children };
  });
}

export function getDefaultOpenItems(
  pathname: string,
  articles: ArticleMeta[],
  tools: ToolMeta[]
): string[] {
  // Check if pathname matches a tool page
  const tool = tools.find((t) => t.slug === pathname);
  if (tool) {
    const taxonomyPath = TOOL_TAXONOMY_MAP[tool.slug];
    if (taxonomyPath) {
      const segments = taxonomyPath.split("/");
      const openItems: string[] = [];
      for (let i = 0; i < segments.length; i++) {
        openItems.push(segments.slice(0, i + 1).join("/"));
      }
      return openItems;
    }
  }

  // Check if pathname matches an article page
  const article = articles.find((a) => `/blog/posts/${a.slug}` === pathname);
  if (article) {
    const segments = article.category.split("/");
    const openItems: string[] = [];
    for (let i = 0; i < segments.length; i++) {
      openItems.push(segments.slice(0, i + 1).join("/"));
    }
    return openItems;
  }

  return [];
}

export function hasContent(branch: SidebarBranch): boolean {
  if (branch.items.length > 0) return true;
  return branch.children.some(hasContent);
}
