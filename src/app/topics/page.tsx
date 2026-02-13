import { Metadata } from "next";
import Link from "next/link";
import { taxonomyTree } from "@/lib/taxonomy";
import styles from "./TopicsPage.module.scss";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techhowlerx.com";

export const metadata: Metadata = {
  title: "Topics - TechHowlerX",
  description:
    "Browse articles organized by topic: Programming, Accessibility, Tools & Utilities, and more.",
  alternates: {
    canonical: `${siteUrl}/topics`,
  },
  openGraph: {
    title: "Topics",
    description:
      "Browse articles organized by topic: Programming, Accessibility, Tools & Utilities, and more.",
    url: `${siteUrl}/topics`,
    type: "website",
  },
};

export default function TopicsPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Topics</h1>
      <p className={styles.intro}>
        Explore articles and resources organized by topic.
      </p>

      <div className={styles.grid}>
        {taxonomyTree.map((bigTopic) => (
          <Link
            key={bigTopic.slug}
            href={`/topics/${bigTopic.slug}`}
            className={styles.card}
            style={{ borderColor: bigTopic.color }}
          >
            <span
              className={styles.accent}
              style={{ backgroundColor: bigTopic.color }}
            />
            <h2 className={styles.cardTitle}>{bigTopic.name}</h2>
            <p className={styles.cardDescription}>{bigTopic.description}</p>
            <span className={styles.topicCount}>
              {bigTopic.children?.length ?? 0} topics
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
