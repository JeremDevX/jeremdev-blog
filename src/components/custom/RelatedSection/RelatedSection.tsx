import ContentCard from "@/components/custom/ContentCard";
import type { RelatedContentItem } from "@/types/content";
import styles from "./RelatedSection.module.scss";

export interface RelatedSectionProps {
  items?: RelatedContentItem[] | null;
  headingLevel?: "h2" | "h3";
  placeholder?: string;
}

function isValidRelatedItem(
  item: RelatedContentItem | null | undefined,
): item is RelatedContentItem {
  return Boolean(
    item &&
      (item.type === "article" || item.type === "tool") &&
      typeof item.title === "string" &&
      item.title.trim().length > 0 &&
      typeof item.description === "string" &&
      item.description.trim().length > 0 &&
      typeof item.href === "string" &&
      item.href.trim().length > 0,
  );
}

export default function RelatedSection({
  items,
  headingLevel = "h2",
  placeholder,
}: RelatedSectionProps) {
  const relatedItems = (items ?? []).filter(isValidRelatedItem).slice(0, 4);
  const HeadingTag = headingLevel;

  if (relatedItems.length < 2) {
    if (!placeholder) {
      return null;
    }

    return (
      <section className={styles.section} aria-labelledby="related-content-heading">
        <HeadingTag id="related-content-heading" className={styles.heading}>
          Related
        </HeadingTag>
        <p className={styles.placeholder}>{placeholder}</p>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-labelledby="related-content-heading">
      <HeadingTag id="related-content-heading" className={styles.heading}>
        Related
      </HeadingTag>
      <div className={styles.grid}>
        {relatedItems.map((item) => (
          <ContentCard
            key={`${item.type}-${item.href}`}
            type={item.type}
            title={item.title}
            description={item.description}
            href={item.href}
            date={item.date}
            category={item.category}
            coverImage={item.coverImage}
          />
        ))}
      </div>
    </section>
  );
}
