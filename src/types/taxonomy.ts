export interface TaxonomyNode {
  name: string;
  slug: string;
  description: string;
  color?: string; // only for Big Topics
  children?: TaxonomyNode[];
}

export type TaxonomyTree = TaxonomyNode[];
export type BigTopic = TaxonomyNode & { color: string; children: TaxonomyNode[] };
