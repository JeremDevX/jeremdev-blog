import type { TaxonomyTree } from "@/types/taxonomy";
import { programmingTaxonomy } from "./programming";
import { accessibilityTaxonomy } from "./accessibility";
import { toolsTaxonomy } from "./tools";
import { networkingSecurityTaxonomy } from "./networking-security";

export const taxonomyTreeData: TaxonomyTree = [
  programmingTaxonomy,
  accessibilityTaxonomy,
  toolsTaxonomy,
  networkingSecurityTaxonomy,
];
