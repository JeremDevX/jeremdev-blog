import BoxSahdow from "./BoxShadow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechHowlerX - Box Shadow Tool",
  description:
    "Interactive tool to generate CSS box shadow values and see the result in real-time.",
};

export default function BoxShadowPage() {
  return (
    <>
      <BoxSahdow />
    </>
  );
}
