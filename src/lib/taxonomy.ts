import type { TaxonomyNode, TaxonomyTree } from "@/types/taxonomy";
import { taxonomyTreeData } from "@/lib/taxonomy-data";

export const taxonomyTree: TaxonomyTree = taxonomyTreeData;

export function findTaxonomyNode(path: string): TaxonomyNode | undefined {
  if (!path) return undefined;

  const segments = path.split("/");
  let nodes: TaxonomyNode[] = taxonomyTree;

  for (const segment of segments) {
    const found = nodes.find((n) => n.slug === segment);
    if (!found) return undefined;
    if (segment === segments[segments.length - 1]) return found;
    nodes = found.children ?? [];
  }

  return undefined;
}

export function getTaxonomyBreadcrumb(path: string): TaxonomyNode[] {
  if (!path) return [];

  const segments = path.split("/");
  const breadcrumb: TaxonomyNode[] = [];
  let nodes: TaxonomyNode[] = taxonomyTree;

  for (const segment of segments) {
    const found = nodes.find((n) => n.slug === segment);
    if (!found) return [];
    breadcrumb.push(found);
    nodes = found.children ?? [];
  }

  return breadcrumb;
}

export function getTaxonomyDisplayLabel(path: string): string {
  return getTaxonomyBreadcrumb(path).at(-1)?.name ?? path;
}
