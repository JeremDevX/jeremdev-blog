import WordCounter from "./WordCounter";
import type { Metadata } from "next";
import Breadcrumb from "@/components/custom/Breadcrumb";
import RelatedSection from "@/components/custom/RelatedSection";
import { getToolRelatedContent } from "@/lib/content";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Word Counter",
  description:
    "Interactive tool to track word and character counts, helping you meet recommended content lengths for blogs, social media, and emails.",
  alternates: {
    canonical: "/tools/text/word-counter",
  },
  openGraph: {
    title: "Word Counter",
    description:
      "Interactive tool to track word and character counts, helping you meet recommended content lengths for blogs, social media, and emails.",
    type: "website",
  },
};

export default async function WordCounterPage() {
  const tool = getToolBySlug("/tools/text/word-counter");
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
    : [{ name: "Tools", href: "/tools" }, { name: "Word Counter" }];

  return (
    <>
      <Breadcrumb path={breadcrumbPath} />
      <WordCounter />
      <RelatedSection
        items={relatedContent}
        placeholder="Related content will be added soon."
      />
    </>
  );
}
