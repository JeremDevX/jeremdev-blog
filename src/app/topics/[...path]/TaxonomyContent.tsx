"use client";

import { useState } from "react";
import FilterTabs, {
  type FilterTabsFilter,
} from "@/components/custom/FilterTabs";
import ContentCard from "@/components/custom/ContentCard";
import type { ContentCardProps } from "@/components/custom/ContentCard";
import styles from "./TaxonomyPage.module.scss";

type TaxonomyContentProps = {
  items: ContentCardProps[];
};

export default function TaxonomyContent({ items }: TaxonomyContentProps) {
  const [filteredItems, setFilteredItems] = useState(items);
  const [activeFilter, setActiveFilter] = useState<FilterTabsFilter>("all");

  const emptyMessage =
    activeFilter === "articles"
      ? "No articles in this topic yet."
      : activeFilter === "tools"
        ? "No tools in this topic yet."
        : "Nothing here yet - but something's brewing.";

  return (
    <>
      <FilterTabs
        items={items}
        onFilterChange={(filter, nextItems) => {
          setActiveFilter(filter);
          setFilteredItems(nextItems);
        }}
      />
      {filteredItems.length > 0 ? (
        <div className={styles.contentGrid}>
          {filteredItems.map((item) => (
            <ContentCard key={`${item.type}-${item.href}`} {...item} />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>{emptyMessage}</p>
      )}
    </>
  );
}
