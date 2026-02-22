import type { BigTopic } from "@/types/taxonomy";

export const programmingTaxonomy: BigTopic = {
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
    {
      name: "AI",
      slug: "ai",
      description: "AI-assisted development, prompting workflows, and applied AI tooling",
    },
  ],
};
