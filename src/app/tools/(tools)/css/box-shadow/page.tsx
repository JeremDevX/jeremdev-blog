import BoxShadow from "./BoxShadow";
import type { Metadata } from "next";
import Breadcrumb from "@/components/custom/Breadcrumb";
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

export default function BoxShadowPage() {
  const tool = getToolBySlug("/tools/css/box-shadow");
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
    </>
  );
}
