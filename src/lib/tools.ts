import type { ToolMeta, ToolCategory } from "@/types/tools";

const CATEGORY_ORDER = ["Accessibility", "CSS", "Development", "Content"];

const TOOLS: ToolMeta[] = [
  {
    name: "Contrast Checker",
    slug: "/tools/accessibility/contrast-checker",
    description:
      "Check the contrast ratio between two colors and verify WCAG compliance.",
    category: "Accessibility",
    icon: "Contrast",
    taxonomyPaths: ["accessibility/standards/color-contrast", "tools"],
  },
  {
    name: "Border Radius Generator",
    slug: "/tools/css/border-radius",
    description:
      "Generate CSS border-radius values with a visual live preview.",
    category: "CSS",
    icon: "Squircle",
    taxonomyPaths: ["tools/css-tools/border-radius"],
  },
  {
    name: "Box Shadow Generator",
    slug: "/tools/css/box-shadow",
    description:
      "Generate CSS box-shadow values with controls for offset, blur, spread, and color.",
    category: "CSS",
    icon: "Layers2",
    taxonomyPaths: ["tools/css-tools/box-shadow"],
  },
  {
    name: "Flexbox Playground",
    slug: "/tools/css/flexbox-playground",
    description:
      "Simulate and generate Flexbox layouts with live controls for container and item properties.",
    category: "CSS",
    icon: "Rows3",
    taxonomyPaths: ["tools/css-tools/flexbox-playground"],
  },
  {
    name: "Slug Generator",
    slug: "/tools/code/slug-generator",
    description: "Generate URL-friendly slugs from any text input.",
    category: "Development",
    icon: "Link",
    taxonomyPaths: ["tools/code-tools/slug-generator"],
  },
  {
    name: "Word Counter",
    slug: "/tools/text/word-counter",
    description:
      "Count words and characters with platform-specific length recommendations.",
    category: "Content",
    icon: "Text",
    taxonomyPaths: ["tools/text-tools/word-counter"],
  },
];

export function getAllTools(): ToolMeta[] {
  return TOOLS;
}

export function getToolsByCategory(): ToolCategory[] {
  const grouped = new Map<string, ToolMeta[]>();

  for (const tool of TOOLS) {
    const existing = grouped.get(tool.category) || [];
    existing.push(tool);
    grouped.set(tool.category, existing);
  }

  return CATEGORY_ORDER.filter((cat) => grouped.has(cat)).map((cat) => ({
    name: cat,
    tools: grouped.get(cat)!,
  }));
}

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByTaxonomyPath(taxonomyPath: string): ToolMeta[] {
  if (!taxonomyPath) return [];

  return TOOLS.filter((tool) =>
    tool.taxonomyPaths.some(
      (assignedPath) =>
        assignedPath === taxonomyPath ||
        assignedPath.startsWith(`${taxonomyPath}/`),
    ),
  );
}
