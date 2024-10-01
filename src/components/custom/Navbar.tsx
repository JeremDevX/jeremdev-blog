"use client";

import { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useCloseOnClickAway } from "@/utils/useOnClickAway";

export default function Navbar() {
  const [toggleInput, setToggleInput] = useState(true);
  const searchRef = useRef(null);

  const handleClick = () => {
    setToggleInput(true);
  };

  const handleClickOutside = () => {
    setToggleInput(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setToggleInput(false);
    }
  };

  useCloseOnClickAway(searchRef, handleClickOutside);

  return (
    <nav className="flex justify-center items-center bg-accent fixed top-0 left-0 right-0 h-16">
      <div className="flex justify-end items-center max-w-1440 w-full px-8 relative gap-8">
        <div className="absolute left-8">JeremDevLogo</div>
        <div className="flex flex-row gap-8">
          <p>Items</p>
          <p>Items</p>
          <p>Items</p>
        </div>
        <div className="flex items-center w-auto h-auto relative">
          <Search
            className={`${toggleInput ? "absolute" : ""} z-10 left-1 cursor-pointer`}
            // onClick={handleClick}
          />
          {toggleInput && (
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-10 bg-background focus:ring-2 focus:ring-primary"
              autoFocus
              // ref={searchRef}
              // onKeyDown={(event) => handleKeyDown(event)}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
