import type { Metadata } from "next";
import Breadcrumb from "@/components/custom/Breadcrumb";
import RelatedSection from "@/components/custom/RelatedSection";
import { getToolRelatedContent } from "@/lib/content";
import { getToolBySlug } from "@/lib/tools";
import AriaSemanticChecker from "./AriaSemanticChecker";

export const metadata: Metadata = {
  title: "ARIA & Semantic Checker",
  description:
    "Analyze HTML snippets for common ARIA and semantic accessibility issues such as missing labels, duplicate IDs, and heading skips.",
  alternates: {
    canonical: "/tools/accessibility/aria-semantic-checker",
  },
  openGraph: {
    title: "ARIA & Semantic Checker",
    description:
      "Analyze HTML snippets for common ARIA and semantic accessibility issues such as missing labels, duplicate IDs, and heading skips.",
    type: "website",
  },
};

export default async function AriaSemanticCheckerPage() {
  const tool = getToolBySlug("/tools/accessibility/aria-semantic-checker");
  const relatedContent = await getToolRelatedContent(tool?.relatedArticles);
  const breadcrumbPath = tool
    ? [
        { name: "Tools", href: "/tools" },
        {
          name: tool.category,
          href: `/tools#category-${tool.category
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
        },
        { name: tool.name },
      ]
    : [
        { name: "Tools", href: "/tools" },
        { name: "ARIA & Semantic Checker" },
      ];

  return (
    <>
      <Breadcrumb path={breadcrumbPath} />
      <AriaSemanticChecker />
      <RelatedSection
        items={relatedContent}
        placeholder="Related content will be added soon."
      />
    </>
  );
}
