import { findTaxonomyNode } from "@/lib/taxonomy";
import type { TaxonomyNode } from "@/types/taxonomy";
import type { ArticleMeta } from "@/types/content";
import type { ToolMeta } from "@/types/tools";

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

export function normalizePathname(pathname: string): string {
  if (!pathname) return "";
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

function getPreferredTaxonomyPath(taxonomyPaths: string[]): string | undefined {
  if (taxonomyPaths.length === 0) return undefined;

  return [...taxonomyPaths].sort((a, b) => {
    const depthDiff = b.split("/").length - a.split("/").length;
    if (depthDiff !== 0) return depthDiff;
    return a.localeCompare(b);
  })[0];
}

export function buildSidebarTree(
  nodes: TaxonomyNode[],
  articles: ArticleMeta[],
  tools: ToolMeta[],
  parentPath: string[] = [],
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
      .filter((t) => getPreferredTaxonomyPath(t.taxonomyPaths) === currentPath)
      .map((t) => ({
        type: "tool" as const,
        name: t.name,
        href: t.slug,
      }));

    // Sort items alphabetically
    const items = [...matchingArticles, ...matchingTools].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return { node, items, children };
  });
}

function buildOpenPathsFromTaxonomyPath(path: string): string[] {
  if (!path) return [];

  const segments = path.split("/");
  const openItems: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const candidate = segments.slice(0, i + 1).join("/");
    if (!findTaxonomyNode(candidate)) {
      return [];
    }
    openItems.push(candidate);
  }

  return openItems;
}

export function getDefaultOpenItems(
  pathname: string,
  articles: ArticleMeta[],
  tools: ToolMeta[],
): string[] {
  const normalizedPathname = normalizePathname(pathname);

  // Check if pathname matches a tool page
  const tool = tools.find(
    (t) => normalizePathname(t.slug) === normalizedPathname,
  );
  if (tool) {
    const openItems = new Set<string>();
    for (const taxonomyPath of tool.taxonomyPaths) {
      for (const branchPath of buildOpenPathsFromTaxonomyPath(taxonomyPath)) {
        openItems.add(branchPath);
      }
    }
    return [...openItems];
  }

  // Check if pathname matches an article page
  const article = articles.find(
    (a) =>
      normalizePathname(`/blog/posts/${a.slug}`) === normalizedPathname,
  );
  if (article) {
    return buildOpenPathsFromTaxonomyPath(article.category);
  }

  return [];
}

export function hasContent(branch: SidebarBranch): boolean {
  if (branch.items.length > 0) return true;
  return branch.children.some(hasContent);
}
