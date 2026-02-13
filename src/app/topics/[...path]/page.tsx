import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { taxonomyTree, findTaxonomyNode, getTaxonomyBreadcrumb } from "@/lib/taxonomy";
import { getArticlesByCategory } from "@/lib/content";
import { formatDate } from "@/lib/utils";
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
  const articles = await getArticlesByCategory(taxonomyPath);
  const children = node.children ?? [];

  return (
    <main className={styles.container}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <ol>
          <li>
            <Link href="/topics">Topics</Link>
          </li>
          {breadcrumb.map((crumb, index) => {
            const crumbPath = breadcrumb
              .slice(0, index + 1)
              .map((c) => c.slug)
              .join("/");
            const isLast = index === breadcrumb.length - 1;

            return (
              <li key={crumb.slug}>
                <span aria-hidden="true"> &gt; </span>
                {isLast ? (
                  <span aria-current="page">{crumb.name}</span>
                ) : (
                  <Link href={`/topics/${crumbPath}`}>{crumb.name}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

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

      <section className={styles.articlesSection}>
        <h2 className={styles.sectionTitle}>Articles</h2>
        {articles.length > 0 ? (
          <div className={styles.articlesGrid}>
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/posts/${article.slug}`}
                className={styles.articleCard}
              >
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <time className={styles.articleDate} dateTime={article.date}>
                  {formatDate(article.date)}
                </time>
                <p className={styles.articleResume}>{article.resume}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>No articles in this topic yet.</p>
        )}
      </section>
    </main>
  );
}
