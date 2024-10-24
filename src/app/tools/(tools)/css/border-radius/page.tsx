import BorderRadius from "./BorderRadius";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechHowlerX - CSS Border Radius Tool",
  description:
    "Interactive tool to generate CSS border radius values and see the result in real-time.",
};

export default function BorderRadiusPage() {
  return (
    <>
      <BorderRadius />
    </>
  );
}
