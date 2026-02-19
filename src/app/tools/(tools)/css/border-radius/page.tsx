import BorderRadius from "./BorderRadius";
import type { Metadata } from "next";
import Breadcrumb from "@/components/custom/Breadcrumb";
import RelatedSection from "@/components/custom/RelatedSection";
import { getToolRelatedContent } from "@/lib/content";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Border Radius Generator",
  description:
    "Interactive tool to generate CSS border radius values and see the result in real-time.",
  alternates: {
    canonical: "/tools/css/border-radius",
  },
  openGraph: {
    title: "Border Radius Generator",
    description:
      "Interactive tool to generate CSS border radius values and see the result in real-time.",
    type: "website",
  },
};

export default async function BorderRadiusPage() {
  const tool = getToolBySlug("/tools/css/border-radius");
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
    : [{ name: "Tools", href: "/tools" }, { name: "Border Radius Generator" }];

  return (
    <>
      <Breadcrumb path={breadcrumbPath} />
      <BorderRadius />
      <RelatedSection
        items={relatedContent}
        placeholder="Related content will be added soon."
      />
    </>
  );
}
