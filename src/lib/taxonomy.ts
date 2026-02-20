import type { TaxonomyNode, TaxonomyTree } from "@/types/taxonomy";

export const taxonomyTree: TaxonomyTree = [
  {
    name: "Programming",
    slug: "programming",
    description: "Articles about code, languages, frameworks, and development patterns",
    color: "#3B82F6",
    children: [
      {
        name: "CSS",
        slug: "css",
        description: "Styling, layouts, visual effects, and responsive design",
      },
      {
        name: "JavaScript & TypeScript",
        slug: "javascript-typescript",
        description: "Language fundamentals, frameworks, and development tooling",
      },
      {
        name: "HTML",
        slug: "html",
        description: "HTML structure, semantics, and markup best practices",
      },
      {
        name: "General Development",
        slug: "general",
        description: "Cross-language concepts, architecture, patterns, and performance",
      },
    ],
  },
  {
    name: "Accessibility",
    slug: "accessibility",
    description: "WCAG compliance, assistive technology, and inclusive design",
    color: "#10B981",
    children: [
      {
        name: "Standards & Guidelines",
        slug: "standards",
        description: "WCAG, ARIA, color contrast, and screen-reader compatibility",
      },
      {
        name: "Inclusive Design",
        slug: "inclusive-design",
        description: "Inclusive UX principles, keyboard navigation, and cognitive accessibility",
      },
    ],
  },
  {
    name: "Tools & Utilities",
    slug: "tools",
    description: "Interactive developer tools and productivity utilities",
    color: "#F59E0B",
    children: [
      {
        name: "CSS Tools",
        slug: "css-tools",
        description: "Visual generators and playgrounds for CSS properties and layout",
      },
      {
        name: "Code Tools",
        slug: "code-tools",
        description: "Developer productivity utilities",
      },
      {
        name: "Text Tools",
        slug: "text-tools",
        description: "Text analysis and transformation utilities",
      },
    ],
  },
  {
    name: "Networking & Security",
    slug: "networking-security",
    description: "Network fundamentals, cybersecurity, and online privacy",
    color: "#8B5CF6",
    children: [
      {
        name: "Privacy",
        slug: "privacy",
        description: "Online privacy, VPN limitations, and data protection",
      },
    ],
  },
];

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
