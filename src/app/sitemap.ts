import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";
import { getAllTools } from "@/lib/tools";
import { taxonomyTree } from "@/lib/taxonomy";
import type { TaxonomyNode } from "@/types/taxonomy";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techhowlerx.com";

function collectTaxonomyPaths(
  nodes: TaxonomyNode[],
  parentPath = "",
): string[] {
  const paths: string[] = [];
  for (const node of nodes) {
    const currentPath = parentPath ? `${parentPath}/${node.slug}` : node.slug;
    paths.push(currentPath);
    if (node.children?.length) {
      paths.push(...collectTaxonomyPaths(node.children, currentPath));
    }
  }
  return paths;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();
  const tools = getAllTools();
  const taxonomyPaths = collectTaxonomyPaths(taxonomyTree);
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/topics`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/termsofuse`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/blog/posts/${article.slug}`,
    lastModified: article.date,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const taxonomyPages: MetadataRoute.Sitemap = taxonomyPaths.map((path) => ({
    url: `${siteUrl}/topics/${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages, ...toolPages, ...taxonomyPages];
}
