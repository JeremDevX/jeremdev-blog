"use client";
import { ArrowUpToLine } from "lucide-react";
export default function ArrowTopOfPage() {
  return (
    <a
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="my-4 font-semibold cursor-pointer p-2 rounded-lg bg-secondary w-fit h-12 hover:bg-primary hover:text-primary-foreground hover:drop-shadow-light flex items-center"
    >
      Back to Top
      <ArrowUpToLine size={36} className="" />
    </a>
  );
}
