import BorderRadius from "./BorderRadius";
import type { Metadata } from "next";

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
  return (
    <>
      <BorderRadius />
    </>
  );
}
