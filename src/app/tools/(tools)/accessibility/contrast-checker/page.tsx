import ContrastChecker from "./ContrastChecker";
import type { Metadata } from "next";

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
  return (
    <>
      <ContrastChecker />
    </>
  );
}
