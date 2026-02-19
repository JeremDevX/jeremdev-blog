"use client";

import { useRef, useState } from "react";
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
  const drawerId = "taxonomy-sidebar-mobile-drawer";
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const skipCloseFocusRestoreRef = useRef(false);

  const focusFirstDrawerControl = () => {
    const focusScope = contentRef.current ?? document;
    const firstControl = focusScope.querySelector<HTMLElement>(
      "[data-focus-scope='taxonomy-sidebar'] a[href], [data-focus-scope='taxonomy-sidebar'] button:not([disabled]), [data-focus-scope='taxonomy-sidebar'] [tabindex]:not([tabindex='-1'])",
    );

    firstControl?.focus();
  };

  return (
    <div className={styles.mobileOnly}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(true)}
        aria-label="Open topics navigation"
        aria-expanded={isOpen}
        aria-controls={drawerId}
        aria-haspopup="dialog"
      >
        <ListTree className={styles.triggerIcon} aria-hidden="true" />
        Topics
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          ref={contentRef}
          side="left"
          className={styles.sheetContent}
          id={drawerId}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            focusFirstDrawerControl();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();

            if (skipCloseFocusRestoreRef.current) {
              skipCloseFocusRestoreRef.current = false;
              return;
            }

            triggerRef.current?.focus();
          }}
        >
          <SheetHeader className={styles.sheetHeader}>
            <SheetTitle className={styles.sheetTitle}>Topics</SheetTitle>
          </SheetHeader>
          <div data-focus-scope="taxonomy-sidebar">
            <TaxonomySidebar
              articles={articles}
              tools={tools}
              mode="mobile"
              onItemNavigate={() => {
                skipCloseFocusRestoreRef.current = true;
                setIsOpen(false);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
