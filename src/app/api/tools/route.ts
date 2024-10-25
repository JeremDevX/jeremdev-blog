import path from "path";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { Category, Tool } from "@/components/custom/AsideToolsList";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const toolName = searchParams.get("name");

  try {
    const toolsFilePath = path.join(
      process.cwd(),
      "public",
      "data",
      "tools-list.json"
    );
    const toolsData = await fs.readFile(toolsFilePath, "utf8");

    // Check if JSON file is empty
    if (!toolsData) {
      return NextResponse.json(
        { error: "The tools-list.json file is empty." },
        { status: 500 }
      );
    }

    const fetchedToolsCategories = JSON.parse(toolsData).categories;

    // If a tool name is provided in the query, search for the specific tool by partial match
    if (toolName && toolName.length >= 3) {
      const foundTools = searchToolsByPartialName(
        fetchedToolsCategories,
        toolName
      );
      if (foundTools.length > 0) {
        return NextResponse.json(foundTools, { status: 200 });
      } else {
        return NextResponse.json(
          { error: `No tools found matching "${toolName}".` },
          { status: 404 }
        );
      }
    }

    // Return all categories if no tool name is specified or search term is too short
    return NextResponse.json(fetchedToolsCategories, { status: 200 });
  } catch (error) {
    console.error("Error reading the JSON file:", error);
    return NextResponse.json(
      { error: "Error reading the JSON file." },
      { status: 500 }
    );
  }
}

// Function to search for tools by partial name match

function searchToolsByPartialName(
  categories: Category[],
  toolName: string
): Tool[] {
  const matchingTools: Tool[] = [];
  for (const category of categories) {
    for (const tool of category.tools) {
      if (tool.name.toLowerCase().includes(toolName.toLowerCase())) {
        matchingTools.push(tool);
      }
    }
  }
  return matchingTools;
}
