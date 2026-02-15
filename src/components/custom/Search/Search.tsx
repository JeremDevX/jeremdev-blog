"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import Fuse, { type FuseResult } from "fuse.js";
import { handleEnterKeyDown } from "@/utils/handleKeyDown";
import styles from "./Search.module.scss";

interface SearchIndexEntry {
  title: string;
  slug: string;
  resume: string;
  category: string;
  type: "article" | "tool";
}

export default function SearchInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FuseResult<SearchIndexEntry>[]>(
    [],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const searchIndexRef = useRef<SearchIndexEntry[] | null>(null);
  const fuseRef = useRef<Fuse<SearchIndexEntry> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [debouncedQuery] = useDebounceValue(query, 300);

  // Global keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Load search index on first open
  useEffect(() => {
    if (!isOpen || searchIndexRef.current) return;

    setIsLoading(true);
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data: SearchIndexEntry[]) => {
        searchIndexRef.current = data;
        fuseRef.current = new Fuse(data, {
          keys: [
            { name: "title", weight: 2 },
            { name: "resume", weight: 1 },
            { name: "category", weight: 0.5 },
          ],
          threshold: 0.4,
          includeScore: true,
          minMatchCharLength: 3,
        });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [isOpen]);

  // Search when debounced query changes
  useEffect(() => {
    if (!fuseRef.current || debouncedQuery.length < 3) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const searchResults = fuseRef.current.search(debouncedQuery);
    setResults(searchResults);
    setSelectedIndex(0);
  }, [debouncedQuery]);

  const closeOverlay = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle escape key and click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeOverlay();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOverlay]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeOverlay();
    }
  };

  const navigateToResult = (slug: string) => {
    closeOverlay();
    router.push(slug);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1,
      );
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      navigateToResult(results[selectedIndex].item.slug);
    }
  };

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + "…" : text;

  const isMac =
    typeof navigator !== "undefined" && navigator.platform?.includes("Mac");

  return (
    <div className={styles.search}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => handleEnterKeyDown(e, () => setIsOpen(true))}
        aria-label="Search"
        type="button"
      >
        <Search className={styles.triggerIcon} />
        <span className={styles.shortcutHint}>
          {isMac ? "⌘K" : "Ctrl+K"}
        </span>
      </button>

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div className={styles.container} ref={overlayRef}>
            <div className={styles.inputWrapper}>
              <Search className={styles.inputIcon} />
              <input
                ref={inputRef}
                type="search"
                placeholder="Search articles and tools..."
                className={styles.input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                aria-label="Search query"
              />
            </div>

            <div className={styles.resultsList} role="listbox">
              {isLoading && (
                <p className={styles.message}>Loading search...</p>
              )}

              {!isLoading &&
                debouncedQuery.length >= 3 &&
                results.length === 0 && (
                  <p className={styles.message}>
                    No results for &ldquo;{debouncedQuery}&rdquo; — try a
                    different search!
                  </p>
                )}

              {!isLoading &&
                debouncedQuery.length < 3 &&
                query.length > 0 && (
                  <p className={styles.message}>
                    Type at least 3 characters to search...
                  </p>
                )}

              {results.map((result, index) => (
                <button
                  key={result.item.slug}
                  className={`${styles.resultRow} ${
                    index === selectedIndex ? styles.resultRowSelected : ""
                  }`}
                  onClick={() => navigateToResult(result.item.slug)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  role="option"
                  aria-selected={index === selectedIndex}
                  type="button"
                >
                  <span
                    className={`${styles.badge} ${
                      result.item.type === "tool"
                        ? styles.badgeTool
                        : styles.badgeArticle
                    }`}
                  >
                    {result.item.type === "tool" ? "Tool" : "Article"}
                  </span>
                  <div className={styles.resultContent}>
                    <span className={styles.resultTitle}>
                      {result.item.title}
                    </span>
                    <span className={styles.resultDescription}>
                      {truncate(result.item.resume, 80)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
