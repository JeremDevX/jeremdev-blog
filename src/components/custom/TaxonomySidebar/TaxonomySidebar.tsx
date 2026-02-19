"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Wrench } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { taxonomyTree } from "@/lib/taxonomy";
import type { ArticleMeta } from "@/types/content";
import type { ToolMeta } from "@/types/tools";
import {
  buildTaxonomyPath,
  buildSidebarTree,
  getDefaultOpenItems,
  hasContent,
  normalizePathname,
  type SidebarBranch,
  type SidebarItem,
} from "./sidebar-utils";
import styles from "./TaxonomySidebar.module.scss";

const SIDEBAR_FOCUS_HEADING_KEY = "thx-focus-main-heading";

interface TaxonomySidebarProps {
  articles: ArticleMeta[];
  tools: ToolMeta[];
  mode?: "desktop" | "mobile";
  onItemNavigate?: () => void;
}

function mergeOpenItems(previousOpenItems: string[], routeOpenItems: string[]): string[] {
  const mergedOpenItems = new Set(previousOpenItems);
  for (const routeItem of routeOpenItems) {
    mergedOpenItems.add(routeItem);
  }
  return [...mergedOpenItems];
}

function TopicBranch({
  branch,
  pathname,
  parentPath,
  onItemNavigate,
}: {
  branch: SidebarBranch;
  pathname: string;
  parentPath: string[];
  onItemNavigate?: () => void;
}) {
  const currentPath = buildTaxonomyPath(parentPath, branch.node.slug);
  const childrenWithContent = branch.children.filter(hasContent);
  const hasNestedContent =
    childrenWithContent.length > 0 || branch.items.length > 0;

  if (!hasNestedContent) return null;

  return (
    <AccordionItem value={currentPath} className={styles.topicItem}>
      <AccordionTrigger className={styles.topicTrigger}>
        {branch.node.name}
      </AccordionTrigger>
      <AccordionContent className={styles.topicContent}>
        {childrenWithContent.map((child) => {
          const childPath = buildTaxonomyPath(
            [...parentPath, branch.node.slug],
            child.node.slug,
          );
          const childHasSubBranches = child.children.some(hasContent);

          if (childHasSubBranches) {
            return (
              <TopicBranch
                key={childPath}
                branch={child}
                pathname={pathname}
                parentPath={[...parentPath, branch.node.slug]}
                onItemNavigate={onItemNavigate}
              />
            );
          }

          return (
            <div key={childPath} className={styles.subtopicGroup}>
              {child.node.name !== branch.node.name && (
                <span className={styles.subtopicLabel}>{child.node.name}</span>
              )}
              <ItemList
                items={child.items}
                pathname={pathname}
                onItemNavigate={onItemNavigate}
              />
            </div>
          );
        })}
        {branch.items.length > 0 && (
          <ItemList
            items={branch.items}
            pathname={pathname}
            onItemNavigate={onItemNavigate}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

function ItemList({
  items,
  pathname,
  onItemNavigate,
}: {
  items: SidebarItem[];
  pathname: string;
  onItemNavigate?: () => void;
}) {
  if (items.length === 0) return null;
  const normalizedPathname = normalizePathname(pathname);

  return (
    <ul className={styles.itemList}>
      {items.map((item) => {
        const isActive =
          normalizedPathname === normalizePathname(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`${styles.itemLink} ${item.type === "tool" ? styles.toolLink : ""} ${isActive ? styles.activeLink : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.sessionStorage.setItem(SIDEBAR_FOCUS_HEADING_KEY, "1");
                }
                onItemNavigate?.();
              }}
            >
              {item.type === "tool" && (
                <Wrench className={styles.wrenchIcon} aria-hidden="true" />
              )}
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SectionAccordion({
  branches,
  pathname,
  openItems,
  onOpenItemsChange,
  onItemNavigate,
}: {
  branches: SidebarBranch[];
  pathname: string;
  openItems: string[];
  onOpenItemsChange: (nextOpenItems: string[]) => void;
  onItemNavigate?: () => void;
}) {
  return (
    <Accordion type="multiple" value={openItems} onValueChange={onOpenItemsChange}>
      {branches.map((bigTopic) => (
        <div key={bigTopic.node.slug}>
          <AccordionItem
            value={bigTopic.node.slug}
            className={styles.bigTopicItem}
          >
            <AccordionTrigger className={styles.bigTopicTrigger}>
              <div
                className={styles.bigTopicColorDot}
                style={
                  bigTopic.node.color
                    ? ({
                        backgroundColor: bigTopic.node.color,
                      } as React.CSSProperties)
                    : undefined
                }
                aria-hidden="true"
              />
              <span
                className={styles.bigTopicName}
                style={
                  bigTopic.node.color
                    ? ({
                        "--topic-color": bigTopic.node.color,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                {bigTopic.node.name}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {bigTopic.children.filter(hasContent).map((topic) => (
                <TopicBranch
                  key={buildTaxonomyPath(
                    [bigTopic.node.slug],
                    topic.node.slug,
                  )}
                  branch={topic}
                  pathname={pathname}
                  parentPath={[bigTopic.node.slug]}
                  onItemNavigate={onItemNavigate}
                />
              ))}
              {bigTopic.items.length > 0 && (
                <ItemList
                  items={bigTopic.items}
                  pathname={pathname}
                  onItemNavigate={onItemNavigate}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        </div>
      ))}
    </Accordion>
  );
}

export default function TaxonomySidebar({
  articles,
  tools,
  mode = "desktop",
  onItemNavigate,
}: TaxonomySidebarProps) {
  const pathname = usePathname();

  const articleRouteOpenItems = useMemo(
    () => getDefaultOpenItems(pathname, articles, []),
    [pathname, articles],
  );

  const toolRouteOpenItems = useMemo(
    () => getDefaultOpenItems(pathname, [], tools),
    [pathname, tools],
  );

  const [articleOpenItems, setArticleOpenItems] = useState<string[]>(articleRouteOpenItems);
  const [toolOpenItems, setToolOpenItems] = useState<string[]>(toolRouteOpenItems);

  useEffect(() => {
    setArticleOpenItems((previousOpenItems) =>
      mergeOpenItems(previousOpenItems, articleRouteOpenItems),
    );
  }, [articleRouteOpenItems]);

  useEffect(() => {
    setToolOpenItems((previousOpenItems) =>
      mergeOpenItems(previousOpenItems, toolRouteOpenItems),
    );
  }, [toolRouteOpenItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(SIDEBAR_FOCUS_HEADING_KEY) !== "1") return;

    let isCancelled = false;
    let attemptCount = 0;
    const MAX_FOCUS_ATTEMPTS = 12;

    const scheduleNextAttempt = (callback: () => void) => {
      if (typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(callback);
        return;
      }

      window.setTimeout(callback, 16);
    };

    const focusHeadingTarget = () => {
      if (isCancelled) return;

      const headingTarget = document.querySelector<HTMLElement>(
        "#main-content h1, main h1, article h1",
      );

      if (headingTarget) {
        if (!headingTarget.hasAttribute("tabindex")) {
          headingTarget.setAttribute("tabindex", "-1");
        }

        headingTarget.focus();
        window.sessionStorage.removeItem(SIDEBAR_FOCUS_HEADING_KEY);
        return;
      }

      attemptCount += 1;
      if (attemptCount < MAX_FOCUS_ATTEMPTS) {
        scheduleNextAttempt(focusHeadingTarget);
        return;
      }

      window.sessionStorage.removeItem(SIDEBAR_FOCUS_HEADING_KEY);
    };

    scheduleNextAttempt(focusHeadingTarget);

    return () => {
      isCancelled = true;
    };
  }, [pathname]);

  const articleTree = useMemo(
    () => buildSidebarTree(taxonomyTree, articles, []),
    [articles],
  );

  const toolsTree = useMemo(
    () => buildSidebarTree(taxonomyTree, [], tools),
    [tools],
  );

  const articleBranchesWithContent = articleTree.filter(hasContent);
  const toolBranchesWithContent = toolsTree.filter(hasContent);
  const isMobileMode = mode === "mobile";

  return (
    <nav
      className={`${styles.sidebar} ${isMobileMode ? styles.sidebarMobile : ""}`}
      aria-label="Taxonomy navigation"
    >
      <div className={styles.contentSections}>
        {articleBranchesWithContent.length > 0 && (
          <section className={styles.contentSection} aria-label="Article taxonomy">
            <h2 className={styles.contentSectionTitle}>Articles</h2>
            <SectionAccordion
              branches={articleBranchesWithContent}
              pathname={pathname}
              openItems={articleOpenItems}
              onOpenItemsChange={setArticleOpenItems}
              onItemNavigate={onItemNavigate}
            />
          </section>
        )}

        {toolBranchesWithContent.length > 0 && (
          <section className={styles.contentSection} aria-label="Tools taxonomy">
            <h2 className={styles.contentSectionTitle}>Tools</h2>
            <SectionAccordion
              branches={toolBranchesWithContent}
              pathname={pathname}
              openItems={toolOpenItems}
              onOpenItemsChange={setToolOpenItems}
              onItemNavigate={onItemNavigate}
            />
          </section>
        )}
      </div>
    </nav>
  );
}
