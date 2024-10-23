"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Tool {
  name: string;
  url: string;
}

interface AsideToolsListProps {
  category: string;
}

export default function AsideToolsList({ category }: AsideToolsListProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [displayed, setDisplayed] = useState(false);

  const chevronStyle = {
    transform: !displayed ? "rotate(-180deg)" : "rotate(0deg)",
    transition: "transform 1s ease",
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
    <div className="flex flex-col mt-2">
      <div className="flex justify-between font-semibold my-4">
        <span>{category}</span>
        <span>
          <ChevronDown
            className="cursor-pointer"
            onClick={fetchToolsByCategory}
            style={chevronStyle}
          />
        </span>
      </div>
      <div
        className={`
          overflow-hidden transition-[max-height] duration-700 ease-in-out
          ${displayed ? "max-h-96" : "max-h-0"}
        `}
      >
        <div className="flex flex-col gap-4 text-sm font-semibold">
          {tools.map((tool) => (
            <a
              href={tool.url}
              key={tool.name}
              className="hover:underline underline-offset-4 hover:text-primary"
            >
              {tool.name}
            </a>
          ))}
        </div>
      </div>
      <span
        className={`w-full border-b-2 border-secondary ${!displayed ? "-mt-2" : "mt-2"}`}
      ></span>
    </div>
  );
}
