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

function resolveInitialFilter(): FilterTabsFilter {
  if (typeof window === "undefined") return "all";

  const filter = new URLSearchParams(window.location.search).get("filter");
  if (filter === "articles" || filter === "tools") {
    return filter;
  }
  return "all";
}

function filterItemsByType(
  items: ContentCardProps[],
  filter: FilterTabsFilter,
): ContentCardProps[] {
  if (filter === "articles") {
    return items.filter((item) => item.type === "article");
  }
  if (filter === "tools") {
    return items.filter((item) => item.type === "tool");
  }
  return items;
}

export default function TaxonomyContent({ items }: TaxonomyContentProps) {
  const initialFilter = resolveInitialFilter();
  const [filteredItems, setFilteredItems] = useState(
    filterItemsByType(items, initialFilter),
  );
  const [activeFilter, setActiveFilter] = useState<FilterTabsFilter>(initialFilter);

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
