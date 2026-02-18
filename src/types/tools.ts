export interface ToolMeta {
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  taxonomyPaths: string[];
  relatedArticles?: string[];
}

export interface ToolCategory {
  name: string;
  tools: ToolMeta[];
}
