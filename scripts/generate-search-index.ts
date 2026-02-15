import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface SearchIndexEntry {
  title: string;
  slug: string;
  resume: string;
  category: string;
  type: "article" | "tool";
}

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export const TOOLS_FOR_INDEX: SearchIndexEntry[] = [
  {
    title: "Contrast Checker",
    slug: "/tools/accessibility/contrast-checker",
    resume:
      "Check the contrast ratio between two colors and verify WCAG compliance.",
    category: "Accessibility",
    type: "tool",
  },
  {
    title: "Border Radius Generator",
    slug: "/tools/css/border-radius",
    resume: "Generate CSS border-radius values with a visual live preview.",
    category: "CSS",
    type: "tool",
  },
  {
    title: "Box Shadow Generator",
    slug: "/tools/css/box-shadow",
    resume:
      "Generate CSS box-shadow values with controls for offset, blur, spread, and color.",
    category: "CSS",
    type: "tool",
  },
  {
    title: "Slug Generator",
    slug: "/tools/code/slug-generator",
    resume: "Generate URL-friendly slugs from any text input.",
    category: "Development",
    type: "tool",
  },
  {
    title: "Word Counter",
    slug: "/tools/text/word-counter",
    resume:
      "Count words and characters with platform-specific length recommendations.",
    category: "Content",
    type: "tool",
  },
];

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

export async function generateSearchIndex(): Promise<SearchIndexEntry[]> {
  const articles = await getArticlesForIndex();
  return [...articles, ...TOOLS_FOR_INDEX];
}

async function main() {
  const searchIndex = await generateSearchIndex();

  const outputPath = path.join(process.cwd(), "public/search-index.json");
  await fs.writeFile(outputPath, JSON.stringify(searchIndex, null, 2), "utf-8");

  const articleCount = searchIndex.filter((e) => e.type === "article").length;
  console.log(
    `Generated search index with ${articleCount} articles and ${TOOLS_FOR_INDEX.length} tools`,
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
