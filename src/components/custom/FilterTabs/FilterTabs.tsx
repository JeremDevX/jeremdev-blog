"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import styles from "./FilterTabs.module.scss";

export type FilterTabsFilter = "all" | "articles" | "tools";

export type FilterTabsItem = {
  type: "article" | "tool";
};

type FilterTabsProps<T extends FilterTabsItem> = {
  items: T[];
  onFilterChange?: (filter: FilterTabsFilter, filteredItems: T[]) => void;
};

function resolveFilterParam(params: URLSearchParams): FilterTabsFilter {
  const filter = params.get("filter");
  if (filter === "articles" || filter === "tools") {
    return filter;
  }
  return "all";
}

function filterItems<T extends FilterTabsItem>(
  items: T[],
  filter: FilterTabsFilter,
): T[] {
  if (filter === "articles") {
    return items.filter((item) => item.type === "article");
  }
  if (filter === "tools") {
    return items.filter((item) => item.type === "tool");
  }
  return items;
}

export default function FilterTabs<T extends FilterTabsItem>({
  items,
  onFilterChange,
}: FilterTabsProps<T>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activeFilter, setActiveFilter] = useState<FilterTabsFilter>(() =>
    resolveFilterParam(new URLSearchParams(searchParams.toString())),
  );

  useEffect(() => {
    const nextFilter = resolveFilterParam(
      new URLSearchParams(searchParams.toString()),
    );
    setActiveFilter((prev) => (prev === nextFilter ? prev : nextFilter));
  }, [searchParams]);

  const counts = useMemo(
    () => ({
      all: items.length,
      articles: items.filter((item) => item.type === "article").length,
      tools: items.filter((item) => item.type === "tool").length,
    }),
    [items],
  );

  const filteredItems = useMemo(
    () => filterItems(items, activeFilter),
    [items, activeFilter],
  );

  const memoizedOnFilterChange = useCallback(
    (filter: FilterTabsFilter, items: T[]) => {
      onFilterChange?.(filter, items);
    },
    [onFilterChange],
  );

  useEffect(() => {
    memoizedOnFilterChange(activeFilter, filteredItems);
  }, [activeFilter, filteredItems, memoizedOnFilterChange]);

  const updateUrlParam = (nextFilter: FilterTabsFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextFilter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", nextFilter);
    }

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const handleFilterClick = (nextFilter: FilterTabsFilter) => {
    setActiveFilter(nextFilter);
    updateUrlParam(nextFilter);
  };

  const renderTab = (
    label: string,
    filter: FilterTabsFilter,
    count: number,
  ) => (
    <button
      key={filter}
      type="button"
      className={clsx(
        styles.tab,
        activeFilter === filter
          ? styles["tab--active"]
          : styles["tab--inactive"],
      )}
      aria-pressed={activeFilter === filter}
      onClick={() => handleFilterClick(filter)}
    >
      {label} ({count})
    </button>
  );

  return (
    <div
      className={styles.filterTabs}
      role="group"
      aria-label="Content filters"
    >
      {renderTab("All", "all", counts.all)}
      {renderTab("Articles", "articles", counts.articles)}
      {renderTab("Tools", "tools", counts.tools)}
    </div>
  );
}
