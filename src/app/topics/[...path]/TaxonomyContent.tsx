"use client";

import { useState } from "react";
import FilterTabs from "@/components/custom/FilterTabs";
import ContentCard from "@/components/custom/ContentCard";
import type { ContentCardProps } from "@/components/custom/ContentCard";
import styles from "./TaxonomyPage.module.scss";

type TaxonomyContentProps = {
  items: ContentCardProps[];
};

export default function TaxonomyContent({ items }: TaxonomyContentProps) {
  const [filteredItems, setFilteredItems] = useState(items);

  return (
    <>
      <FilterTabs
        items={items}
        onFilterChange={(_filter, nextItems) => setFilteredItems(nextItems)}
      />
      {filteredItems.length > 0 ? (
        <div className={styles.contentGrid}>
          {filteredItems.map((item) => (
            <ContentCard key={`${item.type}-${item.href}`} {...item} />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>No content in this topic yet.</p>
      )}
    </>
  );
}
