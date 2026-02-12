import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug } from "@/lib/content";
import { compileMDX } from "@/lib/mdx";
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
    title: `${article.title} - TechHowlerX`,
    description: article.resume,
    openGraph: {
      title: article.title,
      description: article.resume,
      type: "article",
      publishedTime: article.date,
      ...(article.coverImage ? { images: [article.coverImage] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const MDXContent = await compileMDX(article.content);

  return (
    <section className={styles.container}>
      <Link href="/blog" className={styles.backLink}>
        &larr; Back to blog
      </Link>

      <header>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span aria-hidden="true">·</span>
          <span className={styles.category}>{article.category}</span>
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
        <MDXContent />
      </div>
    </section>
  );
}
