export interface Frontmatter {
  title: string;
  slug: string;
  date: string; // ISO 8601
  resume: string;
  category: string; // taxonomy path e.g. "programming/css/visual-effects"
  coverImage?: string;
  relatedTools?: string[];
  relatedArticles?: string[];
  featured?: boolean;
  published: boolean;
}

export interface ArticleMeta extends Frontmatter {
  // Parsed frontmatter, used in listings/cards
}

export interface Article extends ArticleMeta {
  content: string; // raw MDX source (to be passed to compileMDX())
}
