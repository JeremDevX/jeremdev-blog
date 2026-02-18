import BorderRadius from "./BorderRadius";
import type { Metadata } from "next";
import Breadcrumb from "@/components/custom/Breadcrumb";
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

export default function BorderRadiusPage() {
  const tool = getToolBySlug("/tools/css/border-radius");
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
    </>
  );
}
