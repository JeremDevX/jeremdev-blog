"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import Fuse, { type FuseResult } from "fuse.js";
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
  const [results, setResults] = useState<FuseResult<SearchIndexEntry>[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const searchIndexRef = useRef<SearchIndexEntry[] | null>(null);
  const fuseRef = useRef<Fuse<SearchIndexEntry> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
      setHasError(false);
    }
  }, [isOpen]);

  // Load search index on first open
  useEffect(() => {
    if (!isOpen || searchIndexRef.current) return;

    setIsLoading(true);
    setHasError(false);
    fetch("/search-index.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
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
        setHasError(true);
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

  // Handle escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeOverlay();
        return;
      }

      // Focus trap: keep Tab within the overlay
      if (e.key === "Tab" && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
          'input, button, [tabindex]:not([tabindex="-1"])',
        );
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl?.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl?.focus();
          }
        }
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
    text.length > max ? text.slice(0, max) + "\u2026" : text;

  const isMac =
    typeof navigator !== "undefined" && navigator.platform?.includes("Mac");

  const activeDescendantId =
    results.length > 0 ? `search-result-${selectedIndex}` : undefined;

  return (
    <div className={styles.search}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(true)}
        aria-label="Search"
        type="button"
      >
        <Search className={styles.triggerIcon} />
        <span className={styles.shortcutHint}>
          {isMac ? "\u2318K" : "Ctrl+K"}
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
          <div className={styles.container} ref={containerRef}>
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
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="search-results-listbox"
                aria-activedescendant={activeDescendantId}
              />
            </div>

            <div
              className={styles.resultsList}
              role="listbox"
              id="search-results-listbox"
            >
              {isLoading && (
                <p className={styles.message}>Loading search...</p>
              )}

              {hasError && (
                <p className={styles.message}>
                  Search is temporarily unavailable. Please try again later.
                </p>
              )}

              {!isLoading &&
                !hasError &&
                debouncedQuery.length >= 3 &&
                results.length === 0 && (
                  <p className={styles.message}>
                    No results for &ldquo;{debouncedQuery}&rdquo; — try a
                    different search!
                  </p>
                )}

              {!isLoading &&
                !hasError &&
                debouncedQuery.length < 3 &&
                query.length > 0 && (
                  <p className={styles.message}>
                    Type at least 3 characters to search...
                  </p>
                )}

              {results.map((result, index) => (
                <button
                  key={result.item.slug}
                  id={`search-result-${index}`}
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
