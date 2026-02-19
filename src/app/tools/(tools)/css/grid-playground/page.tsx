import GridPlayground from "./GridPlayground";
import type { Metadata } from "next";
import Breadcrumb from "@/components/custom/Breadcrumb";
import RelatedSection from "@/components/custom/RelatedSection";
import { getToolRelatedContent } from "@/lib/content";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Grid Playground",
  description:
    "Interactive CSS Grid simulator to configure tracks, alignment, and item placement with a live preview and copy-ready CSS.",
  alternates: {
    canonical: "/tools/css/grid-playground",
  },
  openGraph: {
    title: "Grid Playground",
    description:
      "Interactive CSS Grid simulator to configure tracks, alignment, and item placement with a live preview and copy-ready CSS.",
    type: "website",
  },
};

export default async function GridPlaygroundPage() {
  const tool = getToolBySlug("/tools/css/grid-playground");
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
    : [{ name: "Tools", href: "/tools" }, { name: "Grid Playground" }];

  return (
    <>
      <Breadcrumb path={breadcrumbPath} />
      <GridPlayground />
      <RelatedSection
        items={relatedContent}
        placeholder="Related content will be added soon."
      />
    </>
  );
}
