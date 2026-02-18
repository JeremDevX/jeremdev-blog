import BoxShadow from "./BoxShadow";
import type { Metadata } from "next";

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
  return (
    <>
      <BoxShadow />
    </>
  );
}
