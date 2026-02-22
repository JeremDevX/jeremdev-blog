import type { BigTopic } from "@/types/taxonomy";

export const accessibilityTaxonomy: BigTopic = {
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
};
