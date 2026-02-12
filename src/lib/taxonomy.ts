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
        description: "Styling, layouts, animations, and visual effects",
        children: [
          { name: "Visual Effects", slug: "visual-effects", description: "Shadows, gradients, filters, and visual styling techniques" },
          { name: "Layout", slug: "layout", description: "Flexbox, Grid, and positioning strategies" },
          { name: "Responsive Design", slug: "responsive", description: "Media queries, fluid layouts, and mobile-first approaches" },
        ],
      },
      {
        name: "JavaScript & TypeScript",
        slug: "javascript-typescript",
        description: "Language features, patterns, and best practices",
        children: [
          { name: "Fundamentals", slug: "fundamentals", description: "Core concepts, syntax, and language features" },
          { name: "Frameworks", slug: "frameworks", description: "React, Next.js, and frontend frameworks" },
          { name: "Tooling", slug: "tooling", description: "Build tools, linters, and developer experience" },
        ],
      },
      {
        name: "General Development",
        slug: "general",
        description: "Cross-language concepts, architecture, and engineering practices",
        children: [
          { name: "Patterns", slug: "patterns", description: "Design patterns and architectural approaches" },
          { name: "Performance", slug: "performance", description: "Optimization techniques and best practices" },
        ],
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
        description: "WCAG, ARIA, and accessibility specifications",
        children: [
          { name: "Color & Contrast", slug: "color-contrast", description: "Color accessibility and contrast requirements" },
          { name: "Screen Readers", slug: "screen-readers", description: "Assistive technology compatibility" },
        ],
      },
      {
        name: "Inclusive Design",
        slug: "inclusive-design",
        description: "Design principles for diverse users",
        children: [
          { name: "Keyboard Navigation", slug: "keyboard-navigation", description: "Keyboard-only interaction patterns" },
          { name: "Cognitive Accessibility", slug: "cognitive", description: "Clarity, simplicity, and cognitive load" },
        ],
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
        description: "Visual generators for CSS properties",
        children: [
          { name: "Border Radius", slug: "border-radius", description: "Border radius generator and previewer" },
          { name: "Box Shadow", slug: "box-shadow", description: "Box shadow generator and previewer" },
        ],
      },
      {
        name: "Code Tools",
        slug: "code-tools",
        description: "Developer productivity utilities",
        children: [
          { name: "Slug Generator", slug: "slug-generator", description: "URL-friendly slug generator" },
        ],
      },
      {
        name: "Text Tools",
        slug: "text-tools",
        description: "Text analysis and transformation utilities",
        children: [
          { name: "Word Counter", slug: "word-counter", description: "Word and character counting tool" },
        ],
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
