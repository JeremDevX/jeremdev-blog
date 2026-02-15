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
  },
  {
    name: "Border Radius Generator",
    slug: "/tools/css/border-radius",
    description:
      "Generate CSS border-radius values with a visual live preview.",
    category: "CSS",
    icon: "Squircle",
  },
  {
    name: "Box Shadow Generator",
    slug: "/tools/css/box-shadow",
    description:
      "Generate CSS box-shadow values with controls for offset, blur, spread, and color.",
    category: "CSS",
    icon: "Layers2",
  },
  {
    name: "Slug Generator",
    slug: "/tools/code/slug-generator",
    description: "Generate URL-friendly slugs from any text input.",
    category: "Development",
    icon: "Link",
  },
  {
    name: "Word Counter",
    slug: "/tools/text/word-counter",
    description:
      "Count words and characters with platform-specific length recommendations.",
    category: "Content",
    icon: "Text",
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
