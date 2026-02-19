import BoxShadow from "./BoxShadow";
import type { Metadata } from "next";
import Breadcrumb from "@/components/custom/Breadcrumb";
import RelatedSection from "@/components/custom/RelatedSection";
import { getToolRelatedContent } from "@/lib/content";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Box Shadow Generator",
  description:
    "Interactive tool to generate CSS box shadow values and see the result in real-time.",
  alternates: {
    canonical: "/tools/css/box-shadow",
  },
  openGraph: {
    title: "Box Shadow Generator",
    description:
      "Interactive tool to generate CSS box shadow values and see the result in real-time.",
    type: "website",
  },
};

export default async function BoxShadowPage() {
  const tool = getToolBySlug("/tools/css/box-shadow");
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
    : [{ name: "Tools", href: "/tools" }, { name: "Box Shadow Generator" }];

  return (
    <>
      <Breadcrumb path={breadcrumbPath} />
      <BoxShadow />
      <RelatedSection
        items={relatedContent}
        placeholder="Related content will be added soon."
      />
    </>
  );
}
