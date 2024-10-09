"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useCloseOnClickAway } from "@/utils/useOnClickAway";
import { client } from "@/sanity/lib/client";
import { useDebounceValue } from "usehooks-ts";
import { Post } from "@/app/page";
import Link from "next/link";

export default function SearchInput() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [statusMessage, setStatusMessage] = useState(
    "No results for your search..."
  );
  const [debouncedQuery] = useDebounceValue(query, 1000);

  const resetSearch = (shouldOpenSearch: boolean) => {
    setQuery("");
    setResults([]);
    setIsSearchOpen(shouldOpenSearch);
  };

  const handleSearchOpen = () => resetSearch(true);

  const handleSearchClose = () => resetSearch(false);

  const handleEscapeKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      resetSearch(false);
    }
  };

  useCloseOnClickAway(searchContainerRef, handleSearchClose);

  useEffect(() => {
    const fetchPosts = async () => {
      if (debouncedQuery.length > 2) {
        try {
          const POSTS_QUERY = `*[
            _type == "post" && defined(slug.current) && title match "${debouncedQuery}*"
          ]{_id, title, slug}[0...10]`;

          const fetchedResults = await client.fetch(POSTS_QUERY);

          if (fetchedResults.length > 0) {
            setResults(fetchedResults);
          } else {
            setStatusMessage("No results for your search.");
          }
        } catch (error) {
          setStatusMessage("Error fetching posts.");
          console.error(error);
        }
      }
    };

    fetchPosts();
  }, [debouncedQuery]);

  useEffect(() => {
    if (query.length === 0) {
      setStatusMessage("No results for your search...");
      setResults([]);
    } else if (query.length <= 2) {
      setStatusMessage("No results for your search...");
    } else {
      setStatusMessage("Loading...");
      setResults([]);
    }
  }, [query]);

  return (
    <div className="relative">
      <Search className="cursor-pointer" onClick={handleSearchOpen} />
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50">
          <div
            className="fixed p-4 h-96 w-11/12 md:w-3/4 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center bg-background ring-muted ring-2 rounded-lg max-w-1000 overflow-y-auto"
            ref={searchContainerRef}
          >
            <Input
              type="search"
              placeholder="Search articles..."
              className="text-center bg-background focus:ring-2 focus:ring-primary w-full h-12 mb-2"
              autoFocus
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleEscapeKeyPress}
            />
            {results.length > 0 ? (
              results.map((post: Post) => {
                return (
                  <Link
                    href={`/posts/${post?.slug?.current}`}
                    onClick={() => setIsSearchOpen(false)}
                    key={post._id}
                    className="p-2 bg-accent mt-2 mb-2 w-full h-auto text-left md:text-center rounded-lg hover:bg-primary hover:text-primary-foreground"
                  >
                    {post.title}
                  </Link>
                );
              })
            ) : (
              <span className="h-full flex items-center">{statusMessage}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
