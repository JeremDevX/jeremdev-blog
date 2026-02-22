import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import type { ComponentType } from "react";
import type { MDXProps } from "mdx/types";
import Breadcrumb from "@/components/custom/Breadcrumb";
import BridgeCallout from "@/components/custom/BridgeCallout";
import RelatedSection from "@/components/custom/RelatedSection";
import { getAllArticles, getArticleBySlug } from "@/lib/content";
import { compileMDX } from "@/lib/mdx";
import { getTaxonomyBreadcrumb, getTaxonomyDisplayLabel } from "@/lib/taxonomy";
import { formatDate } from "@/lib/utils";
import styles from "./ArticlePage.module.scss";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.resume,
    alternates: {
      canonical: `/blog/posts/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.resume,
      type: "article",
      publishedTime: article.date,
      ...(article.coverImage ? { images: [article.coverImage] } : {}),
    },
  };
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  let MDXContent: ComponentType<MDXProps> | null = null;
  try {
    MDXContent = await compileMDX(article.content);
  } catch (error) {
    console.error(`Failed to compile MDX for "${article.slug}":`, error);
  }

  const taxonomyBreadcrumb = getTaxonomyBreadcrumb(article.category);
  const breadcrumbPath = [
    ...taxonomyBreadcrumb.map((crumb, index) => ({
      name: crumb.name,
      href: `/topics/${taxonomyBreadcrumb
        .slice(0, index + 1)
        .map((item) => item.slug)
        .join("/")}`,
    })),
    { name: article.title },
  ];
  const firstRelatedTool = article.resolvedRelatedTools?.[0];

  return (
    <article className={styles.container}>
      <Breadcrumb path={breadcrumbPath} />

      <header>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span aria-hidden="true">·</span>
          <span className={styles.category}>
            {getTaxonomyDisplayLabel(article.category)}
          </span>
        </div>
      </header>

      {article.coverImage && (
        <Image
          src={article.coverImage}
          alt={article.title}
          width={1200}
          height={630}
          priority
          className={styles.coverImage}
        />
      )}

      <div className={styles.content}>
        {MDXContent ? (
          <MDXContent />
        ) : (
          <p className={styles.renderError}>
            This article could not be rendered. Please try again later.
          </p>
        )}
      </div>

      {firstRelatedTool ? <BridgeCallout tool={firstRelatedTool} /> : null}
      <RelatedSection items={article.resolvedRelatedContent} />
    </article>
  );
}
