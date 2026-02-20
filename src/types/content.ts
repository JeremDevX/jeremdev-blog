import type { ToolMeta } from "./tools";

export interface Frontmatter {
  title: string;
  slug: string;
  date: string; // ISO 8601
  resume: string;
  category: string; // taxonomy path e.g. "programming/css"
  coverImage?: string;
  relatedTools?: string[];
  relatedArticles?: string[];
  featured?: boolean;
  published: boolean;
}

export interface ArticleMeta extends Frontmatter {
  // Parsed frontmatter, used in listings/cards
}

export interface RelatedContentItem {
  type: "article" | "tool";
  title: string;
  description: string;
  href: string;
  date?: string;
  category?: string;
  coverImage?: string;
}

export interface Article extends ArticleMeta {
  content: string; // raw MDX source (to be passed to compileMDX())
  resolvedRelatedTools?: ToolMeta[];
  resolvedRelatedContent?: RelatedContentItem[];
}
