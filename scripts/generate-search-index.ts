import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

interface SearchIndexEntry {
  title: string;
  slug: string;
  resume: string;
  category: string;
  type: "article" | "tool";
}

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

const TOOLS_FOR_INDEX: SearchIndexEntry[] = [
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

async function getArticlesForIndex(): Promise<SearchIndexEntry[]> {
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

async function main() {
  const articles = await getArticlesForIndex();
  const searchIndex: SearchIndexEntry[] = [...articles, ...TOOLS_FOR_INDEX];

  const outputPath = path.join(process.cwd(), "public/search-index.json");
  await fs.writeFile(outputPath, JSON.stringify(searchIndex, null, 2), "utf-8");

  console.log(
    `Generated search index with ${articles.length} articles and ${TOOLS_FOR_INDEX.length} tools`,
  );
}

main().catch((err) => {
  console.error("Failed to generate search index:", err);
  process.exit(1);
});
