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
    <div className="tool-index__container">
      <h2 className="tool-index__category">{category.name} Tools</h2>
      <div className="tool-index__list">
        {category.tools.map((tool) => {
          const Icon = LucideIcons[tool.icon] as LucideIcon;
          return (
            <Link href={tool.url} className="tool-index__card" key={tool.name}>
              <h3 className="tool-index__tool-name">
                <Icon className="tool-index__icon" />
                {tool.name}
              </h3>
              <span className="tool-index__desc">{tool.desc}</span>
              <span className="tool-index__cta">Open tool</span>
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
    <section className="tool-index">
      <h1 className="tool-index__title">Dev Tools</h1>
      {fetchedToolsCategories.map((category) => (
        <ToolList key={category.name} category={category} />
      ))}
    </section>
  );
}
