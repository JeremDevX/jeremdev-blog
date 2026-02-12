import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type { Frontmatter, ArticleMeta, Article } from "@/types/content";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

const REQUIRED_FRONTMATTER_FIELDS: (keyof Frontmatter)[] = [
  "title",
  "slug",
  "date",
  "resume",
  "category",
  "published",
];

function validateFrontmatter(data: Record<string, unknown>, filePath: string): Frontmatter {
  for (const field of REQUIRED_FRONTMATTER_FIELDS) {
    if (data[field] === undefined || data[field] === null) {
      throw new Error(
        `Missing required frontmatter field "${field}" in ${filePath}`
      );
    }
  }

  // Validate field types match the Frontmatter interface
  if (typeof data.title !== "string") throw new Error(`Field "title" must be a string in ${filePath}`);
  if (typeof data.slug !== "string") throw new Error(`Field "slug" must be a string in ${filePath}`);
  if (typeof data.date !== "string") throw new Error(`Field "date" must be a string in ${filePath}`);
  if (typeof data.resume !== "string") throw new Error(`Field "resume" must be a string in ${filePath}`);
  if (typeof data.category !== "string") throw new Error(`Field "category" must be a string in ${filePath}`);
  if (typeof data.published !== "boolean") throw new Error(`Field "published" must be a boolean in ${filePath}`);

  if (data.coverImage !== undefined && typeof data.coverImage !== "string") {
    throw new Error(`Field "coverImage" must be a string in ${filePath}`);
  }
  if (data.featured !== undefined && typeof data.featured !== "boolean") {
    throw new Error(`Field "featured" must be a boolean in ${filePath}`);
  }
  if (data.relatedTools !== undefined && !Array.isArray(data.relatedTools)) {
    throw new Error(`Field "relatedTools" must be an array in ${filePath}`);
  }
  if (data.relatedArticles !== undefined && !Array.isArray(data.relatedArticles)) {
    throw new Error(`Field "relatedArticles" must be an array in ${filePath}`);
  }

  return data as unknown as Frontmatter;
}

function validateCrossReferences(
  articles: ArticleMeta[],
  allSlugs: Set<string>
): void {
  for (const article of articles) {
    if (article.relatedArticles) {
      for (const slug of article.relatedArticles) {
        if (!allSlugs.has(slug)) {
          console.warn(
            `[content] Invalid relatedArticles slug "${slug}" in article "${article.slug}"`
          );
        }
      }
    }
    // relatedTools validation skipped — tool catalog (src/lib/tools.ts)
    // does not exist yet. Enable validation in Story 2.4.
  }
}

// Module-level cache: prevents redundant filesystem reads within the same
// server request. Next.js creates a fresh module scope per request in dev,
// and at build time the cache lives for the duration of the build.
let cachedArticles: ArticleMeta[] | null = null;

async function readArticleFile(
  fileName: string
): Promise<{ meta: ArticleMeta; content: string } | null> {
  if (!fileName.endsWith(".mdx")) return null;

  const filePath = path.join(ARTICLES_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);

  const frontmatter = validateFrontmatter(data, filePath);

  return {
    meta: { ...frontmatter },
    content,
  };
}

export async function getAllArticles(): Promise<ArticleMeta[]> {
  if (cachedArticles) return cachedArticles;

  let files: string[];
  try {
    files = await fs.readdir(ARTICLES_DIR);
  } catch {
    return [];
  }

  const articles: ArticleMeta[] = [];

  for (const file of files) {
    const result = await readArticleFile(file);
    if (result && result.meta.published) {
      articles.push(result.meta);
    }
  }

  articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Validate cross-references
  const allSlugs = new Set(articles.map((a) => a.slug));
  validateCrossReferences(articles, allSlugs);

  cachedArticles = articles;
  return articles;
}

/** Clear the article cache. Exposed for testing. */
export function clearArticleCache(): void {
  cachedArticles = null;
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | undefined> {
  let files: string[];
  try {
    files = await fs.readdir(ARTICLES_DIR);
  } catch {
    return undefined;
  }

  for (const file of files) {
    const result = await readArticleFile(file);
    if (result && result.meta.slug === slug && result.meta.published) {
      return { ...result.meta, content: result.content };
    }
  }

  return undefined;
}

export async function getArticlesByCategory(
  categoryPath: string
): Promise<ArticleMeta[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter((a) => a.category.startsWith(categoryPath));
}

export async function getFeaturedArticles(): Promise<ArticleMeta[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter((a) => a.featured === true);
}

export async function getLatestArticles(count = 6): Promise<ArticleMeta[]> {
  const allArticles = await getAllArticles();
  return allArticles.slice(0, count);
}
