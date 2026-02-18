"use client";

import { useMemo } from "react";
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
  type SidebarBranch,
  type SidebarItem,
} from "./sidebar-utils";
import styles from "./TaxonomySidebar.module.scss";

interface TaxonomySidebarProps {
  articles: ArticleMeta[];
  tools: ToolMeta[];
}

function TopicBranch({
  branch,
  pathname,
  parentPath,
}: {
  branch: SidebarBranch;
  pathname: string;
  parentPath: string[];
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
              <Accordion
                key={childPath}
                type="multiple"
                defaultValue={[childPath]}
              >
                <TopicBranch
                  branch={child}
                  pathname={pathname}
                  parentPath={[...parentPath, branch.node.slug]}
                />
              </Accordion>
            );
          }

          // Leaf node with items - render items directly under a label
          return (
            <div key={childPath} className={styles.subtopicGroup}>
              {child.node.name !== branch.node.name && (
                <span className={styles.subtopicLabel}>{child.node.name}</span>
              )}
              <ItemList items={child.items} pathname={pathname} />
            </div>
          );
        })}
        {branch.items.length > 0 && (
          <ItemList items={branch.items} pathname={pathname} />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

function ItemList({
  items,
  pathname,
}: {
  items: SidebarItem[];
  pathname: string;
}) {
  if (items.length === 0) return null;

  return (
    <ul className={styles.itemList}>
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`${styles.itemLink} ${item.type === "tool" ? styles.toolLink : ""} ${isActive ? styles.activeLink : ""}`}
              aria-current={isActive ? "page" : undefined}
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

export default function TaxonomySidebar({
  articles,
  tools,
}: TaxonomySidebarProps) {
  const pathname = usePathname();
  const defaultOpenItems = getDefaultOpenItems(pathname, articles, tools);
  const tree = useMemo(
    () => buildSidebarTree(taxonomyTree, articles, tools),
    [articles, tools],
  );
  const branchesWithContent = tree.filter(hasContent);

  return (
    <nav className={styles.sidebar} aria-label="Taxonomy navigation">
      <Accordion type="multiple" defaultValue={defaultOpenItems} key={pathname}>
        {branchesWithContent.map((bigTopic, index) => (
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
                <Accordion type="multiple" defaultValue={defaultOpenItems}>
                  {bigTopic.children.filter(hasContent).map((topic) => (
                    <TopicBranch
                      key={buildTaxonomyPath(
                        [bigTopic.node.slug],
                        topic.node.slug,
                      )}
                      branch={topic}
                      pathname={pathname}
                      parentPath={[bigTopic.node.slug]}
                    />
                  ))}
                </Accordion>
                {bigTopic.items.length > 0 && (
                  <ItemList items={bigTopic.items} pathname={pathname} />
                )}
              </AccordionContent>
            </AccordionItem>
          </div>
        ))}
      </Accordion>
    </nav>
  );
}
