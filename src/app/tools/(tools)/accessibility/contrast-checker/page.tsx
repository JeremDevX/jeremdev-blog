import ContrastChecker from "./ContrastChecker";
import type { Metadata } from "next";
import Breadcrumb from "@/components/custom/Breadcrumb";
import RelatedSection from "@/components/custom/RelatedSection";
import { getToolRelatedContent } from "@/lib/content";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Contrast Checker",
  description:
    "Interactive tool to check the contrast ratio between two colors and see if it meets the WCAG standards.",
  alternates: {
    canonical: "/tools/accessibility/contrast-checker",
  },
  openGraph: {
    title: "Contrast Checker",
    description:
      "Interactive tool to check the contrast ratio between two colors and see if it meets the WCAG standards.",
    type: "website",
  },
};

export default async function ContrastCheckerPage() {
  const tool = getToolBySlug("/tools/accessibility/contrast-checker");
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
    : [{ name: "Tools", href: "/tools" }, { name: "Contrast Checker" }];

  return (
    <>
      <Breadcrumb path={breadcrumbPath} />
      <ContrastChecker />
      <RelatedSection
        items={relatedContent}
        placeholder="Related content will be added soon."
      />
    </>
  );
}
