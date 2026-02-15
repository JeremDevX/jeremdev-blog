import { NextResponse } from "next/server";
import { getToolsByCategory } from "@/lib/tools";
import type { ToolMeta } from "@/types/tools";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const toolName = searchParams.get("name");

  const categories = getToolsByCategory();

  // If a tool name is provided in the query, search for the specific tool by partial match
  if (toolName && toolName.length >= 3) {
    const foundTools: { name: string; url: string; desc: string; icon: string }[] = [];
    for (const category of categories) {
      for (const tool of category.tools) {
        if (tool.name.toLowerCase().includes(toolName.toLowerCase())) {
          foundTools.push({
            name: tool.name,
            url: tool.slug,
            desc: tool.description,
            icon: tool.icon,
          });
        }
      }
    }

    if (foundTools.length > 0) {
      return NextResponse.json(foundTools, { status: 200 });
    } else {
      return NextResponse.json(
        { error: `No tools found matching "${toolName}".` },
        { status: 404 },
      );
    }
  }

  // Return all categories in the format the AsideToolsList expects
  const result = categories.map((cat) => ({
    name: cat.name,
    tools: cat.tools.map((tool: ToolMeta) => ({
      name: tool.name,
      url: tool.slug,
      desc: tool.description,
      icon: tool.icon,
    })),
  }));

  return NextResponse.json(result, { status: 200 });
}
