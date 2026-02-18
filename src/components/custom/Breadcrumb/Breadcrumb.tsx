"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTaxonomyBreadcrumb } from "@/lib/taxonomy";
import { getToolBySlug } from "@/lib/tools";
import styles from "./Breadcrumb.module.scss";

export type BreadcrumbSegment = {
  name: string;
  href?: string;
};

type BreadcrumbProps = {
  path?: BreadcrumbSegment[];
  pathname?: string;
};

type InternalSegment = BreadcrumbSegment & {
  isEllipsis?: boolean;
};

function buildTaxonomySegments(pathname: string): BreadcrumbSegment[] {
  const taxonomyPath = pathname.replace(/^\/topics\/?/, "");
  if (!taxonomyPath) {
    return [{ name: "Topics", href: "/topics" }];
  }

  const nodes = getTaxonomyBreadcrumb(taxonomyPath);
  const segments = nodes.map((node, index) => ({
    name: node.name,
    href: `/topics/${nodes
      .slice(0, index + 1)
      .map((crumb) => crumb.slug)
      .join("/")}`,
  }));

  return [{ name: "Topics", href: "/topics" }, ...segments];
}

function buildToolSegments(pathname: string): BreadcrumbSegment[] {
  const tool = getToolBySlug(pathname);
  const base = { name: "Tools", href: "/tools" };

  if (!tool) {
    if (typeof window !== "undefined") {
      console.warn(`[Breadcrumb] Tool not found for path: ${pathname}`);
    }
    return [base];
  }

  const categoryId = `category-${tool.category
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  return [
    base,
    { name: tool.category, href: `/tools#${categoryId}` },
    { name: tool.name },
  ];
}

function buildSegmentsFromPathname(pathname: string): BreadcrumbSegment[] {
  if (pathname.startsWith("/topics")) {
    return buildTaxonomySegments(pathname);
  }

  if (pathname.startsWith("/tools")) {
    return buildToolSegments(pathname);
  }

  return [];
}

export default function Breadcrumb({ path, pathname }: BreadcrumbProps) {
  const currentPathname = usePathname();
  const resolvedPathname = pathname ?? currentPathname;

  const segments = useMemo(() => {
    if (path && path.length > 0) {
      return path;
    }
    if (!resolvedPathname) {
      return [];
    }
    return buildSegmentsFromPathname(resolvedPathname);
  }, [path, resolvedPathname]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const displaySegments = useMemo((): InternalSegment[] => {
    if (!isMobile || segments.length <= 3) {
      return segments;
    }
    return [
      segments[0],
      { name: "...", isEllipsis: true },
      ...segments.slice(-2),
    ];
  }, [segments, isMobile]);

  if (displaySegments.length === 0) {
    return null;
  }

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {displaySegments.map((segment, index) => {
          const isLast = index === displaySegments.length - 1;
          const key = `${segment.name}-${index}`;

          return (
            <li key={key} className={styles.breadcrumbItem}>
              {segment.isEllipsis ? (
                <span className={styles.breadcrumbEllipsis}>...</span>
              ) : isLast ? (
                <span className={styles.breadcrumbCurrent} aria-current="page">
                  {segment.name}
                </span>
              ) : segment.href ? (
                <Link href={segment.href} className={styles.breadcrumbLink}>
                  {segment.name}
                </Link>
              ) : (
                <span className={styles.breadcrumbCurrent}>{segment.name}</span>
              )}
              {!isLast && (
                <span className={styles.breadcrumbSeparator} aria-hidden="true">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
