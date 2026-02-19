import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type {
  Frontmatter,
  ArticleMeta,
  Article,
  RelatedContentItem,
} from "@/types/content";
import { findTaxonomyNode } from "@/lib/taxonomy";
import type { ToolMeta } from "@/types/tools";
import { getAllTools, getToolBySlug } from "@/lib/tools";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

const REQUIRED_FRONTMATTER_FIELDS: (keyof Frontmatter)[] = [
  "title",
  "slug",
  "date",
  "resume",
  "category",
  "published",
];

const ISO_DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATETIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;

function isValidIsoDate(value: string): boolean {
  const matchesIsoFormat =
    ISO_DATE_ONLY_REGEX.test(value) || ISO_DATETIME_REGEX.test(value);
  if (!matchesIsoFormat) return false;
  return !Number.isNaN(new Date(value).getTime());
}

function getToolSlugAliases(): Set<string> {
  const aliases = new Set<string>();

  for (const tool of getAllTools()) {
    aliases.add(tool.slug);
    const leafSlug = tool.slug.split("/").filter(Boolean).at(-1);
    if (leafSlug) aliases.add(leafSlug);
  }

  return aliases;
}

const TOOL_SLUG_ALIASES = getToolSlugAliases();

function resolveToolSlugAlias(toolSlug: string): string {
  if (toolSlug.startsWith("/tools/")) {
    return toolSlug;
  }

  const normalizedToolSlug = toolSlug.replace(/^\/+/, "");
  const prefixedSlug = `/tools/${normalizedToolSlug}`;
  if (getToolBySlug(prefixedSlug)) {
    return prefixedSlug;
  }

  const aliasMatch = getAllTools().find((tool) => {
    const leafSlug = tool.slug.split("/").filter(Boolean).at(-1);
    return leafSlug === normalizedToolSlug;
  });

  return aliasMatch?.slug ?? toolSlug;
}

export function resolveRelatedTools(relatedTools?: string[]): ToolMeta[] {
  if (!relatedTools?.length) {
    return [];
  }

  const resolvedTools: ToolMeta[] = [];
  const seenTools = new Set<string>();

  for (const relatedToolSlug of relatedTools) {
    const tool = getToolBySlug(resolveToolSlugAlias(relatedToolSlug));
    if (!tool || seenTools.has(tool.slug)) {
      continue;
    }

    seenTools.add(tool.slug);
    resolvedTools.push(tool);
  }

  return resolvedTools;
}

function toRelatedArticleItem(article: ArticleMeta): RelatedContentItem {
  return {
    type: "article",
    title: article.title,
    description: article.resume,
    href: `/blog/posts/${article.slug}`,
    date: article.date,
    category: article.category,
    coverImage: article.coverImage,
  };
}

function toRelatedToolItem(tool: ToolMeta): RelatedContentItem {
  return {
    type: "tool",
    title: tool.name,
    description: tool.description,
    href: tool.slug,
    category: tool.category,
  };
}

interface ResolveRelatedContentItemsInput {
  relatedArticles?: string[];
  relatedTools?: string[];
  articleIndex: Map<string, ArticleMeta>;
  excludeArticleSlug?: string;
  limit?: number;
}

export function resolveRelatedContentItems({
  relatedArticles,
  relatedTools,
  articleIndex,
  excludeArticleSlug,
  limit = 4,
}: ResolveRelatedContentItemsInput): RelatedContentItem[] {
  const maxItems = Math.max(0, limit);
  if (maxItems === 0) {
    return [];
  }

  const items: RelatedContentItem[] = [];
  const seenHrefs = new Set<string>();

  if (relatedArticles?.length) {
    for (const articleSlug of relatedArticles) {
      if (articleSlug === excludeArticleSlug) {
        continue;
      }

      const article = articleIndex.get(articleSlug);
      if (!article) {
        continue;
      }

      const href = `/blog/posts/${article.slug}`;
      if (seenHrefs.has(href)) {
        continue;
      }

      seenHrefs.add(href);
      items.push(toRelatedArticleItem(article));

      if (items.length >= maxItems) {
        return items;
      }
    }
  }

  if (relatedTools?.length) {
    for (const tool of resolveRelatedTools(relatedTools)) {
      if (seenHrefs.has(tool.slug)) {
        continue;
      }

      seenHrefs.add(tool.slug);
      items.push(toRelatedToolItem(tool));

      if (items.length >= maxItems) {
        break;
      }
    }
  }

  return items;
}

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

  if (!isValidIsoDate(data.date)) {
    throw new Error(`Field "date" must be a valid ISO date string in ${filePath}`);
  }

  if (!findTaxonomyNode(data.category)) {
    throw new Error(
      `Field "category" must reference an existing taxonomy path in ${filePath}`
    );
  }

  if (data.coverImage !== undefined && typeof data.coverImage !== "string") {
    throw new Error(`Field "coverImage" must be a string in ${filePath}`);
  }
  if (data.featured !== undefined && typeof data.featured !== "boolean") {
    throw new Error(`Field "featured" must be a boolean in ${filePath}`);
  }
  if (
    data.relatedTools !== undefined &&
    (!Array.isArray(data.relatedTools) ||
      data.relatedTools.some((toolSlug) => typeof toolSlug !== "string"))
  ) {
    throw new Error(`Field "relatedTools" must be a string[] in ${filePath}`);
  }
  if (
    data.relatedArticles !== undefined &&
    (!Array.isArray(data.relatedArticles) ||
      data.relatedArticles.some((articleSlug) => typeof articleSlug !== "string"))
  ) {
    throw new Error(`Field "relatedArticles" must be a string[] in ${filePath}`);
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

    if (article.relatedTools) {
      for (const toolSlug of article.relatedTools) {
        if (!TOOL_SLUG_ALIASES.has(toolSlug)) {
          console.warn(
            `[content] Invalid relatedTools slug "${toolSlug}" in article "${article.slug}"`
          );
        }
      }
    }
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
      const allArticles = await getAllArticles();
      const articleIndex = new Map(
        allArticles.map((articleMeta) => [articleMeta.slug, articleMeta]),
      );

      return {
        ...result.meta,
        content: result.content,
        resolvedRelatedTools: resolveRelatedTools(result.meta.relatedTools),
        resolvedRelatedContent: resolveRelatedContentItems({
          relatedArticles: result.meta.relatedArticles,
          relatedTools: result.meta.relatedTools,
          articleIndex,
          excludeArticleSlug: result.meta.slug,
        }),
      };
    }
  }

  return undefined;
}

export async function getToolRelatedContent(
  relatedArticles?: string[],
): Promise<RelatedContentItem[]> {
  if (!relatedArticles?.length) {
    return [];
  }

  const allArticles = await getAllArticles();
  const articleIndex = new Map(
    allArticles.map((articleMeta) => [articleMeta.slug, articleMeta]),
  );

  return resolveRelatedContentItems({
    relatedArticles,
    articleIndex,
  });
}

export async function getArticlesByCategory(
  categoryPath: string
): Promise<ArticleMeta[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter(
    (a) =>
      a.category === categoryPath || a.category.startsWith(`${categoryPath}/`)
  );
}

export async function getFeaturedArticles(): Promise<ArticleMeta[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter((a) => a.featured === true);
}

export async function getLatestArticles(count = 6): Promise<ArticleMeta[]> {
  const allArticles = await getAllArticles();
  return allArticles.slice(0, count);
}
