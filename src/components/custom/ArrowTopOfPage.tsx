"use client";
import { ArrowUpToLine } from "lucide-react";
import Button from "./Button";
export default function ArrowTopOfPage() {
  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="arrow-top"
    >
      Back to Top
      <ArrowUpToLine size={36} className="arrow-top__icon" />
    </Button>
  );
}
