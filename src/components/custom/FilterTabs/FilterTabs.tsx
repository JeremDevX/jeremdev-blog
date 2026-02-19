"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
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
  tabPanelId?: string;
  idPrefix?: string;
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
  tabPanelId,
  idPrefix = "filter-tabs",
}: FilterTabsProps<T>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activeFilter, setActiveFilter] = useState<FilterTabsFilter>(() =>
    resolveFilterParam(new URLSearchParams(searchParams.toString())),
  );
  const tabRefs = useRef<Record<FilterTabsFilter, HTMLButtonElement | null>>({
    all: null,
    articles: null,
    tools: null,
  });
  const orderedFilters: FilterTabsFilter[] = ["all", "articles", "tools"];

  const getTabId = (filter: FilterTabsFilter) => `${idPrefix}-tab-${filter}`;

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

  const activateFilter = (
    nextFilter: FilterTabsFilter,
    options?: { focusTab?: boolean },
  ) => {
    setActiveFilter(nextFilter);
    updateUrlParam(nextFilter);
    if (options?.focusTab) {
      requestAnimationFrame(() => {
        tabRefs.current[nextFilter]?.focus();
      });
    }
  };

  const handleFilterClick = (nextFilter: FilterTabsFilter) => {
    activateFilter(nextFilter);
  };

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentFilter: FilterTabsFilter,
  ) => {
    const currentIndex = orderedFilters.indexOf(currentFilter);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % orderedFilters.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + orderedFilters.length) % orderedFilters.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = orderedFilters.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    activateFilter(orderedFilters[nextIndex], { focusTab: true });
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
      ref={(element) => {
        tabRefs.current[filter] = element;
      }}
      id={getTabId(filter)}
      role="tab"
      aria-selected={activeFilter === filter}
      tabIndex={activeFilter === filter ? 0 : -1}
      aria-controls={tabPanelId}
      onClick={() => handleFilterClick(filter)}
      onKeyDown={(event) => handleTabKeyDown(event, filter)}
    >
      {label} ({count})
    </button>
  );

  return (
    <div
      className={styles.filterTabs}
      role="tablist"
      aria-label="Content filters"
      aria-orientation="horizontal"
    >
      {renderTab("All", "all", counts.all)}
      {renderTab("Articles", "articles", counts.articles)}
      {renderTab("Tools", "tools", counts.tools)}
    </div>
  );
}
