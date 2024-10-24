import ContrastChecker from "./ContrastChecker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechHowlerX - Accessibility Contrast Checker Tool",
  description:
    "Interactive tool to check the contrast ratio between two colors and see if it meets the WCAG standards.",
};
export default function ContrastCheckerPage() {
  return (
    <>
      <ContrastChecker />
    </>
  );
}
