import type { Metadata } from "next";
import Breadcrumb from "@/components/custom/Breadcrumb";
import RelatedSection from "@/components/custom/RelatedSection";
import { getToolRelatedContent } from "@/lib/content";
import { getToolBySlug } from "@/lib/tools";
import RegexTester from "./RegexTester";

export const metadata: Metadata = {
  title: "Regex Tester",
  description:
    "Test JavaScript regular expressions with flags, match groups, and replacement previews in a safe client-side UI.",
  alternates: {
    canonical: "/tools/code/regex-tester",
  },
  openGraph: {
    title: "Regex Tester",
    description:
      "Test JavaScript regular expressions with flags, match groups, and replacement previews in a safe client-side UI.",
    type: "website",
  },
};

export default async function RegexTesterPage() {
  const tool = getToolBySlug("/tools/code/regex-tester");
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
    : [{ name: "Tools", href: "/tools" }, { name: "Regex Tester" }];

  return (
    <>
      <Breadcrumb path={breadcrumbPath} />
      <RegexTester />
      <RelatedSection
        items={relatedContent}
        placeholder="Related content will be added soon."
      />
    </>
  );
}
