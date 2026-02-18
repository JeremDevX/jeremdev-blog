import { Metadata } from "next";
import SlugGenerator from "./SlugGenerator";
import Breadcrumb from "@/components/custom/Breadcrumb";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Slug Generator",
  description: "Generate a normalized slug for your URLs from a given text.",
  alternates: {
    canonical: "/tools/code/slug-generator",
  },
  openGraph: {
    title: "Slug Generator",
    description: "Generate a normalized slug for your URLs from a given text.",
    type: "website",
  },
};

export default function SlugGeneratorPage() {
  const tool = getToolBySlug("/tools/code/slug-generator");
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
    : [{ name: "Tools", href: "/tools" }, { name: "Slug Generator" }];

  return (
    <>
      <Breadcrumb path={breadcrumbPath} />
      <SlugGenerator />
    </>
  );
}
