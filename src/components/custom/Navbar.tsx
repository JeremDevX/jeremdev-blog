"use client";

import Link from "next/link";
import SearchInput from "./Search";
import { useState } from "react";

export default function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);

  const hamburgerLine = `h-0.5 w-6 my-1 bg-foreground transition ease transform duration-300`;

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  return (
    <nav className="flex justify-center items-center bg-accent fixed top-0 left-0 right-0 h-16 z-10 border-b border-accent-darker">
      <div className="flex justify-end items-center max-w-1440 w-full px-8 relative gap-8 h-16">
        <Link
          href="/"
          className="absolute left-8 h-16 flex items-center w-logo"
        >
          JeremDevLogo
        </Link>
        <div className="hidden sm:flex flex-row gap-8">
          <Link href="/categories">Categories</Link>
          <Link href="/">About</Link>
          <SearchInput />
        </div>
        <div className="block sm:hidden -mr-4">
          <SearchInput />
        </div>
        <div
          className={`flex sm:hidden flex-col justify-center items-end cursor-pointer h-16`}
          onClick={handleToggleMenu}
        >
          <span
            className={`${hamburgerLine} ${
              toggleMenu && "rotate-45 translate-y-2.5"
            }`}
          ></span>
          <span
            className={`${hamburgerLine} ${toggleMenu && "opacity-0"}`}
          ></span>
          <span
            className={`${hamburgerLine} ${
              toggleMenu && "-rotate-45 -translate-y-2.5"
            }`}
          ></span>
        </div>
      </div>

      {toggleMenu && (
        <div className="fixed top-16 left-0 right-0 bottom-0 bg-background animate-fade animate-duration-300">
          <div
            className={`flex flex-col w-full p-4 justify-center items-center gap-4 ${toggleMenu && "animate-fade-down"}`}
          >
            <Link
              href="/categories"
              className="border-b w-1/2 text-left pb-2"
              onClick={handleToggleMenu}
            >
              Categories
            </Link>
            <Link
              href="/"
              className="border-b w-1/2 text-left  pb-2"
              onClick={handleToggleMenu}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
