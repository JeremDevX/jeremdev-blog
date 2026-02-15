import type { ToolCategory } from "@/types/tools";
import ContentCard from "@/components/custom/ContentCard";
import styles from "./CategoryGroup.module.scss";

interface CategoryGroupProps {
  category: ToolCategory;
}

export default function CategoryGroup({ category }: CategoryGroupProps) {
  return (
    <section className={styles.section} aria-labelledby={`category-${category.name}`}>
      <h2 id={`category-${category.name}`} className={styles.heading}>
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
