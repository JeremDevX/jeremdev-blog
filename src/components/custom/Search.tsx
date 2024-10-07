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
  const [toggleInput, setToggleInput] = useState(false);
  const searchRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [posts, setPosts] = useState([]);
  const [debounceValue, setDebounceValue] = useDebounceValue(searchValue, 1000);

  const handleOpenSearch = () => {
    setToggleInput(true);
    setSearchValue("");
    setPosts([]);
  };

  const handleClickOutside = () => {
    setSearchValue("");
    setPosts([]);
    setToggleInput(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setSearchValue("");
      setPosts([]);
      setToggleInput(false);
    }
  };

  useCloseOnClickAway(searchRef, handleClickOutside);

  useEffect(() => {
    if (searchValue.length > 2) {
      const fetchArticles = async () => {
        const POSTS_QUERY = `*[
                _type == "post" && defined(slug.current) && title match "${debounceValue}*"
                ]
                {_id, title, slug,}`;

        const fetchedPosts = await client.fetch(POSTS_QUERY);
        setPosts(fetchedPosts);
      };
      fetchArticles();
    }
  }, [debounceValue]);

  useEffect(() => {
    if (searchValue === "") {
      setPosts([]);
    }
  }, [searchValue]);

  return (
    <div className="relative">
      <Search className={`cursor-pointer`} onClick={handleOpenSearch} />
      {toggleInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50">
          <div
            className="fixed p-4 h-96 w-11/12  md:w-3/4 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center bg-background ring-muted ring-2 rounded-lg max-w-1000 overflow-y-auto"
            ref={searchRef}
          >
            <Input
              type="search"
              placeholder="Search articles..."
              className="text-center bg-background focus:ring-2 focus:ring-primary w-full h-12 mb-2"
              autoFocus
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(event) => handleKeyDown(event)}
            />
            {posts.length > 0 ? (
              posts.map((post: Post) => {
                return (
                  <Link
                    href={`/posts/${post?.slug?.current}`}
                    onClick={() => setToggleInput(false)}
                    key={post._id}
                    className="p-2 bg-accent mt-2 mb-2 w-full h-auto text-left md:text-center rounded-lg hover:bg-primary hover:text-primary-foreground"
                  >
                    {post.title}
                  </Link>
                );
              })
            ) : (
              <span>No result for you research...</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
