import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { getAllTools } from "../src/lib/tools";

export interface SearchIndexEntry {
  title: string;
  slug: string;
  resume: string;
  category: string;
  type: "article" | "tool";
}

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

/**
 * Reads articles from the filesystem and returns search index entries.
 *
 * Note: This duplicates some logic from src/lib/content.ts (getAllArticles)
 * because tsx does not resolve tsconfig path aliases (@/), and content.ts
 * imports from @/types/content. If path alias support is added to the
 * build script runner, this should be replaced with a call to getAllArticles().
 */
export async function getArticlesForIndex(): Promise<SearchIndexEntry[]> {
  let files: string[];
  try {
    files = await fs.readdir(ARTICLES_DIR);
  } catch {
    console.warn("No articles directory found, skipping articles.");
    return [];
  }

  const entries: SearchIndexEntry[] = [];

  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;

    const filePath = path.join(ARTICLES_DIR, file);
    const raw = await fs.readFile(filePath, "utf-8");
    const { data } = matter(raw);

    if (!data.published) continue;

    entries.push({
      title: data.title,
      slug: `/blog/posts/${data.slug}`,
      resume: data.resume || "",
      category: data.category || "",
      type: "article",
    });
  }

  return entries;
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
