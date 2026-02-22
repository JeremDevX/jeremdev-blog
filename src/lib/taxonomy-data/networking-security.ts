import type { BigTopic } from "@/types/taxonomy";

export const networkingSecurityTaxonomy: BigTopic = {
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
};
