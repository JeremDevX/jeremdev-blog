import FlexboxPlayground from "./FlexboxPlayground";
import type { Metadata } from "next";
import Breadcrumb from "@/components/custom/Breadcrumb";
import RelatedSection from "@/components/custom/RelatedSection";
import { getToolRelatedContent } from "@/lib/content";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Flexbox Playground",
  description:
    "Interactive Flexbox simulator to configure container and item properties with a live preview and ready-to-copy CSS.",
  alternates: {
    canonical: "/tools/css/flexbox-playground",
  },
  openGraph: {
    title: "Flexbox Playground",
    description:
      "Interactive Flexbox simulator to configure container and item properties with a live preview and ready-to-copy CSS.",
    type: "website",
  },
};

export default async function FlexboxPlaygroundPage() {
  const tool = getToolBySlug("/tools/css/flexbox-playground");
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
    : [{ name: "Tools", href: "/tools" }, { name: "Flexbox Playground" }];

  return (
    <>
      <Breadcrumb path={breadcrumbPath} />
      <FlexboxPlayground />
      <RelatedSection
        items={relatedContent}
        placeholder="Related content will be added soon."
      />
    </>
  );
}
