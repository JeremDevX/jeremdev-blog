import ContrastChecker from "./ContrastChecker";
import type { Metadata } from "next";
import Breadcrumb from "@/components/custom/Breadcrumb";
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

export default function ContrastCheckerPage() {
  const tool = getToolBySlug("/tools/accessibility/contrast-checker");
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
    </>
  );
}
