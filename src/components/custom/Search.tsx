"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
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

  const handleEscapeKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      resetSearch(false);
    }
  };

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
    <div className="relative">
      <Search
        className="cursor-pointer outline-none"
        onClick={handleSearchOpen}
        onKeyDown={(e) => handleEnterKeyDown(e, handleSearchOpen)}
        tabIndex={0}
      />
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10">
          <div
            className={`fixed p-4 h-96 w-11/12 md:w-4/12 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center bg-background ring-muted ring-2 rounded-lg max-w-1000 overflow-y-auto`}
            ref={searchContainerRef}
          >
            {isArticleSearch ? (
              <Input
                type="search"
                placeholder="Search articles..."
                className="text-left indent-8 text-lg bg-background focus:ring-2 focus:ring-primary w-full h-12 mb-2 placeholder:opacity-40 relative"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleEscapeKeyPress}
              />
            ) : (
              <Input
                type="search"
                placeholder="Search tools..."
                className="text-left indent-8 text-lg bg-background focus:ring-2 focus:ring-primary w-full h-12 mb-2 placeholder:opacity-40 relative"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleEscapeKeyPress}
              />
            )}
            <Search className="absolute left-6 top-6" />
            <div>
              <span className="mr-2">Search for :</span>
              <Button
                text={isArticleSearch ? "Articles" : "Tools"}
                className="mt-2"
                onClick={handleSearchType}
              />
            </div>
            <div className="flex flex-col w-full overflow-auto mt-4">
              {results.length > 0 ? (
                isArticleSearch ? (
                  results.map((post: Post) => {
                    return (
                      <Link
                        href={`/blog/posts/${post?.slug?.current}`}
                        onClick={() => setIsSearchOpen(false)}
                        key={post._id}
                        className="p-2 bg-secondary mt-2 mb-2 w-full h-auto text-left md:text-center rounded-lg hover:bg-primary hover:text-primary-foreground"
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
                        className="p-2 bg-secondary mt-2 mb-2 w-full h-auto text-left md:text-center rounded-lg hover:bg-primary hover:text-primary-foreground"
                      >
                        {tool.name}
                      </Link>
                    );
                  })
                )
              ) : (
                <span className="h-full flex mt-8 justify-center">
                  {statusMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
