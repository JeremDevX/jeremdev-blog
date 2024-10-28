import path from "path";
import fs from "fs";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechHowlerX - Dev Tools",
  description:
    "Discover a wide range of utility tools like formatters, CSS utilities, and more.",
  keywords: "tech, programming, dev tools, utility tools",
};

export interface ToolsCategory {
  name: string;
  tools: {
    name: string;
    url: string;
    desc: string;
    icon: keyof typeof LucideIcons;
  }[];
}

function ToolList({ category }: { category: ToolsCategory }) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-semibold underline underline-offset-4 text-center mb-6">
        {category.name} Tools
      </h2>
      <div className="flex mt-2 flex-wrap gap-6 justify-center xl:px-16">
        {category.tools.map((tool) => {
          const Icon = LucideIcons[tool.icon] as LucideIcon;
          return (
            <Link
              href={tool.url}
              className="flex flex-col gap-2 bg-muted rounded-lg p-2 w-80 h-48 hover:scale-101 hover:drop-shadow-lighter"
              key={tool.name}
            >
              <span className="flex items-center justify-center gap-2 font-bold mx-auto bg-secondary px-2 py-1 rounded-lg text-base xs:text-lg">
                <Icon className="w-6 h-6" />
                {tool.name}
              </span>
              <span className="mt-2">{tool.desc}</span>
              <span className="mt-auto text-right font-semibold">
                Open tool
              </span>
            </Link>
          );
        })}
        {category.tools.length === 0 && <div>Work in progress</div>}
      </div>
    </div>
  );
}

export default function Tools() {
  const toolsFilePath = path.join(
    process.cwd(),
    "public",
    "data",
    "tools-list.json"
  );
  const toolsData = fs.readFileSync(toolsFilePath, "utf8");
  const fetchedToolsCategories: ToolsCategory[] =
    JSON.parse(toolsData).categories;

  return (
    <>
      <section className="mb-8 max-w-1440 w-full px-4">
        <h1 className="text-3xl font-bold px-2 text-center my-8">Dev Tools</h1>
        {fetchedToolsCategories.map((category) => (
          <ToolList key={category.name} category={category} />
        ))}
      </section>
    </>
  );
}
