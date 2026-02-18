import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  taxonomyTree,
  findTaxonomyNode,
  getTaxonomyBreadcrumb,
} from "@/lib/taxonomy";
import { getArticlesByCategory } from "@/lib/content";
import { getToolsByTaxonomyPath } from "@/lib/tools";
import Breadcrumb from "@/components/custom/Breadcrumb";
import TaxonomyContent from "./TaxonomyContent";
import type { TaxonomyNode } from "@/types/taxonomy";
import styles from "./TaxonomyPage.module.scss";

type Props = {
  params: Promise<{ path: string[] }>;
};

export function generateStaticParams() {
  const paths: { path: string[] }[] = [];

  function walk(nodes: TaxonomyNode[], prefix: string[]) {
    for (const node of nodes) {
      const current = [...prefix, node.slug];
      paths.push({ path: current });
      if (node.children) walk(node.children, current);
    }
  }

  walk(taxonomyTree, []);
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const taxonomyPath = path.join("/");
  const node = findTaxonomyNode(taxonomyPath);

  if (!node) {
    return { title: "Not Found" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techhowlerx.com";

  return {
    title: `${node.name} - TechHowlerX`,
    description: node.description,
    alternates: {
      canonical: `${siteUrl}/topics/${taxonomyPath}`,
    },
    openGraph: {
      title: node.name,
      description: node.description,
      url: `${siteUrl}/topics/${taxonomyPath}`,
      type: "website",
    },
  };
}

export default async function TaxonomyPage({ params }: Props) {
  const { path } = await params;
  const taxonomyPath = path.join("/");
  const node = findTaxonomyNode(taxonomyPath);

  if (!node) {
    notFound();
  }

  const breadcrumb = getTaxonomyBreadcrumb(taxonomyPath);
  const breadcrumbPath = [
    { name: "Topics", href: "/topics" },
    ...breadcrumb.map((crumb, index) => ({
      name: crumb.name,
      href: `/topics/${breadcrumb
        .slice(0, index + 1)
        .map((item) => item.slug)
        .join("/")}`,
    })),
  ];
  const articles = await getArticlesByCategory(taxonomyPath);
  const tools = getToolsByTaxonomyPath(taxonomyPath);
  const children = node.children ?? [];

  const contentItems = [
    ...articles.map((article) => ({
      type: "article" as const,
      title: article.title,
      description: article.resume,
      href: `/blog/posts/${article.slug}`,
      date: article.date,
      category: article.category,
      coverImage: article.coverImage,
    })),
    ...tools.map((tool) => ({
      type: "tool" as const,
      title: tool.name,
      description: tool.description,
      href: tool.slug,
      category: tool.category,
    })),
  ];

  return (
    <main className={styles.container}>
      <Breadcrumb path={breadcrumbPath} />

      <h1 className={styles.heading}>{node.name}</h1>
      <p className={styles.description}>{node.description}</p>

      {children.length > 0 && (
        <section className={styles.childrenSection}>
          <h2 className={styles.sectionTitle}>
            {path.length === 1 ? "Topics" : "Subtopics"}
          </h2>
          <div className={styles.childrenGrid}>
            {children.map((child) => (
              <Link
                key={child.slug}
                href={`/topics/${taxonomyPath}/${child.slug}`}
                className={styles.childCard}
              >
                <h3 className={styles.childName}>{child.name}</h3>
                <p className={styles.childDescription}>{child.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Content</h2>
        <Suspense fallback={<div />}>
          <TaxonomyContent items={contentItems} />
        </Suspense>
      </section>
    </main>
  );
}
