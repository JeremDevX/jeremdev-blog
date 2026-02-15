import type { ToolCategory } from "@/types/tools";
import ContentCard from "@/components/custom/ContentCard";
import styles from "./CategoryGroup.module.scss";

interface CategoryGroupProps {
  category: ToolCategory;
}

export default function CategoryGroup({ category }: CategoryGroupProps) {
  const categoryId = `category-${category.name.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section className={styles.section} aria-labelledby={categoryId}>
      <h2 id={categoryId} className={styles.heading}>
        {category.name}
      </h2>
      <div className={styles.grid}>
        {category.tools.map((tool) => (
          <ContentCard
            key={tool.slug}
            type="tool"
            title={tool.name}
            description={tool.description}
            href={tool.slug}
            category={tool.category}
          />
        ))}
      </div>
    </section>
  );
}
