"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useCloseOnClickAway } from "@/utils/useOnClickAway";
import { client } from "@/sanity/lib/client";
import { useDebounceValue } from "usehooks-ts";
import { Post } from "@/app/page";
import Link from "next/link";
import { handleEnterKeyDown } from "@/utils/handleKeyDown";
import Button from "./Button";
import { Tool } from "./AsideToolsList";

export default function SearchInput() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isArticleSearch, setIsArticleSearch] = useState(true);
  const searchContainerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [statusMessage, setStatusMessage] = useState(
    "No results for your search..."
  );
  const [debouncedQuery, setDebouncedQuery] = useDebounceValue(query, 1000);

  const resetSearch = (shouldOpenSearch: boolean) => {
    setQuery("");
    setResults([]);
    setIsSearchOpen(shouldOpenSearch);
  };

  const handleSearchOpen = () => resetSearch(true);
  const handleSearchClose = () => resetSearch(false);

  const handleSearchType = () => {
    setDebouncedQuery("");
    setQuery("");
    setResults([]);
    setIsArticleSearch(!isArticleSearch);
  };

  const handleEscapeKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      resetSearch(false);
    }
  };

  useEffect(() => {
    if (isSearchOpen) {
      document.addEventListener("keydown", handleEscapeKeyPress);
    } else {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [isSearchOpen]);

  useCloseOnClickAway(searchContainerRef, handleSearchClose);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 3) {
        setStatusMessage("No results for your search...");
        setResults([]);
        return;
      }

      setStatusMessage("Loading...");
      try {
        let fetchedResults;

        if (isArticleSearch) {
          const POSTS_QUERY = `*[
            _type == "post" && defined(slug.current) && title match "${debouncedQuery}*"
          ]{_id, title, slug}[0...10]`;
          fetchedResults = await client.fetch(POSTS_QUERY);
        } else {
          const response = await fetch(
            `/api/tools?name=${encodeURIComponent(debouncedQuery)}`
          );
          fetchedResults = await response.json();
        }

        if (fetchedResults && fetchedResults.length > 0) {
          setResults(fetchedResults);
        } else {
          setStatusMessage("No results for your search.");
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        setStatusMessage("Error fetching results.");
        setResults([]);
      }
    };
    if (query.length >= 3) {
      fetchResults();
    } else {
      setStatusMessage("No results for your search...");
      setResults([]);
    } //eslint-disable-next-line
  }, [debouncedQuery, isArticleSearch]);

  useEffect(() => {
    if (query.length === 0 || query.length <= 2) {
      setStatusMessage("No results for your search...");
      setResults([]);
    } else {
      setStatusMessage("Loading...");
      setResults([]);
    }
  }, [query]);

  return (
    <div className="search">
      <Search
        className="search__icon"
        onClick={handleSearchOpen}
        onKeyDown={(e) => handleEnterKeyDown(e, handleSearchOpen)}
        tabIndex={0}
      />
      {isSearchOpen && (
        <div className="search__background">
          <div className="search__container" ref={searchContainerRef}>
            {isArticleSearch ? (
              <input
                type="search"
                placeholder="Search articles..."
                className="search__input"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            ) : (
              <input
                type="search"
                placeholder="Search tools..."
                className="search__input"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            )}
            <Search className="search__input-icon" />
            <div className="search__type">
              <span>Search for :</span>
              <Button onClick={handleSearchType}>
                {isArticleSearch ? "Articles" : "Tools"}
              </Button>
            </div>
            <div className="search__results-list">
              {results.length > 0 ? (
                isArticleSearch ? (
                  results.map((post: Post) => {
                    return (
                      <Link
                        href={`/blog/posts/${post?.slug?.current}`}
                        onClick={() => setIsSearchOpen(false)}
                        key={post._id}
                        className="search__result"
                      >
                        {post.title}
                      </Link>
                    );
                  })
                ) : (
                  results.map((tool: Tool) => {
                    return (
                      <Link
                        href={tool.url}
                        onClick={() => setIsSearchOpen(false)}
                        key={tool.name}
                        className="search__result"
                      >
                        {tool.name}
                      </Link>
                    );
                  })
                )
              ) : (
                <span className="search__message">{statusMessage}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
