"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { handleEnterKeyDown } from "@/utils/handleKeyDown";

export interface Category {
  tools: Tool[];
}

export interface Tool {
  name: string;
  url: string;
  desc: string;
  icon: string;
}

interface AsideToolsListProps {
  category: string;
}

export default function AsideToolsList({ category }: AsideToolsListProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [displayed, setDisplayed] = useState(false);

  const chevronStyle = {
    transform: !displayed ? "rotate(-180deg)" : "rotate(0deg)",
    transition: "transform 0.75s ease",
  };

  const fetchToolsByCategory = async () => {
    setDisplayed(!displayed);

    if (tools.length === 0) {
      const response = await fetch("/api/tools");
      const allCategories = await response.json();
      const selectedCategory = allCategories.find(
        (cat: { name: string }) => cat.name === category
      );

      if (selectedCategory && selectedCategory.tools) {
        setTools(selectedCategory.tools);
      }
    }
  };

  return (
    <div className="aside__tools">
      <div className="aside__tools-category semi-bold">
        <span>{category}</span>
        <span>
          <ChevronDown
            className="aside__tools-chevron"
            onClick={fetchToolsByCategory}
            style={chevronStyle}
            onKeyDown={(e) => handleEnterKeyDown(e, fetchToolsByCategory)}
            tabIndex={0}
          />
        </span>
      </div>
      <div
        className={`aside__tools-list semi-bold
          ${displayed ? "aside__tools-list--display" : "aside__tools-list--hidden"}
        `}
      >
        {tools.map((tool) => (
          <Link href={tool.url} key={tool.name} tabIndex={displayed ? 0 : -1}>
            {tool.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
