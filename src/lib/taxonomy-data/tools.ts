import type { BigTopic } from "@/types/taxonomy";

export const toolsTaxonomy: BigTopic = {
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
};
