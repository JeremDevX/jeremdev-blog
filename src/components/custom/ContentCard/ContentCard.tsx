import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import styles from "./ContentCard.module.scss";

export interface ContentCardProps {
  type: "article" | "tool";
  title: string;
  description: string;
  href: string;
  date?: string;
  category?: string;
  coverImage?: string;
}

export default function ContentCard({
  type,
  title,
  description,
  href,
  date,
  category,
  coverImage,
}: ContentCardProps) {
  return (
    <article className={styles.card}>
      <Link href={href} className={styles.link}>
        {coverImage && (
          <div className={styles.imageWrapper}>
            <Image
              src={coverImage}
              alt={`Cover image for ${title}`}
              width={600}
              height={340}
              className={styles.image}
            />
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.meta}>
            <span
              className={`${styles.badge} ${type === "article" ? styles.badgeArticle : styles.badgeTool}`}
            >
              {type === "article" ? "Article" : "Tool"}
            </span>
            {category && (
              <span className={styles.category}>{category}</span>
            )}
          </div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          {date && (
            <time className={styles.date} dateTime={date}>
              {formatDate(date)}
            </time>
          )}
        </div>
      </Link>
    </article>
  );
}
