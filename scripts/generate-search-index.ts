import fs from "fs/promises";
import path from "path";
import { getAllArticles } from "../src/lib/content";
import { getAllTools } from "../src/lib/tools";

export interface SearchIndexEntry {
  title: string;
  slug: string;
  resume: string;
  category: string;
  type: "article" | "tool";
}

export async function getArticlesForIndex(): Promise<SearchIndexEntry[]> {
  const articles = await getAllArticles();

  return articles.map((article) => ({
    title: article.title,
    slug: `/blog/posts/${article.slug}`,
    resume: article.resume,
    category: article.category,
    type: "article",
  }));
}

export function getToolsForIndex(): SearchIndexEntry[] {
  return getAllTools().map((tool) => ({
    title: tool.name,
    slug: tool.slug,
    resume: tool.description,
    category: tool.category,
    type: "tool" as const,
  }));
}

export async function generateSearchIndex(): Promise<SearchIndexEntry[]> {
  const articles = await getArticlesForIndex();
  const tools = getToolsForIndex();
  return [...articles, ...tools];
}

async function main() {
  const searchIndex = await generateSearchIndex();

  const outputPath = path.join(process.cwd(), "public/search-index.json");
  await fs.writeFile(outputPath, JSON.stringify(searchIndex, null, 2), "utf-8");

  const articleCount = searchIndex.filter((e) => e.type === "article").length;
  const toolCount = searchIndex.filter((e) => e.type === "tool").length;
  console.log(
    `Generated search index with ${articleCount} articles and ${toolCount} tools`,
  );
}

// Only run when executed directly (not when imported by tests)
const isDirectRun =
  process.argv[1]?.endsWith("generate-search-index.ts") ||
  process.argv[1]?.endsWith("generate-search-index.js");

if (isDirectRun) {
  main().catch((err) => {
    console.error("Failed to generate search index:", err);
    process.exit(1);
  });
}
