"use client";

import { useState } from "react";
import { ListTree } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ArticleMeta } from "@/types/content";
import type { ToolMeta } from "@/types/tools";
import TaxonomySidebar from "./TaxonomySidebar";
import styles from "./TaxonomySidebarMobile.module.scss";

interface TaxonomySidebarMobileProps {
  articles: ArticleMeta[];
  tools: ToolMeta[];
}

export default function TaxonomySidebarMobile({
  articles,
  tools,
}: TaxonomySidebarMobileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.mobileOnly}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(true)}
        aria-label="Open topics navigation"
      >
        <ListTree className={styles.triggerIcon} aria-hidden="true" />
        Topics
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className={styles.sheetContent}>
          <SheetHeader className={styles.sheetHeader}>
            <SheetTitle className={styles.sheetTitle}>Topics</SheetTitle>
          </SheetHeader>
          <TaxonomySidebar articles={articles} tools={tools} mode="mobile" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
